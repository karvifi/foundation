---
name: subagent-driven-development
description: Build with multiple AI agents working together — orchestration, task dispatch, result synthesis
triggers: [multiple agents, parallel AI, agent team, orchestrate agents, dispatch, subagent]
---

# SKILL: Subagent-Driven Development

## Multi-Agent Orchestration

```
Orchestrator (you):
  1. Break project into independent tasks
  2. Dispatch to specialized agents
  3. Monitor progress
  4. Synthesize results
  5. Handle conflicts/gaps

Agents (parallel):
  Agent A: Backend API
  Agent B: Frontend UI  
  Agent C: Tests
  Agent D: DevOps
  
  All work simultaneously on separate branches
```

## Dispatch Protocol

```markdown
# Task: Implement User Authentication

## Agent 1 - Backend
Branch: task/auth-backend
File: src/auth/service.py
Build: User model, password hashing, JWT generation
Test: pytest tests/auth/test_service.py
Deliverable: Passing tests, working service

## Agent 2 - API Endpoint
Branch: task/auth-endpoint
File: src/api/auth.py
Build: /login, /register, /refresh endpoints
Test: pytest tests/api/test_auth.py
Deliverable: Working endpoints, API tests passing

## Agent 3 - Frontend
Branch: task/auth-frontend
File: src/components/LoginForm.tsx
Build: Login form, registration form, auth state
Test: npm test src/components/Auth
Deliverable: Working UI, tests passing

## Integration
Git merge all branches → Run full test suite → Deploy
```

## Quality Syncing

```
Before: Each agent writes in isolation
        Risk: Incompatible interfaces, duplicate work

Better: Agents agree on interface FIRST
        Then implement in parallel

Protocol:
  1. All agents read THE_BIBLE & CONTEXT_STATE
  2. Design meeting: agree on:
     - File paths (no conflicts)
     - Function signatures
     - Data formats
     - Test expectations
  3. Agents implement in parallel
  4. Git merge (should have minimal conflicts)
  5. Full test suite passes
```

## Result Synthesis

```python
# After all agents complete
results = {
    "backend": parse_branch_diff("task/auth-backend"),
    "api": parse_branch_diff("task/auth-endpoint"),
    "frontend": parse_branch_diff("task/auth-frontend"),
}

# Check for:
conflicts = find_git_conflicts()
test_failures = run_full_test_suite()
type_errors = run_type_check()

if conflicts or test_failures or type_errors:
    # Fix issues (might need 1-2 agents to coordinate)
    notify_agents("Merge conflicts in X, need resolution")
else:
    # Ready to ship
    merge_all_branches()
    deploy()
```

## Quality checks
- [ ] Tasks are independent (no agent depends on another)
- [ ] Agents agree on interfaces before starting
- [ ] All agents can work simultaneously
- [ ] Tests isolated per agent
- [ ] Full test suite passes after merge
- [ ] No conflicts in critical files
