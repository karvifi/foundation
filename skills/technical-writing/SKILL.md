---
name: technical-writing
description: Write documentation that developers actually read — API docs, READMEs, guides, runbooks
triggers: [documentation, docs, readme, guide, tutorial, runbook, API docs, technical writing]
---

# SKILL: Technical Writing

## Purpose
Write documentation that helps people get things done — not documentation that proves something was documented.
Good docs = fewer support tickets, faster onboarding, higher adoption.

## The Documentation Types

### 1. README (first contact — has 30 seconds to convince)
```markdown
# [Project Name]

[One sentence: what it does for who]

## Quick Start (5 steps MAX to working state)

```bash
npm install my-package
```

```javascript
const tool = require("my-package");
const result = tool.doThing({ input: "example" });
console.log(result); // { success: true, output: "..." }
```

## Why [Project Name]?
[3-5 bullets — benefits, not features]

## Installation
[Complete install instructions with prerequisites]

## Usage
[Most common use cases with complete runnable examples]

## API Reference
[Or link to separate docs]

## Contributing
[Link to CONTRIBUTING.md]

## License
[License name + link]
```

README Rules:
- Code example in first 10 lines (show, don't describe)
- Every code example is copy-pasteable and runnable
- No assumed knowledge (link to it instead)
- Keep it under 500 lines (link to docs for depth)

### 2. Tutorial (learning-oriented — follow along)
```
Goal: Reader completes a specific outcome (builds something working)
Structure:
  1. What you'll build (show the end result first)
  2. Prerequisites (be exact — not "basic knowledge of Python")
  3. Step N: [Action verb] + [what + why]
     → Code block
     → Expected output
  4. What you just built (reinforce learning)
  5. Next steps (where to go from here)

Rules:
  - Every step works when followed in order
  - Show expected output after every command
  - Explain WHY, not just WHAT
  - Don't assume context — define every variable and file path
  - Test the tutorial yourself before publishing
```

### 3. How-To Guide (task-oriented — solve a specific problem)
```
Goal: Complete a specific task (minimal context)
Structure:
  [Title]: "How to [specific task]"
  Prerequisites: [only what's needed for this task]
  Steps: numbered, specific commands
  Troubleshooting: common errors + fixes
  
Rules:
  - Title is a task ("How to configure authentication") not a noun ("Authentication")
  - Assumes the reader knows what they're doing — skip theory
  - Short and scannable — people have a problem to solve
```

### 4. Reference (information-oriented — look up specifics)
```
Goal: Document everything (comprehensive, scannable)
Structure for API reference:
  
  ## function_name(param1, param2)
  
  [One-line description]
  
  ### Parameters
  | Name | Type | Required | Default | Description |
  |------|------|----------|---------|-------------|
  | param1 | string | yes | — | The input value to process |
  
  ### Returns
  Type: Promise<Result>
  [Description of return value]
  
  ### Example
  ```javascript
  const result = await functionName("input", { option: true });
  // Returns: { success: true, data: "..." }
  ```
  
  ### Errors
  | Error | When it occurs |
  |-------|---------------|
  | InvalidInputError | When param1 is empty |
  
Rules:
  - Every parameter documented
  - Every return value documented
  - Every possible error documented
  - Working example for every function
  - Alphabetical order within sections
```

### 5. Explanation (concept-oriented — build understanding)
```
Goal: Explain WHY and HOW something works
Structure:
  - Start from what the reader already knows (analogies)
  - Build up complexity gradually
  - Use diagrams for anything with components/flow
  - End with: "now you understand X, you can do Y"
  
Example opening (BAD):
  "Authentication is the process of verifying identity."
  
Example opening (GOOD):
  "Imagine you have a bouncer at a club. The bouncer checks your ID.
   That's authentication — verifying you are who you say you are.
   What the bouncer does AFTER checking your ID (letting you into VIP or not)
   — that's authorization. These are different things."
```

### 6. Runbook (operations-oriented — respond to incidents)
```
# Runbook: [System/Service Name]

## Overview
What this service does (2 sentences)
Criticality: P0 / P1 / P2 / P3
Owner: [team/person]

## Monitoring
Dashboard: [URL]
Alerts: [alert names and what they mean]
Logs: [how to access]

## Common Issues

### [Issue Name] (most common issues first)
Symptoms: [what the alert/user report says]
Impact: [who is affected and how]
Diagnosis:
  1. Check [metric] at [URL]
  2. Run `[command]` and look for [pattern]
  3. Check logs: `[log query]`
Resolution:
  1. [specific command to run]
  2. [verify with this check]
Escalation: If unresolved after [X] minutes, page [person/team]

## Deployment
Deploy command: `[exact command]`
Rollback command: `[exact command]`
Deployment takes: ~[N] minutes
Verify deployment: [how to confirm it worked]

## On-Call Notes
- [quirk or gotcha that anyone running this needs to know]
- [service X depends on this — failures here affect service X]
```

## Writing Style Guide

### The 5 Rules for Technical Writing
```
1. ONE idea per paragraph
   Bad: "The API returns JSON. You need to set Content-Type. Also rate limits apply."
   Good: Three separate paragraphs.

2. ACTIVE VOICE
   Bad: "The configuration file should be created by the user."
   Good: "Create the configuration file."

3. SPECIFIC, not VAGUE
   Bad: "Install the dependencies."
   Good: "Run `npm install` to install the required packages."

4. CURRENT TENSE
   Bad: "The API will return an error when..."
   Good: "The API returns an error when..."

5. SHOW EXPECTED OUTPUT
   Bad: "Run the start command."
   Good: 
   ```bash
   npm start
   # Expected output:
   # Server running on http://localhost:3000
   # Database connected: postgres://localhost:5432/mydb
   ```
```

### Avoiding Common Mistakes
```
✗ "Simply" or "Just" or "Easy" — condescending when the reader is stuck
✗ "As mentioned above" — docs get rearranged; use links
✗ Passive voice — "The button should be clicked" → "Click the button"
✗ Jargon without definition — define on first use
✗ Screenshots without captions — "Figure 3" tells nothing
✗ No version numbers — document which version this applies to
✗ Stale examples — test all code examples before publishing
✗ Long sentences — max 25 words per sentence
```

## Documentation Testing
Before publishing:
```
□ Code examples run without error (copy-paste test)
□ New employee / external developer can follow tutorial start to finish
□ No broken links
□ No undefined terms or unexplained acronyms
□ API reference covers 100% of public surface
□ Runbook has been followed during an actual incident
```

## Output
- README with quick start, installation, usage, API reference
- Getting started tutorial (beginner can complete in < 30 min)
- How-to guides for top 5 user tasks
- Complete API reference
- Runbook for operations (if applicable)

## Quality checks
- [ ] Code examples are tested and runnable
- [ ] README has a working example in first 10 lines
- [ ] API reference has examples for every function
- [ ] No "simply," "just," or "easy" anywhere
- [ ] Tutorial tested by someone who hasn't built the thing
- [ ] Runbook tested during an actual (or simulated) incident
