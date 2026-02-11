/**
 * Production Deployment Checklist
 */

## Pre-Deployment ✅

### Environment Setup
- [ ] All environment variables configured in production
- [ ] `DATABASE_URL` points to production database
- [ ] `JWT_SECRET` is strong (32+ characters, random)
- [ ] `GEMINI_API_KEY` configured
- [ ] `REDIS_HOST` and `REDIS_PORT` configured
- [ ] Frontend `NEXT_PUBLIC_API_URL` points to production backend

### Database
- [ ] Database migrations applied (`npx prisma migrate deploy`)
- [ ] Database backups configured (automated daily)
- [ ] Connection pooling configured for production load
- [ ] Demo data seeded (if desired for initial users)

### Security
- [ ] HTTPS enabled (Cloud Run does this automatically)
- [ ] CORS configured for production domain only
- [ ] Rate limiting enabled on API endpoints
- [ ] Input validation with Zod on all endpoints
- [ ] Secrets stored in Secret Manager (not in code)
- [ ] `.env` files in `.gitignore`

### Services
- [ ] Redis instance running and accessible
- [ ] BullMQ queues configured
- [ ] AI categorization tested end-to-end
- [ ] Email service (Resend) tested (if configured)
- [ ] Stripe webhooks configured (if using payments)

### Performance
- [ ] Production build tested locally
- [ ] Bundle size optimized (<1MB initial load)
- [ ] Images optimized and using next/image
- [ ] Database indexes created for frequently queried fields
- [ ] Redis caching implemented for expensive queries

## Deployment Steps 🚀

### Backend Deployment
1. Build Docker image: `docker build -t financeflow-backend ./backend`
2. Test image locally: `docker run -p 4000:4000 financeflow-backend`
3. Push to GCP: Follow `docs/deployment/GCP_DEPLOYMENT.md`
4. Run migrations on production DB
5. Verify health endpoint: `/api/system/health`

### Frontend Deployment
1. Set production env vars in build
2. Build Docker image: `docker build -t financeflow-frontend .`
3. Test image locally: `docker run -p 3000:3000 financeflow-frontend`
4. Push to GCP: Follow deployment guide
5. Verify homepage loads correctly

### Post-Deployment Testing
- [ ] User can sign up
- [ ] User can log in
- [ ] User can create transaction
- [ ] AI categorization works
- [ ] Dashboard displays correctly
- [ ] All API endpoints respond correctly
- [ ] Mobile responsive design works
- [ ] Accessibility (keyboard navigation, screen readers)

## Monitoring & Alerts 📊

### Set Up Monitoring
- [ ] Cloud Monitoring configured
- [ ] Log aggregation working (Cloud Logging)
- [ ] Error tracking (Cloud Error Reporting)
- [ ] Uptime checks configured
- [ ] Performance metrics tracked

### Alerts to Configure
- [ ] High error rate (>5%)
- [ ] Slow response times (>2s avg)
- [ ] High memory usage (>80%)
- [ ] Database connection failures
- [ ] Queue processing delays

## Maintenance 🔧

### Regular Tasks
- Weekly:
  - [ ] Review error logs
  - [ ] Check performance metrics
  - [ ] Verify backups are running

- Monthly:
  - [ ] Review and optimize database queries
  - [ ] Update dependencies (`npm update`)
  - [ ] Security audit (`npm audit`)
  - [ ] Cost review and optimization

### Backup & Recovery
- [ ] Automated daily database backups
- [ ] Backup retention policy (30 days)
- [ ] Disaster recovery plan documented
- [ ] Recovery procedure tested

## Scaling Considerations ⚡

### When to Scale
Monitor these metrics to decide when to scale:
- Response time >500ms avg
- CPU usage >70%
- Memory usage >80%
- Database connections near limit
- Queue processing backlog

### Scaling Strategy
1. **Horizontal**: Increase Cloud Run instances (auto-scaling)
2. **Vertical**: Upgrade instance tiers (more CPU/memory)
3. **Database**: Upgrade Cloud SQL tier, add read replicas
4. **Redis**: Upgrade to Standard tier for high availability
5. **CDN**: Enable Cloud CDN for static assets

## Rollback Plan 🔄

In case of issues:
1. Identify the problem (check logs, metrics)
2. Revert to previous Cloud Run revision:
   ```bash
   gcloud run services update-traffic financeflow-frontend \
     --to-revisions=REVISION_NAME=100
   ```
3. Fix issue in development
4. Re-deploy after testing

## Post-Launch 🎉

- [ ] Monitor first 24 hours closely
- [ ] Respond to user feedback quickly
- [ ] Document any issues encountered
- [ ] Update deployment guide with lessons learned
- [ ] Celebrate! 🎊

---

**Ready for Production**: Once all checkboxes are complete! 🚀
