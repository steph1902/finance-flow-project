# FinanceFlow

Personal finance automation platform with AI-powered transaction categorization, receipt scanning, and budget optimization. Targets users who need expense tracking without manual data entry. Built as a hybrid full-stack application with web, mobile, and background processing components.

## Key Capabilities

- Categorize transactions automatically using Gemini 1.5 Flash with confidence scoring
- Extract receipt data via Google Cloud Vision and normalize merchant names
- Track budgets per category with rollover support and threshold alerts
- Sync bank accounts through Plaid for automatic transaction imports
- Process recurring transactions (subscriptions, bills) on configurable schedules
- Generate financial reports in PDF, CSV, and JSON formats
- Run on web (Next.js), mobile (React Native), and API (NestJS) simultaneously

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js 16    │     │    NestJS 10    │     │  React Native   │
│   (Frontend)    │────▶│    (Backend)    │◀────│    (Mobile)     │
│   Port 3000     │     │   Port 3001     │     │   Expo SDK 54   │
└────────┬────────┘     └────────┬────────┘     └─────────────────┘
         │                       │
         │    ┌─────────────┐    │
         └───▶│ PostgreSQL  │◀───┘
              │   Prisma    │
              └──────┬──────┘
                     │
              ┌──────▼──────┐
              │    Redis    │
              │  BullMQ     │
              └─────────────┘
```

**Frontend**: Handles authentication (NextAuth.js), routing, server components, and direct database reads for UI rendering.

**Backend**: Processes AI pipelines, queued jobs, receipt scanning, and complex business logic asynchronously.

**Database**: PostgreSQL with Prisma ORM. Schema includes users, transactions, budgets, goals, recurring transactions, notifications, and AI suggestions.

**Queue**: Redis with BullMQ for background job processing.

## Getting Started

Prerequisites: Node.js 20+, PostgreSQL 15+, Redis 7+

```bash
# Clone and install
git clone https://github.com/steph1902/finance-flow-project.git
cd finance-flow-project
npm install
cd backend && npm install && cd ..

# Configure environment
cp .env.example .env
# Edit .env with database URL, Redis URL, API keys

# Initialize database
npx prisma migrate deploy
npx prisma db seed

# Start services
npm run dev          # Frontend on localhost:3000
cd backend && npm run start:dev  # Backend on localhost:3001
```

Docker alternative:

```bash
docker-compose up -d
```

## Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | - | PostgreSQL connection string |
| `REDIS_URL` | Yes | - | Redis connection string |
| `NEXTAUTH_SECRET` | Yes | - | Session encryption key |
| `JWT_SECRET` | Yes | - | API token signing key |
| `GOOGLE_AI_API_KEY` | No | - | Gemini API for categorization |
| `GOOGLE_CLOUD_VISION_KEY` | No | - | Receipt scanning |
| `PLAID_CLIENT_ID` | No | - | Bank sync |
| `PLAID_SECRET` | No | - | Bank sync |

Without AI keys, categorization falls back to rule-based matching. Without Plaid keys, bank sync is disabled.

## Usage

Create a transaction:

```typescript
POST /api/transactions
{
  "amount": 42.50,
  "description": "Coffee meeting",
  "type": "EXPENSE",
  "date": "2025-12-18"
}
// Response includes AI-assigned category
```

Scan a receipt:

```typescript
POST /api/receipts/scan
Content-Type: multipart/form-data
// Upload image file
// Returns extracted merchant, amount, date, line items
```

Check budget status:

```typescript
GET /api/budgets
// Returns category budgets with spent/remaining/alert status
```

## Quality and Safety

**Error Handling**: All API endpoints return structured errors with codes. Failed AI calls fall back to manual categorization. Queue jobs retry 3 times with exponential backoff.

**Rate Limiting**: Auth endpoints limited to 5 requests/minute. General API limited to 100 requests/minute per user.

**Input Validation**: All inputs validated via class-validator. SQL injection prevented by Prisma. XSS prevented by output escaping and input sanitization.

**Known Limitations**:
- Receipt scanning accuracy depends on image quality
- AI categorization requires transaction history for optimal results
- Bank sync refresh frequency determined by Plaid tier

**Non-Goals**:
- This is not an accounting system; no double-entry bookkeeping
- No tax filing or compliance features
- No cryptocurrency wallet integration (tracking only)

## Testing

```bash
# Unit tests
cd backend && npm test

# E2E tests
cd backend && npm run test:e2e

# Coverage report
cd backend && npm run test:cov
```

Test structure:
- `*.spec.ts`: Unit tests per module (controllers, services)
- `test/*.e2e-spec.ts`: Integration tests for API endpoints
- `test/helpers/`: Mocks, factories, utilities

Coverage targets: 80% for services, 70% for controllers. E2E tests cover auth flows, transactions, budgets, goals, analytics, recurring transactions, and notifications.

CI runs tests on every push. Tests use isolated database transactions that rollback after each suite.
