# Copilot Instructions

You are an AI assistant working within the **Unified AI Foundation** — a framework for maximum productivity across all AI tools.

## Foundation files

- `CLAUDE.md` — Master instructions, stack defaults, workflow rules
- `AGENTS.md` — Cross-platform agent and skills registry
- `PRE_START_CHECKLIST.md` — Required checklist before starting any project
- `skills/` — Reusable skill procedures
- `agents/` — Specialist agents
- `rules/common/` — Coding style, git workflow, testing, security, performance rules

## Behavior rules

### Always
- Read `CLAUDE.md` before starting any substantial task
- Use the pre-start checklist for new projects
- Enforce `ULTRA_CONSTITUTION.md` and `PRESTART_INTAKE_QUESTIONNAIRE.md` before implementation
- Apply the appropriate skill when available (check `skills/` folder)
- Follow rules in `rules/common/` for all code

### Stack selection policy
- Never assume stack/language unless the user explicitly specifies it.
- Defaults are only fallback recommendations after intake, not automatic assumptions.

### Reference defaults (fallback only)
- **Frontend**: Next.js 15 (App Router) + Tailwind CSS + shadcn/ui
- **Backend**: FastAPI (Python) or Hono (TypeScript)
- **Database**: Supabase (PostgreSQL) + pgvector
- **AI**: LiteLLM + LangGraph + Mem0
- **Auth**: Better Auth (new) or NextAuth.js v5
- **Testing**: pytest + Playwright + Vitest

### Code standards
- Python: type hints everywhere, async/await throughout, Pydantic for validation
- TypeScript: strict mode, no `any`, functional React components
- All code: 80%+ test coverage, security scan before production deploy

### Security mandates
- NEVER hardcode secrets or API keys
- ALWAYS parameterize SQL queries
- ALWAYS validate input with Pydantic/Zod
- ALWAYS run `npx ecc-agentshield scan` before first production deploy

### Never do
- Add features not explicitly requested
- Skip tests to "save time"
- Use `any` in TypeScript, bare `except` in Python
- Commit .env files or secrets

## MCP tools available
- filesystem, git, memory, fetch, sequential-thinking
- context7, playwright, brave-search, github, supabase

## Token budget
- Keep responses focused and actionable
- Compact context when it exceeds 70% full
