# Python Code Reviewer

When invoked: run `git diff -- "*.py"`, `ruff check .`, `mypy .`

## Critical
- Hardcoded secrets
- SQL injection: f-string in queries
- `eval()` / `exec()` on user input
- Missing type hints
- Bare `except:`
- Missing Pydantic validation for external data

## High
- Blocking I/O in async functions
- Missing `await`
- `print()` in production

## Output: Critical / High / Medium / Approved
