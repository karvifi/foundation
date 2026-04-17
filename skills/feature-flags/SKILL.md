---
name: feature-flags
description: Feature flags for safe deployment — gradual rollout, A/B testing, quick rollback
triggers: [feature flags, gradual rollout, canary, A/B test, kill switch, rollback, feature toggle]
---

# SKILL: Feature Flags

## The Problem
You deploy a new feature and 5% of users get errors.
Without feature flags, you must revert the entire deployment.
With feature flags, you flip a switch and the feature disappears for everyone.

## Implementation Pattern

```python
# Use a feature flag system (Unleash, LaunchDarkly, custom)
# Here's a custom minimal implementation

from datetime import datetime
from enum import Enum

class RolloutStrategy(Enum):
    ALL = "all"              # 100% of users
    PERCENTAGE = "percentage"  # N% of users
    USERS = "users"          # specific user IDs
    BETA = "beta"            # users with beta flag

flags = {
    "new_checkout_flow": {
        "enabled": True,
        "strategy": RolloutStrategy.PERCENTAGE,
        "percentage": 20,  # Start with 20% of users
        "description": "New checkout redesign - gradual rollout"
    },
    "ai_recommendations": {
        "enabled": True,
        "strategy": RolloutStrategy.USERS,
        "user_ids": ["user_123", "user_456"],  # Test with specific users
        "description": "AI-powered product recommendations"
    },
    "legacy_api": {
        "enabled": False,  # KILL SWITCH: disable immediately if issues
        "strategy": RolloutStrategy.ALL,
        "description": "Old API version - being deprecated"
    }
}

def is_feature_enabled(feature_name: str, user_id: str = None) -> bool:
    """Check if feature is enabled for this user"""
    flag = flags.get(feature_name)
    if not flag or not flag["enabled"]:
        return False
    
    strategy = flag["strategy"]
    
    if strategy == RolloutStrategy.ALL:
        return True
    
    elif strategy == RolloutStrategy.PERCENTAGE:
        # Deterministic: same user always gets same result
        user_hash = hash(f"{user_id}:{feature_name}") % 100
        return user_hash < flag["percentage"]
    
    elif strategy == RolloutStrategy.USERS:
        return user_id in flag["user_ids"]
    
    elif strategy == RolloutStrategy.BETA:
        user = get_user(user_id)
        return user.is_beta
    
    return False
```

## Usage in Code

```python
# In your API endpoint
@app.get("/api/v1/products/{product_id}")
async def get_product(product_id: str, current_user: User = Depends(get_current_user)):
    product = await db.get(Product, product_id)
    
    # Use new feature for 20% of users
    if is_feature_enabled("new_checkout_flow", current_user.id):
        return {
            "data": {
                "product": product,
                "checkout": await get_new_checkout(product_id),  # new version
            }
        }
    else:
        return {
            "data": {
                "product": product,
                "checkout": await get_legacy_checkout(product_id),  # old version
            }
        }

# In frontend
if (featureFlags.isEnabled("ai_recommendations", userId)) {
  return <NewRecommendations />;
} else {
  return <LegacyRecommendations />;
}
```

## Rollout Strategy

```
Day 1: Enable for 5% (catch critical bugs with minimal damage)
Day 3: Enable for 25% (if metrics look good)
Day 5: Enable for 50% (if still good)
Day 7: Enable for 100% (full rollout)

If error rate spikes at ANY point:
  → Immediately disable (flip flag to 0%)
  → Debug the issue
  → Fix and redeploy
  → Start rollout again at 5%
```

## Monitoring

```python
# Log feature flag decisions
async def log_feature_flag_decision(
    feature_name: str,
    user_id: str,
    enabled: bool,
    path: str
):
    logger.info("feature_flag_decision", extra={
        "feature": feature_name,
        "user_id": user_id,
        "enabled": enabled,
        "path": path,
    })

# Query: which users hit the new feature?
SELECT COUNT(DISTINCT user_id) as user_count
FROM feature_flag_logs
WHERE feature = "new_checkout_flow" AND enabled = true;

# Query: error rate by feature
SELECT feature, enabled, error_rate
FROM (
  SELECT feature, enabled, 
         COUNT(*) as total,
         COUNT(*) FILTER (WHERE error = true) as errors,
         COUNT(*) FILTER (WHERE error = true)::FLOAT / COUNT(*) as error_rate
  FROM logs
  GROUP BY feature, enabled
) WHERE error_rate > 0.01;  # > 1% error = investigate
```

## Rollback Example

```python
# If new feature causes issues:
flags["new_checkout_flow"]["enabled"] = False

# Queries against new checkout go to legacy version
# No deployment needed
# Instant rollback

# After fixing:
flags["new_checkout_flow"]["enabled"] = True
flags["new_checkout_flow"]["percentage"] = 5  # restart at 5%
```

## Quality checks
- [ ] Feature flag system implemented (custom or external)
- [ ] All new features behind flags
- [ ] Rollout strategy defined (start at 5%, not 100%)
- [ ] Error rate monitoring per feature
- [ ] Kill switch in place (way to disable instantly)
- [ ] Gradual rollout tested (5% → 25% → 50% → 100%)
