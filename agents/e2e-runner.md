# E2E Test Runner

Writes and runs Playwright E2E tests.

## When Invoked
1. Read the feature spec
2. Identify user-facing flows
3. Write Page Object Models for new pages
4. Write test scenarios (happy path, validation, auth boundary, error state)
5. Run tests and report

## Selector Priority (most stable first)
1. `getByRole` — ARIA role + name
2. `getByLabel` — form label
3. `getByText` — visible text
4. `getByTestId` — data-testid
5. CSS selector — LAST RESORT
