---
name: retention-optimization
description: User retention strategies — cohort analysis, churn prediction, engagement loops
triggers: [retention, churn, user engagement, cohort analysis, activation, product metrics]
---

# SKILL: Retention Optimization

## Cohort Analysis

```python
def cohort_retention_analysis(start_date, end_date):
    """Calculate retention by signup cohort"""
    query = """
        WITH cohorts AS (
            SELECT 
                user_id,
                DATE_TRUNC('month', signup_date) as cohort_month
            FROM users
            WHERE signup_date BETWEEN ? AND ?
        ),
        activities AS (
            SELECT 
                user_id,
                DATE_TRUNC('month', activity_date) as activity_month
            FROM user_activities
        )
        SELECT 
            cohort_month,
            activity_month,
            COUNT(DISTINCT a.user_id) as active_users,
            COUNT(DISTINCT c.user_id) as cohort_size
        FROM cohorts c
        LEFT JOIN activities a ON c.user_id = a.user_id
        GROUP BY cohort_month, activity_month
    """
    
    results = db.execute(query, start_date, end_date)
    
    # Calculate retention rate
    retention = {}
    for row in results:
        cohort = row['cohort_month']
        month_diff = (row['activity_month'] - row['cohort_month']).days // 30
        retention_rate = row['active_users'] / row['cohort_size']
        
        if cohort not in retention:
            retention[cohort] = {}
        retention[cohort][f"month_{month_diff}"] = retention_rate
    
    return retention
```

## Churn Prediction

```python
from sklearn.ensemble import RandomForestClassifier

def predict_churn(user_features):
    """Predict likelihood of churn"""
    features = [
        'days_since_last_login',
        'total_sessions',
        'features_used_count',
        'support_tickets_count',
        'payment_failures_count',
        'usage_trend'  # Increasing or decreasing
    ]
    
    X = user_features[features]
    
    # Train model
    model = RandomForestClassifier()
    model.fit(X_train, y_train)  # y = churned (1/0)
    
    # Predict churn probability
    churn_prob = model.predict_proba(X)[:, 1]
    
    # Identify high-risk users
    high_risk = user_features[churn_prob > 0.7]
    return high_risk
```

## Engagement Loops

```python
class EngagementLoop:
    """Trigger actions to re-engage users"""
    
    def check_engagement(self, user):
        # Trigger 1: Inactive for 7 days
        if user.days_since_login > 7:
            self.send_reengagement_email(user)
        
        # Trigger 2: Feature not used
        if not user.has_used_feature('key_feature'):
            self.send_feature_tutorial(user)
        
        # Trigger 3: Low usage
        if user.sessions_this_month < 5:
            self.send_usage_tips(user)
    
    def send_reengagement_email(self, user):
        email_templates = {
            "7_days": "We miss you! Here's what's new...",
            "30_days": "Your account is still active. Come back!",
        }
        send_email(user.email, email_templates["7_days"])
```

## Activation Metrics

```python
def calculate_activation(user):
    """Define activation milestone"""
    activation_criteria = [
        user.completed_onboarding,
        user.created_first_project,
        user.invited_team_member,
        user.used_key_feature
    ]
    
    # User is "activated" if all criteria met
    return all(activation_criteria)

# Track activation rate
activated_users = sum(calculate_activation(u) for u in new_users)
activation_rate = activated_users / len(new_users)
```

## Quality Checks
- [ ] Cohort retention tracked (Day 1, 7, 30, 90)
- [ ] Churn prediction model trained
- [ ] Engagement loops automated
- [ ] Activation criteria defined
- [ ] High-risk users identified
- [ ] Re-engagement campaigns running
- [ ] Usage analytics dashboards
- [ ] NPS (Net Promoter Score) measured
