---
name: dispatching-parallel-agents
description: Assign independent tasks to parallel AI agents — no conflicts, maximum efficiency
triggers: [parallel, agents, dispatch, concurrent work, split work, multiple tasks, speedup]
---

# SKILL: Dispatching Parallel Agents

## When to Use Parallel Agents

```
Sequential (one task after another):
  Task 1: Research (30 min)
  Task 2: Design (30 min)
  Task 3: Implement (60 min)
  Total: 120 minutes
  
Parallel (independent tasks at same time):
  Agent A: Research (30 min)  ─┐
  Agent B: Design (30 min)    ├─→ Total: 60 minutes
  Agent C: Implement (60 min) ─┘
  
But only if tasks are INDEPENDENT (no shared state)
```

## Dispatching Protocol

### Step 1: Identify Independent Tasks
```
Can task B wait for task A to complete? → Dependent (must be sequential)
Can task B run simultaneously? → Independent (can parallelize)

Example (e-commerce checkout):
  DEPENDENT:
    Task 1: Validate cart
    Task 2: Process payment (depends on valid cart)
  
  INDEPENDENT:
    Task A: Generate invoice
    Task B: Send confirmation email
    Task C: Update inventory
    (all can run simultaneously after payment)
```

### Step 2: Create Git Worktrees (isolated environments)
```bash
git worktree add .worktrees/agent-backend -b task/backend
git worktree add .worktrees/agent-frontend -b task/frontend
git worktree add .worktrees/agent-tests -b task/tests

# Each agent works in their own directory
```

### Step 3: Dispatch Agents
```
Agent 1 (Backend):
  Task: Implement API endpoints for [feature]
  Files: src/api/endpoints/[feature].py
  Test: pytest tests/test_[feature]_api.py
  Status: Create branch task/backend

Agent 2 (Frontend):
  Task: Create UI components for [feature]
  Files: src/components/[Feature]/
  Test: npm test src/components/[Feature]/
  Status: Create branch task/frontend

Agent 3 (Tests):
  Task: Write E2E tests for [feature]
  Files: tests/e2e/[feature].spec.ts
  Test: playwright test tests/e2e/[feature].spec.ts
  Status: Create branch task/tests
```

### Step 4: Synchronize Results
```bash
# Wait for all agents to complete
# Then merge in order (if there are dependencies)

git checkout main
git merge task/backend
git merge task/frontend
git merge task/tests

# Run full test suite
pytest && npm test && playwright test
# If all pass → deployment ready
# If conflicts → resolve and re-test
```

## Task Isolation Requirements

For parallel agents to work:

```
✅ Different files (no conflicts)
✅ Different functions (Agent A makes func_a, Agent B makes func_b)
✅ Different routes (Agent A: /api/users, Agent B: /api/products)

❌ Same file edited by two agents (merge conflicts)
❌ Shared database schema changes (might conflict)
❌ Same component refactored by two agents (conflicts)
```

## Speedup Calculation
```
Sequential time: Sum of all task times
Parallel speedup: Sequential / Parallel time

Example:
  Sequential: 10h + 15h + 5h = 30h
  Parallel (max(10h, 15h, 5h)): 15h
  Speedup: 30h / 15h = 2x faster

Real speedup is usually 1.5-1.8x (due to sync overhead)
```

## Quality checks
- [ ] All tasks identified and estimated
- [ ] Independent tasks identified
- [ ] Worktrees created per agent
- [ ] Clear deliverables per agent
- [ ] No file conflicts expected
- [ ] All agents test locally before merge
- [ ] Tests pass after all merges
