# FinanceFlow — Technical Selling Points

> A production-grade personal finance platform built with modern architecture and AI-powered intelligence. Every claim below is derived directly from the codebase.

---

## At a Glance

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16 · React 19 · Tailwind CSS v4 · Radix UI |
| **Backend** | NestJS 10 · Fastify · Prisma ORM · PostgreSQL |
| **Mobile** | React Native 0.81 · Expo SDK 54 |
| **AI/ML** | Gemini 1.5 Flash · Google Cloud Vision |
| **Infrastructure** | Redis · BullMQ · Workbox PWA |

---

## 1. Core Technology Stack

### Runtime & Frameworks

| Component | Stack | Why It Matters |
|-----------|-------|----------------|
| **Web** | Next.js 16 + React 19 + App Router | Server-side rendering, streaming, and React Server Components for optimal performance |
| **API** | NestJS 10 + Fastify | 2-3× faster than Express; modular, testable architecture |
| **Mobile** | React Native 0.81 + Expo SDK 54 | Single codebase for iOS and Android with native performance |
| **Language** | TypeScript (strict mode) | End-to-end type safety across the entire monorepo |

### Data Layer

- **PostgreSQL** with **Prisma ORM** — 29 well-indexed models covering transactions, budgets, goals, investments, shared budgets, AI suggestions, and system logs
- **Composite unique constraints** on budgets and currency rates for data integrity
- **Soft deletes** on transactions for audit trail and recovery
- **Automated migrations** with seed scripts for demo-ready deployments

### Authentication & Security

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend (NextAuth.js)          Backend (Passport.js)      │
│  ├─ Prisma session adapter       ├─ JWT strategy            │
│  ├─ JWT session strategy         ├─ NestJS guards           │
│  ├─ Secure cookie config         └─ Per-endpoint auth       │
│  ├─ bcrypt password hashing                                 │
│  ├─ Regex-enforced password strength                        │
│  └─ Google OAuth SSO                                        │
└─────────────────────────────────────────────────────────────┘
```

### Design System

- **Tailwind CSS v4** with CSS variable theming (light/dark mode)
- **38 Radix-based UI primitives** — dialogs, dropdowns, tabs, tooltips, scroll areas
- **Zen component library** (`zen-button`, `zen-card`, `zen-motion`) with **Framer Motion** animations
- **Warm minimalist palette** with custom cream and brown color tokens
- Scroll-reveal, stagger animations, and page transitions throughout

### State & Data Flow

| Concern | Solution |
|---------|----------|
| Client data fetching | **SWR** with revalidation and cache sync |
| Custom hooks | 12 purpose-built hooks (`useTransactions`, `useBudgets`, `useGoals`, etc.) |
| Background jobs | **Redis + BullMQ** for queue management |
| Rate limiting | In-memory (frontend) + throttler middleware (backend) |

---

## 2. Feature Capabilities

### Financial Management

| Feature | Details |
|---------|---------|
| **Transactions** | Full CRUD with filtering, search, pagination, and category tagging |
| **Budgets** | Per-month targets, spent tracking, rollover support, and customizable alert thresholds |
| **Savings Goals** | Milestones, contributions, target dates, and priority levels |
| **Recurring Rules** | Daily, weekly, biweekly, monthly, quarterly, yearly — with automatic transaction generation |
| **Investments** | Portfolio tracking across stocks, bonds, ETFs, mutual funds, crypto, real estate, and commodities |
| **Shared Budgets** | Multi-user support with viewer/contributor/admin permission roles |

### Notifications & Alerts

- Budget threshold warnings
- Bill reminders
- Goal milestone celebrations
- Anomaly detection alerts
- Subscription renewal notices

### Multi-Currency Support

- Stored exchange rates from external APIs
- Automatic conversion for international transactions

---

## 3. AI-Powered Intelligence

> Powered by **Google Gemini 1.5 Flash** with graceful fallback to rule-based logic

### Capabilities

| Feature | Implementation |
|---------|----------------|
| **Auto-Categorization** | Transaction classification with confidence scoring |
| **Spending Forecasts** | 3-month projections with seasonal pattern detection |
| **What-If Scenarios** | Model budget changes before committing |
| **Budget Optimization** | Identify reallocation opportunities and potential savings |
| **Conversational AI** | Persistent chat history for financial Q&A |
| **Receipt OCR** | Google Cloud Vision for scanning and auto-populating transactions |

### Resilience

- Falls back to rule-based categorization when API key is missing or rate-limited
- Queue jobs retry 3× with exponential backoff
- Per-endpoint rate limits: **10/min** (AI), **5/min** (chat), **100/min** (general API)

---

## 4. Platform & Performance

### Progressive Web App

```
Workbox Caching Strategy
├─ CacheFirst     → Fonts, images
├─ NetworkFirst   → API calls
└─ StaleWhileRevalidate → Static assets
```

### Data Portability

| Direction | Formats |
|-----------|---------|
| **Import** | CSV, XLSX |
| **Export** | PDF (jsPDF + autoTable), CSV (PapaParse), JSON |

### Performance Optimizations

- **sharp** for server-side image processing
- Skeleton loaders for all async data states
- Optimistic updates via SWR
- Connection pooling on Prisma client

### Observability

- **Winston** structured logging with daily rotating file logs
- Vercel Analytics for client-side performance metrics
- Vercel Speed Insights for real user monitoring

---

## 5. Engineering Practices

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    HYBRID ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Next.js                         NestJS                    │
│   ├─ UI rendering                 ├─ AI pipelines           │
│   ├─ Direct DB reads              ├─ Background jobs        │
│   └─ Simple mutations             └─ Complex business logic │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Backend Organization

**14 well-scoped NestJS modules:**

`auth` · `analytics` · `budgets` · `goals` · `notifications` · `recurring` · `transactions` · `users` · `investments` · `reports` · `jobs` · `currency` · `integrations` · `chat`

Each module follows separation of concerns:
- **Services** → Stateful business logic
- **Controllers** → Request handling
- **Guards** → Auth enforcement

### Validation Strategy

| Layer | Tool | Coverage |
|-------|------|----------|
| **Frontend** | Zod | Transactions, budgets, recurring transactions, auth, AI responses, receipt scans |
| **Backend** | class-validator + class-transformer | All DTOs |

### Code Quality

- **Husky + lint-staged** for pre-commit linting and formatting
- **Jest** for unit and integration tests with isolated DB transactions
- Coverage targets: **80% services**, **70% controllers**
- Environment variable schema with build-time validation
- Feature flags for experimental functionality

### API Documentation

- RESTful endpoints with **Swagger/OpenAPI** documentation
- Structured error responses with error codes
- Server components minimize client JavaScript

---

## 6. Third-Party Integrations

| Service | Purpose |
|---------|---------|
| **Plaid** | Bank account linking and automatic transaction sync |
| **Stripe** | Payment processing and subscription billing |
| **Gemini 1.5 Flash** | AI categorization, forecasting, chat, optimization |
| **Google Cloud Vision** | Receipt OCR and merchant extraction |
| **Resend** | Transactional email (welcome, notifications) |
| **Vercel Analytics** | Client-side performance and usage metrics |
| **Vercel Speed Insights** | Real user monitoring |
| **Redis** | Session store and BullMQ job queue backend |
| **PostgreSQL** | Primary relational datastore |

---

## Quick Stats

| Metric | Count |
|--------|-------|
| Database models | 29 |
| UI components | 38+ |
| Custom React hooks | 12 |
| NestJS modules | 14 |
| Zod schemas | 6+ |

---

<div align="center">

*All points derived from direct codebase analysis and verifiable in source.*

</div>
