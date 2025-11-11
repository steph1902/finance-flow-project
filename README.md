<div align="center">

# 💰 FinanceFlow

### Modern Personal Finance Management System

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

[🚀 Live Demo](https://finance-flow.vercel.app) · [📖 Documentation](https://github.com/steph1902/finance-flow-project/tree/main/project-guideline) · [🐛 Report Bug](https://github.com/steph1902/finance-flow-project/issues) · [✨ Request Feature](https://github.com/steph1902/finance-flow-project/issues)

![FinanceFlow Dashboard](./public/screenshots/dashboard.png)

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Performance](#performance)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgments](#acknowledgments)

---

## 🎯 About

**FinanceFlow** is a modern, full-stack personal finance management application that helps users track their income, expenses, and financial goals with beautiful data visualizations and intuitive user experience.

Built as a **portfolio project** to demonstrate production-ready full-stack development skills for **remote opportunities** in the USD/EUR market.

### Project Statistics

- **Total Lines of Code**: ~4,900 lines
- **Components**: 40+ React components
- **API Endpoints**: 8 RESTful endpoints
- **Database Models**: 5 Prisma models
- **Tech Stack**: 20+ modern technologies

### Why This Project?

- 💡 **Problem**: Manual expense tracking is time-consuming and lacks insights
- ✅ **Solution**: Automated tracking with visual analytics and budget management
- 🎓 **Learning**: Demonstrates modern web development practices and architecture

---

## ✨ Features

### 🔐 **Authentication & Security**
- Email + password authentication with bcrypt hashing
- Google OAuth integration
- Secure session management with NextAuth.js
- Protected API routes with middleware

### 💰 **Transaction Management**
- ➕ Add, edit, and delete transactions
- 🏷️ Categorize by type (Income/Expense) and custom categories
- 📝 Add descriptions and notes
- 📅 Date-based filtering and search
- 📊 Pagination for large datasets

### 📊 **Analytics Dashboard**
- 📈 Real-time financial overview (balance, income, expenses)
- 🥧 Interactive pie chart (spending by category)
- 📉 Line chart (spending trends over time)
- 📋 Recent transactions widget
- 🎯 Month-over-month comparisons

### 💵 **Budget Management**
- Set monthly budgets per category
- Visual progress tracking
- Color-coded alerts (Green/Yellow/Red)
- Budget vs. actual spending comparison

### 🎨 **User Experience**
- 🌓 Dark/Light mode toggle
- 📱 Fully responsive (mobile, tablet, desktop)
- ⚡ Fast page loads (<2s on 3G)
- ♿ Accessible (WCAG AA compliant)
- 🎭 Smooth animations and transitions

### 📤 **Data Management**
- Export transactions to CSV
- Soft delete (data recovery)
- Optimistic UI updates

---

## 🎥 Demo

### 🖼️ Screenshots

<details>
<summary>Click to expand screenshots</summary>

#### Dashboard
![Dashboard](./public/screenshots/dashboard.png)

#### Transactions
![Transactions](./public/screenshots/transactions.png)

#### Budget Tracking
![Budgets](./public/screenshots/budgets.png)

#### Mobile View
![Mobile](./public/screenshots/mobile.png)

</details>

### 🎬 Video Demo

[![FinanceFlow Demo](./public/screenshots/video-thumbnail.png)](https://www.youtube.com/watch?v=your-video-id)

*Click to watch 2-minute demo video*

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS 4](https://tailwindcss.com/)
- **Components**: [Shadcn/ui](https://ui.shadcn.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **State**: [SWR](https://swr.vercel.app/) (Server state)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Toasts**: [Sonner](https://sonner.emilkowal.ski/)

### **Backend**
- **Runtime**: [Node.js 20](https://nodejs.org/)
- **API**: Next.js API Routes (REST)
- **ORM**: [Prisma 6](https://www.prisma.io/)
- **Database**: [PostgreSQL 15](https://www.postgresql.org/)
- **Auth**: [NextAuth.js 4](https://next-auth.js.org/)
- **Validation**: [Zod 4](https://zod.dev/)
- **Password Hashing**: [bcrypt](https://www.npmjs.com/package/bcrypt)

### **DevOps & Tools**
- **Deployment**: [Vercel](https://vercel.com/)
- **Database Hosting**: [Supabase](https://supabase.com/) or PostgreSQL
- **Version Control**: Git & GitHub
- **Code Quality**: ESLint
- **Testing**: Jest, React Testing Library
- **Package Manager**: npm

### **Architecture**
- **Monolithic (Next.js App Router)**: Frontend and API routes co-located for simplified deployment and development experience.
- **Serverless Functions**: Next.js API routes deploy as serverless functions on Vercel, scaling automatically.
- **Edge Computing**: Leveraging Vercel's Edge Network for fast content delivery.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or 20+ installed
- npm, yarn, or pnpm package manager
- PostgreSQL database (or Supabase account)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/steph1902/finance-flow-project.git
cd finance-flow-project
```

2. **Install dependencies:**
```bash
npm install
```

3. **Setup environment variables:**
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your values:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: From Google Cloud Console

4. **Run database migrations:**
```bash
npx prisma migrate dev
```

5. **Seed database (optional):**
```bash
npx prisma db seed
```

6. **Start development server:**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

---

## 💡 Usage

1. **Sign Up / Log In**: Create an account or use Google OAuth.
2. **Add Transactions**: Record your income and expenses with categories and descriptions.
3. **View Dashboard**: Get an overview of your financial health with interactive charts.
4. **Manage Budgets**: Set and track spending limits for different categories.
5. **Export Data**: Download your transaction history as a CSV file.

---

## 📚 API Documentation

Detailed API specifications can be found in the [Functional Specification Document (FSD)](https://github.com/steph1902/finance-flow-project/tree/main/project-guideline).

---

## 📁 Project Structure

```
finance-flow-project/
├── app/
│   ├── (auth)/                    # Authentication routes (login, signup)
│   ├── (dashboard)/               # Protected dashboard routes
│   ├── api/                       # Next.js API routes
│   │   ├── auth/                  # Authentication endpoints
│   │   ├── budgets/               # Budget CRUD endpoints
│   │   ├── dashboard/             # Dashboard stats endpoint
│   │   └── transactions/          # Transaction CRUD endpoints
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Landing page
├── src/
│   ├── components/                # Reusable UI components
│   │   ├── auth/                  # Auth-specific components
│   │   ├── budgets/               # Budget components
│   │   ├── dashboard/             # Dashboard widgets
│   │   ├── layout/                # Header, Sidebar, Theme
│   │   ├── transactions/          # Transaction forms, lists
│   │   └── ui/                    # Shadcn/ui components
│   ├── constants/                 # App constants (categories, etc.)
│   ├── hooks/                     # Custom React hooks for data fetching
│   ├── lib/                       # Utility functions, Prisma client, auth helpers
│   └── types/                     # TypeScript type definitions
├── prisma/
│   ├── migrations/                # Database migrations
│   └── schema.prisma              # Prisma schema
├── public/                        # Static assets
├── project-guideline/             # Project documentation
├── .env.local                     # Environment variables (not in git)
├── .env.example                   # Example environment variables
├── .gitignore                     # Git ignore rules
├── next.config.ts                 # Next.js configuration
├── package.json                   # Project dependencies and scripts
├── tailwind.config.ts             # TailwindCSS configuration
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # Project overview
```

---

## ⚡ Performance

- **Lighthouse Score**: Aiming for 90+ on Performance, Accessibility, Best Practices, and SEO.
- **Load Time**: <2 seconds on a 3G connection.
- **Bundle Size**: Optimized for minimal JavaScript and CSS delivery.
- **Optimistic UI**: Instant feedback for user actions.

---

## 🗺️ Roadmap

### **Phase 1: MVP (Current)**
- User Authentication (Email/Password, Google OAuth)
- Transaction CRUD (Create, Read, Update, Delete)
- Dashboard with Analytics (Charts, Stats)
- Basic Budget Management
- Responsive Design & Dark Mode

### **Phase 2: Enhancements**
- Recurring Transactions
- Budget Alerts & Notifications
- Data Export (PDF, Excel)
- Multi-currency Support

### **Phase 3: Advanced Features**
- Bank Account Integration (Plaid API)
- Financial Goal Setting
- Investment Tracking
- Mobile Apps (React Native)
- AI-powered Insights

---

## 🤝 Contributing

This is primarily a portfolio project, but contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/steph1902/finance-flow-project/issues).

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📧 Contact

Project Maintainer
- Email: [your-email@example.com]
- Portfolio: [your-portfolio.com]
- LinkedIn: [your-linkedin-profile]

Project Link: [https://github.com/steph1902/finance-flow-project](https://github.com/steph1902/finance-flow-project)

---

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/ui](https://ui.shadcn.com/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Recharts Documentation](https://recharts.org/en-US/api)