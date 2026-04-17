---
name: knowledge-management
description: Obsidian, PKM, second brain — organize and connect knowledge for long-term value
triggers: [obsidian, notes, knowledge base, PKM, second brain, zettelkasten, organize, notes system]
---

# SKILL: Knowledge Management

## Purpose
Build a knowledge system that grows more valuable over time, not more cluttered.

## Principles
1. **Capture** — low friction, everything that might matter
2. **Process** — organize periodically, not constantly
3. **Connect** — links between ideas, not just folders
4. **Create** — use the knowledge, don't just collect it

## Obsidian Vault Structure
```
vault/
├── 00-Inbox/          ← Unprocessed captures
├── 01-Projects/       ← Active projects (have deadline)
├── 02-Areas/          ← Ongoing responsibilities (no deadline)
├── 03-Resources/      ← Topics of interest (reference)
├── 04-Archive/        ← Inactive projects/areas
├── 05-Fleeting/       ← Rough daily notes
├── 06-Permanent/      ← Processed atomic notes
└── 07-Templates/      ← Note templates
```

## Note Types

### Fleeting Note (fast capture)
```markdown
---
type: fleeting
date: {{date}}
---
# Quick capture — will process later
[rough thought, link, idea]
```

### Permanent Note (processed insight)
```markdown
---
type: permanent
created: {{date}}
tags: [topic1, topic2]
links: [[related-note]]
---
# [One clear idea — statement, not question]

[Explain the idea in your own words, 100-300 words]

## Connections
- [[link to supporting note]]
- [[link to related note]]
- Contradicts: [[link to opposing note]]

## Source
[Where this came from]
```

### Project Note
```markdown
---
type: project
status: active | complete | someday
deadline: [date]
---
# [Project Name]

## Goal
[What done looks like]

## Next Action
[Specific next physical action]

## Notes
[Running notes]
```

## Zettelkasten Method (for deep thinkers)
1. Each note = one idea (atomic)
2. Notes have unique IDs (timestamp-based)
3. Every note links to at least one other note
4. Notes cluster naturally into "maps of content"
5. Outlines and essays emerge from linked notes

## Daily Note Template
```markdown
# {{date}}

## Focus today
- [ ] Most important task

## Captures
[Fleeting notes from the day]

## Reflections
[End of day: what did I learn? what surprised me?]
```

## Quality checks
- [ ] Inbox processed weekly (not daily, not never)
- [ ] New notes connect to at least 2 existing notes
- [ ] Tags are few and meaningful (not hundreds)
- [ ] MOC (Map of Content) pages exist for major topics
- [ ] Archive used for dead projects (don't delete, archive)
