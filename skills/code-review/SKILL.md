---
name: code-review
description: Senior-level code review — bugs, security, performance, maintainability — in priority order
triggers: [review code, code review, check quality, review this, PR review, audit code]
---

# SKILL: Code Review

## Purpose
Catch real problems before they reach production. Reviews find bugs, security holes, and technical debt that automated tools miss.

**Priority order (always review in this sequence):**
```
1. CORRECTNESS    — Does it do what it claims?
2. SECURITY       — Can it be exploited?
3. ERROR HANDLING — What happens when it breaks?
4. PERFORMANCE    — N+1 queries, blocking, no pagination?
5. DESIGN         — Will this be maintainable in 6 months?
6. STYLE          — Automated tools handle this (lowest priority)
```

## Complete Review Checklist

### 1. Correctness
```
□ Code does what the PR description says
□ Edge cases handled: empty list, null, zero, negative, max value
□ Off-by-one errors checked in loops and array access
□ Conditions logically correct (trace with sample data)
□ Async operations properly awaited — no fire-and-forget
□ Race conditions identified in concurrent code
□ State mutations correct (immutable where needed)
□ Return values used or explicitly discarded
□ Error paths return correct values/types
□ Database queries return expected data shape
```

### 2. Security
```
□ No SQL built with f-strings, concatenation, or .format()
□ No shell commands built with user input (no shell=True with variables)
□ No eval() / exec() on any user-controlled content
□ Input validated at every system boundary (API, form, CLI)
□ Auth check on every protected endpoint
□ Authorization: user can only access THEIR data (not just "is logged in")
□ No secrets hardcoded (API keys, tokens, passwords)
□ No sensitive data in URLs (query params, path params)
□ No sensitive data in logs (PII, passwords, tokens)
□ File uploads validated: type + size + content (not just extension)
□ Redirect URLs validated against allowlist
□ CSRF protection on state-changing requests
□ Rate limiting on auth endpoints and AI calls
□ Error messages don't leak internal details to users
```

### 3. Error Handling
```
□ Specific exception types caught (not bare except / catch(e))
□ Errors logged with context (user_id, request_id, relevant data)
□ Resources cleaned up in error paths (DB connections, file handles, locks)
□ Async errors handled (unhandled promise rejections are silent failures)
□ Appropriate HTTP status codes returned
□ User-facing error messages are helpful, not technical
□ Retry logic with backoff where appropriate (network calls)
□ Timeouts set on all external calls
□ Circuit breaker pattern for unreliable dependencies
```

### 4. Performance
```
□ N+1 queries: no DB calls inside loops
□ List endpoints paginated (max 100 per page)
□ Heavy operations offloaded to background tasks
□ Indexes exist for all WHERE clause columns
□ No blocking I/O in async functions
□ Large datasets streamed, not loaded entirely into memory
□ Caching used for expensive repeated operations
□ Bundle size impact assessed (frontend)
□ Images optimized (WebP, compressed, lazy-loaded)
```

### 5. Design
```
□ Functions do ONE thing (< 40 lines)
□ No code duplication that should be abstracted
□ Dependencies injected (not hardcoded) — enables testing
□ Module boundaries respected (no circular imports)
□ Breaking changes documented in ARCHITECTURE_DECISIONS.md
□ Config/secrets from environment, not hardcoded
□ Feature flags for risky changes
```

## Language-Specific Patterns

### Python Critical Checks
```python
# ✗ BAD — swallows all errors including KeyboardInterrupt
try:
    do_thing()
except:
    pass

# ✗ BAD — SQL injection
db.execute(f"SELECT * FROM users WHERE id = {user_id}")

# ✗ BAD — blocking in async
async def handler():
    time.sleep(5)  # blocks entire event loop
    result = requests.get(url)  # sync HTTP in async

# ✗ BAD — missing type hints
def process(data, config):
    return data

# ✓ GOOD
async def process(data: list[dict], config: ProcessConfig) -> list[Result]:
    async with httpx.AsyncClient() as client:
        result = await client.get(url, timeout=10.0)
```

### TypeScript Critical Checks
```typescript
// ✗ BAD — bypasses type system
const data = response as any;
const result = (data as unknown as SpecificType).field;

// ✗ BAD — data fetching in useEffect (use server components)
useEffect(() => {
  fetch('/api/data').then(r => setData(r));
}, []);

// ✗ BAD — no input validation
export async function POST(req: Request) {
  const body = await req.json(); // trusting raw input
  await db.create(body); // direct to DB
}

// ✓ GOOD
export async function POST(req: Request) {
  const body = CreateUserSchema.parse(await req.json());
  const user = await getCurrentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  return await db.users.create({ data: body });
}
```

## Common Bug Patterns (memorize these)

```
1. Off-by-one: for(i=0; i<=arr.length; i++) → <=  should be  <
2. Wrong comparison: if(a = b) → assignment not comparison
3. Null reference: object.method() without null check
4. Missing await: result = asyncFunction() → forgot await
5. Stale closure: setTimeout uses variable from outer scope that changes
6. Mutating while iterating: removing items from list while looping
7. Integer overflow: multiplying large numbers without BigInt
8. Float precision: 0.1 + 0.2 !== 0.3 in financial calculations
9. Timezone: new Date() without timezone gives local time
10. Race condition: read-modify-write without lock/transaction
```

## Review Output Format
```markdown
## Code Review: [file/PR name]

### 🔴 Must Fix — blocks merge (bugs or security)
**[file.py:42]** SQL injection via f-string
Current: `db.execute(f"SELECT * FROM users WHERE id = {user_id}")`
Fix: `db.execute("SELECT * FROM users WHERE id = :id", {"id": user_id})`

### 🟡 Should Fix — important quality issues
**[service.py:88]** N+1 query — loads all comments per-post in loop
Fix: Add `.prefetch_related("comments")` to the queryset

### 🟢 Consider — nice to have
**[utils.py:15]** Function is 80 lines — consider splitting by concern

### ✅ Looks Good
- Auth and authorization checks thorough
- Error handling specific and informative
- Tests cover happy path + key error cases
```

## Quality checks
- [ ] Every 🔴 issue has a specific fix, not just identification
- [ ] Security section completed (not skipped because "it looks fine")
- [ ] File and line numbers cited for every finding
- [ ] Positive aspects acknowledged — not only problems
- [ ] Review covers all 5 priority areas
