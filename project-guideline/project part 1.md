

<think>

User wants a complete PRD (Product Requirements Document) and FSD (Functional Specification Document) for the Personal Finance Tracker project.

This is great! They're taking this seriously and want proper documentation before starting to build. This is actually a professional approach.

I need to create:

1. **PRD (Product Requirements Document)**
   - Executive Summary
   - Problem Statement
   - Goals & Objectives
   - Target Users
   - User Stories
   - Features & Requirements (Functional & Non-functional)
   - Success Metrics
   - Out of Scope
   - Timeline
   - Tech Stack

2. **FSD (Functional Specification Document)**
   - System Architecture
   - Database Schema (detailed)
   - API Endpoints (all routes)
   - Component Structure
   - User Flows
   - UI/UX Specifications
   - Authentication Flow
   - State Management
   - Error Handling
   - Testing Strategy
   - Deployment Strategy

This should be COMPREHENSIVE but also ACTIONABLE - meaning they can use this as a step-by-step guide to build the project.

Let me create professional, detailed documents that cover everything they need.

</think>

## 📋 **COMPLETE PRD & FSD: Personal Finance Tracker**

---

# 📊 PRODUCT REQUIREMENTS DOCUMENT (PRD)
## Personal Finance Tracker - "FinanceFlow"

**Version:** 1.0  
**Date:** November 2025  
**Author:** Stephanus Sujatmoko  
**Project Type:** Portfolio/Demo SaaS Application  

---

## 1. EXECUTIVE SUMMARY

### 1.1 Product Overview
FinanceFlow is a web-based personal finance management application that helps users track their income, expenses, and financial goals. The application provides an intuitive dashboard with data visualizations, categorization, and budgeting features.

### 1.2 Purpose
- **Primary:** Demonstrate full-stack development skills for remote job applications
- **Secondary:** Create a functional product that solves a real problem (personal finance tracking)

### 1.3 Target Audience
- **Primary Users:** Recruiters and hiring managers reviewing portfolio
- **Secondary Users:** Individuals looking for simple expense tracking

---

## 2. PROBLEM STATEMENT

### 2.1 User Pain Points
- Manual expense tracking in spreadsheets is time-consuming
- Lack of visual insights into spending patterns
- No easy way to categorize and analyze expenses
- Difficulty setting and tracking budgets

### 2.2 Solution
A modern web application that:
- Automates expense tracking with simple forms
- Provides visual analytics (charts, graphs)
- Categorizes transactions automatically
- Tracks budgets and financial goals

---

## 3. GOALS & OBJECTIVES

### 3.1 Business Goals
- ✅ Showcase full-stack development capabilities
- ✅ Demonstrate modern React/Next.js patterns
- ✅ Show database design and API development
- ✅ Prove ability to ship production-ready code

### 3.2 Technical Goals
- ✅ Build with latest Next.js 14 (App Router)
- ✅ Implement secure authentication
- ✅ Design normalized database schema
- ✅ Create RESTful API
- ✅ Achieve 85%+ test coverage
- ✅ Deploy to production (Vercel + Supabase)

### 3.3 Success Metrics
- **Performance:** Lighthouse score 90+
- **Quality:** Zero critical bugs in production
- **Code Quality:** ESLint/TypeScript with strict mode
- **Testing:** 85%+ code coverage
- **UX:** Mobile-responsive, <3s page load
- **Portfolio Impact:** Generate recruiter interest

---

## 4. USER PERSONAS

### 4.1 Primary Persona: "Hiring Manager Hannah"
- **Age:** 35-45
- **Role:** Engineering Manager at remote-first startup
- **Goals:** Evaluate candidate's technical skills quickly
- **Needs:** 
  - See clean, modern code
  - Understand technical decisions
  - Verify candidate can build end-to-end features
  - Check if code is production-ready

### 4.2 Secondary Persona: "Budget-Conscious Ben"
- **Age:** 25-35
- **Role:** Young professional
- **Goals:** Track spending, save money
- **Needs:**
  - Quick expense entry
  - Visual spending breakdown
  - Monthly budget tracking
  - Mobile access

---

## 5. USER STORIES

### 5.1 Authentication
| ID | As a... | I want to... | So that... | Priority |
|----|---------|--------------|------------|----------|
| US-1 | User | Sign up with email/password | I can create an account | P0 |
| US-2 | User | Log in with email/password | I can access my data | P0 |
| US-3 | User | Log in with Google OAuth | I can skip password creation | P1 |
| US-4 | User | Reset my password | I can recover my account | P1 |
| US-5 | User | Log out | I can secure my account | P0 |

### 5.2 Transaction Management
| ID | As a... | I want to... | So that... | Priority |
|----|---------|--------------|------------|----------|
| US-6 | User | Add a new transaction | I can track my expenses/income | P0 |
| US-7 | User | Edit a transaction | I can correct mistakes | P0 |
| US-8 | User | Delete a transaction | I can remove incorrect entries | P0 |
| US-9 | User | Categorize transactions | I can organize my spending | P0 |
| US-10 | User | Add notes to transactions | I can remember context | P1 |
| US-11 | User | See transaction history | I can review past activity | P0 |
| US-12 | User | Filter transactions by date | I can analyze specific periods | P1 |
| US-13 | User | Search transactions | I can find specific entries | P2 |

