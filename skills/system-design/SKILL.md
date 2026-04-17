---
name: system-design
description: Design scalable, reliable systems from scratch — architecture, tradeoffs, capacity planning
triggers: [system design, architecture, scale, distributed, microservices, design system, high level design]
---

# SKILL: System Design

## Purpose
Design systems that work correctly at scale — handling real load, real failures, and real growth.
Not just "it works on my laptop" architecture.

## The System Design Framework (10-step process)

### Step 1: Requirements Clarification (5 minutes — never skip)

**Functional requirements** (what it must DO):
```
Users: how many? what types?
Core actions: what are the top 5 things users do?
Scale: DAU, requests per second, data volume
Latency: what response times are acceptable?
```

**Non-functional requirements** (how it must BEHAVE):
```
Availability: 99.9% (8.7 hrs/year downtime) or 99.99% (52 mins/year)?
Consistency: strong (always correct) or eventual (eventually syncs)?
Read:write ratio: 10:1? 100:1? 1:1?
Geographic distribution: single region or global?
Compliance: HIPAA? GDPR? SOC2?
```

**Out of scope** (say this explicitly):
```
"I will NOT design: analytics, billing, admin tooling, mobile apps"
```

### Step 2: Capacity Estimation (back-of-envelope)

Template:
```
Users: [X] million DAU
Requests: [X] DAU × [Y] actions/day = [Z] requests/day ÷ 86,400s = [N] RPS
Storage: [X] requests × [Y] bytes/request × [Z] retention days = [N] GB
Bandwidth: [X] RPS × [Y] bytes/response = [N] MB/s
```

Rules of thumb:
```
Single server: handles ~10,000 RPS (well-optimized)
PostgreSQL: handles ~100,000 reads/sec, ~10,000 writes/sec
Redis: handles ~100,000 ops/sec
CDN: handles millions of static requests/sec
1 million DAU = ~100-1000 RPS (depending on engagement)
```

### Step 3: High-Level Design

Always start with this 3-tier base:
```
[Client] → [CDN/Load Balancer] → [API Servers] → [Database]
                                      ↓
                               [Cache Layer]
                                      ↓
                               [Message Queue]
                                      ↓
                               [Workers/Jobs]
```

### Step 4: Component Deep Dive

#### Database Selection
```
PostgreSQL (default):
  ✓ Complex queries, joins, transactions
  ✓ Strong consistency required
  ✓ Structured data with relationships
  Use: most web apps, financial systems

Cassandra / DynamoDB:
  ✓ Write-heavy, massive scale (millions of writes/sec)
  ✓ Time-series data, event logs
  ✓ Global distribution needed
  ✗ Complex queries, joins

Redis:
  ✓ Session storage, caching, rate limiting
  ✓ Real-time leaderboards, counters
  ✓ Pub/Sub messaging
  ✗ Primary storage (limited RAM, not durable by default)

Elasticsearch / OpenSearch:
  ✓ Full-text search, log aggregation
  ✓ Complex filtering, faceted search
  ✗ Primary data store, transactions

S3 / GCS:
  ✓ Files, images, videos, backups
  ✓ Cheap at massive scale
  ✗ Queryable structured data
```

#### Caching Strategy
```
What to cache:
  - Database query results (cache DB reads, not writes)
  - Session data (fast auth lookup)
  - Computed values (expensive calculations)
  - Static API responses (rarely-changing data)

Cache invalidation strategies:
  1. TTL-based: cache expires after N seconds (simple, eventual consistency)
  2. Write-through: update cache when DB is written (strong consistency, more complex)
  3. Cache-aside: app checks cache first, falls back to DB on miss (most common)

Cache sizing rule: cache the hot 20% of data (handles 80% of reads)

Redis cache-aside pattern:
  GET from Redis → miss → GET from DB → SET in Redis with TTL → return
  On write: SET in DB → DELETE from Redis (cache-aside) OR SET in Redis (write-through)
```

#### API Design at Scale
```
REST vs GraphQL vs gRPC:
  REST:     default, simple, HTTP-native, great for CRUD
  GraphQL:  client controls query shape, good for complex/varied frontends
  gRPC:     internal service-to-service (binary, fast, streaming)

Rate limiting:
  Token bucket: allows bursts, smooths traffic
  Fixed window: simple, susceptible to edge spikes
  Sliding window: most accurate

Implementation: in API gateway (not per service) + Redis for distributed counting
```

#### Async Processing (message queues)
```
When to use a queue:
  - Operation takes > 200ms (email, SMS, PDF generation, ML inference)
  - Operation can fail and needs retry (external API calls)
  - Order processing, payment webhooks
  - Fan-out (one event → many handlers)

Queue options:
  Celery + Redis/SQS: Python default
  BullMQ: Node.js default
  Kafka: high-throughput event streaming (millions/sec)
  SQS: AWS-native, fully managed, good default

Worker pattern:
  Queue → Worker picks up task → Process → Mark complete/failed → Retry with backoff
  Dead letter queue: failed tasks after N retries → human review
```

