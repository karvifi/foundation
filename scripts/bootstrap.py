#!/usr/bin/env python3
"""
Foundation Bootstrap Script
============================
Creates a new project with the full foundation structure in under 5 minutes.
No developer experience required — just answer the questions.

Usage:
  python scripts/bootstrap.py
  python scripts/bootstrap.py --name my-app --type fullstack
"""

import os
import sys
import shutil
import subprocess
import secrets
from pathlib import Path

FOUNDATION_ROOT = Path(__file__).parent.parent


def run(cmd: str, cwd: Path | None = None, check: bool = True) -> int:
    result = subprocess.run(cmd, shell=True, cwd=cwd or Path.cwd(), capture_output=False)
    if check and result.returncode != 0:
        print(f"  ✗ Command failed: {cmd}")
        return result.returncode
    return result.returncode


def ask(prompt: str, default: str = "") -> str:
    display = f"{prompt} [{default}]: " if default else f"{prompt}: "
    try:
        value = input(display).strip()
        return value if value else default
    except (KeyboardInterrupt, EOFError):
        print("\nBootstrap cancelled.")
        sys.exit(0)


def ask_choice(prompt: str, choices: list[str], default: str = "") -> str:
    options = " / ".join(f"[{c.upper()}]" if c == default else c for c in choices)
    while True:
        value = ask(f"{prompt} ({options})", default)
        if value.lower() in choices:
            return value.lower()
        print(f"  Please choose one of: {', '.join(choices)}")


def create_env_file(project_dir: Path, project_name: str) -> None:
    env_content = f"""# Application
APP_NAME={project_name}
APP_ENV=development
APP_PORT=3000

# Database (fill in real values)
DATABASE_URL=postgresql://user:password@localhost:5432/{project_name.replace('-', '_')}
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI Keys (fill in real values)
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
LITELLM_MODEL=claude-sonnet-4-5

# Auth
JWT_SECRET={secrets.token_urlsafe(32)}
BETTER_AUTH_SECRET={secrets.token_urlsafe(32)}
NEXTAUTH_SECRET={secrets.token_urlsafe(32)}
NEXTAUTH_URL=http://localhost:3000

# External Services (add only what you need)
STRIPE_SECRET_KEY=
RESEND_API_KEY=
GITHUB_TOKEN=

# Token Optimization (Claude Code specific)
MAX_THINKING_TOKENS=10000
CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=50
CLAUDE_CODE_SUBAGENT_MODEL=haiku
"""
    (project_dir / ".env").write_text(env_content)
    (project_dir / ".env.example").write_text(env_content.replace(secrets.token_urlsafe(32), "your-secret-here"))
    print(f"  ✓ Created .env (secrets pre-generated — fill in API keys)")


def create_gitignore(project_dir: Path) -> None:
    content = """.env\n.env.local\n.env.*.local\n.env.production\n__pycache__/\n*.py[cod]\n.venv/\nvenv/\n.next/\nout/\ndist/\nbuild/\nnode_modules/\n.turbo/\n.idea/\n.DS_Store\nThumbs.db\n*.log\nlogs/\n*.pem\n*.key\ncoverage/\nplaywright-report/\n.worktrees/\n.memory/\n"""
    (project_dir / ".gitignore").write_text(content)
    print("  ✓ Created .gitignore")


def main() -> None:
    print("\n" + "=" * 60)
    print("  UNIFIED AI FOUNDATION — PROJECT BOOTSTRAPPER")
    print("=" * 60)
    print()

    project_name = ask("Project name (lowercase, hyphens)", "my-app")
    project_name = project_name.lower().replace(" ", "-").replace("_", "-")

    project_type = ask_choice(
        "Project type",
        choices=["fullstack", "backend-only", "frontend-only", "ai-agent"],
        default="fullstack"
    )

    parent_dir = ask("Where to create the project", default=str(Path.home() / "projects"))
    project_dir = Path(parent_dir) / project_name

    if project_dir.exists():
        overwrite = ask_choice(f"Directory {project_dir} already exists. Overwrite?", choices=["yes", "no"], default="no")
        if overwrite == "no":
            print("Bootstrap cancelled.")
            sys.exit(0)

    print(f"\nCreating project: {project_name}")
    print(f"Type: {project_type}")
    print(f"Location: {project_dir}\n")

    project_dir.mkdir(parents=True, exist_ok=True)

    run("git init", cwd=project_dir)
    print("  ✓ Git initialized")

    create_gitignore(project_dir)
    create_env_file(project_dir, project_name)

    # Create docs structure
    (project_dir / "docs").mkdir(exist_ok=True)
    (project_dir / "docs" / "PROGRESS.md").write_text(f"# {project_name} Progress\n\n## Status: SETUP\n\n## Next\n- [ ] First feature implementation\n")
    (project_dir / "docs" / "ARCHITECTURE_DECISIONS.md").write_text(f"# Architecture Decisions for {project_name}\n\n## Stack\nTo be determined after intake.\n\n## Key Decisions\n| Date | Decision | Reason |\n|------|----------|--------|\n")
    print("  ✓ docs/ structure created")

    # README
    (project_dir / "README.md").write_text(f"""# {project_name}

## Setup

1. Fill in `.env` values (already created with placeholders)
2. Install dependencies:
   ```bash
   cd backend && uv sync      # Python backend
   cd frontend && bun install  # Node frontend
   ```
3. Start development:
   ```bash
   cd backend && uv run uvicorn src.main:app --reload
   cd frontend && bun dev
   ```

## Foundation
Built on the Unified AI Foundation. Read `CLAUDE.md` before developing.
""")
    print("  ✓ README.md created")

    # Copy MCP config
    mcp_source = FOUNDATION_ROOT / ".mcp.json"
    if mcp_source.exists():
        shutil.copy(mcp_source, project_dir / ".mcp.json")
        print("  ✓ MCP configuration copied")

    # Create src/tests dirs
    (project_dir / "src").mkdir(exist_ok=True)
    (project_dir / "tests").mkdir(exist_ok=True)

    print(f"""
{'=' * 60}
  PROJECT CREATED: {project_name}
  Location: {project_dir}
{'=' * 60}

Next steps:
  1. Open the project in your IDE
  2. Fill in .env values (especially DATABASE_URL, API keys)
  3. Run the pre-start checklist: PRE_START_CHECKLIST.md
  4. See README.md for full setup instructions

Foundation tools:
  • Skills:  {FOUNDATION_ROOT}/skills/
  • Agents:  {FOUNDATION_ROOT}/agents/
  • Rules:   {FOUNDATION_ROOT}/rules/common/

Happy building! 🚀
""")


if __name__ == "__main__":
    main()
