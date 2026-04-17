# PROMPTS_LIBRARY.md — THE COMPLETE PROMPT ARSENAL
# ═══════════════════════════════════════════════════════════════
# Every prompt is tested. Every prompt has a defined output.
# Use these verbatim. Do not improvise.
# ═══════════════════════════════════════════════════════════════

---

## HOW TO USE THIS LIBRARY

Copy any prompt, fill in the [BRACKETS], paste to your AI.
These prompts are optimized for maximum output quality.

---

## SECTION 1: PROJECT INTAKE PROMPTS

### Prompt: New Project Intake
```
I am starting a new project. Run the full intake protocol on me.

Ask me questions ONE AT A TIME until you have:
1. What I am building (one sentence)
2. Who it is for (specific user type)
3. What problem it solves (specific pain)
4. What already exists (if anything)
5. Technology preferences (or "auto-decide")
6. What success looks like (measurable)
7. Timeline constraints
8. Budget constraints

After I answer all questions:
- Write docs/CONTEXT_STATE.md
- Write docs/PROJECT_SPEC.md
- Confirm stack selection with ranked options
- Begin /ultraplanning

Do not start building until all questions are answered.
```

### Prompt: Resume Incomplete Project
```
I have an incomplete project. Here is the current state:
[paste any existing code, docs, or description]

Run the /recover command:
1. Analyze everything that exists
2. Create a gap map (working / partial / broken / missing)
3. Write docs/CONTEXT_STATE.md with current state
4. Write docs/CODEBASE_ANALYSIS.md with gap analysis
5. Propose a completion plan in priority order

Do not start building until I confirm the plan.
```

---

## SECTION 2: RESEARCH PROMPTS

### Prompt: Market Research
```
Run /ultraresearch on: [market/product/technology]

I need to know:
1. Who are the top 3-5 competitors? (with features, pricing, weaknesses)
2. What gap exists that nobody solves well?
3. What do users complain about in existing solutions?
4. What technology approaches are being used?
5. Is this market growing, shrinking, or stable?

Use brave-search and github MCP tools. Every claim must have a source.
Output: docs/RESEARCH_REPORT.md
```

### Prompt: Technology Landscape Scan
```
Research the technology landscape for: [problem/domain]

Find:
1. Best libraries/frameworks that solve this (with stars, maintenance status, license)
2. What major companies use for this
3. Common pitfalls and anti-patterns in this space
4. What is the community consensus on best practice

For each option: does it fit Python 3.12+ and/or TypeScript 5+ and/or [my stack]?
Recommend ONE with full justification.
Output: docs/TECH_LANDSCAPE.md
```

### Prompt: Competitive Analysis
```
Analyze these competitors: [company/product 1, 2, 3]

For each competitor:
- What they do well
- What they do poorly (real user complaints)
- Pricing model
- Target market
- Technology clues

Then:
- What gap exists across all of them?
- What would "10x better" look like?
- How should we position against them?

Source everything. No opinions without evidence.
```

---

## SECTION 3: DESIGN PROMPTS

### Prompt: UI/UX System Design
```
Design a complete UI/UX system for: [product name and description]

Users: [who they are]
Primary actions they need to take: [list top 3]

Produce:
1. Design token system (colors, typography, spacing, shadows)
2. Component list (prioritized — what to design first)
3. Key screens: [list which screens]
4. Accessibility requirements
5. Mobile-first approach

For the design tokens, give me actual CSS variable definitions I can implement.
```

### Prompt: Design System to Code
```
Convert this design specification into a complete React component:
[paste design spec or describe the component]

Requirements:
- TypeScript strict mode
- Tailwind CSS only (no custom CSS)
- All states: default, hover, focus, disabled, error, loading
- ARIA attributes for accessibility
- Props interface with JSDoc comments
- Storybook story (optional)

Follow the shadcn/ui patterns.
```

---

## SECTION 4: DEVELOPMENT PROMPTS

### Prompt: Feature Implementation (TDD)
```
Implement this feature using TDD:
[describe the feature]

Process:
1. Write failing tests FIRST (pytest or Vitest)
2. Show me the tests — I must confirm before implementation starts
3. Write minimum code to make tests pass
4. Refactor for clarity (keep tests green)
5. Run verification loop: build + types + lint + test

Stack: [your stack]
Files to create/modify: [list if known]
```

### Prompt: API Endpoint Design
```
Design a REST API endpoint for: [resource and operation]

Produce:
1. Route: METHOD /api/v1/[resource]
2. Request schema (Pydantic/Zod)
3. Response schema (success + error)
4. HTTP status codes used
5. Authentication requirements
6. Rate limiting requirements
7. FastAPI/Hono implementation
8. Tests (pytest/Vitest)

Follow the foundation's API design standards.
```

### Prompt: Database Schema Design
```
Design a database schema for: [describe the data model]

Produce:
1. Table definitions with all columns and types
2. Primary keys (UUID v4)
3. Foreign key relationships
4. Indexes (all FKs + WHERE columns)
5. Migration SQL
6. SQLAlchemy/Drizzle/Prisma models
7. Explain any non-obvious design choices

Flag any potential performance issues.
```

