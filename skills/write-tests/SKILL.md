---
name: write-tests
description: Generate complete test suites — unit, integration, E2E — for any feature or codebase
triggers: [write tests, generate tests, test coverage, test this, add tests, need tests]
---

# SKILL: Write Tests

## Test-First Philosophy
The best time to write tests is before the implementation.
The second best time is right now.
There is no "I'll add tests later" — later tests are worse tests.

## The 4-Layer Test Strategy

### Layer 1: Unit Tests (test one function/class in isolation)

Target: every function that has business logic.

```python
# Python — pytest pattern
class TestOrderCalculation:
    """Tests for order total calculation business logic"""
    
    def test_calculate_subtotal_sums_all_items(self):
        """Subtotal equals sum of (price × quantity) for all items"""
        items = [
            OrderItem(product_id="p1", price=Decimal("10.00"), quantity=2),
            OrderItem(product_id="p2", price=Decimal("5.50"), quantity=1),
        ]
        result = calculate_subtotal(items)
        assert result == Decimal("25.50")
    
    def test_apply_discount_percentage(self):
        """Percentage discount reduces total by exact amount"""
        discount = PercentageDiscount(percentage=10)
        total = Decimal("100.00")
        result = apply_discount(total, discount)
        assert result == Decimal("90.00")
    
    def test_apply_discount_does_not_go_below_zero(self):
        """Discount cannot make total negative"""
        discount = PercentageDiscount(percentage=150)
        total = Decimal("50.00")
        result = apply_discount(total, discount)
        assert result == Decimal("0.00")
    
    @pytest.mark.parametrize("tax_rate,subtotal,expected", [
        (0.10, Decimal("100.00"), Decimal("10.00")),
        (0.20, Decimal("50.00"), Decimal("10.00")),
        (0.00, Decimal("100.00"), Decimal("0.00")),
    ])
    def test_calculate_tax_at_various_rates(self, tax_rate, subtotal, expected):
        """Tax is calculated correctly for multiple tax rates"""
        result = calculate_tax(subtotal, tax_rate)
        assert result == expected
```

```typescript
// TypeScript — Vitest pattern
describe('OrderCalculation', () => {
  describe('calculateSubtotal', () => {
    it('sums all items correctly', () => {
      const items: OrderItem[] = [
        { productId: 'p1', price: 10.00, quantity: 2 },
        { productId: 'p2', price: 5.50, quantity: 1 },
      ]
      expect(calculateSubtotal(items)).toBe(25.50)
    })
    
    it('returns 0 for empty order', () => {
      expect(calculateSubtotal([])).toBe(0)
    })
    
    it('handles single item', () => {
      const items = [{ productId: 'p1', price: 9.99, quantity: 1 }]
      expect(calculateSubtotal(items)).toBe(9.99)
    })
  })
})
```

### Layer 2: Integration Tests (test service + real database)

```python
# Python — integration with real test database (rollback after each test)
class TestUserRegistrationIntegration:
    
    async def test_register_persists_user_to_database(self, db: AsyncSession):
        """After registration, user exists in database with correct data"""
        service = UserService(db=db)
        
        user = await service.register(
            email="test@example.com",
            password="SecurePass123!"
        )
        
        # Verify it's actually in the database
        db_user = await db.get(User, user.id)
        assert db_user is not None
        assert db_user.email == "test@example.com"
        assert db_user.password_hash != "SecurePass123!"  # hashed
    
    async def test_register_returns_unique_ids_for_multiple_users(self, db: AsyncSession):
        """Each registration creates a unique user ID"""
        service = UserService(db=db)
        
        user1 = await service.register(email="user1@test.com", password="Pass123!")
        user2 = await service.register(email="user2@test.com", password="Pass123!")
        
        assert user1.id != user2.id
```

### Layer 3: API Tests (test full HTTP request/response cycle)

