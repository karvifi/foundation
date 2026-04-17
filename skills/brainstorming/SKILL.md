---
name: brainstorming
description: Validate and refine any idea through Socratic questioning before any implementation begins
triggers: [plan, design, build, create, idea, want to make, thinking about, what should I build]
---

# SKILL: Brainstorming

## Purpose
The most expensive mistake is building the wrong thing perfectly.
This skill ensures you're solving the right problem before writing a single line of code.

**The Golden Rule:** An hour of brainstorming prevents a week of rework.

## Process (ask these questions ONE AT A TIME)

### Stage 1: Define the Core

**Question 1: What are you building? (one sentence)**
Don't accept vague answers. Push for precision:
```
Vague: "A productivity app"
Better: "A tool that helps freelancers track billable hours"
Precise: "A browser extension for freelancers that auto-detects time spent in specific websites and generates invoices from that data"

Test: Could you hand this description to a developer and they'd know what to build?
If not → get more specific.
```

**Question 2: Who is the primary user?**
Don't accept demographics. Get psychographics:
```
Bad: "Small businesses"
Better: "Freelance designers"
Best: "Freelance designers earning $50-100k/year who lose 20% of billable time to poor tracking and hate doing admin work"

The more specific the user, the better the product.
If "everyone can use this" → it's a warning sign.
```

**Question 3: What specific pain do they have TODAY?**
Ask about current behavior, not hypothetical:
```
Bad: "They want better project management"
Good: "They currently use a spreadsheet that takes 30 minutes every Friday to update, 
       and they regularly forget to log time for small tasks, losing ~$500/month"

The pain must be:
  - Happening TODAY (not hypothetical)
  - Frequent (daily/weekly, not annual)
  - Painful (they've tried to fix it)
  - Have a current workaround (proves it's real)
```

**Question 4: What does success look like?**
Convert vague success into measurable outcomes:
```
Vague: "Users love it"
Measurable: "Freelancers track 95%+ of billable hours and spend < 5 minutes/week on time admin"

Force measurement:
  "How will you know in 3 months if this was worth building?"
  "What number has to go up for this to be called a success?"
```

**Question 5: What are you explicitly NOT building?**
Scope definition by exclusion is as important as inclusion:
```
"For this phase, we are NOT building:
  - Mobile app (web only)
  - Team features (solo freelancers only)
  - Invoicing (just tracking — export to CSV for now)
  - Integrations (standalone for MVP)"

No out-of-scope list = scope creep guaranteed
```

### Stage 2: Challenge Assumptions

After getting the initial answers, probe with these:

**Challenge 1: "What would a smart person say is wrong with this idea?"**
Force them to articulate the strongest objections.

**Challenge 2: "Who is doing this today without your product?"**
Understand current alternatives — even if imperfect:
```
If nobody is doing it today:
  → Either massive unmet need (rare) OR the problem isn't real (common)
  
If everyone uses [existing solution]:
  → What's wrong with it? Why would they switch?
  → Is that reason compelling enough to overcome switching costs?
```

**Challenge 3: "Why hasn't this been built before?"**
One of these is usually true:
- The problem is new (technology/market change enables it)
- Others tried and failed (learn why)
- It has been built (you need to do market research)
- The market is too small (sustainable business?)
- The problem isn't as painful as assumed

**Challenge 4: "What's the minimum version that proves the concept?"**
Strip to core value:
```
Start with: "If we could only do ONE thing for users, what would it be?"
That's your MVP.

Common mistake: MVP with 10 features. Real MVP has 1 feature done really well.
"MVP" means minimum VIABLE — enough to learn if the assumption is right.
```

### Stage 3: Define the MVP

After all questions are answered, distill to:

**MVP Feature List (maximum 5, usually 3):**
```
Priority 1 (must have — without this, product doesn't work):
  [Feature]: [Why it's the core]

Priority 2 (important — product is incomplete without this):
  [Feature]: [Why it's needed for viability]

Priority 3 (valuable — but can be added after validation):
  [Feature]: [Why useful but deferrable]

Future (defer explicitly):
  [Feature]: [Why deferred]
  [Feature]: [Why deferred]
```

**User journey for MVP (step by step):**
```
1. User arrives at [entry point] because [reason]
2. User sees [first screen/page]
3. User does [first action]
4. System responds with [outcome]
5. User achieves [goal] in [time]
6. User is [emotional state] because [reason]
```

### Stage 4: Validate Before Building

Before any code, validate the riskiest assumption:
```
What is the riskiest assumption in this plan?
(Usually: "users will actually use this" or "users will pay for this")

Can you validate it in < 1 week without code?
  Options:
  - Landing page + email signup (do people want it?)
  - Wizard of Oz (simulate the product manually)
  - Concierge (do it manually for 5 customers)
  - Smoke test (ad driving to landing page — measures real intent)
  - Customer interviews (5-10 conversations with target users)
```

### Stage 5: Competitive Reality Check

Quick 15-minute check:
```
Search: "[problem] solution", "[product type] tools", "[problem] software"

For each competitor found:
  1. Does it actually solve the same problem?
  2. Why would users choose your version?
  3. Can you learn from their UI/UX?
  4. Is this market too crowded to enter?
```

If 3+ well-funded competitors exist → need very specific differentiation.
Not all markets are worth entering.

## Output Format

After completing all stages, produce `docs/PROJECT_SPEC.md`:

```markdown
# Project Spec: [Name]

## One-liner
[Description of what it does for who]

## Problem
[Specific pain — current behavior, frequency, cost]

## User
[Specific persona with enough detail to design for]

## Success metric
[Measurable outcome that proves it worked]

## MVP Features (max 5, ordered by priority)
1. [Feature] — [Why it's #1 priority]
2. [Feature] — [Why it's needed]
3. [Feature] — [Why it's needed]

## Out of Scope (Phase 1)
- [Feature]: [Reason deferred]

## Riskiest Assumption
[What we believe that must be true for this to work]
[How to validate it before/during build]

## Competitors
| Name | What they do | Our differentiation |
|------|-------------|-------------------|

## Next Step
[Specific first action to take]
```

## Quality checks
- [ ] Problem is specific and measurable (not vague)
- [ ] User is a specific persona (not "everyone")
- [ ] Success has a measurable metric
- [ ] Out-of-scope list exists (at least 3 things explicitly excluded)
- [ ] MVP has maximum 5 features
- [ ] Riskiest assumption identified and validation method planned
- [ ] Competitors checked (15-minute search minimum)
- [ ] Sign-off obtained before implementation begins
