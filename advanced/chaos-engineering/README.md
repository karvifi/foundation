# Chaos Engineering

Test system resilience by introducing controlled failures.

## Experiments Included
1. Random pod deletion (test auto-recovery)
2. Network latency injection (test timeout handling)
3. Database connection exhaustion (test connection pooling)
4. CPU/Memory stress (test resource limits)

## Safety
- Always run in non-production first
- Define blast radius (limit scope)
- Have rollback ready

## Tools
- `chaos-toolkit/` - Chaos Toolkit experiments
- `litmus/` - LitmusChaos Kubernetes experiments
