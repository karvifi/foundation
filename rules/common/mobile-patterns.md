# Mobile Patterns

## Architecture
- Separate UI, state, and data layers
- Keep network/repository logic out of view components/widgets
- Prefer offline-aware flows for critical user paths

## Performance
- Budget startup time and frame drops
- Virtualize long lists and paginate large datasets
- Optimize images and bundle size early

## Security
- Do not store secrets in app bundles
- Use secure storage for tokens
- Enforce certificate pinning only when operationally supported

## Quality
- Add integration tests for critical flows (auth, purchase, sync)
- Track crashes and ANR with telemetry before broad rollout
