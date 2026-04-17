# Unified AI Foundation — Master Repo List
# Version: 2.0 | Updated: 2026
# The complete, curated library of AI tools, frameworks, and patterns

---

## How to use this list

1. Find a category that matches your need
2. Check the ⭐ recommended picks first
3. Use `skills/analyze-repo/SKILL.md` to evaluate any unfamiliar repo
4. Use `skills/normalize-repo/SKILL.md` to integrate it

---

## 1. AI Harness / IDE Systems

| Repo | Description |
|------|-------------|
| ⭐ anthropics/claude-code | Claude Code — primary harness |
| ⭐ affaan-m/everything-claude-code | 48 agents, 183 skills, hooks, MCP configs, token optimization |
| ⭐ obra/superpowers | Agentic skills: TDD, brainstorming, subagent-driven-development |
| getcursor/cursor | Cursor IDE |
| openai/codex | OpenAI Codex CLI |
| google/gemini-cli | Gemini CLI |

---

## 2. Skills & Prompt Engineering

| Repo | Description |
|------|-------------|
| ⭐ ComposioHQ/awesome-claude-skills | Curated Claude skill library |
| ⭐ hesreallyhim/awesome-claude-code | claude.md patterns, hook techniques |
| anthropics/prompt-library | Official Anthropic prompt library |
| f/awesome-chatgpt-prompts | General prompt engineering patterns |
| asgeirtj/system_prompts_leaks | Leaked system prompts (learn from them) |

---

## 3. MCP Servers

| Repo | Description |
|------|-------------|
| ⭐ modelcontextprotocol/servers | Official MCP server reference implementations |
| ⭐ punkpeye/awesome-mcp-servers | Curated MCP server directory |
| modelcontextprotocol/registry | Official MCP registry (2025) |

**Configured in .mcp.json:**
- filesystem, git, memory, fetch, sequential-thinking
- context7, playwright, brave-search, github, supabase

---

## 4. AI Agent Frameworks

| Repo | Stars | Description |
|------|-------|-------------|
| ⭐ langchain-ai/langgraph | 10k | Graph-based agent orchestration (default) |
| ⭐ microsoft/autogen | 35k | Multi-agent conversation framework |
| crewAIInc/crewAI | 22k | Role-based multi-agent teams |
| pydantic/pydantic-ai | 8k | Type-safe AI agents |
| livekit/agents | 10k | Real-time voice/video AI agents |

---

## 5. Memory & Context Management

| Repo | Stars | Description |
|------|-------|-------------|
| ⭐ mem0ai/mem0 | 25k | Adaptive AI memory layer (default) |
| ⭐ run-llama/llama_index | 38k | Data framework for RAG and context management |
| zep-ai/zep | 4k | Long-term memory for AI assistants |
| chroma-core/chroma | 16k | Embedding database for memory |

---

## 6. AI Security & Safety

| Repo | Stars | Description |
|------|-------|-------------|
| ⭐ ecc-agentshield | - | npx ecc-agentshield scan — default security scanner |
| ⭐ promptfoo/promptfoo | 5k | LLM red-teaming and evaluation |
| guardrails-ai/guardrails | 4k | Input/output validation for LLMs |
| protectai/rebuff | 2k | Prompt injection detection |

---

## 7. AI Observability & Evaluation

| Repo | Stars | Description |
|------|-------|-------------|
| ⭐ langfuse/langfuse | 8k | LLM tracing and analytics (default) |
| ⭐ mlflow/mlflow | 18k | ML experiment tracking |
| confident-ai/deepeval | 5k | LLM evaluation framework (default) |
| BerriAI/litellm | 15k | Also has built-in observability |

---

## 8. LLM Providers & Proxies

| Repo | Stars | Description |
|------|-------|-------------|
| ⭐ BerriAI/litellm | 15k | Unified LLM API proxy (default) |
| openai/openai-python | 24k | Official OpenAI Python client |
| anthropics/anthropic-sdk-python | 5k | Official Anthropic Python client |
| ollama/ollama | 90k | Run LLMs locally |

**Token optimization settings:**
```json
{
  "model": "claude-sonnet-4-5",
  "MAX_THINKING_TOKENS": "10000",
  "CLAUDE_AUTOCOMPACT_PCT_OVERRIDE": "50",
  "CLAUDE_CODE_SUBAGENT_MODEL": "claude-haiku-4-5"
}
```

---

