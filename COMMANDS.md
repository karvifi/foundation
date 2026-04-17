# COMMANDS.md — SLASH COMMAND REFERENCE
# ═══════════════════════════════════════════════════════════════
# Every command is precise. Every command has a defined output.
# Type the command. The IDE executes. No extra explanation needed.
# ═══════════════════════════════════════════════════════════════

---

## HOW COMMANDS WORK

Every command:
1. Activates specific skills and/or agents
2. Runs the defined process exactly
3. Produces the defined output
4. Updates `docs/CONTEXT_STATE.md`
5. Never stops mid-task without explanation

---

## UNIVERSAL COMMANDS (work for any project type)

---

### `/ultrathinking`
**Triggers:** skills/ultrathinking/SKILL.md
**Purpose:** Deep requirement decomposition. Zero assumptions. Contradiction detection.

**Process:**
1. Extract ALL explicit requirements from context
2. Infer ALL implicit requirements
3. Identify and flag every contradiction
4. Build constraint matrix (hard / soft / unknown / assumed)
5. Run failure-first modeling on every major component
6. Calculate context completeness score (0-100)
7. If score < 85 → STOP, ask targeted questions
8. If score ≥ 85 → produce Decision Pack + GO/NO-GO

**Output:** `docs/ULTRA_THINKING_REPORT.md`

**When to use:**
- Requirements feel unclear or contradictory
- High-stakes project where mistakes are costly
- Before any large implementation
- User says "no mistakes allowed"

---

### `/ultraplanning`
**Triggers:** skills/ultraplanning/SKILL.md + skills/writing-plans/SKILL.md
**Purpose:** Complete execution blueprint with nothing missing.

**Process:**
1. Scope contract (in/out-of-scope, acceptance criteria)
2. Work breakdown — every task is 2-5 minutes, has exact file path
3. Dependency graph (sequential blockers vs parallelizable units)
4. Quality gates per phase
5. Rollback plan per phase
6. Parallelization opportunities marked
7. Definition of "done" — objective and measurable

**Output:** `docs/IMPLEMENTATION_PLAN_ULTRA.md`

---

### `/ultraresearch`
**Triggers:** skills/auto-research/SKILL.md + skills/market-research/SKILL.md
**Purpose:** Comprehensive multi-source research before any work begins.

**Process:**
1. Define exact research question
2. Technology/market landscape scan
3. Competitive analysis (top 5 alternatives)
4. Gap analysis (what is missing, what is the opportunity)
5. Risk mapping
6. GO/NO-GO recommendation

**Output:** `docs/RESEARCH_REPORT.md`

---

### `/ultracompletion`
**Triggers:** skills/full-completion/SKILL.md
**Purpose:** Take any incomplete/broken/stalled project to 100% completion.

**Process:**
1. Audit current state (skills/analyze-codebase)
2. Map every gap and every broken piece
3. Prioritize: blocking > quality > nice-to-have
4. Generate completion plan with exact tasks
5. Execute gap closure in TDD loop
6. Verify: all gates must pass
7. Document: update all docs

**Output:** Complete, production-ready, documented project

---

### `/autostart`
**Triggers:** Full intake protocol
**Purpose:** Auto-detect everything and start from scratch intelligently.

**Process:**
1. Ask: "What are you building in one sentence?"
2. Ask: "Who uses it / who is the audience?"
3. Ask: "Does anything already exist?"
4. Ask: "Any technology preferences or constraints?"
5. Ask: "What does success look like?"
6. Classify project type and domain(s)
7. Select stack (with ranked options if not specified)
8. Create CONTEXT_STATE.md, PROJECT_SPEC.md
9. Run /ultraresearch
10. Run /ultraplanning
11. Begin

**Output:** Full project foundation + first implementation plan

---

### `/audit`
**Triggers:** skills/analyze-codebase/SKILL.md
**Purpose:** Deep audit of any existing project.

**Process:**
1. Map all entry points
2. Trace data flow
3. Assess database schema
4. Check test coverage honestly
5. Scan for TODO/FIXME/technical debt
6. Check dependencies for vulnerabilities
7. Identify what works, what is partial, what is missing

**Output:** `docs/CODEBASE_ANALYSIS.md` with priority action list

---

### `/recover`
**Triggers:** Session recovery protocol
**Purpose:** Restore full context after any break or new session.

**Process:**
1. Read docs/CONTEXT_STATE.md
2. Read docs/PROGRESS.md
3. Read docs/ARCHITECTURE_DECISIONS.md
4. Run: git log --oneline -10
5. Identify current phase and active task
6. Report: "Here is where we are and here is what comes next"

**Output:** Clear summary of state + prioritized next actions

---

### `/security`
**Triggers:** agents/security-reviewer.md + skills/security-review/SKILL.md
**Purpose:** Complete security audit.

**Process:**
1. Run automated: npx ecc-agentshield scan
2. Check OWASP Top 10 (A01-A10)
3. Check AI-specific threats (prompt injection, cost runaway, data leakage)
4. Check dependency vulnerabilities (pip audit / npm audit)
5. Verify no secrets in code or git history

**Output:** Security report with PASS / WARN / BLOCK

---

