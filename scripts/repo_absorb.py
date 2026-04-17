#!/usr/bin/env python3
"""
Repo Absorb Pipeline

Purpose:
- Clone a curated repo list
- Extract only high-signal files
- Generate extraction manifests
- Remove cloned repos after extraction

Usage:
  python scripts/repo_absorb.py --sources configs/repo_sources.txt
  python scripts/repo_absorb.py --sources configs/repo_sources.txt --keep-clones
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

ROOT = Path(__file__).resolve().parent.parent
INTAKE_DIR = ROOT / "repo_intake"
CLONES_DIR = INTAKE_DIR / "_clones"
EXTRACT_DIR = INTAKE_DIR / "extracted"
REPORTS_DIR = INTAKE_DIR / "reports"

HIGH_SIGNAL_FILES = {
    "README.md", "AGENTS.md", "CLAUDE.md", "SYSTEM.md",
    ".cursorrules", ".mcp.json", "hooks.json",
    "pyproject.toml", "package.json",
}

HIGH_SIGNAL_DIRS = {
    "skills", "agents", "rules", "prompts", "docs", "hooks",
}


@dataclass(frozen=True)
class RepoSource:
    url: str

    @property
    def slug(self) -> str:
        cleaned = self.url.strip().removesuffix(".git")
        match = re.search(r"github.com/([^/]+/[^/]+)$", cleaned)
        if not match:
            raise ValueError(f"Unsupported GitHub URL: {self.url}")
        return match.group(1)

    @property
    def safe_name(self) -> str:
        return self.slug.replace("/", "__")


def run(command: list[str], cwd: Path | None = None) -> subprocess.CompletedProcess[str]:
    return subprocess.run(command, cwd=cwd, text=True, capture_output=True, check=False)


def read_sources(path: Path) -> list[RepoSource]:
    lines = [line.strip() for line in path.read_text(encoding="utf-8").splitlines()]
    urls = [line for line in lines if line and not line.startswith("#")]
    return [RepoSource(url=u) for u in urls]


def ensure_dirs() -> None:
    for d in (INTAKE_DIR, CLONES_DIR, EXTRACT_DIR, REPORTS_DIR):
        d.mkdir(parents=True, exist_ok=True)


def safe_rmtree(path: Path) -> bool:
    def onerror(func, target, _exc_info):
        os.chmod(target, 0o666)
        func(target)
    if not path.exists():
        return True
    try:
        shutil.rmtree(path, onerror=onerror)
        return True
    except OSError:
        return False


def shallow_clone(repo: RepoSource) -> tuple[bool, str, Path]:
    target = CLONES_DIR / repo.safe_name
    if target.exists():
        safe_rmtree(target)
    result = run(["git", "clone", "--depth", "1", repo.url, str(target)])
    return result.returncode == 0, (result.stdout + "\n" + result.stderr).strip(), target


def iter_signal_paths(repo_root: Path) -> Iterable[Path]:
    for item in repo_root.iterdir():
        if item.is_file() and item.name in HIGH_SIGNAL_FILES:
            yield item
        if item.is_dir() and item.name in HIGH_SIGNAL_DIRS:
            for child in item.rglob("*"):
                if child.is_file():
                    if child.suffix.lower() in {".png", ".jpg", ".jpeg", ".gif", ".pdf", ".lock", ".zip"}:
                        continue
                    yield child


def copy_signal(repo: RepoSource, repo_root: Path) -> list[str]:
    out_root = EXTRACT_DIR / repo.safe_name
    if out_root.exists():
        shutil.rmtree(out_root)
    out_root.mkdir(parents=True, exist_ok=True)
    copied: list[str] = []
    for src in iter_signal_paths(repo_root):
        rel = src.relative_to(repo_root)
        dst = out_root / rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)
        copied.append(str(rel).replace("\\", "/"))
    return copied


def write_report(repo: RepoSource, status: str, clone_log: str, copied: list[str]) -> None:
    report = {
        "repo": repo.slug, "url": repo.url, "status": status,
        "copied_count": len(copied), "copied_files": copied,
        "notes": "Use templates/repo-extraction-report.md to complete semantic extraction.",
        "clone_log": clone_log[-8000:],
    }
    out = REPORTS_DIR / f"{repo.safe_name}.json"
    out.write_text(json.dumps(report, indent=2), encoding="utf-8")


def absorb(repo: RepoSource, keep_clones: bool) -> None:
    clone_path = CLONES_DIR / repo.safe_name
    if clone_path.exists():
        print(f"  [SKIP] Already cloned — {clone_path}")
        copied = copy_signal(repo, clone_path)
        write_report(repo, "extracted", "", copied)
        print(f"  [OK] Extracted {len(copied)} files")
        return
    print(f"  Cloning {repo.slug}...")
    ok, log, clone_path = shallow_clone(repo)
    if not ok:
        print(f"  [FAIL] Clone failed")
        write_report(repo, "clone_failed", log, [])
        return
    copied = copy_signal(repo, clone_path)
    write_report(repo, "extracted", log, copied)
    print(f"  [OK] Extracted {len(copied)} files")
    if not keep_clones and clone_path.exists():
        safe_rmtree(clone_path)


def main() -> int:
    parser = argparse.ArgumentParser(description="Absorb high-signal files from GitHub repos")
    parser.add_argument("--sources", required=True, help="Path to repo source list")
    parser.add_argument("--keep-clones", action="store_true", help="Keep cloned repositories")
    args = parser.parse_args()

    sources_path = (ROOT / args.sources).resolve() if not Path(args.sources).is_absolute() else Path(args.sources)
    if not sources_path.exists():
        print(f"Sources file not found: {sources_path}")
        return 1

    ensure_dirs()
    repos = read_sources(sources_path)
    if not repos:
        print("No repo sources found.")
        return 1

    print(f"Absorbing {len(repos)} repositories...")
    for idx, repo in enumerate(repos, start=1):
        print(f"[{idx}/{len(repos)}] {repo.slug}")
        absorb(repo, keep_clones=args.keep_clones)

    print(f"\nDone. See repo_intake/reports/ for extraction status.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
