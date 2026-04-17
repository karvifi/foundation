---
name: microservices-design
description: Design microservices architectures — service boundaries, communication, resilience, observability
triggers: [microservices, service mesh, distributed, API gateway, service boundary, monolith, SOA]
---

# SKILL: Microservices Design

## Purpose
Design service architectures that scale independently, fail gracefully, and evolve without big-bang deployments.
But also: understand when NOT to use microservices (the monolith is often better).

## When to Use Microservices (and When Not To)

### Use microservices when:
```
✓ Different parts of the system scale very differently (payment vs. email)
✓ Different parts need different tech stacks (ML in Python, API in Go)
✓ Teams are large enough that code conflicts are slowing delivery (50+ engineers)
✓ You've already built a monolith and know where the seams are
✓ Regulatory isolation required (PCI-compliant payment service isolated)
```

### DON'T use microservices when:
```
✗ < 20 engineers (coordination overhead > benefit)
✗ Domain is not well understood (you'll get the boundaries wrong)
✗ Starting a new product (you don't know the seams yet)
✗ Single database would work fine (data sharing = distributed transaction complexity)
✗ Team isn't ready for distributed systems debugging

Default: start with a modular monolith.
Migrate to microservices when the monolith is painful.
```

## Service Boundary Design

### Domain-Driven Design (DDD) Approach

**Bounded Context** = the boundary of a microservice
```
How to find bounded contexts:
  1. Event Storming: map all domain events on a timeline
  2. Find where different terms mean different things (linguistic seams)
  3. Find where different teams work on different concerns
  4. Find where data has different lifecycle requirements

Example — E-commerce domain:
  ┌─────────────────────────────────────────────────────────┐
  │ Order Context      │ Inventory Context │ Shipping Context │
  │ "Order" = customer │ "Order" = stock   │ "Order" = parcel │
  │ intent to buy      │ reservation       │ to deliver       │
  └─────────────────────────────────────────────────────────┘
  These are different things with the same name → service boundary
```

**Anti-patterns in service boundaries**:
```
❌ Services that share a database (tight coupling — defeats the purpose)
❌ Services that must be deployed together (tight coupling)
❌ Services that call each other synchronously in a chain of 5+ calls
❌ "Nano-services" — a service for each function
❌ Services organized by technical layer (UI service, DB service) rather than domain
```

### The Right Size
```
Heuristics for service size:
  - One team can own it and understand it fully
  - Can be rewritten in 2-4 weeks if needed
  - Has a single, clear business capability
  - Has its own data store (no shared DB)
  - Deployable independently without coordinating with other services
```

## Service Communication Patterns

### Synchronous (REST / gRPC)
```
Use when: caller needs immediate response to continue

REST over HTTP:
  ✓ Human-readable, easy to debug, widely supported
  ✓ Good for: external-facing APIs, CRUD operations
  Use: HTTP/2, JSON

gRPC:
  ✓ Binary (faster, smaller), strongly typed contracts, streaming
  ✓ Good for: internal service-to-service, high-throughput
  Use: Protocol Buffers, HTTP/2

Circuit breaker (mandatory for synchronous calls):
  Library: Resilience4j (Java), Polly (.NET), tenacity (Python), opossum (Node)
  
  Configuration:
  - Failure threshold: 50% of requests in 30 seconds
  - Timeout: 5 seconds per request
  - Open duration: 30 seconds before testing recovery
  - Half-open test: 1 request to test if service recovered
```

### Asynchronous (Event-Driven)
```
Use when: caller doesn't need immediate response, OR events fan out to multiple consumers

Event bus options:
  Kafka: high-throughput (millions/sec), persistent, replay capability
  RabbitMQ: routing flexibility, lower volume, RPC patterns
  AWS SQS/SNS: managed, simple, AWS-native
  Redis Streams: simpler, lower volume, Redis already in stack

Event design:
  Event name: past tense verb ("[Entity].[Verb]") → "Order.Created", "Payment.Failed"
  Event body: enough data to process without calling back (self-contained)
  Event schema: versioned (schema registry or Avro/Protobuf)
  
  Consumer groups: each service = separate consumer group = independent processing
  Dead letter queue: failed events after N retries → human review
  
  Idempotency: consumers MUST handle duplicate events
  (Kafka/SQS can deliver same event twice — design consumers to be safe)
```

