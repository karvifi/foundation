---
name: obsidian-knowledge
description: Obsidian vault design, PKM systems, Zettelkasten, linked thinking, templates, plugins
triggers: [obsidian, vault, PKM, second brain, zettelkasten, note-taking, knowledge base, linked notes]
---

# SKILL: Obsidian Knowledge Management

## Purpose
Build a knowledge system that compounds over time — where every note you write makes the whole vault smarter.
Obsidian is a markdown-based PKM where notes link to each other, forming a graph of knowledge.

## Vault Architecture

### The PARA System (Projects, Areas, Resources, Archive)
```
vault/
├── 00 - Inbox/                    ← Capture everything, process weekly
├── 01 - Projects/                 ← Active projects with deadlines
│   ├── Project A/
│   │   ├── _Project Overview.md   ← Goal, status, next actions
│   │   ├── Meeting Notes/
│   │   ├── Research/
│   │   └── Deliverables/
├── 02 - Areas/                    ← Ongoing responsibilities (no deadline)
│   ├── Work/
│   ├── Health/
│   ├── Learning/
│   └── Finance/
├── 03 - Resources/                ← Topics of interest (reference material)
│   ├── Technology/
│   ├── Business/
│   ├── Science/
│   └── History/
├── 04 - Archive/                  ← Completed projects, inactive areas
├── 05 - Atlas/                    ← Maps of Content (MOCs)
│   ├── Home.md                    ← Your vault homepage
│   ├── MOC - Technology.md
│   └── MOC - Business.md
├── 06 - Calendar/                 ← Daily, weekly, monthly notes
│   ├── Daily/
│   │   └── 2024-01-15.md
│   └── Weekly/
│       └── 2024-W03.md
└── Templates/
    ├── Daily Note.md
    ├── Project Note.md
    ├── Meeting Note.md
    ├── Book Note.md
    └── Permanent Note.md
```

## Note Types and Templates

### Daily Note Template
```markdown
---
type: daily
date: {{date:YYYY-MM-DD}}
day: {{date:dddd}}
week: {{date:YYYY-[W]WW}}
---

# {{date:MMMM Do, YYYY}}

## 🎯 Top 3 Today
- [ ] 
- [ ] 
- [ ] 

## 📅 Schedule
- 

## 📝 Notes & Captures
[raw captures throughout the day]

## 🔗 Linked to
[links to relevant notes, projects, areas]

## 🌅 End of Day
### What went well
- 

### What to improve
- 

### Tomorrow's priority
1. 
```

### Permanent Note Template (Zettelkasten)
```markdown
---
type: permanent
id: {{date:YYYYMMDDHHmm}}
created: {{date:YYYY-MM-DD}}
tags: []
status: seed | growing | evergreen
---

# [One clear, specific claim — not a topic]
# Bad: "Machine Learning"
# Good: "Gradient descent finds the minimum of a loss function by following the slope"

## The idea
[Explain the concept in your own words, 100-300 words.
Write as if explaining to a smart friend who doesn't know this topic.
Never copy-paste — rewrite from scratch.]

## Why this matters
[Why should I care about this? What does it enable or explain?]

## Connections
- Supports: [[note that this strengthens or proves]]
- Contradicts: [[note that argues the opposite]]
- Related: [[tangentially connected note]]
- See also: [[note that goes deeper on this]]

## Source
[Where this came from — book, paper, conversation, experience]
[Quote if relevant: "..." (Author, Year, p.X)]
```

### Meeting Note Template
```markdown
---
type: meeting
date: {{date:YYYY-MM-DD}}
attendees: []
project: 
tags: [meeting]
---

# Meeting: [Topic]
Date: {{date:YYYY-MM-DD HH:mm}}
Attendees: 

## Context
[Why is this meeting happening?]

## Agenda
- 

## Notes
[Raw notes during meeting]

## Decisions Made
- 

## Action Items
- [ ] [Who] will [do what] by [when]
- [ ] 

## Follow-up
[What needs to happen next]
```

### Book/Article Note Template
```markdown
---
type: literature
author: 
published: 
read-date: {{date:YYYY-MM-DD}}
rating: /5
tags: []
status: reading | finished | abandoned
---

# [Book Title] — [Author]

## One-sentence summary
[The core idea of the whole book in one sentence]

## Key insights (your words, not theirs)
1. [Insight] → [[link to permanent note if worth developing]]
2. [Insight]
3. [Insight]

## Best quotes
> "[Quote]" (p.X)

## What I want to apply
- [Specific application in my own context]

## Questions this raises
- [Question]

## Connection to other ideas
- [[connected permanent note]]
```

