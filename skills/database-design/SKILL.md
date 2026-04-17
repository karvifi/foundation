---
name: database-design
description: Production database schema design — normalization, indexes, migrations, query patterns
triggers: [database, schema, table, SQL, migration, model, ORM, PostgreSQL, MySQL, SQLite]
---

# SKILL: Database Design

## Purpose
Design schemas that are correct, performant, and safe to migrate — before data exists.
Retrofitting a bad schema after real data exists is 10x harder than getting it right the first time.

## Design Principles

### The Normalization Target: 3NF + Pragmatism
```
1NF: No repeating groups, atomic values, primary key
2NF: No partial dependencies (non-key columns depend on whole PK)
3NF: No transitive dependencies (non-key columns don't depend on other non-keys)

When to DENORMALIZE:
- Reporting queries that join 6+ tables on hot paths
- Read:write ratio > 100:1
- Only after profiling shows the join is the actual bottleneck
```

## Schema Design Patterns

### Universal Table Template
```sql
CREATE TABLE [entity_name_plural] (
    -- Identity
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Core data columns
    [column]    [TYPE] NOT NULL [DEFAULT] [CONSTRAINT],
    
    -- Soft delete (use instead of hard delete for most entities)
    deleted_at  TIMESTAMPTZ,
    
    -- Audit timestamps (mandatory)
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE TRIGGER update_[entity]_updated_at
    BEFORE UPDATE ON [entity_name_plural]
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Naming Conventions (enforce strictly)
```sql
Tables:        plural, snake_case     → users, order_items, api_keys
Columns:       snake_case             → created_at, user_id, is_active
Primary key:   always "id"            → id UUID
Foreign keys:  [table_singular]_id    → user_id, order_id
Booleans:      is_/has_/can_          → is_active, has_verified, can_edit
Timestamps:    _at suffix             → created_at, deleted_at, expires_at
Indexes:       idx_[table]_[columns]  → idx_users_email
Constraints:   [table]_[cols]_[type]  → users_email_unique
```

### Column Type Selection
```sql
-- IDs
UUID                     -- default for most IDs (globally unique, can generate client-side)
BIGSERIAL                -- for high-insert-rate tables where UUID indexing overhead matters

-- Text
TEXT                     -- default for all text (PostgreSQL has no performance difference vs VARCHAR)
VARCHAR(N)               -- only when you need DB-level length enforcement
CHAR(N)                  -- almost never (fixed-width padding is rarely needed)

-- Numbers
INTEGER                  -- for counts, small numbers
BIGINT                   -- for large counts (user IDs if using serial)
NUMERIC(precision,scale) -- for money (never FLOAT — floating point loses cents)
REAL / DOUBLE PRECISION  -- for scientific measurements where small errors are acceptable

-- Dates and Times
TIMESTAMPTZ              -- always store WITH timezone (store as UTC, display in user's TZ)
DATE                     -- when time doesn't matter (birthdays, deadlines)
INTERVAL                 -- for durations (don't calculate this in application code)

-- JSON
JSONB                    -- default for JSON (binary, indexed, queryable)
JSON                     -- only if you need to preserve whitespace/key order

-- Other
BOOLEAN                  -- true/false (not TINYINT(1))
BYTEA                    -- binary data (store files in S3, store reference here)
ARRAY                    -- PostgreSQL arrays (useful but hard to query — consider junction table)
```

## Index Strategy

### What MUST be indexed
```sql
-- 1. Every foreign key column (mandatory)
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);

-- 2. Every column used in WHERE on large tables
CREATE INDEX idx_users_email ON users(email);           -- login lookup
CREATE INDEX idx_users_status ON users(status);          -- filter by status

-- 3. Every column used in ORDER BY on large tables
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- 4. Unique constraints (creates index automatically)
CREATE UNIQUE INDEX idx_users_email_unique ON users(email);

-- 5. Composite indexes (order matters — most selective first, OR most frequently filtered)
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
-- This index can answer: WHERE user_id=? AND status=?
-- AND: WHERE user_id=?  (leftmost column)
-- But NOT: WHERE status=?  (not leftmost)
```

### Partial Indexes (powerful, often forgotten)
```sql
-- Index only active records (smaller, faster)
CREATE INDEX idx_users_active_email ON users(email) WHERE deleted_at IS NULL;

-- Index only unprocessed jobs
CREATE INDEX idx_jobs_pending ON jobs(created_at) WHERE status = 'pending';
```

### What NOT to index
```sql
-- ✗ Don't index columns with very low cardinality used alone
-- (boolean columns, status with 2-3 values — table scan is faster)

-- ✗ Don't index every column "just in case"
-- Each index costs: INSERT speed, storage, maintenance

-- ✗ Don't create index on (a, b) if you already have index on (a) alone
-- The composite index covers single-column queries too
```

## Relationship Patterns

### One-to-Many (most common)
```sql
-- Parent
CREATE TABLE users (id UUID PRIMARY KEY, ...);

-- Child with FK
CREATE TABLE posts (
    id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title   TEXT NOT NULL,
    ...
);
CREATE INDEX idx_posts_user_id ON posts(user_id);
```

### Many-to-Many (junction table)
```sql
CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, role_id)          -- composite PK prevents duplicates
);
-- PostgreSQL creates index on PK automatically
-- Add index on role_id for reverse lookup:
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);
```

### Self-Referential (trees/hierarchies)
```sql
CREATE TABLE categories (
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name      TEXT NOT NULL,
    path      TEXT,                         -- materialized path e.g. "/electronics/phones/ios"
    depth     INTEGER NOT NULL DEFAULT 0
);
-- For deep trees: use ltree extension in PostgreSQL
-- For frequent subtree queries: use nested sets pattern
```

## Migration Safety Rules

### Safe vs Dangerous DDL
```sql
-- ✅ SAFE (no lock or negligible lock)
CREATE INDEX CONCURRENTLY idx_name ON table(col);  -- CONCURRENTLY = no table lock
CREATE TABLE new_table (...);
ALTER TABLE ADD COLUMN nullable_col TEXT;           -- nullable with no default = safe
ALTER TABLE ADD COLUMN with_default TEXT DEFAULT 'value';  -- safe in Postgres 11+

