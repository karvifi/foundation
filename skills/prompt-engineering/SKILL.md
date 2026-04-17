---
name: prompt-engineering
description: Write effective prompts for Claude — structure, examples, clarity, goal clarity
triggers: [prompt, ask Claude, how to ask AI, write better prompt, improve prompt, LLM prompt]
---

# SKILL: Prompt Engineering

## The Prompt Structure

```
[CONTEXT]
You are [role], expert in [domain].
You work for [organization].
Your goal is [specific goal].

[INPUT]
[The actual thing to process/analyze/generate]

[INSTRUCTIONS]
Do:
  1. [Action 1]
  2. [Action 2]
  3. [Action 3]

Don't:
  1. [Anti-pattern 1]
  2. [Anti-pattern 2]

[OUTPUT FORMAT]
Return: [specific format - JSON, markdown, table, etc]
```

## Prompt Examples

### Poor Prompt
```
"Write an article about AI."
```
Problems:
- What kind of article? (blog, research, technical?)
- For whom? (experts? beginners?)
- How long?
- What's the tone?
- What angle?

### Good Prompt
```
You are a technical writer at a SaaS company.
Write a 1000-word blog post about prompt engineering.

Audience: Engineers with 5+ years experience, familiar with LLMs.
Goal: Convince them that prompt engineering matters.

Structure:
1. Hook (Why does this matter?)
2. Problem (What goes wrong without good prompts?)
3. Solution (How prompt engineering fixes it)
4. Examples (Show what good prompts look like)
5. Conclusion (Takeaway)

Tone: Professional but conversational (not academic)
Include: 2-3 code examples of good vs bad prompts
```

## Effective Prompt Techniques

### 1. Role Assignment
```
Bad: "Explain X"
Good: "You are a {expert} at {domain}. Explain X"
Best: "You are [role] with [specific experience]. 
        Your audience is [specific people].
        Explain X."
```

### 2. Outcome Clarity
```
Bad: "Generate ideas"
Good: "Generate 5 business ideas for solopreneurs"
Best: "Generate 5 business ideas for solopreneurs
       with $0 startup cost,
       can launch in 1 week,
       target profitable within 3 months"
```

### 3. Example-Driven
```
Bad: "Write product copy"
Good: "Write product copy [with examples]"

Format:
  Headline: [what benefit they get]
  Subheading: [how you deliver it]
  Body: [3 bullet points with specific proof]

Example:
  GOOD: "Headline: Track time in 10 seconds"
  BAD: "Headline: Time tracking software"
```

### 4. Constraints
```
With constraints:
  "Write a 100-word summary" (specific length)
  "Use simple language" (target audience)
  "No jargon" (clarity requirement)
  "Include pricing" (required element)
```

## Testing Prompt Quality

```
1. Ask 3 times, get 3 different outputs
   → If all similar = prompt is clear
   → If very different = prompt is ambiguous

2. Give to someone else
   → Can they understand what you want?
   → Do they produce what you expect?

3. Compare with bad prompt
   → Is output clearly better?
```

## Quality checks
- [ ] Role/context stated clearly
- [ ] Goal explicitly stated
- [ ] Target audience specified
- [ ] Output format specified
- [ ] Examples provided (good vs bad)
- [ ] Constraints included
- [ ] Do's and Don'ts listed
- [ ] Prompt tested multiple times
