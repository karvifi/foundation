---
name: finishing-a-development-branch
description: Finalize branches — quality gate, PR, code review, merge, delete, production ready
triggers: [finish, branch, complete, ready to merge, code review, production, clean up]
---

# SKILL: Finishing a Development Branch

## Pre-Merge Checklist

```
[ ] Branch is up to date with main
    git fetch && git rebase origin/main

[ ] All tests pass locally
    pytest && npm test && mypy

[ ] Coverage meets requirements (≥80%)
    pytest --cov=src --cov-fail-under=80

[ ] No lint errors
    ruff check src/ && eslint src/

[ ] Code is formatted
    ruff format src/ && prettier --write src/

[ ] Commit messages are clear
    git log origin/main..HEAD --oneline
    → each should be: "feat/fix/docs: specific change"

[ ] Work is committed
    git status → nothing modified, everything staged

[ ] Branch name reflects work
    good: feature/user-authentication
    bad: temp, fix-stuff, test

[ ] Sensitive data removed
    grep -r "password\|secret\|api_key" src/ | grep -v test
    → should be empty
```

## Creating the Pull Request

```markdown
# Title
feat(auth): add two-factor authentication support

## Description
Users can now enable 2FA on their accounts using TOTP apps.

## Changes
- Added User.totp_secret and User.totp_enabled columns
- Implemented TOTP verification service
- Added 2FA setup endpoint
- Added 2FA verification endpoint

## Testing
- Unit tests: 12 new tests, all passing
- Integration tests: auth flow tested end-to-end
- Manual testing: tested with Google Authenticator + Authy

## Verification
- [ ] Tests pass: `pytest` (47/47 ✅)
- [ ] Coverage maintained: 84% (was 82%)
- [ ] No lint issues: `ruff check` ✅
- [ ] Types checked: `mypy` ✅

## Checklist
- [x] Tests added/updated
- [x] Documentation updated
- [x] No breaking changes
- [x] Ready for production

Closes #123
```

## Code Review Process

Wait for approval. Be responsive:
```
Reviewer comment: "Why hardcode 30 seconds?"
Your response: "TOTP token valid for 30s. Changed to constant TOTP_WINDOW_SECONDS for clarity."
                [show the code change]
```

## Merge Strategy

```bash
# Get latest
git fetch origin

# Rebase (keeps history linear)
git rebase origin/main

# Merge to main
git checkout main
git pull origin main
git merge --squash feature/branch  # combine all commits into one
git commit -m "feat: add 2FA support (#123)"
git push origin main

# Or use GitHub "Squash and merge" button

# Delete branch
git branch -d feature/branch
git push origin --delete feature/branch
```

## After Merge

```
[ ] Verify in main branch
    git checkout main && npm run test

[ ] Monitor for regressions
    Watch error rate for 30 minutes
    Check Sentry/error tracking

[ ] Update documentation
    If API changed: update API docs
    If architecture changed: update ARCHITECTURE.md

[ ] Celebrate
    You shipped it!
```

## Quality checks
- [ ] All tests pass before PR
- [ ] PR description is clear
- [ ] Code reviewer approval obtained
- [ ] Conflicts resolved
- [ ] Branch deleted after merge
- [ ] No regressions in first 30 minutes post-merge
