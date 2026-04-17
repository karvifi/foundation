---
name: service-mesh-patterns
description: Service mesh patterns — Istio, traffic management, observability, security
triggers: [service mesh, Istio, microservices, traffic management, mTLS, sidecar]
---

# SKILL: Service Mesh Patterns

## Traffic Splitting (Canary)

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: reviews
spec:
  hosts:
  - reviews
  http:
  - match:
    - headers:
        end-user:
          exact: jason
    route:
    - destination:
        host: reviews
        subset: v2  # Beta users get v2
  - route:
    - destination:
        host: reviews
        subset: v1
      weight: 90  # 90% to v1
    - destination:
        host: reviews
        subset: v2
      weight: 10  # 10% to v2
```

## Mutual TLS (mTLS)

```yaml
# Enforce mTLS between services
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
spec:
  mtls:
    mode: STRICT  # All traffic encrypted
```

## Quality Checks
- [ ] Service mesh deployed (Istio/Linkerd)
- [ ] mTLS enabled between services
- [ ] Traffic management configured
- [ ] Observability (tracing, metrics)
- [ ] Retry and timeout policies
- [ ] Circuit breakers configured
- [ ] Rate limiting per service
- [ ] Authorization policies defined
