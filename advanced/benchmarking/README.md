# Performance Benchmarking

Benchmark your system to establish baselines and identify bottlenecks.

## Benchmarks
- API endpoint latency (target: P95 < 200ms)
- Database query performance
- Cache hit rates
- AI/LLM response times

## Tools
- `load-test.js` - k6 load testing scripts
- `db-benchmark.sql` - Database performance tests
- `results/` - Benchmark results over time

## Usage
```bash
k6 run load-test.js --vus 100 --duration 5m
```
