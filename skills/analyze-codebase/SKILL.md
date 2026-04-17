---
name: analyze-codebase
description: Audit any codebase — architecture, quality, technical debt, security, maintainability
triggers: [audit code, analyze codebase, code quality, technical debt, review architecture, assessment]
---

# SKILL: Analyze Codebase

## Complete Audit Process

### Step 1: Structural Analysis
```bash
# Get stats
find src/ -name "*.py" | wc -l           # file count
find src/ -name "*.py" -exec wc -l {} +  # lines of code
ls -la src/ | wc -l                      # directories

# Identify patterns
find src/ -name "test_*.py" | wc -l      # test count
find src/ -name "__pycache__"            # generated files
grep -r "TODO\|FIXME\|HACK" src/       # technical debt markers
```

### Step 2: Quality Metrics
```bash
# Run all checks
mypy src/ --strict 2>&1 | tail -20
ruff check src/ 2>&1 | tail -20
pytest --cov=src --cov-report=term-missing 2>&1 | grep -E "TOTAL|ERROR"
radon cc src/ -a  # cyclomatic complexity

# Identify hotspots
grep -r "def " src/ | wc -l                    # function count
find src/ -name "*.py" -exec wc -l {} + | sort -rn | head -20  # largest files
```

### Step 3: Dependency Analysis
```bash
# What does this depend on?
pip list | grep -v "^-"
# Check for:
# - Unused dependencies
# - Security vulnerabilities (pip audit)
# - Version conflicts (pip check)

# Size impact
pip show [package] | grep Size
```

### Step 4: Architecture Review
```
Ask these questions:
- What are the main layers? (data, service, API)
- How do they communicate?
- Are there circular dependencies?
- Is business logic separated from infrastructure?
- Can I find the main entry point?
- Can I understand the data model?
```

### Step 5: Security Scan
```bash
# Check for secrets
grep -r "password\|api_key\|secret" src/ | grep -v test
# Check for SQL injection risks
grep -r "f"SELECT\|.format(" src/ | grep -i sql
# Check for hardcoded credentials
grep -r "aws_access_key\|github_token" src/
```

## Output Report
```markdown
# Codebase Analysis: [Project]

## Overview
- Files: N
- Lines of Code: N
- Test Coverage: N%
- Complexity: average cyclomatic complexity N

## Strengths
- Clear separation of concerns (auth, services, API layers)
- Good test coverage (>80%)
- No critical security issues

## Issues
| Priority | Issue | Files | Recommendation |
|----------|-------|-------|-----------------|
| HIGH | SQL injection risk in query builder | service/db.py:45 | Use parameterized queries |
| MEDIUM | Unused dependencies | requirements.txt | Remove [package_name] |
| LOW | Inconsistent naming | models/*.py | Standardize snake_case |

## Technical Debt
- [ ] [issue]: [why it matters]

## Maintenance Plan
- [ ] Priority HIGH: fix by [date]
- [ ] Priority MEDIUM: fix by [date]
- [ ] Priority LOW: fix when refactoring
```

## Quality checks
- [ ] File and line count established
- [ ] Test coverage measured
- [ ] All quality metrics run (type check, lint, complexity)
- [ ] Security scan completed
- [ ] Architecture documented
- [ ] Technical debt identified
- [ ] Dependencies audited
- [ ] Recommendations provided
