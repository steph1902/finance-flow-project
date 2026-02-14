# Finance Flow - NestJS Backend Architecture

## 🏗️ Architecture Overview

This is a production-grade, enterprise-level NestJS backend for the Finance Flow SaaS platform. Built with scalability, maintainability, and financial accuracy as top priorities.

### Tech Stack

- **Framework**: NestJS 10+ with Fastify
- **Database**: PostgreSQL with Prisma ORM
- **Cache & Queues**: Redis + BullMQ
- **Authentication**: JWT with refresh tokens
- **API Documentation**: Swagger/OpenAPI
- **Background Jobs**: BullMQ + Cron
- **Testing**: Jest (unit & integration tests)

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── main.ts                 # Application entry point (Fastify)
│   ├── app.module.ts           # Root module
│   │
│   ├── config/                 # Configuration management
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── redis.config.ts
│   │
│   ├── database/               # Database layer
│   │   ├── database.module.ts
│   │   ├── prisma.service.ts  # Prisma client with lifecycle hooks
│   │   └── migrations/
│   │
│   ├── common/                 # Shared utilities
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   ├── public.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── interceptors/
│   │   │   ├── logging.interceptor.ts
│   │   │   ├── timeout.interceptor.ts
│   │   │   └── transform.interceptor.ts
│   │   ├── pipes/
│   │   │   └── validation.pipe.ts
│   │   ├── interfaces/
│   │   │   └── common.interface.ts
│   │   └── common.module.ts
│   │
│   ├── modules/                # Feature modules
│   │   │
│   │   ├── auth/              # Authentication & Authorization
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   └── local.strategy.ts
│   │   │   ├── dto/
│   │   │   │   ├── auth.dto.ts
│   │   │   │   └── auth-response.dto.ts
│   │   │   └── interfaces/
│   │   │       └── jwt-payload.interface.ts
│   │   │
│   │   ├── users/             # User Management
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── dto/
│   │   │       └── update-user.dto.ts
│   │   │
│   │   ├── transactions/      # Transaction Engine
│   │   │   ├── transactions.module.ts
│   │   │   ├── transactions.controller.ts
│   │   │   ├── transactions.service.ts
│   │   │   ├── transactions.repository.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-transaction.dto.ts
│   │   │   │   ├── update-transaction.dto.ts
│   │   │   │   └── query-transaction.dto.ts
│   │   │   └── interfaces/
│   │   │       └── transaction.interface.ts
│   │   │
│   │   ├── budgets/           # Budget Management
│   │   │   ├── budgets.module.ts
│   │   │   ├── budgets.controller.ts
│   │   │   ├── budgets.service.ts
│   │   │   ├── shared-budgets/
│   │   │   │   ├── shared-budgets.controller.ts
│   │   │   │   └── shared-budgets.service.ts
│   │   │   └── dto/
│   │   │       ├── create-budget.dto.ts
│   │   │       └── budget-alert.dto.ts
│   │   │
│   │   ├── recurring/         # Recurring Transactions
│   │   │   ├── recurring.module.ts
│   │   │   ├── recurring.controller.ts
│   │   │   ├── recurring.service.ts
│   │   │   ├── recurring.processor.ts  # Queue processor
│   │   │   └── dto/
│   │   │       └── create-recurring.dto.ts
│   │   │
│   │   ├── goals/             # Financial Goals
│   │   │   ├── goals.module.ts
│   │   │   ├── goals.controller.ts
│   │   │   ├── goals.service.ts
│   │   │   └── dto/
│   │   │       ├── create-goal.dto.ts
│   │   │       └── goal-contribution.dto.ts
│   │   │
│   │   ├── investments/       # Investment Tracking
│   │   │   ├── investments.module.ts
│   │   │   ├── investments.controller.ts
│   │   │   ├── investments.service.ts
│   │   │   └── dto/
│   │   │       ├── create-investment.dto.ts
│   │   │       └── investment-transaction.dto.ts
│   │   │
│   │   ├── analytics/         # Dashboard & Analytics
│   │   │   ├── analytics.module.ts
│   │   │   ├── analytics.controller.ts
│   │   │   ├── analytics.service.ts
│   │   │   └── dto/
│   │   │       └── analytics-query.dto.ts
│   │   │
│   │   ├── reports/           # Report Generation
│   │   │   ├── reports.module.ts
│   │   │   ├── reports.controller.ts
│   │   │   ├── reports.service.ts
│   │   │   ├── generators/
│   │   │   │   ├── pdf.generator.ts
│   │   │   │   ├── csv.generator.ts
│   │   │   │   └── excel.generator.ts
│   │   │   └── dto/
│   │   │       └── generate-report.dto.ts
│   │   │
│   │   ├── notifications/     # Notification System
│   │   │   ├── notifications.module.ts
│   │   │   ├── notifications.controller.ts
│   │   │   ├── notifications.service.ts
│   │   │   ├── notifications.processor.ts  # Queue processor
│   │   │   └── dto/
│   │   │       └── create-notification.dto.ts
│   │   │
│   │   ├── ai/                # AI Features
│   │   │   ├── ai.module.ts
│   │   │   ├── ai.controller.ts
│   │   │   ├── ai.service.ts
│   │   │   ├── services/
│   │   │   │   ├── categorization.service.ts
│   │   │   │   ├── insights.service.ts
│   │   │   │   ├── budget-optimizer.service.ts
│   │   │   │   ├── forecast.service.ts
│   │   │   │   └── chat-assistant.service.ts
│   │   │   └── dto/
│   │   │       ├── categorize.dto.ts
│   │   │       └── chat.dto.ts
│   │   │
│   │   ├── currency/          # Multi-Currency
│   │   │   ├── currency.module.ts
│   │   │   ├── currency.controller.ts
│   │   │   ├── currency.service.ts
│   │   │   ├── currency.cache.service.ts
│   │   │   └── dto/
│   │   │       └── convert-currency.dto.ts
│   │   │
│   │   ├── integrations/      # External Integrations
│   │   │   ├── integrations.module.ts
│   │   │   ├── plaid/
│   │   │   │   ├── plaid.controller.ts
│   │   │   │   ├── plaid.service.ts
│   │   │   │   └── plaid.webhooks.controller.ts
│   │   │   ├── stripe/
│   │   │   │   ├── stripe.controller.ts
│   │   │   │   ├── stripe.service.ts
│   │   │   │   └── stripe.webhooks.controller.ts
│   │   │   └── email/
│   │   │       └── email.service.ts
│   │   │
│   │   └── jobs/              # Background Jobs & Cron
│   │       ├── jobs.module.ts
│   │       ├── cron/
│   │       │   ├── daily-checks.cron.ts
│   │       │   ├── weekly-summary.cron.ts
│   │       │   ├── currency-rates.cron.ts
│   │       │   └── recurring-transactions.cron.ts
│   │       └── processors/
│   │           ├── email.processor.ts
│   │           └── notification.processor.ts
│   │
│   └── utils/                 # Utility functions
│       ├── date.utils.ts
│       ├── currency.utils.ts
│       └── validation.utils.ts
│
├── test/                      # E2E tests
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
│
├── .env.example
├── .gitignore
├── nest-cli.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔐 Security Features

