# Go Patterns

## Standards
- Use Go 1.22+ and modules
- Return errors, do not panic for expected failures
- Wrap errors with context: `fmt.Errorf("load config: %w", err)`
- Prefer interfaces at boundaries, concrete types internally

## Concurrency
- Every goroutine must have cancellation path via context
- Use `errgroup` for fan-out/fan-in tasks
- Guard maps with mutex or use `sync.Map` only when justified

## API and Validation
- Validate all external input at boundaries
- Never build SQL with string concatenation
- Set server/client timeouts explicitly

## Testing
- Table-driven tests by default
- Add race detector in CI: `go test -race ./...`