## The Zettelkasten Method

### Core Principles
```
1. Atomic: one idea per note (never "everything about topic X")
2. Written in your own words (forces understanding, not collection)
3. Linked: every note connects to at least 2 others
4. Permanent: notes are evergreen, updated as understanding grows
5. Indexed: discoverable via Maps of Content and tags
```

### The Capture-Process-Link Cycle
```
CAPTURE (daily): low friction, anything interesting
  → Fleeting notes in Inbox
  → Readwise highlights
  → Voice memos
  → Quick note in mobile Obsidian

PROCESS (weekly 30-60 min): inbox zero
  For each capture:
  1. Delete (not worth keeping)
  2. File (reference material → Resources folder)
  3. Extract insight (worth developing → create Permanent Note)
  
LINK (during processing):
  Every new permanent note:
  → Find 2-3 existing notes to link to
  → Update linked notes to link back
  → Add to relevant MOC if significant
```

### Maps of Content (MOC)
```
A MOC is a note that links to many related notes — your topical index.

Example: MOC - Machine Learning.md
---
# Machine Learning — Map of Content
Last updated: {{date}}

## Fundamentals
- [[Gradient descent explained]]
- [[Overfitting vs underfitting]]
- [[Bias-variance tradeoff]]

## Algorithms
- [[Linear regression]]
- [[Random forests]]
- [[Neural networks basics]]

## Applications
- [[Computer vision pipeline]]
- [[NLP tokenization]]

## Open Questions
- [[Why do transformers work so well?]]

## Projects
- [[Churn prediction model]]
```

## Essential Plugins

### Core Plugins (enable these)
```
Graph View: visual map of all connections
Backlinks: see what links to current note
Tags: tag system for filtering
Templates: note templates
Daily Notes: daily note creation
Starred: bookmark important notes
Outline: document outline view
```

### Community Plugins (install these)
```
Dataview: query your notes like a database
  Example: LIST FROM "Projects" WHERE status = "active"

Templater: advanced template system with scripting
Calendar: visual calendar for daily notes
Periodic Notes: weekly/monthly/quarterly note templates
Obsidian Git: auto-backup to GitHub every N minutes
Excalidraw: hand-drawn diagrams inside Obsidian
Citations: reference manager integration (Zotero)
Omnisearch: better full-text search
Reading Time: estimated reading time for notes
```

## Dataview Queries

### Dashboard queries
```
# Active Projects
\`\`\`dataview
TABLE status, file.mtime as "Last Modified"
FROM "01 - Projects"
WHERE type = "project" AND status != "complete"
SORT file.mtime DESC
\`\`\`

# Books Read This Year
\`\`\`dataview
TABLE author, rating
FROM "03 - Resources"
WHERE type = "literature" AND status = "finished"
  AND read-date >= date(2024-01-01)
SORT rating DESC
\`\`\`

# Notes Created This Week
\`\`\`dataview
LIST
FROM ""
WHERE file.ctime >= date(today) - dur(7 days)
SORT file.ctime DESC
\`\`\`
```

## Maintenance Routine

### Weekly (30 min)
```
□ Process entire Inbox to zero
□ Write 3-5 permanent notes from the week's captures
□ Review active projects — update status
□ Weekly note: review + plan next week
□ Check orphan notes (unlinked) — link or delete
```

### Monthly (1 hour)
```
□ Review and update all active Projects
□ Archive completed projects
□ Prune tags (consolidate similar tags)
□ Monthly review note
□ Check broken links (Obsidian built-in)
□ Review least-accessed notes — integrate or archive
```

## Output
- Vault folder structure
- Core templates (daily, permanent, meeting, book)
- Plugin configuration
- MOC structure for main topics
- Processing workflow documentation

## Quality checks
- [ ] Permanent notes are claims, not topics
- [ ] Every permanent note written in own words
- [ ] Every new note linked to at least 2 existing notes
- [ ] Inbox processed to zero at least weekly
- [ ] MOCs exist for 3-5 major interest areas
- [ ] Vault backed up (Obsidian Git or iCloud/Dropbox)
