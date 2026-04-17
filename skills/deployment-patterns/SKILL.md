---
name: deployment-patterns
description: Production deployment — CI/CD, Docker, health checks, rollbacks, monitoring
triggers: [deploy, deployment, production, CI/CD, docker, ship, release, infrastructure, containers]
---

# SKILL: Deployment Patterns

## The Deployment Readiness Gate

Nothing ships without ALL of these checked:
```
□ All tests passing in CI (not just locally)
□ Security scan clean (npx ecc-agentshield scan)
□ Environment variables documented in .env.example
□ Database migrations tested on staging
□ Health check endpoint responding
□ Rollback plan documented and tested
□ Error tracking configured (Sentry or equivalent)
□ Monitoring configured (alerts defined)
```

## CI/CD Pipeline — Complete GitHub Actions Template

```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  PYTHON_VERSION: "3.12"
  NODE_VERSION: "20"

jobs:
  # ─────────────────────────────────────────
  # Quality Gate (all PRs + pushes)
  # ─────────────────────────────────────────
  quality:
    name: Quality Gate
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: testpassword
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
    steps:
      - uses: actions/checkout@v4
      
      # Python setup
      - uses: actions/setup-python@v5
        with:
          python-version: ${{ env.PYTHON_VERSION }}
      - name: Install uv
        run: pip install uv
      - name: Install dependencies
        run: uv sync --dev
      
      # Linting
      - name: Ruff lint
        run: uv run ruff check src/ tests/
      - name: Ruff format check
        run: uv run ruff format --check src/ tests/
      
      # Type checking
      - name: mypy
        run: uv run mypy src/
      
      # Tests
      - name: Run tests
        env:
          DATABASE_URL: postgresql+asyncpg://postgres:testpassword@localhost:5432/testdb
          TEST_MODE: "true"
        run: uv run pytest --cov=src --cov-report=xml --cov-fail-under=80 -v
      
      # Security
      - name: Security scan
        run: |
          uv run pip audit
          npx ecc-agentshield scan
      
      # Upload coverage
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          file: coverage.xml
  
  # ─────────────────────────────────────────
  # Build Docker image (pushes to main/develop)
  # ─────────────────────────────────────────
  build:
    name: Build Docker Image
    needs: quality
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Login to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ghcr.io/${{ github.repository }}:${{ github.sha }}
            ghcr.io/${{ github.repository }}:${{ github.ref_name }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
  
  # ─────────────────────────────────────────
  # Deploy to Staging (develop branch)
  # ─────────────────────────────────────────
  deploy-staging:
    name: Deploy to Staging
    needs: build
    runs-on: ubuntu-latest
    environment: staging
    if: github.ref == 'refs/heads/develop'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Install Fly CLI
        run: curl -L https://fly.io/install.sh | sh
      
      - name: Deploy to staging
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN_STAGING }}
        run: |
          flyctl deploy             --app ${{ vars.FLY_APP_STAGING }}             --image ghcr.io/${{ github.repository }}:${{ github.sha }}             --wait-timeout 300
      
      - name: Run smoke tests
        run: |
          sleep 15  # wait for deployment
          curl -f https://staging.yourapp.com/health || exit 1
  
  # ─────────────────────────────────────────
  # Deploy to Production (main branch)
  # ─────────────────────────────────────────
  deploy-production:
    name: Deploy to Production
    needs: build
    runs-on: ubuntu-latest
    environment: production
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Install Fly CLI
        run: curl -L https://fly.io/install.sh | sh
      
      - name: Apply database migrations
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: |
          flyctl ssh console             --app ${{ vars.FLY_APP_PROD }}             --command "uv run alembic upgrade head"
      
      - name: Deploy (blue/green via Fly)
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
        run: |
          flyctl deploy             --app ${{ vars.FLY_APP_PROD }}             --image ghcr.io/${{ github.repository }}:${{ github.sha }}             --strategy rolling             --wait-timeout 300
      
      - name: Verify deployment
        run: |
          sleep 30
          curl -f https://yourapp.com/health || exit 1
          curl -f https://yourapp.com/health/ready || exit 1
      
      - name: Notify Slack on success
        if: success()
        env:
          SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
        run: |
          curl -X POST $SLACK_WEBHOOK             -H 'Content-type: application/json'             --data '{"text":"✅ Production deployment successful: ${{ github.sha }}"}'
      
      - name: Rollback on failure
        if: failure()
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
        run: |
          echo "Deployment failed — rolling back..."
          flyctl releases rollback --app ${{ vars.FLY_APP_PROD }}
```

## Dockerfile — Production Best Practices

