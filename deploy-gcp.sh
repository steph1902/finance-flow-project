#!/bin/bash

# FinanceFlow GCP Deployment Script
# This script deploys FinanceFlow to Google Cloud Platform

set -e

echo "🚀 Starting FinanceFlow GCP Deployment..."

# Configuration
PROJECT_ID="${GCP_PROJECT_ID}"
REGION="asia-northeast1"
SERVICE_ACCOUNT="financeflow-sa@${PROJECT_ID}.iam.gserviceaccount.com"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI not found. Please install: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if project ID is set
if [ -z "$PROJECT_ID" ]; then
    echo "❌ GCP_PROJECT_ID environment variable not set"
    echo "   Set it with: export GCP_PROJECT_ID=your-project-id"
    exit 1
fi

echo -e "${BLUE}📋 Project ID: ${PROJECT_ID}${NC}"
echo -e "${BLUE}🌍 Region: ${REGION}${NC}"

# Step 1: Enable required APIs
echo -e "\n${GREEN}Step 1: Enabling required GCP APIs...${NC}"
gcloud services enable \
  cloudrun.googleapis.com \
  cloudbuild.googleapis.com \
  sql-component.googleapis.com \
  sqladmin.googleapis.com \
  secretmanager.googleapis.com \
  --project=${PROJECT_ID}

# Step 2: Create Cloud SQL instance (if not exists)
echo -e "\n${GREEN}Step 2: Setting up Cloud SQL PostgreSQL...${NC}"
if ! gcloud sql instances describe financeflow-db --project=${PROJECT_ID} &> /dev/null; then
    echo "Creating Cloud SQL instance..."
    gcloud sql instances create financeflow-db \
      --database-version=POSTGRES_16 \
      --tier=db-f1-micro \
      --region=${REGION} \
      --storage-type=SSD \
      --storage-size=10GB \
      --backup \
      --project=${PROJECT_ID}
    
    echo "Creating database..."
    gcloud sql databases create financeflow \
      --instance=financeflow-db \
      --project=${PROJECT_ID}
    
    echo "Setting postgres password..."
    gcloud sql users set-password postgres \
      --instance=financeflow-db \
      --password="$(openssl rand -base64 32)" \
      --project=${PROJECT_ID}
else
    echo "✅ Cloud SQL instance already exists"
fi

# Step 3: Create secrets in Secret Manager
echo -e "\n${GREEN}Step 3: Setting up Secret Manager...${NC}"
create_secret() {
    local secret_name=$1
    local secret_value=$2
    
    if ! gcloud secrets describe ${secret_name} --project=${PROJECT_ID} &> /dev/null; then
        echo "Creating secret: ${secret_name}"
        echo -n "${secret_value}" | gcloud secrets create ${secret_name} \
          --data-file=- \
          --replication-policy="automatic" \
          --project=${PROJECT_ID}
    else
        echo "✅ Secret ${secret_name} already exists"
    fi
}

# Get database connection string
DB_INSTANCE_CONNECTION=$(gcloud sql instances describe financeflow-db \
  --format='value(connectionName)' \
  --project=${PROJECT_ID})

create_secret "DATABASE_URL" "postgresql://postgres:CHANGE_ME@localhost/financeflow?host=/cloudsql/${DB_INSTANCE_CONNECTION}"
create_secret "JWT_SECRET" "$(openssl rand -base64 32)"
create_secret "REDIS_URL" "redis://CHANGE_ME:6379"

echo -e "\n${BLUE}⚠️  Remember to update secrets with actual values:${NC}"
echo "   gcloud secrets versions add DATABASE_URL --data-file=- --project=${PROJECT_ID}"
echo "   gcloud secrets versions add GEMINI_API_KEY --data-file=- --project=${PROJECT_ID}"
echo "   gcloud secrets versions add REDIS_URL --data-file=- --project=${PROJECT_ID}"

# Step 4: Build and deploy using Cloud Build
echo -e "\n${GREEN}Step 4: Building and deploying services...${NC}"
gcloud builds submit \
  --config=cloudbuild.yaml \
  --substitutions=_BACKEND_URL=https://financeflow-backend-CHANGE_ME.a.run.app \
  --project=${PROJECT_ID}

echo -e "\n${GREEN}✅ Deployment complete!${NC}"
echo -e "${BLUE}📱 Your services are being deployed to Cloud Run.${NC}"
echo ""
echo "To view your services:"
echo "  gcloud run services list --project=${PROJECT_ID}"
echo ""
echo "To view logs:"
echo "  gcloud logging read 'resource.type=cloud_run_revision' --project=${PROJECT_ID} --limit=50"
