# GCP Deployment Guide - FinanceFlow

Complete guide to deploying FinanceFlow on Google Cloud Platform.

---

## Prerequisites

- Google Cloud account with billing enabled
- `gcloud` CLI installed and configured
- Domain name (optional, for custom domain)

---

## Architecture Overview

```
┌─────────────────┐
│   Cloud Run     │ ← Next.js Frontend (Port 3000)
└─────────────────┘
         │
         ↓
┌─────────────────┐
│   Cloud Run     │ ← NestJS Backend (Port 4000)
└─────────────────┘
         │
         ↓
┌─────────────────────────────┐
│  Cloud SQL (PostgreSQL)     │
└─────────────────────────────┘
         │
         ↓
┌─────────────────────────────┐
│  Memorystore (Redis)        │
└─────────────────────────────┘
```

---

## Step 1: Set Up GCP Project

```bash
# Set project ID
export PROJECT_ID="finance-flow-prod"
export REGION="us-central1"

# Create project
gcloud projects create $PROJECT_ID

# Set as active project
gcloud config set project $PROJECT_ID

# Enable billing (replace with your billing account)
gcloud beta billing projects link $PROJECT_ID --billing-account=YOUR_BILLING_ACCOUNT_ID

# Enable required APIs
gcloud services enable \
  run.googleapis.com \
  sql-component.googleapis.com \
  sqladmin.googleapis.com \
  redis.googleapis.com \
  vpcaccess.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com
```

---

## Step 2: Set Up Cloud SQL (PostgreSQL)

```bash
# Create PostgreSQL instance
gcloud sql instances create financeflow-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \ # Start small, scale later
  --region=$REGION \
  --root-password=YOUR_STRONG_PASSWORD

# Create database
gcloud sql databases create financeflow --instance=financeflow-db

# Create user
gcloud sql users create financeflow-user \
  --instance=financeflow-db \
  --password=YOUR_USER_PASSWORD

# Get connection name
gcloud sql instances describe financeflow-db --format='value(connectionName)'
# Save this! Format: project:region:instance
```

---

## Step 3: Set Up Memorystore (Redis)

```bash
# Create Redis instance
gcloud redis instances create financeflow-redis \
  --size=1 \
  --region=$REGION \
  --redis-version=redis_7_0 \
  --tier=basic

# Get Redis host
gcloud redis instances describe financeflow-redis \
  --region=$REGION \
  --format='value(host)'
```

---

## Step 4: Set Up VPC Connector (for private networking)

```bash
# Create VPC connector
gcloud compute networks vpc-access connectors create financeflow-connector \
  --region=$REGION \
  --range=10.8.0.0/28
```

---

## Step 5: Store Secrets in Secret Manager

```bash
# Enable Secret Manager
gcloud services enable secretmanager.googleapis.com

# Create secrets
echo -n "YOUR_JWT_SECRET" | gcloud secrets create jwt-secret --data-file=-
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets create gemini-api-key --data-file=-
echo -n "postgresql://financeflow-user:YOUR_PASSWORD@/financeflow?host=/cloudsql/PROJECT:REGION:INSTANCE" | \
  gcloud secrets create database-url --data-file=-
```

---

## Step 6: Build and Deploy Backend

### Create `backend/Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built app and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Expose port
EXPOSE 4000

# Start
CMD ["npm", "run", "start:prod"]
```

### Deploy backend:

```bash
cd backend

# Build and deploy to Cloud Run
gcloud run deploy financeflow-backend \
  --source . \
  --region=$REGION \
  --platform=managed \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production" \
  --set-secrets="DATABASE_URL=database-url:latest,JWT_SECRET=jwt-secret:latest,GEMINI_API_KEY=gemini-api-key:latest" \
  --add-cloudsql-instances=PROJECT:REGION:INSTANCE \
  --vpc-connector=financeflow-connector \
  --port=4000 \
  --memory=512Mi \
  --cpu=1

# Get backend URL
export BACKEND_URL=$(gcloud run services describe financeflow-backend --region=$REGION --format='value(status.url)')
```

---

## Step 7: Build and Deploy Frontend

### Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Set environment variables
ENV NEXT_PUBLIC_API_URL=$BACKEND_URL
ENV NEXT_TELEMETRY_DISABLED=1

# Build
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Expose port
EXPOSE 3000

# Start
CMD ["npm", "run", "start"]
```

### Deploy frontend:

```bash
# Build and deploy to Cloud Run
gcloud run deploy financeflow-frontend \
  --source . \
  --region=$REGION \
  --platform=managed \
  --allow-unauthenticated \
  --set-env-vars="NEXT_PUBLIC_API_URL=$BACKEND_URL,NODE_ENV=production" \
  --port=3000 \
  --memory=1Gi \
  --cpu=1

# Get frontend URL
export FRONTEND_URL=$(gcloud run services describe financeflow-frontend --region=$REGION --format='value(status.url)')

echo "Frontend URL: $FRONTEND_URL"
```

