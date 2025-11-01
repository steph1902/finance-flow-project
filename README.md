<div align="center">

# 💰 FinanceFlow

### Modern Personal Finance Management System

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

[🚀 Live Demo](https://finance-flow.vercel.app) · [📖 Documentation](./docs) · [🐛 Report Bug](https://github.com/stephanus/finance-flow/issues) · [✨ Request Feature](https://github.com/stephanus/finance-flow/issues)

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
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Components**: [Shadcn/ui](https://ui.shadcn.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **State**: [SWR](https://swr.vercel.app/) (Server state)
- **Icons**: [Lucide React](https://lucide.dev/)

### **Backend**
- **Runtime**: [Node.js 20](https://nodejs.org/)
- **API**: Next.js API Routes (REST)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostgreSQL 15](https://www.postgresql.org/)
- **Auth**: [NextAuth.js](https://next-auth.js.org/)
- **Validation**: [Zod](https://zod.dev/)

### **DevOps & Tools**
- **Deployment**: [Vercel](https://vercel.com/)
- **Database Hosting**: [Supabase](https://supabase.com/)
- **Version Control**: Git & GitHub
- **Code Quality**: ESLint, Prettier
- **Testing**: Jest, React Testing Library
- **CI/CD**: GitHub Actions

### **Architecture**
