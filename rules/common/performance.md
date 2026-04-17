# Performance Rules

## Performance budget
- API P50: < 100ms
- API P95: < 500ms
- LCP: < 2.5s
- Database simple lookups: < 10ms
- Database complex queries: < 100ms

## Database performance
- Check for N+1 queries (loop with DB call inside)
- Index all foreign keys and WHERE columns
- Paginate all list endpoints (max 100 per page)

## Caching
- Use Redis for repeated expensive queries
- Cache user profiles (TTL: 5 minutes)
- Cache configuration/settings
- Invalidate cache on update

## Background tasks
- Slow operations (email, analytics, thumbnails) run in background
- Never block the response for non-critical operations
