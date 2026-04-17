---
name: data-pipeline-architecture
description: Data pipeline patterns — ETL, orchestration, data quality, lineage tracking
triggers: [data pipeline, ETL, data engineering, orchestration, Airflow, data quality]
---

# SKILL: Data Pipeline Architecture

## ETL Patterns

### Pattern 1: Batch ETL
```python
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime

# Extract
def extract_data(**context):
    """Pull data from source"""
    conn = psycopg2.connect("source_db")
    data = pd.read_sql("SELECT * FROM orders WHERE date >= %s", 
                       conn, 
                       params=[context['execution_date']])
    data.to_parquet('/tmp/extracted_data.parquet')

# Transform
def transform_data(**context):
    """Clean and transform"""
    data = pd.read_parquet('/tmp/extracted_data.parquet')
    
    # Clean
    data = data.dropna()
    data['total'] = data['quantity'] * data['price']
    
    # Aggregate
    summary = data.groupby('product_id').agg({
        'total': 'sum',
        'quantity': 'sum'
    })
    
    summary.to_parquet('/tmp/transformed_data.parquet')

# Load
def load_data(**context):
    """Load to warehouse"""
    data = pd.read_parquet('/tmp/transformed_data.parquet')
    data.to_sql('sales_summary', warehouse_conn, if_exists='append')

# DAG
dag = DAG('daily_etl', schedule_interval='@daily')

extract = PythonOperator(task_id='extract', python_callable=extract_data, dag=dag)
transform = PythonOperator(task_id='transform', python_callable=transform_data, dag=dag)
load = PythonOperator(task_id='load', python_callable=load_data, dag=dag)

extract >> transform >> load
```

### Pattern 2: Incremental Loading
```python
def incremental_load(**context):
    """Load only new/changed records"""
    # Get last successful run
    last_run = get_last_run_timestamp()
    
    # Extract only new records
    query = f"""
        SELECT * FROM orders 
        WHERE updated_at > '{last_run}'
    """
    new_data = pd.read_sql(query, source_conn)
    
    # Upsert (update or insert)
    for _, row in new_data.iterrows():
        warehouse_conn.execute("""
            INSERT INTO orders (id, data, updated_at)
            VALUES (?, ?, ?)
            ON CONFLICT (id) DO UPDATE 
            SET data = EXCLUDED.data, updated_at = EXCLUDED.updated_at
        """, row['id'], row['data'], row['updated_at'])
```

### Pattern 3: Data Quality Checks
```python
from great_expectations import DataContext

def validate_data(**context):
    """Run data quality checks"""
    data = pd.read_parquet('/tmp/extracted_data.parquet')
    
    # Expectations
    assert data['id'].is_unique, "Duplicate IDs found"
    assert data['price'].min() >= 0, "Negative prices found"
    assert data['date'].max() <= datetime.now(), "Future dates found"
    assert data.isnull().sum().sum() == 0, "Null values found"
    
    # Custom checks
    assert data['total'].sum() > 0, "Total sales is zero"

# Add to DAG
validate = PythonOperator(task_id='validate', python_callable=validate_data)
extract >> validate >> transform >> load
```

### Pattern 4: Data Lineage
```python
class LineageTracker:
    """Track data lineage"""
    def __init__(self):
        self.lineage = []
    
    def record_transform(self, source, target, operation):
        """Record transformation"""
        self.lineage.append({
            "timestamp": datetime.now(),
            "source": source,
            "target": target,
            "operation": operation
        })
    
    def get_lineage(self, table):
        """Get full lineage for table"""
        return [l for l in self.lineage if l["target"] == table]

# Usage
tracker = LineageTracker()

tracker.record_transform(
    source="raw_orders",
    target="clean_orders",
    operation="deduplication + null removal"
)

tracker.record_transform(
    source="clean_orders",
    target="sales_summary",
    operation="aggregation by product"
)
```

### Pattern 5: Backfill Pattern
```python
def backfill_pipeline(start_date, end_date):
    """Reprocess historical data"""
    current = start_date
    
    while current <= end_date:
        print(f"Processing {current}")
        
        # Run ETL for this date
        extract_data(execution_date=current)
        transform_data(execution_date=current)
        load_data(execution_date=current)
        
        current += timedelta(days=1)
```

## Quality Checks
- [ ] Idempotent pipelines (safe to rerun)
- [ ] Data quality checks implemented
- [ ] Incremental loading for large datasets
- [ ] Lineage tracking enabled
- [ ] Error handling and retries
- [ ] Monitoring and alerting
- [ ] Schema evolution handled
- [ ] Backfill strategy documented
