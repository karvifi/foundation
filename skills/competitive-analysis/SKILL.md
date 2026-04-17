---
name: competitive-analysis
description: Deep competitive intelligence — teardown every competitor's strategy, product, and weakness
triggers: [competitor, competitive, analysis, market landscape, alternatives, versus, compare]
---

# SKILL: Competitive Analysis

## Purpose
Know your competitors better than they know themselves. Find the gap they all miss. Build the thing they can't copy.

## The 5 Layers of Competitive Intelligence

### Layer 1: Competitor Discovery (find everyone)

**Direct competitors**: Same solution, same customer
**Indirect competitors**: Different solution, same problem
**Potential competitors**: Not in market yet but could enter
**Substitutes**: How the customer solves this TODAY without anyone's product

Finding them:
```bash
# Search strategies
"[product category] alternatives"
"[product category] vs"
"[problem] software/tool/service"
"best [product category] for [customer type]"
G2, Capterra, Product Hunt, AlternativeTo
GitHub Awesome Lists (for dev tools)
App stores (for mobile)
Job listings (companies building what you're building signal future competition)
```

### Layer 2: Product Teardown (what they actually built)

For each competitor, document:

**Functional map**:
```
Core feature 1: [name] → [what it does] → [how well 1-5]
Core feature 2: [name] → [what it does] → [how well 1-5]
...
```

**Signup & onboarding** (actually sign up — free trial or freemium):
- Time to value: how long until you get the first result?
- First 5 minutes: what do they show you?
- First email sequence: what do they say?
- Where does it get confusing or painful?

**UX patterns**:
- Navigation model (sidebar / top nav / cards)
- Primary action prominence (what do they want you to do most?)
- Mobile experience quality
- Loading speed and performance

**Technology signals** (BuiltWith, Wappalyzer, job listings):
- Frontend stack
- Backend signals
- AI/ML usage
- Infrastructure

### Layer 3: Business Model Analysis

**Pricing strategy**:
| Tier | Price | What's included | What's gated |
|------|-------|----------------|-------------|
| Free | $0 | [list] | [list] |
| Starter | $X/mo | [list] | [list] |
| Pro | $X/mo | [list] | [list] |
| Enterprise | Custom | [list] | [list] |

**Packaging signals**:
- Is pricing per-seat, usage-based, flat, or outcome-based?
- What's the primary upgrade trigger? (storage, users, features, usage)
- What do they hide behind Enterprise? (API? SSO? SLA?)
- Annual discount percentage?

**Distribution channels**:
- Primary acquisition: organic search / paid / PLG / sales / partnerships
- Content strategy: blog frequency, SEO keywords they rank for
- Community presence: Slack, Discord, Reddit, forums
- Integrations: what ecosystems they live inside
- Partnership/affiliate program?

### Layer 4: Customer Intelligence

**Review mining** (G2, Trustpilot, App Store, Reddit, Twitter/X):

For each competitor, collect 50+ reviews and extract:
```
Most praised (patterns across reviews):
- [pattern]: [specific quotes]

Most criticized (patterns across reviews):
- [pattern]: [specific quotes]

Common switching reasons (why people leave):
- "I left [competitor] because..."

Common switching-to reasons (why people choose them):
- "I chose [competitor] because..."
```

**Job listing intelligence**:
What they're hiring tells you what they're building:
- Engineering roles → what tech, what problems they're solving
- Sales roles → what markets, what ACV target
- Content roles → what channels they're doubling down on
- Location → where they're expanding

**Social listening** (Twitter, LinkedIn, Reddit):
- What do customers vent about publicly?
- What feature requests keep appearing?
- What workarounds do customers use?

### Layer 5: Strategic Analysis

**Competitive Positioning Matrix**:
Pick 2 axes most important to your market (e.g., Price vs Power, Ease vs Features):

```
         EASY TO USE
              │
Cheap ────────┼──────── Expensive  
              │
         COMPLEX TO USE

Plot each competitor. Find the white space.
```

**SWOT per competitor** (their SWOT, not yours):
| Competitor | Strengths | Weaknesses | Opportunities | Threats |
|-----------|-----------|-----------|---------------|---------|

**Porter's Five Forces applied**:
- Who has power in this market (buyers, suppliers, or neither)?
- How high are switching costs (low = commoditized, high = sticky)?
- What's the minimum viable moat to defend against copycat entry?

## The Gap Analysis (what this whole exercise is for)

After completing all 5 layers:

**The Universal Gap**: What does EVERYONE do poorly?
**The Ignored Segment**: Who is nobody serving?
**The Price Gap**: Where is there no good option at [price point]?
**The Feature Gap**: What feature does everyone want but nobody has?
**The Experience Gap**: Where is the UX consistently terrible?
**The Trust Gap**: Where does trust break down (security, reliability, support)?

**Your Opportunity Statement**:
```
Every competitor does [X] wrong.
Customers consistently complain about [Y].
Nobody is solving [Z] for [specific customer type].
If we nail [specific thing], we can own [specific position].
```

## Output
- Competitor profile for each (using all 5 layers)
- Feature comparison matrix
- Pricing matrix
- Customer sentiment analysis (positive + negative patterns)
- Positioning map (visual)
- Gap analysis with opportunity statement

## Quality checks
- [ ] Actually signed up for every competitor's free tier
- [ ] Collected real customer reviews (not just the homepage testimonials)
- [ ] Checked job listings for future signals
- [ ] Positioning map based on real data, not assumptions
- [ ] Gap analysis is specific (not "be better" — be specific about what)
- [ ] At least 3 direct + 3 indirect competitors analyzed
