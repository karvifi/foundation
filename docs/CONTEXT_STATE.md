# CONTEXT STATE
# ════════════════════════════════════════════════════════
# This file is the AI's memory between sessions.
# Update it at the END of every response that changes state.
# Read it at the START of every session.
# ════════════════════════════════════════════════════════

Last updated: 2026-04-17

## Project
Name: Software Synthesis OS
Type: ai system / platform / web app
Domain: software / ai / automation / no-code
Stack: pnpm + Turborepo monorepo | Next.js 15 + React 19 (shell-web) | Hono on Bun (api-gateway, services) | Drizzle ORM + Neon PostgreSQL | Redis (Upstash prod / Docker local) | Trigger.dev v3 (workflow runtime) | Better Auth + WorkOS | Vercel AI SDK 4 | Tailwind CSS 4 + shadcn/ui + Radix UI | xyflow 12 | Tiptap 3 | Yjs + Hocuspocus | Electric SQL | E2B | Cloudflare Workers + R2 | Docker Compose (local) | Biome (lint+format)
Status: building

## Current Phase
Phase: implementation — Sprint 1
Status: active

## Active Task RIGHT NOW
Sprint 1 — Monorepo + platform skeleton
Building: /c/Users/karti/Desktop/software-synthesis-os/
Creating: monorepo layout, Docker Compose dev stack, api-gateway (Hono/Bun), shell-web (Next.js 15), Drizzle schema, Better Auth, design system base

## Completed This Session
- [x] Read entire blueprint (7,521 lines, Parts 1-24)
- [x] Read entire framework (THE_BIBLE.md, COMMANDS.md, ULTRA_CONSTITUTION.md)
- [x] Populated CONTEXT_STATE.md
- [x] Populated PROGRESS.md
- [x] Installed pnpm globally

## Next Actions (in priority order)
1. Create monorepo root (pnpm-workspace.yaml, turbo.json, package.json, biome.json)
2. Create Docker Compose dev stack (Postgres, Redis, MinIO, Trigger.dev)
3. Create packages/db (Drizzle schema for os.* tables)
4. Create apps/api-gateway (Hono on Bun)
5. Create apps/shell-web (Next.js 15)
6. Wire Better Auth in api-gateway
7. Week 2 target: xyflow canvas with saved graph

## Key Decisions Made
- Project root: /c/Users/karti/Desktop/software-synthesis-os/
- Runtime for workers/CLI: Bun (install separately if needed, else Node for now)
- ORM: Drizzle ORM (not Prisma)
- Durable jobs: Trigger.dev v3 (not BullMQ)
- Managed Postgres: Neon in prod; Docker postgres:16 locally
- Object storage: MinIO locally; Cloudflare R2 in prod
- Linting/formatting: Biome (replaces ESLint + Prettier)
- AI SDK: Vercel AI SDK 4 with Claude Sonnet 4 primary
- Auth: Better Auth (standard) + WorkOS (enterprise SSO)
- Local object model: Digital-first, no assumption of Bun availability on Windows PATH

## Blockers
- Bun not installed on PATH (using node/npm for now; workers will use node in dev)

## Open Questions
- None — blueprint fully read, stack confirmed

## Files Being Worked On
- c:\Users\karti\Desktop\software-synthesis-os\ (being created)
- c:\Users\karti\Desktop\foundation\docs\CONTEXT_STATE.md (this file)
- c:\Users\karti\Desktop\foundation\docs\PROGRESS.md

## Context Completeness Score
[x] Project goal defined
[x] Target user defined
[x] Stack confirmed
[x] Plan created
[x] Security baseline set