1. **JWT Authentication**
   - Access tokens (1h expiry)
   - Refresh tokens (7d expiry)
   - Secure password hashing (bcrypt, 12 rounds)

2. **Rate Limiting**
   - Global: 100 req/min
   - Auth endpoints: 5-10 req/min
   - AI endpoints: Custom limits

3. **Input Validation**
   - Class-validator for all DTOs
   - Strict type checking
   - SQL injection prevention (Prisma)

4. **Security Headers**
   - Helmet middleware
   - CORS configuration
   - XSS protection

---

## 📊 Data Flow

### Transaction Creation Flow

```
1. Client → POST /api/v1/transactions
2. ValidationPipe validates DTO
3. JwtAuthGuard validates token
4. TransactionsController.create()
5. TransactionsService.create()
6. Prisma creates transaction (atomic)
7. AI categorization (async queue)
8. Budget alerts check (async)
9. Response with transaction data
```

### Budget Alert Flow

```
1. Cron job (daily at 9 AM UTC)
2. Fetch all budgets for current month
3. Calculate spending vs budget
4. If threshold exceeded (90%, 100%)
5. Create notification
6. Queue email notification
7. EmailProcessor sends email
```

---

## 🎯 API Endpoints

### Authentication

- `POST /auth/signup` - Register new user
- `POST /auth/signin` - Login
- `POST /auth/refresh` - Refresh token
- `GET /auth/profile` - Get profile
- `POST /auth/logout` - Logout

### Transactions

- `GET /transactions` - List transactions (paginated, filtered)
- `POST /transactions` - Create transaction
- `GET /transactions/:id` - Get transaction
- `PATCH /transactions/:id` - Update transaction
- `DELETE /transactions/:id` - Soft delete

### Budgets

- `GET /budgets` - List budgets
- `POST /budgets` - Create budget
- `PATCH /budgets/:id` - Update budget
- `DELETE /budgets/:id` - Delete budget
- `GET /budgets/shared` - List shared budgets
- `POST /budgets/shared` - Create shared budget

