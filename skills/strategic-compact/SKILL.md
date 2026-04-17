---
name: strategic-compact
description: Compress context at logical phase boundaries — preserve quality, prevent mid-task loss
triggers: [compact, context full, running out of tokens, context limit, /compact, context boundary]
---

# SKILL: Strategic Compact

## The Problem
AI context has a limit. When it auto-compacts at 95% full, quality degrades severely.
Strategic compacting at 50% preserves full quality and prevents losing work mid-task.

## The Iron Law
```
NEVER compact mid-implementation.
ALWAYS compact at logical boundaries.
ALWAYS save state before compacting.
```

## When to Compact

### ALWAYS compact at these moments:
- Research phase complete, about to start implementation
- One milestone complete, starting the next
- Debugging session ended, resuming feature work
- After a failed approach, before trying a different one
- Context is approaching 50% used

### NEVER compact at these moments:
- Mid-implementation (you'll lose file paths, variable names, partial state)
- During TDD RED phase (you need the failing test in context)
- Just after sharing a large spec (you need that context for implementation)

## Pre-Compact Protocol (always do this first)

### Step 1: Save to docs/CONTEXT_STATE.md
```markdown
# Context State — Pre-compact save [timestamp]

## What we just completed
[bullet list of exactly what was just finished]

## Active task when compacting
[exact task name and file being worked on]

## Next actions (in order)
1. [most critical next step with exact detail]
2. [second step]
3. [third step]

## Key decisions made this session
- [decision]: [reason]

## Files in progress
- [path]: [status]

## Critical context to restore after compact
[anything specific that the next response needs to know]
```

### Step 2: Commit current work
```bash
git add -A
git commit -m "chore: save progress before context compact — [current state]"
```

### Step 3: Compact with a hint
```
/compact "Completed [phase]. About to start [next phase]. 
Key context: [most important 2-3 facts to preserve]."
```

### Step 4: Verify restoration
After compacting, immediately verify the state was preserved:
```
Read docs/CONTEXT_STATE.md
Read docs/PROGRESS.md
Confirm: what is the next task?
```

## Token Budget Settings

Add to `~/.claude/settings.json`:
```json
{
  "model": "claude-sonnet-4-5",
  "env": {
    "MAX_THINKING_TOKENS": "10000",
    "CLAUDE_AUTOCOMPACT_PCT_OVERRIDE": "50",
    "CLAUDE_CODE_SUBAGENT_MODEL": "claude-haiku-4-5"
  }
}
```

Why these settings:
- Sonnet vs Opus: 60% cost reduction, handles 90% of tasks
- 10000 thinking tokens vs 31999: 70% thinking cost reduction
- 50% compact threshold vs 95%: dramatically better quality compaction
- Haiku for subagents: 90% cost reduction for simple tasks

## Quality checks
- [ ] CONTEXT_STATE.md updated before compacting
- [ ] All work committed before compacting
- [ ] Compact happens at logical boundary (not mid-task)
- [ ] Context restored and verified after compact
