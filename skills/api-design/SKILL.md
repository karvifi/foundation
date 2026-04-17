---
name: api-design
description: Design REST APIs — resources, verbs, schemas, errors, pagination, auth, versioning
triggers: [API, endpoint, REST, route, HTTP, design API, backend API, OpenAPI]
---

# SKILL: API Design

## Design Before Code
APIs are contracts. Changing a contract after clients depend on it is painful.
Design thoroughly. Get sign-off. Then code.

## Resource & Operation Mapping

Resources are NOUNS. Operations are HTTP verbs.

```
Collection:    /api/v1/users
Single item:   /api/v1/users/{id}
Nested:        /api/v1/users/{userId}/orders (max 2 levels deep)
Action:        /api/v1/users/{id}/verify-email (acceptable for non-CRUD operations)

Operations:
GET     /resources          List (paginated, filterable, sortable)
POST    /resources          Create
GET     /resources/{id}     Get one
PUT     /resources/{id}     Replace entire resource
PATCH   /resources/{id}     Partial update
DELETE  /resources/{id}     Delete (or soft-delete)
```

## Request/Response Contract

### Standard Response Envelope

ALL responses use this format (no exceptions):
```json
// Success — single resource
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "Jane Doe",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "meta": {}
}

// Success — list
{
  "data": [
    { "id": "...", "name": "Item 1" },
    { "id": "...", "name": "Item 2" }
  ],
  "meta": {
    "total": 847,
    "page": 1,
    "perPage": 20,
    "totalPages": 43,
    "hasNext": true,
    "hasPrev": false
  }
}

// Error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request data is invalid",
    "details": [
      {
        "field": "email",
        "message": "Email address is required",
        "code": "REQUIRED"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters",
        "code": "MIN_LENGTH"
      }
    ],
    "requestId": "req_abc123xyz",
    "documentationUrl": "https://docs.api.com/errors/VALIDATION_ERROR"
  }
}
```

### Standard HTTP Status Codes

Use these and ONLY these:
```
2xx Success:
  200 OK              → GET (single or list), PUT, PATCH success
  201 Created         → POST success (include Location header pointing to new resource)
  204 No Content      → DELETE success (no response body)

4xx Client Error:
  400 Bad Request     → Malformed request syntax, invalid JSON
  401 Unauthorized    → Not authenticated (no/invalid token)
  403 Forbidden       → Authenticated but not authorized (wrong permissions)
  404 Not Found       → Resource doesn't exist (or hidden for security)
  409 Conflict        → Duplicate resource, optimistic locking failure
  410 Gone            → Resource permanently deleted
  422 Unprocessable   → Valid syntax but fails business validation
  429 Too Many        → Rate limit exceeded (include Retry-After header)

5xx Server Error:
  500 Internal Server Error → Unexpected server error (log it, don't expose details)
  502 Bad Gateway           → Upstream service failure
  503 Service Unavailable   → Maintenance or overload (include Retry-After)
```

### Error Code Catalog (define all upfront)
```python
class APIErrorCode(str, Enum):
    # Auth
    INVALID_CREDENTIALS = "INVALID_CREDENTIALS"
    TOKEN_EXPIRED = "TOKEN_EXPIRED"
    TOKEN_INVALID = "TOKEN_INVALID"
    INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS"
    
    # Validation
    VALIDATION_ERROR = "VALIDATION_ERROR"
    REQUIRED_FIELD = "REQUIRED_FIELD"
    INVALID_FORMAT = "INVALID_FORMAT"
    
    # Resources
    NOT_FOUND = "NOT_FOUND"
    ALREADY_EXISTS = "DUPLICATE_RESOURCE"
    
    # Limits
    RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED"
    QUOTA_EXCEEDED = "QUOTA_EXCEEDED"
    
    # Server
    INTERNAL_ERROR = "INTERNAL_ERROR"
    SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE"
```

## Pagination — Required for Every List

```
Query parameters:
  ?page=1          → 1-indexed page number
  ?perPage=20      → items per page (default: 20, max: 100)
  ?cursor=abc123   → cursor-based alternative (better for large datasets)
  
Sorting:
  ?sort=createdAt       → sort field
  ?order=desc           → asc | desc

Filtering:
  ?status=active
  ?createdAfter=2024-01-01
  ?q=search+term        → full-text search
  
Sparse fieldsets (performance):
  ?fields=id,name,email → return only these fields
```