### `/deploy`
**Triggers:** skills/deployment-patterns/SKILL.md + agents/e2e-runner.md
**Purpose:** Prepare for production deployment.

**Process:**
1. Verify all quality gates passed
2. Generate Dockerfile (multi-stage, non-root)
3. Generate CI/CD pipeline (.github/workflows/ci.yml)
4. Verify health check endpoint
5. Document rollback procedure
6. Verify all env vars in .env.example
7. Run final security scan

**Output:** Production-ready deployment configuration

---

### `/brainstorm [idea]`
**Triggers:** skills/brainstorming/SKILL.md
**Purpose:** Validate and refine any idea before committing to it.

**Process:**
1. One-sentence description
2. User identification + pain point
3. Success definition
4. Scope boundary (explicit out-of-scope)
5. Similar/competing solutions
6. MVP feature list (max 5)
7. Sign-off from user before proceeding

**Output:** `docs/PROJECT_SPEC.md`

---

## DOMAIN-SPECIFIC COMMANDS

---

### `/research-market [market or product]`
**Triggers:** skills/market-research/SKILL.md
**Output:** `docs/MARKET_RESEARCH.md` with competitive table, gaps, recommendation

---

### `/design-system [product name]`
**Triggers:** skills/uiux-design/SKILL.md + skills/design-system/SKILL.md
**Output:** Design specification with component structure, color tokens, typography system

---

### `/seo [website URL or content description]`
**Triggers:** skills/seo-optimization/SKILL.md
**Output:** SEO audit + action plan (technical + content + local/geo)

---

### `/marketing [product or service]`
**Triggers:** skills/marketing-strategy/SKILL.md
**Output:** Full marketing playbook (channels, messaging, funnel, copy)

---

### `/science [research question]`
**Triggers:** skills/scientific-research/SKILL.md
**Output:** Research framework (literature, methodology, analysis approach)

---

### `/content [type] [topic]`
Examples: `/content blog "best Python frameworks 2025"` or `/content video-script "product demo"`
**Triggers:** skills/content-creation/SKILL.md
**Output:** Ready content in the requested format

---

### `/copywrite [goal] [audience]`
**Triggers:** skills/copywriting/SKILL.md
**Output:** Conversion-optimized copy for any format

---

### `/business-strategy [business description]`
**Triggers:** skills/business-strategy/SKILL.md
**Output:** Business strategy playbook (model, channels, metrics, milestones)

---

### `/data-analysis [dataset or question]`
**Triggers:** skills/data-science/SKILL.md
**Output:** Analysis plan + insights + visualization recommendations

---

### `/product-plan [product idea]`
**Triggers:** skills/product-management/SKILL.md
**Output:** Product roadmap + user stories + acceptance criteria

---

### `/knowledge-base [topic]`
**Triggers:** skills/knowledge-management/SKILL.md + skills/obsidian-knowledge/SKILL.md
**Output:** Structured knowledge system design

---

## DEVELOPMENT COMMANDS

---

### `/tdd [feature description]`
**Triggers:** skills/tdd-workflow/SKILL.md + agents/tdd-guide.md
**Output:** Tests written FIRST, then implementation, then refactor

---

### `/review [file or PR]`
**Triggers:** agents/code-reviewer.md + language-specific reviewer
**Output:** Prioritized review: 🔴 Must fix | 🟡 Should fix | 🟢 Consider | ✅ Good

---

### `/api-design [resource description]`
**Triggers:** skills/api-design/SKILL.md
**Output:** Complete API spec with endpoints, schemas, error codes, pagination

---

### `/database [describe data model]`
**Triggers:** skills/database-design/SKILL.md + agents/database-reviewer.md
**Output:** Schema design + migration plan + index strategy

---

### `/test [describe what to test]`
**Triggers:** skills/write-tests/SKILL.md
**Output:** Complete test suite (unit + integration + E2E)

---

### `/fix [describe error or bug]`
**Triggers:** skills/debug-systematic/SKILL.md + agents/build-error-resolver.md
**Output:** Root cause identified + minimal fix + verification

---

### `/parallelize [describe multiple tasks]`
**Triggers:** skills/dispatching-parallel-agents/SKILL.md
**Output:** Tasks dispatched to parallel agents + integration plan

---

### `/compact`
**Triggers:** skills/strategic-compact/SKILL.md
**Purpose:** Compress context at a logical boundary to preserve quality.
**When to use:** After research phase, after milestone, before switching topics

---

## COMMAND CHAINING

Commands can be chained. Use `→` to chain:

**Example: Full project from scratch**
```
/autostart → /ultrathinking → /ultraplanning → /deploy
```

**Example: Complete incomplete project**
```
/recover → /audit → /ultracompletion → /security → /deploy
```

**Example: Marketing campaign**
```
/ultraresearch → /marketing → /copywrite → /content
```

---

## COMMAND MEMORY

After every command:
1. `docs/CONTEXT_STATE.md` is updated automatically
2. Key decisions are logged in `docs/ARCHITECTURE_DECISIONS.md`
3. Progress is logged in `docs/PROGRESS.md`
4. Work is committed: `git commit -m "type(scope): description"`

This means: **nothing is ever lost between sessions.**
