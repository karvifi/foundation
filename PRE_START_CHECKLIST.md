# PRE-START CHECKLIST — UNIFIED AI FOUNDATION
# ════════════════════════════════════════════════════════════════
# USE THIS: Before starting ANY project (new or resuming)
# PURPOSE:  Prevent starting to build before you know what you are building
# RESULT:   Zero wasted tokens. Zero context loss. Zero rework.
# ════════════════════════════════════════════════════════════════

## HOW TO USE THIS FILE

Give this file to your AI at the start of every session:
> "Read PRE_START_CHECKLIST.md and work through it with me for [project name]."

Mandatory references before implementation:
```
□ ULTRA_CONSTITUTION.md
□ PRESTART_INTAKE_QUESTIONNAIRE.md
□ skills/ultrathinking/SKILL.md
□ skills/ultraplanning/SKILL.md
```

---

## PHASE 0 — CONTEXT RECOVERY (for resuming work)

AI: Before doing anything, read these in order:
```
□ docs/PROGRESS.md              — what was done last session
□ docs/ARCHITECTURE_DECISIONS.md — WHY things are built the way they are
□ Query memory MCP: "get all entities for [project-name]"
□ Read CLAUDE.md if not read this session
□ Scan recent git log: last 10 commits tell the story
```

---

## PHASE 1 — DEFINE THE THING

Before Q1, run `PRESTART_INTAKE_QUESTIONNAIRE.md` fully.
If answers are incomplete, implementation is blocked.

**Q1. What are we building?**
- Type: [web app / API / script / AI agent / mobile app / tool / other]
- Name: [project name]
- One sentence: [what it does for who]

**Q2. Who is it for and what is their #1 pain point?**
- Primary user: [who]
- Their problem: [specific pain they have today]

**Q3. What does "done" look like?**
- MVP must have: [3-5 features, not more]
- Out of scope: [what we are explicitly NOT building]
- Success metric: [how do we know it worked?]

**Q4. What already exists?**
- Existing code: [none / partial / repo URL]
- Integrations needed: [Stripe, Supabase, GitHub, etc.]

AI output: produce `docs/PROJECT_SPEC.md`

---

## PHASE 2 — MARKET RESEARCH (10-minute version)

```
□ Search: "[product category] tools 2025 2026"
□ Find: top 3 competitors or similar products
□ Check: is there a library/tool that DOES THIS EXACTLY?
   → If yes: use it instead of building
```

---

## PHASE 3 — TECHNOLOGY DECISIONS

Never assume a stack by default.
If user does not specify, present ranked options and ask for approval.

```
□ Frontend: [user-chosen OR ranked recommendation with tradeoffs]
□ Backend: [user-chosen OR ranked recommendation]
□ Database: [user-chosen OR ranked recommendation]
□ AI layer: [only if AI is needed]
□ Auth: [user-chosen OR ranked recommendation]
□ Testing: [risk-based recommendation]
```

AI output: create `docs/ARCHITECTURE_DECISIONS.md`

---

## PHASE 4 — ENVIRONMENT SETUP

```
□ Create project folder structure
□ Initialize git: git init + first commit
□ Create .env.example with all required variables
□ Create .gitignore (include .env, node_modules, __pycache__)
□ Install dependencies (bun install / uv sync)
□ Verify all dependencies install clean
□ Run baseline test: "does the project start up?"
□ Commit: "chore: initial project setup with clean baseline"
```

---

## PHASE 5 — IMPLEMENTATION PLAN

Use skills/writing-plans/ to create the plan.

Plan requirements:
- Each task: 2-5 minutes to implement
- Each task has: exact file path + complete code + verification step
- Tasks are ordered: infrastructure first, then features
- Tests are included: every feature task has a test task

Standard task order:
1. Database schema + migrations
2. Data models / types
3. Core business logic
4. Tests for core logic (TDD: write tests first)
5. API endpoints
6. Tests for API endpoints
7. Frontend components
8. Frontend integration
9. E2E tests
10. Security review
11. Deployment setup

AI output: create `docs/IMPLEMENTATION_PLAN.md`

---

## PHASE 6 — MCP TOOLS CONFIGURATION

```
□ Read .mcp.json — what is already configured?
□ Add project-specific MCP servers
□ Disable unused MCPs (saves context window tokens)
□ Verify: max 10 MCPs enabled
```

---

## PHASE 7 — QUALITY GATES

```
□ Test coverage target: minimum 80%
□ Linting: configured and passing
□ Type checking: passing (mypy / tsc --noEmit)
□ Security scan: npx ecc-agentshield scan — clean
□ Performance baseline defined
```

---

## PHASE 8 — PRE-BUILD VERIFICATION

All boxes must be checked before building:

```
□ PROJECT_SPEC.md exists and is complete
□ ARCHITECTURE_DECISIONS.md exists with all tech choices
□ IMPLEMENTATION_PLAN.md exists with numbered tasks
□ .env.example is complete
□ .env exists with real values (NOT committed to git)
□ Project starts up cleanly
□ Git history starts with clean baseline commit
□ MCP servers configured and tested
□ No "will fix later" items in the plan
```

---

## PHASE 9 — SESSION TRACKING (ongoing)

At END of every working session, update `docs/PROGRESS.md`:
```markdown
## Last Session: [date]
### Completed
- [task 1]
### Next Session Priority
1. [next task]
### Open Decisions
- [decision needed]
### Blockers
- [anything blocking]
```

---

## FILES THIS CHECKLIST PRODUCES

```
project/
├── docs/
│   ├── PROJECT_SPEC.md
│   ├── ARCHITECTURE_DECISIONS.md
│   ├── IMPLEMENTATION_PLAN.md
│   └── PROGRESS.md
├── .env.example
├── .env                  (gitignored)
├── .mcp.json
└── .gitignore
```