## 9. RAG & Document Intelligence

| Repo | Stars | Description |
|------|-------|-------------|
| ⭐ run-llama/llama_index | 38k | Comprehensive RAG framework (default) |
| ⭐ pgvector/pgvector | 13k | Vector similarity search in PostgreSQL |
| deepset-ai/haystack | 15k | Production RAG pipelines |
| unstructured-io/unstructured | 8k | Parse PDFs, HTML, docs for RAG |
| chroma-core/chroma | 16k | Embedding database |

---

## 10. Frontend Frameworks

| Repo | Stars | Description |
|------|-------|-------------|
| ⭐ vercel/next.js | 130k | React framework App Router (default) |
| ⭐ shadcn-ui/ui | 75k | Accessible component library (default) |
| ⭐ tailwindlabs/tailwindcss | 85k | Utility-first CSS (default) |
| pmndrs/zustand | 47k | Lightweight state management |
| TanStack/query | 42k | Server state management (React Query) |
| framer/motion | 25k | Animation library |
| ant-design/ant-design | 92k | Enterprise React component library |
| mui/material-ui | 93k | Material Design React components |

---

## 11. Backend Frameworks

| Repo | Stars | Description |
|------|-------|-------------|
| ⭐ tiangolo/fastapi | 80k | Python async API framework (default) |
| ⭐ honojs/hono | 20k | TypeScript edge/serverless API (default for TS) |
| pydantic/pydantic | 22k | Data validation for Python (default) |
| encode/httpx | 13k | Modern async HTTP client for Python |
| celery/celery | 24k | Distributed task queue for Python |

---

## 12. Database & Storage

| Repo | Stars | Description |
|------|-------|-------------|
| ⭐ supabase/supabase | 70k | Postgres + Auth + Storage + Realtime (default) |
| ⭐ sqlalchemy/sqlalchemy | 10k | Python ORM (default for Python) |
| ⭐ prisma/prisma | 40k | TypeScript ORM (default for TS) |
| drizzle-team/drizzle-orm | 25k | Lightweight TypeScript ORM |
| redis/redis-py | 12k | Redis client for Python |

---

## 13. Auth & Identity

| Repo | Stars | Description |
|------|-------|-------------|
| ⭐ better-auth/better-auth | 8k | TypeScript auth library (default for new TS) |
| ⭐ nextauthjs/next-auth | 24k | Auth for Next.js (v5) |
| python-jose/python-jose | 2k | JWT for Python |
| authlib/authlib | 4k | OAuth for Python |

---

## 14. Testing

| Repo | Stars | Description |
|------|-------|-------------|
| ⭐ pytest-dev/pytest | 12k | Python test framework (default) |
| ⭐ microsoft/playwright | 67k | Browser automation and E2E testing (default) |
| ⭐ vitest-dev/vitest | 13k | TypeScript unit testing (default) |
| ⭐ confident-ai/deepeval | 5k | LLM evaluation (default for AI testing) |
| ⭐ promptfoo/promptfoo | 5k | LLM red-teaming and CI evaluation |
| hypothesis/hypothesis | 7k | Property-based testing for Python |

---

## 15. Deployment & Infrastructure

| Repo | Stars | Description |
|------|-------|-------------|
| ⭐ vercel/vercel | - | Frontend deployment (Next.js first-class) |
| ⭐ superfly/flyctl | 3k | Fly.io CLI — deploy Docker globally |
| ⭐ railwayapp/railway | - | Full-stack deployment platform |
| coolify/coolify | 20k | Self-hosted deployment platform |
| docker/compose | 34k | Docker Compose |

---

## 16. Dev Tools & Productivity

| Repo | Stars | Description |
|------|-------|-------------|
| ⭐ astral-sh/uv | 35k | Ultra-fast Python package manager (default) |
| ⭐ oven-sh/bun | 75k | Fast JavaScript runtime and package manager (default) |
| ⭐ astral-sh/ruff | 35k | Python linter and formatter (default) |
| ⭐ biomejs/biome | 15k | TypeScript/JS linter and formatter |
| colinhacks/zod | 33k | TypeScript schema validation (default) |
| trpc/trpc | 34k | End-to-end typesafe APIs |
| better-auth/better-auth | 8k | TypeScript auth |
| instructor-ai/instructor | 9k | Structured LLM output with Pydantic |
| Chalarangelo/30-seconds-of-code | 122k | Code snippets reference |
