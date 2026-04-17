# Ultra Repo Governance

## Non-Negotiables
- No blind copy from GitHub
- No stack assumptions before intake
- No implementation until prestart gates are complete
- No low-signal repo admitted to core foundation layers

## The Only 7 Categories Allowed

1. Agent and workflow core (LangGraph, CrewAI, AutoGen)
2. Skill systems (superpowers, everything-claude-code, curated packs)
3. Context and memory systems (LlamaIndex, Haystack, Mem0)
4. MCP and tooling layer (modelcontextprotocol/servers, mcp-use)
5. UI systems (Next.js, Tailwind, shadcn/ui, Ant Design)
6. Backend core (FastAPI, PostgreSQL, Redis, Hono, tRPC)
7. Testing and evaluation (Playwright, pytest, DeepEval, Vitest)

## Repo Intake Pipeline (Mandatory)
1. Extract — high-signal assets only
2. Normalize — convert to standard skill/agent/rule/template format
3. Integrate — map to control/skill/context/execution layer
4. Reject noise — record rejection reason
5. Gap closure — create missing files where no source pattern exists

## Quality Gate for New Repos
A repo is approved only if ALL are true:
- Category is one of the 7 allowed classes
- Reusable pattern is concrete and testable
- Pattern reduces token waste or error rate
- Pattern does not duplicate stronger existing capability
- Integration location is explicit
