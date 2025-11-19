# FinanceFlow Deployment Guide

## Prerequisites

- Node.js 20.x or higher
- PostgreSQL 15+ database
- Google Gemini API key (required for AI features)
- Vercel account (for production deployment)

---

## Local Development Setup

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/finance-flow.git
cd finance-flow
npm install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and configure all required variables:

```bash
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/financeflow?schema=public"

# Authentication (generate secret with: openssl rand -base64 32)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-here"

# AI Services (get from https://aistudio.google.com/app/apikey)
GEMINI_API_KEY="your-gemini-api-key"

# Optional: Google OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Optional: Receipt OCR
GOOGLE_CLOUD_API_KEY=""

# Runtime
NODE_ENV="development"
```

### 3. Database Setup

Run Prisma migrations:

```bash
npx prisma migrate deploy
npx prisma generate
```

Seed demo data (optional):

```bash
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Production Deployment (Vercel)

### Prerequisites

- Vercel account
- PostgreSQL database (Supabase/Neon/Railway recommended)
- Domain name (optional)

### 1. Database Setup

**Option A: Supabase (Recommended)**

1. Create account at [https://supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings → Database
4. Format: `postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres?schema=public`

**Option B: Neon**

1. Create account at [https://neon.tech](https://neon.tech)
2. Create new project
3. Copy pooled connection string

**Option C: Railway**

1. Create account at [https://railway.app](https://railway.app)
2. Provision PostgreSQL database
3. Copy connection string

### 2. Run Migrations on Production Database

```bash
# Set DATABASE_URL to production database
export DATABASE_URL="your-production-database-url"
npx prisma migrate deploy
```

### 3. Deploy to Vercel

**Option A: Vercel CLI**

```bash
npm install -g vercel
vercel login
vercel
```

**Option B: GitHub Integration**

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Configure environment variables (see below)
4. Deploy

### 4. Configure Vercel Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

| Variable | Value | Environments |
|----------|-------|--------------|
| `DATABASE_URL` | Your production PostgreSQL URL | Production, Preview |
| `NEXTAUTH_URL` | Your production domain (e.g., `https://yourapp.vercel.app`) | Production |
| `NEXTAUTH_SECRET` | Generated secret (32+ chars) | Production, Preview |
| `GEMINI_API_KEY` | Your Gemini API key | Production, Preview |
| `GOOGLE_CLIENT_ID` | (Optional) OAuth client ID | Production |
| `GOOGLE_CLIENT_SECRET` | (Optional) OAuth client secret | Production |
| `GOOGLE_CLOUD_API_KEY` | (Optional) For receipt OCR | Production |
| `NODE_ENV` | `production` | Production |

### 5. Security Checklist

- ✅ All environment variables set in Vercel
- ✅ Database has SSL enabled
- ✅ NEXTAUTH_SECRET is strong (32+ random characters)
- ✅ NEXTAUTH_URL matches production domain
- ✅ CORS headers configured (if using external APIs)
- ✅ Rate limiting enabled (built-in middleware)
- ✅ Google OAuth credentials restricted to production domain

### 6. Post-Deployment Verification

Test critical paths:

1. **Authentication**
   - Sign up new user
   - Sign in existing user
   - Sign out

2. **Transactions**
   - Create transaction
   - Edit transaction
   - Delete transaction
   - Filter/search

3. **AI Features**
   - AI categorization
   - Chat assistant
   - Insights generation
   - Budget optimization

4. **Performance**
   - Lighthouse score > 90
   - Core Web Vitals pass
   - API response times < 500ms

---

## Environment-Specific Configuration

### Development

```bash
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://localhost:5432/financeflow_dev
```

- Hot reload enabled
- Detailed error messages
- Query logging enabled
- Source maps enabled

### Staging/Preview

```bash
NODE_ENV=production
NEXTAUTH_URL=https://preview-branch.vercel.app
DATABASE_URL=postgresql://staging-db-url
```

- Production build
- Preview database (separate from production)
- Test with production-like data

### Production

```bash
NODE_ENV=production
NEXTAUTH_URL=https://yourdomain.com
DATABASE_URL=postgresql://production-db-url
```

- Optimized build
- Minimal logging
- Error boundaries active
- Rate limiting strict

---

## Database Migrations

### Creating New Migration

```bash
npx prisma migrate dev --name descriptive_name
```

### Applying Migrations

```bash
# Development
npx prisma migrate dev

# Production
npx prisma migrate deploy
```

### Reset Database (⚠️ DANGER - Development Only)