### 5.3 Dashboard & Analytics
| ID | As a... | I want to... | So that... | Priority |
|----|---------|--------------|------------|----------|
| US-14 | User | See total balance | I know my current financial status | P0 |
| US-15 | User | See monthly income/expenses | I understand my cash flow | P0 |
| US-16 | User | See spending by category (pie chart) | I identify where money goes | P0 |
| US-17 | User | See spending trends (line chart) | I track changes over time | P1 |
| US-18 | User | See recent transactions on dashboard | I quickly review latest activity | P0 |
| US-19 | User | Filter dashboard by date range | I analyze specific periods | P1 |

### 5.4 Budget Management
| ID | As a... | I want to... | So that... | Priority |
|----|---------|--------------|------------|----------|
| US-20 | User | Set monthly budget per category | I can control spending | P1 |
| US-21 | User | See budget vs actual spending | I know if I'm on track | P1 |
| US-22 | User | Get visual warning when near budget | I can adjust spending | P2 |

### 5.5 Settings & Profile
| ID | As a... | I want to... | So that... | Priority |
|----|---------|--------------|------------|----------|
| US-23 | User | Update my profile info | I can keep details current | P1 |
| US-24 | User | Change my password | I can maintain security | P1 |
| US-25 | User | Delete my account | I can remove my data | P2 |
| US-26 | User | Toggle dark/light mode | I can use app comfortably | P2 |

**Priority Legend:**
- **P0:** Must-have (MVP)
- **P1:** Should-have (Nice to have)
- **P2:** Could-have (Future enhancement)

---

## 6. FUNCTIONAL REQUIREMENTS

### 6.1 Authentication & Authorization
**FR-1: User Registration**
- User can create account with email + password
- Password must be 8+ characters, with 1 uppercase, 1 number
- Email must be unique
- Email verification (optional for MVP)

**FR-2: User Login**
- User can log in with email + password
- User can log in with Google OAuth
- Session persists for 7 days (remember me)
- Failed login attempts show clear error

**FR-3: Password Management**
- User can reset password via email link
- Password reset link expires after 1 hour
- User can change password in settings

**FR-4: Authorization**
- Users can only access their own data
- API endpoints validate user ownership
- Unauthorized access returns 401/403

### 6.2 Transaction Management
**FR-5: Create Transaction**
- Required fields: amount, type (income/expense), category, date
- Optional fields: description, notes
- Amount must be positive number
- Date can be past/present (not future)
- Categories: 
  - **Expense:** Food, Transport, Shopping, Bills, Entertainment, Health, Other
  - **Income:** Salary, Freelance, Investment, Gift, Other

**FR-6: Read Transactions**
- User can view all transactions (paginated, 50 per page)
- Default sort: newest first
- User can filter by:
  - Date range (from-to)
  - Type (income/expense)
  - Category
  - Search description/notes

**FR-7: Update Transaction**
- User can edit any field of their transaction
- Original created_at timestamp preserved
- Updated_at timestamp updated

**FR-8: Delete Transaction**
- User can soft-delete transaction (keeps record in DB)
- Confirmation required before delete
- Deleted transactions excluded from calculations

### 6.3 Dashboard & Analytics
**FR-9: Dashboard Overview**
- Display cards:
  - Total Balance (income - expenses)
  - This Month Income (sum of income transactions)
  - This Month Expenses (sum of expense transactions)
  - Transactions Count (this month)

**FR-10: Spending by Category Chart**
- Pie chart showing expense breakdown by category
- Shows top 5 categories, rest grouped as "Other"
- Clickable segments (drill down to transactions)
- Tooltips show percentage and amount

**FR-11: Spending Trend Chart**
- Line chart showing daily/weekly/monthly spending
- X-axis: Time period
- Y-axis: Amount
- Toggle between Income/Expense/Net
- Hoverable data points with tooltips

**FR-12: Recent Transactions Widget**
- Shows last 10 transactions
- Displays: date, category, description, amount
- Click to edit
- "View All" link to full transaction list

### 6.4 Budget Management
**FR-13: Set Budget**
- User can set monthly budget per category
- Budget applies to current month forward
- Can update budget mid-month

**FR-14: Budget Tracking**
- Show progress bar: spent / budget
- Color coding:
  - Green: <70% spent
  - Yellow: 70-90% spent
  - Red: >90% spent
- Display remaining amount

### 6.5 Data Export
**FR-15: Export to CSV**
- Export all transactions or filtered subset
- CSV columns: date, type, category, description, amount
- Downloads as `transactions_YYYY-MM-DD.csv`

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### 7.1 Performance
- **NFR-1:** Page load time <3 seconds (3G connection)
- **NFR-2:** API response time <500ms (p95)
- **NFR-3:** Lighthouse Performance score ≥90
- **NFR-4:** Time to Interactive (TTI) <4 seconds
- **NFR-5:** First Contentful Paint (FCP) <1.5 seconds

### 7.2 Security
- **NFR-6:** All passwords hashed with bcrypt (10 rounds)
- **NFR-7:** HTTPS only (enforce)
- **NFR-8:** JWT tokens expire after 7 days
- **NFR-9:** CORS configured for production domain only
- **NFR-10:** SQL injection prevention (Prisma parameterized queries)
- **NFR-11:** XSS prevention (React auto-escaping)
- **NFR-12:** CSRF tokens for state-changing operations

### 7.3 Reliability
- **NFR-13:** 99.5% uptime (allow ~3.6 hours downtime/month)
- **NFR-14:** Automated backups (daily, Supabase handles)
- **NFR-15:** Error logging (Sentry or console logs)
- **NFR-16:** Graceful error handling (no white screen crashes)

