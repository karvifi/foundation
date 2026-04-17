---
name: auto-research
description: Autonomous research pipeline — comprehensive investigation with synthesis and actionable output
triggers: [research this, find out, investigate, look into, what exists, autonomous research]
---

# SKILL: Auto Research

## Purpose
Conduct comprehensive research autonomously — from question to actionable findings — without needing constant direction.

## Process

### Phase 1: Question Decomposition
Break the research question into sub-questions:
- Core question (what needs to be known)
- Context questions (background needed)
- Comparative questions (what alternatives exist)
- Gap questions (what is unknown or unsettled)

### Phase 2: Multi-Source Intelligence Gathering

**Primary sources (use MCP tools):**
```
brave-search MCP:
- "[topic] research 2024 2025"
- "[topic] state of the art"
- "[topic] best practices"
- "[topic] common mistakes"
- "[topic] vs [alternative]"

github MCP:
- Search repos: gh search repos [topic] --sort stars
- Find implementations: gh search code [topic]

fetch MCP:
- Official documentation
- Academic papers (arXiv, PubMed, Semantic Scholar)
- Industry reports

context7 MCP:
- Official library/framework documentation
```

**Information triage:**
- Tier 1: Primary sources (official docs, peer-reviewed, original research)
- Tier 2: Secondary sources (established blogs, reputable news)
- Tier 3: Community sources (Stack Overflow, Reddit, forums)

### Phase 3: Synthesis
For each sub-question, produce:
- What is definitively known (with sources)
- What is contested (multiple valid views)
- What is unknown (gaps)
- What this means for the project/decision

### Phase 4: Actionable Output
Convert research into decisions:
- What should we USE? (with reasoning)
- What should we AVOID? (with reasoning)
- What needs MORE RESEARCH? (specific questions)
- What is the RECOMMENDATION? (concrete)

## Output Template
```markdown
# Research Report: [Topic]
Date: [date]
Sources: [count] primary, [count] secondary

## Executive Summary (3 sentences max)
[What was found + key recommendation]

## Key Findings
### [Finding 1 — most important]
Evidence: [source]
Confidence: High / Medium / Low

### [Finding 2]
...

## Competitive Landscape (if applicable)
| Option | Pros | Cons | Best for |
|--------|------|------|---------|

## Recommendation
**Use: [X]**
Because: [specific reasons tied to the project context]

## What Needs More Research
- [specific open question]

## Sources
- [URL]: [what it provided] — [date]
```

## Quality checks
- [ ] Every claim has a source
- [ ] No fabricated data or statistics
- [ ] Contradicting sources acknowledged
- [ ] Recommendation is specific, not vague
- [ ] Research is recent (within 6 months for fast-moving fields)
