# 💰 FinanceFlow Project Summary

**Date:** December 11, 2025
**Version:** 0.1.0

## 📖 Overview

**FinanceFlow** is a comprehensive, AI-powered personal finance automation platform designed to help users track expenses, optimize budgets, and gain deep financial insights. It distinguishes itself with a premium "Neo-Fintech" aesthetic and a hybrid microservices-ready architecture.

The system is composed of:
1.  **Frontend Web App**: Next.js 16 application for the user interface.
2.  **Backend API Service**: NestJS microservice for heavy lifting, background jobs, and core business logic.
3.  **Mobile Application**: Cross-platform React Native app.

---

## 🏗 System Architecture

The project employs a **hybrid full-stack architecture** containerized via Docker:

-   **Frontend (`/finance-flow`)**: A **Next.js 16** App Router acting as the UI layer and BFF (Backend-for-Frontend). It handles Authentication (NextAuth.js) and direct DB reads for UI rendering.
-   **Backend Service (`/finance-flow/backend`)**: A Dedicated **NestJS** service handling:
    -   Background processing (BullMQ + Redis).
    -   Complex business logic.
    -   AI integration pipeline (Vision API for receipts).
-   **Database**: Centralized **PostgreSQL** database shared between Next.js and NestJS services via **Prisma ORM**.
-   **Infrastructure**: Redis for caching/queues, PostgreSQL for persistent data.

### 🐳 Docker Services
Defined in `docker-compose.yml`:
-   `frontend`: Next.js Web App (Port 3000)
-   `backend`: NestJS API Service (Port 3001)
-   `db`: PostgreSQL 15 (Port 5432)
-   `redis`: Redis 7 (Port 6379, for caching & queues)

---

## 💻 Technology Stack

### 🌐 Web Frontend (`/finance-flow`)
-   **Framework**: Next.js 16 (App Router)
-   **Styling**: TailwindCSS v4, Shadcn/ui, Framer Motion
-   **State**: SWR, React Server Components
-   **Auth**: NextAuth.js (Unified Authentication)
-   **AI**: Google Gemini 1.5 Flash (Chat & Categorization)

### ⚙️ Backend Service (`/finance-flow/backend`)
-   **Framework**: NestJS v10
-   **Runtime**: Node.js
-   **Queue System**: BullMQ + Redis
-   **AI**: Google Cloud Vision (Receipt Scanning) + Gemini
-   **Documentation**: Swagger / OpenAPI
-   **Validation**: Class-Validator

### 📱 Mobile Application
*Note: The workspace contains two mobile implementations. The internal version is recommended for modernity.*
-   **Primary (`/finance-flow/mobile`)**: Expo SDK ~54 with **Expo Router** (File-based routing).
-   **Alternative (`/mobile`)**: Expo SDK ~54 with standard **React Navigation**.
-   **Styling**: NativeWind v4

---

## ✨ Key Features & Data Model

The database schema supports a rich set of financial features:

### 1. Core Financial Tracking
-   **Transactions**: Income and Expense tracking with robust categorization.
-   **Recurring Transactions**: Support for subscriptions and bills with flexible frequencies (Daily, Weekly, Monthly, Yearly).
-   **Budgets**: Category-specific monthly budgets with rollover capabilities and alert thresholds.
-   **Multi-Currency**: Native support for multiple currencies and exchange rates (`currency_rates`).
-   **Bank Sync**: Plaid integration for widespread bank connectivity.

### 2. Advanced Wealth Management
-   **Investments**: Detailed tracking of Stocks, Crypto, and ETFs including buy/sell history and dividends.
-   **Goals**: Savings goals with milestone tracking and contributions.

### 3. Intelligent Automation
-   **AI Suggestions**: Stores AI predictions for transactions with confidence scores to improve accuracy over time.
-   **Receipt Scanning**: AI-powered image analysis utilizing Google Cloud Vision to extract data from receipts (implied by backend deps including `google-cloud/vision` and `multer`).
-   **Merchant Normalization**: `MerchantData` model to map disparate raw merchant names to clean canonical names.

### 4. System & Ops
-   **Notifications**: Comprehensive alert system for bills, budget overruns, and system messages.
-   **Reports**: Generation of PDF/CSV/JSON reports for tax or archival purposes.
-   **Visitor Feedback**: System to track user feedback and ratings.
-   **Versioning**: Tracks deployed project versions and changelogs.
