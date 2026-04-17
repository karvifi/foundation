# Testing Rules

## Coverage minimums (enforced in CI)
- Auth and authorization: 90%+
- Payment processing: 95%+
- Core business logic: 85%+
- API endpoints: 80%+
- UI components (interactive): 60%+

## Test naming
```python
# Pattern: test_[unit]_[action]_[expected_result]
def test_calculate_total_returns_sum_of_items(): ...
def test_create_user_raises_on_duplicate_email(): ...
```

## Required test cases per function
1. Happy path — correct input produces correct output
2. Error case — invalid/missing input produces correct error
3. Edge case — empty, zero, null, max size

## Rules
- Tests are independent (no shared mutable state)
- Mock external services (email, payment, HTTP)
- Do NOT mock your own business logic
- 80% minimum coverage minimum
