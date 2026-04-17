---
name: analyze-repo
description: Quick GitHub repo analysis — stars, commits, activity, code quality, dependencies
triggers: [analyze repo, GitHub repository, evaluate project, repo assessment, choose library]
---

# SKILL: Analyze Repository

## 5-Minute Quick Analysis
```bash
# 1. Vitals
curl -s https://api.github.com/repos/[owner]/[repo] | jq '.{stars,forks,watchers,open_issues,language,created_at,updated_at,description}'

# 2. Activity (is it alive?)
git log --all --oneline | head -1 | cut -d' ' -f1 | xargs -I {} git log -1 --format=%aI {}
# If last commit > 6 months ago: ⚠️ potentially abandoned

# 3. Dependencies
# Python: pip show [package] or pip-audit
# Node: npm audit or npm list
# Go: go mod graph

# 4. Issues
curl -s https://api.github.com/repos/[owner]/[repo]/issues?state=open | jq '.[0:5] | .[] | {title, state, created_at}'

# 5. License
cat LICENSE
```

## Full Analysis (10 minutes)
```markdown
# Repository Analysis: [repo-name]

## Vitals
| Metric | Value |
|--------|-------|
| Stars | N |
| Forks | N |
| Open Issues | N |
| Last Commit | [N days ago] |
| Primary Language | Python |
| License | MIT |

## Maintenance Status
- Latest release: [N days ago] ✅
- Commit frequency: [N/month] ✅
- Issue response time: [N days average] ✅
→ **Status: ACTIVELY MAINTAINED**

## Code Quality
- Tests: ✅ (CI passes)
- Type hints: ⚠️ (partial)
- Documentation: ✅ (README comprehensive)

## Recommendation
**✅ SAFE TO USE** — actively maintained, good test coverage, MIT license.

Alternative to consider: [similar project X] (smaller, simpler)
```

## Decision Matrix
```
Stars > 1000      → signal of community validation
Stars 100-1000    → growing but not proven
Stars < 100       → niche or new (verify else)

Last commit < 1m  → very active
Last commit 1-6m  → actively maintained
Last commit > 1y  → abandoned ⚠️

Issues responded  → healthy (creator responds)
Issues ignored    → low maintenance concern

Open issues < 10  → managed
Open issues > 50  → backlog growing
```

## Comparison Template
```
| Project | Stars | Updated | Health | Score |
|---------|-------|---------|--------|-------|
| A | 5.2k | 2d | 🟢 Good | 9/10 |
| B | 1.3k | 45d | 🟡 OK | 7/10 |
| C | 892 | 6m | 🟢 Good | 7/10 |

→ Choose A (most stars + most recent)
```

## Quality checks
- [ ] Stars and forks counted (community validation)
- [ ] Last commit date checked (< 6 months = active)
- [ ] License verified (MIT/Apache safe)
- [ ] Issue count and response time assessed
- [ ] Dependencies audited (no critical CVEs)
- [ ] Comparison made to alternatives
- [ ] Decision documented (why this one)
