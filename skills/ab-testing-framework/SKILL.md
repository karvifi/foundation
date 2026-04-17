---
name: ab-testing-framework
description: A/B testing patterns — experiment design, statistical significance, feature flags
triggers: [A/B testing, experimentation, feature flags, statistical significance, variant testing]
---

# SKILL: A/B Testing Framework

## Experiment Setup

```python
import random

class ABTest:
    def __init__(self, name, variants, traffic_allocation=None):
        self.name = name
        self.variants = variants
        self.traffic_allocation = traffic_allocation or {
            v: 1/len(variants) for v in variants
        }
    
    def assign_variant(self, user_id):
        """Assign user to variant (consistent)"""
        # Hash user_id for consistency
        hash_val = int(hashlib.md5(f"{self.name}:{user_id}".encode()).hexdigest(), 16)
        rand = (hash_val % 100) / 100
        
        # Determine variant based on allocation
        cumulative = 0
        for variant, allocation in self.traffic_allocation.items():
            cumulative += allocation
            if rand < cumulative:
                return variant
        
        return list(self.variants.keys())[0]

# Usage
test = ABTest("checkout_flow", {
    "control": {"button_text": "Buy Now"},
    "variant_a": {"button_text": "Complete Purchase"}
}, traffic_allocation={"control": 0.5, "variant_a": 0.5})

variant = test.assign_variant(user_id)
button_text = variant["button_text"]
```

## Event Tracking

```python
def track_event(user_id, experiment, variant, event_type, value=None):
    """Track experiment metrics"""
    db.execute("""
        INSERT INTO experiment_events 
        (user_id, experiment, variant, event_type, value, timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
    """, user_id, experiment, variant, event_type, value, datetime.now())

# Track conversion
if user_completed_purchase:
    track_event(user_id, "checkout_flow", variant, "conversion", 
                value=order_total)
```

## Statistical Analysis

```python
from scipy import stats

def analyze_experiment(experiment_name):
    """Calculate statistical significance"""
    # Get conversions per variant
    query = """
        SELECT variant,
               COUNT(DISTINCT user_id) as users,
               SUM(CASE WHEN event_type = 'conversion' THEN 1 ELSE 0 END) as conversions
        FROM experiment_events
        WHERE experiment = ?
        GROUP BY variant
    """
    
    results = db.execute(query, experiment_name).fetchall()
    
    control = results[0]
    variant = results[1]
    
    # Chi-square test
    contingency_table = [
        [control['conversions'], control['users'] - control['conversions']],
        [variant['conversions'], variant['users'] - variant['conversions']]
    ]
    
    chi2, p_value = stats.chi2_contingency(contingency_table)[:2]
    
    return {
        "control_rate": control['conversions'] / control['users'],
        "variant_rate": variant['conversions'] / variant['users'],
        "p_value": p_value,
        "significant": p_value < 0.05
    }
```

## Quality Checks
- [ ] Sample size calculated (power analysis)
- [ ] Statistical significance threshold set (p < 0.05)
- [ ] Experiment duration defined
- [ ] Metrics tracked (conversion, revenue, engagement)
- [ ] Segmentation analysis (by user type)
- [ ] Winner declared based on data (not feelings)
- [ ] Rollout plan for winning variant
- [ ] Documentation of learnings
