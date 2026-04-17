---
name: multi-tenancy-architecture
description: Multi-tenant SaaS patterns — tenant isolation, data partitioning, row-level security
triggers: [multi-tenancy, SaaS, tenant isolation, data partitioning, RLS, multi-tenant database]
---

# SKILL: Multi-Tenancy Architecture

## Isolation Strategies

### Pattern 1: Database Per Tenant
```
Pros: Maximum isolation, easy backup/restore, regulatory compliance
Cons: High overhead, complex migrations

tenant_1_db
tenant_2_db
tenant_3_db
```

```python
def get_tenant_db(tenant_id):
    return f"tenant_{tenant_id}_db"

# Route to tenant-specific database
conn = psycopg2.connect(dbname=get_tenant_db(tenant_id))
```

### Pattern 2: Schema Per Tenant
```
Pros: Good isolation, shared infrastructure
Cons: Schema proliferation, migration complexity

shared_db:
  - tenant_1_schema
  - tenant_2_schema
  - tenant_3_schema
```

```sql
-- Create schema per tenant
CREATE SCHEMA tenant_123;
CREATE TABLE tenant_123.users (...);

-- Set search path
SET search_path TO tenant_123;
SELECT * FROM users;  -- Automatically scoped to tenant
```

### Pattern 3: Shared Database with Tenant ID
```
Pros: Simplest, most cost-effective
Cons: Requires careful query filtering, risk of data leakage

users table:
| id | name  | tenant_id |
|----|-------|-----------|
| 1  | Alice | tenant_1  |
| 2  | Bob   | tenant_1  |
| 3  | Carol | tenant_2  |
```

```python
# ❌ DANGER: Missing tenant filter
users = db.query("SELECT * FROM users")  # Leaks all tenants!

# ✅ SAFE: Always filter by tenant
users = db.query("SELECT * FROM users WHERE tenant_id = ?", tenant_id)
```

## Row-Level Security (Postgres)

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their tenant's data
CREATE POLICY tenant_isolation ON users
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Set tenant context
SET app.current_tenant_id = 'tenant-123';

-- All queries automatically filtered
SELECT * FROM users;  -- Only returns tenant-123 data
```

## Tenant Context Middleware

```python
from fastapi import Request, Depends

async def get_tenant_id(request: Request) -> str:
    """Extract tenant from subdomain or header"""
    # From subdomain: tenant1.app.com
    host = request.headers.get("host")
    tenant_id = host.split(".")[0]
    
    # Or from header
    # tenant_id = request.headers.get("X-Tenant-ID")
    
    # Or from JWT
    # token = request.headers.get("Authorization")
    # tenant_id = decode_jwt(token)["tenant_id"]
    
    return tenant_id

async def set_tenant_context(tenant_id: str = Depends(get_tenant_id)):
    """Set tenant for all DB queries"""
    await db.execute(
        f"SET app.current_tenant_id = '{tenant_id}'"
    )

# Apply to all routes
@app.get("/users", dependencies=[Depends(set_tenant_context)])
async def get_users():
    # Automatically scoped to tenant
    return await db.fetch_all("SELECT * FROM users")
```

## Tenant-Specific Features

```python
# Feature flags per tenant
tenant_features = {
    "tenant_1": {"advanced_analytics": True, "api_access": True},
    "tenant_2": {"advanced_analytics": False, "api_access": True},
}

def has_feature(tenant_id: str, feature: str) -> bool:
    return tenant_features.get(tenant_id, {}).get(feature, False)

# Usage
if has_feature(tenant_id, "advanced_analytics"):
    return advanced_report()
else:
    return basic_report()
```

## Tenant Data Migration

```python
async def migrate_tenant(tenant_id: str):
    """Run migration for specific tenant"""
    if STRATEGY == "schema_per_tenant":
        await db.execute(f"SET search_path TO tenant_{tenant_id}")
    elif STRATEGY == "database_per_tenant":
        db = await connect(get_tenant_db(tenant_id))
    
    # Run migrations
    await db.execute("ALTER TABLE users ADD COLUMN phone VARCHAR(20)")
```

## Quality Checks
- [ ] Tenant isolation strategy documented
- [ ] All queries filter by tenant_id
- [ ] Row-level security enabled (if using shared DB)
- [ ] Tenant context middleware applied
- [ ] Cross-tenant queries blocked
- [ ] Tenant-specific backups configured
- [ ] Feature flags per tenant
- [ ] Audit logging includes tenant_id
