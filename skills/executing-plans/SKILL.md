---
name: executing-plans
description: Execute plans efficiently — track progress, adjust when blocked, keep momentum
triggers: [execute, run plan, implement, start building, go live, execute strategy, deployment]
---

# SKILL: Executing Plans

## The Execution Protocol

### Daily Start
```
1. Open CONTEXT_STATE.md
2. Read: "What is my next task?"
3. Set timer: block 2 hours uninterrupted
4. Run verification: "Is the current state what I expect?"
5. Begin the exact next task (not something easier)
```

### During Execution
```
Every 30 minutes:
  1. Save work: git add -A && git commit
  2. Update CONTEXT_STATE.md with current progress
  3. If stuck > 10 minutes: try a different approach
  4. If stuck > 30 minutes: ask for help or escalate

Don't:
  ❌ Skip ahead (stay in order)
  ❌ Switch tasks mid-implementation
  ❌ Leave code uncommitted (prevents recovery)
  ❌ Guess when blocked (think systematically)
```

### When Blocked
```
Blocked on task X:
  1. Is the blocker documented? (write it down)
  2. Can I proceed without it? (do other tasks)
  3. Can someone else unblock me? (ask)
  4. Can I work around it? (temporary workaround)
  5. How critical is it? (does it block everything or just this one task?)

Escalation:
  If blocked > 1 hour and critical:
    → Message for help (specific question, not "I'm stuck")
    → Show what you tried
    → Ask specifically: "Can you [specific action]?"
```

### Progress Tracking
```
Update after each completed task:
  
CONTEXT_STATE.md:
  ✅ Task N: [task name] — COMPLETE
  ⏳ Task N+1: [task name] — IN PROGRESS (X% done)
  ⬜ Task N+2: [task name] — NOT STARTED
  
  Current task status:
    File: [path]
    What's done: [list]
    What's left: [list]
    Estimated time: X minutes remaining
```

### Momentum Preservation
```
Finish condition:
  - All tests pass
  - Code committed
  - CONTEXT_STATE updated
  - Next task identified
  → Ready to stop (or continue)

Resume condition:
  - Read CONTEXT_STATE
  - Run last test to see current state
  - Continue from exact point stopped
```

## Quality checks
- [ ] Plan broken into N small tasks
- [ ] Each task has estimated time
- [ ] Each task has success criteria
- [ ] Progress tracked every 30 minutes
- [ ] Blockers documented immediately
- [ ] Work committed frequently
- [ ] Momentum maintained (no context switching)