### API Gateway Pattern
```
Purpose: single entry point for all external traffic
Handles: auth, rate limiting, routing, SSL termination, request logging

What goes in the gateway:
  ✓ Authentication (verify JWT/session)
  ✓ Rate limiting (protect all services)
  ✓ SSL/TLS termination
  ✓ Request routing (path-based to services)
  ✓ Response caching (for cacheable endpoints)
  
What should NOT go in the gateway:
  ✗ Business logic (belongs in services)
  ✗ Data transformation (tight coupling)
  ✗ Database access

Options:
  Kong: open-source, plugins, complex
  AWS API Gateway: managed, AWS-native
  nginx/Caddy: simple, high-performance, manual config
  Traefik: container-native, automatic service discovery
```

## Data Management in Microservices

### Database per Service (mandatory)
```
Each service owns its data:
  ✓ Independent schema evolution
  ✓ Technology choice (SQL vs NoSQL per service needs)
  ✓ Independent scaling

How services share data:
  1. API calls (read other service's data via its API)
  2. Events (subscribe to events from other services)
  3. Shared read model (CQRS - separate read/write models)

What you CANNOT have:
  ✗ Two services sharing the same table
  ✗ Service directly reading another service's database
  ✗ Shared transaction across service boundaries
```

### Saga Pattern (distributed transactions)
```
Problem: transferring money between two services atomically
         Service A debits → Service B credits — no shared transaction

Solution 1: Choreography (event-based)
  Order Service: emits "OrderCreated"
  Payment Service: listens → processes payment → emits "PaymentProcessed"
  Inventory Service: listens → reserves stock → emits "StockReserved"
  Each step has a compensating transaction for rollback

Solution 2: Orchestration (saga orchestrator)
  Saga orchestrator calls each step in order
  On failure: orchestrator calls compensating transactions in reverse

Use choreography for < 4 steps
Use orchestration for complex flows with many steps
```

## Observability (you can't debug what you can't see)

### Distributed Tracing (mandatory)
```
Problem: request spans 5 services — where is the bottleneck?
Solution: distributed trace with span IDs

Implementation:
  1. Each service generates/propagates trace-id and span-id in headers
  2. Each service reports spans to tracing backend
  3. Visualize: Jaeger, Zipkin, or AWS X-Ray

OpenTelemetry: standard instrumentation library (use this)
  - Supports traces, metrics, logs in one SDK
  - Export to any backend (Jaeger, Datadog, Grafana Tempo)

In each service:
  - Start span at request boundary
  - Propagate trace context to downstream calls
  - Add relevant attributes (user_id, order_id, etc.)
  - Report errors with status codes
```

### Health Checks
```
Every service needs:
  GET /health       → is the service alive? (liveness probe)
  GET /health/ready → can the service handle requests? (readiness probe)
  GET /metrics      → Prometheus metrics endpoint

Health check response:
  {
    "status": "healthy" | "degraded" | "unhealthy",
    "checks": {
      "database": "healthy",
      "redis": "healthy",
      "downstream_service": "degraded"  // soft dependency
    },
    "version": "1.2.3"
  }
```

## Service Mesh (for complex deployments)

```
When to use a service mesh:
  ✓ 10+ services
  ✓ Need mTLS between services (zero-trust)
  ✓ Traffic management (canary, A/B, circuit breaking)
  ✓ Observability at the network level

Options:
  Istio: most features, complex, Kubernetes-native
  Linkerd: simpler, lower overhead, Kubernetes-native
  Consul Connect: HashiCorp, multi-platform

What a service mesh gives you for free:
  - mTLS between services (encrypted + authenticated)
  - Automatic retry and circuit breaking
  - Distributed tracing (without code changes)
  - Traffic shaping (canary deployments)
  - Rate limiting at network level
```

## Output
- Service map (what services, what boundaries)
- Communication patterns per service pair
- Event catalog (events emitted, events consumed per service)
- Data ownership map
- Observability plan (tracing, metrics, logs)

## Quality checks
- [ ] Services have clear business boundaries (not technical layers)
- [ ] No shared databases between services
- [ ] Circuit breaker on all synchronous calls
- [ ] Distributed tracing implemented
- [ ] Health check endpoints on all services
- [ ] Saga pattern designed for multi-service transactions
- [ ] Idempotency designed into all async consumers
