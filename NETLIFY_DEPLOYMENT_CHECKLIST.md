# 🚀 Netlify Deployment Checklist for FinanceFlow

This comprehensive checklist will guide you through deploying the FinanceFlow application to Netlify.

---

## 📋 Prerequisites

- [ ] **Netlify Account**: Create a free account at [netlify.com](https://www.netlify.com/)
- [ ] **GitHub Repository**: Ensure your code is pushed to GitHub
- [ ] **PostgreSQL Database**: Set up a PostgreSQL database (recommended: Supabase, Railway, Neon, or ElephantSQL)
- [ ] **Node.js 18+**: Verify your local environment (for testing)
- [ ] **Google OAuth Credentials** (optional): If using Google login, obtain credentials from [Google Cloud Console](https://console.cloud.google.com/)

---

## 🔧 Phase 1: Pre-Deployment Preparation

### 1.1 Environment Variables Setup

- [ ] Create a list of all required environment variables:
  ```
  DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]
  NEXTAUTH_URL=https://your-app-name.netlify.app
  NEXTAUTH_SECRET=[generate-with-openssl-rand-base64-32]
  GOOGLE_CLIENT_ID=[your-google-client-id]
  GOOGLE_CLIENT_SECRET=[your-google-client-secret]
  ```

- [ ] **Generate NEXTAUTH_SECRET** (if not already done):
  ```bash
  openssl rand -base64 32
  ```

- [ ] **Database URL**: Obtain PostgreSQL connection string from your database provider
  - Supabase: Project Settings → Database → Connection String (URI)
  - Railway: Database → Connect → Connection URL
  - Neon: Connection Details → Connection String

### 1.2 Database Setup

- [ ] **Create PostgreSQL Database Instance**
  - Choose a provider (Supabase recommended for free tier)
  - Note down connection details
  - Ensure database accepts external connections

- [ ] **Test Database Connection Locally**:
  ```bash
  # Add DATABASE_URL to .env.local
  npx prisma db push
  ```

- [ ] **Verify Prisma Schema**:
  - Ensure `prisma/schema.prisma` is configured for PostgreSQL
  - Check that all models are defined correctly

### 1.3 Code Preparation

- [ ] **Update Next.js Configuration** for Netlify:
  - Create or update `next.config.ts` to include proper output configuration
  - Ensure `output: 'standalone'` is NOT set (Netlify handles this differently)

- [ ] **Review Middleware Configuration**:
  - Verify `middleware.ts` works with Netlify Edge Functions
  - Ensure protected routes are correctly defined

- [ ] **Add Netlify Configuration File**:
  - [ ] Create `netlify.toml` in the root directory (see Phase 2)

### 1.4 Build Testing

- [ ] **Test Local Build**:
  ```bash
  npm install
  npm run build
  npm run start
  ```

- [ ] **Verify All Routes Work**:
  - Test authentication flows
  - Test protected routes
  - Test API endpoints

- [ ] **Check Build Output**:
  - Ensure no critical errors in build
  - Verify bundle size is reasonable
  - Check for any missing dependencies

---

## 🏗️ Phase 2: Netlify Configuration

### 2.1 Create Netlify Configuration File

- [ ] Create `netlify.toml` in your project root:
  ```toml
  [build]
    command = "npm run build"
    publish = ".next"

  [[plugins]]
    package = "@netlify/plugin-nextjs"

  [build.environment]
    NODE_VERSION = "20"

  [[redirects]]
    from = "/*"
    to = "/index.html"
    status = 200
  ```

- [ ] **Commit the configuration**:
  ```bash
  git add netlify.toml
  git commit -m "Add Netlify configuration"
  git push
  ```

### 2.2 Google OAuth Configuration (if applicable)

- [ ] **Update Google Cloud Console**:
  - Go to [Google Cloud Console](https://console.cloud.google.com/)
  - Navigate to APIs & Services → Credentials
  - Edit your OAuth 2.0 Client ID
  - Add authorized redirect URIs:
    - `https://your-app-name.netlify.app/api/auth/callback/google`
    - `https://your-app-name.netlify.app/api/auth/signin/google`
  - Save changes

### 2.3 Database Migration Preparation

- [ ] **Prepare Migration Strategy**:
  - Option A: Run migrations manually before first deployment
  - Option B: Add migration to build command (see below)

- [ ] **If adding migration to build** (recommended):
  - Update `netlify.toml`:
    ```toml
    [build]
      command = "npx prisma generate && npx prisma migrate deploy && npm run build"
      publish = ".next"
    ```

---

## 🌐 Phase 3: Netlify Deployment

### 3.1 Connect Repository to Netlify

- [ ] Log in to [Netlify Dashboard](https://app.netlify.com/)
- [ ] Click **"Add new site"** → **"Import an existing project"**
- [ ] Choose **GitHub** as the Git provider
- [ ] Authorize Netlify to access your GitHub account
- [ ] Select the `finance-flow-project` repository
- [ ] Choose the branch to deploy (usually `main` or `master`)

### 3.2 Configure Build Settings

- [ ] **Build command**: `npm run build` (or see migration option in 2.3)
- [ ] **Publish directory**: `.next`
- [ ] **Base directory**: (leave empty)
- [ ] Click **"Show advanced"** and verify:
  - [ ] Node version is set to 20 or higher
  - [ ] Build environment variables are NOT set yet (next step)

### 3.3 Configure Environment Variables

- [ ] In Netlify site settings, go to **Site settings** → **Environment variables**
- [ ] Click **"Add a variable"** and add each variable:

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `DATABASE_URL` | `postgresql://...` | Your PostgreSQL connection string |
| `NEXTAUTH_URL` | `https://your-app.netlify.app` | Your Netlify site URL |
| `NEXTAUTH_SECRET` | `[your-secret]` | Generated secret from step 1.1 |
| `GOOGLE_CLIENT_ID` | `[your-client-id]` | From Google Cloud Console (optional) |
| `GOOGLE_CLIENT_SECRET` | `[your-secret]` | From Google Cloud Console (optional) |

- [ ] **Important**: Mark sensitive variables as "Sensitive" to hide values
- [ ] Click **"Save"** for each variable

### 3.4 Install Netlify Next.js Plugin

- [ ] In Netlify Dashboard, go to **Plugins** tab
- [ ] Search for **"Next.js Runtime"** or **"@netlify/plugin-nextjs"**
- [ ] Click **"Install"**
- [ ] Alternatively, it should be auto-detected from `netlify.toml`

### 3.5 Deploy Site

- [ ] Click **"Deploy site"** or **"Trigger deploy"**
- [ ] Monitor the deployment logs in real-time
- [ ] Wait for deployment to complete (usually 2-5 minutes)

---

## ✅ Phase 4: Post-Deployment Verification

### 4.1 Database Verification

- [ ] Check that database migrations ran successfully:
  - Review build logs for Prisma migration output
  - Verify all tables are created in your PostgreSQL database
  - Use database GUI (like pgAdmin or Supabase Studio) to confirm schema

### 4.2 Application Testing

- [ ] **Visit your deployed site**: `https://your-app-name.netlify.app`
- [ ] **Test landing page loads correctly**
- [ ] **Test user authentication**:
  - [ ] Sign up with email/password
  - [ ] Sign in with email/password
  - [ ] Sign out
  - [ ] Sign in with Google OAuth (if configured)
- [ ] **Test protected routes**:
  - [ ] Access `/dashboard`
  - [ ] Access `/transactions`
  - [ ] Access `/budgets`
  - [ ] Access `/settings`
- [ ] **Test CRUD operations**:
  - [ ] Create a transaction
  - [ ] Edit a transaction
  - [ ] Delete a transaction
  - [ ] Create a budget
  - [ ] Edit a budget
- [ ] **Test data visualization**:
  - [ ] Dashboard charts load correctly
  - [ ] Data updates in real-time
- [ ] **Test dark/light mode toggle**
- [ ] **Test responsive design** (mobile, tablet, desktop)

### 4.3 Performance Check

- [ ] Run **Lighthouse** audit:
  - Open Chrome DevTools
  - Go to Lighthouse tab
  - Run audit for Performance, Accessibility, Best Practices, SEO
  - Aim for scores above 90

- [ ] Test page load times:
  - [ ] Landing page < 2 seconds
  - [ ] Dashboard < 3 seconds
  - [ ] Authenticated pages < 3 seconds

### 4.4 Error Monitoring

- [ ] Check Netlify **Function logs** for any errors
- [ ] Check Netlify **Deploy logs** for warnings
- [ ] Set up error monitoring (optional):
  - Consider integrating Sentry or LogRocket
  - Netlify Analytics (paid feature)

---

## 🔒 Phase 5: Security & Best Practices

### 5.1 Environment Variables Security

- [ ] **Verify environment variables are secure**:
  - [ ] No sensitive data in client-side code
  - [ ] All secrets are in Netlify environment variables, not in code
  - [ ] `.env.local` is in `.gitignore`

### 5.2 HTTPS & Domain

- [ ] **Verify HTTPS is enabled** (default on Netlify)
- [ ] **Custom domain setup** (optional):
  - [ ] Add custom domain in Netlify settings
  - [ ] Update DNS records as instructed by Netlify
  - [ ] Wait for DNS propagation (can take up to 48 hours)
  - [ ] Update `NEXTAUTH_URL` to your custom domain
  - [ ] Update Google OAuth redirect URIs to your custom domain

### 5.3 Security Headers

- [ ] Add security headers to `netlify.toml`:
  ```toml
  [[headers]]
    for = "/*"
    [headers.values]
      X-Frame-Options = "DENY"
      X-Content-Type-Options = "nosniff"
      Referrer-Policy = "strict-origin-when-cross-origin"
      Permissions-Policy = "camera=(), microphone=(), geolocation=()"
  ```

### 5.4 Rate Limiting

- [ ] Consider implementing rate limiting for API routes
- [ ] Use Netlify Edge Functions for advanced rate limiting (optional)

---

## 🔄 Phase 6: Continuous Deployment

### 6.1 Auto-Deploy Configuration

- [ ] **Verify auto-deploy is enabled**:
  - Go to Site settings → Build & deploy → Continuous deployment
  - Ensure "Auto publishing" is enabled for your branch

- [ ] **Configure deploy contexts**:
  - [ ] Production branch (e.g., `main`)
  - [ ] Deploy previews for pull requests (optional)
  - [ ] Branch deploys for staging (optional)

### 6.2 Deploy Previews

- [ ] **Enable deploy previews** for pull requests:
  - Site settings → Build & deploy → Deploy previews
  - Enable "Any pull request against your production branch"

### 6.3 Build Notifications

- [ ] Set up build notifications:
  - [ ] Email notifications for failed builds
  - [ ] Slack integration (optional)
  - [ ] GitHub commit status checks

---

## 📊 Phase 7: Monitoring & Optimization

### 7.1 Analytics Setup

- [ ] **Netlify Analytics** (paid):
  - Enable in Site settings → Analytics
- [ ] **Google Analytics** (free):
  - Add Google Analytics tracking code to your app
  - Use Next.js built-in Google Analytics support

### 7.2 Performance Optimization

- [ ] Enable **Asset Optimization** in Netlify:
  - Site settings → Build & deploy → Asset optimization
  - Enable CSS minification
  - Enable JS bundling
  - Enable image optimization

- [ ] Review and optimize:
  - [ ] Image sizes and formats
  - [ ] Bundle size
  - [ ] API response times
  - [ ] Database query performance

### 7.3 Caching Strategy

- [ ] Configure caching headers in `netlify.toml`:
  ```toml
  [[headers]]
    for = "/_next/static/*"
    [headers.values]
      Cache-Control = "public, max-age=31536000, immutable"

  [[headers]]
    for = "/images/*"
    [headers.values]
      Cache-Control = "public, max-age=31536000"
  ```

---

## 🐛 Phase 8: Troubleshooting

### Common Issues & Solutions

- [ ] **Build fails**:
  - Check Node version matches package.json requirements
  - Verify all dependencies are in package.json (not just devDependencies)
  - Check build logs for specific errors
  - Try clearing cache and redeploying

- [ ] **Database connection fails**:
  - Verify DATABASE_URL is correct
  - Check if database accepts connections from Netlify IPs
  - Ensure SSL is properly configured for PostgreSQL

- [ ] **Authentication not working**:
  - Verify NEXTAUTH_URL matches your deployed URL
  - Check NEXTAUTH_SECRET is set
  - Verify Google OAuth redirect URIs are correct

- [ ] **API routes return 404**:
  - Ensure Next.js API routes are in `app/api/` directory
  - Check Netlify plugin is installed
  - Verify routing configuration

- [ ] **Environment variables not working**:
  - Check variable names are exact matches (case-sensitive)
  - Redeploy after adding new variables
  - Ensure variables are set for the correct deploy context

---

## 📝 Phase 9: Documentation Updates

- [ ] **Update README.md**:
  - Add Netlify deployment instructions
  - Update live demo link to Netlify URL
  - Add Netlify badge: `[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR_SITE_ID/deploy-status)](https://app.netlify.com/sites/YOUR_SITE_NAME/deploys)`

- [ ] **Update package.json scripts** (optional):
  ```json
  "scripts": {
    "netlify:build": "npx prisma generate && npx prisma migrate deploy && next build",
    "netlify:dev": "netlify dev"
  }
  ```

- [ ] **Create DEPLOYMENT.md** with Netlify-specific notes

- [ ] **Document environment variables**:
  - Create `.env.example` with all required variables (without values)

---

## 🎉 Phase 10: Go Live Checklist

- [ ] **Final pre-launch checks**:
  - [ ] All features working as expected
  - [ ] Database is properly backed up
  - [ ] Error monitoring is set up
  - [ ] Performance is acceptable
  - [ ] Security headers are configured
  - [ ] HTTPS is enabled
  - [ ] Custom domain is configured (if applicable)

- [ ] **Launch announcement**:
  - [ ] Update social media
  - [ ] Update portfolio website
  - [ ] Update resume/CV with live link
  - [ ] Share on LinkedIn

- [ ] **Post-launch monitoring**:
  - [ ] Monitor error logs daily for the first week
  - [ ] Check analytics for unusual traffic patterns
  - [ ] Monitor database performance
  - [ ] Gather user feedback

---

## 🔗 Useful Resources

- [Netlify Next.js Documentation](https://docs.netlify.com/integrations/frameworks/next-js/)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [NextAuth.js Deployment](https://next-auth.js.org/deployment)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Supabase Database Setup](https://supabase.com/docs/guides/database)
- [Railway Database Setup](https://docs.railway.app/databases/postgresql)
- [Neon Database Setup](https://neon.tech/docs/introduction)

---

## 📞 Support

If you encounter issues:

1. **Check Netlify Support Forums**: [community.netlify.com](https://community.netlify.com/)
2. **Netlify Support Docs**: [docs.netlify.com](https://docs.netlify.com/)
3. **Next.js Discord**: [nextjs.org/discord](https://nextjs.org/discord)
4. **GitHub Issues**: Open an issue in the repository

---

**Last Updated**: November 2025  
**Maintained by**: Stephanus Sujatmoko

---

> 💡 **Pro Tip**: Always test your deployment in a staging environment first. Netlify allows you to create multiple sites from the same repository with different environment variables.
