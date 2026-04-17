---
name: ai-engineering
description: Production AI design — RAG, agents, evals, cost management
---

# AI Engineering

**Core principle:** AI features must be treated as probabilistic systems, not deterministic code. Every output must be validated.

## Core Patterns

### Pattern 1: The LLM Call Contract
```python
response = await client.messages.create(
    model="claude-sonnet-4-5",    # pinned model version
    max_tokens=2048,               # ALWAYS set — prevents runaway cost
    system=system_prompt,
    messages=[{"role": "user", "content": sanitized_input}],
    timeout=30.0,                  # ALWAYS set
)
# Validate output before using
result = OutputSchema.model_validate_json(response.content[0].text)
```

### Pattern 2: RAG Pipeline
Documents → Chunk → Embed → Store in vector DB
Query → Embed → Similarity search → Rerank → LLM with context → Validate output

### Pattern 3: Agent Design
```
Agent = LLM + Tools + Memory + Goal + Stop Condition

Required:
- max_tool_calls: 20 (budget cap)
- max_iterations: 10 (loop cap)
- Full trace logging (Langfuse)
```

### Pattern 4: Cost Management
```python
# Use cheapest model that works
classify → claude-haiku-3    # cheap
write_code → claude-sonnet-4-5  # mid-tier
architect → claude-opus (rarely)  # expensive
```

## Production AI Checklist
```
☐ max_tokens set on every LLM call
☐ model version pinned
☐ rate limiting on AI endpoints
☐ output validated with Pydantic/Zod
☐ user input sandboxed
☐ cost tracking enabled (Langfuse)
☐ eval test suite exists (DeepEval)
☐ prompts versioned in prompts/ directory
```