Implementation (FastAPI):
```python
from fastapi import Query
from pydantic import BaseModel

class PaginationParams:
    def __init__(
        self,
        page: int = Query(1, ge=1, description="Page number"),
        per_page: int = Query(20, ge=1, le=100, description="Items per page")
    ):
        self.page = page
        self.per_page = per_page
        self.offset = (page - 1) * per_page

class PaginatedResponse(BaseModel, Generic[T]):
    data: list[T]
    meta: PaginationMeta

class PaginationMeta(BaseModel):
    total: int
    page: int
    per_page: int
    total_pages: int
    has_next: bool
    has_prev: bool

@app.get("/api/v1/users", response_model=PaginatedResponse[UserResponse])
async def list_users(
    pagination: PaginationParams = Depends(),
    status: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_auth)
) -> PaginatedResponse[UserResponse]:
    query = select(User).order_by(User.created_at.desc())
    
    if status:
        query = query.where(User.status == status)
    
    total = await db.scalar(select(func.count()).select_from(query.subquery()))
    users = await db.execute(query.offset(pagination.offset).limit(pagination.per_page))
    
    return PaginatedResponse(
        data=[UserResponse.model_validate(u) for u in users.scalars()],
        meta=PaginationMeta(
            total=total,
            page=pagination.page,
            per_page=pagination.per_page,
            total_pages=ceil(total / pagination.per_page),
            has_next=pagination.page * pagination.per_page < total,
            has_prev=pagination.page > 1
        )
    )
```

## Authentication & Authorization Pattern

```python
# Every protected endpoint:
@app.get("/api/v1/users/{user_id}/profile")
async def get_user_profile(
    user_id: UUID,
    current_user: User = Depends(require_auth),         # ← AUTHENTICATION
    db: AsyncSession = Depends(get_db)
):
    # AUTHORIZATION: user can only see their own profile (or admin can see all)
    if current_user.id != user_id and not current_user.is_admin:
        raise HTTPException(
            status_code=403,
            detail={"code": "INSUFFICIENT_PERMISSIONS", "message": "Access denied"}
        )
    
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail={"code": "NOT_FOUND"})
    
    return {"data": UserResponse.model_validate(user)}
```

## Rate Limiting

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/api/v1/auth/login")
@limiter.limit("5/minute")      # strict: auth endpoints
async def login(request: Request, ...): ...

@app.post("/api/v1/auth/register")
@limiter.limit("3/minute")      # prevent spam registrations
async def register(request: Request, ...): ...

@app.post("/api/v1/ai/chat")
@limiter.limit("20/minute")     # cost protection
async def ai_chat(request: Request, ...): ...

@app.get("/api/v1/users")
@limiter.limit("100/minute")    # normal read endpoints
async def list_users(request: Request, ...): ...
```

## API Versioning

```
Strategy: URL versioning (/api/v1/, /api/v2/)
  Pros: obvious, easy to route
  Cons: URL changes

Deprecation process:
  1. Release v2 endpoint
  2. Add Deprecation header to v1 responses: Deprecation: true
  3. Add Sunset header: Sunset: Sat, 31 Dec 2025 23:59:59 GMT
  4. Document migration guide
  5. Notify users 6 months before sunset
  6. Remove v1 after sunset date
```

## API Documentation (OpenAPI/Swagger)

FastAPI generates automatically — but enrich it:
```python
@app.post(
    "/api/v1/users",
    response_model=UserResponse,
    status_code=201,
    summary="Create a new user",
    description="""
    Creates a new user account with the provided email and password.
    
    The password is hashed with bcrypt before storage.
    A verification email is sent automatically.
    """,
    responses={
        201: {"description": "User created successfully"},
        400: {"description": "Invalid request data"},
        409: {"description": "Email address already registered"},
    },
    tags=["Users"]
)
async def create_user(
    user: CreateUserRequest,
    db: AsyncSession = Depends(get_db)
) -> UserResponse:
    """Create user — full docstring for Swagger"""
    ...
```

## Complete API Design Document Template

```markdown
# API Design: [Service Name]

## Base URL
Production: https://api.yourservice.com
Staging: https://api.staging.yourservice.com

## Authentication
Bearer token in Authorization header:
Authorization: Bearer eyJhbGc...

Token expiry: 24 hours
Refresh: POST /api/v1/auth/refresh

## Rate Limits
Default: 100 requests/minute per user
Auth endpoints: 5 requests/minute per IP
AI endpoints: 20 requests/minute per user

Rate limit headers in every response:
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1705312800

## Endpoints

### POST /api/v1/auth/register
Creates a new user account.

Request:
\`\`\`json
{
  "email": "user@example.com",
  "password": "SecureP@ss123",
  "name": "Jane Doe"
}
\`\`\`

Response 201:
\`\`\`json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Jane Doe",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
\`\`\`

Errors: 400 (validation), 409 (email taken)
```

## Quality checks
- [ ] All resources are nouns, operations are verbs
- [ ] Standard response envelope used everywhere
- [ ] ALL error codes defined in catalog
- [ ] Pagination on every list endpoint
- [ ] Auth + authorization on every protected endpoint
- [ ] Rate limiting configured per endpoint type
- [ ] API documentation complete (OpenAPI/Swagger)
- [ ] Versioning strategy defined
- [ ] Designed and reviewed BEFORE any implementation
