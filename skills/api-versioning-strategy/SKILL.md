---
name: api-versioning-strategy
description: API versioning patterns — URL versioning, header versioning, deprecation, breaking changes
triggers: [API versioning, API design, breaking changes, deprecation, backward compatibility]
---

# SKILL: API Versioning Strategy

## Versioning Approaches

### URL Versioning
```python
# v1
@app.get("/api/v1/users/{user_id}")
async def get_user_v1(user_id: int):
    return {"id": user_id, "name": "John"}

# v2 (with new field)
@app.get("/api/v2/users/{user_id}")
async def get_user_v2(user_id: int):
    return {"id": user_id, "name": "John", "email": "john@example.com"}
```

### Header Versioning
```python
@app.get("/api/users/{user_id}")
async def get_user(user_id: int, version: str = Header(default="1")):
    if version == "1":
        return {"id": user_id, "name": "John"}
    elif version == "2":
        return {"id": user_id, "name": "John", "email": "john@example.com"}
```

## Breaking Changes

```python
# ❌ Breaking change: Removed field
# v1: {"id": 1, "name": "John", "age": 30}
# v2: {"id": 1, "name": "John"}  # age removed

# ✅ Non-breaking: New optional field
# v1: {"id": 1, "name": "John"}
# v2: {"id": 1, "name": "John", "email": "john@example.com"}  # email added

# ✅ Non-breaking: Rename with alias
# v2: Support both "user_id" and "id"
@app.get("/api/v2/users")
async def list_users(user_id: int = None, id: int = None):
    # Accept both parameters
    final_id = user_id or id
```

## Deprecation Strategy

```python
@app.get("/api/v1/users/{user_id}")
async def get_user_v1(user_id: int, response: Response):
    # Add deprecation header
    response.headers["X-API-Deprecation"] = "true"
    response.headers["X-API-Sunset"] = "2024-12-31"
    response.headers["Link"] = "</api/v2/users>; rel='successor-version'"
    
    # Log deprecation usage
    log_deprecation("get_user_v1", user_id)
    
    return {"id": user_id, "name": "John"}
```

## Migration Guide

```python
# Provide migration guide in response
@app.get("/api/v1/users/{user_id}")
async def get_user_v1(user_id: int):
    return {
        "data": {"id": user_id, "name": "John"},
        "deprecation": {
            "message": "This endpoint is deprecated. Use /api/v2/users instead.",
            "sunset_date": "2024-12-31",
            "migration_guide": "https://docs.example.com/migration-v1-to-v2"
        }
    }
```

## Quality Checks
- [ ] Versioning strategy documented
- [ ] Breaking changes only in new versions
- [ ] Deprecation warnings added
- [ ] Sunset date communicated (6-12 months)
- [ ] Migration guide provided
- [ ] Old versions monitored (usage tracking)
- [ ] Automated compatibility tests
- [ ] Changelog maintained
