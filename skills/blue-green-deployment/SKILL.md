---
name: blue-green-deployment
description: Zero-downtime deployment patterns — blue-green, canary, rolling updates
triggers: [deployment, blue-green, zero downtime, canary deployment, rolling update, release strategy]
---

# SKILL: Blue-Green Deployment

## Blue-Green Pattern

```yaml
# Blue environment (current production)
apiVersion: v1
kind: Service
metadata:
  name: app-service
spec:
  selector:
    app: myapp
    version: blue  # Routes to blue
  ports:
  - port: 80
    targetPort: 8080

---
# Deploy green (new version)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-green
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
      version: green
  template:
    metadata:
      labels:
        app: myapp
        version: green
    spec:
      containers:
      - name: app
        image: myapp:v2.0.0
```

```bash
# Test green environment
curl http://green.internal.example.com

# Switch traffic to green (zero downtime)
kubectl patch service app-service \
  -p '{"spec":{"selector":{"version":"green"}}}'

# Rollback if needed
kubectl patch service app-service \
  -p '{"spec":{"selector":{"version":"blue"}}}'
```

## Canary Deployment

```yaml
# 90% blue, 10% green (gradual rollout)
apiVersion: v1
kind: Service
metadata:
  name: app-service
spec:
  selector:
    app: myapp
  # Routes to both versions

---
# Blue: 9 replicas (90%)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-blue
spec:
  replicas: 9

---
# Green: 1 replica (10%)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-green
spec:
  replicas: 1
```

## Quality Checks
- [ ] Health checks on new version
- [ ] Automated rollback on errors
- [ ] Monitoring during deployment
- [ ] Database migration strategy
- [ ] Feature flags for gradual rollout
- [ ] Smoke tests after deployment
- [ ] Load testing new version
- [ ] Rollback plan documented
