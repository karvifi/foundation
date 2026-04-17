# Ultra Prestart Protocol

## Why this exists
Most failures happen before implementation starts: wrong assumptions, missing context, noisy repo choices, and no verification strategy.

## Phase A: Project Reality Lock

Required outputs before any coding:
- docs/PROJECT_SPEC.md
- docs/ARCHITECTURE_DECISIONS.md
- docs/IMPLEMENTATION_PLAN.md

Mandatory gates:
1. Objective is explicit and testable.
2. Constraints and non-goals are explicit.
3. User did or did not specify stack is explicitly recorded.
4. If stack not specified, ranked options with tradeoffs are approved.
5. Security baseline and testing baseline are selected.
6. Rollback path is defined.

## Phase B: Repo Intelligence Lock

1. Select only relevant sources from `configs/repo_sources.txt`
2. Run `scripts/repo_absorb.py` for the selected batch
3. Convert extracted patterns into skills/agents/rules
4. Reject low-signal patterns and record why

## Phase C: Token and Context Lock

- Keep model context under control with strategic compaction
- Use smallest model that can do the job for sub-tasks
- Avoid repeated broad scans once reports are generated
- Reuse normalized assets, not raw repo files

## Phase D: Execution Lock

Implementation starts only when all are complete:
- Prestart intake complete
- Stack decision approved
- Repo intelligence complete for selected domain
- Verification plan complete

## Phase E: Verification Lock

Before completion claims:
- Build and type checks pass
- Lint passes
- Tests pass
- Security checks pass
- Docs updated

No proof, no completion.
