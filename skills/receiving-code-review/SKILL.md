---
name: receiving-code-review
description: Receive and respond to code review feedback — learn, improve, push back thoughtfully
triggers: [code review feedback, PR comments, reviewer comment, respond to review, address feedback]
---

# SKILL: Receiving Code Review

## How to Respond

### When Reviewer is Right
```
✅ GOOD RESPONSE:
"Good catch! That could fail if user passes empty string.
 I'll add validation: if not email: raise ValidationError"

❌ BAD RESPONSE:
"I tested it, it works"
"I didn't think of that"
"Ok I'll fix it"
```

### When Reviewer is Wrong
```
✅ GOOD RESPONSE:
"I see how that looks ambiguous. The logic is:
 1. Check cache (fast path)
 2. If miss, query DB (slow path)
 3. Store in cache (for next time)
 
 This is intentional for performance. Would it be clearer
 if I renamed the function to express_cached_query()?"

❌ BAD RESPONSE:
"That's not how it works"
"You're wrong"
"It's obvious"
```

### When Reviewer Suggests an Alternative
```
✅ GOOD RESPONSE:
"I like that approach! I used X because [reason],
 but your Y approach is actually simpler.
 Let me switch to Y."

OR

"Your approach would be cleaner, but it requires
 refactoring Z which is out of scope for this PR.
 I'll track it as tech debt: [issue link]"
```

## Addressing Feedback Process

### Step 1: Understand the Feedback
```
If confused, ask for clarification:
"I want to make sure I understand:
 Are you saying [specific thing]?
 Or [alternative interpretation]?"
```

### Step 2: Update Code
```
# Make the change
# Run tests to verify nothing breaks
pytest
ruff check src/
mypy src/
```

### Step 3: Reply to Reviewer
```
"Fixed: [brief description of change]
 [Link to the code change or line number]
 Ready for re-review"
```

### Step 4: Request Re-Review
```
In GitHub: click "Request review" or comment:
"@reviewer please take another look, I've addressed your feedback"
```

## Learning from Reviews

After each review, ask:
```
1. What pattern should I remember?
2. What mistake did I make?
3. Will I catch this next time?
4. Who else on the team should know?
```

Document in docs/PATTERNS.md or team notes.

## Quality checks
- [ ] Understand each piece of feedback (ask if unclear)
- [ ] Acknowledge valid feedback positively
- [ ] Explain reasoning if disagreeing (not defensive)
- [ ] Make changes or track as tech debt
- [ ] Respond to every comment
- [ ] Request re-review once complete
