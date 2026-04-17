---
name: tdd-workflow
description: Enforce RED-GREEN-REFACTOR — write the failing test first, always, no exceptions
triggers: [implement, code, build feature, write, create function, add endpoint, TDD, test first]
---

# SKILL: TDD Workflow

## The Absolute Law
```
TEST FIRST. ALWAYS. WITHOUT EXCEPTION.
If there is no failing test before the code, the code doesn't exist.
If the test doesn't fail first, the test is wrong.
```

## The Complete RED-GREEN-REFACTOR Cycle

### RED Phase — Write a Failing Test

Before a single line of implementation code:

```python
# Python (pytest) — Write these FIRST
import pytest
from unittest.mock import AsyncMock, patch

class TestUserRegistration:
    
    async def test_register_returns_user_with_id_on_valid_input(self, db):
        """Happy path: valid email + password → returns User with generated UUID"""
        service = UserService(db=db)
        
        result = await service.register(
            email="test@example.com",
            password="SecureP@ss123"
        )
        
        assert result.id is not None
        assert str(result.id)  # is a valid UUID
        assert result.email == "test@example.com"
        assert result.created_at is not None
        # NEVER assert on hashed password directly
    
    async def test_register_hashes_password(self, db):
        """Security: password must never be stored in plain text"""
        service = UserService(db=db)
        
        result = await service.register(
            email="test@example.com",
            password="SecureP@ss123"
        )
        
        assert result.password_hash != "SecureP@ss123"
        assert len(result.password_hash) > 50  # bcrypt hashes are 60 chars
    
    async def test_register_raises_on_duplicate_email(self, db):
        """Error case: duplicate email → DuplicateEmailError"""
        service = UserService(db=db)
        await service.register(email="exists@example.com", password="Pass123!")
        
        with pytest.raises(DuplicateEmailError) as exc_info:
            await service.register(email="exists@example.com", password="Other1!")
        
        assert "exists@example.com" in str(exc_info.value)
    
    async def test_register_raises_on_invalid_email(self, db):
        """Validation: malformed email → ValidationError"""
        service = UserService(db=db)
        
        with pytest.raises(ValidationError):
            await service.register(email="not-an-email", password="Pass123!")
    
    async def test_register_raises_on_weak_password(self, db):
        """Security: password must meet minimum requirements"""
        service = UserService(db=db)
        
        with pytest.raises(WeakPasswordError):
            await service.register(email="test@example.com", password="123")
    
    async def test_register_sends_verification_email(self, db, mock_email):
        """Side effect: welcome email sent on successful registration"""
        service = UserService(db=db, email_service=mock_email)
        
        user = await service.register(
            email="new@example.com",
            password="SecureP@ss123"
        )
        
        mock_email.send_verification.assert_called_once_with(
            to=user.email,
            verification_token=user.verification_token
        )
```

```typescript
// TypeScript (Vitest) — Write these FIRST
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UserService } from '@/services/user'
import { DuplicateEmailError, ValidationError } from '@/errors'
import { createMockDb } from '@/test/mocks'

describe('UserService.register', () => {
  let service: UserService
  let mockDb: ReturnType<typeof createMockDb>
  
  beforeEach(() => {
    mockDb = createMockDb()
    service = new UserService({ db: mockDb })
  })
  
  it('returns user with generated ID on valid input', async () => {
    const result = await service.register({
      email: 'test@example.com',
      password: 'SecureP@ss123'
    })
    
    expect(result.id).toBeTruthy()
    expect(result.id).toMatch(/^[0-9a-f-]{36}$/) // UUID format
    expect(result.email).toBe('test@example.com')
  })
  
  it('hashes the password before storing', async () => {
    const result = await service.register({
      email: 'test@example.com',
      password: 'SecureP@ss123'
    })
    
    expect(result.passwordHash).not.toBe('SecureP@ss123')
    expect(result.passwordHash.length).toBeGreaterThan(50)
  })
  
  it('throws DuplicateEmailError when email already exists', async () => {
    await service.register({ email: 'exists@example.com', password: 'Pass123!' })
    
    await expect(
      service.register({ email: 'exists@example.com', password: 'Other1!' })
    ).rejects.toThrow(DuplicateEmailError)
  })
  
  it('throws ValidationError on invalid email format', async () => {
    await expect(
      service.register({ email: 'not-an-email', password: 'Pass123!' })
    ).rejects.toThrow(ValidationError)
  })
})
```

**MANDATORY: Run tests — they MUST fail before you write any implementation.**
```bash
# Python
pytest tests/test_user_service.py -v
# Expected: 5 FAILED ← this is CORRECT and REQUIRED

# TypeScript
bun test src/services/user.test.ts
# Expected: 5 failed ← CORRECT
```

If tests PASS before implementation → your tests are wrong. Fix them.

### GREEN Phase — Write Minimum Code to Pass

Write the SIMPLEST code that makes tests pass. Not elegant. Not complete. Just passing.

```python
# Minimum implementation to pass tests
from passlib.context import CryptContext
from uuid import uuid4
from pydantic import EmailStr, validator

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:
    def __init__(self, db: AsyncSession, email_service=None):
        self.db = db
        self.email_service = email_service
    
    async def register(self, email: str, password: str) -> User:
        # Validate email format (raises ValidationError if invalid)
        EmailStr.validate(email)
        
        # Validate password strength
        if len(password) < 8:
            raise WeakPasswordError("Password must be at least 8 characters")
        
        # Check for duplicate
        existing = await self.db.execute(
            select(User).where(User.email == email)
        )
        if existing.scalar():
            raise DuplicateEmailError(f"Email {email} already registered")
        
        # Create user
        user = User(
            id=uuid4(),
            email=email,
            password_hash=pwd_context.hash(password),
            verification_token=secrets.token_urlsafe(32)
        )
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        
        # Send verification email
        if self.email_service:
            await self.email_service.send_verification(
                to=user.email,
                verification_token=user.verification_token
            )
        
        return user
```

