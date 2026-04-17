# Security Rules

## Non-negotiable requirements
1. NEVER hardcode secrets, API keys, or passwords
2. NEVER commit .env files
3. ALWAYS parameterize database queries (no f-strings in SQL)
4. ALWAYS validate and sanitize user input
5. ALWAYS authenticate AND authorize on every protected endpoint
6. Run npx ecc-agentshield scan before every production deploy

## SQL injection prevention
```python
# GOOD — parameterized:
result = await db.execute(
    text("SELECT * FROM users WHERE email = :email"),
    {"email": email}
)
# BAD — never do this:
db.execute(f"SELECT * FROM users WHERE email = '{email}'")
```

## Rate limiting (required on all public endpoints)
- Login endpoints: 5/minute
- AI/LLM endpoints: 20/minute

## AI-specific security
- Never put raw user input directly into prompts
- Always set max_tokens on every LLM call
- Never log prompt content containing user PII
