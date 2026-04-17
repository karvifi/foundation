# AGENTS.md — UNIFIED AI FOUNDATION
# ════════════════════════════════════════════════════════════════
# This file is the UNIVERSAL cross-harness agent definition.
# Read by: Claude Code, Cursor, Codex, OpenCode, Gemini CLI,
#          GitHub Copilot CLI — ALL of them.
# DO NOT DELETE. DO NOT MOVE. Must stay at project root.
# ════════════════════════════════════════════════════════════════

## Foundation Identity

You are operating inside a Unified AI Foundation. Before any task:
1. Read CLAUDE.md fully if not already read this session
2. Check PRE_START_CHECKLIST.md for any new project
3. Enforce ULTRA_CONSTITUTION.md and PRESTART_INTAKE_QUESTIONNAIRE.md before implementation
4. Check skills/ folder for the relevant skill
5. Check .mcp.json for available tools

## Core Behavior Rules

- Build production systems, not demos
- Write minimal code that does maximum work
- Search before building — always
- Use MCP tools instead of writing code when possible
- Ask ONE clarifying question at a time, never a wall of questions
- Delegate to specialist agents when the task fits their scope
- Compact context at logical breakpoints (after research, after milestones)

## Available Specialist Agents

### planner
File: agents/planner.md
When: Starting any new feature or task
Does: Creates detailed implementation plan broken into 2-5 min tasks

### architect  
File: agents/architect.md
When: Making system design decisions, choosing between approaches
Does: Designs system architecture with tradeoff analysis

### code-reviewer
File: agents/code-reviewer.md
When: After implementing any significant code
Does: Reviews quality, security, maintainability — blocks critical issues

### security-reviewer
File: agents/security-reviewer.md
When: Before any deployment, after auth/payment changes
Does: OWASP Top 10 audit + AI-specific threat analysis

### tdd-guide
File: agents/tdd-guide.md
When: During implementation (always active in TDD mode)
Does: Enforces RED → GREEN → REFACTOR, requires tests before code

### researcher
File: agents/researcher.md
When: Need current info, library docs, competitive analysis
Does: Multi-source research with source attribution

### build-error-resolver
File: agents/build-error-resolver.md
When: Build or compile errors that aren't obvious
Does: Systematic build error diagnosis and resolution

### database-reviewer
File: agents/database-reviewer.md
When: Adding or changing database schemas, queries, migrations
Does: Reviews for performance, security, migration safety

### python-reviewer
File: agents/python-reviewer.md
When: Reviewing Python code changes
Does: Enforces type hints, async correctness, validation, and Python security practices

### typescript-reviewer
File: agents/typescript-reviewer.md
When: Reviewing TypeScript/React/Next.js changes
Does: Enforces strict typing, Zod validation, App Router patterns, and frontend security

### java-reviewer
File: agents/java-reviewer.md
When: Reviewing Java/Spring changes
Does: Reviews for concurrency, transaction safety, API validation, and secure coding patterns

### go-reviewer
File: agents/go-reviewer.md
When: Reviewing Go code changes
Does: Idiomatic Go, concurrency, error handling, performance

### rust-reviewer
File: agents/rust-reviewer.md
When: Reviewing Rust code changes
Does: Ownership, lifetimes, unsafe usage, idiomatic patterns

### doc-updater
File: agents/doc-updater.md
When: After significant feature or API changes
Does: Synchronizes README, changelog, architecture docs, and environment documentation

### e2e-runner
File: agents/e2e-runner.md
When: Validating user-facing flows before release
Does: Writes/runs Playwright tests and reports failures with actionable diagnostics

### performance-optimizer
File: agents/performance-optimizer.md
When: Performance regressions or bottlenecks
Does: Profiling, bundle analysis, runtime optimization with evidence

### refactor-cleaner
File: agents/refactor-cleaner.md
When: Dead code cleanup, consolidation
Does: Removes unused code, deps, duplicates safely

### loop-operator
File: agents/loop-operator.md
When: Running long autonomous pipelines
Does: Checkpoint monitoring, stall detection, safe recovery

## Skills System

