---
name: devops
description: CI/CD pipelines, infrastructure-as-code, monitoring, Docker, Kubernetes
triggers: [devops, infrastructure, pipeline, CI/CD, docker, kubernetes, deploy, monitor, IaC]
---

# SKILL: DevOps

## Purpose
Build reliable, automated infrastructure that deploys code safely and monitors it in production.

## Core Components

### CI/CD Pipeline (GitHub Actions)
```yaml
# .github/workflows/ci.yml — standard template
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Lint
        run: [lint command for stack]
      - name: Type check
        run: [type check command]
      - name: Test
        run: [test command with coverage]
      - name: Security scan
        run: npx ecc-agentshield scan

  deploy-staging:
    needs: quality
    if: github.ref == 'refs/heads/develop'
    [deploy to staging]

  deploy-production:
    needs: quality
    if: github.ref == 'refs/heads/main'
    [deploy to production with blue/green]
```

### Docker Best Practices
```dockerfile
# Multi-stage build (mandatory)
FROM python:3.12-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM python:3.12-slim
WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY . .

# Non-root user (security mandatory)
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

# Health check (mandatory)
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Infrastructure-as-Code (choose one)
- **Terraform**: multi-cloud, most mature
- **Pulumi**: same as Terraform but in real code (Python/TS)
- **CDK**: AWS-specific, TypeScript/Python

### Monitoring Stack
```
Metrics: Prometheus + Grafana
Logs: Loki or ELK stack
Traces: OpenTelemetry → Jaeger or Tempo
Errors: Sentry (applications) + PagerDuty (alerts)
Uptime: UptimeRobot or Checkly

For AI: Langfuse (LLM tracing + cost)
```

### Platform Selection Guide
| Use case | Platform | Why |
|---------|---------|-----|
| Next.js apps | Vercel | Zero-config, global CDN |
| Python APIs | Fly.io | Docker-native, cheap |
| Full-stack | Railway | Simplest setup |
| Self-hosted | Coolify | Full control |
| Kubernetes | GKE/EKS/AKS | Enterprise scale |

### Deployment Strategies
- **Blue/Green**: zero-downtime, instant rollback (2x cost)
- **Rolling**: gradual replacement, less cost
- **Canary**: test with % of traffic first

## Output
- CI/CD pipeline (GitHub Actions)
- Dockerfile (multi-stage, non-root, health check)
- Deployment platform setup
- Monitoring configuration
- Runbook for common incidents

## Quality checks
- [ ] CI blocks deploy if tests fail
- [ ] Security scan in CI pipeline
- [ ] Dockerfile uses non-root user
- [ ] Health check endpoint implemented
- [ ] Rollback procedure documented
- [ ] Alerts configured for: high error rate, latency spike, disk space
