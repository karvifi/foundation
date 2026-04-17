---
name: market-research
description: Validate market opportunity — size, growth, competition, willingness to pay
triggers: [market, TAM, SAM, SOM, market size, competitive landscape, validate market]
---

# SKILL: Market Research

## The Market Sizing Framework

### TAM (Total Addressable Market)
```
All possible customers worldwide who could use this

Example: Email software
TAM = all workers worldwide who send emails
    = ~1.6B office workers
    = extremely large

Formula: # of potential users × average price they'd pay
```

### SAM (Serviceable Addressable Market)
```
Of the TAM, which can we realistically reach?

Example: Email software focused on solopreneurs
SAM = solopreneurs who need email management
    = ~5M globally
    = much more focused than TAM
```

### SOM (Serviceable Obtainable Market)
```
In the first 3-5 years, what market share is realistic?

Example: Solopreneur email management
SOM = if we get 2% market share
    = 5M × 0.02 = 100k customers
    = realistic in 5 years
```

## TAM Calculation Methods

```
Top-Down: Industry reports
  "Global software market = $X billion"
  "Email segment = Y% of that"
  = rough estimate

Bottom-Up: Build from ground up
  "Solopreneurs who email frequently: N million"
  "% who'd pay for solution: M%"
  "Average price they'd pay: $X/year"
  = N × M × X = TAM

Researched: Survey + interviews
  "Survey N=500 target customers"
  "X% would use this"
  "Average willingness to pay: $Y"
```

## Competitive Analysis

```markdown
## Market Competitors

| Company | TAM Focus | Price | Growth | Strengths | Weakness |
|---------|-----------|-------|--------|-----------|----------|
| A | Enterprise | $X/yr | Fast ↑ | Brand | Expensive |
| B | SMB | $Y/yr | Slow → | Cheap | Limited features |
| C | Solopreneur | $Z/yr | ? | Simple | New, unknown |
| Ours | Solopreneur | $Z-10 | ? | [Plan] | [Honest] |

Market share opportunity: Gap at $Z price point for solopreneurs
```

## Willingness to Pay Research

```
Interview method:
  "How much would you pay for [feature]?"
  - Usually overestimate
  - Ask about specific use case
  - Get to real number: "Is $X/month too much?"
  
Pricing test:
  Landing page with pricing
  See what % click "buy"
  Lower click rate = pricing too high (or market not ready)
```

## TAM Size Rules of Thumb

```
TAM < $100M      → Too small (can't be a venture scale company)
TAM $100M-$1B    → Good sweet spot (many successful companies)
TAM > $10B       → Very attractive (but likely lots of competition)
TAM > $100B      → Huge but probably many competitors
```

## Quality checks
- [ ] TAM calculated using two methods (top-down and bottom-up)
- [ ] SAM defined for target segment
- [ ] SOM realistic (2-5% of SAM in 5 years)
- [ ] Competitors identified and analyzed
- [ ] Willingness to pay tested (not assumed)
- [ ] Market trends research (growing? shrinking?)
- [ ] Customer interviews completed (N ≥ 10)
