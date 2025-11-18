# FinanceFlow

**AI-Powered Personal Finance Automation Platform**

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.18-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

---

## Overview

FinanceFlow is a production-grade personal finance management system that leverages Google Gemini AI to automate expense tracking, provide intelligent financial insights, and streamline budget management. Built with Next.js 16 (App Router + Turbopack), TypeScript, Prisma ORM, and PostgreSQL, it demonstrates modern full-stack development patterns suitable for enterprise-scale applications.

### Purpose

Manual expense tracking is tedious and lacks actionable intelligence. FinanceFlow solves this by:

- **Automating categorization** of transactions using AI with confidence scoring
- **Providing conversational AI assistance** for financial queries and recommendations
- **Visualizing spending patterns** with interactive charts and real-time analytics
- **Tracking recurring expenses** (subscriptions, bills, salaries) with automated generation
- **Optimizing budgets** through AI-driven insights and alerts

### Target Users

- Individuals seeking automated personal finance management
- Developers learning modern full-stack architecture with AI integration
- Engineering teams evaluating Next.js 16 and Prisma ORM patterns
- Recruiters assessing technical competency in TypeScript, React, and AI workflows

---

## Key Features

### AI-Powered Intelligence

- **Automatic Transaction Categorization** – Gemini AI analyzes descriptions and suggests categories with confidence scores (0-100%)
- **Conversational Financial Assistant** – Natural language chatbot for financial queries ("How much did I spend on dining this month?")
- **Personalized Insights Dashboard** – AI-generated spending analysis, trend detection, and optimization recommendations
- **Budget Optimizer** – Statistical analysis + AI suggestions for optimal budget reallocation
- **Receipt Scanning** – OCR-powered transaction extraction from receipt images (TODO: Cloud Vision API integration)
- **Financial Forecasting** – Predict future spending based on historical patterns

### Core Financial Management

- **Transaction CRUD** – Full create, read, update, delete operations with soft-delete recovery
- **Advanced Filtering** – Search by date range, category, type (income/expense), keywords, with pagination
- **Recurring Transactions** – Automate bills, subscriptions, salaries (6 frequency types: daily → yearly)
- **Budget Tracking** – Set monthly limits per category with visual progress indicators (color-coded: green/yellow/red)
- **Analytics Dashboard** – Real-time balance overview, spending by category (pie chart), trends (line chart), month-over-month comparisons
- **Data Export** – Export all user data to JSON (CSV planned)

### Authentication & Security

- **Multi-auth Support** – Email/password (bcrypt hashing) + Google OAuth 2.0
- **Session Management** – Secure JWT-based sessions with NextAuth.js v4
- **Protected Routes** – Middleware-based authentication for all dashboard endpoints
- **Environment Validation** – Fail-fast validation of required environment variables at startup
- **SQL Injection Protection** – Prisma parameterized queries prevent injection attacks

### User Experience