Key skills:
- brainstorming/ — Refine ideas before coding
- ultrathinking/ — Deep requirement decomposition and contradiction detection
- writing-plans/ — Break work into executable tasks
- ultraplanning/ — End-to-end execution blueprint with hard gates
- pre-start-research/ — Research-first gate with GO/NO-GO decision
- stack-selection/ — No-assumption language/framework selection
- project-type-router/ — Route requests to the correct build chain
- project-bootstrap/ — Full project skeleton and baseline tooling setup
- tdd-workflow/ — TDD enforcement methodology
- code-review/ — Code quality review
- security-review/ — Security audit
- market-research/ — Competitive/market research
- api-design/ — REST API design patterns
- spec-writing/ — Implementation-ready specs with measurable acceptance criteria
- debug-systematic/ — 4-phase root cause analysis
- deployment-patterns/ — CI/CD and deployment
- context-management/ — Token and context optimization
- analyze-codebase/ — Deep codebase audit
- continuous-learning/ — Extract session patterns
- mcp-server-patterns/ — MCP server design, transport, auth, and contract testing
- prompt-engineering/ — Prompt lifecycle design, testing, and versioning
- ai-engineering/ — RAG, agents, evals, and production AI operations

### Software Synthesis OS — Core Skills
- graph-compiler-architecture/ — Canonical graph compilation: schema validation, port type checking, edge resolution, patch merge, version diffing, execution planning
- package-system-design/ — Capability package runtime: manifest validation, dependency resolution, migration orchestration, package signing/trust, node definition contracts, surface registration
- surface-compiler/ — Graph-to-UI compilation: layout planning, builder/operator mode transformation, card/panel/editor selection, dynamic surface mounting, artifact binding
- crdt-realtime-collaboration/ — Yjs + Hocuspocus patterns: collaborative graph editing, conflict resolution, presence tracking, cursor synchronization
- canvas-diagram-editor-patterns/ — xyflow + Excalidraw: node positioning, auto-layout, minimap, zoom/pan optimization, edge routing, selection/multi-select
- domain-engine-integration/ — Tiptap/Univer/Remotion wrapping: engine mount protocols, artifact binding, revision synchronization, export coordination, Surface↔Engine contracts
- intent-planning-prompt-to-graph/ — LLM-driven graph generation: intent classification, package suggestion, graph patch synthesis, missing input detection, cost estimation, safety validation
- policy-approval-engine/ — Governance patterns: approval routing, dangerous action gates, role resolution, fine-grained permissions, audit policies, policy-as-code
- artifact-runtime-patterns/ — Durable output system: revision chains, lineage tracking, export bundles, share links, blob storage coordination
- adapter-contract-patterns/ — n8n/Dify/ComfyUI wrapping: adapter interface design, capability introspection, job queueing, result mapping, cost attribution per adapter

### Software Synthesis OS — Vision Layer Skills (Billion-Dollar Differentiators)
- progressive-disclosure-ux/ — 3-layer UX architecture (guided/visual/canvas): intent bar, block composer, raw canvas, layer transitions, onboarding intelligence, 90-second aha moment engineering
- canvas-intelligence/ — Smart canvas: next-node suggestions, port compatibility guard, auto-wiring, natural language node search, explain-this-graph AI, broken pattern detection, cost-before-build estimator
- universal-node-taxonomy/ — Complete node kind hierarchy: 6 tiers (atomic/engine/compound/agent/application/policy), software coverage matrix, node composition rules, palette configuration per UX layer
- app-synthesis-engine/ — Graph → deployable application: web app, client portal, mobile PWA, embed widget, API endpoint, white-label targets, Coolify deployment, synthesis registry, access control
- marketplace-ecosystem-design/ — Package marketplace economics: creator SDK + publish CLI, revenue share (80/20), trust tier enforcement, package discovery API, reviews, private enterprise registries, creator payouts

## Stack Defaults (reference only after intake — see CLAUDE.md)

- Frontend: Next.js 15 + Tailwind CSS + shadcn/ui
- Backend: FastAPI (Python) or Hono (TypeScript)
- Database: Supabase (default) or PostgreSQL + pgvector
- AI/LLM: LiteLLM + LangGraph + Mem0
- Auth: Better Auth (new) or NextAuth.js v5 (existing)
- Testing: pytest + Playwright + DeepEval

## Token Budget (enforce always)

- Default model: sonnet (not opus)
- MAX_THINKING_TOKENS: 10000 (not 31999)
- Compact at 50% context (not 95%)
- Subagent model: haiku for simple tasks
- Max active MCPs: 10 (more kills context window)

## Security Mandates (non-negotiable)

- Never hardcode secrets, tokens, passwords
- Always validate input at system boundaries
- Always parameterize SQL queries
- Always set max_tokens on every LLM call
- Always rate-limit AI endpoints
- Run npx ecc-agentshield scan before every release
