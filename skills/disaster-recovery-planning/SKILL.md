---
name: disaster-recovery-planning
description: Disaster recovery patterns — backups, RTO/RPO, failover, incident response
triggers: [disaster recovery, DR, backup, failover, RTO, RPO, incident response, business continuity]
---

# SKILL: Disaster Recovery Planning

## RTO & RPO Definitions

```
RTO (Recovery Time Objective): Maximum acceptable downtime
RPO (Recovery Point Objective): Maximum acceptable data loss

Example:
- RTO: 4 hours (must recover within 4 hours)
- RPO: 1 hour (can lose up to 1 hour of data)

Strategy:
- RPO 1 hour → Backup every 30 minutes
- RTO 4 hours → Practice recovery, automate restore
```

## Backup Strategy

```python
# Automated daily backups
from apscheduler.schedulers.background import BackgroundScheduler

def backup_database():
    """Full database backup"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_file = f"backup_{timestamp}.sql"
    
    # Postgres backup
    os.system(f"pg_dump -U postgres mydb > {backup_file}")
    
    # Upload to S3 (offsite)
    s3.upload_file(backup_file, "backups-bucket", backup_file)
    
    # Verify backup
    if verify_backup(backup_file):
        print(f"Backup successful: {backup_file}")
    else:
        alert("BACKUP FAILED")

# Schedule
scheduler = BackgroundScheduler()
scheduler.add_job(backup_database, 'cron', hour=2)  # Daily at 2 AM
scheduler.start()
```

## Failover Strategy

```python
# Multi-region failover
PRIMARY_REGION = "us-east-1"
FAILOVER_REGION = "us-west-2"

def health_check():
    """Check primary region health"""
    try:
        response = requests.get(f"{PRIMARY_REGION}/health", timeout=5)
        return response.status_code == 200
    except:
        return False

def failover():
    """Switch to failover region"""
    # Update DNS to point to failover region
    route53.change_record_set(
        HostedZoneId=ZONE_ID,
        ChangeBatch={
            'Changes': [{
                'Action': 'UPSERT',
                'ResourceRecordSet': {
                    'Name': 'app.example.com',
                    'Type': 'A',
                    'ResourceRecords': [{'Value': FAILOVER_REGION_IP}]
                }
            }]
        }
    )
    
    alert("FAILOVER INITIATED: Switched to failover region")

# Monitor and failover
if not health_check():
    failover()
```

## Incident Response Runbook

```python
# Incident response playbook
RUNBOOK = {
    "database_down": {
        "severity": "critical",
        "steps": [
            "1. Check database health: SELECT 1",
            "2. Check connection pool: SHOW pool_status",
            "3. Restart database if unresponsive",
            "4. Restore from latest backup if corrupted",
            "5. Notify stakeholders"
        ],
        "escalation": "DBA team",
        "RTO": "2 hours"
    },
    "api_down": {
        "severity": "high",
        "steps": [
            "1. Check API health endpoint",
            "2. Review logs for errors",
            "3. Restart API servers",
            "4. Roll back recent deployment if needed"
        ],
        "escalation": "Platform team",
        "RTO": "1 hour"
    }
}

def execute_runbook(incident_type):
    """Execute incident response"""
    runbook = RUNBOOK[incident_type]
    print(f"Severity: {runbook['severity']}")
    print(f"RTO: {runbook['RTO']}")
    
    for step in runbook["steps"]:
        print(step)
        # Log execution
    
    # Escalate if needed
    if not resolved:
        alert(f"Escalating to {runbook['escalation']}")
```

## Quality Checks
- [ ] RTO & RPO defined
- [ ] Automated backups configured
- [ ] Backup verification automated
- [ ] Offsite backups (different region)
- [ ] Failover tested quarterly
- [ ] Incident runbooks documented
- [ ] Recovery time tested (not theoretical)
- [ ] Post-incident reviews conducted
