# Security Policy

## Overview

FinanceFlow takes security seriously. This document outlines our security practices, known vulnerabilities, and how to report security issues.

---

## Security Features

### Authentication & Authorization

- ✅ **JWT-based sessions** with HttpOnly cookies
- ✅ **Bcrypt password hashing** (cost factor: 10)
- ✅ **Google OAuth 2.0** integration
- ✅ **Middleware-based route protection**
- ✅ **Session expiration** (7 days)
- ✅ **CSRF protection** via SameSite cookies

### Data Protection

- ✅ **Parameterized queries** via Prisma (SQL injection prevention)
- ✅ **Input validation** with Zod schemas
- ✅ **XSS protection** via React automatic escaping
- ✅ **Soft delete** for data recovery
- ✅ **Environment variable validation** at startup
- ✅ **No sensitive data in logs** (production)

### API Security

- ✅ **Rate limiting** (100 requests/min per IP)
- ✅ **CORS configuration** (restricted origins)
- ✅ **Security headers** (CSP, X-Frame-Options, etc.)
- ✅ **Request size limits** (10MB)
- ✅ **Type-safe API contracts** with Zod

### Infrastructure Security

- ✅ **HTTPS enforcement** in production
- ✅ **Database SSL** connections
- ✅ **Environment isolation** (dev/staging/prod)
- ✅ **Secrets management** via environment variables
- ✅ **Dependency scanning** (GitHub Dependabot)
- ✅ **No hardcoded credentials**

---

## Environment Variable Security

### Critical Environment Variables

**NEVER commit these to version control:**

- `DATABASE_URL` - Database connection string
- `NEXTAUTH_SECRET` - JWT signing secret
- `GEMINI_API_KEY` - Google Gemini API key
- `GOOGLE_CLIENT_SECRET` - OAuth client secret
- `GOOGLE_CLOUD_API_KEY` - Cloud Vision API key

### Best Practices

1. **Use strong secrets**
   ```bash
   # Generate NEXTAUTH_SECRET (32+ characters)
   openssl rand -base64 32
   ```

2. **Rotate secrets regularly**
   - NEXTAUTH_SECRET: Every 90 days
   - API keys: When team members leave
   - Database credentials: Annually

3. **Environment-specific secrets**
   - Use different secrets for dev/staging/production
   - Never share production secrets

4. **Secret storage**
   - Local: `.env.local` (gitignored)
   - Production: Vercel Environment Variables
   - Team: Use secret management service (e.g., 1Password, Vault)

---

## Authentication Security

### Password Requirements

- Minimum 8 characters
- Must contain:
  - One uppercase letter
  - One lowercase letter
  - One number
- Maximum 100 characters

### Password Storage

- Bcrypt hashing with cost factor 10
- Salted automatically
- Stored in `users.password` column
- Never logged or exposed in API responses

### Session Management

- JWT tokens with HS256 algorithm
- HttpOnly cookie (not accessible via JavaScript)
- SameSite=Lax (CSRF protection)
- Secure flag in production (HTTPS only)
- 7-day expiration (configurable)

### OAuth Security

- Google OAuth 2.0 with restricted redirect URIs
- State parameter for CSRF protection
- ID token validation
- Secure client secret storage

---

## API Security

### Rate Limiting

Built-in rate limiting via middleware:

```typescript
// Default limits
{
  middleware: 100 requests/min per IP,
  chatEndpoint: 10 requests/min per user,
  aiEndpoints: 20 requests/min per user,
  authEndpoints: 5 requests/min per IP
}
```

### Input Validation

All API endpoints use Zod schemas:

```typescript
// Example: Transaction creation
const transactionSchema = z.object({
  amount: z.number().positive().max(999999.99),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().min(1).max(100),
  description: z.string().max(191).optional(),
  date: z.coerce.date(),
});
```

### Error Handling

- Generic error messages in production (no stack traces)
- Detailed errors in development only
- No sensitive data in error responses
- All errors logged server-side

---

## Database Security

### Connection Security

- SSL/TLS enforced in production
- Connection pooling (max 10 connections)
- Parameterized queries (Prisma)
- No raw SQL except in controlled cases

### Data Access Control

- Row-level security via `userId` filtering
- Soft delete (keeps audit trail)
- Cascade delete for user data
- Indexes on sensitive queries

### Sensitive Data

**Never stored in plain text:**
- Passwords (bcrypt hashed)
- OAuth tokens (encrypted by NextAuth)
- API keys (environment variables only)

**User data retention:**
- Active accounts: Indefinite
- Deleted accounts: 30 days (soft delete)
- Transaction data: User-controlled export

---

## Client-Side Security

### XSS Prevention

- React automatic escaping
- CSP headers configured
- No `dangerouslySetInnerHTML` usage
- Sanitized user input in AI prompts

### CSRF Prevention

- SameSite cookies (Lax mode)
- State parameter in OAuth flow
- Double-submit cookie pattern

### Client-Side Storage

- No sensitive data in localStorage
- Session tokens in HttpOnly cookies only
- User preferences in localStorage (non-sensitive)

---

## AI Service Security

### API Key Protection

- GEMINI_API_KEY stored server-side only
- Never exposed to client
- Rate limiting on AI endpoints
- Fail-fast if key missing

### Prompt Injection Prevention

- Input sanitization before AI requests
- Character limits on user prompts
- Response validation with Zod schemas
- No system prompts exposed to users

### Data Privacy

- User financial data sent to Gemini API (required for features)
- No PII sent beyond what's necessary
- Users can opt out of AI features
- Data retention per Google's AI terms

**Important:** Review Google's Gemini API terms regarding data usage:
https://ai.google.dev/gemini-api/terms

---

