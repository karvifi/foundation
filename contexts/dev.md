# Development Context

## When to use this context
Load when: actively building features, writing code, implementing functionality.

## Active mindset for development sessions

PRIMARY GOAL: Ship working, tested, secure code.

WORKFLOW:
1. Understand what you are building (use brainstorming skill if unclear)
2. Plan the implementation (use writing-plans skill)
3. Write tests first (use tdd-workflow skill)
4. Implement to make tests pass
5. Review for security (use security-review skill)
6. Run all checks before marking done

## Pre-implementation checklist
```
□ Is there a relevant skill in skills/?
□ Is there an existing pattern in this codebase to follow?
□ Am I sure about the API/library I am using? (use researcher agent if not)
□ Have I planned the tasks? (2-5 minute chunks)
□ Have I written at least one test first?
```

## Stack quick-reference
```bash
# Start Python dev server
uv run uvicorn src.main:app --reload --port 8000

# Start Next.js dev server
bun dev

# Run Python tests
uv run pytest -v --cov=src

# Run TypeScript tests
bun test

# Type check
uv run mypy src/
bunx tsc --noEmit

# Lint and format
uv run ruff check src/ && uv run ruff format src/
bunx eslint src/ && bunx prettier --write src/

# Security scan
npx ecc-agentshield scan
```