-- ⚠️ CAREFUL (brief lock)
ALTER TABLE ADD COLUMN NOT NULL with default; -- safe in Postgres 11+ but verify

-- ❌ DANGEROUS (full table lock — do NOT run on large tables in production)
ALTER TABLE ADD COLUMN NOT NULL;              -- table lock until backfill complete
CREATE INDEX idx_name ON table(col);          -- use CONCURRENTLY instead
ALTER TABLE RENAME COLUMN old TO new;         -- requires app code change simultaneously
ALTER TABLE DROP COLUMN;                      -- irreversible — need backup first

-- Safe rename process:
-- Step 1: Add new_column (nullable)
-- Step 2: Deploy code that writes to BOTH old_column and new_column
-- Step 3: Backfill: UPDATE table SET new_column = old_column WHERE new_column IS NULL
-- Step 4: Add NOT NULL constraint to new_column
-- Step 5: Deploy code that reads from new_column, still writes to both
-- Step 6: Deploy code that only uses new_column
-- Step 7: Drop old_column
```

### Migration File Template
```python
# alembic migration template
"""Add user preferences table

Revision ID: abc123
"""
from alembic import op
import sqlalchemy as sa

def upgrade() -> None:
    op.create_table(
        "user_preferences",
        sa.Column("id", sa.UUID, primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("user_id", sa.UUID, nullable=False),
        sa.Column("preference_key", sa.Text, nullable=False),
        sa.Column("preference_value", sa.JSONB),
        sa.Column("created_at", sa.TIMESTAMPTZ, nullable=False, server_default=sa.text("NOW()")),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
    )
    # Add indexes in separate statements for clarity
    op.create_index("idx_user_preferences_user_id", "user_preferences", ["user_id"])
    op.create_unique_constraint(
        "user_preferences_user_key_unique",
        "user_preferences",
        ["user_id", "preference_key"]
    )

def downgrade() -> None:
    op.drop_table("user_preferences")
```

## Query Patterns

### Pagination (always, for every list)
```sql
-- Offset pagination (simple, supports jumping to page)
SELECT * FROM posts
ORDER BY created_at DESC
LIMIT 20 OFFSET 40;    -- page 3, 20 per page

-- Cursor pagination (more efficient for large datasets)
SELECT * FROM posts
WHERE created_at < :last_seen_created_at
   OR (created_at = :last_seen_created_at AND id < :last_seen_id)
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

### N+1 Prevention
```python
# ✗ BAD — N+1: 1 query for posts + N queries for users
posts = await db.execute(select(Post)).scalars().all()
for post in posts:
    user = await db.execute(select(User).where(User.id == post.user_id)).scalar()

# ✓ GOOD — single query with join
posts = await db.execute(
    select(Post).options(selectinload(Post.user))
).scalars().all()
```

### Full-Text Search
```sql
-- PostgreSQL built-in FTS (good for most use cases)
-- Add column:
ALTER TABLE posts ADD COLUMN search_vector TSVECTOR;

-- Update trigger:
CREATE TRIGGER posts_search_update
    BEFORE INSERT OR UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION
        tsvector_update_trigger(search_vector, "pg_catalog.english", title, body);

-- Index:
CREATE INDEX idx_posts_search ON posts USING GIN(search_vector);

-- Query:
SELECT * FROM posts WHERE search_vector @@ plainto_tsquery("english", :query);
```

## Output
- Schema SQL with all tables, constraints, indexes
- SQLAlchemy/Drizzle/Prisma models
- Migration files
- Query patterns for common operations
- Performance considerations documented

## Quality checks
- [ ] Every FK has an index
- [ ] Every table has id, created_at, updated_at
- [ ] Soft delete via deleted_at (not hard delete for main entities)
- [ ] Money stored as NUMERIC not FLOAT
- [ ] TIMESTAMPTZ not TIMESTAMP (timezone-aware)
- [ ] Index strategy documented (every index has a reason)
- [ ] Migration is reversible (has downgrade function)
- [ ] No dangerous DDL on large tables (use CONCURRENTLY)
