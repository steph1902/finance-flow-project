# Admin Analytics System - Setup Guide

## Overview
The admin analytics system tracks demo account usage for your portfolio project. It provides insights into how visitors interact with the demo account, including:
- Login frequency and session data
- Feature usage statistics
- Geographic distribution (IP-based, no permission required)
- Recent activity feed

## Environment Variables

Add this to your `.env` file:

```bash
# Admin Analytics
ADMIN_PASSWORD=your-secure-password-here

# Already required (should exist)
JWT_SECRET=your-jwt-secret
DATABASE_URL=postgresql://user:password@localhost:5432/financeflow
```

### Security Note:
- The `ADMIN_PASSWORD` is a simple password for accessing the analytics dashboard
- In production, use a strong password and HTTPS
- Never commit the `.env` file to version control

## Accessing the Admin Dashboard

1. **Login:** Navigate to `/admin/login`
2. **Enter password:** Use the password from `ADMIN_PASSWORD` env variable
3. **View analytics:** You'll be redirected to `/admin/analytics`

## Features

### Automatic Tracking (No Code Changes Required)
The system automatically tracks when demo account users:
- Log in
- View pages
- Create/edit transactions
- Optimize budgets
- Use AI features

### Geolocation (Privacy-Friendly)
- Uses IP address to determine city/country
- NO GPS permission required
- NO browser popup
- Uses free `ip-api.com` service (45 requests/min limit)
- Works in production (Vercel provides geo headers)

### What's Tracked

**For Demo Account Only:**
- ✅ Login events with timestamp
- ✅ Page views
- ✅ Feature interactions
- ✅ Geographic location (city, country)
- ✅ Session duration
- ✅ User agent (browser/device info)

**NOT Tracked:**
- ❌ Personal data from real users
- ❌ Exact GPS coordinates
- ❌ Passwords or sensitive info
- ❌ IP addresses are stored but not shown in UI

## Database Schema

The `AnalyticsEvent` model stores all tracking data:

```prisma
model AnalyticsEvent {
  id          String   @id @default(cuid())
  createdAt   DateTime @default(now())
  userId      String?
  sessionId   String
  isDemo      Boolean  @default(false)
  eventType   String   // 'login', 'page_view', 'transaction_create', etc.
  eventName   String
  metadata    Json?
  page        String?
  referrer    String?
  userAgent   String?
  ipAddress   String?
  country     String?
  city        String?
  region      String?
  timezone    String?
}
```

## Analytics Dashboard Features

### Summary Cards
- Total events tracked
- Demo logins count
- Active sessions
- Countries reached

### Feature Usage Chart
- Bar chart showing most-used features
- Percentage distribution
- Action counts

### Geographic Distribution
- Countries with percentage bars
- City-level granularity
- Visual maps (future enhancement)

### Recent Activity Feed
- Latest 15 actions
- Real-time updates
- Event details with location

### Session History
- Login timestamps
- Location per session
- Browser/device info

## API Endpoints

### POST /admin/login
Login to admin dashboard
```json
{
  "password": "your-admin-password"
}
```

### GET /admin/analytics
Get analytics data (requires auth cookie)
Returns:
- Summary statistics
- Events by type
- Events by country
- Recent events
- Session history

### POST /admin/logout
Clear admin session

## How It Works

### 1. Middleware Tracking
`AnalyticsMiddleware` runs on every request:
```typescript
// Checks if user is demo account
if (user?.email === 'demo@financeflow.com') {
  // Gets IP address
  // Fetches geolocation
  // Stores page view event
}
```

### 2. Manual Event Tracking
In your code, track custom events:
```typescript
import { AnalyticsService } from '@/common/analytics/analytics.service';

// Inject in constructor
constructor(private analyticsService: AnalyticsService) {}

// Track event
await this.analyticsService.trackEvent({
  userId: user.id,
  sessionId: sessionId,
  isDemo: true,
  eventType: 'budget_optimize',
  eventName: 'AI Budget Optimization Used',
  metadata: { savings: 150 },
});
```

### 3. Geolocation Service
```typescript
const geo = await analyticsService.getGeolocation(ipAddress);
// Returns: { country: "Japan", city: "Tokyo", timezone: "Asia/Tokyo" }
```

## Privacy & Ethics

### Compliant with:
- ✅ GDPR (legitimate interest for own analytics)
- ✅ No PII collection beyond what's already in logs
- ✅ Demo-account only tracking
- ✅ No user permission required (IP geolocation)

### Best Practices:
- Only tracks demo account, not real users
- IP addresses stored but not displayed
- Geolocation is approximate (city-level)
- Data used solely for portfolio engagement metrics

## Troubleshooting

### Analytics not showing data:
1. Check `ADMIN_PASSWORD` is set in `.env`
2. Verify Prisma migration ran: `npx prisma db push`
3. Login to demo account to generate events
4. Check backend logs for errors

### Geolocation not working:
1. IP-api.com has 45 req/min limit
2. Localhost/private IPs skipped automatically
3. Deploy to production for real IP addresses
4. Vercel provides geo headers directly

### Can't login to admin:
1. Check `ADMIN_PASSWORD` matches
2. Verify JWT_SECRET environment variable set
3. Clear cookies and try again
4. Check backend logs for errors

## Production Deployment

### Vercel (Recommended):
```bash
# Environment variables in Vercel dashboard:
ADMIN_PASSWORD=xxx
JWT_SECRET=xxx
DATABASE_URL=xxx
```

Vercel automatically provides geo headers, improving accuracy!

## Interview Talking Points

When discussing this with recruiters/hiring managers:

1. **Privacy-First Design:** "I implemented IP-based geolocation that requires no user permission, following industry standards like Google Analytics"

2. **Business Value:** "The analytics system helps me understand which features resonate with demo users, informing product decisions"

3. **Technical Implementation:** "Built custom analytics pipeline with Prisma ORM, NestJS services, and real-time dashboard using Next.js"

4. **Security:** "Password-protected admin access with JWT authentication and HTTP-only cookies"

5. **Scalability:**  "5-minute rate limit protection, indexes on key fields, async tracking that doesn't block main requests"

## Next Steps

1. Set `ADMIN_PASSWORD` in `.env`
2. Run `npx prisma db push` to create tables
3. Start backend: `npm run start:dev`
4. Login to demo account to generate data
5. Visit `/admin/login` and explore analytics!

---

**Portfolio Impact:**
This feature demonstrates full-stack development, security awareness, data analytics, and business thinking - all highly valued in consulting roles.
