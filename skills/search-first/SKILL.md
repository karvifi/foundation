---
name: search-first
description: Research existing solutions before writing any custom code — always
triggers: [search first, existing solution, find library, already exists, before building, reinvent]
---

# SKILL: Search First

## The Law
```
NEVER write code for a capability that might already exist.
Existing, maintained library > well-written custom code.
Custom code = code you have to maintain forever.
```

## The Search Sequence

### Step 1: Search package registries first

```bash
# Python
pip search [capability]          # (deprecated — use web)
# Go to: pypi.org and search
# Check: GitHub stars, last release date, open issues

# Node/Bun
npm search [capability]          # shows npm results
# Go to: npmjs.com and search
# Check: weekly downloads, last publish date

# Go
pkg.go.dev search [capability]

# Rust
crates.io search [capability]
```

### Step 2: Search GitHub for patterns
```bash
gh search repos [keywords] --sort stars --limit 10
gh search code "[code pattern]" --language python
```

### Step 3: Check if MCP tool exists for this
Before ANY tool-related code, check `.mcp.json`:
- Reading/writing files? → filesystem MCP
- Git operations? → git MCP
- Web search? → brave-search MCP
- GitHub operations? → github MCP
- Library docs? → context7 MCP
- Browser automation? → playwright MCP
- Database operations? → supabase MCP

### Step 4: Check existing codebase
```bash
# Search existing code for similar patterns
grep -r "[capability keyword]" src/
grep -r "def [similar function]" src/
```

## Evaluation Criteria

Before adopting a library, check ALL of these:

```
Maintenance:
  □ Last commit < 6 months ago? (red flag if older)
  □ Open issues being responded to? (check recent issues)
  □ Latest release < 1 year? (> 2 years = abandoned)
  
Quality:
  □ Stars > 500? (community validation)
  □ Test suite exists and passes?
  □ Documentation is complete?
  
Compatibility:
  □ Works with our Python/Node version?
  □ License compatible? (MIT/Apache good; GPL check for commercial)
  □ No conflicting peer dependencies?
  
Size:
  □ Bundle/install size acceptable?
  □ Doesn't pull in heavy dependencies we don't need?
```

## Decision Matrix

| Signal | Action |
|--------|--------|
| Full match, maintained, MIT/Apache | **Adopt** — install and use |
| Partial match, strong base | **Extend** — thin wrapper over it |
| Multiple weak matches | **Combine** — 2-3 focused packages |
| Nothing suitable found | **Build** — but document the search |

## When Building is the Right Choice

```
Build custom when:
  ✓ Nothing exists for the specific need
  ✓ All existing options are abandoned
  ✓ Existing options have incompatible licenses
  ✓ The need is simple enough (10-20 lines vs. huge dependency)
  ✓ The need is so domain-specific no general library exists

Even then: document what you searched and why you built.
```

## Quality checks
- [ ] Package registries checked before writing custom code
- [ ] MCP tools checked for tool-related operations
- [ ] Existing codebase checked for similar patterns
- [ ] Chosen library passes all evaluation criteria
- [ ] Decision documented if custom code was chosen despite search
