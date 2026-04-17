---
name: debug-systematic
description: Scientific debugging — hypothesis, test, observe, refine — not random guessing
triggers: [debug, bug, error, not working, broken, why isn't it, troubleshoot]
---

# SKILL: Debug Systematically

## The Scientific Method for Debugging

### Step 1: Reproduce the Bug
```
Can you make it happen again?
- Exact steps to reproduce
- Input data that causes it
- Environment (development? production?)

If you can't reproduce → likely race condition or timing issue
If always reproducible → easier to fix
```

### Step 2: Narrow the Scope
```
Where could this bug be?
❌ Not "somewhere in the code"
✅ "Happens in authentication flow, specifically password hashing"

Test:
- Does it happen in all browsers? (just one = browser issue)
- Does it happen with all inputs? (just some = input validation)
- Does it happen in staging? (yes = code; no = environment)
```

### Step 3: Form a Hypothesis
```
"I think the bug is [specific location] because [reason]"

Example:
"I think the password hash comparison is using == instead of constant-time comparison,
 allowing timing attacks."

NOT: "I think there's a bug"
YES: "I think the function is comparing hashes using string equality which is vulnerable"
```

### Step 4: Test the Hypothesis
```python
# Add instrumentation (logging, breakpoints)
logger.debug("about to compare", {
    "input_hash": input_hash,
    "stored_hash": stored_hash,
    "comparison_function": "=="
})

# Run with test data that exercises the code path
# Example: password "test123" with stored hash "..."

# Observe the output
# Does it match your hypothesis?
```

### Step 5: Refine or Move On
```
If hypothesis was correct:
  → Fix the code
  → Write a test that would catch this
  → Commit with explanation

If hypothesis was wrong:
  → Go back to Step 2
  → Narrow to a different scope
  → Form new hypothesis
```

## Common Debugging Patterns

```
Bug pattern: "Works on my machine"
  Hypothesis: Environment difference (Python version, dependency version)
  Test: pip freeze on both machines, compare
  Fix: Pin versions in requirements.txt

Bug pattern: "Only happens sometimes"
  Hypothesis: Race condition (concurrent requests)
  Test: Load test with 100 concurrent requests
  Fix: Add locking or transaction boundaries

Bug pattern: "Just started happening"
  Hypothesis: Recent change caused it
  Test: git log --oneline | head -20
        git diff [last-good-commit]
  Fix: Revert the change or fix it properly
```

## Quality checks
- [ ] Bug is reproducible (exact steps documented)
- [ ] Scope narrowed (not "somewhere in the code")
- [ ] Hypothesis is specific (not vague)
- [ ] Hypothesis tested with evidence
- [ ] Root cause found and verified
- [ ] Test written to prevent regression
- [ ] Fix is minimal (not "rewrite everything")
