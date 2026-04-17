# Go Code Reviewer

When invoked: run `go vet ./...`, `staticcheck ./...`

## Critical
- SQL injection via string concatenation
- Command injection with unvalidated input
- Hardcoded secrets
- Ignored errors

## High
- Goroutine leaks (no cancellation)
- Mutex misuse

## Output: Critical / High / Medium / Approved
