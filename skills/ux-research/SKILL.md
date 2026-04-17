---
name: ux-research
description: User research — interviews, personas, journey maps, usability testing, synthesis
triggers: [user research, interview, persona, journey map, usability, user testing, discovery]
---

# SKILL: UX Research

## Purpose
Build products for how people actually behave, not how you assume they behave.
Every assumption costs money. Research is cheap. Wrong products are expensive.

## Research Methods by Stage

### Stage 1: Discovery (understand the problem space)

**User Interviews** — the gold standard

Interview guide template:
```
WARM UP (5 min):
"Tell me about your role and what you do day-to-day."

CONTEXT (10 min):
"Walk me through the last time you had to [problem area]."
"How did you handle it?"
"What tools were you using?"

PAIN POINTS (10 min):
"What was the most frustrating part of that process?"
"How long did it take? How long should it take?"
"What happens when things go wrong?"

EXISTING SOLUTIONS (5 min):
"What do you use today to solve this?"
"What do you wish it did differently?"
"Have you tried other tools? Why did you leave or stay?"

CLOSING (5 min):
"Is there anything about this topic I haven't asked that you think is important?"
"If you could wave a magic wand and fix one thing, what would it be?"
```

Interview rules:
- Record with permission (Otter.ai, Grain)
- Never lead: "Do you find it confusing?" → wrong. "How does that work for you?"
- Silence is data — let them fill it
- Follow up: "Tell me more about that."
- Ask about BEHAVIOR not OPINION: "What did you do?" not "What would you do?"
- 5-8 interviews per user segment (themes emerge by interview 5-6)

**Contextual Inquiry** (watch them work, don't just ask):
- Observe in their actual environment
- Ask "talk me through what you're doing and why"
- Note: what workarounds they use, what they ignore, where they struggle
- The magic question: "Is this how you normally do it?" (yes = insight, no = ask why different)

### Stage 2: Define (synthesize and structure)

**Affinity Diagram** (from interviews to insights):
```
Step 1: Each observation on a sticky note (one observation per note)
Step 2: Group related observations into clusters
Step 3: Name each cluster with an insight statement
Step 4: Identify the 3-5 most important clusters (highest pain, highest frequency)
```

**User Persona** (based on research — not made up):
```markdown
## [Persona Name] — [Archetype Title]

### Who they are
Age range: [range based on interview sample]
Role/context: [job title or life situation]
Technical level: [novice/intermediate/expert]
Goals: [what they're trying to achieve]
Frustrations: [top 3 pains you heard repeatedly]

### Quotes (real quotes from research)
"[direct quote that captures their main pain]"
"[quote that captures their main goal]"

### Behaviors (observed, not assumed)
- [specific behavior pattern seen in research]
- [specific behavior pattern seen in research]

### Tools they use today
- [current solution 1]
- [current solution 2]

### What success looks like for them
[specific, measurable outcome they care about]
```

**User Journey Map**:
```
Stage:    Aware → Consider → Purchase → Onboard → Use → Renew/Churn

Actions:  [what user does at each stage]
Thoughts: [what they're thinking]
Feelings: [emotional state — use emoji scale]
Pain:     [where friction is highest]
Opportunity: [where you can improve most]
```

### Stage 3: Evaluate (test what you built)

**Usability Testing** (moderated):

Test script:
```
INTRODUCTION:
"We're testing the design, not you. There are no wrong answers.
Please think out loud as you work through the tasks."

TASKS (5-7 tasks, ~60 min total):
Task 1: "[Scenario]. Please [action]. Start when you're ready."
→ Observe: confusion, mistakes, re-reads, hover hesitation
→ Note: time-on-task, success rate, verbal reactions
→ Ask after: "What were you expecting to happen there?"

DEBRIEF:
"What was most confusing?"
"What worked well?"
"What would you change?"
```

Success metrics per task:
- Completion rate: % who complete without assistance (target: >80%)
- Error rate: mistakes per task (target: <1)
- Time on task: seconds to complete (establish baseline)
- SUS Score: 10-question usability scale (score > 68 = above average)

**Unmoderated Testing** (Maze, UserTesting, Lyssna):
- Better for larger sample sizes (20-50 users)
- Click maps, heatmaps, first-click tests
- A/B tests between design alternatives
- Best for validating specific interactions

**5-Second Test** (first impressions):
Show the screen for 5 seconds, then ask:
- "What is this?"
- "What can you do here?"
- "Who is this for?"
If they can't answer correctly → clarity problem

**Accessibility Testing**:
```
Screen reader: test with VoiceOver (Mac/iOS) or NVDA (Windows)
Keyboard navigation: tab through everything — can you use without mouse?
Color blindness: Coblis or Colour Oracle simulator
Zoom: test at 200% zoom
Motor accessibility: target size ≥ 44×44px
```

### Stage 4: Quantitative Research

**Survey Design Rules**:
```
Max length: 10 minutes (5 minutes is better)
Question order: general → specific → sensitive
Scale consistency: always same direction (1=disagree, 5=agree — not reversed)
Avoid: leading questions, double-barreled questions, jargon
Test: send to 3 people before launch — fix confusion before distributing

Net Promoter Score (NPS):
"How likely are you to recommend [product] to a friend?" (0-10)
Promoters: 9-10, Passives: 7-8, Detractors: 0-6
NPS = % Promoters - % Detractors
NPS > 50 = excellent, > 0 = good, < 0 = problem

Customer Satisfaction (CSAT):
"How satisfied are you with [specific experience]?" (1-5 stars)
Target: > 4.0/5.0

Task Completion Survey (after usability test):
System Usability Scale (SUS) — 10 standard questions
Score: 68 = industry average, 80+ = excellent
```

**Analytics as Research**:
```
What to measure:
- Funnel drop-off (where do users leave the core flow?)
- Feature adoption (which features actually get used?)
- Time in app (where do users spend most time?)
- Error events (which errors happen most often?)
- Search queries (what do users search for that you might be missing?)

Tools: Mixpanel, Amplitude, PostHog (open-source), FullStory (session replay)
```

## Research Repository

Store all research so it's accessible:
```
/research
  /interviews
    /[yyyy-mm-dd]_[participant-name]_[segment].md
  /personas
    /[persona-name].md
  /journey-maps
    /[user-segment]_journey.md
  /usability-tests
    /[feature]_test_[date].md
  /surveys
    /[survey-name]_results.md
  insights.md         ← synthesized findings (update after each round)
  open-questions.md   ← what we still don't know
```

## Output
- Interview guide and conducted interview notes
- Affinity diagram findings
- 2-3 user personas (based on research, not fiction)
- User journey map(s)
- Usability test plan + results
- Prioritized insight list

## Quality checks
- [ ] Minimum 5 interviews per user segment
- [ ] Observations separated from interpretations
- [ ] Personas based on research patterns (not assumptions)
- [ ] Journey map includes emotions, not just actions
- [ ] Usability test includes success metrics (not just "did it feel good?")
- [ ] Quantitative data backs up qualitative findings
