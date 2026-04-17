---
name: cloud-architecture
description: Cloud-native architecture patterns — AWS/GCP/Azure design, serverless, containers
triggers: [cloud, AWS, GCP, Azure, serverless, infrastructure, containers, scale]
---

# SKILL: Cloud Architecture

## Purpose
Design cloud infrastructure that is scalable, cost-efficient, secure, and maintainable.

## Cloud Provider Selection
| Criteria | AWS | GCP | Azure |
|---------|-----|-----|-------|
| Broadest services | ✅ | | |
| Best ML/AI services | | ✅ | |
| Enterprise/Microsoft | | | ✅ |
| Startup credits | ✅ | ✅ | ✅ |
| Best documentation | ✅ | | |

## Architecture Patterns

### Serverless (lowest operational overhead)
- Functions: AWS Lambda / GCP Cloud Functions / Azure Functions
- Database: DynamoDB / Firestore / Cosmos DB
- Auth: Cognito / Firebase Auth / Azure AD B2C
- Best for: variable load, event-driven, low ops team

### Container (most flexible)
- Orchestration: ECS/EKS (AWS), GKE (GCP), AKS (Azure)
- Registry: ECR, GCR, ACR
- Service mesh: Istio or Linkerd for complex microservices
- Best for: complex applications, dedicated team

### Managed Platform (fastest to ship)
- Vercel, Railway, Fly.io, Render
- Best for: startups, simple architectures

## Key Services by Category
```
Compute: EC2 / Cloud Run / App Service
Containers: ECS/EKS / GKE / AKS
Serverless: Lambda / Cloud Functions / Azure Functions
Database SQL: RDS / Cloud SQL / Azure SQL
Database NoSQL: DynamoDB / Firestore / Cosmos DB
Vector DB: pgvector on RDS, Pinecone, Weaviate Cloud
Cache: ElastiCache / Memorystore / Azure Cache
Object Storage: S3 / GCS / Azure Blob
CDN: CloudFront / Cloud CDN / Azure CDN
Queue: SQS/SNS / Pub/Sub / Azure Service Bus
Secrets: Secrets Manager / Secret Manager / Key Vault
Monitoring: CloudWatch / Cloud Monitoring / Azure Monitor
```

## Security Architecture (mandatory)
```
□ VPC with private subnets for databases
□ Security groups (default deny, explicit allow)
□ IAM least-privilege (never use root/admin keys)
□ All secrets in Secrets Manager (never in code/env)
□ TLS everywhere (ACM for free certs on AWS)
□ Enable CloudTrail/Audit Logs
□ Enable GuardDuty/Security Command Center
□ Enable versioning on S3 buckets
□ Enable MFA on root and admin accounts
□ Encrypt all data at rest (KMS)
```

## Cost Optimization
- Right-size instances (most over-provision)
- Use Spot/Preemptible for non-critical workloads (60-90% cheaper)
- Reserved instances for stable baseline (40% cheaper)
- S3 Intelligent-Tiering for variable access patterns
- Set budget alerts BEFORE you need them
- Use managed services to reduce ops cost (even if slightly pricier)

## Quality checks
- [ ] Single region is enough (most apps don't need multi-region)
- [ ] Private subnets for all databases
- [ ] No hardcoded credentials anywhere
- [ ] Budget alerts configured
- [ ] Disaster recovery plan documented
- [ ] Estimated monthly cost calculated before deployment
