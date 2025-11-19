# FinanceFlow - Vercel Deployment Quick Checklist

## ✅ Pre-Deployment Verification

- [x] Build succeeds locally: `npm run build`
- [x] No TypeScript errors
- [x] No build warnings
- [x] All tests pass: `npm test` (if applicable)
- [x] `.env.example` is complete and accurate
- [x] `.gitignore` includes all sensitive files
- [x] No hardcoded secrets in codebase
- [x] Security headers configured in `next.config.ts`

---

## 🚀 Vercel Deployment Steps

### 1. Database Setup

Choose one:
- [ ] **Supabase** - Create project at https://supabase.com
- [ ] **Neon** - Create project at https://neon.tech
- [ ] **Railway** - Create project at https://railway.app

Get connection string (format: `postgresql://...`)

### 2. Run Migrations on Production Database

```bash
# Set DATABASE_URL to your production database
export DATABASE_URL="your-production-database-url"

# Run migrations
npx prisma migrate deploy
npx prisma generate
```

### 3. Deploy to Vercel

**Option A: GitHub Integration (Recommended)**
- [ ] Push code to GitHub
- [ ] Import repository in Vercel dashboard
- [ ] Configure environment variables (see below)
- [ ] Deploy

**Option B: Vercel CLI**
```bash
npm install -g vercel
vercel login
vercel
```

---

## 🔐 Environment Variables to Set in Vercel

Copy these to: **Vercel Dashboard → Settings → Environment Variables**

### Required (All Environments)

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# Authentication (generate with: openssl rand -base64 32)
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-32-character-secret-here"

# AI Services (get from: https://aistudio.google.com/app/apikey)
GEMINI_API_KEY="your-gemini-api-key-here"

# Runtime
NODE_ENV="production"
```

### Optional (Production Only)

```bash
# Google OAuth (if using)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Receipt OCR (if using)
GOOGLE_CLOUD_API_KEY="your-cloud-api-key"
```

### Environment Scope
- ✅ Production: All required vars
- ✅ Preview: All required vars (can use different database)
- ❌ Development: Not needed (use local `.env.local`)

---

## 🧪 Post-Deployment Testing

### Critical Path Tests

1. **Authentication**
   - [ ] Visit your Vercel domain
   - [ ] Sign up new account
   - [ ] Sign in with created account
   - [ ] Sign out

2. **Transactions**
   - [ ] Create a transaction
   - [ ] View transactions list
   - [ ] Edit a transaction
   - [ ] Delete a transaction
   - [ ] Test filtering/search

3. **AI Features**
   - [ ] Test AI categorization
   - [ ] Test chat assistant
   - [ ] Test insights generation
   - [ ] Test budget optimization

4. **Budgets**
   - [ ] Create a budget
   - [ ] View budget progress
   - [ ] Edit a budget
   - [ ] Delete a budget

5. **Recurring Transactions**
   - [ ] Create recurring transaction
   - [ ] View upcoming transactions
   - [ ] Deactivate recurring transaction

### Performance Tests

- [ ] Lighthouse score > 90 (https://pagespeed.web.dev/)
- [ ] Core Web Vitals pass
- [ ] API response times < 500ms
- [ ] No console errors in browser

### Security Tests

- [ ] Check security headers: https://securityheaders.com/
- [ ] Verify HTTPS enforcement
- [ ] Test rate limiting (make 100+ requests quickly)
- [ ] Verify JWT cookie is HttpOnly
- [ ] Check CSP headers block inline scripts

---

## 🐛 Troubleshooting Common Issues

### Build Failure: "Missing environment variable: GEMINI_API_KEY"

**Cause:** Environment variables not set in Vercel

**Fix:**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add all required variables (see above)
3. Redeploy: Deployments → Click "..." → Redeploy

### Runtime Error: "Can't reach database server"

**Cause:** DATABASE_URL incorrect or database unreachable

**Fix:**
1. Verify connection string format
2. Check database is running
3. For Supabase/Neon: Add `?sslmode=require` to connection string
4. Test connection locally: `psql $DATABASE_URL`

### Error: "Invalid JWT signature"

**Cause:** NEXTAUTH_SECRET missing or different between deployments

**Fix:**
1. Generate new secret: `openssl rand -base64 32`
2. Set in Vercel for Production AND Preview
3. Redeploy

### Error: "429 Too Many Requests" (Gemini API)

**Cause:** Rate limit exceeded on Gemini free tier (60 req/min)

**Fix:**
1. Upgrade to paid Gemini API tier
2. Or implement request queuing
3. Or reduce AI feature usage

---

## 📊 Monitoring Setup (Post-Deployment)

### Vercel Analytics
- [ ] Enable in Vercel Dashboard → Analytics
- [ ] Monitor Web Vitals
- [ ] Track custom events

### Optional: Error Tracking
- [ ] Set up Sentry (https://sentry.io/)
- [ ] Configure error reporting
- [ ] Set up alerts

### Optional: Logging
- [ ] Set up LogRocket (https://logrocket.com/)
- [ ] Configure session replay
- [ ] Monitor user flows

---

## 🔄 Continuous Deployment

### Automatic Deployments (GitHub Integration)

- ✅ **Production**: Deploys on push to `main` branch
- ✅ **Preview**: Deploys on pull requests
- ✅ **Development**: Use `vercel --prod` or merge to main

### Manual Deployments (CLI)

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

---

## 🎯 Success Criteria

Your deployment is successful if:

- ✅ Build completes without errors
- ✅ All environment variables are set
- ✅ Database is connected and accessible
- ✅ Authentication works (signup, signin, signout)
- ✅ Transactions CRUD operations work
- ✅ AI features respond correctly
- ✅ No console errors
- ✅ Lighthouse score > 90
- ✅ Security headers pass (securityheaders.com)
- ✅ Rate limiting works
- ✅ HTTPS enforced
- ✅ Domain accessible and fast

---

## 📞 Support Resources

- **Documentation**: 
  - [DEPLOYMENT.md](./DEPLOYMENT.md) - Full deployment guide
  - [SECURITY.md](./SECURITY.md) - Security best practices
  - [README.md](./README.md) - Project overview

- **External Resources**:
  - [Vercel Documentation](https://vercel.com/docs)
  - [Next.js 16 Documentation](https://nextjs.org/docs)
  - [Prisma Documentation](https://www.prisma.io/docs)
  - [Supabase Documentation](https://supabase.com/docs)

- **Issues**:
  - GitHub Issues: [Report a bug](https://github.com/yourusername/finance-flow/issues)
  - GitHub Discussions: [Ask a question](https://github.com/yourusername/finance-flow/discussions)

---

## ✨ Post-Launch Checklist

After successful deployment:

- [ ] Update README.md with live demo URL
- [ ] Add custom domain (optional)
- [ ] Configure SSL certificate (automatic on Vercel)
- [ ] Set up monitoring and alerts
- [ ] Create backup schedule for database
- [ ] Document deployment in team wiki
- [ ] Test disaster recovery process
- [ ] Schedule security audit
- [ ] Plan feature roadmap
- [ ] Celebrate! 🎉

---

**Last Updated:** November 19, 2025
**Build Status:** ✅ SUCCESS
**Deployment Ready:** ✅ YES
