# Repo Analysis Prompts (High-Signal)

Use these prompts for every external repository.

## Prompt 1: Extraction

Analyze this repo.

Return ONLY:
1. core idea
2. reusable parts
3. what should be ignored
4. how it fits into my system

Do not summarize everything.
Do not repeat README.

## Prompt 2: Normalization

Convert this repo into a standardized skill.

Format:
- purpose
- when to use
- inputs
- outputs
- quality checks
- failure modes

## Prompt 3: Integration

Where does this belong in my system?

Options:
- control layer
- skill layer
- context layer
- execution layer

Explain why.

## Prompt 4: Gap Closure

Given this repo and my current foundation inventory,
identify what is still missing.

Return ONLY:
1. missing capability
2. severity (critical/high/medium/low)
3. exact file to create
4. acceptance criteria
