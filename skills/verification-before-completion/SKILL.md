---
name: verification-before-completion
description: Prove work is complete with running evidence — no fake "done," no assumed passing
triggers: [done, complete, finished, verify, proof, before claiming done, before committing]
---

# SKILL: Verification Before Completion

## The Iron Law
```
NO COMPLETION CLAIM WITHOUT FRESH RUNNING EVIDENCE.
If you haven't run the verification command in THIS message, you cannot claim it passes.
"I believe it passes" = a lie.
"Tests pass" with no evidence = a lie.
Running the command and showing output = truth.
```

## The Verification Gate

Before claiming ANY of these, run the corresponding command and show output:

| Claim | Evidence Required |
|-------|-----------------|
| "Tests pass" | Run test command, show N/N passing |
| "Build succeeds" | Run build command, show exit code 0 |
| "No type errors" | Run `mypy` / `tsc --noEmit`, show 0 errors |
| "Lint passes" | Run `ruff` / `eslint`, show 0 violations |
| "Bug is fixed" | Run test that reproduces bug, show it passes |
| "Feature works" | Show actual output or test that verifies behavior |
| "Security clean" | Run `ecc-agentshield scan`, show no critical findings |

## Complete Verification Sequence

Run ALL of these before saying "it's done":

```bash
# Step 1: Build passes
[build command for your stack]
# Show output — must end with exit code 0

# Step 2: Type check passes
mypy src/          # Python
npx tsc --noEmit   # TypeScript
# Show output — must show 0 errors

# Step 3: Lint passes
ruff check src/    # Python
eslint src/        # TypeScript
# Show output — must show 0 violations

# Step 4: All tests pass with coverage
pytest --cov=src --cov-fail-under=80 -v    # Python
bun test --coverage                         # TypeScript
# Show output — must show N/N passing, coverage ≥ 80%

# Step 5: Security scan (before any deployment)
npx ecc-agentshield scan
# Show output — must show no critical findings
```

## Evidence Format

When claiming work is complete, show this:
```
VERIFICATION EVIDENCE:
─────────────────────
Build:     ✅ Exit 0
Types:     ✅ 0 errors  
Lint:      ✅ 0 violations
Tests:     ✅ 47/47 passing (82% coverage)
Security:  ✅ 0 critical findings
─────────────────────
Status: VERIFIED COMPLETE
```

## Red Flags — STOP Immediately

You are about to claim something without evidence if you're:
- About to write "should work now" or "should pass"
- About to write "I believe" or "probably" about a test
- About to commit without running tests
- About to mark a task done without a verification check
- Tired and wanting to move on
- About to say "tested manually" without showing what you saw

## Quality checks
- [ ] EVERY completion claim has running command + output
- [ ] Tests run in this message, not from a previous message
- [ ] Output shown explicitly (not summarized)
- [ ] All 5 verification steps run before deployment claim
