# FinanceFlow — Project Selling Points

A technically credible overview of the FinanceFlow personal finance platform, derived directly from the codebase.

---

## 1. Core Technology Stack

### Framework and Runtime
- **Next.js 16** frontend with React 19 and the App Router for server-side rendering and streaming
- **NestJS 10** backend running on Fastify for high-performance API handling
- **React Native 0.81** mobile app with Expo SDK 54 for cross-platform deployment
- **Node.js 20** runtime with strict TypeScript throughout the monorepo

### Data Layer
- **PostgreSQL** database managed by Prisma ORM with 29 well-indexed models
- Database schema includes transactions, budgets, goals, recurring transactions, investments, notifications, shared budgets, AI suggestions, currency rates, and system logs
- Soft deletes on transactions; composite unique constraints on budgets and currency rates
- Prisma migrations with automated seed scripts for demo data

### Authentication and Authorization
- **NextAuth.js** with Prisma adapter, JWT session strategy, and secure cookie configuration
- Credentials-based login with bcrypt password hashing and regex-enforced password strength
- Google OAuth integration for single sign-on
- Backend uses Passport.js with JWT strategy and NestJS guards for API route protection

### Styling and Design System
- **Tailwind CSS v4** with CSS variable theming for light/dark mode
- Warm minimalist palette with custom cream and brown color tokens
- 38 Radix-based UI primitives including dialogs, dropdowns, tabs, tooltips, and scroll areas
- Zen component library (`zen-button`, `zen-card`, `zen-motion`) with Framer Motion animations
- Scroll-reveal, stagger animations, and page transitions for polished UX

### State Management Strategy
- **SWR** for client-side data fetching with revalidation and cache synchronization
- 12 custom React hooks encapsulating all data-fetching logic (`useTransactions`, `useBudgets`, `useGoals`, `useNotifications`, `useRecurringTransactions`, etc.)
- **Redis with BullMQ** for server-side background job processing and queue management
- In-memory rate limiter on the frontend; throttler middleware on the backend

---

## 2. Key Functional Capabilities

### User-Visible Features
- Full income/expense transaction management with filtering, search, and pagination
- Category-based budgets with per-month targets, spent tracking, rollover support, and alert thresholds
- Savings goals with milestones, contributions, target dates, and priority levels
- Recurring transaction rules (daily, weekly, biweekly, monthly, quarterly, yearly) with automatic generation
- Investment portfolio tracking across stocks, bonds, ETFs, mutual funds, crypto, real estate, and commodities
- Shared budgets with viewer/contributor/admin permission roles
- Notification center with budget alerts, bill reminders, goal milestones, anomaly detection, and subscription renewals
- Multi-currency support with stored exchange rates sourced from external APIs

### AI-Powered Capabilities
- **Gemini 1.5 Flash** integration for automatic transaction categorization with confidence scoring
- Spending forecasts with 3-month projections, seasonal pattern detection, and what-if scenario modeling
- Budget optimization suggestions that identify reallocation opportunities and potential savings
- Conversational AI assistant with persistent chat history for financial Q&A
- **Google Cloud Vision** receipt OCR for scanning and auto-populating transactions

### Platform Capabilities
- Progressive Web App with Workbox (CacheFirst for fonts/images, NetworkFirst for API, StaleWhileRevalidate for static assets)
- Onboarding flow with step tracking and completion status persisted to user record
- Report generation in PDF (jsPDF + autoTable), CSV (PapaCSE), and JSON formats
- Data import from CSV and XLSX; export across all formats
- Dark mode toggle via next-themes with system preference detection

### Performance and UX-Driven Features
- Optimized image handling with sharp for server-side processing
- Rate limiting per endpoint type (10/min AI, 5/min chat, 100/min general API)
- Structured logging with Winston and daily rotating file logs
- Skeleton loaders and loading states for all async data

---

## 3. Senior-Level Engineering Patterns and Practices

### Architectural Patterns
- Hybrid architecture: Next.js handles UI rendering and direct database reads; NestJS processes AI pipelines, background jobs, and complex business logic
- Modular NestJS backend with 14 well-scoped domains (auth, analytics, budgets, goals, notifications, recurring, transactions, users, investments, reports, jobs, currency, integrations)
- Separation of concerns: services for stateful business logic, controllers for request handling, guards for auth enforcement

### Validation and Error Handling
- **Zod** schemas on the frontend for type-safe runtime validation (transactions, budgets, recurring transactions, auth inputs, AI responses, receipt scans)
- **class-validator** and **class-transformer** on the backend for DTO validation
- API endpoints return structured error responses with error codes
- AI fallback to rule-based categorization when API key is missing or rate limit exceeded
- Queue jobs retry 3 times with exponential backoff on failure

### Server/Client Boundaries
- Next.js App Router for server components with minimal client JavaScript
- API routes use server-only Prisma client instance with connection pooling
- SWR handles client-side cache invalidation and optimistic updates
- Backend exposes RESTful endpoints documented with Swagger/OpenAPI

### Reusability, Scalability, and Maintainability
- Reusable custom hooks abstract API calls and state management from components
- Radix primitives encapsulated in composable UI components for consistent styling
- Environment variable schema (`env.ts`) with build-time validation
- Feature gates for toggling experimental functionality
- Husky + lint-staged for pre-commit linting and formatting
- Jest for unit and integration tests with isolated database transactions; coverage targets: 80% services, 70% controllers

---

## 4. Third-Party Services and Integrations

| Service | Role |
|---------|------|
| **Plaid** | Bank account linking and automatic transaction sync |
| **Stripe** | Payment processing and subscription billing |
| **Google Generative AI (Gemini 1.5 Flash)** | Transaction categorization, forecasting, chat, and budget optimization |
| **Google Cloud Vision** | Receipt image OCR and merchant extraction |
| **Resend** | Transactional email delivery (welcome emails, notifications) |
| **Vercel Analytics** | Client-side performance and usage analytics |
| **Vercel Speed Insights** | Real user monitoring for page load performance |
| **Redis** | Session store and BullMQ job queue backend |
| **PostgreSQL** | Primary relational datastore |

---

*Document generated from direct codebase analysis. All points are verifiable in the source.*
