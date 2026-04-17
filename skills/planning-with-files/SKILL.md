---
name: planning-with-files
description: File-based project planning — using markdown files as the single source of truth for all project work
triggers: [plan files, file planning, markdown plan, project files, task files]
---

# SKILL: Planning with Files

## Purpose
Use structured markdown files as the living, version-controlled truth for all project planning.
Every decision, every task, every status lives in files — never in someone's head or a chat.

## The Core Files

### 1. PROJECT_SPEC.md — What we are building
```markdown
# [Project Name]

## One-liner
[What it does for whom]

## Problem
[What exact problem this solves]

## Success Criteria
- [ ] [Measurable outcome 1]
- [ ] [Measurable outcome 2]

## Out of scope (explicit)
- [Thing we are NOT building]

## Users
[Who uses this and why]

## MVP Features (max 5)
1. [Feature]
2. [Feature]
3. [Feature]
```

### 2. IMPLEMENTATION_PLAN.md — How we build it
```markdown
# Implementation Plan

## Phase 1: [Name] (estimated: X hours)
- [ ] Task 1.1: [exact action] → [exact file] — 2-5 min
- [ ] Task 1.2: [exact action] → [exact file] — 2-5 min

## Phase 2: [Name]
- [ ] Task 2.1: ...
```

### 3. CONTEXT_STATE.md — Where we are right now
```markdown
# Context State — [timestamp]
Active task: [exact task name]
Phase: [phase name]
Next: [next 3 actions]
Blockers: [anything blocking]
```

### 4. DECISIONS.md — Why decisions were made
```markdown
## [Date]: [Decision title]
Context: [what situation forced this decision]
Decision: [what was decided]
Reason: [why this and not alternatives]
```

### 5. DAILY_LOG.md — Running log
```markdown
## [Date]
Done:
- [item]
Started:
- [item]
Blocked:
- [item] because [reason]
Tomorrow:
- [item]
```

## File Update Rules
1. Start of work → read CONTEXT_STATE.md
2. During work → update CONTEXT_STATE.md when changing tasks
3. End of work → update PROGRESS.md + commit everything
4. Every decision → add to DECISIONS.md immediately
5. Never trust memory → always check files first

## Quality checks
- [ ] CONTEXT_STATE.md is never more than 30 minutes stale
- [ ] Every task in IMPLEMENTATION_PLAN.md has a checkbox
- [ ] Completed tasks are marked done with date
- [ ] DECISIONS.md has the reason, not just the decision