```python
class TestAuthAPI:
    
    async def test_login_returns_jwt_on_valid_credentials(self, client: AsyncClient, test_user):
        """Valid credentials return 200 with JWT token"""
        response = await client.post("/api/v1/auth/login", json={
            "email": test_user.email,
            "password": "TestPass123!"
        })
        
        assert response.status_code == 200
        data = response.json()
        assert "data" in data
        assert "token" in data["data"]
        assert data["data"]["token"].startswith("eyJ")
    
    async def test_login_returns_401_on_wrong_password(self, client: AsyncClient, test_user):
        """Wrong password returns 401 with error code"""
        response = await client.post("/api/v1/auth/login", json={
            "email": test_user.email,
            "password": "WrongPassword!"
        })
        
        assert response.status_code == 401
        assert response.json()["error"]["code"] == "INVALID_CREDENTIALS"
    
    async def test_protected_endpoint_requires_auth(self, client: AsyncClient):
        """Request without token returns 401"""
        response = await client.get("/api/v1/users/me")
        assert response.status_code == 401
    
    async def test_list_users_paginates_results(self, client: AsyncClient, auth_headers, test_users):
        """List endpoint returns paginated results with correct meta"""
        response = await client.get(
            "/api/v1/users?page=1&perPage=5",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert len(data["data"]) <= 5
        assert "meta" in data
        assert "total" in data["meta"]
        assert "hasNext" in data["meta"]
```

### Layer 4: E2E Tests (Playwright — test through the browser)

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('User Authentication', () => {
  test('complete login flow works', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login')
    
    // Verify page loaded correctly
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()
    
    // Fill in credentials
    await page.getByLabel('Email address').fill('user@example.com')
    await page.getByLabel('Password').fill('TestPass123!')
    
    // Submit
    await page.getByRole('button', { name: 'Sign in' }).click()
    
    // Verify redirect to dashboard
    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText('Welcome back')).toBeVisible()
  })
  
  test('shows error on invalid credentials', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email address').fill('wrong@example.com')
    await page.getByLabel('Password').fill('wrongpassword')
    await page.getByRole('button', { name: 'Sign in' }).click()
    
    await expect(page.getByRole('alert')).toContainText('Invalid email or password')
    await expect(page).toHaveURL('/login')  // stayed on login page
  })
  
  test('redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/dashboard')  // protected page
    await expect(page).toHaveURL('/login')
  })
})
```

## Test Data Management

```python
# conftest.py — shared fixtures for all test types
import pytest
from httpx import AsyncClient

@pytest.fixture
async def test_user(db: AsyncSession):
    """A standard test user, cleaned up after each test"""
    service = UserService(db=db)
    user = await service.register(
        email="testuser@example.com",
        password="TestPass123!"
    )
    return user

@pytest.fixture
async def test_users(db: AsyncSession):
    """Multiple test users for pagination tests"""
    service = UserService(db=db)
    users = []
    for i in range(15):
        user = await service.register(
            email=f"user{i}@example.com",
            password="TestPass123!"
        )
        users.append(user)
    return users

@pytest.fixture
async def auth_headers(client: AsyncClient, test_user):
    """Auth headers for making authenticated requests"""
    response = await client.post("/api/v1/auth/login", json={
        "email": "testuser@example.com",
        "password": "TestPass123!"
    })
    token = response.json()["data"]["token"]
    return {"Authorization": f"Bearer {token}"}
```

## Test Coverage Requirements

```
Minimum by area:
  Auth/security code:  90%
  Payment code:        95%
  Core business logic: 85%
  API endpoints:       80%
  Overall:             80%

What to prioritize:
  Priority 1: Happy path of the core user journey
  Priority 2: Authentication and authorization
  Priority 3: Error handling and validation
  Priority 4: Edge cases (empty, zero, max)
  Priority 5: Performance-sensitive code
```

## Quality checks
- [ ] Unit tests for all business logic functions
- [ ] Integration tests for database operations
- [ ] API tests for every endpoint (happy path + error cases)
- [ ] E2E tests for critical user flows
- [ ] Coverage meets 80% minimum
- [ ] Tests are independent (no shared state between tests)
- [ ] Test data cleaned up after each test (rollback or teardown)
- [ ] No tests skipped without documented reason
