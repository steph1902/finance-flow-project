# Beginner's Guide to Deploying FinanceFlow on Google Cloud Platform (GCP)

**Complete step-by-step guide for absolute beginners** 🚀

This guide assumes you have **zero GCP experience** and will walk you through every single step.

---

## 📋 What You'll Need

Before starting, make sure you have:
- [x] A Google account (Gmail)
- [x] A credit/debit card (GCP requires one, but offers $300 free credit)
- [x] Your FinanceFlow project code (already on your computer)
- [x] About 1-2 hours of time

**Cost**: ~$57-80/month after free credits expire

---

## Part 1: Setting Up Your Google Cloud Account

### Step 1: Create a GCP Account

1. Go to https://cloud.google.com/
2. Click **"Get started for free"** (blue button in top right)
3. Sign in with your Google account
4. Follow the prompts to:
   - Agree to terms of service
   - Choose your country
   - Enter your credit card (you won't be charged during free trial)
   
**You'll get $300 in free credits valid for 90 days!** ✨

### Step 2: Create Your First Project

1. Once signed in, you'll see the **Google Cloud Console**
2. Click the project dropdown at the top (says "Select a project")
3. Click **"NEW PROJECT"**
4. Fill in:
   - **Project name**: `financeflow-prod` (or any name you like)
   - **Location**: Leave as "No organization"
5. Click **"CREATE"**
6. Wait ~30 seconds for the project to be created

### Step 3: Enable Billing

1. In the left sidebar, click **"Billing"** (💳 icon)
2. Click **"Link a billing account"**
3. Select your billing account (the one you just created)
4. Click **"SET ACCOUNT"**

✅ **Checkpoint**: You now have a GCP project with billing enabled!

---

## Part 2: Installing Required Tools on Your Mac

### Step 4: Install Google Cloud CLI

Open **Terminal** and run:

```bash
# Download the installer
curl https://sdk.cloud.google.com | bash

# Restart your terminal
exec -l $SHELL

# Initialize gcloud
gcloud init
```

**When prompted**:
1. Choose **"Log in with a new account"** → Opens browser → Log in
2. Choose your project: `financeflow-prod`
3. Choose default region: `us-central1` (recommended)

**Verify installation**:
```bash
gcloud --version
# Should show version info
```

### Step 5: Set Your Project

```bash
# Set your project ID (replace with yours if different)
gcloud config set project financeflow-prod

# Verify it's set
gcloud config get-value project
# Should show: financeflow-prod
```

---

## Part 3: Setting Up the Database (Cloud SQL)

### Step 6: Enable Required APIs

**What are APIs?** Think of them as "turning on" specific GCP features.

Run these commands in Terminal:

```bash
# Enable Cloud SQL
gcloud services enable sql-component.googleapis.com

# Enable Cloud SQL Admin
gcloud services enable sqladmin.googleapis.com

# Enable Cloud Run (for hosting your app)
gcloud services enable run.googleapis.com

# Enable Redis (for background jobs)
gcloud services enable redis.googleapis.com

# Enable Secret Manager (for storing passwords)
gcloud services enable secretmanager.googleapis.com

# Enable VPC Access (for private networking)
gcloud services enable vpcaccess.googleapis.com
```

**Note**: Each command might take 10-30 seconds. Be patient! ⏳

### Step 7: Create PostgreSQL Database

```bash
# Create the database instance (this takes ~5 minutes!)
gcloud sql instances create financeflow-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --root-password=YOUR_STRONG_PASSWORD_HERE

# Replace YOUR_STRONG_PASSWORD_HERE with a strong password
# Example: MySecurePassword123!@#
# WRITE THIS PASSWORD DOWN - YOU'LL NEED IT!
```

**⏰ This will take about 5 minutes. Go grab a coffee!**

When it's done, create the database:

```bash
# Create the database
gcloud sql databases create financeflow \
  --instance=financeflow-db

# Create a user for the app
gcloud sql users create financeflow-user \
  --instance=financeflow-db \
  --password=YOUR_APP_PASSWORD_HERE

# Write this password down too!
```

**Get your database connection name** (you'll need this later):

```bash
gcloud sql instances describe financeflow-db \
  --format='value(connectionName)'

# Copy the output - looks like: your-project:us-central1:financeflow-db
```

**Save this!** Write it down or paste it somewhere safe.

---

## Part 4: Setting Up Redis (Memorystore)

### Step 8: Create Redis Instance

```bash
# Create Redis instance (takes ~3 minutes)
gcloud redis instances create financeflow-redis \
  --size=1 \
  --region=us-central1 \
  --redis-version=redis_7_0 \
  --tier=basic
```

**Get Redis host**:

```bash
gcloud redis instances describe financeflow-redis \
  --region=us-central1 \
  --format='value(host)'

# Copy this IP address - looks like: 10.x.x.x
```

**Save this IP address!**

---

## Part 5: Setting Up Networking (VPC Connector)

### Step 9: Create VPC Connector

**What's this?** Allows your app to talk to Redis privately.

```bash
# Create VPC connector (takes ~2 minutes)
gcloud compute networks vpc-access connectors create financeflow-connector \
  --region=us-central1 \
  --range=10.8.0.0/28
```

---

## Part 6: Storing Your Secrets Safely

### Step 10: Create Secrets

**What are secrets?** Think of them as a secure vault for passwords and API keys.

First, let's create a strong JWT secret:

```bash
# Generate a random 32-character secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copy the output - it looks like: a1b2c3d4e5f6...
```

Now store your secrets:

```bash
# Store JWT Secret
echo -n "PASTE_YOUR_JWT_SECRET_HERE" | \
  gcloud secrets create jwt-secret --data-file=-

# Store Gemini API Key (get from Google AI Studio)
echo -n "YOUR_GEMINI_API_KEY" | \
  gcloud secrets create gemini-api-key --data-file=-

# Store Database URL
# Format: postgresql://USER:PASSWORD@/DATABASE?host=/cloudsql/CONNECTION_NAME
echo -n "postgresql://financeflow-user:YOUR_APP_PASSWORD@/financeflow?host=/cloudsql/your-project:us-central1:financeflow-db" | \
  gcloud secrets create database-url --data-file=-
```

**Replace**:
- `YOUR_GEMINI_API_KEY` - Get this from https://aistudio.google.com/app/apikey
- `YOUR_APP_PASSWORD` - The password you created for financeflow-user
- `your-project:us-central1:financeflow-db` - Your connection name from Step 7

---

## Part 7: Preparing Your Code for Deployment

### Step 11: Update Backend Environment

In your project folder, create `backend/.env.production`:

```bash
cd ~/Documents/finance-flow-project
cat > backend/.env.production << 'EOF'
NODE_ENV=production
PORT=4000
EOF
```

### Step 12: Create Dockerfiles (if not exist)

Check if you have `backend/Dockerfile`:

```bash
ls backend/Dockerfile
```

If it says "No such file", the Dockerfiles already exist in your project. Skip to Step 13.

---

## Part 8: Deploying the Backend

### Step 13: Deploy Backend to Cloud Run

**First, get your database connection name** (from Step 7):

```bash
# Get connection name
gcloud sql instances describe financeflow-db \
  --format='value(connectionName)'

# Copy this - you'll use it in the next command
```

Now deploy:

```bash
cd ~/Documents/finance-flow-project/backend

# Deploy to Cloud Run (this takes ~5-10 minutes)
gcloud run deploy financeflow-backend \
  --source . \
  --region=us-central1 \
  --platform=managed \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production,REDIS_HOST=YOUR_REDIS_IP,REDIS_PORT=6379,PORT=4000" \
  --set-secrets="DATABASE_URL=database-url:latest,JWT_SECRET=jwt-secret:latest,GEMINI_API_KEY=gemini-api-key:latest" \
  --add-cloudsql-instances=YOUR_CONNECTION_NAME \
  --vpc-connector=financeflow-connector \
  --port=4000 \
  --memory=1Gi \
  --cpu=1 \
  --timeout=300
```

**Replace**:
- `YOUR_REDIS_IP` - The Redis IP from Step 8
- `YOUR_CONNECTION_NAME` - The connection name (project:region:instance)

**When prompted**:
- "Please specify a region:" → Press Enter (already specified)
- "Allow unauthenticated invocations?" → `y` (yes)

**⏰ This takes 5-10 minutes. Building Docker image + deploying.**

When done, you'll see:
```
Service [financeflow-backend] revision [financeflow-backend-xxxxx] has been deployed
Service URL: https://financeflow-backend-xxxxx-uc.a.run.app
```

**SAVE THIS URL!** This is your backend URL.

### Step 14: Run Database Migrations

**Install Cloud SQL Proxy**:

```bash
# Download Cloud SQL Proxy
curl -o /usr/local/bin/cloud_sql_proxy https://dl.google.com/cloudsql/cloud_sql_proxy.darwin.amd64

# Make it executable
chmod +x /usr/local/bin/cloud_sql_proxy
```

**Run migrations**:

```bash
# Start the proxy (in a new terminal window)
cloud_sql_proxy -instances=YOUR_CONNECTION_NAME=tcp:5432 &

# In your original terminal:
cd ~/Documents/finance-flow-project/backend

# Run migrations
DATABASE_URL="postgresql://financeflow-user:YOUR_APP_PASSWORD@localhost:5432/financeflow" \
  npx prisma migrate deploy

# Seed demo data (optional)
DATABASE_URL="postgresql://financeflow-user:YOUR_APP_PASSWORD@localhost:5432/financeflow" \
  npx prisma db seed
```

**Stop the proxy**:
```bash
pkill cloud_sql_proxy
```

✅ **Backend is deployed!** Test it:
```bash
curl https://YOUR_BACKEND_URL/api/system/health
# Should return: {"status":"ok"}
```

---

## Part 9: Deploying the Frontend

### Step 15: Deploy Frontend to Cloud Run

```bash
cd ~/Documents/finance-flow-project

# Deploy frontend (takes ~5-10 minutes)
gcloud run deploy financeflow-frontend \
  --source . \
  --region=us-central1 \
  --platform=managed \
  --allow-unauthenticated \
  --set-env-vars="NEXT_PUBLIC_API_URL=YOUR_BACKEND_URL,NODE_ENV=production,NEXT_TELEMETRY_DISABLED=1" \
  --port=3000 \
  --memory=1Gi \
  --cpu=1 \
  --timeout=300
```

**Replace `YOUR_BACKEND_URL`** with your backend URL from Step 13.

**When prompted**:
- Allow unauthenticated? → `y` (yes)

When done, you'll see:
```
Service URL: https://financeflow-frontend-xxxxx-uc.a.run.app
```

**THIS IS YOUR APP URL!** 🎉

---

## Part 10: Testing Your Deployment

### Step 16: Visit Your App!

1. Open your browser
2. Go to: `https://financeflow-frontend-xxxxx-uc.a.run.app`
3. You should see your FinanceFlow app! 🎊

**Try**:
- Sign up for an account
- Create a transaction
- Check if AI categorization works
- View the dashboard

---

## Part 11: Setting Up a Custom Domain (Optional)

### Step 17: Add Your Domain

If you have a domain (e.g., `app.yourdomain.com`):

```bash
gcloud run domain-mappings create \
  --service=financeflow-frontend \
  --domain=app.yourdomain.com \
  --region=us-central1
```

Follow the DNS instructions to verify your domain.

---

## 🎯 Quick Reference

### Your Important URLs

Save these somewhere safe:

```
Backend URL: https://financeflow-backend-xxxxx-uc.a.run.app
Frontend URL: https://financeflow-frontend-xxxxx-uc.a.run.app
Database Connection: your-project:us-central1:financeflow-db
Redis IP: 10.x.x.x
```

### Monthly Costs

With minimal traffic:
- Cloud Run Backend: ~$10-15
- Cloud Run Frontend: ~$10-20
- Cloud SQL (db-f1-micro): ~$7-10
- Redis (1GB Basic): ~$25
- **Total**: ~$57-80/month

---

## 🔧 Common Issues & Fixes

### Issue: "Permission denied"
**Fix**: Make sure billing is enabled:
```bash
gcloud beta billing projects link financeflow-prod \
  --billing-account=YOUR_BILLING_ACCOUNT
```

### Issue: "Service deployment failed"
**Fix**: Check logs:
```bash
gcloud run services logs read financeflow-backend --region=us-central1 --limit=50
```

### Issue: Database connection fails
**Fix**: Verify connection name is correct:
```bash
gcloud sql instances describe financeflow-db --format='value(connectionName)'
```

### Issue: Frontend shows "API Error"
**Fix**: Make sure `NEXT_PUBLIC_API_URL` points to your backend URL (with https://)

---

## 📊 Monitoring Your App

### View Logs

**Backend logs**:
```bash
gcloud run services logs read financeflow-backend --region=us-central1
```

**Frontend logs**:
```bash
gcloud run services logs read financeflow-frontend --region=us-central1
```

### View Metrics

1. Go to: https://console.cloud.google.com/run
2. Click on your service
3. Click on **"METRICS"** tab
4. See requests, latency, CPU, memory usage

---

## 🔄 Updating Your App

When you make code changes:

```bash
# Backend
cd ~/Documents/finance-flow-project/backend
gcloud run deploy financeflow-backend --source . --region=us-central1

# Frontend
cd ~/Documents/finance-flow-project
gcloud run deploy financeflow-frontend --source . --region=us-central1
```

Cloud Run will rebuild and deploy automatically!

---

## 🗑️ Clean Up (Delete Everything)

If you want to delete everything and stop billing:

```bash
# Delete services
gcloud run services delete financeflow-frontend --region=us-central1
gcloud run services delete financeflow-backend --region=us-central1

# Delete database
gcloud sql instances delete financeflow-db

# Delete Redis
gcloud redis instances delete financeflow-redis --region=us-central1

# Delete VPC connector
gcloud compute networks vpc-access connectors delete financeflow-connector --region=us-central1

# Delete secrets
gcloud secrets delete jwt-secret
gcloud secrets delete gemini-api-key
gcloud secrets delete database-url
```

---

## ✅ You're Done!

Congratulations! 🎉 You've successfully deployed FinanceFlow to Google Cloud Platform!

**What you accomplished**:
- ✅ Set up a GCP account
- ✅ Created a PostgreSQL database
- ✅ Set up Redis for background jobs
- ✅ Deployed backend to Cloud Run
- ✅ Deployed frontend to Cloud Run
- ✅ Connected everything securely

Your app is now **live on the internet** and ready for real users!

---

## 📚 Additional Resources

- **GCP Documentation**: https://cloud.google.com/docs
- **Cloud Run Guide**: https://cloud.google.com/run/docs
- **Cloud SQL Guide**: https://cloud.google.com/sql/docs
- **Support**: https://cloud.google.com/support

---

## 💡 Tips for Beginners

1. **Free Credits**: You have $300 free - plenty for several months of testing
2. **Start Small**: db-f1-micro and basic Redis are perfect for starting out
3. **Monitor Costs**: Check billing page weekly to track spending
4. **Set Budget Alerts**: Go to Billing → Budgets & Alerts → Create Budget
5. **Learn Gradually**: Don't worry about advanced features yet - this setup is production-ready!

---

**Questions?** Common beginner questions answered in the main `GCP_DEPLOYMENT.md` guide!

**Enjoy your deployed app!** 🚀