### Step 5: Scaling Patterns

#### Horizontal vs Vertical Scaling
```
Vertical (bigger machine): easy but has ceiling + single point of failure
Horizontal (more machines): unlimited scale, but requires stateless services + load balancer

Stateless requirement: session state in Redis (not in-process memory)
```

#### Database Scaling
```
Level 1: Read replicas (horizontal read scaling)
  Primary handles writes, replicas handle reads
  Lag: seconds for eventual consistency

Level 2: Connection pooling (PgBouncer, RDS Proxy)
  1 app server × 100 connections × 10 app servers = 1000 connections = DB overload
  PgBouncer pools: actual DB connections = 20, virtual connections = unlimited

Level 3: Sharding (horizontal partitioning — last resort)
  Partition data by user_id, region, or time
  Very complex: cross-shard queries, distributed transactions, resharding
  Only when other approaches are exhausted
```

#### CDN Strategy
```
Static assets (always CDN): JS, CSS, images, fonts
API responses (selective CDN): 
  Cache-Control: public, max-age=300  → CDN caches for 5 minutes
  Cache-Control: private, no-store    → never cached (user-specific)
  
Edge caching reduces origin load by 90%+ for typical content
```

### Step 6: Reliability Patterns

#### Circuit Breaker
```
Purpose: Prevent cascade failure when a service is down
States: CLOSED (normal) → OPEN (fail fast) → HALF-OPEN (test recovery)

When service A calls service B:
  - Track failure rate over window
  - If failure rate > 50%: OPEN (fail immediately, don't call B)
  - After timeout: HALF-OPEN (allow 1 test request)
  - If test succeeds: CLOSED again
```

#### Bulkhead Pattern
```
Isolate failure domains:
  - Separate thread pools per external dependency
  - If payment service hangs, it doesn't block order service
  - Connection pool limits per external service
```

#### Graceful Degradation
```
Primary: full feature set
Degraded: core features only (disable search, show cached data)
Minimal: critical path only (read-only mode)
  
Design every page/API to have a degraded fallback
Never let one service failure take down the whole product
```

### Step 7: Consistency vs Availability (CAP Theorem)

```
Theorem: In a distributed system, you can have 2 of 3:
  C: Consistency (all nodes see same data simultaneously)
  A: Availability (every request gets a response)
  P: Partition tolerance (system works despite network failures)

Network partitions ALWAYS happen. So: choose C or A.

CP (prefer consistency): banking, inventory, booking systems
  → "I'd rather return an error than show stale data"
  
AP (prefer availability): social media, content delivery, search
  → "I'd rather show slightly stale data than an error"
```

### Step 8: Data Flow Design

Document exactly how data moves through your system:
```
Write path:
Client → API → Validate → DB Write → Cache Invalidate → Queue Event → Return

Read path (cache hit):
Client → API → Cache Lookup → HIT → Return (< 5ms)

Read path (cache miss):
Client → API → Cache Lookup → MISS → DB Read → Cache Set → Return (< 50ms)

Async path:
Queue → Worker → Process → DB Write → Notify
```

### Step 9: Failure Mode Analysis

For each component, ask:
```
What happens if this component dies?
  → Is there a failover? (replica, retry, fallback)
  
What happens if this component is slow?
  → Is there a timeout? A circuit breaker?
  
What happens if this component returns wrong data?
  → Is there validation? Is there monitoring?
  
What is the blast radius if this fails?
  → How many users are affected? What features break?
```

### Step 10: Monitoring Strategy

```
The Four Golden Signals (Google SRE):
  1. Latency: how long requests take (P50, P95, P99)
  2. Traffic: requests per second
  3. Errors: error rate %
  4. Saturation: how full is the system (CPU %, memory %, queue depth)

Alert on:
  Error rate > 1%
  P99 latency > 2x baseline
  Queue depth > 1000 (workers not keeping up)
  CPU > 80% sustained for 5 minutes
  Disk > 85%
```

## Output
- High-level architecture diagram (draw.io or ASCII)
- Component decisions with tradeoffs
- Capacity estimates
- Data flow documentation
- Failure mode analysis
- Monitoring plan

## Quality checks
- [ ] Requirements clarified before designing (don't skip this)
- [ ] Scale estimated before choosing technologies
- [ ] Every component has a failure mode and fallback
- [ ] Caching strategy defined for hot paths
- [ ] Queue used for all operations > 200ms
- [ ] Monitoring covers all 4 golden signals
- [ ] CAP tradeoff explicitly chosen
