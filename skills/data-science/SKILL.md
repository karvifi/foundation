---
name: data-science
description: Data analysis, machine learning, and visualization — from question to insight
triggers: [data, analysis, ML, model, predict, visualize, dataset, statistics, insights]
---

# SKILL: Data Science

## Purpose
Extract meaningful, actionable insights from data using rigorous methods.

## Process

### Step 1: Problem Framing
- What DECISION will this analysis inform?
- What is the target variable? (what are you predicting or measuring)
- Supervised or unsupervised learning? Regression or classification?
- What does success look like? (metric)

### Step 2: Data Audit
```python
# Always start with:
df.shape            # rows × columns
df.info()           # types + nulls
df.describe()       # stats for numerics
df.isnull().sum()   # null counts
df.duplicated().sum() # duplicate rows
```

Data quality checklist:
```
□ Missing values — strategy: drop / impute / flag
□ Outliers — strategy: investigate / clip / transform
□ Class imbalance (classification) — strategy: oversample / undersample / weight
□ Data leakage — target variable must not be in features
□ Train/test split done BEFORE any exploration (no leakage)
```

### Step 3: Exploratory Data Analysis (EDA)
- Univariate: distribution of each variable
- Bivariate: relationship between variables + target
- Correlation matrix (but correlation ≠ causation)
- Time patterns (if time series)
- Geographic patterns (if spatial)

### Step 4: Feature Engineering
- Encode categoricals (one-hot, ordinal, target encoding)
- Scale numerics (StandardScaler for distance-based, MinMax for neural nets)
- Create derived features (interactions, ratios, lags for time series)
- Reduce dimensionality if needed (PCA, feature selection)

### Step 5: Model Selection
| Task | Baseline first | Then try |
|------|---------------|---------|
| Binary classification | Logistic Regression | Random Forest, XGBoost, Neural Net |
| Multiclass | Softmax Regression | Random Forest, XGBoost |
| Regression | Linear Regression | Random Forest, XGBoost, Neural Net |
| Clustering | K-Means | DBSCAN, Hierarchical |
| Anomaly detection | IsolationForest | Autoencoder |
| NLP | TF-IDF + LR | BERT, LLMs |

### Step 6: Evaluation (choose metrics BEFORE training)
- Classification: Accuracy, Precision, Recall, F1, AUC-ROC, PR-AUC
- Regression: RMSE, MAE, R², MAPE
- Always: confusion matrix, residual plots
- Business metric mapping (model metric → business impact)

### Step 7: Interpretation & Communication
- Feature importance (what drives the prediction)
- SHAP values for explainability
- Visualization: matplotlib/seaborn/plotly
- One-page summary: question → method → finding → recommendation

## Output
- EDA notebook with key findings
- Model performance report
- Feature importance analysis
- Business recommendation derived from analysis

## Quality checks
- [ ] Train/test split before any exploration
- [ ] No data leakage
- [ ] Baseline model established before complex models
- [ ] Metrics chosen before training (not chosen to look good)
- [ ] Findings translated to actionable business recommendation
