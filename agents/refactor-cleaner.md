# Refactor & Dead Code Cleaner

## Detection
```bash
npx knip         # Unused files, exports, deps
npx depcheck     # Unused npm dependencies
vulture src/     # Dead Python code
```

## Risk levels
- SAFE: Unused exports, unused devDependencies
- CAREFUL: Dynamic imports, plugin loading
- RISKY: Public API surface

## Workflow
1. Analyze and categorize
2. Verify each item
3. Remove one category at a time
4. Run tests after each batch
