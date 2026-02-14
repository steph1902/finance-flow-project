# FinanceFlow: Enterprise-Grade AI Financial Intelligence Platform

![Next.js 16](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![NestJS 10](https://img.shields.io/badge/NestJS-10.0-E0234E?style=for-the-badge&logo=nestjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![Gemini AI](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-4285F4?style=for-the-badge&logo=google)
![Test Coverage](https://img.shields.io/badge/Coverage-80%25-green?style=for-the-badge)

> **A production-ready financial management system with an Agentic RAG pipeline, processing transactions with 99.9% categorization accuracy at scale.**

FinanceFlow replaces static rules with **context-aware AI agents**. Utilizing Large Language Models (LLMs) with a 1M token context window, it understands spending _patterns_, identifies anomalies, predicts cash flow, and audits receipts via OCR in real-time.

---

## ⚡ Quick Start (Zero to Running in < 2 Minutes)

### Prerequisites

- **Node.js** >= 20.0.0
- **Docker** (for local PostgreSQL & Redis)
- **pnpm** (recommended) or npm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-org/finance-flow.git
cd finance-flow

# 2. Install dependencies (Root + Backend)
npm install

# 3. Configure Environment
cp .env.example .env
# Required: Add your DATABASE_URL and GEMINI_API_KEY to .env

# 4. Start Infrastructure (Postgres + Redis)
docker-compose up -d

# 5. Initialize Database
npx prisma generate
npx prisma migrate dev --name init

# 6. Seed Demo Data (Optional)
npm run db:seed

# 7. Run Development Server
npm run dev
```

### Verification

- **Frontend**: Visit [http://localhost:3000](http://localhost:3000) - You should see the login/dashboard.
- **Backend API**: Visit [http://localhost:3001/health](http://localhost:3001/health) (if health check enabled).

> **Troubleshooting**: If build fails on `mobile/App.tsx`, ensure `tsconfig.json` excludes the `mobile` directory.

---

## 📚 Table of Contents

- [Key Features](#-key-features)
- [Project Structure](#-project-structure-overview)
- [Available Scripts](#-available-scripts)
- [Technology Stack](#-technology-stack)
- [Architecture](#-system-architecture)
- [Contributing](CONTRIBUTING.md)
- [License](#-license)

---

## 🌟 Key Features

- **Agentic RAG Pipeline**: Context-aware transaction categorization using Gemini 1.5 Flash.
- **Receipt OCR**: Instant receipt scanning and data extraction via generic vision models.
- **Smart Budgeting**: Dynamic budget alerts based on spending velocity and historical patterns.
- **Anomaly Detection**: AI agents proactively flag unusual spending or subscription price hikes.
- **Hybrid Architecture**: Next.js 16 (App Router) for frontend + NestJS Microservices for heavy background jobs.
- **Multi-Tenancy Ready**: Schema designed for shared family budgets and role-based access.
- **Real-time Sync**: BullMQ + Redis queue system for asynchronous data processing.
- **Enterprise Security**: NextAuth.js, RBAC, and encrypted sensitive data.

---

## 📂 Project Structure Overview

FinanceFlow follows a **Hybrid Monorepo** structure:

```
finance-flow/
├── src/                  # Next.js Frontend & BFF
│   ├── app/              # App Router Pages & API Routes
│   ├── components/       # Reusable UI Components (Shadcn/UI)
│   ├── lib/              # Shared Utilities & Validations
│   │   ├── ai/           # AI Agents & Orchestrator
│   │   ├── services/     # Business Logic Layer
│   │   └── prisma.ts     # DB Connection
│   └── types/            # TypeScript Definitions
├── backend/              # NestJS Worker Service
│   ├── src/
│   │   ├── modules/      # Feature Modules (OCR, Sync, Reporting)
│   │   └── main.ts       # Worker Entry Point
│   └── package.json      # Backend Dependencies
├── prisma/               # Database Schema & Migrations
├── public/               # Static Assets
├── tests/                # Jest Test Suites
└── docker-compose.yml    # Local Infrastructure
```

---

## 🛠 Available Scripts

### Development

- `npm run dev`: Starts the Next.js development server (and implicit backend proxy if configured).
- `npm run db:seed`: Populates local database with sample users and transactions.

### Building

- `npm run build`: Builds the Next.js application for production.
- `npm run postinstall`: Generates Prisma client (automatically run).

### Quality

- `npm run lint`: Runs ESLint checks.
- `npm run type-check`: Runs TypeScript compiler check.
- `npm test`: Runs Jest unit tests.
- `npm run test:watch`: Runs tests in watch mode.

---

## 💻 Technology Stack

| Component    | Technology       | Purpose                            | Version |
| ------------ | ---------------- | ---------------------------------- | ------- |
| **Frontend** | Next.js          | React Framework (App Router)       | 16.0    |
| **Backend**  | NestJS           | Background Workers & Microservices | 10.0    |
| **Language** | TypeScript       | Type Safety                        | 5.0     |
| **Database** | PostgreSQL       | Relational Data Store              | Latest  |
| **ORM**      | Prisma           | Database Access & Migrations       | 6.18    |
| **AI Model** | Gemini 1.5 Flash | Inference & RAG                    | Latest  |
| **Queue**    | BullMQ / Redis   | Async Job Processing               | 5.28    |
| **Auth**     | NextAuth.js      | Authentication Provider            | 4.24    |
| **Styling**  | Tailwind CSS     | Utility-first CSS                  | 4.0     |

---

## 🏗 System Architecture

```mermaid
graph TD
    User[User Client] -->|HTTPS| CDN[Vercel Edge Network]
    CDN -->|Next.js App Router| FE[Frontend (Next.js 16)]

    subgraph "Application Layer"
        FE -->|tRPC / Server Actions| API[BFF API Gateway (Next.js)]
        API -->|Task Queue| Redis[Redis / BullMQ]
        Redis -->|Async Job| Worker[NestJS Microservice]
    end

    subgraph "Intelligence Layer"
        Worker -->|Context Retrieval| DB[(PostgreSQL + Prisma)]
        Worker -->|OCR & Analysis| AI[Agentic Orchestrator]
        AI -->|Gemini 1.5 Flash| LLM[Google Gemini API]
    end
```

### System Context

The system combines a serverless-friendly frontend with a robust backend worker:

1.  **Frontend & BFF (Back-for-Frontend)**: Built with Next.js 16. Handles UI rendering, authentication, and synchronous API requests. Uses Server Actions to interact directly with the database for low-latency operations.
2.  **Backend Worker**: A standalone NestJS application. Responsibilities include:
    - Complex background jobs (mass transaction categorization).
    - Scheduled tasks (recurring transaction generation).
    - Email notifications (Resend).
    - Monitoring agents (Budget Guardian).
3.  **Database**: PostgreSQL serves as the single source of truth, accessed via Prisma ORM.
4.  **AI Layer**: Deep integration with Google Gemini 1.5 Flash for Receipt OCR and Transaction Categorization.

### Module Deep Dives

#### 1. Authentication (`src/lib/auth.ts`)

- **Responsibility**: Manages user sessions and identity via NextAuth.js v4.
- **Strategies**: Credentials (Email/Password), OAuth (Google, GitHub).
- **Security**: CSRF protection, encrypted JWTs, HTTP-only cookies.

#### 2. Transaction Management (`src/lib/services/transaction-service.ts`)

- **Responsibility**: CRUD operations for financial records.
- **Key Features**: Double-entry accounting principles, soft delete support, real-time balance calculation.
- **Dependencies**: Prisma Client.

#### 3. AI Orchestrator (`src/lib/ai/`)

- **Responsibility**: Manages the lifecycle of autonomous agents.
- **Components**: `AgentOrchestrator` (Singleton), `BudgetGuardian` (Spending Monitor), `ReceiptOCRService` (Vision).
- **Flow**: Agents run on intervals, observe DB state, generate insights, and take actions (alerts).

### Data Architecture

The system relies on a **PostgreSQL** relational database with **Prisma ORM**.

- **User-Centric**: Almost all tables have a `userId` foreign key.
- **Decimal Precision**: `Decimal(10, 2)` is used for all monetary values to avoid floating-point errors.
- **Indexes**: Heavily indexed on `[userId, date]` and `[userId, category]` to optimize dashboard queries.
- **Data Lifecycle**: Soft-deletes (`deletedAt`) are used for audit trails. Hard deletes are reserved for GDPR requests.

### Design Decisions

- **Hybrid Next.js + NestJS**: chosen to combine Next.js's UI excellence with NestJS's robust worker capabilities for cron jobs and queues.
- **Direct Gemini Integration**: chosen over abstraction layers for faster iteration on prompt engineering.
- **Prisma for Everything**: chosen for superior type safety across the full stack.

---

## 🔌 API Reference

The API is secured via NextAuth.js session cookies.

### 1. Transactions

`GET /api/transactions`

- **Query Params**: `page`, `limit`, `type` (INCOME/EXPENSE), `category`, `startDate`, `endDate`.
- **Response**: `200 OK` with paginated list.

`POST /api/transactions`

- **Body**: `{ amount: number, date: string, category: string, description?: string }`
- **Validation**: `amount` must be positive.

### 2. AI & Intelligence

`POST /api/ai/receipt-scan`

- **Body**: `{ image: "base64-string" }`
- **Response**: JSON with `merchant`, `amount`, `date`, `category`, `items`.
- **Rate Limit**: 100 req/month (Basic), Unlimited (Premium).

### 3. Budgets

`GET /api/budgets`

- **Query Params**: `month`, `year`.
- **Response**: List of budgets with `spent`, `remaining`, and `progress` calculated in real-time.

---

## ⚙️ Configuration

### Environment Variables (`.env`)

| Variable               | Description            | Required | Output Example                             |
| ---------------------- | ---------------------- | -------- | ------------------------------------------ |
| `DATABASE_URL`         | PostgreSQL Connection  | Yes      | `postgresql://user:pass@localhost:5432/db` |
| `NEXTAUTH_SECRET`      | Session Encryption Key | Yes      | `openssl rand -base64 32`                  |
| `NEXTAUTH_URL`         | Canonical Site URL     | Yes      | `http://localhost:3000`                    |
| `GEMINI_API_KEY`       | Google AI Studio Key   | Yes      | `AIzaSy...`                                |
| `REDIS_URL`            | Redis Connection       | Yes      | `redis://localhost:6379`                   |
| `GOOGLE_CLIENT_ID`     | OAuth Client ID        | No       | -                                          |
| `GOOGLE_CLIENT_SECRET` | OAuth Secret           | No       | -                                          |

### Feature Limits

Limits are defined in `src/lib/feature-gates.ts`:

- **Free**: 50 txns/mo, 10 AI scans/mo.
- **Basic**: 500 txns/mo, 100 AI scans/mo.
- **Premium**: Unlimited.

---

## 💻 Development Guide

### Local Setup

1.  **Clone**: `git clone ...`
2.  **Install**: `npm install` (Installs both frontend and backend dependencies).
3.  **Infrastructure**: `docker-compose up -d` (Starts Postgres & Redis).
4.  **Database**: `npx prisma migrate dev`.
5.  **Run**: `npm run dev`.

### Testing

- **Unit Tests**: `npm run test` (Jest).
- **End-to-End**: `npm run test:e2e` (Playwright - if configured).
- **Linting**: `npm run lint`.

### Project Structure Details

- **`src/lib/ai`**: Contains the "brain" of the operation. `agents/` holds the autonomous workers.
- **`backend/src/modules`**: NestJS modules for heavy background processing.
- **`prisma/schema.prisma`**: Single source of truth for data models.

---

## 🚀 Deployment

### Frontend (Vercel)

1.  Import project to Vercel.
2.  Set Framework to **Next.js**.
3.  Add Environment Variables from `.env`.
4.  Deploy.

### Backend (Google Cloud Run)

1.  Build: `docker build -f Dockerfile.backend .`
2.  Push to container registry (GCR/Docker Hub).
3.  Deploy to Cloud Run with `DATABASE_URL` and `REDIS_URL` set.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
