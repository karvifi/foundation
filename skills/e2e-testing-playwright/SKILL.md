---
name: e2e-testing-playwright
description: End-to-end testing patterns with Playwright — browser automation, visual regression, API testing
triggers: [E2E testing, Playwright, browser automation, integration testing, visual regression, end-to-end]
---

# SKILL: E2E Testing with Playwright

## Core Testing Patterns

### Pattern 1: Page Object Model
```typescript
// pages/login.page.ts
export class LoginPage {
  constructor(private page: Page) {}
  
  async goto() {
    await this.page.goto('/login')
  }
  
  async login(email: string, password: string) {
    await this.page.fill('[name="email"]', email)
    await this.page.fill('[name="password"]', password)
    await this.page.click('button[type="submit"]')
  }
  
  async getErrorMessage() {
    return await this.page.textContent('.error-message')
  }
}

// tests/auth.spec.ts
test('login with invalid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page)
  
  await loginPage.goto()
  await loginPage.login('user@test.com', 'wrongpassword')
  
  expect(await loginPage.getErrorMessage()).toBe('Invalid credentials')
})
```

### Pattern 2: API Testing
```typescript
test('create user via API then verify in UI', async ({ request, page }) => {
  // API call
  const response = await request.post('/api/users', {
    data: {
      name: 'Test User',
      email: 'test@example.com'
    }
  })
  expect(response.ok()).toBeTruthy()
  const user = await response.json()
  
  // Verify in UI
  await page.goto('/users')
  await expect(page.locator(`text=${user.name}`)).toBeVisible()
})
```

### Pattern 3: Visual Regression Testing
```typescript
test('homepage looks correct', async ({ page }) => {
  await page.goto('/')
  
  // Full page screenshot
  await expect(page).toHaveScreenshot('homepage.png')
  
  // Component screenshot
  await expect(page.locator('.hero')).toHaveScreenshot('hero.png')
  
  // With options
  await expect(page).toHaveScreenshot({
    maxDiffPixels: 100,  // Allow small differences
    threshold: 0.2       // 20% difference tolerance
  })
})
```

### Pattern 4: Authentication State Reuse
```typescript
// auth.setup.ts
const authFile = 'playwright/.auth/user.json'

test('authenticate', async ({ page }) => {
  await page.goto('/login')
  await page.fill('[name="email"]', 'user@test.com')
  await page.fill('[name="password"]', 'password')
  await page.click('button[type="submit"]')
  
  await page.waitForURL('/dashboard')
  
  // Save auth state
  await page.context().storageState({ path: authFile })
})

// tests/dashboard.spec.ts
test.use({ storageState: authFile })  // Reuse auth

test('view dashboard', async ({ page }) => {
  await page.goto('/dashboard')  // Already logged in
  await expect(page.locator('h1')).toHaveText('Dashboard')
})
```

### Pattern 5: Network Mocking
```typescript
test('handles API error gracefully', async ({ page }) => {
  // Mock API to return error
  await page.route('/api/users', route => {
    route.fulfill({
      status: 500,
      body: JSON.stringify({ error: 'Server error' })
    })
  })
  
  await page.goto('/users')
  await expect(page.locator('.error')).toHaveText('Failed to load users')
})
```

### Pattern 6: Parallel Execution
```typescript
// playwright.config.ts
export default defineConfig({
  workers: 4,  // Run 4 tests in parallel
  
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],
})
```

### Pattern 7: Fixtures (Reusable Setup)
```typescript
// fixtures.ts
export const test = base.extend<{
  authenticatedPage: Page
  testUser: User
}>({
  testUser: async ({ request }, use) => {
    // Create test user
    const res = await request.post('/api/users', {
      data: { email: 'test@example.com' }
    })
    const user = await res.json()
    
    await use(user)
    
    // Cleanup
    await request.delete(`/api/users/${user.id}`)
  },
  
  authenticatedPage: async ({ page, testUser }, use) => {
    // Login
    await page.goto('/login')
    await page.fill('[name="email"]', testUser.email)
    await page.click('button[type="submit"]')
    
    await use(page)
  }
})

// Usage
test('edit profile', async ({ authenticatedPage, testUser }) => {
  await authenticatedPage.goto('/profile')
  await expect(authenticatedPage.locator('h1')).toHaveText(testUser.name)
})
```

## Quality Checks
- [ ] Page Object Model used (no selectors in tests)
- [ ] Authentication state reused (not logging in every test)
- [ ] Visual regression enabled for critical pages
- [ ] Parallel execution configured
- [ ] Network mocking for error scenarios
- [ ] Fixtures for common setup
- [ ] Tests run in CI/CD
- [ ] Screenshot on failure enabled
