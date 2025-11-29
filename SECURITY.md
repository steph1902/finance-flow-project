# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report security vulnerabilities by:

### Option 1: GitHub Security Advisories (Preferred)

1. Navigate to the [Security tab](https://github.com/steph1902/finance-flow-project/security)
2. Click "Report a vulnerability"
3. Fill in the vulnerability details

### Option 2: Email (Alternative)

Send an email to: **[Add your security contact email]**

Include the following information:

- **Type of issue** (e.g., SQL injection, XSS, authentication bypass)
- **Full paths** of source file(s) related to the vulnerability
- **Location** of the affected source code (tag/branch/commit or direct URL)
- **Step-by-step instructions** to reproduce the issue
- **Proof-of-concept or exploit code** (if possible)
- **Impact** of the issue (what an attacker could do)
- **Suggested fix** (optional but appreciated)

## Response Timeline

- **Acknowledgment**: We aim to acknowledge your report within **48 hours**
- **Initial Assessment**: We will provide an initial assessment within **5 business days**
- **Status Updates**: We will keep you informed of our progress
- **Fix & Disclosure**: 
  - Critical vulnerabilities will be patched within **7 days**
  - High-severity issues within **14 days**
  - Medium/Low severity within **30 days**

## Disclosure Policy

- Security issues will be disclosed publicly only after a fix is available
- We will credit you in the release notes (unless you prefer to remain anonymous)
- We follow responsible disclosure practices

## Security Best Practices for Users

### Self-Hosting

If you're self-hosting FinanceFlow, please ensure:

1. **Strong Secrets**
   ```bash
   # Generate strong NEXTAUTH_SECRET (32+ characters)
   openssl rand -base64 48
   ```

2. **HTTPS Only**
   - Always use HTTPS in production
   - Set `NEXTAUTH_URL` to `https://` URL

3. **Database Security**
   - Use strong database passwords
   - Enable SSL/TLS for database connections
   - Restrict database access to application IP only

4. **Regular Updates**
   ```bash
   # Check for vulnerabilities
   npm audit
   
   # Update dependencies
   npm update
   ```

5. **Environment Variables**
   - Never commit `.env` files to git
   - Use different secrets for each environment
   - Set restrictive file permissions: `chmod 600 .env.production.local`

6. **Firewall Configuration**
   - Only expose necessary ports (80, 443)
   - Restrict database port (5432) to localhost or VPN only

### Production Deployment

- Use a managed database service with automatic backups
- Enable logging and monitoring
- Set up alerts for suspicious activity
- Regularly review access logs
- Use a WAF (Web Application Firewall) if possible

## Known Security Considerations

### Current Implementation

FinanceFlow implements the following security measures:

- ✅ **Password Hashing**: bcrypt with 10 salt rounds
- ✅ **Session Management**: HTTP-only secure cookies
- ✅ **SQL Injection Protection**: Prisma ORM parameterized queries
- ✅ **XSS Protection**: React auto-escaping
- ✅ **CSRF Protection**: Built-in via NextAuth.js
- ✅ **Input Validation**: Zod schema validation on all API endpoints

### Planned Security Enhancements

- ⏳ **Rate Limiting**: IP-based rate limiting for API endpoints (Phase 5)
- ⏳ **2FA/MFA**: Two-factor authentication (Phase 6)
- ⏳ **Audit Logging**: Comprehensive audit trail (Phase 7)
- ⏳ **Content Security Policy**: Strict CSP headers (Phase 5)

## Security Hall of Fame

We appreciate security researchers who help keep FinanceFlow safe:

<!-- 
When someone reports a valid vulnerability, add them here:

- [Researcher Name](https://github.com/username) - [Vulnerability Type] - [Date]
-->

*No vulnerabilities reported yet.*

---

## Questions?

For non-security-related questions, please:
- [Open a Discussion](https://github.com/steph1902/finance-flow-project/discussions)
- [Open an Issue](https://github.com/steph1902/finance-flow-project/issues)

Thank you for helping keep FinanceFlow and our users safe! 🔒
