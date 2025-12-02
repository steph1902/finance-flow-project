# 💰 FinanceFlow

**The AI-Powered Personal Finance Automation Platform.**

FinanceFlow leverages Google Gemini AI to automate expense tracking, provide intelligent financial insights, and streamline budget management—all wrapped in a premium "Neo-Fintech" aesthetic.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.18-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=flat-square&logo=postgresql)](https://www.postgresql.org/)

---

## ✨ Key Features

- **🤖 AI Intelligence**: Automatic transaction categorization, conversational financial assistant, and smart budget optimization using Google Gemini.
- **💎 Premium UX**: "Neo-Fintech" design with glassmorphism, dynamic gradients, and smooth Framer Motion animations.
- **📊 Deep Analytics**: Real-time spending visualization, trend detection, and financial forecasting.
- **🔐 Enterprise-Grade**: Secure authentication (NextAuth.js), robust data validation (Zod), and type-safe database access (Prisma).

## 🚀 Quick Start

1.  **Clone & Install**
    ```bash
    git clone https://github.com/steph1902/finance-flow-project.git
    cd finance-flow-project/finance-flow
    npm install
    ```

2.  **Configure Environment**
    Create `.env.local` and add your keys:
    ```bash
    DATABASE_URL="postgresql://..."
    NEXTAUTH_SECRET="your-secret"
    GEMINI_API_KEY="your-gemini-key"
    ```

3.  **Run Locally**
    ```bash
    npx prisma migrate dev
    npm run db:seed  # Optional: Adds demo data
    npm run dev
    ```

    Visit `http://localhost:3000` to start your financial journey.

## 🛠 Tech Stack

Built with the modern web in mind:
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + Shadcn/ui
- **Database**: PostgreSQL + Prisma ORM
- **AI**: Google Gemini 1.5 Flash

---

[Contributing](CONTRIBUTING.md) • [License](LICENSE)
