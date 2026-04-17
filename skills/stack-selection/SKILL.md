---
name: stack-selection
description: Choose technology stack — language, framework, database, hosting based on requirements
triggers: [stack, technology, choose framework, language selection, architecture, tech choice]
---

# SKILL: Stack Selection

## Decision Matrix

For each decision point:

| Factor | Python | TypeScript | Go |
|--------|--------|-----------|-----|
| Speed | Slow | Medium | Fast |
| Learning | Easy | Medium | Hard |
| Ecosystem | Huge | Large | Growing |
| Deployment | Easy | Easy | Easy |
| Team skill | ✓ | ✓ | ✗ |

Score: multiply team_skill × team_preference
→ Choose highest score

## Quick Selection Guide

```
NEW STARTUP → TypeScript (full-stack)
  Why: One language, large ecosystem, fast to ship

DATA SCIENCE → Python
  Why: Libraries (pandas, scikit-learn), ecosystem, speed to ML

PERFORMANCE CRITICAL → Go
  Why: Fast, concurrent, compiled, small binary

TRADITIONAL WEB → Python/Django or Rails
  Why: Mature, batteries included, large community

API MICROSERVICE → Go or Python
  Why: Both good, Go if performance critical
```

## Database Selection

```
Start with PostgreSQL.
Only deviate if:
  - You need horizontal scaling (Cassandra)
  - You need NoSQL flexibility (MongoDB)
  - You need analytics (Snowflake)
  - You have specific compliance needs
```

## Hosting Selection

```
≤ 1000 DAU       → Any (Render, Railway, Heroku)
1k - 10k DAU     → PaaS (Fly.io, Vercel)
10k+ DAU         → IaaS (AWS, GCP) or PaaS
                   (depends on ops team size)
```

## Quality checks
- [ ] Team skills assessed
- [ ] Project requirements clear
- [ ] Language/framework decision documented (with reasoning)
- [ ] Database choice justified
- [ ] Hosting platform chosen
- [ ] Technology decision sign-off obtained
- [ ] Comparison made to alternatives
