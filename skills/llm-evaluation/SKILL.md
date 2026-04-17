---
name: llm-evaluation
description: Evaluate LLM output quality objectively — testing prompts, scoring frameworks, A/B testing
triggers: [evaluate LLM, test prompt, LLM quality, prompt testing, evaluation metric, compare outputs]
---

# SKILL: LLM Evaluation

## The Problem
"The output looks good" is not evaluation. You need objective metrics.

## Evaluation Metrics

### Factuality (does the AI hallucinate?)
```python
# Fact-checking with sources
def evaluate_factuality(output: str, source_documents: List[str]) -> float:
    """0-1 score: what % of claims are supported by sources"""
    claims = extract_claims(output)
    verified = sum(
        1 for claim in claims
        if any(claim in doc for doc in source_documents)
    )
    return verified / len(claims) if claims else 1.0

# Example
output = "Python was created by Guido van Rossum in 1991."
source = "Python is a programming language created by Guido van Rossum in December 1989."
score = evaluate_factuality(output, [source])  # 0.5 (date wrong)
```

### Relevance (does it answer the question?)
```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def evaluate_relevance(prompt: str, output: str) -> float:
    """0-1 score: how relevant is output to prompt"""
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([prompt, output])
    similarity = cosine_similarity(vectors[0], vectors[1])[0][0]
    return float(similarity)
```

### Completeness (does it cover all aspects?)
```python
def evaluate_completeness(output: str, required_sections: List[str]) -> float:
    """0-1 score: what % of required sections are present"""
    present = sum(1 for section in required_sections if section.lower() in output.lower())
    return present / len(required_sections)

# Example: article evaluation
required = ["introduction", "methodology", "results", "conclusion"]
output = "Our study was..."
score = evaluate_completeness(output, required)
```

### Readability (is it understandable?)
```python
from textstat import flesch_reading_ease

def evaluate_readability(output: str, target_grade: int = 8) -> float:
    """0-1 score: is reading level appropriate?"""
    score = flesch_reading_ease(output)
    # Score 60-100 = 8th grade (ideal for most users)
    # Score 50-60 = 10th grade
    # Score < 50 = college+ level (too hard)
    ideal_range = (60, 100)
    if ideal_range[0] <= score <= ideal_range[1]:
        return 1.0
    return 0.5  # suboptimal
```

### Safety (does it contain harmful content?)
```python
def evaluate_safety(output: str) -> float:
    """0-1 score: how safe is the output (no PII, no violence, etc)"""
    issues = []
    
    # Check for PII
    if re.search(r'\d{3}-\d{2}-\d{4}', output):  # SSN pattern
        issues.append("SSN detected")
    if re.search(r'\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}', output):  # CC
        issues.append("Credit card detected")
    
    # Check for violent content
    violent_terms = ["kill", "harm", "attack", "violence"]
    if any(term in output.lower() for term in violent_terms):
        issues.append("Violent language detected")
    
    return 1.0 - (len(issues) / 10)  # penalize 0.1 per issue
```

## Prompt Evaluation Framework

Test 3-5 variants of a prompt. Score each on your metrics.

```python
prompts = [
    # Variant 1: Clear, specific
    """Generate a blog post about AI safety. 
       Include: current risks, mitigation strategies, future outlook.
       Target: technical audience (CS background assumed).
       Length: 1000-1500 words.""",
    
    # Variant 2: Few-shot example
    """Generate a blog post about [TOPIC].
       Example style:
       ---
       Title: [Catchy title]
       Introduction: [Hook + context]
       Body: [3-4 key points with examples]
       Conclusion: [Takeaway + call to action]
       ---
       Topic: AI safety""",
    
    # Variant 3: Role-based
    """You are a technical writer for a software company.
       Write a blog post about AI safety for engineers.
       Include code examples where relevant.""",
]

results = []
for i, prompt in enumerate(prompts):
    output = await llm.generate(prompt)
    score = {
        "variant": i + 1,
        "factuality": evaluate_factuality(output),
        "relevance": evaluate_relevance(prompt, output),
        "readability": evaluate_readability(output),
        "length": len(output),
        "average_score": (
            evaluate_factuality(output) +
            evaluate_relevance(prompt, output) +
            evaluate_readability(output)
        ) / 3
    }
    results.append(score)

# Find winner
best = max(results, key=lambda x: x["average_score"])
print(f"Best variant: {best['variant']} (score: {best['average_score']:.2f})")
```

## A/B Testing Framework

```python
import random
from dataclasses import dataclass

@dataclass
class Variant:
    name: str
    prompt: str
    
    async def evaluate(self, sample_size: int = 100) -> dict:
        """Run variant on N examples, score each"""
        scores = []
        for i in range(sample_size):
            output = await llm.generate(self.prompt)
            score = evaluate_quality(output)
            scores.append(score)
        
        return {
            "variant": self.name,
            "mean_score": sum(scores) / len(scores),
            "std_dev": statistics.stdev(scores),
            "min": min(scores),
            "max": max(scores),
        }

# Run A/B test
variant_a = Variant("simple", "Explain AI safety.")
variant_b = Variant("detailed", "Explain AI safety. Cover: risks, mitigation, governance.")

results_a = await variant_a.evaluate(sample_size=100)
results_b = await variant_b.evaluate(sample_size=100)

# Statistical significance (t-test)
from scipy import stats
t_stat, p_value = stats.ttest_ind(results_a["scores"], results_b["scores"])
if p_value < 0.05:
    print(f"Variant B is significantly better (p={p_value:.4f})")
else:
    print(f"No significant difference (p={p_value:.4f})")
```

## Building an Eval Suite

```
tests/evals/
├── factuality/
│   ├── test_claims_supported.py
│   ├── test_dates_accurate.py
│   └── test_no_hallucinations.py
├── relevance/
│   ├── test_answers_question.py
│   └── test_covers_all_topics.py
├── safety/
│   ├── test_no_pii.py
│   └── test_no_harmful_content.py
└── readability/
    ├── test_grade_level.py
    └── test_jargon_level.py
```

Each test file runs the evaluation on 10+ examples, reports pass/fail rate.

## Quality checks
- [ ] Factuality metric implemented (with reference documents)
- [ ] Relevance metric implemented (semantic similarity)
- [ ] Completeness metric defined (required sections list)
- [ ] At least 3 prompt variants tested and scored
- [ ] A/B testing framework set up for ongoing optimization
- [ ] Evaluation results logged (for tracking improvements)
