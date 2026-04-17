---
name: feature-flag-architecture
description: Feature flag patterns — gradual rollout, targeting, experimentation, kill switches
triggers: [feature flags, feature toggles, gradual rollout, canary release, kill switch]
---

# SKILL: Feature Flag Architecture

## Feature Flag System

```python
class FeatureFlagManager:
    def __init__(self):
        self.flags = {}
    
    def create_flag(self, name, enabled=False, rollout_percentage=0):
        self.flags[name] = {
            "enabled": enabled,
            "rollout_percentage": rollout_percentage,
            "targeting_rules": []
        }
    
    def is_enabled(self, flag_name, user_id=None, context=None):
        """Check if flag is enabled for user"""
        flag = self.flags.get(flag_name)
        if not flag:
            return False
        
        # Check global enable
        if not flag["enabled"]:
            return False
        
        # Check targeting rules
        for rule in flag["targeting_rules"]:
            if self.matches_rule(rule, user_id, context):
                return True
        
        # Check rollout percentage
        if user_id:
            hash_val = int(hashlib.md5(f"{flag_name}:{user_id}".encode()).hexdigest(), 16)
            return (hash_val % 100) < flag["rollout_percentage"]
        
        return False
    
    def add_targeting_rule(self, flag_name, rule):
        """Add targeting rule (e.g., beta users only)"""
        self.flags[flag_name]["targeting_rules"].append(rule)

# Usage
flags = FeatureFlagManager()

# Create flag
flags.create_flag("new_checkout", enabled=True, rollout_percentage=10)

# Add targeting: beta users get 100%
flags.add_targeting_rule("new_checkout", {
    "attribute": "user_type",
    "operator": "equals",
    "value": "beta"
})

# Check flag
if flags.is_enabled("new_checkout", user_id=user.id, context={"user_type": user.type}):
    # Show new checkout
    pass
else:
    # Show old checkout
    pass
```

## Gradual Rollout

```python
def gradual_rollout(flag_name, target_percentage=100, step=10, interval_days=1):
    """Gradually increase rollout percentage"""
    current_percentage = 0
    
    while current_percentage < target_percentage:
        # Update flag
        flags.flags[flag_name]["rollout_percentage"] = current_percentage
        
        # Monitor metrics
        metrics = get_metrics(flag_name)
        if metrics["error_rate"] > threshold:
            # Rollback
            flags.flags[flag_name]["rollout_percentage"] = 0
            alert("Rollback triggered for {flag_name}")
            break
        
        # Increment
        current_percentage += step
        time.sleep(interval_days * 86400)
```

## Kill Switch

```python
@app.route('/api/kill-switch/<feature>', methods=['POST'])
def kill_switch(feature):
    """Emergency disable feature"""
    flags.flags[feature]["enabled"] = False
    
    # Alert team
    alert(f"KILL SWITCH: {feature} disabled")
    
    return {"status": "disabled"}
```

## Quality Checks
- [ ] Feature flags for all new features
- [ ] Gradual rollout strategy (0% → 100%)
- [ ] Targeting rules (user segments)
- [ ] Kill switches for critical features
- [ ] Monitoring during rollout
- [ ] Flag cleanup (remove old flags)
- [ ] Flag evaluation logged
- [ ] Rollback plan documented