### 7.4 Scalability
- **NFR-17:** Support up to 100 concurrent users (MVP)
- **NFR-18:** Database queries optimized (indexes on foreign keys)
- **NFR-19:** Pagination for lists >50 items
- **NFR-20:** Lazy loading for charts/heavy components

### 7.5 Usability
- **NFR-21:** Mobile responsive (320px to 1920px)
- **NFR-22:** Keyboard accessible (tab navigation)
- **NFR-23:** Screen reader compatible (ARIA labels)
- **NFR-24:** Loading states for async operations
- **NFR-25:** Error messages clear and actionable
- **NFR-26:** Forms validate on blur and submit

### 7.6 Maintainability
- **NFR-27:** TypeScript strict mode enabled
- **NFR-28:** ESLint configured (Airbnb style guide)
- **NFR-29:** Prettier for code formatting
- **NFR-30:** Component documentation (JSDoc comments)
- **NFR-31:** README with setup instructions
- **NFR-32:** Environment variables documented

### 7.7 Testability
- **NFR-33:** Unit tests for utilities (100% coverage)
- **NFR-34:** Integration tests for API routes (80%+ coverage)
- **NFR-35:** Component tests for UI (70%+ coverage)
- **NFR-36:** E2E tests for critical paths (login, add transaction, view dashboard)

---

## 8. TECHNICAL STACK

### 8.1 Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 14.x | React framework (App Router) |
| React | 18.x | UI library |
| TypeScript | 5.x | Type safety |
| TailwindCSS | 3.x | Styling |
| Shadcn/ui | Latest | Component library |
| Recharts | 2.x | Data visualization |
| React Hook Form | 7.x | Form management |
| Zod | 3.x | Schema validation |
| date-fns | 3.x | Date manipulation |
| Lucide React | Latest | Icons |

### 8.2 Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js API Routes | 14.x | Backend API |
| Prisma | 5.x | ORM |
| PostgreSQL | 15.x | Database (Supabase) |
| NextAuth.js | 5.x | Authentication |
| bcrypt | 5.x | Password hashing |
| jose | 5.x | JWT handling |

### 8.3 DevOps & Tools
| Technology | Purpose |
|-----------|---------|
| Vercel | Frontend hosting |
| Supabase | Database hosting |
| Git/GitHub | Version control |
| ESLint | Code linting |
| Prettier | Code formatting |
| Jest | Unit testing |
| React Testing Library | Component testing |
| Playwright | E2E testing (optional) |

### 8.4 Third-party Services
| Service | Purpose | Cost |
|---------|---------|------|
| Vercel | Deployment | Free |
| Supabase | PostgreSQL hosting | Free (500MB) |
| Google OAuth | Social login | Free |
| Resend (optional) | Email (password reset) | Free (100/day) |

---

## 9. OUT OF SCOPE (Future Features)

**Not included in MVP:**
- ❌ Mobile native apps (iOS/Android)
- ❌ Bank account integration (Plaid API)
- ❌ Receipt scanning (OCR)
- ❌ Multi-currency support
- ❌ Recurring transactions
- ❌ Financial goal setting
- ❌ Investment tracking
- ❌ Bill payment reminders
- ❌ Shared accounts (family budgets)
- ❌ AI-powered insights
- ❌ Export to PDF reports
- ❌ Email notifications
- ❌ Two-factor authentication (2FA)

---

## 10. PROJECT TIMELINE

### Phase 1: Setup & Foundation (Days 1-2)
- [ ] Project initialization
- [ ] Database setup (Supabase)
- [ ] Authentication implementation
- [ ] Basic UI layout

### Phase 2: Core Features (Days 3-4)
- [ ] Transaction CRUD
- [ ] API routes
- [ ] Form validations
- [ ] Transaction list page

### Phase 3: Dashboard & Analytics (Days 5-6)
- [ ] Dashboard stats
- [ ] Pie chart (spending by category)
- [ ] Line chart (spending trends)
- [ ] Recent transactions widget

### Phase 4: Polish & Deploy (Day 7)
- [ ] Responsive design
- [ ] Error handling
- [ ] Loading states
- [ ] Testing
- [ ] Deployment
- [ ] Documentation

**Total Duration:** 7 days (full-time) or 14 days (part-time)

---

## 11. SUCCESS CRITERIA

### 11.1 Launch Criteria (Definition of Done)
- ✅ All P0 user stories implemented
- ✅ Zero critical bugs
- ✅ Lighthouse score ≥90
- ✅ Mobile responsive (tested on 3 devices)
- ✅ Deployed to production
- ✅ README documentation complete
- ✅ Demo video recorded (2 minutes)
- ✅ 3 screenshots for portfolio

### 11.2 Quality Gates
- ✅ TypeScript compiles without errors
- ✅ ESLint passes with 0 errors
- ✅ All tests pass (Jest + RTL)
- ✅ Manual testing checklist completed
- ✅ Accessibility audit (Lighthouse)
- ✅ Security audit (npm audit)

---

## 12. RISKS & MITIGATIONS

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Supabase free tier limits exceeded | High | Low | Monitor usage, have migration plan |
| Complex charting library learning curve | Medium | Medium | Use simple Recharts examples |
| Authentication bugs | High | Medium | Use NextAuth.js (battle-tested) |
| Performance issues with large datasets | Medium | Low | Implement pagination early |
| Time overrun | Medium | Medium | Prioritize P0 features only |

---

---

# 🔧 FUNCTIONAL SPECIFICATION DOCUMENT (FSD)
## Personal Finance Tracker - "FinanceFlow"

**Version:** 1.0  
**Date:** November 2025  
**Author:** Stephanus Sujatmoko  

---

