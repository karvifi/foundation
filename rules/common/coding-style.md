# Coding Style Rules

## Principle: Code is read 10x more than it is written. Optimize for reading.

## Python

### Formatting (enforced by ruff)
- Line length: 100 characters
- Indentation: 4 spaces
- Run: `ruff format src/` before committing

### Type hints (required everywhere)
```python
async def create_user(email: str, name: str) -> User: ...
def get_user(user_id: str) -> User | None: ...
def process_users(users: list[User]) -> dict[str, User]: ...
```

### Naming
- Variables and functions: snake_case
- Classes: PascalCase
- Constants: UPPER_SNAKE_CASE
- Private/internal: prefix with underscore

## TypeScript

### Formatting (enforced by prettier)
- Strict mode always on
- No `any` — use `unknown` + type guards
- Named exports only (never default for utilities)

### Naming
- Variables/functions: camelCase
- Components/types/interfaces: PascalCase
- Constants: UPPER_SNAKE_CASE
- Files: kebab-case

## Universal rules (all languages)

- Functions: max 40 lines, does ONE thing
- Comments: explain WHY, not WHAT
- No magic numbers: use named constants
- Input validation at EVERY system boundary
