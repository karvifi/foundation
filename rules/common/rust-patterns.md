# Rust Patterns

## Standards
- Prefer stable Rust and edition 2021+
- Use `Result<T, E>` for recoverable failures; no unchecked `unwrap()` in production paths
- Model domain errors with `thiserror`; add context with `anyhow` at app edges

## Safety and Performance
- Avoid `unsafe` unless absolutely necessary and documented
- Benchmark before claiming improvements

## Concurrency
- Prefer message passing and immutability
- Bound task concurrency; do not spawn unbounded async tasks
- Use cancellation/timeouts for all network and IO operations

## Testing
- Unit tests colocated with modules; integration tests in `tests/`
- Run `cargo clippy -- -D warnings` and `cargo test` in CI
