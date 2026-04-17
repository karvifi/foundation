# TEAM_MANIFEST.md — AI Development Team

## Overview

This foundation **replaces an entire software development team** with AI agents and skills.

```
Human Team Role          AI Equivalent
─────────────────────────────────────────────────────────────────
Product Manager          skills/ultraplanning + skills/brainstorming
Solutions Architect      agents/architect.md
Frontend Engineer        AI + skills/project-bootstrap
Backend Engineer         AI + rules/common/coding-style.md
AI/ML Engineer           skills/ai-engineering + skills/prompt-engineering
Security Engineer        agents/security-reviewer.md
QA Engineer              agents/tdd-guide.md + agents/e2e-runner.md
DevOps Engineer          skills/deployment-patterns
Technical Writer         agents/doc-updater.md
Code Reviewer            agents/code-reviewer.md
Database Engineer        agents/database-reviewer.md
Performance Engineer     agents/performance-optimizer.md
```

---

## Full Development Workflow

```
PHASE 1: PLANNING
├── brainstorming skill        → Idea refinement
├── ultrathinking skill        → Deep requirement decomposition
└── ultraplanning skill        → Execution blueprint + task list

PHASE 2: RESEARCH
├── pre-start-research skill   → Existing solutions research
├── stack-selection skill      → Technology selection
└── architect agent            → System design

PHASE 3: SETUP
└── project-bootstrap skill    → Skeleton + CI/CD + configs

PHASE 4: IMPLEMENTATION (TDD loop)
├── tdd-guide agent            → RED→GREEN→REFACTOR enforcement
├── write-tests skill          → Test suite generation
├── ai-engineering skill       → AI features (if applicable)
└── prompt-engineering skill   → Prompt design (if applicable)

PHASE 5: REVIEW
├── code-reviewer agent        → General code review
├── python-reviewer agent      → Python-specific review
├── typescript-reviewer agent  → TypeScript-specific review
└── database-reviewer agent    → Schema/query review

PHASE 6: QUALITY ASSURANCE
├── e2e-runner agent           → E2E test execution
├── verification-loop skill    → Build+type+lint+test gate
└── verification-before-completion skill → Evidence gate

PHASE 7: SECURITY
└── security-reviewer agent    → OWASP audit + AI threats

PHASE 8: DELIVERY
├── finishing-a-development-branch skill → Pre-merge checklist
├── doc-updater agent          → Documentation sync
└── deployment-patterns skill  → CI/CD + deploy
```

---

## Quality Gates Summary

```
After every implementation:
  ☐ All tests pass
  ☐ Type check passes (mypy / tsc --noEmit)
  ☐ Lint passes (ruff / eslint)
  ☐ No secrets in git diff
  ☐ Language-specific review passed
  ☐ Test coverage ≥ 80%

Before every deployment:
  ☐ Security review passed
  ☐ E2E tests pass
  ☐ Documentation updated
  ☐ npx ecc-agentshield scan — no critical issues
  ☐ All environment variables in .env.example
```