## 1. SYSTEM ARCHITECTURE

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   Browser  │  │   Mobile   │  │   Tablet   │            │
│  │  (Chrome)  │  │  (Safari)  │  │  (Safari)  │            │
│  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘            │
│         │                │                │                   │
│         └────────────────┴────────────────┘                   │
│                          │                                    │
│                    HTTPS Request                              │
│                          │                                    │
└──────────────────────────┼────────────────────────────────────┘
                           │
┌──────────────────────────┼────────────────────────────────────┐
│                   VERCEL EDGE NETWORK                          │
│                          │                                     │
│  ┌────────────────────────────────────────────────────────┐  │
│  │             NEXT.JS APPLICATION (App Router)            │  │
│  │                                                          │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  │  │
│  │  │   Pages/    │  │  API Routes  │  │  Middleware  │  │  │
│  │  │ Components  │  │  /api/*      │  │  (Auth)      │  │  │
│  │  └─────────────┘  └──────┬───────┘  └──────────────┘  │  │
│  │                           │                              │  │
│  └───────────────────────────┼──────────────────────────────┘  │
│                              │                                  │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
         ┌──────────▼─────────┐  ┌────────▼────────┐
         │   NextAuth.js      │  │   Prisma ORM    │
         │   (Auth Layer)     │  │   (Data Layer)  │
         └──────────┬─────────┘  └────────┬────────┘
                    │                     │
         ┌──────────▼─────────────────────▼────────┐
         │         SUPABASE (PostgreSQL)            │
         │  ┌──────────┐  ┌──────────┐            │
         │  │  Users   │  │Transactions│           │
         │  │  Table   │  │   Table    │           │
         │  └──────────┘  └──────────┘            │
         └─────────────────────────────────────────┘
```

### 1.2 Technology Stack Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                    │
│  React 18 + Next.js 14 (App Router) + TypeScript       │
│  TailwindCSS + Shadcn/ui + Recharts                     │
└─────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                     │
│  Next.js API Routes + React Hook Form + Zod            │
│  NextAuth.js (Session Management)                       │
└─────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────┐
│                      DATA ACCESS LAYER                   │
│  Prisma ORM + PostgreSQL Client                         │
└─────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                     │
│  PostgreSQL 15 (Supabase Hosted)                        │
└─────────────────────────────────────────────────────────┘
```

---

## 2. DATABASE DESIGN

### 2.1 Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────┐
│                   User                       │
├─────────────────────────────────────────────┤
│ id              String (PK, cuid)           │
│ email           String (Unique)             │
│ emailVerified   DateTime?                   │
│ name            String?                     │
│ password        String? (hashed)            │
│ image           String?                     │
│ createdAt       DateTime                    │
│ updatedAt       DateTime                    │
└──────────────┬──────────────────────────────┘
               │ 1:N
               │
┌──────────────▼──────────────────────────────┐
│              Transaction                     │
├─────────────────────────────────────────────┤
│ id              String (PK, cuid)           │
│ userId          String (FK -> User.id)      │
│ amount          Decimal(10,2)               │
│ type            Enum (INCOME, EXPENSE)      │
│ category        String                      │
│ description     String?                     │
│ notes           String?                     │
│ date            DateTime                    │
│ createdAt       DateTime                    │
│ updatedAt       DateTime                    │
│ deletedAt       DateTime? (soft delete)     │
└──────────────┬──────────────────────────────┘
               │
               │ User has many Transactions
               │ Transaction belongs to User
               │
┌──────────────▼──────────────────────────────┐
│                 Budget                       │
├─────────────────────────────────────────────┤
│ id              String (PK, cuid)           │
│ userId          String (FK -> User.id)      │
│ category        String                      │
│ amount          Decimal(10,2)               │
│ month           Int (1-12)                  │
│ year            Int                         │
│ createdAt       DateTime                    │
│ updatedAt       DateTime                    │
└─────────────────────────────────────────────┘
   User has many Budgets
   Budget belongs to User

┌─────────────────────────────────────────────┐
│               Account (NextAuth)             │
├─────────────────────────────────────────────┤
│ id              String (PK)                 │
│ userId          String (FK -> User.id)      │
│ type            String                      │
│ provider        String                      │
│ providerAccountId String                    │
│ refresh_token   String?                     │
│ access_token    String?                     │
│ expires_at      Int?                        │
│ token_type      String?                     │
│ scope           String?                     │
│ id_token        String?                     │
│ session_state   String?                     │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│               Session (NextAuth)             │
├─────────────────────────────────────────────┤
│ id              String (PK)                 │
│ sessionToken    String (Unique)             │
│ userId          String (FK -> User.id)      │
│ expires         DateTime                    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│          VerificationToken (NextAuth)        │
├─────────────────────────────────────────────┤
│ identifier      String                      │
│ token           String (Unique)             │
│ expires         DateTime                    │
└─────────────────────────────────────────────┘
```

### 2.2 Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// USER MODEL
// ============================================
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?   // Hashed password (null if OAuth)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  accounts      Account[]
  sessions      Session[]
  transactions  Transaction[]
  budgets       Budget[]

  @@map("users")
}

// ============================================
// TRANSACTION MODEL
// ============================================
enum TransactionType {
  INCOME
  EXPENSE
}

model Transaction {
  id          String          @id @default(cuid())
  userId      String
  amount      Decimal         @db.Decimal(10, 2)
  type        TransactionType
  category    String
  description String?
  notes       String?         @db.Text
  date        DateTime        @default(now())
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
  deletedAt   DateTime?       // Soft delete

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Indexes
  @@index([userId])
  @@index([date])
  @@index([type])
  @@index([category])
  @@map("transactions")
}

// ============================================
// BUDGET MODEL
// ============================================
model Budget {
  id        String   @id @default(cuid())
  userId    String
  category  String
  amount    Decimal  @db.Decimal(10, 2)
  month     Int      // 1-12
  year      Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Unique constraint (one budget per category per month per user)
  @@unique([userId, category, month, year])
  @@index([userId])
  @@map("budgets")
}

// ============================================
// NEXTAUTH MODELS
// ============================================
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}
```

### 2.3 Database Indexes

```sql
-- Performance indexes
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_category ON transactions(category);
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date DESC);

CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_budgets_user_month_year ON budgets(user_id, year, month);
```

### 2.4 Sample Data

```sql
-- Sample User
INSERT INTO users (id, email, name, password, created_at, updated_at)
VALUES (
  'clxxx123',
  'demo@example.com',
  'Demo User',
  '$2a$10$...', -- bcrypt hashed password
  NOW(),
  NOW()
);

-- Sample Transactions
INSERT INTO transactions (id, user_id, amount, type, category, description, date)
VALUES
  ('trx001', 'clxxx123', 5000.00, 'INCOME', 'Salary', 'Monthly salary', '2025-11-01'),
  ('trx002', 'clxxx123', 50.00, 'EXPENSE', 'Food', 'Grocery shopping', '2025-11-02'),
  ('trx003', 'clxxx123', 30.00, 'EXPENSE', 'Transport', 'Uber ride', '2025-11-03'),
  ('trx004', 'clxxx123', 100.00, 'EXPENSE', 'Shopping', 'New shoes', '2025-11-05'),
  ('trx005', 'clxxx123', 500.00, 'INCOME', 'Freelance', 'Web dev project', '2025-11-10');

-- Sample Budgets
INSERT INTO budgets (id, user_id, category, amount, month, year)
VALUES
  ('bdg001', 'clxxx123', 'Food', 300.00, 11, 2025),
  ('bdg002', 'clxxx123', 'Transport', 100.00, 11, 2025),
  ('bdg003', 'clxxx123', 'Shopping', 200.00, 11, 2025);
```

---

## 3. API SPECIFICATION

### 3.1 API Endpoints Overview

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/signin` | Login user | No |
| POST | `/api/auth/signout` | Logout user | Yes |
| GET | `/api/auth/session` | Get current session | Yes |
| GET | `/api/transactions` | Get all user transactions | Yes |
| POST | `/api/transactions` | Create new transaction | Yes |
| GET | `/api/transactions/[id]` | Get single transaction | Yes |
| PATCH | `/api/transactions/[id]` | Update transaction | Yes |
| DELETE | `/api/transactions/[id]` | Delete transaction | Yes |
| GET | `/api/dashboard/stats` | Get dashboard statistics | Yes |
| GET | `/api/budgets` | Get user budgets | Yes |
| POST | `/api/budgets` | Create/update budget | Yes |
| DELETE | `/api/budgets/[id]` | Delete budget | Yes |

### 3.2 Detailed API Specifications

---

#### **3.2.1 Authentication APIs**

**POST /api/auth/signup**

Register a new user.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Validation:**
- Email: valid email format, unique
- Password: min 8 chars, 1 uppercase, 1 number
- Name: optional, max 100 chars

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": "clxxx123",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
```json
// 400 Bad Request
{
  "error": "Email already exists"
}

// 422 Unprocessable Entity
{
  "error": "Validation failed",
  "details": {
    "password": "Password must be at least 8 characters"
  }
}
```

---

**POST /api/auth/[...nextauth]**

Handled by NextAuth.js (login, logout, OAuth callbacks).

**Login Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Login Response:**
```json
{
  "user": {
    "id": "clxxx123",
    "name": "John Doe",
    "email": "john@example.com",
    "image": null
  },
  "expires": "2025-12-01T00:00:00.000Z"
}
```

---

#### **3.2.2 Transaction APIs**

**GET /api/transactions**

Get all transactions for the authenticated user.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50, max: 100)
- `type` (optional): Filter by type ("INCOME" or "EXPENSE")
- `category` (optional): Filter by category
- `startDate` (optional): Filter from date (ISO 8601)
- `endDate` (optional): Filter to date (ISO 8601)
- `search` (optional): Search in description/notes
- `sortBy` (optional): Sort field (default: "date")
- `sortOrder` (optional): "asc" or "desc" (default: "desc")

**Example Request:**
```
GET /api/transactions?page=1&limit=20&type=EXPENSE&startDate=2025-11-01&endDate=2025-11-30&sortBy=date&sortOrder=desc
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "trx001",
        "userId": "clxxx123",
        "amount": "50.00",
        "type": "EXPENSE",
        "category": "Food",
        "description": "Grocery shopping",
        "notes": null,
        "date": "2025-11-02T00:00:00.000Z",
        "createdAt": "2025-11-02T10:30:00.000Z",
        "updatedAt": "2025-11-02T10:30:00.000Z"
      },
      // ... more transactions
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

---

**POST /api/transactions**

Create a new transaction.

**Request:**
```json
{
  "amount": 50.00,
  "type": "EXPENSE",
  "category": "Food",
  "description": "Grocery shopping",
  "notes": "At Whole Foods",
  "date": "2025-11-02T00:00:00.000Z"
}
```

**Validation:**
- `amount`: Required, positive number, max 2 decimal places
- `type`: Required, must be "INCOME" or "EXPENSE"
- `category`: Required, non-empty string
- `description`: Optional, max 255 chars
- `notes`: Optional, max 1000 chars
- `date`: Required, valid ISO 8601 date, not future

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Transaction created successfully",
  "data": {
    "id": "trx002",
    "userId": "clxxx123",
    "amount": "50.00",
    "type": "EXPENSE",
    "category": "Food",
    "description": "Grocery shopping",
    "notes": "At Whole Foods",
    "date": "2025-11-02T00:00:00.000Z",
    "createdAt": "2025-11-02T10:30:00.000Z",
    "updatedAt": "2025-11-02T10:30:00.000Z"
  }
}
```

**Error Responses:**
```json
// 401 Unauthorized
{
  "error": "Authentication required"
}

// 422 Unprocessable Entity
{
  "error": "Validation failed",
  "details": {
    "amount": "Amount must be a positive number",
    "date": "Date cannot be in the future"
  }
}
```

---

**PATCH /api/transactions/[id]**

Update an existing transaction.

**Request:**
```json
{
  "amount": 55.00,
  "description": "Grocery shopping (updated)"
}
```

**Notes:**
- Only provided fields are updated
- User can only update their own transactions (validated)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Transaction updated successfully",
  "data": {
    "id": "trx002",
    "amount": "55.00",
    "description": "Grocery shopping (updated)",
    "updatedAt": "2025-11-03T14:20:00.000Z"
  }
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "error": "Transaction not found"
}

// 403 Forbidden
{
  "error": "You don't have permission to update this transaction"
}
```

---

**DELETE /api/transactions/[id]**

Soft delete a transaction (sets `deletedAt` timestamp).

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Transaction deleted successfully"
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "error": "Transaction not found"
}

// 403 Forbidden
{
  "error": "You don't have permission to delete this transaction"
}
```

---

#### **3.2.3 Dashboard APIs**

**GET /api/dashboard/stats**

Get aggregated statistics for the dashboard.

**Query Parameters:**
- `startDate` (optional): Filter from date (default: start of current month)
- `endDate` (optional): Filter to date (default: now)

**Example Request:**
```
GET /api/dashboard/stats?startDate=2025-11-01&endDate=2025-11-30
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalBalance": "4370.00",
      "totalIncome": "5500.00",
      "totalExpenses": "1130.00",
      "transactionCount": 45
    },
    "spendingByCategory": [
      {
        "category": "Food",
        "amount": "450.00",
        "percentage": 39.8,
        "count": 15
      },
      {
        "category": "Transport",
        "amount": "280.00",
        "percentage": 24.8,
        "count": 10
      },
      {
        "category": "Shopping",
        "amount": "200.00",
        "percentage": 17.7,
        "count": 5
      },
      {
        "category": "Bills",
        "amount": "150.00",
        "percentage": 13.3,
        "count": 3
      },
      {
        "category": "Other",
        "amount": "50.00",
        "percentage": 4.4,
        "count": 2
      }
    ],
    "dailySpending": [
      { "date": "2025-11-01", "income": "5000.00", "expense": "0.00" },
      { "date": "2025-11-02", "income": "0.00", "expense": "50.00" },
      { "date": "2025-11-03", "income": "0.00", "expense": "30.00" },
      // ... more daily data
    ],
    "recentTransactions": [
      // Last 10 transactions
    ]
  }
}
```

---

#### **3.2.4 Budget APIs**

**GET /api/budgets**

Get budgets for current month.

**Query Parameters:**
- `month` (optional): Month number 1-12 (default: current month)
- `year` (optional): Year (default: current year)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "budgets": [
      {
        "id": "bdg001",
        "category": "Food",
        "amount": "300.00",
        "spent": "245.50",
        "remaining": "54.50",
        "percentage": 81.8,
        "month": 11,
        "year": 2025
      },
      {
        "category": "Transport",
        "amount": "100.00",
        "spent": "75.00",
        "remaining": "25.00",
        "percentage": 75.0,
        "month": 11,
        "year": 2025
      }
    ]
  }
}
```

---

**POST /api/budgets**

Create or update a budget.

**Request:**
```json
{
  "category": "Food",
  "amount": 350.00,
  "month": 11,
  "year": 2025
}
```

**Response (201 Created or 200 OK):**
```json
{
  "success": true,
  "message": "Budget saved successfully",
  "data": {
    "id": "bdg001",
    "category": "Food",
    "amount": "350.00",
    "month": 11,
    "year": 2025
  }
}
```

---

### 3.3 Error Handling

**Standard Error Response Format:**
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {} // Optional additional context
}
```

**HTTP Status Codes:**
- `200 OK`: Successful GET, PATCH, DELETE
- `201 Created`: Successful POST
- `400 Bad Request`: Invalid request format
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Authenticated but not authorized
- `404 Not Found`: Resource doesn't exist
- `422 Unprocessable Entity`: Validation errors
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

---

## 4. COMPONENT ARCHITECTURE

### 4.1 Folder Structure

```
finance-tracker/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── transactions/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── budgets/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signup/
│   │   │   │   └── route.ts
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── transactions/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── dashboard/
│   │   │   └── stats/
│   │   │       └── route.ts
│   │   └── budgets/
│   │       ├── route.ts
│   │       └── [id]/
│   │           └── route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/ (Shadcn components)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   └── ...
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── AuthProvider.tsx
│   ├── dashboard/
│   │   ├── StatsCard.tsx
│   │   ├── SpendingPieChart.tsx
│   │   ├── SpendingLineChart.tsx
│   │   └── RecentTransactions.tsx
│   ├── transactions/
│   │   ├── TransactionForm.tsx
│   │   ├── TransactionList.tsx
│   │   ├── TransactionFilters.tsx
│   │   └── TransactionItem.tsx
│   ├── budgets/
│   │   ├── BudgetForm.tsx
│   │   ├── BudgetList.tsx
│   │   └── BudgetProgress.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── DashboardLayout.tsx
│   └── common/
│       ├── Loading.tsx
│       ├── ErrorBoundary.tsx
│       └── EmptyState.tsx
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── utils.ts
│   └── validations.ts
├── hooks/
│   ├── useTransactions.ts
│   ├── useDashboard.ts
│   └── useBudgets.ts
├── types/
│   ├── index.ts
│   ├── api.ts
│   └── models.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   └── images/
├── .env.local
├── .env.example
├── .eslintrc.json
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

### 4.2 Component Hierarchy

```
App
├── AuthProvider (NextAuth session provider)
├── Layout (RootLayout)
│   ├── Header
│   │   ├── Logo
│   │   ├── Navigation
│   │   └── UserMenu
│   ├── Main Content
│   │   └── {page}
│   └── Footer
│
├── (auth) Routes (No sidebar)
│   ├── /login
│   │   └── LoginForm
│   │       ├── EmailInput
│   │       ├── PasswordInput
│   │       └── SubmitButton
│   └── /signup
│       └── SignupForm
│           ├── NameInput
│           ├── EmailInput
│           ├── PasswordInput
│           └── SubmitButton
│
└── (dashboard) Routes (With sidebar)
    ├── DashboardLayout
    │   ├── Sidebar
    │   │   └── Navigation Links
    │   └── Content Area
    │
    ├── /dashboard
    │   ├── StatsCard (x4)
    │   │   ├── Icon
    │   │   ├── Value
    │   │   └── Label
    │   ├── SpendingPieChart
    │   │   └── Recharts PieChart
    │   ├── SpendingLineChart
    │   │   └── Recharts LineChart
    │   └── RecentTransactions
    │       └── TransactionItem (x10)
    │
    ├── /transactions
    │   ├── TransactionFilters
    │   │   ├── DateRangePicker
    │   │   ├── TypeFilter
    │   │   ├── CategoryFilter
    │   │   └── SearchInput
    │   ├── AddTransactionButton
    │   │   └── TransactionForm (Dialog)
    │   └── TransactionList
    │       ├── Pagination
    │       └── TransactionItem (x50)
    │           ├── Date
    │           ├── Category
    │           ├── Description
    │           ├── Amount
    │           └── Actions (Edit/Delete)
    │
    ├── /budgets
    │   ├── AddBudgetButton
    │   │   └── BudgetForm (Dialog)
    │   └── BudgetList
    │       └── BudgetProgress (per category)
    │           ├── Category Name
    │           ├── Progress Bar
    │           ├── Amount (spent/total)
    │           └── Edit/Delete
    │
    └── /settings
        ├── ProfileForm
        ├── PasswordForm
        └── DangerZone (Delete Account)
```

### 4.3 Key Component Specifications

---

#### **StatsCard Component**

**Purpose:** Display a single metric (balance, income, expenses, count)

**Props:**
```typescript
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  loading?: boolean;
}
```

**Example Usage:**
```tsx
<StatsCard
  title="Total Balance"
  value="$4,370.00"
  icon={<DollarSign className="h-6 w-6" />}
  trend={{ value: 12.5, direction: 'up' }}
/>
```

---

#### **TransactionForm Component**

**Purpose:** Form for creating/editing transactions

**Props:**
```typescript
interface TransactionFormProps {
  mode: 'create' | 'edit';
  initialData?: Transaction;
  onSubmit: (data: TransactionFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

interface TransactionFormData {
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  description?: string;
  notes?: string;
  date: Date;
}
```

**Validation Rules:**
```typescript
const transactionSchema = z.object({
  amount: z.number().positive('Amount must be positive').multipleOf(0.01),
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.string().min(1, 'Category is required'),
  description: z.string().max(255).optional(),
  notes: z.string().max(1000).optional(),
  date: z.date().max(new Date(), 'Date cannot be in the future'),
});
```

**States:**
- Idle: Form ready for input
- Validating: Client-side validation
- Submitting: API call in progress
- Success: Form submitted, close dialog
- Error: Show error message

---

#### **SpendingPieChart Component**

**Purpose:** Visualize spending by category

**Props:**
```typescript
interface SpendingPieChartProps {
  data: CategorySpending[];
  loading?: boolean;
}

interface CategorySpending {
  category: string;
  amount: number;
  percentage: number;
  color?: string;
}
```

**Features:**
- Top 5 categories shown, rest grouped as "Other"
- Custom colors per category
- Tooltips on hover (category, amount, percentage)
- Click segment to filter transactions by category
- Responsive (stacks vertically on mobile)

**Library:** Recharts `<PieChart>` with `<Pie>` and `<Cell>`

---

#### **TransactionList Component**

**Purpose:** Display paginated list of transactions

**Props:**
```typescript
interface TransactionListProps {
  transactions: Transaction[];
  loading?: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  pagination: {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}
```

**Features:**
- Table view on desktop, card view on mobile
- Sortable columns (date, amount, category)
- Row actions: Edit, Delete (with confirmation)
- Loading skeleton while fetching
- Empty state if no transactions

---

## 5. USER FLOWS

### 5.1 User Registration Flow

```
[Start]
   │
   ▼
[User visits /signup]
   │
   ▼
[Displays SignupForm]
   │
   ├─► [User enters: name, email, password]
   │
   ▼
[User clicks "Sign Up"]
   │
   ├─► [Client-side validation]
   │   ├─ Invalid → Show error messages
   │   └─ Valid → Continue
   │
   ▼
[POST /api/auth/signup]
   │
   ├─► [Server validation]
   │   ├─ Email exists → Return error
   │   ├─ Password weak → Return error
   │   └─ Valid → Continue
   │
   ▼
[Hash password (bcrypt)]
   │
   ▼
[Create user in database]
   │
   ▼
[Return success response]
   │
   ▼
[Auto-login user (NextAuth session)]
   │
   ▼
[Redirect to /dashboard]
   │
   ▼
[End]
```

### 5.2 Add Transaction Flow

```
[Start - User on /transactions page]
   │
   ▼
[Click "Add Transaction" button]
   │
   ▼
[Open TransactionForm dialog]
   │
   ├─► [Form displays with fields:]
   │   ├─ Amount (number input)
   │   ├─ Type (radio: Income/Expense)
   │   ├─ Category (dropdown)
   │   ├─ Description (text input)
   │   ├─ Notes (textarea)
   │   └─ Date (date picker)
   │
   ▼
[User fills form]
   │
   ▼
[User clicks "Save"]
   │
   ├─► [Client-side validation (Zod)]
   │   ├─ Invalid → Show inline errors
   │   └─ Valid → Continue
   │
   ▼
[Show loading spinner]
   │
   ▼
[POST /api/transactions]
   │
   ├─► [Server validation]
   │   ├─ Auth check (middleware)
   │   ├─ Data validation
   │   └─ Valid → Continue
   │
   ▼
[Insert transaction into database]
   │
   ▼
[Return created transaction]
   │
   ▼
[Close dialog]
   │
   ├─► [Show success toast]
   │   └─ "Transaction added successfully"
   │
   ▼
[Refresh transactions list (optimistic update)]
   │
   ▼
[Update dashboard stats (if on dashboard)]
   │
   ▼
[End]
```

### 5.3 Dashboard Load Flow

```
[Start - User navigates to /dashboard]
   │
   ▼
[Check authentication (middleware)]
   │
   ├─ Not logged in → Redirect to /login
   └─ Logged in → Continue
   │
   ▼
[Show page skeleton (loading state)]
   │
   ├─── [GET /api/dashboard/stats]
   │    │
   │    ▼
   │    [Server: Fetch user transactions]
   │    │
   │    ▼
   │    [Calculate summary stats:]
   │    ├─ Total balance (income - expenses)
   │    ├─ Total income (this month)
   │    ├─ Total expenses (this month)
   │    └─ Transaction count
   │    │
   │    ▼
   │    [Calculate spending by category]
   │    │
   │    ▼
   │    [Calculate daily spending trend]
   │    │
   │    ▼
   │    [Fetch recent 10 transactions]
   │    │
   │    ▼
   │    [Return aggregated data]
   │
   ▼
[Receive data from API]
   │
   ▼
[Render dashboard components:]
   ├─ StatsCard: Total Balance
   ├─ StatsCard: This Month Income
   ├─ StatsCard: This Month Expenses
   ├─ StatsCard: Transaction Count
   ├─ SpendingPieChart
   ├─ SpendingLineChart
   └─ RecentTransactions
   │
   ▼
[Dashboard fully loaded]
   │
   ▼
[End]
```

### 5.4 Edit Transaction Flow

```
[Start - User on transactions list]
   │
   ▼
[Click "Edit" button on transaction row]
   │
   ▼
[Open TransactionForm dialog]
   │
   ▼
[Pre-fill form with existing data]
   │
   ▼
[User modifies fields]
   │
   ▼
[User clicks "Update"]
   │
   ├─► [Client validation]
   │
   ▼
[Show loading spinner]
   │
   ▼
[PATCH /api/transactions/[id]]
   │
   ├─► [Server checks:]
   │   ├─ Transaction exists?
   │   ├─ User owns transaction?
   │   └─ Valid data?
   │
   ▼
[Update transaction in database]
   │
   ▼
[Return updated transaction]
   │
   ▼
[Close dialog]
   │
   ├─► [Show success toast]
   │
   ▼
[Update row in list (optimistic update)]
   │
   ▼
[End]
```

---

## 6. UI/UX SPECIFICATIONS

### 6.1 Design System

**Color Palette:**
```css
/* Light Mode */
--background: 0 0% 100%;
--foreground: 222.2 84% 4.9%;
--primary: 221.2 83.2% 53.3%; /* Blue */
--primary-foreground: 210 40% 98%;
--secondary: 210 40% 96.1%;
--secondary-foreground: 222.2 47.4% 11.2%;
--muted: 210 40% 96.1%;
--muted-foreground: 215.4 16.3% 46.9%;
--accent: 210 40% 96.1%;
--accent-foreground: 222.2 47.4% 11.2%;
--destructive: 0 84.2% 60.2%; /* Red */
--destructive-foreground: 210 40% 98%;
--border: 214.3 31.8% 91.4%;
--input: 214.3 31.8% 91.4%;
--ring: 221.2 83.2% 53.3%;

/* Dark Mode */
--background: 222.2 84% 4.9%;
--foreground: 210 40% 98%;
--primary: 217.2 91.2% 59.8%;
--primary-foreground: 222.2 47.4% 11.2%;
/* ... (similar for other colors) */
```

**Category Colors:**
```
\<Streaming stoppped because the conversation grew too long for this model\>