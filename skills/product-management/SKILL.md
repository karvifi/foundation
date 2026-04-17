---
name: product-management
description: Full product lifecycle — discovery, roadmap, user stories, acceptance criteria, metrics
triggers: [product, roadmap, features, user stories, backlog, sprint, prioritize, requirements]
---

# SKILL: Product Management

## Purpose
Turn a vision into a prioritized, executable roadmap that delivers user and business value.

## Process

### Step 1: Discovery (before building anything)
User research required:
- 5-10 user interviews (open-ended questions, not leading)
- Jobs-to-be-done framework: "When [situation], I want to [motivation], so I can [outcome]"
- Pain points ranking (severity × frequency)
- Existing behavior analysis (how do they solve it today?)

Market research required:
- Competitive landscape (who else solves this?)
- Market size (how many people have this problem?)
- Pricing benchmarks (what do they pay?)

### Step 2: Problem Statement
```
We believe [target user]
Has [specific problem]
Because [root cause]
Which results in [negative outcome]
We will know we are right when [measurable signal]
```

### Step 3: Product Vision & North Star
- Vision: "A world where [users] can [do X] without [pain]"
- North Star Metric: ONE metric that captures if users get value
- Supporting metrics: 3-5 that lead to north star

### Step 4: Prioritization Framework (RICE)
For each feature/initiative score:
- **R**each: how many users affected per period?
- **I**mpact: how much does it move the needle? (0.25 / 0.5 / 1 / 2 / 3)
- **C**onfidence: how sure are you? (%)
- **E**ffort: how many person-weeks?

RICE score = (Reach × Impact × Confidence) / Effort
Higher score = prioritize first

### Step 5: Roadmap (Now / Next / Later)
```
NOW (this sprint/quarter):
  - [high RICE score items already committed]

NEXT (next quarter):
  - [high RICE items pending capacity]

LATER (6+ months):
  - [lower priority or needs more discovery]

NOT DOING:
  - [explicitly rejected with reason — prevents scope creep]
```

### Step 6: User Story Format
```
As a [type of user],
I want [some goal],
So that [some reason/benefit].

Acceptance Criteria (BDD format):
Given [initial context]
When [action taken]
Then [expected outcome]
And [additional outcome]
```

### Step 7: Definition of Done
A feature is "done" only when:
```
□ All acceptance criteria met
□ Automated tests written and passing
□ Security review passed
□ Performance benchmarks met
□ Accessibility (WCAG AA) verified
□ Documentation updated
□ Stakeholders signed off
□ Analytics/tracking implemented
□ Shipped to production
□ Monitoring showing expected behavior
```

## Output
- Problem statement
- User stories with acceptance criteria
- RICE-prioritized backlog
- Now/Next/Later roadmap
- Definition of Done checklist

## Quality checks
- [ ] Roadmap based on user research, not opinions
- [ ] Each feature has measurable acceptance criteria
- [ ] RICE scores calculated and documented
- [ ] "Not doing" list exists (scope boundary)
- [ ] North star metric defined before building
