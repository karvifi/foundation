---
name: writing-skills
description: Create new skills for the framework — structure, content, examples, testing
triggers: [create skill, write skill, new skill, framework skill, skill creation, extend skills]
---

# SKILL: Writing Skills

## Skill Structure

```yaml
---
name: [skill-name]                    ← unique identifier
description: [one sentence]           ← what it does
triggers: [keyword, list, activation] ← when to use
---

# SKILL: [Name]

## Purpose (why this skill exists)
[One paragraph explaining the value]

## Core Concept
[The main pattern or approach]

## Complete Example
[Full, working, copy-paste-able example]

## [Sub-pattern 1]
[Explanation with code examples]

## [Sub-pattern 2]
[Explanation with code examples]

## Quality Checks
- [ ] [requirement 1]
- [ ] [requirement 2]
- [ ] [requirement 3]
```

## Writing a Skill (step-by-step)

### Step 1: Define the Scope
```
What problem does this solve?
Who is the audience?
When would they use this?
What will they be able to do after?
```

### Step 2: Create the Structure
```
Use the template above
Fill in the outline first
No content yet, just sections
```

### Step 3: Write the Content
```
Purpose: Clear, one paragraph
Core Concept: The "why" behind the approach
Example: Full, working example (test it first!)
Sub-patterns: 2-3 variations or related patterns
Quality checks: objective, testable requirements
```

### Step 4: Make it Actionable
```
Every section should be:
  ✓ Immediately usable (copy-paste code examples)
  ✓ Complete (no "see elsewhere for details")
  ✓ Tested (code examples actually work)
  ✓ Practical (grounded in real scenarios)
```

### Step 5: Test the Skill
```
1. Follow the examples yourself
   → Do they work as described?
2. Have someone unfamiliar try it
   → Can they understand?
3. Check quality criteria
   → Are they objective?
   → Can you verify them?
```

## Skill Quality Standards

```
Minimum 1500 characters (typically 2000-3000)
At least 2 working code examples
Examples use realistic scenarios
Language clear (no jargon without explanation)
Quality checks are specific and testable
Related skills cross-referenced
Skill should be usable standalone
```

## Quality checks
- [ ] Skill addresses single, clear topic
- [ ] Examples are complete and tested
- [ ] Quality checks are objective
- [ ] At least 1500 characters
- [ ] Could be used standalone (not dependent on other skills)
- [ ] Added to THE_BIBLE.md skills index