## Infrastructure Security

### Deployment Security (Vercel)

- Automatic HTTPS/SSL
- DDoS protection
- Edge network (global CDN)
- Automatic security updates
- Environment variable encryption

### Database Security

Recommended providers with security features:

- **Supabase**: Row-level security, automatic backups, SSL
- **Neon**: Branching, point-in-time recovery, SOC 2 Type II
- **Railway**: Private networking, automated backups, SSL

### Third-Party Services

| Service | Purpose | Data Shared |
|---------|---------|-------------|
| Google Gemini | AI features | Transaction descriptions, amounts, categories |
| Google OAuth | Authentication | Name, email, profile picture |
| Google Cloud Vision | Receipt OCR | Receipt images (optional feature) |

---

## Security Headers

Configured in `next.config.ts`:

```typescript
{
  "X-Frame-Options": "DENY",                 // Clickjacking protection
  "X-Content-Type-Options": "nosniff",       // MIME sniffing protection
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains",
  "Content-Security-Policy": "default-src 'self'; ..." // XSS protection
}
```

---

## Vulnerability Disclosure

### Supported Versions

| Version | Supported |
|---------|-----------|
| Latest (main branch) | ✅ Yes |
| Previous releases | ❌ No |

### Reporting a Vulnerability

**DO NOT open public GitHub issues for security vulnerabilities.**

Instead, email: **security@yourapp.com** (replace with your email)

Include:

1. **Description** of the vulnerability
2. **Steps to reproduce** (detailed)
3. **Potential impact** (severity assessment)
4. **Suggested fix** (if known)
5. **Your contact information** (for follow-up)

### Response Timeline

- **Initial response**: Within 48 hours
- **Status update**: Within 7 days
- **Fix timeline**: Depends on severity
  - Critical: 24-48 hours
  - High: 7 days
  - Medium: 30 days
  - Low: 90 days

### Responsible Disclosure

We follow coordinated vulnerability disclosure:

1. Report received and acknowledged
2. Vulnerability verified and assessed
3. Fix developed and tested
4. Security advisory published (GitHub Security Advisories)
5. Credit given to reporter (if desired)

---

## Known Limitations

### Current Security Gaps

1. **No 2FA/MFA** - Planned for future release
2. **No email verification** - Email addresses not verified
3. **No account recovery** - Password reset via email not implemented
4. **Receipt OCR optional** - GOOGLE_CLOUD_API_KEY not required
5. **Audit logging incomplete** - User actions not fully logged

### Planned Improvements

- [ ] Two-factor authentication (TOTP)
- [ ] Email verification workflow
- [ ] Password reset via email
- [ ] Comprehensive audit logging
- [ ] Anomaly detection (unusual spending)
- [ ] End-to-end encryption for sensitive fields
- [ ] Security event notifications

---

## Compliance

### Data Privacy

- **GDPR**: User data export available, deletion supported
- **CCPA**: Data disclosure available on request
- **SOC 2**: Infrastructure providers (Vercel, Supabase) are SOC 2 compliant

### Data Retention

- **Active users**: Data retained indefinitely
- **Deleted accounts**: 30-day soft delete, then permanent deletion
- **Backup retention**: Follows database provider policy

### User Rights

Users can:
- Export all data (JSON format)
- Delete account (soft delete with 30-day recovery)
- Request data disclosure
- Opt out of AI features (manual categorization fallback)

---

## Security Checklist (Deployment)

Before deploying to production, verify:

- [ ] All environment variables set in Vercel
- [ ] NEXTAUTH_SECRET is strong (32+ chars, randomly generated)
- [ ] DATABASE_URL uses SSL (`?sslmode=require`)
- [ ] NEXTAUTH_URL matches production domain
- [ ] Google OAuth credentials restricted to production domain
- [ ] Rate limiting tested and enabled
- [ ] Security headers configured (verify with securityheaders.com)
- [ ] HTTPS enforced (automatic on Vercel)
- [ ] No `.env` files committed to git
- [ ] Dependencies up to date (no known vulnerabilities)
- [ ] Error boundaries active (no sensitive data in errors)
- [ ] Logging configured (no passwords in logs)

---

## Security Best Practices (Users)

1. **Use strong passwords**
   - Minimum 12 characters
   - Use a password manager
   - Don't reuse passwords

2. **Enable Google OAuth**
   - More secure than password-only
   - Leverages Google's security

3. **Review AI suggestions**
   - AI categorization is not perfect
   - Verify before accepting

4. **Export data regularly**
   - Keep local backups
   - Use encrypted storage

5. **Report suspicious activity**
   - Contact support immediately
   - Change password if compromised

---

## Security Resources

### Tools for Security Testing

- [OWASP ZAP](https://www.zaproxy.org/) - Web app security scanner
- [Snyk](https://snyk.io/) - Dependency vulnerability scanner
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit) - Built-in Node.js scanner
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Security audit

### Security Headers Testing

- [Security Headers](https://securityheaders.com/)
- [Mozilla Observatory](https://observatory.mozilla.org/)

### Additional Reading

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/authentication)
- [Prisma Security](https://www.prisma.io/docs/guides/database/production-checklist)

---

## Incident Response

In case of a security incident:

1. **Assess severity** (critical/high/medium/low)
2. **Contain threat** (disable affected systems)
3. **Investigate root cause**
4. **Deploy fix** (emergency patch)
5. **Notify affected users** (if data breach)
6. **Post-mortem** (prevent recurrence)

---

## Contact

- **Security issues**: security@yourapp.com
- **General support**: support@yourapp.com
- **GitHub**: [Issues](https://github.com/yourusername/finance-flow/issues)

---

**Last Updated**: November 19, 2025