- **Responsive Design** – Mobile-first layout with tablet/desktop breakpoints
- **Dark/Light Mode** – System preference detection + manual toggle (next-themes)
- **Smooth Animations** – Framer Motion with `prefers-reduced-motion` support
- **Optimistic Updates** – Instant UI feedback using SWR with rollback on error
- **Toast Notifications** – Contextual feedback for all user actions (Sonner)
- **Accessible** – WCAG 2.1 AA compliant with keyboard navigation

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| [Next.js](https://nextjs.org/) | 16.0.1 | React framework with App Router + Turbopack |
| [React](https://react.dev/) | 19.2.0 | UI library with Server Components |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Type-safe development (strict mode) |
| [TailwindCSS](https://tailwindcss.com/) | 4.x | Utility-first CSS framework |
| [Shadcn/ui](https://ui.shadcn.com/) | Latest | Headless UI components (Radix UI primitives) |
| [Recharts](https://recharts.org/) | 3.3.0 | Chart visualization library |
| [Framer Motion](https://www.framer.com/motion/) | 12.23.24 | Animation library |
| [React Hook Form](https://react-hook-form.com/) | 7.66.0 | Form management with validation |
| [SWR](https://swr.vercel.app/) | 2.3.6 | Data fetching with caching |
| [Lucide React](https://lucide.dev/) | 0.552.0 | Icon library |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| [Node.js](https://nodejs.org/) | 20.x | JavaScript runtime |
| [Prisma](https://www.prisma.io/) | 6.18.0 | Type-safe ORM for PostgreSQL |
| [PostgreSQL](https://www.postgresql.org/) | 15+ | Primary database |
| [NextAuth.js](https://next-auth.js.org/) | 4.24.13 | Authentication library |
| [Zod](https://zod.dev/) | 4.1.12 | Schema validation |
| [bcrypt](https://www.npmjs.com/package/bcrypt) | 6.0.0 | Password hashing |
| [Google Gemini AI](https://ai.google.dev/) | 0.24.1 | AI categorization & insights |

### Development Tools

| Tool | Purpose |
|------|---------|
| ESLint | Code linting with Next.js config |
| TypeScript | Strict type checking with 7+ strict flags |
| Prisma Studio | Database GUI for development |
| Jest | Unit testing framework (configured) |

---

## System Architecture

```mermaid
graph TB
    subgraph Client["Client Layer"]
        UI["Next.js Pages<br/>(React Server Components)"]
        Forms["Forms<br/>(React Hook Form + Zod)"]
        Charts["Charts<br/>(Recharts)"]
    end

    subgraph API["API Layer (Next.js Route Handlers)"]
        AuthAPI["Auth Routes<br/>/api/auth/*"]
        TxAPI["Transactions<br/>/api/transactions"]
        BudgetAPI["Budgets<br/>/api/budgets"]
        RecurAPI["Recurring<br/>/api/recurring-transactions"]
        AIAPI["AI Services<br/>/api/ai/*"]
        ExportAPI["Data Export<br/>/api/export"]
    end

    subgraph Services["Service Layer"]
        AuthSvc["NextAuth.js<br/>(Session Management)"]
        PrismaSvc["Prisma Client<br/>(Type-safe ORM)"]
        AISvc["AI Services"]
        
        subgraph AIModules["AI Modules"]
            Categorize["Categorization Service"]
            Chat["Chat Service"]
            Insights["Insights Service"]
            Forecast["Forecast Service"]
            Optimizer["Budget Optimizer"]
        end
    end

    subgraph External["External Services"]
        DB["PostgreSQL Database<br/>(Supabase/Local)"]
        Gemini["Google Gemini API<br/>(gemini-1.5-flash)"]
        OAuth["Google OAuth 2.0"]
    end

    UI --> AuthAPI
    UI --> TxAPI
    UI --> BudgetAPI
    UI --> RecurAPI
    Forms --> AIAPI
    Charts --> TxAPI

    AuthAPI --> AuthSvc
    TxAPI --> PrismaSvc
    BudgetAPI --> PrismaSvc
    RecurAPI --> PrismaSvc
    AIAPI --> AISvc
    ExportAPI --> PrismaSvc

    AISvc --> AIModules
    AIModules --> Gemini
    
    AuthSvc --> DB
    AuthSvc --> OAuth
    PrismaSvc --> DB

    style Client fill:#e1f5ff
    style API fill:#fff4e6
    style Services fill:#f3e5f5
    style External fill:#e8f5e9
```

### Database Schema

```
User
├── id (cuid)
├── email (unique)
├── password (hashed)
├── name
└── Relations:
    ├── transactions[]
    ├── budgets[]
    ├── recurringTransactions[]
    ├── aiSuggestions[]
    └── aiChatHistory[]

Transaction
├── id (cuid)
├── userId → User
├── amount (Decimal)
├── type (INCOME | EXPENSE)
├── category
├── description
├── date
└── deletedAt (soft delete)

Budget
├── id (cuid)
├── userId → User
├── category
├── amount (Decimal)
├── month (1-12)
└── year

RecurringTransaction
├── id (cuid)
├── userId → User
├── amount (Decimal)
├── type (INCOME | EXPENSE)
├── frequency (DAILY | WEEKLY | BIWEEKLY | MONTHLY | QUARTERLY | YEARLY)
├── startDate
├── endDate (optional)
├── nextDate
└── isActive

AISuggestion
├── id (cuid)
├── userId → User
├── suggestionType
├── suggestedValue
├── confidenceScore
└── accepted (boolean)

AIChatHistory
├── id (uuid)
├── userId → User
├── conversationId
├── role (user | assistant)
└── message
```

---

## Screenshots / Demo

> **TODO**: Add production screenshots

Planned screenshots:
- Dashboard overview with charts
- Transaction list with filters
- Budget tracking interface
- AI chat assistant
- Recurring transactions management
- Mobile responsive views

---

## Project Structure

```
finance-flow/
├── app/                           # Next.js App Router
│   ├── (auth)/                    # Authentication routes (grouped)
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/               # Protected dashboard routes
│   │   ├── dashboard/page.tsx     # Main dashboard
│   │   ├── transactions/page.tsx
│   │   ├── budgets/page.tsx
│   │   ├── recurring/page.tsx
│   │   ├── ai-assistant/page.tsx
│   │   ├── settings/page.tsx
│   │   └── layout.tsx             # Dashboard layout (sidebar)
│   ├── api/                       # API Route Handlers
│   │   ├── auth/                  # NextAuth endpoints
│   │   │   ├── signin/route.ts
│   │   │   ├── signup/route.ts
│   │   │   ├── signout/route.ts
│   │   │   └── session/route.ts
│   │   ├── transactions/
│   │   │   ├── route.ts           # GET, POST
│   │   │   └── [id]/route.ts      # PATCH, DELETE
│   │   ├── budgets/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── recurring-transactions/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── ai/
│   │   │   ├── categorize/route.ts
│   │   │   ├── chat/route.ts
│   │   │   ├── insights/route.ts
│   │   │   ├── forecast/route.ts
│   │   │   ├── optimize-budgets/route.ts
│   │   │   ├── receipt-scan/route.ts
│   │   │   └── feedback/route.ts
│   │   ├── dashboard/
│   │   │   └── stats/route.ts
│   │   ├── export/
│   │   │   └── data/route.ts
│   │   └── account/
│   │       └── delete/route.ts
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Landing page
│
├── src/
│   ├── components/
│   │   ├── ui/                    # Shadcn/ui components
│   │   ├── auth/                  # Login/Signup forms
│   │   ├── dashboard/             # Dashboard widgets
│   │   ├── transactions/          # Transaction components
│   │   ├── budgets/               # Budget components
│   │   ├── recurring/             # Recurring transaction components
│   │   ├── ai/                    # AI chat & insights
│   │   ├── layout/                # Header, Sidebar, ThemeToggle
│   │   └── errors/                # Error boundaries
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── useTransactions.ts     # Transaction data (SWR)
│   │   ├── useBudgets.ts
│   │   ├── useDashboard.ts
│   │   ├── useRecurringTransactions.ts
│   │   └── useAICategorization.ts
│   │
│   ├── lib/
│   │   ├── api-client.ts          # Centralized fetch wrapper
│   │   ├── auth.ts                # NextAuth configuration
│   │   ├── auth-helpers.ts        # JWT utilities
│   │   ├── prisma.ts              # Prisma client singleton
│   │   ├── env.ts                 # Environment validation
│   │   ├── logger.ts              # Structured logging
│   │   ├── rate-limiter.ts        # Rate limiting
│   │   ├── formatters.ts          # Currency/date formatters
│   │   ├── utils.ts               # General utilities
│   │   ├── validations.ts         # Zod schemas
│   │   └── ai/
│   │       ├── gemini-client.ts   # Gemini API client
│   │       ├── categorization-service.ts
│   │       ├── chat-service.ts
│   │       ├── insights-service.ts
│   │       ├── forecast-service.ts
│   │       ├── budget-optimizer-service.ts
│   │       └── config.ts
│   │
│   ├── config/
│   │   ├── animations.ts          # Framer Motion constants
│   │   ├── charts.ts              # Chart colors
│   │   └── navigation.ts          # Menu structure
│   │
│   ├── constants/
│   │   └── categories.ts          # Transaction categories
│   │
│   └── types/
│       ├── index.ts               # Shared types
│       └── next-auth.d.ts         # NextAuth type extensions
│
├── prisma/
│   ├── schema.prisma              # Database schema
│   ├── migrations/                # Migration history
│   ├── seed.ts                    # Basic seed
│   └── seed-demo.ts               # Demo data seed
│
├── public/                        # Static assets
├── .env.example                   # Environment template
├── .env.local                     # Local environment (gitignored)
├── components.json                # Shadcn/ui config
├── middleware.ts                  # Next.js middleware (auth)
├── next.config.ts                 # Next.js configuration
├── tailwind.config.ts             # TailwindCSS config
├── tsconfig.json                  # TypeScript config (strict)
└── package.json
```

---

## Environment Variables

### Required Variables

Create a `.env.local` file in the project root with the following:

```bash
# ========================================
# DATABASE
# ========================================
# PostgreSQL connection string
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
DATABASE_URL="postgresql://postgres:password@localhost:5432/financeflow?schema=public"

# ========================================
# AUTHENTICATION
# ========================================
# Base URL of your application
NEXTAUTH_URL="http://localhost:3000"

# Secret key for JWT encryption
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET="your-secret-key-here"

# ========================================
# AI SERVICES (Google Gemini)
# ========================================
# Get API key from: https://aistudio.google.com/app/apikey
GEMINI_API_KEY="your-gemini-api-key"
```

### Optional Variables

```bash
# ========================================
# GOOGLE OAUTH (Optional)
# ========================================
# Only needed for Google Sign-In
# Get from: https://console.cloud.google.com/
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"

# ========================================
# AI CONFIGURATION (Optional)
# ========================================
AI_MODEL_VERSION="gemini-1.5-flash"           # Default: gemini-1.5-flash
AI_TEMPERATURE="0.7"                          # Default: 0.7
AI_MAX_TOKENS="2048"                          # Default: 2048
AI_AUTO_ACCEPT_THRESHOLD="0"                  # Default: 0 (manual approval)

# ========================================
# RUNTIME (Optional)
# ========================================
NODE_ENV="development"                        # development | production | test
```

### Environment Variable Table

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | ✅ Yes | - | PostgreSQL connection string |
| `NEXTAUTH_URL` | ✅ Yes | `http://localhost:3000` | Application base URL |
| `NEXTAUTH_SECRET` | ✅ Yes | - | JWT encryption secret (generate with `openssl rand -base64 32`) |
| `GEMINI_API_KEY` | ✅ Yes | - | Google Gemini API key for AI features |
| `GOOGLE_CLIENT_ID` | ❌ No | - | Google OAuth client ID (optional) |
| `GOOGLE_CLIENT_SECRET` | ❌ No | - | Google OAuth client secret (optional) |
| `AI_MODEL_VERSION` | ❌ No | `gemini-1.5-flash` | Gemini model version |
| `AI_TEMPERATURE` | ❌ No | `0.7` | AI response randomness (0-1) |
| `AI_MAX_TOKENS` | ❌ No | `2048` | Max AI response length |
| `AI_AUTO_ACCEPT_THRESHOLD` | ❌ No | `0` | Auto-accept AI suggestions above confidence score (0-1) |
| `NODE_ENV` | ❌ No | `development` | Runtime environment |

---

## Installation & Local Development

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **PostgreSQL** 15+ (local or cloud-hosted)
- **Git**

### Step-by-Step Setup

1. **Clone the repository**

```bash
git clone https://github.com/steph1902/finance-flow-project.git
cd finance-flow-project/finance-flow
```

2. **Install dependencies**

```bash
npm install
```

This will:
- Install all project dependencies
- Run Prisma client generation via `postinstall` script
- Setup development environment

3. **Configure environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your values:

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `NEXTAUTH_URL`: `http://localhost:3000` (development)
- `GEMINI_API_KEY`: Get from [Google AI Studio](https://aistudio.google.com/app/apikey)
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Optional, from [Google Cloud Console](https://console.cloud.google.com/)

4. **Start PostgreSQL database**

```bash
# macOS (Homebrew)
brew services start postgresql

# Linux (systemd)
sudo systemctl start postgresql

# Or use cloud-hosted: Supabase, Vercel Postgres, Railway, etc.
```

5. **Run database migrations**

```bash
npx prisma migrate dev
```

This will:
- Create the database if it doesn't exist
- Run all migrations to create tables
- Generate Prisma Client

6. **Seed the database (optional)**

```bash
npm run seed
```

Creates:
- Demo user account (`demo@financeflow.com` / `demo123`)
- Sample transactions
- Sample budgets
- Sample recurring transactions
- AI chat history examples

7. **Start development server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

8. **Verify installation**

```bash
# Test database connection
npx prisma studio
# Opens Prisma Studio at http://localhost:5555

# Run linter
npm run lint

# Run tests
npm run test
```

---

## Running in Production

### Deploy to Vercel (Recommended)

1. **Push code to GitHub**

```bash
git push origin main
```

2. **Import to Vercel**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**

In Vercel project settings → Environment Variables, add:

```
DATABASE_URL=postgresql://... (Vercel Postgres or external provider)
NEXTAUTH_SECRET=<generate-new-secret>
NEXTAUTH_URL=https://your-domain.vercel.app
GEMINI_API_KEY=<your-api-key>
GOOGLE_CLIENT_ID=<optional>
GOOGLE_CLIENT_SECRET=<optional>
```

4. **Setup Database**

Option A: Use Vercel Postgres (recommended)
- Enable Postgres storage in Vercel project
- `DATABASE_URL` auto-populated

Option B: Use external provider (Supabase, Railway, etc.)
- Copy connection string to `DATABASE_URL`

5. **Run Migrations**

After first deployment:

```bash
npx prisma migrate deploy
```

6. **Deploy**

Vercel automatically deploys on git push.

### Common Deployment Pitfalls

- **Missing `DATABASE_URL`** → Prisma fails during build
- **Missing `NEXTAUTH_SECRET`** → Authentication breaks
- **Incorrect `NEXTAUTH_URL`** → OAuth redirect fails
- **Prisma generate not run** → TypeScript errors (ensure `postinstall` script runs)

---

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/signup` | Create new user account | ❌ No |
| `POST` | `/api/auth/signin` | Login with credentials | ❌ No |
| `POST` | `/api/auth/signout` | Logout current user | ✅ Yes |
| `GET` | `/api/auth/session` | Get current session | ❌ No |

**Example: Sign Up**

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123",
    "name": "John Doe"
  }'
```

### Transaction Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/transactions` | List transactions with filters | ✅ Yes |
| `POST` | `/api/transactions` | Create new transaction | ✅ Yes |
| `PATCH` | `/api/transactions/[id]` | Update transaction | ✅ Yes |
| `DELETE` | `/api/transactions/[id]` | Delete transaction (soft) | ✅ Yes |

**Query Parameters (GET /api/transactions):**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `type` (INCOME | EXPENSE | ALL): Filter by type
- `category` (string): Filter by category
- `startDate` (ISO string): Filter from date
- `endDate` (ISO string): Filter to date
- `search` (string): Search description/notes
- `sort` (date | amount): Sort field
- `order` (asc | desc): Sort direction

**Example: Create Transaction**

```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "amount": 45.50,
    "type": "EXPENSE",
    "category": "Food",
    "description": "Grocery shopping",
    "date": "2025-11-18T10:00:00Z"
  }'
```

### Budget Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/budgets` | List budgets for period | ✅ Yes |
| `POST` | `/api/budgets` | Create new budget | ✅ Yes |
| `PATCH` | `/api/budgets/[id]` | Update budget | ✅ Yes |
| `DELETE` | `/api/budgets/[id]` | Delete budget | ✅ Yes |

**Query Parameters (GET /api/budgets):**

- `month` (1-12): Month filter
- `year` (number): Year filter

**Example: Create Budget**

```bash
curl -X POST http://localhost:3000/api/budgets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "category": "Food",
    "amount": 500,
    "month": 11,
    "year": 2025
  }'
```

### Recurring Transaction Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/recurring-transactions` | List recurring transactions | ✅ Yes |
| `POST` | `/api/recurring-transactions` | Create recurring transaction | ✅ Yes |
| `PATCH` | `/api/recurring-transactions/[id]` | Update recurring transaction | ✅ Yes |
| `DELETE` | `/api/recurring-transactions/[id]` | Delete recurring transaction | ✅ Yes |

**Frequency Types:** `DAILY`, `WEEKLY`, `BIWEEKLY`, `MONTHLY`, `QUARTERLY`, `YEARLY`

**Example: Create Recurring Transaction**

```bash
curl -X POST http://localhost:3000/api/recurring-transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "amount": 50,
    "type": "EXPENSE",
    "category": "Bills",
    "description": "Netflix subscription",
    "frequency": "MONTHLY",
    "startDate": "2025-11-01T00:00:00Z"
  }'
```

### AI Service Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/ai/categorize` | AI categorize transaction | ✅ Yes |
| `POST` | `/api/ai/chat` | Chat with AI assistant | ✅ Yes |
| `GET` | `/api/ai/insights` | Get AI financial insights | ✅ Yes |
| `GET` | `/api/ai/forecast` | Get spending forecast | ✅ Yes |
| `GET` | `/api/ai/optimize-budgets` | Get budget optimization suggestions | ✅ Yes |
| `POST` | `/api/ai/receipt-scan` | Extract transaction from receipt image | ✅ Yes |
| `POST` | `/api/ai/feedback` | Submit AI suggestion feedback | ✅ Yes |

**Example: AI Categorization**

```bash
curl -X POST http://localhost:3000/api/ai/categorize \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "description": "Starbucks coffee",
    "amount": 5.50,
    "type": "EXPENSE"
  }'

# Response:
{
  "category": "Food",
  "confidence": 0.95,
  "reasoning": "Coffee shop expense typically categorized as food/dining"
}
```

**Example: AI Chat**

```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "message": "How much did I spend on food this month?",
    "conversationId": "conv-123"
  }'
```

### Dashboard Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/dashboard/stats` | Get dashboard statistics | ✅ Yes |

**Query Parameters:**

- `startDate` (ISO string): Period start
- `endDate` (ISO string): Period end

**Response Structure:**

```json
{
  "balance": 5000,
  "totalIncome": 8000,
  "totalExpenses": 3000,
  "spendingByCategory": [...],
  "trendData": [...],
  "monthOverMonth": {...}
}
```

### Data Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/export/data` | Export all user data (JSON) | ✅ Yes |
| `DELETE` | `/api/account/delete` | Delete user account | ✅ Yes |

---

## AI Features Documentation

### 1. Transaction Categorization

**Input:**
- Transaction description (string)
- Transaction amount (number)
- Transaction type (INCOME | EXPENSE)

**Process:**
1. User creates/edits transaction
2. System sends description to Gemini AI
3. AI analyzes description against predefined categories
4. Returns category + confidence score (0-1)
5. User can accept/reject suggestion
6. Feedback stored for future improvements

**Output:**
- Suggested category (string)
- Confidence score (0-100%)
- Reasoning (explanation)

**Configuration:**
- Model: `gemini-1.5-flash`
- Temperature: 0.7
- Auto-accept threshold: 0 (manual approval by default)

### 2. Conversational AI Assistant

**Input:**
- User message (natural language)
- Conversation history
- Financial context (recent transactions, budgets)

**Process:**
1. User sends message to chatbot
2. System loads conversation history
3. Fetches user's financial data (transactions, budgets)
4. Constructs context-aware prompt for Gemini
5. AI generates response with financial insights
6. Stores conversation in database

**Output:**
- AI response (markdown-formatted)
- Financial recommendations
- Actionable insights

**Example Queries:**
- "How much did I spend on dining this month?"
- "Am I over budget in any category?"
- "What's my biggest expense this week?"
- "Should I reduce spending anywhere?"

### 3. Financial Insights Dashboard

**Input:**
- User's transaction history (last 90 days)
- Budget allocations
- Spending patterns

**Process:**
1. Calculate spending by category
2. Detect trends (increasing/decreasing)
3. Compare to budgets
4. Send analysis to Gemini for insights
5. Generate personalized recommendations

**Output:**
- Top spending categories
- Budget status (on-track / over-budget)
- Spending trends (week/month/quarter)
- AI-generated recommendations
- Predicted future spending

### 4. Budget Optimizer

**Input:**
- Current budgets
- Historical spending data (3+ months)
- Budget utilization rates

**Process:**
1. Analyze spending variance per category
2. Calculate statistical metrics (mean, std dev)
3. Identify over/under-allocated budgets
4. Generate AI-powered reallocation suggestions
5. Provide confidence scores

**Output:**
- Suggested budget adjustments
- Potential monthly savings
- Confidence level (0-100%)
- Detailed reasoning per category

### 5. Receipt Scanning (TODO)

**Status:** Planned (Google Cloud Vision API integration)

**Planned Workflow:**
1. User uploads receipt image
2. Cloud Vision API extracts text (OCR)
3. Gemini AI parses structured data
4. Auto-populates transaction form
5. User reviews and confirms

**Expected Output:**
- Amount
- Merchant name
- Category suggestion
- Date
- Line items (optional)

### 6. Financial Forecasting

**Input:**
- Historical transactions (6+ months)
- Recurring transactions
- Seasonal patterns

**Process:**
1. Analyze spending trends
2. Identify recurring patterns
3. Calculate average monthly spend
4. Project future expenses
5. Account for upcoming recurring bills

**Output:**
- Predicted spending for next 1-3 months
- Category-wise forecasts
- Confidence intervals
- Cash flow projection

---

## UX & UI Design Principles

FinanceFlow follows a **Zen-inspired Japanese minimalist aesthetic** with focus on clarity, simplicity, and user comfort.

### Design Philosophy

- **Ma (間)** – Negative space and breathing room
- **Kanso (簡素)** – Simplicity and elimination of clutter
- **Wabi-sabi (侘寂)** – Beauty in subtle refinement

### Typography

- **UI Text:** Noto Sans JP (400, 500, 600, 700)
- **Headings/Display:** Noto Serif JP (500, 600, 700)
- **Code:** System monospace
- **Financial Numbers:** Tabular numerals for alignment

### Color System

#### Light Mode
- Background: Rice paper white with subtle warmth
- Text: Charcoal ink with multiple opacity levels
- Accents: Muted indigo, luxury gold, soft charcoal

#### Dark Mode
- Background: Night stone (deep charcoal)
- Text: Moonlight white with controlled opacity
- Accents: Brighter indigo, enhanced gold, light charcoal

### Spacing Scale

```css
--space-zen-xs: 4px    /* minimal breath */
--space-zen-sm: 8px    /* tight */
--space-zen-md: 16px   /* comfortable (base) */
--space-zen-lg: 24px   /* breathing */
--space-zen-xl: 32px   /* spacious */
--space-zen-2xl: 48px  /* generous */
--space-zen-3xl: 64px  /* vast */
--space-zen-4xl: 96px  /* monumental */
```

### Motion Tokens

- `transition-instant`: 0.1s
- `transition-fast`: 0.2s
- `transition-smooth`: 0.3s (default)
- `transition-calm`: 0.5s
- `transition-slow`: 0.8s

Easing functions:
- `ease-zen`: cubic-bezier(0.4, 0.0, 0.2, 1)
- `ease-gentle`: cubic-bezier(0.25, 0.1, 0.25, 1)

### Accessibility Features

- WCAG 2.1 AA compliant color contrast
- Enhanced focus indicators with subtle glow
- `prefers-reduced-motion` support (disables animations)
- `prefers-contrast: high` support (enhanced borders)
- Keyboard navigation for all interactive elements
- Skip-to-main-content link
- Screen reader friendly labels

### Responsive Breakpoints

- `sm`: 640px (mobile)
- `md`: 768px (tablet)
- `lg`: 1024px (desktop)
- `xl`: 1280px (large desktop)
- `2xl`: 1536px (ultra-wide)

---

## Contributing

Contributions are welcome! Please follow these guidelines:

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Follow existing code style
   - Add tests if applicable
   - Update documentation
4. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Guidelines

- Write clean, readable code
- Follow TypeScript strict mode requirements
- Add JSDoc comments for complex functions
- Use semantic commit messages
- Keep PRs focused (one feature/fix per PR)
- Update tests if modifying functionality
- Run linter before committing: `npm run lint`

### Code Style

- **Components:** PascalCase (`TransactionTable.tsx`)
- **Hooks:** camelCase with `use` prefix (`useTransactions.ts`)
- **Utilities:** camelCase (`formatCurrency.ts`)
- **Constants:** UPPER_SNAKE_CASE (`CHART_COLORS`)
- **Types:** PascalCase (`Transaction`, `BudgetFilters`)

---

## Project Roadmap

### ✅ Completed Phases

**Phase 1: Backend Foundation**
- ✅ User authentication (Email/Password + Google OAuth)
- ✅ Transaction CRUD with soft delete
- ✅ Budget management (monthly per category)
- ✅ Database schema with Prisma
- ✅ Protected API routes

**Phase 2A: Dashboard & UI**
- ✅ Analytics dashboard with charts
- ✅ Responsive design with dark mode
- ✅ Transaction filters and search
- ✅ Budget progress tracking
- ✅ Optimistic UI updates

**Phase 2B: AI Integration**
- ✅ AI transaction categorization (Gemini)
- ✅ Category suggestions with confidence scores
- ✅ AI chat assistant
- ✅ Financial context awareness
- ✅ Conversation persistence
- ✅ Natural language queries

**Phase 3: Insights & Analytics**
- ✅ AI-powered insights dashboard
- ✅ Budget alerts (90%+ usage warnings)
- ✅ Spending trend analysis
- ✅ Category deep-dive
- ✅ Personalized recommendations
- ✅ Achievement tracking

**Phase 4: Recurring Transactions**
- ✅ 6 frequency types (Daily to Yearly)
- ✅ Automatic transaction generation
- ✅ Status management (Active/Paused/Ended)
- ✅ Dashboard widget for upcoming bills
- ✅ Start/end date configuration

### 🚧 Current Phase (Phase 5: Enhanced UX)

- ⏳ Advanced filtering and sorting
- ⏳ Bulk operations (select multiple transactions)
- ⏳ Keyboard shortcuts
- ⏳ Receipt scanning (Google Cloud Vision integration)
- ⏳ CSV export

### 📋 Planned Phases

**Phase 6: Advanced Features**
- Multi-currency support
- Bank account integration (Plaid API)
- Investment tracking
- Bill reminders and notifications
- Shared budgets (family accounts)
- Custom categories

**Phase 7: Analytics & Reporting**
- Custom date range reports
- Export to PDF/Excel
- Financial goal setting
- Net worth tracking
- Tax preparation helpers

**Phase 8: Mobile & Desktop**
- Progressive Web App (PWA)
- iOS/Android apps (React Native)
- Desktop app (Electron)
- Offline support

---

## Known Issues & Troubleshooting

### Deployment Issues

**Issue:** Build fails with "Cannot find module '@prisma/client'"

**Solution:**
```bash
# Ensure Prisma generate runs during build
npm run build  # This runs "prisma generate && next build"
```

**Issue:** Database connection fails in production

**Solution:**
- Verify `DATABASE_URL` is set in environment variables
- Check PostgreSQL connection pooling limits
- Ensure SSL is enabled for production databases

### Development Issues

**Issue:** TypeScript errors about missing types

**Solution:**
```bash
# Regenerate Prisma Client
npx prisma generate

# Clear Next.js cache
rm -rf .next
npm run dev
```

**Issue:** Tailwind classes not applying

**Solution:**
```bash
# Clear Tailwind cache
rm -rf .next
npm run dev
```

**Issue:** Environment variables not loading

**Solution:**
- Ensure `.env.local` exists (not `.env`)
- Restart development server after changes
- Check for typos in variable names

### AI Feature Issues

**Issue:** Gemini API returns 429 (rate limit)

**Solution:**
- Free tier: 60 requests/minute
- Implement retry logic with exponential backoff (already included)
- Consider upgrading to paid tier

**Issue:** AI categorization suggestions are inaccurate

**Solution:**
- Provide more detailed transaction descriptions
- Submit feedback to improve future suggestions
- Adjust `AI_TEMPERATURE` (lower = more deterministic)

---

## License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2024 Stephanus Sujatmoko

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

See [LICENSE](./LICENSE) for the full license text.

---

## Maintainer

- GitHub: [@steph1902](https://github.com/steph1902)
- Repository: [finance-flow-project](https://github.com/steph1902/finance-flow-project)

For questions, issues, or feature requests:
- [Open an issue](https://github.com/steph1902/finance-flow-project/issues)
- [Submit a pull request](https://github.com/steph1902/finance-flow-project/pulls)

---

## Acknowledgments

### Technologies

- **[Next.js Team](https://nextjs.org/)** – React framework with excellent developer experience
- **[Vercel](https://vercel.com/)** – Deployment platform and infrastructure
- **[Prisma](https://www.prisma.io/)** – Modern database toolkit
- **[Shadcn](https://ui.shadcn.com/)** – Beautiful, accessible UI components
- **[NextAuth.js](https://next-auth.js.org/)** – Authentication for Next.js
- **[Recharts](https://recharts.org/)** – React chart library
- **[Google Gemini AI](https://ai.google.dev/)** – AI categorization and insights
- **[Tailwind Labs](https://tailwindcss.com/)** – Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** – Unstyled, accessible UI primitives
- **[Lucide](https://lucide.dev/)** – Beautiful icon library

### Learning Resources

This project demonstrates:
- Modern full-stack development with Next.js 16
- Type-safe development with TypeScript (strict mode)
- AI integration with Google Gemini
- Database design and ORM usage with Prisma
- Authentication and security best practices
- Responsive UI/UX design
- Production-ready code quality

---

<div align="center">

**Built with ❤️ using Next.js, TypeScript, and Google Gemini AI**

[![Star this repo](https://img.shields.io/github/stars/steph1902/finance-flow-project?style=social)](https://github.com/steph1902/finance-flow-project)

</div>