---

## Step 8: Run Database Migrations

```bash
# Connect via Cloud SQL Proxy
cloud_sql_proxy -instances=PROJECT:REGION:INSTANCE=tcp:5432 &

# Run migrations
cd backend
DATABASE_URL="postgresql://financeflow-user:PASSWORD@localhost:5432/financeflow" npx prisma migrate deploy

# Seed demo data (optional)
DATABASE_URL="postgresql://financeflow-user:PASSWORD@localhost:5432/financeflow" npx prisma db seed
```

---

## Step 9: Set Up Custom Domain (Optional)

```bash
# Map domain to Cloud Run service
gcloud run domain-mappings create \
  --service=financeflow-frontend \
  --domain=app.yourdomain.com \
  --region=$REGION

# Follow DNS instructions to verify domain
```

---

## Step 10: Set Up CI/CD with Cloud Build

### Create `cloudbuild.yaml`:

```yaml
steps:
  # Build backend
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/financeflow-backend', './backend']
  
  # Push backend image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/financeflow-backend']
  
  # Deploy backend
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'financeflow-backend'
      - '--image'
      - 'gcr.io/$PROJECT_ID/financeflow-backend'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
  
  # Build frontend
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/financeflow-frontend', '.']
  
  # Push frontend image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/financeflow-frontend']
  
  # Deploy frontend
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'financeflow-frontend'
      - '--image'
      - 'gcr.io/$PROJECT_ID/financeflow-frontend'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'

images:
  - 'gcr.io/$PROJECT_ID/financeflow-backend'
  - 'gcr.io/$PROJECT_ID/financeflow-frontend'
```

### Set up GitHub trigger:

```bash
# Connect GitHub repo
gcloud beta builds triggers create github \
  --repo-name=finance-flow-project \
  --repo-owner=steph1902 \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

---

## Cost Estimation

**Monthly costs (starting small)**:
- Cloud Run Frontend (1Gi, 1CPU): ~$10-20
- Cloud Run Backend (512Mi, 1CPU): ~$10-15
- Cloud SQL (db-f1-micro): ~$7-10
- Memorystore (1GB Basic): ~$25
- Egress & misc: ~$5-10

**Total**: ~$57-80/month for low traffic

**Scaling**: 
- Upgrade Cloud SQL to `db-n1-standard-1` ($50/mo) for better performance
- Upgrade Redis to Standard tier ($75/mo) for high availability
- Cloud Run auto-scales with traffic (pay per request)

---

## Monitoring & Logging

```bash
# View logs
gcloud run services logs read financeflow-frontend --region=$REGION
gcloud run services logs read financeflow-backend --region=$REGION

# View metrics in Cloud Console
open https://console.cloud.google.com/run?project=$PROJECT_ID
```

---

## Health Checks

Backend health endpoint: `https://your-backend-url.run.app/api/system/health`

Add Cloud Monitoring alerts for:
- High error rate
- Slow response times
- High memory usage

---

## Security Checklist

- ✅ Secrets stored in Secret Manager
- ✅ Cloud SQL private IP only
- ✅ Redis in VPC
- ✅ HTTPS enforced (Cloud Run default)
- ✅ CORS configured
- ✅ Rate limiting enabled
- ✅ Input validation with Zod

---

## Backup Strategy

```bash
# Enable automated backups for Cloud SQL
gcloud sql instances patch financeflow-db \
  --backup-start-time=03:00 \
  --enable-bin-log

# Manual backup
gcloud sql backups create --instance=financeflow-db
```

---

## Useful Commands

```bash
# View services
gcloud run services list

# Update environment variable
gcloud run services update financeflow-backend \
  --set-env-vars="NEW_VAR=value" \
  --region=$REGION

# Scale limits
gcloud run services update financeflow-frontend \
  --max-instances=10 \
  --min-instances=1 \
  --region=$REGION

# Delete everything (cleanup)
gcloud run services delete financeflow-frontend --region=$REGION
gcloud run services delete financeflow-backend --region=$REGION
gcloud sql instances delete financeflow-db
gcloud redis instances delete financeflow-redis --region=$REGION
```

---

## Troubleshooting

**Problem**: Backend can't connect to database  
**Solution**: Ensure Cloud SQL connector is added and connection string is correct

**Problem**: Redis connection timeout  
**Solution**: Check VPC connector is attached to Cloud Run service

**Problem**: Build fails  
**Solution**: Check Cloud Build logs: `gcloud builds log --region=$REGION`

**Problem**: High latency  
**Solution**: Enable Cloud CDN, upgrade instance tiers, add caching

---

**You're ready to deploy! 🚀**

Questions? Check [GCP Cloud Run docs](https://cloud.google.com/run/docs)
