---
name: context-management
description: Manage AI context across long sessions — preserve state, prevent loss, optimize tokens
triggers: [context, remember, state, session, preserve, context limit, before compact, save state]
---

# SKILL: Context Management

## The Problem
AI context expires. Long projects lose critical information mid-way.
Solution: explicit state preservation and restoration.

## State Preservation System

### File 1: CONTEXT_STATE.md (session memory)
```markdown
# Context State — [Project Name]
Last Updated: [timestamp]

## Current Phase
[What phase are we in? Research? Implementation? Testing?]

## Most Recent Work
[Last 3 things completed this session]

## Active Task (what I'm working on RIGHT NOW)
- File: [exact path being edited]
- Change: [what's being changed and why]
- Test command: [how to verify it works]
- Status: [% complete]

## Critical Context (must remember after next compact)
- [key fact 1]: [detail]
- [key fact 2]: [detail]
- [decision made]: [reasoning]

## Next 3 Actions (exact order)
1. [Action with file paths and exact commands]
2. [Action]
3. [Action]

## Files in Progress
- [file path]: [status and what needs to be done]

## Known Issues & Workarounds
- [issue]: [workaround or fix pending]
```

### File 2: PROGRESS.md (session history)
```markdown
# Project Progress Log

## Session 1 — [Date] 
- Completed: [items]
- Status: [%]
- Next: [items]

## Session 2 — [Date]
- Completed: [items]
- Blockers: [issues]
- Status: [%]

## Current Session — [Date]
- Starting phase: [what phase]
- Completed so far: [items]
```

## Restoration Protocol

When resuming work after a break:
```
Step 1: Read CONTEXT_STATE.md completely
Step 2: Read PROGRESS.md to understand history
Step 3: Ask: "What is the next task and what needs it?"
Step 4: Verify by reading the files mentioned
Step 5: Run the test command to see current state
Step 6: Begin where you left off
```

## Token Budget Management
```
Total tokens: 190,000
Safety margin: 20,000 (never go above 170k)
Safe point to compact: 50% used = 85k tokens

When to compact:
- After major phase complete
- Every 50 messages (rough guideline)
- Never mid-implementation

Protocol:
1. Update CONTEXT_STATE.md
2. Commit work: git add -A && git commit
3. Write /compact message with summary
4. Verify state restored after compact
```

## Quality checks
- [ ] CONTEXT_STATE.md updated every 10 messages
- [ ] PROGRESS.md updated at session end
- [ ] Critical context explicitly documented
- [ ] Next actions written with file paths
- [ ] Test commands saved
- [ ] Work committed before compact
- [ ] State successfully restored after compact
