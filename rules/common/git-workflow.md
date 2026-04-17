# Git Workflow Rules

## Core rule: main branch is always deployable

## Branch naming
```
feature/short-description
fix/bug-description
chore/what-doing
hotfix/urgent-description
```

## Commit messages
Format: `type: brief description in present tense (max 72 chars)`

Types: feat | fix | chore | docs | test | refactor | perf

## Pre-commit checklist
- Tests pass
- No type errors
- Linting passes
- No secrets in staged files
- .env not staged

## What NEVER goes in git
- .env files (all variants)
- *.pem, *.key (private keys)
- node_modules/, .venv/, dist/, build/
- API keys, tokens, credentials
