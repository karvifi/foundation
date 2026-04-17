---
name: project-bootstrap
description: Create new project from scratch — boilerplate, dependencies, structure, first test pass
triggers: [new project, bootstrap, start project, initialize, create project, fresh start]
---

# SKILL: Project Bootstrap

## 5-Minute Project Setup

### Backend (FastAPI + PostgreSQL)
```bash
mkdir project && cd project

# Python environment
python3.12 -m venv venv
source venv/bin/activate
pip install uv
uv sync

# Create structure
mkdir -p src/{models,services,api,schemas}
mkdir -p tests/{unit,integration}
mkdir -p docs

# Create files
touch src/__init__.py
touch src/main.py
touch .env.example
touch pyproject.toml
```

### pyproject.toml
```toml
[project]
name = "my-app"
version = "0.1.0"
dependencies = [
    "fastapi",
    "sqlalchemy",
    "pydantic",
    "python-dotenv",
]

[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = "test_*.py"

[tool.mypy]
python_version = "3.12"
strict = true

[tool.ruff]
line-length = 100
```

### First File (src/main.py)
```python
from fastapi import FastAPI
from contextlib import asynccontextmanager

app = FastAPI()

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### First Test (tests/unit/test_health.py)
```python
import pytest
from httpx import AsyncClient
from src.main import app

@pytest.mark.asyncio
async def test_health_check():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "healthy"}
```

### Run First Time
```bash
pytest tests/ -v                    # ✅ test passes
ruff check src/                     # ✅ no lint errors
mypy src/                           # ✅ no type errors
uvicorn src.main:app --reload       # ✅ server runs
```

## Frontend (Next.js)
```bash
bun create next-app@latest
cd project

# Install UI library
bun add shadcn-ui tailwindcss

# Create first component
touch src/components/Layout.tsx

# First page with component
# pages/index.tsx already exists
```

## Git Setup
```bash
git init
git add .
git commit -m "chore: initial project scaffold"

# .gitignore
echo "venv/" >> .gitignore
echo ".env" >> .gitignore
echo "node_modules/" >> .gitignore
echo "__pycache__/" >> .gitignore
echo ".DS_Store" >> .gitignore

git add .gitignore && git commit -m "chore: gitignore"
```

## Makefile
```makefile
.PHONY: setup test lint run

setup:
	uv sync && bun install

test:
	pytest tests/ -v

lint:
	ruff check src/ && mypy src/

run:
	uvicorn src.main:app --reload

all: test lint
```

## Quality checks
- [ ] Directory structure created
- [ ] Dependencies installed
- [ ] First test passes
- [ ] Linter configured and passing
- [ ] Type checker configured and passing
- [ ] Server runs (test with /health)
- [ ] Git initialized and first commit
- [ ] README exists with setup instructions
