# FinanceFlow

AI-powered personal finance platform with intelligent transaction categorization, budget optimization, and receipt scanning. Built for users who want automated insights without manual data entry.

---

## Demo

### Dashboard Overview
```
┌─────────────────────────────────────────────────────────────┐
│  Total Balance                    Monthly Spending          │
│  $12,450.75                       $2,847.32                 │
│  ↑ 12% from last month            ▓▓▓▓▓▓▓░░░ 71% of budget │
├─────────────────────────────────────────────────────────────┤
│  Recent Transactions                                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 🍔 Good Food Restaurant    -$42.50    Food      Today  │ │
│  │ 🚗 City Transit            -$150.00   Transport Dec 15 │ │
│  │ 💰 TechCorp Inc.          +$5,000.00  Salary    Dec 14 │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### AI Receipt Scanning
```
┌──────────────────────┐      ┌──────────────────────────────┐
│  📷 Receipt Image    │  →   │  Extracted Data              │
│  ┌────────────────┐  │      │  ─────────────────────       │
│  │ STORE #1234    │  │      │  Merchant: Target            │
│  │ BANANAS  $2.99 │  │      │  Amount: $47.32              │
│  │ MILK     $4.50 │  │      │  Category: Shopping (94%)    │
│  │ TOTAL   $47.32 │  │      │  Date: Dec 17, 2025          │
│  └────────────────┘  │      │  ✓ Auto-categorized          │
└──────────────────────┘      └──────────────────────────────┘
```

---

## Example Usage

### Web Application
```typescript
// Transactions are auto-categorized by AI
const transaction = await createTransaction({
  amount: 42.50,
  description: "Coffee with client",
});
// → { category: "food", confidence: 0.94, merchant: "Starbucks" }

// Budget alerts trigger automatically
const budget = await getBudget("food");
// → { spent: 285, limit: 400, alert: false, remaining: 115 }
```

### Mobile Application
```typescript
// Scan receipt with camera
const receipt = await scanReceipt(imageUri);
// → { amount: 127.43, merchant: "Whole Foods", items: [...] }

// Track spending on the go
const summary = await getMonthSummary();
// → { income: 5500, expenses: 2847, savingsRate: 48 }
```

---

## Key Capabilities

| Capability | Implementation |
|------------|----------------|
| AI Categorization | Gemini 1.5 Flash with learning feedback loop |
| Receipt OCR | Google Cloud Vision with merchant normalization |
| Budget Tracking | Category-specific limits with rollover support |
| Bank Sync | Plaid integration for automatic imports |
| Multi-platform | Next.js web + React Native mobile |
| Background Jobs | BullMQ with Redis for async processing |

---

## Architecture

**Hybrid full-stack design** separating UI rendering from heavy computation:

- **Frontend**: Next.js 16 handles auth, routing, and server components
- **Backend**: NestJS service processes AI pipelines and queued jobs
- **Database**: PostgreSQL via Prisma with type-safe queries
- **Mobile**: Expo + React Native with shared type definitions

This separation allows the frontend to remain fast while AI-intensive operations run asynchronously.

---

## Project Status

**Active Development**

The platform is functional with core features complete. Receipt scanning and budget optimization are stable. Investment tracking is in progress.
