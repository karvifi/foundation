---
name: writing-plans
description: Write detailed project plans — tasks, timeline, dependencies, milestones, validation
triggers: [plan, project plan, timeline, schedule, roadmap, phases, milestones, execution]
---

# SKILL: Writing Plans

## Plan Template

```markdown
# Project Plan: [Name]

## Scope
What are we building? [2-3 sentences]

## Timeline
Start: [Date]
Launch: [Date]
Total: [N] weeks

## Phases

### Phase 1: Foundations (Week 1-2)
Goal: Infrastructure ready, first test passing
Tasks:
  - [Task]: [File path] ~[N hours]
  - [Task]: [File path] ~[N hours]

Dependency: None (parallel-able)

Gate: All tests pass, can start Phase 2

### Phase 2: Core Features (Week 3-4)
Goal: All requirements implemented
Tasks:
  - [Task]: depends on Phase 1 → [File path] ~[N hours]
  - [Task]: depends on Phase 1 → [File path] ~[N hours]

Gate: All core tests passing

### Phase 3: Quality (Week 5)
Goal: Shipping quality, no critical issues
Tasks:
  - Security review
  - Performance testing
  - Documentation complete

Gate: Security scan passes, E2E tests passing

## Risk Register
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| [Risk] | High | High | [Plan] |

## Success Metrics
How will we know this was successful?
- [ ] [Metric 1]
- [ ] [Metric 2]

## Sign-Off
- Product: [name] ✅
- Engineering: [name] ✅
- Design: [name] ✅
```

## Quality checks
- [ ] Scope clearly defined
- [ ] Timeline realistic (include buffer)
- [ ] All tasks listed
- [ ] Dependencies explicit
- [ ] Gates defined per phase
- [ ] Risk identified and mitigated
- [ ] Success metrics measurable
- [ ] Team has signed off
