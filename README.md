<div align="center"><div align="center">



# 💰 FinanceFlow# 💰 FinanceFlow



**Modern AI-Powered Personal Finance Management System**### Modern Personal Finance Management System



[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

[![Prisma](https://img.shields.io/badge/Prisma-6.18-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

[🚀 Live Demo](https://finance-flow.vercel.app) · [📖 Documentation](https://github.com/steph1902/finance-flow-project/tree/main/project-guideline) · [🐛 Report Bug](https://github.com/steph1902/finance-flow-project/issues) · [✨ Request Feature](https://github.com/steph1902/finance-flow-project/issues)

A full-stack financial management application with AI-powered transaction categorization, intelligent insights, and comprehensive budget tracking.

![FinanceFlow Dashboard](./public/screenshots/dashboard.png)

[🐛 Report Bug](https://github.com/steph1902/finance-flow-project/issues) · [✨ Request Feature](https://github.com/steph1902/finance-flow-project/issues)

</div>

</div>

---

---

## 📋 Table of Contents

## 📋 Table of Contents

- [About](#about)

- [Overview](#overview)- [Features](#features)

- [Features](#features)- [Demo](#demo)

- [Tech Stack](#tech-stack)- [Tech Stack](#tech-stack)

- [Architecture](#architecture)- [Getting Started](#getting-started)

- [Getting Started](#getting-started)- [Usage](#usage)

  - [Prerequisites](#prerequisites)- [API Documentation](#api-documentation)

  - [Installation](#installation)- [Project Structure](#project-structure)

  - [Environment Variables](#environment-variables)- [Performance](#performance)

  - [Database Setup](#database-setup)- [Roadmap](#roadmap)

  - [Running Locally](#running-locally)- [Contributing](#contributing)

- [Project Structure](#project-structure)- [License](#license)

- [API Routes](#api-routes)- [Acknowledgments](#acknowledgments)

- [Development](#development)

- [Deployment](#deployment)---

- [Security](#security)

- [Performance](#performance)## 🎯 About

- [Roadmap](#roadmap)

- [Contributing](#contributing)**FinanceFlow** is a modern, full-stack personal finance management application that helps users track their income, expenses, and financial goals with beautiful data visualizations and intuitive user experience.

- [License](#license)

### Key Highlights

---

- 💡 **Problem**: Manual expense tracking is time-consuming and lacks actionable insights

## 🎯 Overview- ✅ **Solution**: Automated tracking with AI-powered categorization and visual analytics

- � **Goal**: Demonstrate modern full-stack development practices and scalable architecture

**FinanceFlow** is a production-ready personal finance management application built with Next.js 16, TypeScript, and PostgreSQL. It combines modern web technologies with Google's Gemini AI to provide intelligent financial insights, automated categorization, and comprehensive expense tracking.

---

### Key Capabilities

## ✨ Features

- **AI-Powered Analysis**: Automatic transaction categorization and personalized financial insights using Gemini AI

- **Real-time Analytics**: Interactive dashboards with spending trends, budget progress, and category breakdowns### 🤖 **AI-Powered Features** (NEW!)

- **Recurring Transactions**: Automated tracking of subscriptions, bills, and regular income- 🎯 Automatic transaction categorization with Gemini AI

- **Secure Authentication**: Email/password and Google OAuth support with NextAuth.js- 💬 Conversational AI financial assistant

- **Responsive Design**: Fully responsive UI with dark/light mode support- 📊 Personalized spending insights and recommendations

- 🧠 Smart suggestions with confidence scoring

### Use Cases- 💡 Natural language financial queries



- Personal expense tracking and budget management### 🔐 **Authentication & Security**

- Subscription and recurring bill monitoring- Email + password authentication with bcrypt hashing

- Financial trend analysis and insights- Google OAuth integration

- Multi-category budget allocation- Secure session management with NextAuth.js

- AI-assisted spending categorization- Protected API routes with middleware



---### 💰 **Transaction Management**

- ➕ Add, edit, and delete transactions

## ✨ Features- 🏷️ Categorize by type (Income/Expense) and custom categories

- 📝 Add descriptions and notes

### 🤖 AI-Powered Intelligence- 📅 Date-based filtering and search

- 📊 Pagination for large datasets

- **Smart Categorization**: Automatic transaction categorization with confidence scoring

- **AI Financial Assistant**: Conversational chatbot for financial queries and advice### � **Recurring Transactions** (NEW!)

- **Personalized Insights**: AI-generated spending analysis, trend detection, and recommendations- 📅 Automate bills, subscriptions, and regular income

- **Budget Alerts**: Intelligent warnings when approaching spending limits (90%+ usage)- 6 frequency types: Daily, Weekly, Bi-weekly, Monthly, Quarterly, Yearly

- **Spending Pattern Analysis**: Weekly, monthly, and quarterly comparisons with AI commentary- ⏸️ Pause/resume without deletion

- 📊 Monthly income/expense projections

### 🔐 Authentication & Security- 🎯 Dashboard widget for upcoming obligations

- ✅ Status tracking (Active/Paused/Due/Ended)

- **Multi-auth Support**: Email/password with bcrypt hashing + Google OAuth

- **Session Management**: Secure JWT-based sessions with NextAuth.js v4### �📊 **Analytics Dashboard**

- **Protected Routes**: Middleware-based authentication for all dashboard routes- 📈 Real-time financial overview (balance, income, expenses)

- **Environment Validation**: Fail-fast validation of required environment variables- 🥧 Interactive pie chart (spending by category)

- **Security Headers**: CSP, HSTS, X-Frame-Options, and other security headers configured- 📉 Line chart (spending trends over time)

- 📋 Recent transactions widget

### 💰 Transaction Management- 🎯 Month-over-month comparisons



- **Full CRUD Operations**: Create, read, update, and delete transactions### 💵 **Budget Management**

- **Advanced Filtering**: Filter by date range, category, type (income/expense), and search- Set monthly budgets per category

- **Pagination**: Efficient handling of large transaction datasets (10 items per page)- Visual progress tracking

- **Soft Delete**: Recoverable deletion with `deletedAt` timestamps- Color-coded alerts (Green/Yellow/Red)

- **Optimistic Updates**: Instant UI feedback using SWR's optimistic data- Budget vs. actual spending comparison

- **Data Export**: Export all user data to JSON format

### 🎨 **User Experience**

### 🔄 Recurring Transactions- 🌓 Dark/Light mode toggle

- 📱 Fully responsive (mobile, tablet, desktop)

- **6 Frequency Types**: Daily, Weekly, Bi-weekly, Monthly, Quarterly, Yearly- ⚡ Fast page loads (<2s on 3G)

- **Automatic Generation**: Background processing of upcoming transactions- ♿ Accessible (WCAG AA compliant)

- **Status Management**: Active, Paused, Due, and Ended states- 🎭 Smooth animations and transitions

- **Start/End Dates**: Configurable recurring period with optional end dates

- **Dashboard Widget**: Upcoming recurring obligations displayed prominently### 📤 **Data Management**

- **Pause/Resume**: Toggle active state without deletion- Export transactions to CSV

- Soft delete (data recovery)

### 📊 Analytics & Insights- Optimistic UI updates



- **Real-time Dashboard**: Current balance, total income, total expenses with period filters---

- **Spending by Category**: Interactive pie chart with Recharts

- **Trend Visualization**: Line chart showing daily spending patterns## 🎥 Demo

- **Budget Progress**: Visual progress bars with color-coded alerts (green/yellow/red)

- **AI Insights Panel**: Smart recommendations, alerts, and trend analysis### 🖼️ Screenshots

- **Month-over-Month**: Comparative analysis with percentage changes

<details>

### 💵 Budget Management<summary>Click to expand screenshots</summary>



- **Monthly Budgets**: Set spending limits per category per month#### Dashboard

- **Progress Tracking**: Real-time tracking of budget vs. actual spending![Dashboard](./public/screenshots/dashboard.png)

- **Visual Indicators**: Color-coded progress (0-80% green, 80-100% yellow, 100%+ red)

- **Budget Alerts**: Notifications at 90% and 100% thresholds#### Transactions

- **Historical Data**: Track budget performance across multiple months![Transactions](./public/screenshots/transactions.png)



### 🎨 User Experience#### Budget Tracking

![Budgets](./public/screenshots/budgets.png)

- **Theme Toggle**: Dark mode, light mode, and system preference support

- **Responsive Design**: Mobile-first design with tablet and desktop breakpoints#### Mobile View

- **Smooth Animations**: Framer Motion animations with performance optimization![Mobile](./public/screenshots/mobile.png)

- **Loading States**: Skeleton loaders for all async data fetching

- **Error Boundaries**: Graceful error handling with user-friendly messages</details>

- **Toast Notifications**: Contextual feedback for all user actions (Sonner)

- **Accessible**: WCAG 2.1 AA compliant with keyboard navigation### 🎬 Video Demo



---[![FinanceFlow Demo](./public/screenshots/video-thumbnail.png)](https://www.youtube.com/watch?v=your-video-id)



## 🛠️ Tech Stack*Click to watch 2-minute demo video*



### Frontend---



| Technology | Version | Purpose |## 🛠️ Tech Stack

|------------|---------|---------|

| [Next.js](https://nextjs.org/) | 16.0.1 | React framework with App Router and Turbopack |### **Frontend**

| [React](https://react.dev/) | 19.2.0 | UI library with React Compiler enabled |- **Framework**: [Next.js 16](https://nextjs.org/) (App Router with Turbopack)

| [TypeScript](https://www.typescriptlang.org/) | 5.x | Type-safe development |- **Language**: [TypeScript](https://www.typescriptlang.org/)

| [TailwindCSS](https://tailwindcss.com/) | 4.x | Utility-first CSS framework |- **Styling**: [TailwindCSS](https://tailwindcss.com/)

| [Shadcn/ui](https://ui.shadcn.com/) | Latest | Headless UI components (Radix UI primitives) |- **Components**: [Shadcn/ui](https://ui.shadcn.com/)

| [Recharts](https://recharts.org/) | 3.3.0 | Chart and visualization library |- **Charts**: [Recharts](https://recharts.org/)

| [Framer Motion](https://www.framer.com/motion/) | 12.23.24 | Animation library |- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

| [React Hook Form](https://react-hook-form.com/) | 7.66.0 | Form management with validation |- **Icons**: [Lucide React](https://lucide.dev/)

| [SWR](https://swr.vercel.app/) | 2.3.6 | Data fetching with caching and revalidation |

| [Lucide React](https://lucide.dev/) | 0.552.0 | Icon library |### **Backend**

| [Sonner](https://sonner.emilkowal.ski/) | 2.0.7 | Toast notifications |- **Runtime**: [Node.js 20](https://nodejs.org/)

| [next-themes](https://github.com/pacocoursey/next-themes) | 0.4.6 | Theme management |- **API**: Next.js API Routes (REST)

- **ORM**: [Prisma](https://www.prisma.io/)

### Backend- **Database**: [PostgreSQL 15](https://www.postgresql.org/)

- **Auth**: [NextAuth.js](https://next-auth.js.org/)

| Technology | Version | Purpose |- **Validation**: [Zod](https://zod.dev/)

|------------|---------|---------|- **AI**: [Google Gemini API](https://ai.google.dev/) (gemini-2.5-flash)

| [Node.js](https://nodejs.org/) | 20.x | JavaScript runtime |

| [Prisma](https://www.prisma.io/) | 6.18.0 | Type-safe ORM for PostgreSQL |### **DevOps & Tools**

| [PostgreSQL](https://www.postgresql.org/) | 15+ | Primary database |- **Deployment**: [Vercel](https://vercel.com/)

| [NextAuth.js](https://next-auth.js.org/) | 4.24.13 | Authentication library |- **Database Hosting**: [Supabase](https://supabase.com/)

| [Zod](https://zod.dev/) | 4.1.12 | Schema validation |- **Version Control**: Git & GitHub

| [bcrypt](https://www.npmjs.com/package/bcrypt) | 6.0.0 | Password hashing |- **Code Quality**: ESLint, Prettier

| [Google Gemini AI](https://ai.google.dev/) | 0.24.1 | AI categorization and insights |- **Testing**: Jest, React Testing Library

| [date-fns](https://date-fns.org/) | 4.1.0 | Date manipulation utilities |- **CI/CD**: GitHub Actions



### Development Tools### **Architecture**

- **Monolithic (Next.js App Router)**: Frontend and API routes co-located for simplified deployment and development experience.

| Tool | Purpose |- **Serverless Functions**: Next.js API routes deploy as serverless functions on Vercel, scaling automatically.

|------|---------|- **Edge Computing**: Leveraging Vercel's Edge Network for fast content delivery.

| ESLint | Code linting with Next.js config |

| TypeScript | Strict type checking with 7 strict flags |---

| Prisma Studio | Database GUI for development |

| ts-node | TypeScript execution for seed scripts |## 🚀 Getting Started



---### Prerequisites



## 🏗️ Architecture- Node.js 18+ installed

- npm or yarn package manager

### Application Structure- PostgreSQL database (or Supabase account)



FinanceFlow follows a **monolithic architecture** using Next.js App Router:### Installation



- **Frontend & Backend Co-located**: All code in a single Next.js application1. **Clone the repository:**

- **API Routes**: RESTful API endpoints using Next.js Route Handlers```bash

- **Server Components**: React Server Components for data fetchinggit clone https://github.com/steph1902/finance-flow-project.git

- **Client Components**: Interactive UI components with `"use client"` directivecd finance-flow-project

- **Middleware**: JWT-based authentication and rate limiting```



### Key Design Patterns2. **Install dependencies:**

```bash

1. **SWR for Data Fetching**: Client-side caching with automatic revalidationnpm install

2. **Optimistic Updates**: Instant UI feedback with rollback on error```

3. **Custom Hooks**: Reusable data fetching logic (`useTransactions`, `useBudgets`, etc.)

4. **Centralized Configuration**: Chart colors, animations, and constants in `/src/config`3. **Setup environment variables:**

5. **Error Boundaries**: Graceful error handling at layout and component levels```bash

6. **Soft Deletes**: Non-destructive deletion with `deletedAt` timestampscp .env.example .env.local

```

### Database Schema

Edit `.env.local` and add your values:

```- `DATABASE_URL`: PostgreSQL connection string

User (authentication, profile)- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`

  ↓- `NEXTAUTH_URL`: http://localhost:3000 (for development)

  ├─ Transaction (income/expense records)- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: From Google Cloud Console

  ├─ Budget (monthly spending limits)- `GOOGLE_GEMINI_API_KEY`: From Google AI Studio (for AI features)

  ├─ RecurringTransaction (automated transactions)

  ├─ AISuggestion (AI categorization suggestions)4. **Run database migrations:**

  └─ AIChatHistory (conversation history)```bash

npx prisma migrate dev

NextAuth Models:```

  ├─ Account (OAuth providers)

  ├─ Session (user sessions)5. **Seed database (optional):**

  └─ VerificationToken (email verification)```bash

```npx prisma db seed

```

---

6. **Start development server:**

## 🚀 Getting Started```bash

npm run dev

### Prerequisites```



Ensure you have the following installed:Visit [http://localhost:3000](http://localhost:3000) 🎉



- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))---

- **npm** or **yarn**: Latest version

- **PostgreSQL**: v15 or higher (local or cloud-hosted)## 💡 Usage

- **Git**: For version control

1. **Sign Up / Log In**: Create an account or use Google OAuth.

Optional but recommended:2. **Add Transactions**: Record your income and expenses with categories and descriptions.

- **Prisma CLI**: `npm install -g prisma` (for database management)3. **View Dashboard**: Get an overview of your financial health with interactive charts.

- **VS Code**: With ESLint and Prettier extensions4. **Manage Budgets**: Set and track spending limits for different categories.

5. **Export Data**: Download your transaction history as a CSV file.

### Installation

---

1. **Clone the repository**

## 📚 API Documentation

```bash

git clone https://github.com/steph1902/finance-flow-project.gitDetailed API specifications can be found in the [Functional Specification Document (FSD)](https://github.com/steph1902/finance-flow-project/tree/main/project-guideline).

cd finance-flow-project/finance-flow

```---



2. **Install dependencies**## 📁 Project Structure



```bash```

npm installfinance-tracker/

```├── app/

│   ├── (auth)/ (Authentication routes: login, signup)

This will:│   ├── (dashboard)/ (Protected routes: dashboard, transactions, budgets, settings)

- Install all project dependencies│   ├── api/ (Next.js API routes)

- Run Prisma client generation via `postinstall` script│   ├── layout.tsx (Root layout)

- Setup development environment│   └── page.tsx (Landing page)

├── components/ (Reusable UI components)

### Environment Variables│   ├── ui/ (Shadcn/ui components)

│   ├── auth/ (Auth-specific components)

3. **Create environment file**│   ├── dashboard/ (Dashboard widgets)

│   ├── transactions/ (Transaction forms, lists)

```bash│   ├── budgets/ (Budget forms, progress)

cp .env.example .env.local│   └── layout/ (Header, Sidebar)

```├── lib/ (Utility functions, Prisma client, auth helpers)

├── hooks/ (Custom React hooks for data fetching)

4. **Configure required variables in `.env.local`**├── types/ (TypeScript type definitions)

├── prisma/ (Prisma schema, migrations, seed)

```bash├── public/ (Static assets: images, screenshots)

# Database (Required)├── .env.local (Environment variables)

DATABASE_URL="postgresql://user:password@localhost:5432/financeflow?schema=public"├── .env.example (Example environment variables)

├── .eslintrc.json (ESLint configuration)

# Authentication (Required)├── .gitignore (Git ignore rules)

NEXTAUTH_URL="http://localhost:3000"├── next.config.js (Next.js configuration)

NEXTAUTH_SECRET="<generate-with-openssl-rand-base64-32>"├── package.json (Project dependencies and scripts)

├── tailwind.config.ts (TailwindCSS configuration)

# AI Services (Required)├── tsconfig.json (TypeScript configuration)

GEMINI_API_KEY="<your-gemini-api-key-from-google-ai-studio>"└── README.md (Project overview)

```

# OAuth (Optional - for Google login)

GOOGLE_CLIENT_ID="<your-google-oauth-client-id>"---

GOOGLE_CLIENT_SECRET="<your-google-oauth-client-secret>"

## ⚡ Performance

# Runtime

NODE_ENV="development"- **Lighthouse Score**: Aiming for 90+ on Performance, Accessibility, Best Practices, and SEO.

```- **Load Time**: <2 seconds on a 3G connection.

- **Bundle Size**: Optimized for minimal JavaScript and CSS delivery.

#### Getting API Keys- **Optimistic UI**: Instant feedback for user actions.



**NEXTAUTH_SECRET**: Generate a secure random string---

```bash

openssl rand -base64 32## 🗺️ Roadmap

```

### **Phase 1: Backend Foundation** ✅

**GEMINI_API_KEY**: Get from [Google AI Studio](https://aistudio.google.com/app/apikey)- User Authentication (Email/Password, Google OAuth)

1. Visit Google AI Studio- Transaction CRUD (Create, Read, Update, Delete)

2. Create new project or select existing- Budget Management (Monthly budgets per category)

3. Generate API key- Database Schema & Migrations

4. Copy and paste into `.env.local`- API Routes with Authentication



**Google OAuth** (Optional): Get from [Google Cloud Console](https://console.cloud.google.com/)### **Phase 2A: Dashboard & UI** ✅

1. Create new project- Analytics Dashboard (Charts, Stats)

2. Enable Google+ API- Responsive Design & Dark Mode

3. Configure OAuth consent screen- Transaction Filters & Search

4. Create OAuth 2.0 credentials (Web application)- Budget Progress Tracking

5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`- Optimistic UI Updates

6. Copy Client ID and Client Secret

### **Phase 2B: AI Integration** ✅ (COMPLETED)

⚠️ **Security Note**: Never commit `.env.local` to version control. The `.gitignore` file is pre-configured to exclude it.- **AI Auto-Categorization**: Gemini-powered transaction categorization

- **Category Suggestions**: Accept/reject AI suggestions with confidence scores

### Database Setup- **AI Chat Assistant**: Conversational interface for financial questions

- **Financial Context**: AI responses based on actual transaction/budget data

5. **Start your PostgreSQL database**- **Conversation Persistence**: Chat history stored in database

- **Natural Language Queries**: "How much did I spend on dining?" support

If using local PostgreSQL:

```bash### **Phase 3: Insights & Analytics** ✅ (COMPLETED)

# macOS (Homebrew)- **AI-Powered Insights Dashboard**: Smart spending analysis on main dashboard

brew services start postgresql- **Budget Alerts**: Automatic warnings at 90%+ usage (critical at 100%+)

- **Spending Trend Analysis**: Week/Month/Quarter comparisons with percentage changes

# Linux (systemd)- **Category Deep-Dive**: Identify top spending categories with recommendations

sudo systemctl start postgresql- **Personalized Recommendations**: AI-generated savings tips and advice

- **Achievement Tracking**: Celebrate spending reductions and milestones

# Windows

# Start via Services or PostgreSQL installer**Documentation:**

```- [Phase 1 Complete](./PHASE1_COMPLETE.md) - Backend foundation

- [Phase 2A Complete](./PHASE2A_COMPLETE.md) - UI integration (252 lines)

Or use a cloud provider:- [Phase 2B Complete](./PHASE2B_COMPLETE.md) - Chat assistant (481 lines)

- [Supabase](https://supabase.com/) (Recommended - free tier includes PostgreSQL)- [Phase 3 Complete](./PHASE3_COMPLETE.md) - Insights dashboard (420 lines)

- [Railway](https://railway.app/)- [AI Testing Report](./AI_TESTING_REPORT.md) - Validation results

- [Neon](https://neon.tech/)

- [Vercel Postgres](https://vercel.com/storage/postgres)### **Phase 4: Advanced Features** (Planned)

- Recurring Transactions

6. **Run database migrations**- Multi-currency Support

- Data Export (CSV, PDF, Excel)

```bash- Bank Account Integration (Plaid API)

npx prisma migrate dev- Investment Tracking

```- Mobile Apps (React Native)



This will:---

- Create the database if it doesn't exist

- Run all migrations to create tables## 🤝 Contributing

- Generate Prisma Client

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/steph1902/finance-flow-project/issues).

7. **Seed the database** (Optional)

### How to Contribute

```bash

npm run seed1. Fork the repository

```2. Create a feature branch (`git checkout -b feature/AmazingFeature`)

3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)

This creates:4. Push to the branch (`git push origin feature/AmazingFeature`)

- Demo user account (`demo@financeflow.com` / `demo123`)5. Open a Pull Request

- Sample transactions across multiple categories

- Sample budgets for current month---

- Sample recurring transactions

- AI chat history examples## 📄 License



⚠️ **Note**: The seed script uses `prisma/seed-demo.ts` as configured in `package.json`Distributed under the MIT License. See `LICENSE` for more information.



### Running Locally---



8. **Start the development server**##  Acknowledgments



```bash- [Next.js Documentation](https://nextjs.org/docs)

npm run dev- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

```- [Shadcn/ui](https://ui.shadcn.com/)

- [NextAuth.js Documentation](https://next-auth.js.org/)

The application will be available at:- [Prisma Documentation](https://www.prisma.io/docs)

- **Frontend**: [http://localhost:3000](http://localhost:3000)- [Supabase Documentation](https://supabase.com/docs)

- **API Routes**: [http://localhost:3000/api/*](http://localhost:3000/api/)- [Recharts Documentation](https://recharts.org/en-US/api)

9. **Access the application**

- Visit [http://localhost:3000](http://localhost:3000)
- Click **"Sign Up"** to create an account
- Or login with demo account: `demo@financeflow.com` / `demo123`

### Verify Installation

Check that everything is working:

```bash
# Test database connection
npx prisma studio
# Opens Prisma Studio at http://localhost:5555

# Check environment variables
npm run dev
# Should start without errors about missing env vars

# Run linter
npm run lint
```

---

## 📁 Project Structure

```
finance-flow/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes (grouped)
│   │   ├── login/                # Login page
│   │   └── signup/               # Signup page
│   ├── (dashboard)/              # Protected dashboard routes (grouped)
│   │   ├── dashboard/            # Main dashboard
│   │   ├── transactions/         # Transaction management
│   │   ├── budgets/              # Budget management
│   │   ├── recurring/            # Recurring transactions
│   │   ├── ai-assistant/         # AI chat interface
│   │   ├── settings/             # User settings
│   │   └── layout.tsx            # Dashboard layout with sidebar
│   ├── api/                      # API Route Handlers
│   │   ├── auth/                 # NextAuth endpoints
│   │   ├── transactions/         # Transaction CRUD
│   │   ├── budgets/              # Budget CRUD
│   │   ├── recurring-transactions/ # Recurring CRUD
│   │   ├── dashboard/            # Dashboard stats
│   │   ├── ai/                   # AI endpoints (chat, categorize, insights)
│   │   ├── export/               # Data export
│   │   └── account/              # Account management
│   ├── layout.tsx                # Root layout with providers
│   └── page.tsx                  # Landing page
│
├── src/                          # Source code
│   ├── components/               # React components
│   │   ├── ui/                   # Shadcn/ui components (Button, Card, etc.)
│   │   ├── auth/                 # Login/Signup forms, AuthProvider
│   │   ├── dashboard/            # Dashboard widgets and charts
│   │   ├── transactions/         # Transaction forms and tables
│   │   ├── budgets/              # Budget forms and lists
│   │   ├── recurring/            # Recurring transaction components
│   │   ├── ai/                   # AI chat and insights components
│   │   ├── layout/               # Header, Sidebar, ThemeToggle
│   │   └── errors/               # Error boundaries and fallbacks
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useTransactions.ts    # Transaction data fetching with SWR
│   │   ├── useBudgets.ts         # Budget data fetching
│   │   ├── useDashboard.ts       # Dashboard stats
│   │   ├── useRecurringTransactions.ts # Recurring data
│   │   └── useAICategorization.ts # AI categorization
│   │
│   ├── lib/                      # Utility libraries
│   │   ├── api-client.ts         # Centralized API fetch with timeout
│   │   ├── auth.ts               # NextAuth configuration
│   │   ├── auth-helpers.ts       # JWT utilities
│   │   ├── prisma.ts             # Prisma client singleton
│   │   ├── env.ts                # Environment variable validation
│   │   ├── logger.ts             # Structured logging
│   │   ├── rate-limiter.ts       # Rate limiting utilities
│   │   ├── formatters.ts         # Currency/date formatters
│   │   ├── utils.ts              # General utilities (cn, etc.)
│   │   ├── validations.ts        # Zod validation schemas
│   │   └── ai/                   # AI service modules
│   │       ├── gemini-client.ts  # Gemini API client
│   │       ├── categorization-service.ts # Transaction categorization
│   │       ├── chat-service.ts   # Chat assistant
│   │       ├── insights-service.ts # Insights generation
│   │       └── config.ts         # AI configuration
│   │
│   ├── config/                   # Configuration files
│   │   ├── animations.ts         # Framer Motion animation constants
│   │   ├── charts.ts             # Chart colors and dimensions
│   │   └── navigation.ts         # Navigation menu structure
│   │
│   ├── constants/                # Application constants
│   │   └── categories.ts         # Transaction categories
│   │
│   └── types/                    # TypeScript type definitions
│       └── index.ts              # Shared types (Transaction, Budget, etc.)
│
├── prisma/                       # Database
│   ├── schema.prisma             # Prisma schema definition
│   ├── migrations/               # Database migrations
│   ├── seed.ts                   # Production seed (basic setup)
│   └── seed-demo.ts              # Demo data seed (development)
│
├── public/                       # Static assets
│   ├── favicon.ico
│   └── ...
│
├── .env.example                  # Environment variable template
├── .env.local                    # Local environment (gitignored)
├── .gitignore                    # Git ignore rules
├── components.json               # Shadcn/ui configuration
├── eslint.config.mjs             # ESLint configuration
├── jest.config.js                # Jest test configuration
├── jest.setup.js                 # Jest setup file
├── middleware.ts                 # Next.js middleware (auth)
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies and scripts
├── postcss.config.mjs            # PostCSS configuration
├── prisma.config.ts              # Prisma configuration
├── tailwind.config.ts            # TailwindCSS configuration
├── tsconfig.json                 # TypeScript configuration (strict mode)
├── LICENSE                       # MIT License
└── README.md                     # This file
```

---

## 🔌 API Routes

All API routes are located in `app/api/` and follow RESTful conventions.

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create new user account |
| POST | `/api/auth/signin` | Login with credentials |
| POST | `/api/auth/signout` | Logout current user |
| GET | `/api/auth/session` | Get current session |

### Transactions

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/transactions` | List transactions with filters | ✅ |
| POST | `/api/transactions` | Create new transaction | ✅ |
| PATCH | `/api/transactions/:id` | Update transaction | ✅ |
| DELETE | `/api/transactions/:id` | Delete transaction (soft) | ✅ |

**Query Parameters**:
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `type` (INCOME | EXPENSE | ALL): Filter by type
- `category` (string): Filter by category
- `startDate` (ISO string): Filter from date
- `endDate` (ISO string): Filter to date
- `search` (string): Search description
- `sort` (date | amount): Sort field
- `order` (asc | desc): Sort direction

### Budgets

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/budgets` | List budgets for period | ✅ |
| POST | `/api/budgets` | Create new budget | ✅ |
| PATCH | `/api/budgets/:id` | Update budget | ✅ |
| DELETE | `/api/budgets/:id` | Delete budget | ✅ |

**Query Parameters**:
- `month` (1-12): Month filter
- `year` (number): Year filter

### Recurring Transactions

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/recurring-transactions` | List recurring transactions | ✅ |
| POST | `/api/recurring-transactions` | Create recurring transaction | ✅ |
| PATCH | `/api/recurring-transactions/:id` | Update recurring transaction | ✅ |
| DELETE | `/api/recurring-transactions/:id` | Delete recurring transaction | ✅ |

### AI Services

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/ai/categorize` | AI categorize transaction | ✅ |
| POST | `/api/ai/chat` | Chat with AI assistant | ✅ |
| GET | `/api/ai/insights` | Get AI financial insights | ✅ |
| POST | `/api/ai/feedback` | Submit AI suggestion feedback | ✅ |

### Dashboard

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/dashboard/stats` | Get dashboard statistics | ✅ |

**Query Parameters**:
- `startDate` (ISO string): Period start
- `endDate` (ISO string): Period end

### Data Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/export/data` | Export all user data (JSON) | ✅ |
| DELETE | `/api/account/delete` | Delete user account | ✅ |

### Response Format

All API routes return JSON responses:

**Success Response**:
```json
{
  "data": { /* ... response data ... */ },
  "message": "Success message" // optional
}
```

**Error Response**:
```json
{
  "error": "Error message",
  "details": { /* ... error details ... */ } // optional
}
```

**Paginated Response**:
```json
{
  "data": [ /* ... array of items ... */ ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "totalPages": 15
  }
}
```

---

## 💻 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server (Turbopack)
npm run build        # Build for production
npm run start        # Start production server

# Database
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma migrate dev # Create and apply new migration
npx prisma migrate reset # Reset database (careful!)
npx prisma generate  # Generate Prisma Client
npm run seed         # Seed database with demo data

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues (if fixable)

# Other
npx prisma format    # Format schema.prisma
```

### TypeScript Configuration

FinanceFlow uses **strict TypeScript** with the following compiler flags enabled:

```json
{
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noImplicitReturns": true,
  "noFallthroughCasesInSwitch": true,
  "noUncheckedIndexedAccess": true,
  "forceConsistentCasingInFileNames": true,
  "exactOptionalPropertyTypes": true
}
```

This ensures maximum type safety and catches potential bugs at compile time.

### Adding New Features

1. **Create database schema changes** in `prisma/schema.prisma`
2. **Generate migration**: `npx prisma migrate dev --name feature-name`
3. **Add API route** in `app/api/feature/route.ts`
4. **Create custom hook** in `src/hooks/useFeature.ts` (if needed)
5. **Build UI components** in `src/components/feature/`
6. **Add page** in `app/(dashboard)/feature/page.tsx`
7. **Update navigation** in `src/config/navigation.ts`

### Code Style

- **Components**: PascalCase (e.g., `TransactionTable.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useTransactions.ts`)
- **Utilities**: camelCase (e.g., `formatCurrency.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `CHART_COLORS`)
- **Types**: PascalCase (e.g., `Transaction`, `BudgetFilters`)

### Performance Best Practices

- Use React Server Components by default (no `"use client"`)
- Add `"use client"` only when needed (hooks, events, browser APIs)
- Memoize expensive components with `React.memo`
- Use SWR for client-side data fetching with automatic caching
- Optimize images with Next.js `<Image>` component
- Implement optimistic updates for instant feedback
- Use Framer Motion animations sparingly (cap delays at 0.3s)

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

FinanceFlow is optimized for [Vercel](https://vercel.com/) deployment:

1. **Push code to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   - In Vercel project settings → Environment Variables
   - Add all variables from `.env.example`:
     - `DATABASE_URL` (use Vercel Postgres or external provider)
     - `NEXTAUTH_SECRET`
     - `NEXTAUTH_URL` (your-domain.vercel.app)
     - `GEMINI_API_KEY`
     - `GOOGLE_CLIENT_ID` (optional)
     - `GOOGLE_CLIENT_SECRET` (optional)

4. **Setup Database**
   - Option A: Use Vercel Postgres (recommended)
     - Enable Postgres storage in Vercel project
     - `DATABASE_URL` auto-populated
   - Option B: Use external provider (Supabase, Railway, etc.)
     - Copy connection string to `DATABASE_URL`

5. **Run Migrations**
   ```bash
   # After first deployment, run migrations
   npx prisma migrate deploy
   ```

6. **Deploy**
   - Vercel automatically deploys on git push
   - View deployment logs in Vercel dashboard

### Deploy to Other Platforms

**Railway**:
- Connect GitHub repository
- Add PostgreSQL service
- Set environment variables
- Deploy

**Render**:
- Create Web Service from GitHub
- Add PostgreSQL database
- Set environment variables
- Build command: `npm run build`
- Start command: `npm start`

**Docker** (Self-hosted):
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Post-Deployment

1. **Verify environment variables** are set correctly
2. **Run database migrations**: `npx prisma migrate deploy`
3. **Test authentication** (login/signup)
4. **Test AI features** (ensure Gemini API key works)
5. **Monitor logs** for errors
6. **Set up monitoring** (Sentry, LogRocket, etc.)

---

## 🔒 Security

FinanceFlow implements multiple security measures:

### Authentication
- **Password Hashing**: bcrypt with salt rounds
- **JWT Sessions**: Secure token-based authentication
- **OAuth Support**: Google OAuth 2.0 integration
- **Session Expiry**: Automatic logout after inactivity
- **Protected Routes**: Middleware authentication for all dashboard routes

### API Security
- **Request Validation**: Zod schema validation on all inputs
- **SQL Injection Protection**: Prisma parameterized queries
- **Rate Limiting**: Basic rate limiting on API routes
- **CORS**: Configured for same-origin requests
- **Timeouts**: 30-second timeout on all API requests

### Headers
```typescript
// Configured in next.config.ts
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=63072000
Content-Security-Policy: (configured)
Referrer-Policy: strict-origin-when-cross-origin
```

### Environment Variables
- **Validation**: Required env vars validated at startup
- **Fail-Fast**: App won't start with missing critical vars
- **No Fallbacks**: No hardcoded secrets or weak defaults

### Data Protection
- **Soft Deletes**: Recoverable deletion of transactions
- **Account Deletion**: Cascade delete all user data
- **Data Export**: Users can export all their data
- **Encryption**: PostgreSQL connection with SSL (production)

### Reporting Security Issues

If you discover a security vulnerability, please email security@financeflow.app or create a private security advisory on GitHub.

---

## ⚡ Performance

### Metrics

- **Time to First Byte (TTFB)**: < 200ms
- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.5s
- **Total Blocking Time (TBT)**: < 300ms

### Optimizations

- **React Compiler**: Enabled for automatic memoization
- **Turbopack**: Faster development builds
- **SWR Caching**: Client-side data caching with stale-while-revalidate
- **Optimistic Updates**: Instant UI feedback before server confirmation
- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js Image component with lazy loading
- **Font Optimization**: Next.js font optimization
- **Animation Throttling**: Stagger delays capped at 0.3s max
- **Pagination**: All lists paginated (10 items per page)

### Bundle Size

- **JavaScript**: ~250KB (gzipped)
- **CSS**: ~15KB (gzipped)
- **First Load JS**: ~80KB (per page)

---

## 🗺️ Roadmap

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

### 🚧 In Progress

**Phase 5: Enhanced UX** (Current)
- ⏳ Advanced filtering and sorting
- ⏳ Bulk operations (select multiple transactions)
- ⏳ Keyboard shortcuts
- ⏳ Mobile app (React Native)

### 📋 Planned

**Phase 6: Advanced Features**
- 📅 Multi-currency support
- 📅 Bank account integration (Plaid API)
- 📅 Investment tracking
- 📅 Bill reminders and notifications
- 📅 Shared budgets (family accounts)
- 📅 Custom categories

**Phase 7: Analytics & Reporting**
- 📅 Custom date range reports
- 📅 Export to PDF/Excel
- 📅 Financial goal setting
- 📅 Net worth tracking
- 📅 Tax preparation helpers

**Phase 8: Mobile & Desktop**
- 📅 Progressive Web App (PWA)
- 📅 iOS/Android apps
- 📅 Desktop app (Electron)
- 📅 Offline support

---

## 🤝 Contributing

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
   - Describe your changes clearly
   - Reference related issues
   - Wait for review

### Development Guidelines

- Write clean, readable code
- Follow TypeScript strict mode requirements
- Add JSDoc comments for complex functions
- Use semantic commit messages
- Keep PRs focused (one feature/fix per PR)
- Update tests if modifying functionality
- Run linter before committing: `npm run lint`

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the issue, not the person
- Help maintain a welcoming community

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

## 🙏 Acknowledgments

### Technologies & Libraries

- **[Next.js Team](https://nextjs.org/)** - React framework with excellent DX
- **[Vercel](https://vercel.com/)** - Deployment platform and infrastructure
- **[Prisma](https://www.prisma.io/)** - Modern database toolkit
- **[Shadcn](https://ui.shadcn.com/)** - Beautiful, accessible UI components
- **[NextAuth.js](https://next-auth.js.org/)** - Authentication for Next.js
- **[Recharts](https://recharts.org/)** - React chart library
- **[Google Gemini AI](https://ai.google.dev/)** - AI categorization and insights
- **[Tailwind Labs](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible UI primitives
- **[Lucide](https://lucide.dev/)** - Beautiful icon library

### Inspiration

This project was built as a learning exercise to demonstrate:
- Modern full-stack development with Next.js 16
- Type-safe development with TypeScript
- AI integration with Google Gemini
- Database design and ORM usage with Prisma
- Authentication and security best practices
- Responsive UI/UX design
- Production-ready code quality

---

<div align="center">

**Built with ❤️ using Next.js, TypeScript, and Google Gemini AI**

[⭐ Star this repo](https://github.com/steph1902/finance-flow-project) · [🐛 Report Issues](https://github.com/steph1902/finance-flow-project/issues) · [📖 Documentation](https://github.com/steph1902/finance-flow-project)

</div>