```bash
npx prisma migrate reset
```

---

## Troubleshooting

### Build Failures

**Error: Missing environment variable: GEMINI_API_KEY**

- **Cause**: Environment variables not set in Vercel
- **Fix**: Add all required variables in Vercel dashboard

**Error: Prisma Client not generated**

- **Cause**: `postinstall` hook failed
- **Fix**: Run `npx prisma generate` locally and redeploy

### Database Connection Issues

**Error: Can't reach database server**

- **Cause**: DATABASE_URL incorrect or database unreachable
- **Fix**: 
  1. Verify connection string format
  2. Check database is running
  3. Verify SSL settings (`?sslmode=require` for some providers)

### Authentication Issues

**Error: Invalid JWT signature**

- **Cause**: NEXTAUTH_SECRET changed or missing
- **Fix**: Set consistent NEXTAUTH_SECRET in all environments

**Error: Redirect loop on /login**

- **Cause**: NEXTAUTH_URL doesn't match current URL
- **Fix**: Update NEXTAUTH_URL to match deployment URL

### AI Service Failures

**Error: 429 Too Many Requests (Gemini API)**

- **Cause**: Rate limit exceeded (free tier: 60 req/min)
- **Fix**: Upgrade API tier or implement request queuing

**Error: Invalid API key**

- **Cause**: GEMINI_API_KEY incorrect
- **Fix**: Regenerate API key at [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

---

## Performance Optimization

### Database Optimization

1. **Enable Connection Pooling**
   ```
   DATABASE_URL="postgresql://user:pass@host/db?pgbouncer=true&connection_limit=10"
   ```

2. **Add Indexes** (already configured in schema.prisma)
   - Indexed: `userId`, `date`, `type`, `category`

3. **Use Read Replicas** (for high traffic)

### API Optimization

1. **Enable Edge Functions** (Vercel)
   - Middleware runs on Edge by default
   - Consider edge-compatible API routes

2. **Implement Caching**
   - SWR cache on frontend (already implemented)
   - Consider Redis for API caching

3. **Rate Limiting**
   - Built-in middleware rate limiting (100 req/min)
   - Adjust limits in `middleware.ts`

### Frontend Optimization

1. **Image Optimization**
   - Use Next.js Image component
   - Configure image domains in `next.config.ts`

2. **Code Splitting**
   - Dynamic imports for heavy components
   - Lazy load AI features

3. **Bundle Analysis**
   ```bash
   npm run build
   npx @next/bundle-analyzer
   ```

---

## Monitoring and Logging

### Vercel Analytics

Enable in Vercel dashboard:
- Real User Monitoring (RUM)
- Web Vitals tracking
- Custom events

### Error Tracking

Consider integrating:
- [Sentry](https://sentry.io/) - Error tracking
- [LogRocket](https://logrocket.com/) - Session replay
- [Datadog](https://www.datadoghq.com/) - Full-stack monitoring

### Custom Logging

Built-in logger at `src/lib/logger.ts`:

```typescript
import { logInfo, logError, logWarn } from '@/lib/logger';

logInfo('User action', { userId, action: 'create_transaction' });
logError('API failure', error, { userId, endpoint: '/api/transactions' });
```

---

## Backup and Recovery

### Database Backups

**Automated (Recommended)**

- Supabase: Daily automatic backups
- Neon: Point-in-time recovery
- Railway: Automated snapshots

**Manual Backup**

```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

**Restore**

```bash
psql $DATABASE_URL < backup_20240101.sql
```

### Data Export

Users can export their data via:
- Dashboard → Settings → Export Data (JSON format)
- API: `GET /api/export/data`

---

## Scaling Considerations

### Horizontal Scaling

- Vercel automatically scales
- Database: Use connection pooling
- Consider CDN for static assets

### Vertical Scaling

- Upgrade database instance
- Increase connection pool size
- Enable Redis cache

### Cost Optimization

**Vercel**
- Free tier: 100GB bandwidth/month
- Pro: $20/month (unlimited bandwidth)

**Database**
- Supabase Free: 500MB storage, 2GB bandwidth
- Supabase Pro: $25/month (8GB storage, 50GB bandwidth)

**Gemini API**
- Free tier: 60 requests/min
- Paid tier: $0.0015 per 1K chars

---

## Support

- Documentation: [README.md](./README.md)
- Security: [SECURITY.md](./SECURITY.md)
- Issues: [GitHub Issues](https://github.com/yourusername/finance-flow/issues)
- Discussions: [GitHub Discussions](https://github.com/yourusername/finance-flow/discussions)
