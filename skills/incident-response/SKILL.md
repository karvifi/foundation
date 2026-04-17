---
name: incident-response
description: Respond to production incidents — diagnosis, communication, resolution, post-mortem
triggers: [production issue, incident, emergency, error spike, system down, customer impact]
---

# SKILL: Incident Response

## The Golden Rules
```
1. TRANSPARENCY — communicate early and often
2. FOCUS — get the system back online (perfection is secondary)
3. LEARNING — every incident generates a post-mortem
4. BLAMELESS — blame systems, not people
```

## The Incident Runbook

### Phase 1: Detection & Triage (first 2 minutes)
```
□ Error rate > 1% within 5 minutes → trigger incident
□ Page on-call engineer (PagerDuty / Slack integration)
□ Declare severity:
   CRITICAL: 100% of users affected, core feature down
   HIGH: 50%+ of users affected or > 5% error rate
   MEDIUM: <50% users affected, workaround exists
   LOW: minor feature broken, no customer impact

□ Create incident ticket with:
   - Start time (exact second)
   - Severity level
   - Affected service(s)
   - Initial error message / metric spike
```

### Phase 2: Initial Response (first 5 minutes)
```
□ Gather on-call team:
   - Service owner (knows the system)
   - On-call engineer (fixes the issue)
   - On-call manager (communicates)

□ Stop the bleeding (no perfect fix yet):
   OPTION A: Feature flag → disable the broken feature
   OPTION B: Scale → if overloaded, add capacity
   OPTION C: Revert → rollback last deployment
   (usually fastest = disable feature via flag)

□ Communicate:
   - Update status page: "We are investigating..."
   - Email customers (if CRITICAL/HIGH)
   - Slack #incidents: "Service X down, investigating. ETA 10 min"
```

### Phase 3: Root Cause Analysis (10-30 minutes)

Check in this order (usually resolves in first 3):
```
1. Recent deploy? → check deploy diff
2. Traffic spike? → check dashboard metrics
3. Database slow? → check query performance
4. Third-party issue? → check status pages (AWS, Stripe, etc)
5. Configuration? → verify environment variables
6. Resource exhaustion? → check CPU, memory, disk
7. Concurrency issue? → check logs for race conditions
```

```python
# Quick diagnosis script
async def diagnose_incident():
    checks = {
        "last_deploy": await get_last_deploy_time(),
        "error_rate": await get_current_error_rate(),
        "p99_latency": await get_p99_latency(),
        "database_health": await check_db_connection(),
        "cpu_usage": await get_cpu_percent(),
        "memory_usage": await get_memory_percent(),
        "disk_usage": await get_disk_percent(),
        "recent_errors": await get_latest_error_logs(limit=20),
    }
    
    # Print diagnosis
    for check, result in checks.items():
        status = "🔴" if result["bad"] else "✅"
        print(f"{status} {check}: {result['message']}")
```

### Phase 4: Implementation (minutes 30-60+)

```
IF root cause = recent deploy:
  Option 1: Revert the deploy (1 minute fix)
    flyctl releases rollback --app [app]
    git revert [commit-sha]
    
  Option 2: Fix forward (fix in code, redeploy)
    [make minimal fix]
    git commit -m "fix: [incident issue]"
    flyctl deploy

IF root cause = database:
  Run query that caused slowness
  Add index or optimize query
  Redeploy
  Monitor for resolution

IF root cause = resource exhaustion:
  Scale up: add more resources
  Monitor: does it recover?
  Once stable: investigate why (memory leak, inefficient code)
```

### Phase 5: Recovery & Verification (as incident resolves)

```
□ Verify fix:
  - Error rate back to < 0.1%
  - P95 latency back to baseline
  - Customer reports of issues stop (monitor support channel)
  - Feature working in staging
  - Spot check in production

□ Communicate resolution:
  - Update status page: "Issue resolved"
  - Email customers: "We have resolved the incident..."
  - Slack: "Incident resolved at [timestamp], root cause [brief]"

□ Monitor closely for next 30 minutes:
  - Anomaly detection on all metrics
  - Any signs it's coming back?
```

### Phase 6: Post-Mortem (within 24 hours)

```markdown
# Incident Post-Mortem: [incident name]

## Timeline
- 14:32 UTC: Error rate spike detected
- 14:34 UTC: On-call team paged
- 14:38 UTC: Root cause identified (memory leak in new feature)
- 14:41 UTC: Feature disabled via flag
- 14:44 UTC: Error rate normalized

## Root Cause
Memory leak in new recommendation engine (deploy at 13:45).
Each request allocated 100MB, never freed.
After 200 requests, service ran out of memory and crashed.

## Why it happened
- No memory profiling before deploy
- Load testing only tested 10 concurrent users
- Production gets 1000 concurrent users

## What we're doing to prevent this
- [ ] Implement memory profiling in pre-deploy checks
- [ ] Load test with 10x expected concurrent users
- [ ] Add memory usage alerts (trigger if > 80% for 2 minutes)
- [ ] Feature flags for high-risk features (this one should have had a flag)

## Follow-up
- Memory profiling PR: due by [date]
- Load testing process: due by [date]
- Alert configuration: due by [date]
```

## Quality checks
- [ ] Runbook created and accessible to on-call team
- [ ] Status page configured (can update without deployment)
- [ ] Feature flags in place for all critical features
- [ ] Monitoring alerts configured for critical metrics
- [ ] On-call rotation documented
- [ ] Post-mortem template created
- [ ] Team trained on incident response process