```dockerfile
# Python/FastAPI — production Dockerfile
FROM python:3.12-slim AS builder

WORKDIR /app
COPY pyproject.toml uv.lock ./

# Install uv for fast dependency installation
RUN pip install uv --no-cache-dir
RUN uv sync --frozen --no-dev

FROM python:3.12-slim AS production

# Security: non-root user
RUN useradd -m -u 1001 appuser

WORKDIR /app

# Copy only the installed packages (not build tools)
COPY --from=builder /app/.venv /app/.venv
COPY --chown=appuser:appuser . .

# Use the venv
ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3     CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"

EXPOSE 8000

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
```

```dockerfile
# Node.js/Next.js — production Dockerfile
FROM node:20-alpine AS base
RUN npm install -g bun

FROM base AS deps
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application (standalone output)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=5s CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
```

## Health Check Implementation (REQUIRED)

```python
# FastAPI — health check endpoints
from fastapi import APIRouter, status
from sqlalchemy import text

router = APIRouter(tags=["Health"])

@router.get("/health", status_code=status.HTTP_200_OK)
async def liveness():
    """Liveness probe — is the service alive?"""
    return {
        "status": "healthy",
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT
    }

@router.get("/health/ready", status_code=status.HTTP_200_OK)
async def readiness(db: AsyncSession = Depends(get_db)):
    """Readiness probe — can the service handle traffic?"""
    checks = {}
    
    # Check database
    try:
        await db.execute(text("SELECT 1"))
        checks["database"] = "healthy"
    except Exception as e:
        checks["database"] = f"unhealthy: {str(e)}"
    
    # Check Redis (if applicable)
    try:
        await redis_client.ping()
        checks["redis"] = "healthy"
    except Exception as e:
        checks["redis"] = f"unhealthy: {str(e)}"
    
    all_healthy = all(v == "healthy" for v in checks.values())
    
    if not all_healthy:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={"status": "unhealthy", "checks": checks}
        )
    
    return {"status": "ready", "checks": checks}
```

## Monitoring Setup

```yaml
# prometheus.yml — basic config
scrape_configs:
  - job_name: 'app'
    static_configs:
      - targets: ['app:8000']
    metrics_path: /metrics
    scrape_interval: 15s
```

```python
# FastAPI with Prometheus metrics
from prometheus_fastapi_instrumentator import Instrumentator

app = FastAPI()
Instrumentator().instrument(app).expose(app)

# This auto-creates:
# http_requests_total
# http_request_duration_seconds
# http_requests_in_progress
```

## Rollback Procedure (document before deploying)

```markdown
# Rollback Runbook

## When to rollback
- Error rate > 1% within 10 minutes of deploy
- P95 latency > 2x baseline within 10 minutes
- Health check endpoint failing
- On-call engineer judgment

## How to rollback

### Fly.io
\`\`\`bash
# List recent releases
fly releases --app [app-name]

# Rollback to previous
fly releases rollback --app [app-name]

# Rollback to specific version
fly releases rollback v42 --app [app-name]
\`\`\`

### Vercel (frontend)
\`\`\`bash
# Via CLI
vercel rollback [deployment-url]

# Via UI: Deployments → click previous deployment → "Redeploy"
\`\`\`

### Database rollback (if migration applied)
\`\`\`bash
# Run down migration
alembic downgrade -1

# Rollback to specific revision
alembic downgrade abc123
\`\`\`

## After rollback
1. Notify team in #incidents
2. Open incident ticket
3. Root cause analysis within 24 hours
4. Post-mortem within 1 week
```

## Platform Selection Guide

| Platform | Best For | Cost | Setup Time | Scaling |
|---------|---------|------|------------|---------|
| **Vercel** | Next.js apps, static | Free → $20/mo | 5 min | Auto |
| **Fly.io** | Python/Node APIs, Docker | ~$3-10/mo | 15 min | Manual |
| **Railway** | Full-stack apps | ~$5-20/mo | 10 min | Auto |
| **Render** | Simple services | Free → $7/mo | 10 min | Manual |
| **Coolify** | Self-hosted all | Server cost | 1 hour | Manual |
| **AWS ECS** | Production scale | Variable | 2 hours | Auto |

## Quality checks
- [ ] CI pipeline runs lint + type check + tests + security scan
- [ ] Docker uses multi-stage build and non-root user
- [ ] Health check endpoints implemented (/health + /health/ready)
- [ ] Rollback procedure written and tested before deploy
- [ ] Staging environment mirrors production
- [ ] Environment variables documented in .env.example
- [ ] Error tracking configured (Sentry or equivalent)
- [ ] Alerts configured (error rate, latency, disk)
