<div align="center">

# 💰 FinanceFlow

### AI-Powered Personal Finance Automation Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.18-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

**[Features](#-key-features)** •
**[Tech Stack](#-tech-stack)** •
**[Installation](#-installation--local-development)** •
**[Documentation](#-api-documentation)** •
**[Contributing](#-contributing)**

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
  - [Purpose](#purpose)
  - [Target Users](#target-users)
- [Key Features](#-key-features)
  - [AI-Powered Intelligence](#ai-powered-intelligence)
  - [Core Financial Management](#core-financial-management)
  - [Authentication & Security](#authentication--security)
  - [User Experience](#user-experience)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Screenshots / Demo](#-screenshots--demo)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Installation & Local Development](#-installation--local-development)
- [Running in Production](#-running-in-production)
- [API Documentation](#-api-documentation)
- [AI Features Documentation](#-ai-features-documentation)
- [Testing](#-testing)
- [Performance & Optimization](#-performance--optimization)
- [UX & UI Design Principles](#-ux--ui-design-principles)
- [Security](#-security)
- [Contributing](#-contributing)
- [Project Roadmap](#-project-roadmap)
- [Known Issues & Troubleshooting](#-known-issues--troubleshooting)
- [FAQ](#-faq)
- [License](#-license)
- [Maintainer & Support](#-maintainer--support)
- [Acknowledgments](#-acknowledgments)

## 🌟 Overview

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

## ✨ Key Features

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

- **Premium Interface** – "Neo-Fintech" aesthetic with glassmorphism and dynamic gradients
- **Responsive Design** – Mobile-first layout with tablet/desktop breakpoints
- **Smooth Animations** – Framer Motion with `prefers-reduced-motion` support
- **Optimistic Updates** – Instant UI feedback using SWR with rollback on error
- **Toast Notifications** – Contextual feedback for all user actions (Sonner)
- **Accessible** – WCAG 2.1 AA compliant with keyboard navigation

### DevOps & Quality Assurance

- **Automated Versioning** – GitHub webhook automatically increments versions on push
- **Pre-Commit Validation** – Husky + lint-staged ensure code quality (Lint, Type-Check, Test)
- **Auto-Deployment** – Vercel integration with automatic DB schema sync and seeding

---

## 🛠 Tech Stack

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
| Husky | Git hooks for pre-commit validation |
| Lint-Staged | Run linters on staged files only |

---

## 🏗 System Architecture

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

## 📸 Screenshots / Demo

> **Coming Soon**: Production screenshots will be added in the next release.

### Planned Screenshots

- 📊 **Dashboard Overview** – Real-time balance, charts, and spending insights
- 💳 **Transaction Management** – Advanced filtering and categorization
- 📈 **Budget Tracking** – Visual progress indicators and alerts
- 🤖 **AI Chat Assistant** – Natural language financial queries
- 🔄 **Recurring Transactions** – Automated bill and subscription tracking
- 📱 **Mobile Responsive** – Seamless experience across all devices

<!-- 
Uncomment and add screenshots when available:

<div align="center">
  <img src="./public/screenshots/dashboard.png" alt="Dashboard" width="45%">
  <img src="./public/screenshots/transactions.png" alt="Transactions" width="45%">
</div>
-->

### Live Demo

> **Note**: Demo deployment coming soon. For now, follow the [installation guide](#-installation--local-development) to run locally.

---

## 📁 Project Structure

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

## 🔧 Environment Variables

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

## 🚀 Installation & Local Development

### Prerequisites

Ensure you have the following installed:

- **Node.js** 18.x or 20.x ([Download](https://nodejs.org/))
- **npm** 9+ or **pnpm** 8+ (pnpm recommended for faster installs)
- **PostgreSQL** 15+ ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/downloads))

**Quick Check:**
```bash
node --version    # Should be v18.x or v20.x
npm --version     # Should be 9.x+
psql --version    # Should be 15.x+
git --version
```

### Quick Start (5 minutes)

Get FinanceFlow running locally in 5 steps:

```bash
# 1. Clone repository
git clone https://github.com/steph1902/finance-flow-project.git
cd finance-flow-project/finance-flow

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env.local
# Edit .env.local with your values (see Environment Variables section)

# 4. Setup database
npx prisma migrate dev
npm run db:seed  # Optional: add demo data

# 5. Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

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

Edit `.env.local` with your configuration:

**Required Variables:**
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/financeflow"
NEXTAUTH_SECRET="<generate-with-openssl-rand-base64-32>"
NEXTAUTH_URL="http://localhost:3000"
GEMINI_API_KEY="<get-from-https://aistudio.google.com/app/apikey>"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

**Optional Variables:** See [Environment Variables](#-environment-variables) section for Google OAuth, Stripe, etc.

4. **Setup PostgreSQL database**

**Option A: Local PostgreSQL**

```bash
# macOS (Homebrew)
brew install postgresql@15
brew services start postgresql@15
createdb financeflow

# Linux (Ubuntu/Debian)
sudo apt install postgresql-15
sudo systemctl start postgresql
sudo -u postgres createdb financeflow

# Windows - Download from https://www.postgresql.org/download/windows/
# Use pgAdmin or psql to create 'financeflow' database
```

**Option B: Cloud Database** (Recommended for beginners)

- [Supabase](https://supabase.com) – Free tier, instant setup
- [Vercel Postgres](https://vercel.com/storage/postgres) – Free tier
- [Railway](https://railway.app) – Free tier
- [Neon](https://neon.tech) – Serverless Postgres

Copy the connection string to `DATABASE_URL` in `.env.local`.

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
npm run db:seed
```

Creates extensive demo data:
- Demo user account: `demo@financeflow.com` / `Demo1234`
- **500+ Transactions** covering 12 months of history
- **108 Budgets** (9 categories × 12 months)
- **5 Financial Goals** with progress tracking
- **15 Recurring Transactions** (subscriptions, bills, salary)
- Varied spending patterns for realistic analytics

**Skip this if you want to start fresh!**

7. **Start development server**

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

**First-time setup:**
- Create account at `/signup`
- Or login with demo account (if seeded)
- Complete onboarding wizard

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

### Common Setup Issues

**Issue: `DATABASE_URL` connection failed**
```bash
# Verify PostgreSQL is running
brew services list | grep postgresql  # macOS
sudo systemctl status postgresql      # Linux

# Test connection manually
psql $DATABASE_URL
```

**Issue: `prisma generate` fails**
```bash
# Clear Prisma cache and regenerate
rm -rf node_modules/.prisma
npx prisma generate
```

**Issue: Port 3000 already in use**
```bash
# Use different port
PORT=3001 npm run dev

# Or kill process using port 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux
```

**Issue: TypeScript errors**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### Development Workflow

**Daily Development:**
```bash
npm run dev          # Start dev server with hot reload
npm run lint         # Check for linting errors
npm run test:watch   # Run tests in watch mode
```

**Database Changes:**
```bash
# After modifying prisma/schema.prisma
npx prisma migrate dev --name description_of_change
npx prisma generate  # Regenerate Prisma Client
```

**Code Quality:**
```bash
npm run lint:fix     # Auto-fix linting issues
npm run test:coverage # Check test coverage
```

---

## 🌐 Running in Production

### Deploy to Vercel (Recommended - 10 minutes)

Vercel offers the easiest deployment experience for Next.js apps with zero configuration.

#### Prerequisites

- GitHub/GitLab/Bitbucket account
- Vercel account ([Sign up free](https://vercel.com/signup))
- PostgreSQL database (Supabase/Vercel Postgres recommended)

#### Deployment Steps

**1. Push code to GitHub**

```bash
# Initialize git repository (if not already)
git init
git add .
git commit -m "Initial commit"

# Create GitHub repository at https://github.com/new
# Then push
git remote add origin https://github.com/YOUR_USERNAME/finance-flow.git
git branch -M main
git push -u origin main
```

**2. Import to Vercel**

- Visit [vercel.com/new](https://vercel.com/new)
- Click "Import Project"
- Select your GitHub repository
- Vercel will auto-detect Next.js configuration

**3. Configure Environment Variables**

In Vercel project → **Settings** → **Environment Variables**, add:

**Required:**
```bash
DATABASE_URL=postgresql://user:pass@host:5432/dbname?sslmode=require
NEXTAUTH_SECRET=<generate-new-with-openssl-rand-base64-32>
NEXTAUTH_URL=https://your-app.vercel.app
GEMINI_API_KEY=<your-gemini-api-key>
```

**Optional:**
```bash
GOOGLE_CLIENT_ID=<for-google-oauth>
GOOGLE_CLIENT_SECRET=<for-google-oauth>
```

⚠️ **Important:** Generate a **NEW** `NEXTAUTH_SECRET` for production (different from local)!

**4. Setup Production Database**

**Option A: Vercel Postgres** (Recommended - Easiest)

1. In Vercel project → **Storage** tab
2. Click **Create Database** → Select **Postgres**
3. `DATABASE_URL` is auto-populated in Environment Variables
4. Run migrations (see step 5)

**Option B: Supabase** (Recommended - More features)

1. Create project at [supabase.com](https://supabase.com)
2. Get connection string from **Settings** → **Database**
3. Format: `postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres`
4. Add `?sslmode=require` to end
5. Paste as `DATABASE_URL` in Vercel

**5. Automated Database Sync & Seeding**

This project includes a `postbuild` script that automatically:
1. Syncs the database schema (`prisma db push`)
2. Seeds the database with demo data (`prisma/seed.ts`)

No manual migration steps are required! Vercel will handle this automatically during deployment.

**Note:** The `postbuild` script uses `--accept-data-loss` to ensure schema changes are applied even if they require dropping columns. This is ideal for development/demo environments.

**6. Deploy**

- Click **Deploy** in Vercel dashboard
- Vercel automatically deploys on every git push to `main`
- Visit your live app at `https://your-app.vercel.app`

#### Post-Deployment

**Test your deployment:**
```bash
curl https://your-app.vercel.app/api/auth/session
# Should return: {"user":null}
```

**Monitor:**
- **Logs**: Vercel Dashboard → Deployments → View Logs
- **Analytics**: Vercel Dashboard → Analytics (built-in)
- **Errors**: Check runtime logs for API errors

### Deploy to Other Platforms

### Deploy to Other Platforms

#### Docker Deployment

```bash
# Build Docker image
docker build -t financeflow .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e NEXTAUTH_SECRET="..." \
  -e NEXTAUTH_URL="https://yourdomain.com" \
  -e GEMINI_API_KEY="..." \
  financeflow
```

**Docker Compose:**
```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env.production
    depends_on:
      - postgres
  
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: financeflow
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Run: `docker-compose up -d`

#### Railway

1. Visit [railway.app](https://railway.app)
2. Click **New Project** → **Deploy from GitHub**
3. Select repository
4. Add environment variables
5. Railway auto-detects Next.js and deploys

#### Render

1. Visit [render.com](https://render.com)
2. **New** → **Web Service**
3. Connect GitHub repository
4. Build command: `npm run build`
5. Start command: `npm start`
6. Add environment variables
7. Deploy

#### Self-Hosted VPS

```bash
# SSH into your server
ssh user@your-server.com

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install postgresql-15

# Clone repository
git clone https://github.com/your-username/finance-flow.git
cd finance-flow

# Install dependencies
npm install --production

# Setup environment
cp .env.example .env.production.local
nano .env.production.local  # Edit with production values

# Build application
npm run build

# Run migrations
npx prisma migrate deploy

# Start with PM2 (process manager)
npm install -g pm2
pm2 start npm --name "financeflow" -- start
pm2 save
pm2 startup  # Enable auto-start on boot

# Setup Nginx reverse proxy (optional)
sudo apt install nginx
# Configure Nginx to proxy port 3000
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

- **Missing `DATABASE_URL`** → Prisma fails during build
- **Missing `NEXTAUTH_SECRET`** → Authentication breaks
- **Incorrect `NEXTAUTH_URL`** → OAuth redirect fails
- **Prisma generate not run** → TypeScript errors (ensure `postinstall` script runs)
- **Missing `GEMINI_API_KEY`** → AI features fail at runtime (build will succeed)

### ⚠️ Vercel Build Requirements (2025)

**Critical**: This project uses lazy environment variable loading to prevent build failures when env vars are missing. The build will **succeed** even without env vars, but the app will throw runtime errors when AI features are accessed without `GEMINI_API_KEY`.

**Required Environment Variables for Production:**
```
DATABASE_URL=<your-postgres-url>
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXTAUTH_URL=https://your-domain.vercel.app
GEMINI_API_KEY=<your-gemini-key>
```

**How the build works:**
1. Build phase: Env vars are NOT validated (prevents build crashes)
2. Runtime phase: Env vars are validated when accessed
3. Missing vars throw clear runtime errors with instructions

This allows Vercel preview deployments to build successfully while protecting production from missing configurations.

---

## 📚 API Documentation

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

## 🤖 AI Features Documentation

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

## 🧪 Testing

FinanceFlow includes a comprehensive testing setup using Jest and React Testing Library.

### Test Structure

```
finance-flow/
├── __tests__/              # Frontend unit tests
│   ├── components/
│   ├── hooks/
│   └── utils/
├── backend/test/           # Backend E2E tests
│   ├── auth.e2e-spec.ts
│   ├── transactions.e2e-spec.ts
│   ├── budgets.e2e-spec.ts
│   └── goals.e2e-spec.ts
└── coverage/               # Test coverage reports
```

### Running Tests

**Unit Tests**
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# CI mode (used in GitHub Actions)
npm run test:ci
```

**Backend E2E Tests** (Nest.js backend)
```bash
cd backend
npm run test:e2e
```

### Test Coverage

Current coverage targets:
- **Utilities**: 90%+ coverage
- **Components**: 80%+ coverage
- **API Routes**: 75%+ coverage
- **Hooks**: 85%+ coverage

View coverage reports:
```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

### Writing Tests

**Component Test Example:**
```typescript
import { render, screen } from '@testing-library/react';
import { TransactionCard } from '@/components/transactions/TransactionCard';

describe('TransactionCard', () => {
  it('displays transaction details correctly', () => {
    const transaction = {
      id: '1',
      amount: 50,
      type: 'EXPENSE',
      category: 'Food',
      description: 'Grocery shopping'
    };
    
    render(<TransactionCard transaction={transaction} />);
    
    expect(screen.getByText('Grocery shopping')).toBeInTheDocument();
    expect(screen.getByText('$50.00')).toBeInTheDocument();
  });
});
```

**API Route Test Example:**
```typescript
import { GET } from '@/app/api/transactions/route';
import { getServerSession } from 'next-auth';

jest.mock('next-auth');

describe('GET /api/transactions', () => {
  it('returns transactions for authenticated user', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com' }
    });
    
    const request = new Request('http://localhost:3000/api/transactions');
    const response = await GET(request);
    
    expect(response.status).toBe(200);
  });
});
```

### Testing Best Practices

1. **Arrange-Act-Assert**: Structure tests clearly
2. **Mock External Dependencies**: Mock API calls, auth sessions
3. **Test User Behavior**: Focus on user interactions, not implementation
4. **Accessibility**: Include accessibility tests (ARIA labels, roles)
5. **Snapshot Testing**: Use sparingly for complex UI

---

## ⚡ Performance & Optimization

FinanceFlow is built with performance as a top priority, leveraging Next.js 16's latest optimizations.

### Performance Features

#### Build-Time Optimizations

- **Turbopack** – Next.js 16's faster bundler (replaces Webpack)
- **React Server Components** – Zero JavaScript for static content
- **Automatic Code Splitting** – Each route only loads required code
- **Image Optimization** – Automatic WebP/AVIF conversion with `next/image`
- **Font Optimization** – Self-hosted fonts with `next/font`

#### Runtime Optimizations

- **SWR Caching** – Client-side data caching with stale-while-revalidate
- **Optimistic Updates** – Instant UI feedback before server response
- **Lazy Loading** – Components load on-demand with `React.lazy()`
- **Debounced Search** – Reduces API calls for search/filter inputs
- **Virtualized Lists** – Only renders visible items in long lists (planned)

#### Database Optimizations

- **Prisma Connection Pooling** – Reuses database connections
- **Indexed Queries** – All frequently queried fields are indexed
- **Pagination** – Limits query results (default: 10 items per page)
- **Soft Deletes** – Faster than hard deletes, maintains data integrity

### Performance Benchmarks

**Lighthouse Scores** (Target for production):
- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

**Core Web Vitals**:
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Optimization Tips

**1. Enable Edge Runtime for API Routes** (Optional)
```typescript
// app/api/transactions/route.ts
export const runtime = 'edge'; // Runs on Vercel Edge Network
```

**2. Configure Database Connection Pooling**
```bash
# .env.production
DATABASE_URL="postgresql://...?connection_limit=10&pool_timeout=20"
```

**3. Enable Compression** (Vercel does this automatically)
```typescript
// next.config.ts
const nextConfig = {
  compress: true,
};
```

**4. Optimize Images**
```tsx
// Always use next/image for static images
import Image from 'next/image';

<Image
  src="/logo.png"
  width={200}
  height={50}
  alt="Logo"
  priority // For above-the-fold images
/>
```

**5. Implement Request Deduplication**
```typescript
// SWR automatically deduplicates requests
const { data } = useSWR('/api/transactions', fetcher);
// Multiple components can call this - only 1 network request
```

### Monitoring Performance

**Development:**
```bash
# Run Lighthouse audit
npm run build
npm run start
# Visit http://localhost:3000 in Chrome
# Open DevTools → Lighthouse → Generate Report
```

**Production:**
- **Vercel Analytics** – Built-in (already integrated via `@vercel/analytics`)
- **Vercel Speed Insights** – Real user metrics (already integrated)
- **Google Analytics** – Optional, add via environment variable

### Troubleshooting Slow Performance

**Symptom**: Slow page loads

**Solutions**:
1. Check database query performance: `npx prisma studio` → View query times
2. Enable caching in API routes with `Cache-Control` headers
3. Reduce bundle size: Analyze with `npx @next/bundle-analyzer`

**Symptom**: High memory usage

**Solutions**:
1. Clear Prisma connection pool: Restart app
2. Check for memory leaks in AI service (long conversations)
3. Increase Node.js memory: `NODE_OPTIONS=--max-old-space-size=4096`

---

## 🎨 UX & UI Design Principles

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

## 🔒 Security

FinanceFlow implements industry-standard security practices to protect user financial data.

### Security Features

#### Authentication & Authorization

- **Password Hashing**: bcrypt with 10 salt rounds (industry standard)
- **Session Management**: Secure HTTP-only cookies via NextAuth.js
- **JWT Encryption**: Tokens encrypted with `NEXTAUTH_SECRET`
- **OAuth 2.0**: Google Sign-In with token validation
- **Protected Routes**: Middleware-based authentication for all `/dashboard` routes
- **CSRF Protection**: Built-in via NextAuth.js

#### Data Security

- **SQL Injection Prevention**: Prisma ORM uses parameterized queries
- **XSS Protection**: React auto-escapes user input
- **Environment Variables**: Sensitive keys never committed to git
- **Soft Deletes**: Deleted data recoverable, prevents accidental data loss
- **Database Encryption**: PostgreSQL supports encryption at rest (enable in cloud provider)

#### API Security

- **Rate Limiting**: Prevents brute force attacks (planned for Phase 5)
- **Input Validation**: Zod schema validation on all API endpoints
- **Type Safety**: TypeScript prevents type-related vulnerabilities
- **Error Handling**: Generic error messages (no sensitive data leaked)
- **CORS**: Configured for same-origin by default

### Security Best Practices

#### For Self-Hosting

**1. Use Strong Secrets**
```bash
# Generate strong NEXTAUTH_SECRET (32+ characters)
openssl rand -base64 48

# Never reuse secrets between environments
```

**2. Enable HTTPS**
```nginx
# Force HTTPS redirect in Nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    
    # ... rest of config
}
```

**3. Secure Database**
```bash
# Require SSL for PostgreSQL connections
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"

# Use strong database password
# Restrict database access to application IP only
```

**4. Environment Variable Protection**
```bash
# Never commit .env files
echo ".env*" >> .gitignore
echo "!.env.example" >> .gitignore

# Set restrictive file permissions
chmod 600 .env.production.local
```

**5. Regular Updates**
```bash
# Check for security vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Update dependencies
npm update
```

### Security Headers

Add security headers in `next.config.ts`:

```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};
```

### Reporting Security Issues

**Do NOT open public issues for security vulnerabilities.**

Please report security issues responsibly:

1. Email: [Create SECURITY.md file with contact info]
2. GitHub Security Advisories: [Repository Security Tab](https://github.com/steph1902/finance-flow-project/security)

Include:
- Description of vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (optional)

We aim to respond within 48 hours and patch critical issues within 7 days.

### Security Checklist

**Pre-Production:**
- [ ] Changed all default secrets (`NEXTAUTH_SECRET`, database passwords)
- [ ] Enabled HTTPS/SSL
- [ ] Configured firewall rules
- [ ] Set up database backups
- [ ] Enabled error logging (without sensitive data)
- [ ] Reviewed all environment variables
- [ ] Ran `npm audit` and fixed vulnerabilities
- [ ] Tested authentication flows
- [ ] Configured CORS appropriately
- [ ] Set up monitoring/alerting

---

## 🤝 Contributing

We welcome contributions from the community! FinanceFlow is built to demonstrate best practices in modern web development, and your input can help make it even better.

### Ways to Contribute

- 🐛 **Report Bugs** – [Open an issue](https://github.com/steph1902/finance-flow-project/issues/new?template=bug_report.md)
- 💡 **Suggest Features** – [Request a feature](https://github.com/steph1902/finance-flow-project/issues/new?template=feature_request.md)
- 📖 **Improve Documentation** – Fix typos, add examples, clarify instructions
- 🧪 **Write Tests** – Increase test coverage
- 💻 **Submit Pull Requests** – Fix bugs or implement features

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

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(ai): add receipt scanning with OCR
fix(transactions): resolve pagination bug on mobile
docs(readme): update installation instructions
test(budgets): add unit tests for budget calculations
```

### Pull Request Process

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feat/amazing-feature`)
3. **Commit** your changes using conventional commits
4. **Push** to your fork (`git push origin feat/amazing-feature`)
5. **Open** a Pull Request with:
   - Clear title and description
   - Reference to related issues
   - Screenshots (if UI changes)
   - Test coverage (if applicable)

### Code Review Guidelines

All PRs require:
- ✅ Passing CI/CD checks (linting, tests, build)
- ✅ No decrease in test coverage
- ✅ Documentation updates (if applicable)
- ✅ Review approval from maintainer

---

## 🗺 Project Roadmap

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

## 🐛 Known Issues & Troubleshooting

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

## ❓ FAQ

### General Questions

**Q: Is FinanceFlow free to use?**  
A: Yes, FinanceFlow is completely free and open-source under the MIT License. You can self-host it without any subscription fees. Note that you'll need your own Google Gemini API key (free tier available).

**Q: Can I use FinanceFlow without an AI API key?**  
A: The app will run, but AI-powered features (categorization, chat assistant, insights) won't work. You can still manually manage transactions and budgets.

**Q: Does FinanceFlow connect to my bank account?**  
A: Not yet. Bank integration via Plaid API is on the roadmap (Phase 6). Currently, transactions are manually entered or can be imported from CSV.

**Q: Is my financial data secure?**  
A: Yes. All data is stored in your own PostgreSQL database with encrypted passwords (bcrypt). The app uses secure authentication (NextAuth.js) and follows security best practices. When self-hosting, you control all data.

**Q: Can multiple people use the same installation?**  
A: Yes, the app supports multiple user accounts. Each user has isolated data. Shared budgets (family accounts) are planned for Phase 6.

### Technical Questions

**Q: Why Next.js 16 instead of 15 or 14?**  
A: FinanceFlow uses cutting-edge features like App Router, Server Components, and Turbopack for optimal performance. Next.js 16 provides improved developer experience and faster builds.

**Q: Can I deploy to platforms other than Vercel?**  
A: Yes, but Vercel is recommended for easiest setup. You can deploy to:
- **Docker**: Dockerfile included
- **AWS/GCP/Azure**: Standard Node.js deployment
- **Railway/Render**: Auto-detected Next.js projects
- **Self-hosted**: Any VPS with Node.js 18+

**Q: How do I migrate data from other finance apps?**  
A: Currently, you can import/export JSON data via the Export API. CSV import is planned. For migration from specific apps, you may need to write a custom script using our API.

**Q: What's the difference between the `/app` and `/backend` folders?**  
A: Currently, `/backend` contains a separate Nest.js backend (experimental). The main app uses Next.js API routes in `/app/api`. The Nest.js backend may be merged or removed in future versions.

**Q: Can I customize transaction categories?**  
A: Categories are currently predefined in `src/constants/categories.ts`. Custom categories are planned for Phase 6. You can modify the constants file to add your own for now.

**Q: Does FinanceFlow support cryptocurrency tracking?**  
A: Not yet. Crypto tracking is not on the current roadmap but could be added as a community contribution.

### AI Features

**Q: How accurate is the AI categorization?**  
A: Accuracy depends on transaction descriptions. Clear descriptions (e.g., "Starbucks coffee") yield 90%+ confidence. Vague descriptions may need manual review.

**Q: Can I train the AI on my spending patterns?**  
A: Currently, the AI uses the predefined category list. Personalized learning is on the roadmap (Phase 7). Feedback mechanism is implemented but not yet used for retraining.

**Q: What happens if I exceed the free Gemini API quota?**  
A: Free tier: 60 requests/minute, 1,500/day. If exceeded:
- Categorization will fail gracefully (manual categorization required)
- Chat responses will show rate limit errors
- Consider upgrading to Gemini paid tier or batch categorizing less frequently

**Q: Can I use a different AI model (OpenAI, Anthropic)?**  
A: Currently, only Google Gemini is supported. Adding OpenAI GPT or Anthropic Claude would require modifying `/src/lib/ai/*` services. Community contributions welcome!

### Deployment & DevOps

**Q: How do I set up automated database backups?**  
A: If using Vercel Postgres, backups are automatic. For self-hosted:
```bash
# Add to crontab for daily backups
0 2 * * * pg_dump $DATABASE_URL > /backups/financeflow-$(date +\%F).sql
```

**Q: Can I run FinanceFlow in a Docker container?**  
A: Yes, a Dockerfile is included. Run:
```bash
docker build -t financeflow .
docker run -p 3000:3000 --env-file .env.local financeflow
```

**Q: How do I enable HTTPS for local development?**  
A: Use `mkcert` or configure Next.js with custom server. For production, Vercel handles HTTPS automatically.

**Q: What are the server requirements for self-hosting?**  
A: Minimum:
- **CPU**: 1 core
- **RAM**: 512MB (1GB recommended)
- **Storage**: 1GB (grows with data)
- **Node.js**: 18.x or 20.x
- **PostgreSQL**: 15+

### Troubleshooting

**Q: Why do I see "Database connection failed" errors?**  
A: Check:
1. PostgreSQL is running (`brew services list` on macOS)
2. `DATABASE_URL` is correct in `.env.local`
3. Database exists: `psql $DATABASE_URL` (should connect)
4. Migrations ran: `npx prisma migrate dev`

**Q: TypeScript errors about Prisma types?**  
A: Run `npx prisma generate` to regenerate types after schema changes.

**Q: Build fails with "Module not found" errors?**  
A: Clear caches and reinstall:
```bash
rm -rf .next node_modules
npm install
npm run dev
```

**Q: AI features return 401 Unauthorized?**  
A: Verify `GEMINI_API_KEY` is:
1. Set in `.env.local` (not `.env`)
2. Valid (test at https://aistudio.google.com/)
3. Not expired or rate-limited

---

## 📄 License

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

## 👨‍💻 Maintainer & Support

<div align="center">

**Created and maintained by [Stephanus Sujatmoko](https://github.com/steph1902)**

[![GitHub](https://img.shields.io/badge/GitHub-@steph1902-181717?style=flat-square&logo=github)](https://github.com/steph1902)
[![Repository](https://img.shields.io/badge/Repo-finance--flow--project-blue?style=flat-square&logo=github)](https://github.com/steph1902/finance-flow-project)

</div>

### Get Help

- 🐛 **Bug Reports**: [Open an issue](https://github.com/steph1902/finance-flow-project/issues/new?template=bug_report.md)
- 💡 **Feature Requests**: [Request a feature](https://github.com/steph1902/finance-flow-project/issues/new?template=feature_request.md)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/steph1902/finance-flow-project/discussions)
- 📧 **Security Issues**: See [SECURITY.md](./SECURITY.md) for responsible disclosure

### Repository Stats

![GitHub Stars](https://img.shields.io/github/stars/steph1902/finance-flow-project?style=social)
![GitHub Forks](https://img.shields.io/github/forks/steph1902/finance-flow-project?style=social)
![GitHub Issues](https://img.shields.io/github/issues/steph1902/finance-flow-project)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/steph1902/finance-flow-project)

---

## 🙏 Acknowledgments

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

### Community

- **Star this repo** if you find it helpful! ⭐
- **Share** with others learning full-stack development
- **Contribute** to make FinanceFlow better for everyone

---

<div align="center">

### Built with ❤️ using Next.js, TypeScript, and Google Gemini AI

[![Star on GitHub](https://img.shields.io/github/stars/steph1902/finance-flow-project?style=social)](https://github.com/steph1902/finance-flow-project)
[![Fork on GitHub](https://img.shields.io/github/forks/steph1902/finance-flow-project?style=social)](https://github.com/steph1902/finance-flow-project/fork)
[![Follow @steph1902](https://img.shields.io/github/followers/steph1902?label=Follow&style=social)](https://github.com/steph1902)

**[⬆ Back to Top](#-financeflow)**

</div>
