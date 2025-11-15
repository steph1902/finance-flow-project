# Vercel Deployment Guide for FinanceFlow

This guide will help you successfully deploy FinanceFlow to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. A PostgreSQL database (we recommend [Neon](https://neon.tech) or [Supabase](https://supabase.com))
3. (Optional) Google OAuth credentials for Google Sign-In
4. (Optional) Gemini API key for AI features

## Required Environment Variables

The following environment variables **must** be configured in your Vercel project:

### 1. Database Configuration

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

**Example (Neon):**
```bash
DATABASE_URL="postgresql://user:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/finance_flow?sslmode=require"
```

**How to get:**
- **Neon**: https://neon.tech → Create project → Copy connection string
- **Supabase**: https://supabase.com → Project Settings → Database → Connection string

### 2. NextAuth Secret

```bash
NEXTAUTH_SECRET="your-random-secret-key-here"
```

**How to generate:**
```bash
openssl rand -base64 32
```

Or use an online generator: https://generate-secret.vercel.app/32

### 3. NextAuth URL

```bash
NEXTAUTH_URL="https://your-app-name.vercel.app"
```

**Note:** This will be your Vercel deployment URL. You can set this after first deployment.

## Optional Environment Variables

### 4. Google OAuth (for Google Sign-In)

```bash
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

**How to get:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 Client ID credentials
5. Add authorized redirect URI: `https://your-app-name.vercel.app/api/auth/callback/google`

### 5. Gemini AI (for AI Features)

```bash
GEMINI_API_KEY="your-gemini-api-key"
```

**How to get:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Copy and paste into environment variable

**Optional AI Configuration:**
```bash
AI_MODEL_VERSION="gemini-1.5-flash"  # Default, can be changed
AI_TEMPERATURE="0.7"                  # Default, can be changed
AI_MAX_TOKENS="2048"                  # Default, can be changed
```

## Deployment Steps

### Step 1: Push Code to GitHub

Ensure all your code is pushed to a GitHub repository.

### Step 2: Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Select the repository: `steph1902/finance-flow-project`

### Step 3: Configure Environment Variables

In the Vercel project configuration screen:

1. Click "Environment Variables"
2. Add the required variables (see above):
   - `DATABASE_URL` ✅ **Required**
   - `NEXTAUTH_SECRET` ✅ **Required**
   - `NEXTAUTH_URL` ✅ **Required**
   - `GOOGLE_CLIENT_ID` (Optional)
   - `GOOGLE_CLIENT_SECRET` (Optional)
   - `GEMINI_API_KEY` (Optional)

3. Make sure to add them for all environments:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

### Step 4: Configure Build Settings

Vercel should auto-detect Next.js. Verify these settings:

- **Framework Preset:** Next.js
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install` (default)

The `vercel.json` file in the repository already configures these settings.

### Step 5: Deploy

1. Click "Deploy"
2. Wait for the build to complete (usually 2-5 minutes)
3. Once deployed, copy your deployment URL

### Step 6: Update NEXTAUTH_URL

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Update `NEXTAUTH_URL` with your actual deployment URL
4. Redeploy the application

### Step 7: Initialize Database

After first deployment, you need to run Prisma migrations:

1. Install Vercel CLI: `npm i -g vercel`
2. Link to your project: `vercel link`
3. Pull environment variables: `vercel env pull .env`
4. Run migrations: `npx prisma migrate deploy`

Alternatively, you can use Vercel's built-in database migration feature or run migrations from your local machine.

## Troubleshooting

### Build Fails with "DATABASE_URL is not set"

**Solution:** Ensure `DATABASE_URL` is added to environment variables for all environments.

### Build Fails with "NEXTAUTH_SECRET is not set"

**Solution:** Generate a secret using `openssl rand -base64 32` and add it to environment variables.

### Build Fails with "GEMINI_API_KEY is not set"

**Solution:** The build should succeed without this. If it fails, set it to an empty string: `GEMINI_API_KEY=""`

### Authentication Not Working

**Solution:** 
1. Verify `NEXTAUTH_URL` matches your deployment URL exactly
2. Check `NEXTAUTH_SECRET` is set
3. If using Google OAuth, verify redirect URIs in Google Cloud Console

### AI Features Not Working

**Solution:**
1. Verify `GEMINI_API_KEY` is set correctly
2. Check API key has not expired
3. Ensure you have quota available in Google AI Studio

### Database Connection Errors

**Solution:**
1. Verify `DATABASE_URL` is correct
2. Ensure SSL mode is enabled for production databases
3. Check database is accessible from Vercel (not behind firewall)
4. Run `npx prisma migrate deploy` to apply migrations

## Post-Deployment Checklist

- [ ] Verify homepage loads correctly
- [ ] Test user registration/login
- [ ] Test creating a transaction
- [ ] Test budget management
- [ ] Test AI features (if enabled)
- [ ] Check browser console for errors
- [ ] Test on mobile devices
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring/analytics (optional)

## Environment Variables Summary

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | ✅ Yes | - | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | ✅ Yes | - | Random secret for session encryption |
| `NEXTAUTH_URL` | ✅ Yes | - | Your Vercel deployment URL |
| `GOOGLE_CLIENT_ID` | ❌ No | - | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | ❌ No | - | Google OAuth client secret |
| `GEMINI_API_KEY` | ❌ No | `""` | Google Gemini API key for AI features |
| `AI_MODEL_VERSION` | ❌ No | `gemini-1.5-flash` | Gemini model version |
| `AI_TEMPERATURE` | ❌ No | `0.7` | AI temperature setting |
| `AI_MAX_TOKENS` | ❌ No | `2048` | Max tokens for AI responses |

## Performance Optimization

For better performance in production:

1. Enable Vercel Analytics (free tier available)
2. Configure caching headers (already done in `next.config.ts`)
3. Use Vercel Edge Network for static assets
4. Monitor build times and optimize as needed

## Security Recommendations

1. ✅ Security headers are already configured in `next.config.ts`
2. ✅ Use strong `NEXTAUTH_SECRET` (at least 32 characters)
3. ✅ Enable 2FA on your Vercel account
4. ⚠️ Rotate API keys regularly
5. ⚠️ Review environment variables access
6. ⚠️ Monitor security alerts from dependencies

## Support

If you encounter issues not covered in this guide:

1. Check [Vercel Documentation](https://vercel.com/docs)
2. Review [Next.js Documentation](https://nextjs.org/docs)
3. Check [Prisma Documentation](https://www.prisma.io/docs)
4. Open an issue on [GitHub](https://github.com/steph1902/finance-flow-project/issues)

## Quick Start (TL;DR)

```bash
# 1. Set up database (e.g., Neon)
DATABASE_URL="postgresql://..."

# 2. Generate secret
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# 3. Deploy to Vercel
# - Import repo
# - Add DATABASE_URL, NEXTAUTH_SECRET
# - Deploy
# - Update NEXTAUTH_URL after deployment
# - Run: npx prisma migrate deploy
```

---

**Last Updated:** November 2025  
**Next.js Version:** 16.0.1  
**Prisma Version:** 6.18.0
