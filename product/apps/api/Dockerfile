# syntax=docker/dockerfile:1.7
# ─────────────────────────────────────────────────────────────────────────────
# OmniOS API — multi-stage Dockerfile.
#
# Build context MUST be the monorepo root so pnpm-workspace.yaml and the
# shared lockfile are reachable:
#
#   docker build -f apps/api/Dockerfile -t omnios-api:local .
#
# Fly.io's remote builder handles this automatically because `fly.toml`
# sits at apps/api/fly.toml; flyctl uploads the whole working directory.
#
# Stages:
#   1. deps     — install ALL workspace deps against the frozen lockfile.
#   2. builder  — compile apps/api with tsc + prune to production deps.
#   3. runner   — minimal node:22-alpine image with only runtime artefacts.
#
# Target image size: < 200MB (alpine base ~55MB + prod node_modules ~120MB).
# ─────────────────────────────────────────────────────────────────────────────

ARG NODE_VERSION=22-alpine

# ─── Stage 1: deps ───────────────────────────────────────────────────────────
# Install the full dependency graph. Layer caches on pnpm-lock.yaml hash so
# unrelated code changes don't bust node_modules.
FROM node:${NODE_VERSION} AS deps
WORKDIR /repo

# pnpm is activated via corepack (bundled with Node 22).
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Copy only manifests first — this is the cache-friendly layer.
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.base.json ./
COPY apps/api/package.json                       ./apps/api/
COPY packages/ai-gateway/package.json            ./packages/ai-gateway/
COPY packages/archetypes/package.json            ./packages/archetypes/
COPY packages/artifact-service/package.json      ./packages/artifact-service/
COPY packages/connector-adapters/package.json    ./packages/connector-adapters/
COPY packages/connector-runtime/package.json     ./packages/connector-runtime/
COPY packages/contracts/package.json             ./packages/contracts/
COPY packages/db/package.json                    ./packages/db/
COPY packages/graph-engine/package.json          ./packages/graph-engine/
COPY packages/node-registry/package.json         ./packages/node-registry/
COPY packages/policy-engine/package.json         ./packages/policy-engine/
COPY packages/repo-intelligence/package.json     ./packages/repo-intelligence/
COPY packages/surface-compiler/package.json      ./packages/surface-compiler/
COPY packages/workflow-store/package.json        ./packages/workflow-store/
COPY packages/workspace-orchestrator/package.json ./packages/workspace-orchestrator/

# --frozen-lockfile fails the build if pnpm-lock.yaml is stale.
# BuildKit cache mount dramatically speeds up repeat builds in CI.
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# ─── Stage 2: builder ────────────────────────────────────────────────────────
# Copy full monorepo source and compile apps/api + transitive workspace deps
# via turbo's dependency graph, then collapse into a self-contained /app dir.
FROM node:${NODE_VERSION} AS builder
WORKDIR /repo
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Reuse the populated node_modules from the deps stage.
COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/apps ./apps
COPY --from=deps /repo/packages ./packages

# Now bring in the source tree.
COPY . .

# Build only the API and its workspace dependencies via turbo's graph.
RUN pnpm turbo run build --filter=@sso/api

# pnpm deploy collapses the workspace into a self-contained folder with a
# flat node_modules containing only production deps — ideal for the runner.
RUN pnpm --filter=@sso/api deploy --prod --legacy /app \
  && cp -R apps/api/dist /app/dist

# ─── Stage 3: runner ─────────────────────────────────────────────────────────
# Minimal runtime. No pnpm, no build tools, no source.
FROM node:${NODE_VERSION} AS runner
WORKDIR /app

# tini: proper PID 1 that reaps zombies and forwards SIGINT/SIGTERM to Node.
# curl: used by HEALTHCHECK and by ops debugging.
RUN apk add --no-cache tini curl

# Drop privileges: node:alpine ships with a uid=1000 `node` user.
# Reuse it to avoid UID churn across rebuilds.
COPY --chown=node:node --from=builder /app /app

USER node

ENV NODE_ENV=production \
    PORT=3001 \
    NODE_OPTIONS="--enable-source-maps"

EXPOSE 3001

# tini as PID 1 — without it, Fly's SIGINT during rolling deploy is eaten by
# Node's default signal handling and the machine waits out kill_timeout.
ENTRYPOINT ["/sbin/tini", "--"]

# Container-level health check. Fly also polls /health via HTTP, but this
# keeps the container self-diagnosing when run outside Fly (docker-compose,
# local docker run, Kubernetes, etc).
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl --fail --silent http://127.0.0.1:3001/health || exit 1

CMD ["node", "dist/index.js"]
