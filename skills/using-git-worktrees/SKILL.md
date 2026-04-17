---
name: using-git-worktrees
description: Isolated git workspaces — run multiple branches simultaneously without switching
triggers: [git worktree, isolated workspace, parallel branches, worktree, feature isolation]
---

# SKILL: Using Git Worktrees

## Purpose
Git worktrees let you check out multiple branches simultaneously in separate directories.
Use case: work on a hotfix while keeping your feature branch intact. Or run parallel agent tasks on separate branches.

## Setup

### Step 1: Verify worktree directory is gitignored
```bash
# Add to .gitignore BEFORE creating worktrees
echo ".worktrees/" >> .gitignore
git add .gitignore && git commit -m "chore: gitignore worktrees directory"
```

### Step 2: Create a worktree
```bash
# Create new branch + worktree simultaneously
git worktree add .worktrees/feature-auth -b feature/user-authentication

# Create worktree from existing branch
git worktree add .worktrees/hotfix-payment hotfix/payment-timeout

# List all worktrees
git worktree list
# Output:
# /home/user/project          abc1234  [main]
# /home/user/project/.worktrees/feature-auth  def5678  [feature/user-authentication]
```

### Step 3: Work in the worktree
```bash
# Navigate to worktree
cd .worktrees/feature-auth

# It's a full git environment — all git commands work
git status
git add -A
git commit -m "feat(auth): add login endpoint"

# Run your app from the worktree
cd .worktrees/feature-auth
uv run uvicorn src.main:app --port 8001  # different port!
```

### Step 4: Clean up when done
```bash
# From the main repository directory
git worktree remove .worktrees/feature-auth

# Force remove (if worktree has uncommitted changes)
git worktree remove --force .worktrees/feature-auth

# Delete the branch after merging
git branch -d feature/user-authentication

# Prune stale worktree references
git worktree prune
```

## Workflow with Parallel Agents

When dispatching parallel agents to work simultaneously:
```
Main context (orchestrator):
  1. Create worktrees: one per agent task
  2. Dispatch agents to their worktrees
  3. Wait for all agents to complete
  4. Review results from each worktree
  5. Cherry-pick or merge the best work
  6. Clean up all worktrees

Example:
  git worktree add .worktrees/agent-frontend -b task/frontend
  git worktree add .worktrees/agent-backend -b task/backend
  git worktree add .worktrees/agent-tests -b task/tests
  
  # Agents work in isolation — no conflicts
  
  git worktree remove .worktrees/agent-frontend  # after done
```

## Quality checks
- [ ] .worktrees/ in .gitignore (never commit worktree files)
- [ ] Different ports used for each worktree dev server
- [ ] Worktrees removed after branch merged or abandoned
- [ ] `git worktree prune` run periodically
