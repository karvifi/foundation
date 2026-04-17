---
name: verification-loop
description: Run the complete quality gate sequence — build, types, lint, tests, security
triggers: [verification loop, quality gate, run all checks, before PR, before deploy, verify everything]
---

# SKILL: Verification Loop

## The Complete Quality Gate

Run in this exact order. Stop at first failure — don't continue until it's fixed.

### Phase 1: Build

```bash
# Python
uv run python -m py_compile src/**/*.py
# OR check if your project builds cleanly
uv run uvicorn src.main:app --help  # quick sanity check

# TypeScript/Next.js
bun run build
# Expected: no errors, exit 0

# Go
go build ./...

# Rust
cargo build
```

If build fails → STOP. Fix before proceeding.

### Phase 2: Type Check

```bash
# Python
uv run mypy src/ --strict
# Expected: Success: no issues found in N source files

# TypeScript
npx tsc --noEmit
# Expected: no output (silence = success)

# Go — type checking is part of compilation
# Rust — type checking is part of compilation
```

If type errors → STOP. Fix all of them. `as any` and `# type: ignore` are not fixes.

### Phase 3: Lint

```bash
# Python
uv run ruff check src/ tests/
uv run ruff format --check src/ tests/

# TypeScript
npx eslint src/ --max-warnings 0
npx prettier --check src/

# Go
golangci-lint run

# Rust
cargo clippy -- -D warnings
```

### Phase 4: Tests with Coverage

```bash
# Python
uv run pytest   --cov=src   --cov-report=term-missing   --cov-report=html   --cov-fail-under=80   -v   --tb=short

# TypeScript
bun test --coverage
# OR: npx vitest run --coverage

# Go
go test ./... -race -cover

# Rust
cargo test
```

**Coverage thresholds (enforce in CI):**
```
Auth/Security code:  90%
Payment code:        95%
Core business logic: 85%
API endpoints:       80%
Overall project:     80%
```

### Phase 5: Security (before deployment only)

```bash
# All projects
npx ecc-agentshield scan

# Python
uv run pip audit
# Expected: No known vulnerabilities found

# Node
npm audit --audit-level=high
# Expected: found 0 vulnerabilities (high or critical)

# Check for secrets in staged files
git diff --staged | grep -E "(password|secret|api_key|token)\s*=\s*['"][^'"]{8,}"
# Expected: no output
```

## Verification Report

After running all phases, report:
```
VERIFICATION LOOP RESULTS
═══════════════════════════════════════════

Phase 1: Build         ✅ PASS
Phase 2: Type Check    ✅ PASS (0 errors)
Phase 3: Lint          ✅ PASS (0 warnings)
Phase 4: Tests         ✅ PASS (84/84 passing, 83% coverage)
Phase 5: Security      ✅ PASS (0 critical findings)

═══════════════════════════════════════════
OVERALL: ✅ ALL GATES PASSED
Ready for: PR / deployment
```

OR:
```
Phase 4: Tests         ❌ FAIL
  3 tests failing:
    test_user_login_with_invalid_token (auth/test_auth.py:45)
    test_rate_limit_after_10_attempts (auth/test_auth.py:89)
    test_password_reset_expired_token (auth/test_auth.py:124)

OVERALL: ❌ BLOCKED — fix failing tests before proceeding
```

## Running in CI

```yaml
# In .github/workflows/ci.yml
- name: Verification Loop
  run: |
    echo "Phase 1: Build"
    uv run python -c "import src"
    
    echo "Phase 2: Type Check"
    uv run mypy src/
    
    echo "Phase 3: Lint"
    uv run ruff check src/
    
    echo "Phase 4: Tests"
    uv run pytest --cov=src --cov-fail-under=80 -v
    
    echo "Phase 5: Security"
    uv run pip audit
    npx ecc-agentshield scan
```

## Quality checks
- [ ] All 5 phases run (not just some)
- [ ] Stop at first failure (don't run phase N if N-1 failed)
- [ ] Coverage meets threshold (80% minimum)
- [ ] Security phase run before every deployment
- [ ] Results shown explicitly with pass/fail for each phase