### Recurring Transactions

- `GET /recurring` - List recurring transactions
- `POST /recurring` - Create recurring
- `PATCH /recurring/:id` - Update recurring
- `DELETE /recurring/:id` - Delete recurring

### Goals

- `GET /goals` - List goals
- `POST /goals` - Create goal
- `POST /goals/:id/contribute` - Add contribution
- `PATCH /goals/:id` - Update goal
- `DELETE /goals/:id` - Delete goal

### Investments

- `GET /investments` - List investments
- `POST /investments` - Create investment
- `GET /investments/portfolio` - Portfolio summary
- `POST /investments/:id/transaction` - Record transaction

### Analytics

- `GET /analytics/dashboard` - Dashboard stats
- `GET /analytics/trends` - Spending trends
- `GET /analytics/categories` - Category breakdown

### Reports

- `GET /reports` - List reports
- `POST /reports/generate` - Generate report (PDF/CSV/Excel)
- `GET /reports/:id` - Get report
- `GET /reports/:id/download` - Download report

### AI Features

- `POST /ai/categorize` - Categorize transaction
- `POST /ai/chat` - AI assistant chat
- `GET /ai/insights` - Get insights
- `GET /ai/forecast` - Financial forecast
- `GET /ai/optimize-budgets` - Budget optimization

### Currency

- `GET /currency/rates` - Get exchange rates
- `POST /currency/convert` - Convert amount

### Integrations

- `POST /integrations/plaid/link-token` - Create Plaid link token
- `POST /integrations/plaid/exchange` - Exchange public token
- `POST /integrations/plaid/sync` - Sync transactions
- `POST /integrations/stripe/create-subscription` - Create subscription
- `POST /webhooks/stripe` - Stripe webhook handler
- `POST /webhooks/plaid` - Plaid webhook handler

---

## 🔄 Background Jobs

### Cron Jobs

1. **Daily Checks** (9 AM UTC)
   - Budget alerts (90%, 100% thresholds)
   - Bill reminders (3 days before)
2. **Weekly Summary** (Sunday 8 AM UTC)
   - Weekly financial summary
   - Email to all users

3. **Currency Rates** (Every hour)
   - Fetch latest exchange rates
   - Update cache

4. **Recurring Transactions** (Midnight UTC)
   - Generate due recurring transactions
   - Create transactions automatically

### Queue Processors

1. **Email Queue**
   - Welcome emails
   - Budget alerts
   - Weekly summaries

2. **Notification Queue**
   - In-app notifications
   - Push notifications (future)

3. **AI Queue**
   - Transaction categorization
   - Batch insights generation

---

## 🧪 Testing

### Unit Tests

```bash
npm run test
npm run test:watch
npm run test:cov
```

### Integration Tests

```bash
npm run test:e2e
```

### Test Structure

- Each service has corresponding `.spec.ts`
- Mock Prisma for database operations
- Mock external APIs (Stripe, Plaid, AI)
- Test coverage target: >80%

---

## 🚀 Deployment

### Environment Variables

See `.env.example` for all required variables.

### Database Migrations

```bash
npx prisma migrate deploy
```

### Build & Run

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

### Docker (Optional)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "run", "start:prod"]
```

---

## 📝 Code Standards

1. **Naming Conventions**
   - Controllers: `*.controller.ts`
   - Services: `*.service.ts`
   - DTOs: `*.dto.ts`
   - Interfaces: `*.interface.ts`

2. **DTOs**
   - Use class-validator decorators
   - Swagger decorators for docs
   - Separate create/update DTOs

3. **Services**
   - Single Responsibility Principle
   - Dependency Injection
   - Async/await (no promise chaining)

4. **Error Handling**
   - Use NestJS exceptions
   - Custom error messages
   - Proper HTTP status codes

---

## 📚 Additional Documentation

- [Prisma Schema](../prisma/schema.prisma)
- [API Documentation](http://localhost:3001/api/docs)
- [Architecture Decisions](./docs/ADR.md)

---

## 👨‍💻 Development Workflow

1. Create feature branch
2. Implement module with tests
3. Run tests + linting
4. Create PR with description
5. Code review
6. Merge to main
7. Deploy to staging → production

---

## 🔮 Future Enhancements

- [ ] GraphQL API (alongside REST)
- [ ] WebSocket for real-time updates
- [ ] Mobile app support (OAuth2)
- [ ] Advanced ML-based forecasting
- [ ] Audit logs for compliance
- [ ] Multi-tenancy support

---

## 📄 License

MIT License - see LICENSE file for details.
