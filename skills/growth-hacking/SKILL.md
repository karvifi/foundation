---
name: growth-hacking
description: Systematic growth experiments — acquisition, activation, retention, revenue, referral
triggers: [growth, viral, acquisition, retention, churn, activation, AARRR, funnel, experiment]
---

# SKILL: Growth Hacking

## Purpose
Build a systematic machine for growth — not random tactics, but a structured experiment framework.
Growth hacking is growth via experiments that compound.

## The AARRR Framework (Pirate Metrics)

### Acquisition (getting users)
```
Metric: New users / signups per week
Sources to track separately:
  - Organic search (SEO)
  - Paid (Google/Meta/LinkedIn ads)
  - Referral (existing user invitations)
  - Direct (type in URL / brand search)
  - Social (organic posts)
  - Product Hunt / launches
  - Content / word of mouth

Experiments to run:
  1. Content SEO: target 10 long-tail keywords with tutorials
  2. Comparison pages: "[competitor] vs [product]" (high commercial intent)
  3. Free tools: build a free tool that your ICP uses (drives organic acquisition)
  4. Community building: answer every question in 3 target communities for 90 days
  5. Cold outreach: personalized emails to ICP companies using custom triggers
  6. Partnerships: integration with tools your ICP already uses
```

### Activation (getting users to their "aha moment")
```
Metric: % of new signups who complete core action within 7 days
Aha moment: the moment users get undeniable value
  Example: Dropbox aha = when a file syncs across two devices
  Example: Slack aha = when team sends 2000 messages
  Example: GitHub aha = when first pull request is merged

Finding your aha moment:
  1. Survey churned users: "What didn't you get out of [product]?"
  2. Survey retained users: "What was the first moment you found [product] valuable?"
  3. Analyze data: what actions do Day 30 retained users do in first 7 days?

Activation experiments:
  1. Reduce time to aha (fewer steps, faster setup)
  2. Progress indicators (show users how far they are)
  3. Sample data/templates (let users see value before entering their own data)
  4. In-app guidance (tooltips, checklists, guided tours)
  5. Email sequence timed to drive aha moment actions
  6. Remove features/fields from signup that delay getting started
```

### Retention (keeping users)
```
Metric: Day 7, Day 30, Day 90 retention rates
  Good benchmarks (SaaS):
    Day 7: > 60%
    Day 30: > 30%
    Day 90: > 15%

Retention experiments:
  1. Habit loop: give users a reason to return daily/weekly
  2. Progress metrics: show users their growth over time
  3. Email/notification re-engagement at key drop-off points
  4. Feature discovery: proactively show advanced features to active users
  5. Integrations: connect to tools users use daily (increases stickiness)
  6. Community: users who join community retain 2-5x better
  7. Customer success: proactive outreach to users at churn risk signals

Churn analysis:
  - Interview churned users (5-10 conversations)
  - Survey churned users (at cancellation: "why are you leaving?")
  - Identify cohort patterns (do users from X channel churn faster?)
  - Identify behavioral signals that predict churn 30 days before it happens
```

### Revenue (making money)
```
Metric: MRR, ARPU, expansion revenue %

Expansion revenue experiments:
  1. Usage-based upsell triggers (notify when approaching limits)
  2. Feature gates (valuable features behind paid tier)
  3. Seat expansion (team usage drives adds)
  4. Annual billing discount (reduce churn, improve cash flow)
  5. Add-ons / marketplace (additional paid features)
  6. Success metrics in-product (show users their ROI → makes upgrade easy)

Pricing experiments:
  1. Price increase test (raise prices 20-30% on new customers)
  2. Plan restructuring (move features between tiers to optimize conversion)
  3. Freemium vs. free trial test (which gets more paying customers?)
  4. Remove lowest tier (often makes more money despite fewer customers)
```

### Referral (users bringing users)
```
Metric: viral coefficient K = (invites sent per user) × (% who sign up)
  K > 1 = exponential growth (viral)
  K > 0.5 = significant free growth supplement
  K < 0.1 = referral barely moving the needle

Referral experiments:
  1. Two-sided incentives (both sender and receiver get value)
  2. Share milestones (share when they achieve something worth sharing)
  3. Collaboration invite (product requires inviting others to get value)
  4. Embeddable badge/widget ("made with [product]")
  5. Public sharing (user's output is publicly visible, drives discovery)
  6. Waitlist with referral queue (move up by inviting friends)
```

## The Growth Experiment Process

### Experiment Template
```
Hypothesis:
"We believe [doing X] will [cause Y] because [evidence/reasoning]."
"We believe adding a tooltip on the dashboard will increase activation by 15%
 because churned users told us they didn't know about the core feature."

Test:
  Control: [current experience]
  Variant: [changed experience]
  Sample size needed: [use A/B test calculator — minimum detectable effect 10%, 95% confidence]
  Duration: [usually 2 weeks minimum — avoid novelty effects]

Success metric (ONE primary metric):
  Primary: [the number that proves/disproves the hypothesis]
  Guardrails: [metrics that must not decline — revenue, NPS, error rate]

Results:
  Winner: Control / Variant / Inconclusive
  Learnings: [what we learned regardless of outcome]
  Next experiment: [what this tells us to test next]
```

### Growth Prioritization (ICE Framework)
Score each experiment:
- **I**mpact: how much will it move the primary metric? (1-10)
- **C**onfidence: how sure are we it will work? (1-10)
- **E**ase: how fast/cheap to run? (1-10)

ICE score = (I + C + E) / 3 → highest score = run first

### Growth Meeting Cadence
```
Weekly growth review (30 min):
  - Results of running experiments
  - New experiments to prioritize this week
  - One metric that's moving vs. not moving → root cause

Monthly growth review (2 hours):
  - Top 3 experiments that moved the needle
  - Cohort analysis trends
  - Next quarter experiment roadmap
```

## Output
- AARRR metrics dashboard with current baselines
- 10-experiment backlog (ICE scored)
- 3 running experiments (with hypotheses and success metrics)
- Monthly growth review format

## Quality checks
- [ ] Each funnel stage has a clear metric and current baseline
- [ ] Experiments have specific hypotheses (not "let's try...")
- [ ] Sample size calculated before starting (not after)
- [ ] One primary metric per experiment
- [ ] Guardrail metrics defined (what must not break)
- [ ] Learnings documented even for losing experiments
