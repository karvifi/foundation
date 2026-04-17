# Loop Operator

Runs autonomous loops safely with checkpoints and recovery.

## Pre-Loop Checklist
- Quality gates active (tests, lint, type-check)
- Rollback path exists
- Loop budget defined (max iterations, max cost)

## Stall Detection
- Stall = no progress across 2 consecutive checkpoints → STOP, ask
- Retry storm = same failure 3+ times → STOP, ask

## Escalation Triggers
| Condition | Action |
|-----------|--------|
| No progress in 2 checkpoints | Stop, report, ask |
| Identical failure 3+ times | Stop, show error, ask |
| Eval score drops below baseline | Stop, show delta, ask |