**Run tests again — all must PASS:**
```bash
pytest tests/test_user_service.py -v
# Expected: 5 PASSED ← GREEN achieved
```

### REFACTOR Phase — Clean Up (while keeping tests green)

Now make the code good:
```python
# After tests pass, refactor:
# 1. Extract validation to separate method
# 2. Add proper type hints
# 3. Add logging
# 4. Handle edge cases more explicitly
# 5. Improve error messages

async def register(self, email: str, password: str) -> User:
    """Register a new user account.
    
    Args:
        email: User's email address (must be unique)
        password: Plain text password (min 8 chars, will be hashed)
    
    Raises:
        ValidationError: If email format invalid
        WeakPasswordError: If password too weak
        DuplicateEmailError: If email already registered
    
    Returns:
        Created User with hashed password and verification token
    """
    await self._validate_registration_input(email, password)
    await self._ensure_email_not_taken(email)
    
    user = await self._create_user(email, password)
    await self._send_verification_email(user)
    
    logger.info("User registered", user_id=str(user.id))
    return user
```

**Run ALL tests after refactor — nothing should break:**
```bash
pytest --cov=src -v
# All tests still pass. Coverage maintained.
```

### COMMIT after each cycle
```bash
git add -A
git commit -m "feat(auth): add user registration with email verification"
```

## Coverage Requirements

| Code Area | Minimum Coverage | Why |
|-----------|-----------------|-----|
| Authentication / Authorization | 90% | Security-critical |
| Payment processing | 95% | Financial-critical |
| Core business logic | 85% | Core correctness |
| API endpoints | 80% | User-facing |
| Utility functions | 75% | Supporting code |
| UI components (interactive) | 60% | Complex to test fully |

Check coverage:
```bash
# Python
pytest --cov=src --cov-report=term-missing --cov-fail-under=80

# TypeScript
bun test --coverage
# vitest --coverage --coverage.thresholds.lines=80
```

## Test Architecture Patterns

### Test Fixtures (reusable test setup)
```python
# conftest.py — shared fixtures
import pytest
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine

TEST_DATABASE_URL = "postgresql+asyncpg://localhost:5432/test_db"

@pytest.fixture(scope="session")
async def engine():
    engine = create_async_engine(TEST_DATABASE_URL)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.fixture
async def db(engine):
    """Each test gets a session that rolls back after test."""
    async with AsyncSession(engine) as session:
        async with session.begin():
            yield session
            await session.rollback()  # ← test isolation

@pytest.fixture
def mock_email():
    return AsyncMock()
```

### What to Mock and What Not To
```
Mock (use unittest.mock / vi.mock):
  ✓ External HTTP calls (payment processors, email services, Slack)
  ✓ File system operations (when testing logic, not I/O)
  ✓ Time / random (for deterministic tests)
  ✓ Third-party services (Stripe, Twilio, SendGrid)

Don't mock:
  ✗ Your own business logic (test it directly)
  ✗ Database (use a test database that rolls back)
  ✗ Simple utility functions (test them directly)
```

### Parameterized Tests (test multiple cases efficiently)
```python
@pytest.mark.parametrize("email,expected_error", [
    ("not-an-email", ValidationError),
    ("missing@domain", ValidationError),
    ("@no-local-part.com", ValidationError),
    ("spaces in@email.com", ValidationError),
    ("", ValidationError),
])
async def test_register_rejects_invalid_emails(email, expected_error, db):
    service = UserService(db=db)
    with pytest.raises(expected_error):
        await service.register(email=email, password="ValidPass123!")
```

## Anti-Patterns — FORBIDDEN

```
✗ Writing implementation code before writing any tests
✗ Writing tests after the feature is "done"
✗ "I'll add tests later" (later never comes)
✗ Skipping the RED step ("I know it'll fail, I don't need to run it")
✗ Mocking what you're trying to test
✗ Tests that test implementation details (internal method names, private state)
✗ Tests that pass because they test nothing (assertions that always pass)
✗ Ignoring flaky tests (fix or delete — never ignore)
✗ One massive test that tests everything
✗ Test that depends on execution order of other tests
```

## Debugging Failing Tests

```
Test fails unexpectedly:
  1. Read the assertion error carefully — exact values expected vs actual
  2. Add print statements in test (TEMPORARY) to see values
  3. Run single test in isolation: pytest path/to/test.py::TestClass::test_name
  4. Check test fixtures — is the database in expected state?
  5. Check mocks — are they configured to return expected values?

Test is flaky (sometimes passes, sometimes fails):
  1. Usually: shared state between tests (use fresh fixture each test)
  2. Timing issue (use explicit waits, not time.sleep)
  3. External service dependency (mock it)
  4. Database ordering (use deterministic sorting)

Tests are slow (> 1 second per test):
  1. You're not mocking external calls
  2. Database fixture scope too narrow (use session-scoped for read-only data)
  3. Creating too much test data unnecessarily
```

## Quality checks
- [ ] Tests exist before implementation begins (not after)
- [ ] Tests actually fail before implementation (run them)
- [ ] Tests pass after implementation (run them again)
- [ ] All tests still pass after refactor
- [ ] Coverage at or above threshold
- [ ] Each test tests ONE behavior
- [ ] Tests are independent (can run in any order)
- [ ] No skipped tests in production (fix or delete)
- [ ] Committed after each RED-GREEN-REFACTOR cycle
