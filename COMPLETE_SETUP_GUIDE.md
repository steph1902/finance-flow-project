# Complete Production Setup Guide

This guide will walk you through setting up the upgraded FinanceFlow application from scratch to production deployment.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Database Migration](#database-migration)
4. [Environment Configuration](#environment-configuration)
5. [External Services Setup](#external-services-setup)
6. [Testing](#testing)
7. [Production Deployment](#production-deployment)
8. [Post-Deployment](#post-deployment)

---

## 1. Prerequisites

### Required Software

- **Node.js** 20.x or later ([Download](https://nodejs.org/))
- **npm** 10.x or later (comes with Node.js)
- **PostgreSQL** 15.x or later ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))

### Recommended Tools

- **Prisma Studio** (installed via dev dependencies)
- **Postman** or **Thunder Client** for API testing
- **VS Code** with extensions:
  - Prisma
  - ESLint
  - Tailwind CSS IntelliSense
  - TypeScript

### Optional Services

- **Docker** for containerized database
- **pgAdmin** for database management

---

## 2. Local Development Setup

### Step 1: Clone and Install

```bash
cd /Users/step/Documents/finance-flow-project/finance-flow

# Install dependencies
npm install --legacy-peer-deps

# This installs all production dependencies including:
# - Stripe SDK
# - Resend email
# - next-pwa
# - next-intl
# - papaparse
# - Vercel Analytics
# - And all Radix UI components
```

### Step 2: Start PostgreSQL

**Option A: Homebrew (macOS)**
```bash
brew services start postgresql@15
```

**Option B: Docker**
```bash
docker run --name financeflow-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=financeflow \
  -p 5432:5432 \
  -d postgres:15
```

**Option C: System Service (Linux)**
```bash
sudo systemctl start postgresql
```

### Step 3: Verify Database Connection

```bash
psql -U postgres -h localhost
# Inside psql:
CREATE DATABASE financeflow;
\q
```

---

## 3. Database Migration

### Step 1: Configure Database URL

Create `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/financeflow?schema=public"
```

### Step 2: Run Migration

```bash
# This will create all new tables:
# - goals, goal_milestones, goal_contributions
# - notifications
# - shared_budgets, budget_permissions
# - reports
# - currency_rates
# - subscriptions
# - ai_conversations, merchant_data
# - plaid_items (if needed)

npx prisma migrate dev --name add_all_production_features
```

Expected output:
```
✔ Prisma Migrate created and applied the migration
✔ Generated Prisma Client
```

### Step 3: Generate Prisma Client

```bash
npx prisma generate
```

### Step 4: Verify Schema

```bash
npx prisma studio
```

This opens a GUI at `http://localhost:5555` where you can view all tables.

### Step 5: (Optional) Seed Demo Data

```bash
npm run db:seed
```

This creates:
- Demo user
- Sample transactions
- Sample budgets
- Sample recurring transactions

---

## 4. Environment Configuration

### Required Environment Variables

Edit `.env.local`:

```env
# ========================================
# CORE (REQUIRED)
# ========================================

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/financeflow?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<generate-with-openssl-rand-base64-32>"

# AI
GEMINI_API_KEY="<get-from-https://aistudio.google.com/app/apikey>"

# Runtime
NODE_ENV="development"
```

### Generate Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32
```

### Get API Keys

1. **Gemini API Key** (Required)
   - Visit: https://aistudio.google.com/app/apikey
   - Create project
   - Enable Generative Language API
   - Create API key
   - Free tier: 60 requests/minute

2. **Google OAuth** (Optional)
   - Visit: https://console.cloud.google.com/
   - Create OAuth 2.0 Client
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
   - Copy Client ID and Secret

3. **Stripe** (Optional - for monetization)
   - Visit: https://dashboard.stripe.com/apikeys
   - Get Publishable Key and Secret Key
   - For webhooks, use Stripe CLI locally:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

4. **Resend** (Optional - for email)
   - Visit: https://resend.com/api-keys
   - Create API key
   - Verify your sending domain

5. **Fixer.io** (Optional - for currency)
   - Visit: https://fixer.io/
   - Sign up for free tier
   - Get API key

---

## 5. External Services Setup

### Stripe Setup (For Monetization)

1. Create products in Stripe Dashboard:
   - **Basic**: $9/month
   - **Premium**: $19/month
   - **Enterprise**: $49/month

2. Get Price IDs:
```env
STRIPE_PRICE_BASIC="price_xxxxx"
STRIPE_PRICE_PREMIUM="price_xxxxx"
STRIPE_PRICE_ENTERPRISE="price_xxxxx"
```

3. Setup Webhook:
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### Resend Setup (For Email Notifications)

1. Verify domain or use Resend sandbox
2. Create email templates (React components in `src/emails/`)
3. Test email sending:

```bash
# In your app, trigger a test notification
# Check Resend dashboard for delivery status
```

### Vercel KV Setup (For Caching)

1. Create Vercel KV database
2. Copy connection strings to `.env.local`:

```env
KV_URL="redis://..."
KV_REST_API_URL="https://..."
KV_REST_API_TOKEN="..."
KV_REST_API_READ_ONLY_TOKEN="..."
```

---

## 6. Testing

### Unit Tests

```bash
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### API Testing

Use Postman or curl:

```bash
# Health check
curl http://localhost:3000/api/health

# Create goal
curl -X POST http://localhost:3000/api/goals \
  -H "Content-Type: application/json" \
  -H "Cookie: <session-cookie>" \
  -d '{
    "name": "Emergency Fund",
    "targetAmount": 10000,
    "category": "Savings"
  }'
```

### Integration Testing

```bash
# Start dev server
npm run dev

# Test flows:
# 1. Sign up
# 2. Create transaction
# 3. Set budget
# 4. Check AI categorization
# 5. View notifications
# 6. Create goal
# 7. Generate report
```

---

## 7. Production Deployment

### Option A: Vercel (Recommended)

#### 1. Install Vercel CLI

```bash
npm install -g vercel
```

#### 2. Login

```bash
vercel login
```

#### 3. Link Project

```bash
vercel link
```

#### 4. Add Environment Variables

```bash
# Add all required env vars
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
vercel env add GEMINI_API_KEY production
# ... add all optional vars
```

Or via Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add all variables from `.env.example`

#### 5. Setup Vercel Postgres (Recommended)

```bash
vercel storage create postgres
```

This auto-populates `DATABASE_URL`, `POSTGRES_URL`, etc.

#### 6. Run Migration on Production

```bash
# From Vercel dashboard or CLI
vercel env pull .env.production.local
npx prisma migrate deploy
```

#### 7. Deploy

```bash
vercel --prod
```

#### 8. Setup Webhooks

**Stripe Webhook:**
- Endpoint: `https://your-domain.vercel.app/api/stripe/webhook`
- Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

**Plaid Webhook** (if using):
- Endpoint: `https://your-domain.vercel.app/api/plaid/webhook`

### Option B: Custom Server

#### 1. Build

```bash
npm run build
```

#### 2. Start

```bash
npm start
```

#### 3. Use Process Manager

```bash
# PM2
npm install -g pm2
pm2 start npm --name "financeflow" -- start

# Or Docker
docker build -t financeflow .
docker run -p 3000:3000 financeflow
```

---

## 8. Post-Deployment

### Monitoring

1. **Vercel Analytics**
   ```tsx
   // Already integrated in layout.tsx
   import { Analytics } from '@vercel/analytics/react';
   import { SpeedInsights } from '@vercel/speed-insights/next';
   ```

2. **Error Tracking**
   - Consider adding Sentry:
   ```bash
   npm install @sentry/nextjs
   npx @sentry/wizard -i nextjs
   ```

### Performance

1. **Check Core Web Vitals**
   - Visit: https://pagespeed.web.dev/
   - Analyze: https://your-domain.vercel.app

2. **Optimize Images**
   - All images should use Next.js `<Image>` component
   - Enable WebP/AVIF formats

3. **Enable Caching**
   - Vercel KV for API responses
   - Static asset caching (automatic)

### Security

1. **SSL Certificate**
   - Vercel: Automatic
   - Custom: Use Let's Encrypt

2. **Security Headers**
   - Already configured in `next.config.ts`
   - Verify with: https://securityheaders.com/

3. **Rate Limiting**
   - Implement in API routes:
   ```typescript
   import { rateLimit } from '@/lib/rate-limiter';
   
   export async function POST(req: Request) {
     await rateLimit(req);
     // ... handler
   }
   ```

### Backup

1. **Database Backup**
   ```bash
   # Vercel Postgres: Automatic daily backups
   
   # Manual backup
   pg_dump -U postgres -h <host> -d financeflow > backup.sql
   ```

2. **User Data Export**
   - Users can export via `/api/export/data`
   - Implement scheduled exports for compliance

### Compliance

1. **GDPR**
   - Add privacy policy
   - Add data deletion endpoint (already created)
   - Add cookie consent banner

2. **Accessibility**
   - Run audit: https://wave.webaim.org/
   - Test with screen reader
   - Ensure keyboard navigation

---

## 🎯 Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Database migrations run successfully
- [ ] Environment variables configured
- [ ] API keys secured (not in code)
- [ ] Security headers configured
- [ ] Error boundaries implemented
- [ ] Loading states for async operations
- [ ] Analytics configured

### Production

- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Database backups enabled
- [ ] Monitoring active
- [ ] Error tracking configured
- [ ] Rate limiting enabled
- [ ] CORS configured (if API-only routes)
- [ ] Webhook endpoints secured

### Post-Launch

- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Review user feedback
- [ ] Plan feature roadmap
- [ ] Setup customer support
- [ ] Create documentation
- [ ] Announce launch

---

## 🚨 Troubleshooting

### Common Issues

**1. Database Connection Fails**
```bash
# Check PostgreSQL is running
pg_isready

# Check connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL
```

**2. Prisma Client Not Generated**
```bash
# Regenerate
npx prisma generate

# Clear cache
rm -rf node_modules/.prisma
npm run postinstall
```

**3. Build Fails on Vercel**
```
# Check build logs
vercel logs <deployment-url>

# Common fixes:
# - Ensure DATABASE_URL is set
# - Verify all env vars are in production
# - Check for missing dependencies
```

**4. AI Features Not Working**
```
# Check API key
echo $GEMINI_API_KEY

# Test API directly
curl "https://generativelanguage.googleapis.com/v1/models?key=$GEMINI_API_KEY"
```

---

## 📞 Support

- **Documentation**: `/docs`
- **GitHub Issues**: https://github.com/steph1902/finance-flow-project/issues
- **Email**: support@financeflow.app (if configured)

---

**Last Updated**: November 20, 2025  
**Version**: 2.0.0 (Production Upgrade)
