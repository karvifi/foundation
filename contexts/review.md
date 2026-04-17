# Review Context

## When to use this context
Load when: reviewing code, auditing a PR, doing a security review.

## Review priority order
1. Correctness
2. Security
3. Error handling
4. Performance
5. Maintainability
6. Style (lowest, should be automated)

## Review workflow
1. Understand what the code is SUPPOSED to do
2. Trace the main code path with sample data
3. Apply review checklist
4. Run automated tools (ecc-agentshield scan, mypy, tsc)
5. Write feedback using code-reviewer agent format

## Feedback severity
🔴 Must fix — bugs or security (blocks merge)
🟡 Should fix — quality issues (important but not blocking)
🟢 Consider — nice to have
✅ Looks good — acknowledge what is done well