### Prompt: Bug Fix (Systematic)
```
Fix this bug systematically:

Error/symptom: [paste exact error or describe behavior]
Expected behavior: [what should happen]
Stack trace (if available): [paste]
Environment: [dev/prod, OS, versions]

Process:
1. Diagnose root cause FIRST (do not just try fixes)
2. Write a failing test that reproduces the bug
3. Show me the test before fixing
4. Apply minimal fix
5. Verify: tests pass, no regressions

No guessing. Evidence-based only.
```

---

## SECTION 5: REVIEW PROMPTS

### Prompt: Code Review
```
Review this code as a senior engineer:
[paste code or file path]

Priority order:
1. Correctness (does it do what it claims?)
2. Security (injection, auth, data exposure)
3. Error handling (what happens when things fail?)
4. Performance (N+1, blocking, no pagination)
5. Maintainability

Format:
🔴 Must fix (bugs/security — blocks merge)
🟡 Should fix (quality — not blocking)
🟢 Consider (nice to have)
✅ Good (acknowledge what works)

Be specific: file name, line number, exact fix.
```

### Prompt: Security Audit
```
Run a full security audit on: [codebase/feature/PR]

Check:
1. OWASP Top 10 (A01-A10)
2. AI-specific threats (if AI code present)
3. Secrets in code or git history
4. Dependency vulnerabilities
5. Authentication AND authorization (both)

Also run: npx ecc-agentshield scan

Output: Security report with PASS / WARN / BLOCK result.
Do not approve deployment if BLOCK issues exist.
```

### Prompt: Architecture Review
```
Review the architecture of: [describe system or paste relevant code]

Evaluate:
1. Does the data model support the use cases?
2. Where will this fail at 10x current scale?
3. What are the single points of failure?
4. Security: what attack surfaces exist?
5. What technical debt is being created?

Produce: architecture review with specific recommendations.
Not just "consider improving X" — say exactly what to change and why.
```

---

## SECTION 6: COMPLETION PROMPTS

### Prompt: Full Stack Completion
```
Complete this project to production-ready status:
[describe current state or paste what exists]

Run /ultracompletion:
1. Audit what exists (be honest, not optimistic)
2. Map every gap (working / partial / broken / missing)
3. Create completion plan (priority: blocking > core > quality > polish)
4. Execute each task in TDD fashion
5. When done: all gates must pass

"Done" means:
□ App starts without errors
□ All tests pass (≥80% coverage)
□ Type check and lint pass
□ Security scan clean
□ README has working setup instructions
□ .env.example is complete
```

---

## SECTION 7: MARKETING & CONTENT PROMPTS

### Prompt: Landing Page Copy
```
Write conversion copy for this landing page:

Product: [name and one-sentence description]
Target customer: [specific person type]
Top pain point: [most painful problem they have]
Primary benefit: [the transformation you provide]
Social proof available: [testimonials, numbers, logos]
CTA action: [what you want them to do]

Structure:
H1: Outcome-focused headline (not clever, benefit-first)
Sub: Mechanism/approach
3 benefits (not features — outcomes)
Social proof section
FAQ (top 5 objections)
Final CTA

Formula: AIDA. Grade 8 reading level. Specifics > vague claims.
```

### Prompt: Blog Post Brief
```
Create a complete blog post for:

Topic: [topic]
Target keyword: [primary SEO keyword]
Audience: [who is reading this]
Goal: [what we want them to do after reading]

Produce:
1. SEO-optimized title (50-60 chars, includes keyword)
2. Meta description (150-160 chars)
3. Full outline (H2, H3 structure)
4. Hook paragraph (first 150 words)
5. FAQ section (5 questions targeting featured snippets)
6. CTA at end

Word count target: [length]
Tone: [professional/conversational/technical]
```

### Prompt: Email Sequence
```
Write a [N]-email onboarding/nurture sequence for:

Product: [description]
Audience: [who signed up]
Goal of sequence: [what we want them to do by email N]

For each email:
- Subject line (with A/B variant)
- Preview text
- Body (no fluff — value in every line)
- CTA (one specific action)

Email 1: Welcome + quick win
Email 2: Key insight or tip
Email 3: Case study or story
Email 4: Address top objection
Email 5: Soft sell + strong CTA
```

---

## SECTION 8: REPO EXTRACTION PROMPTS

### Prompt: Extract Repo Value
```
Analyze this repo: [URL or paste content]

Return ONLY:
1. Core idea (2 sentences, technical, no marketing language)
2. Reusable parts (specific files or patterns — not "everything")
3. What to ignore (scaffolding, examples, irrelevant code)
4. Where it fits in my system (control / skill / context / execution layer)

Do not summarize the README.
Do not repeat the feature list.
Be concrete about what is actually useful.
```

### Prompt: Normalize Repo to Skill
```
Convert this repo pattern into a standardized skill file:
[paste relevant code or description]

Output a complete SKILL.md with:
- name (kebab-case)
- description (one sentence)
- triggers (keywords)
- Purpose section
- Process (numbered steps — specific and executable)
- Output (what you get when done)
- Quality checks (checkbox list)
- Failure modes (what can go wrong + recovery)

Follow the foundation's skill format exactly.
```
