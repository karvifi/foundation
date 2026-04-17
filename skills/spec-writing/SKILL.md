---
name: spec-writing
description: Write clear technical specifications — design, API, requirements, acceptance criteria
triggers: [spec, specification, design doc, technical spec, requirements, PRD, proposal]
---

# SKILL: Spec Writing

## Spec Structure

```markdown
# Specification: [Feature Name]

## Overview
One sentence: what is this feature?

## Problem
Why do we need this?
- Current situation: what users do today
- Pain point: specific problem
- Impact: how big is this problem?

## Solution
High level: what are we building?
- Core idea: the main concept
- Non-goals: what we're NOT doing

## Requirements
### Functional
- [ ] User can [action] by [method]
- [ ] System stores [data] in [location]
- [ ] [Scenario A] results in [outcome]

### Non-Functional
- [ ] Performance: P95 < 200ms
- [ ] Availability: 99.9% uptime
- [ ] Security: OWASP Top 10 compliant
- [ ] Scalability: 10x growth without changes

## API Design
[If applicable, include request/response shapes]

### POST /api/v1/users/register
Request:
\`\`\`json
{"email": "user@example.com", "password": "..."}
\`\`\`
Response:
\`\`\`json
{"data": {"id": "uuid", "email": "..."}}
\`\`\`

## Acceptance Criteria
- [ ] User can register with valid email + password
- [ ] Duplicate email returns 409
- [ ] Invalid email returns 422
- [ ] Password is hashed (not stored plaintext)
- [ ] Verification email sent automatically

## Testing Strategy
- Unit tests: [list]
- Integration tests: [list]
- E2E tests: [list]

## Success Metrics
How will we know this was worth building?
- [ ] [Metric 1]
- [ ] [Metric 2]

## Timeline
- Design review: [date]
- Implementation: [N] days
- Testing: [N] days
- Deployment: [date]

## Open Questions
- [Question 1]: [who can answer]
- [Question 2]: [who can answer]
```

## Spec Quality Checklist

```
✅ Problem is clear (not vague)
✅ Solution matches problem
✅ All acceptance criteria are testable
✅ No ambiguous language ("should", "might", "maybe")
✅ Timeline is realistic
✅ Someone new could implement from this spec
✅ Review complete (designer, engineer, product)
```

## Quality checks
- [ ] Problem clearly stated
- [ ] Solution explicitly defined
- [ ] Requirements are testable
- [ ] Acceptance criteria comprehensive
- [ ] API designed (if applicable)
- [ ] Timeline estimated
- [ ] Tech approach specified
- [ ] Sign-off obtained before building
