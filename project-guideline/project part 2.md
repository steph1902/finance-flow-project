

<think>

User wants me to continue the FSD document. I was in the middle of section 6.1 Design System, specifically at Category Colors. Let me continue from there.

</think>

```css
/* Category Colors for Charts */
--category-food: 34 95% 61%;        /* Orange */
--category-transport: 211 91% 57%;  /* Blue */
--category-shopping: 340 75% 55%;   /* Pink */
--category-bills: 142 71% 45%;      /* Green */
--category-entertainment: 280 87% 65%; /* Purple */
--category-health: 0 72% 51%;       /* Red */
--category-other: 215 14% 34%;      /* Gray */
--category-income: 142 76% 36%;     /* Dark Green */
```

**Typography:**
```css
/* Font Family */
font-family: var(--font-geist-sans), system-ui, sans-serif;

/* Font Sizes */
--font-xs: 0.75rem;    /* 12px */
--font-sm: 0.875rem;   /* 14px */
--font-base: 1rem;     /* 16px */
--font-lg: 1.125rem;   /* 18px */
--font-xl: 1.25rem;    /* 20px */
--font-2xl: 1.5rem;    /* 24px */
--font-3xl: 1.875rem;  /* 30px */
--font-4xl: 2.25rem;   /* 36px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

**Spacing:**
```css
/* Spacing Scale (Tailwind default) */
--spacing-1: 0.25rem;  /* 4px */
--spacing-2: 0.5rem;   /* 8px */
--spacing-3: 0.75rem;  /* 12px */
--spacing-4: 1rem;     /* 16px */
--spacing-5: 1.25rem;  /* 20px */
--spacing-6: 1.5rem;   /* 24px */
--spacing-8: 2rem;     /* 32px */
--spacing-10: 2.5rem;  /* 40px */
--spacing-12: 3rem;    /* 48px */
--spacing-16: 4rem;    /* 64px */
```

**Border Radius:**
```css
--radius-sm: 0.25rem;  /* 4px */
--radius-md: 0.375rem; /* 6px */
--radius-lg: 0.5rem;   /* 8px */
--radius-xl: 0.75rem;  /* 12px */
--radius-2xl: 1rem;    /* 16px */
--radius-full: 9999px; /* Circle */
```

**Shadows:**
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
```

---

### 6.2 Page Layouts

#### **Dashboard Page Layout**

```
┌─────────────────────────────────────────────────────────────┐
│  Header (Fixed, h-16)                                        │
│  [Logo]  Dashboard  Transactions  Budgets    [User Menu]    │
└─────────────────────────────────────────────────────────────┘
│
├─ Sidebar (w-64, hidden on mobile)  │  Main Content
│  [Dashboard icon] Dashboard        │
│  [Transaction icon] Transactions   │  ┌────────────────────┐
│  [Budget icon] Budgets             │  │  Stats Cards Row   │
│  [Settings icon] Settings          │  │  (Grid 4 cols)     │
│                                    │  │                    │
│                                    │  │ [Balance] [Income] │
│                                    │  │ [Expense] [Count]  │
│                                    │  └────────────────────┘
│                                    │
│                                    │  ┌────────────────────┐
│                                    │  │  Charts Row        │
│                                    │  │  (Grid 2 cols)     │
│                                    │  │                    │
│                                    │  │ [Pie Chart]        │
│                                    │  │ [Line Chart]       │
│                                    │  └────────────────────┘
│                                    │
│                                    │  ┌────────────────────┐
│                                    │  │  Recent Trans      │
│                                    │  │  [List of 10]      │
│                                    │  └────────────────────┘
└────────────────────────────────────┘
```

**Responsive Behavior:**
- **Desktop (≥1024px):** Sidebar visible, 4-column stats grid, 2-column charts
- **Tablet (768-1023px):** Sidebar hidden (hamburger menu), 2-column stats, 1-column charts
- **Mobile (<768px):** No sidebar, 1-column stats, 1-column charts, simplified layout

---

#### **Transactions Page Layout**

```
┌─────────────────────────────────────────────────────────────┐
│  Header                                                      │
└─────────────────────────────────────────────────────────────┘
│
├─ Sidebar  │  Main Content
│           │
│           │  ┌──────────────────────────────────────────────┐
│           │  │  Page Header                                 │
│           │  │  Transactions                [+ Add]         │
│           │  └──────────────────────────────────────────────┘
│           │
│           │  ┌──────────────────────────────────────────────┐
│           │  │  Filters Bar                                 │
│           │  │  [Date Range] [Type] [Category] [Search]     │
│           │  └──────────────────────────────────────────────┘
│           │
│           │  ┌──────────────────────────────────────────────┐
│           │  │  Transactions Table                          │
│           │  │  Date │ Category │ Desc │ Amount │ Actions   │
│           │  │  ────────────────────────────────────────    │
│           │  │  11/01│ Salary   │ ... │ +$5000 │ [Edit]    │
│           │  │  11/02│ Food     │ ... │  -$50  │ [Edit]    │
│           │  │  ...                                          │
│           │  └──────────────────────────────────────────────┘
│           │
│           │  ┌──────────────────────────────────────────────┐
│           │  │  Pagination                                  │
│           │  │  [<] 1 2 3 ... 10 [>]    Showing 1-50 of 500│
│           │  └──────────────────────────────────────────────┘
└───────────┘
```

---

#### **Transaction Form (Dialog)**

```
┌─────────────────────────────────────┐
│  Add Transaction              [X]   │
├─────────────────────────────────────┤
│                                     │
│  Amount *                           │
│  ┌─────────────────────────────┐   │
│  │ $  [input]                  │   │
│  └─────────────────────────────┘   │
│                                     │
│  Type *                             │
│  ○ Income   ● Expense               │
│                                     │
│  Category *                         │
│  ┌─────────────────────────────┐   │
│  │ [Select category ▼]         │   │
│  └─────────────────────────────┘   │
│                                     │
│  Description                        │
│  ┌─────────────────────────────┐   │
│  │ [input]                     │   │
│  └─────────────────────────────┘   │
│                                     │
│  Date *                             │
│  ┌─────────────────────────────┐   │
│  │ [11/02/2025]  [📅]          │   │
│  └─────────────────────────────┘   │
│                                     │
│  Notes (optional)                   │
│  ┌─────────────────────────────┐   │
│  │ [textarea]                  │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│              [Cancel]  [Save]       │
└─────────────────────────────────────┘
```

**Validation Display:**
- Red border + error text below field for invalid inputs
- Green checkmark icon for valid inputs (optional)
- Disable submit button until all required fields valid

---

### 6.3 Component States

#### **Button States**

```tsx
// Default
<Button>Click me</Button>

// Loading
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Loading...
</Button>

// Disabled
<Button disabled>Can't click</Button>

// Variants
<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
```

#### **Input States**

```tsx
// Normal
<Input placeholder="Enter amount" />

// Error
<Input className="border-red-500" />
<p className="text-sm text-red-500">Amount is required</p>

// Disabled
<Input disabled placeholder="Disabled" />

// With Icon
<div className="relative">
  <DollarSign className="absolute left-3 top-3 h-4 w-4" />
  <Input className="pl-10" placeholder="0.00" />
</div>
```

#### **Loading States**

```tsx
// Skeleton for Cards
<div className="h-24 bg-muted animate-pulse rounded-lg" />

// Skeleton for Table
<div className="space-y-3">
  <div className="h-4 bg-muted animate-pulse rounded" />
  <div className="h-4 bg-muted animate-pulse rounded" />
  <div className="h-4 bg-muted animate-pulse rounded" />
</div>

// Spinner
<Loader2 className="h-6 w-6 animate-spin" />
```

---

### 6.4 Interaction Patterns

#### **Form Validation**

**Timing:**
- **On Blur:** Validate field when user leaves it
- **On Submit:** Validate all fields before submission
- **On Change:** Clear error when user starts typing (if field was invalid)

**Error Display:**
```tsx
<div>
  <Label htmlFor="amount">Amount *</Label>
  <Input
    id="amount"
    type="number"
    className={errors.amount ? 'border-red-500' : ''}
  />
  {errors.amount && (
    <p className="text-sm text-red-500 mt-1">
      {errors.amount.message}
    </p>
  )}
</div>
```

#### **Toast Notifications**

```tsx
// Success
toast({
  title: "Transaction added",
  description: "Your transaction has been saved successfully.",
  variant: "default",
})

// Error
toast({
  title: "Error",
  description: "Failed to save transaction. Please try again.",
  variant: "destructive",
})

// Info
toast({
  title: "Budget updated",
  description: "Your food budget is now $350/month.",
})
```

**Toast Position:** Bottom right on desktop, bottom center on mobile

**Duration:** 5 seconds (auto-dismiss)

#### **Confirmation Dialogs**

```tsx
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This transaction will be deleted permanently. This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

#### **Empty States**

```tsx
<div className="text-center py-12">
  <FileQuestion className="mx-auto h-12 w-12 text-muted-foreground" />
  <h3 className="mt-4 text-lg font-semibold">No transactions yet</h3>
  <p className="mt-2 text-sm text-muted-foreground">
    Get started by adding your first transaction.
  </p>
  <Button className="mt-4">
    <Plus className="mr-2 h-4 w-4" />
    Add Transaction
  </Button>
</div>
```

---

### 6.5 Accessibility Requirements

**Keyboard Navigation:**
- All interactive elements focusable via Tab
- Modal dialogs trap focus
- Escape key closes dialogs
- Enter key submits forms
- Arrow keys navigate dropdowns/date pickers

**ARIA Labels:**
```tsx
<button aria-label="Close dialog">
  <X className="h-4 w-4" />
</button>

<input
  type="number"
  aria-label="Transaction amount"
  aria-required="true"
  aria-invalid={!!errors.amount}
  aria-describedby={errors.amount ? "amount-error" : undefined}
/>
{errors.amount && (
  <span id="amount-error" role="alert">
    {errors.amount.message}
  </span>
)}
```

**Focus Management:**
```tsx
// Auto-focus first input when dialog opens
<Input ref={firstInputRef} autoFocus />

// Return focus to trigger button when dialog closes
<Dialog onOpenChange={(open) => {
  if (!open) triggerButtonRef.current?.focus();
}}>
```

**Color Contrast:**
- Text: 4.5:1 minimum (WCAG AA)
- Large text: 3:1 minimum
- Interactive elements: 3:1 minimum

**Screen Reader Support:**
- Semantic HTML (`<nav>`, `<main>`, `<article>`)
- Proper heading hierarchy (h1 → h2 → h3)
- Alt text for icons (or aria-hidden if decorative)
- Live regions for dynamic content (toasts, loading states)

```tsx
<div role="status" aria-live="polite" aria-atomic="true">
  Loading transactions...
</div>
```

---

## 7. AUTHENTICATION FLOW

### 7.1 NextAuth.js Configuration

**File: `lib/auth.ts`**

```typescript
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Email + Password
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),

    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  debug: process.env.NODE_ENV === "development",
};
```

### 7.2 Protected Routes (Middleware)

**File: `middleware.ts`**

```typescript
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Custom logic here if needed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/transactions/:path*",
    "/budgets/:path*",
    "/settings/:path*",
    "/api/transactions/:path*",
    "/api/budgets/:path*",
    "/api/dashboard/:path*",
  ],
};
```

### 7.3 Authentication Helpers

**File: `lib/auth-helpers.ts`**

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { NextRequest, NextResponse } from "next/server";

// Get session on server
export async function getSession() {
  return await getServerSession(authOptions);
}

// Get user ID from session
export async function getCurrentUserId() {
  const session = await getSession();
  return session?.user?.id;
}

// Protect API route
export async function withApiAuth(
  handler: (req: NextRequest, userId: string) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return handler(req, userId);
  };
}
```

---

## 8. STATE MANAGEMENT

### 8.1 Server State (React Query / SWR)

**Why:** Manage data fetching, caching, and synchronization

**File: `hooks/useTransactions.ts`**

```typescript
import useSWR from 'swr';

interface UseTransactionsParams {
  page?: number;
  limit?: number;
  type?: 'INCOME' | 'EXPENSE';
  category?: string;
  startDate?: string;
  endDate?: string;
}

export function useTransactions(params: UseTransactionsParams = {}) {
  const queryString = new URLSearchParams(
    Object.entries(params).filter(([_, v]) => v !== undefined)
  ).toString();

  const { data, error, isLoading, mutate } = useSWR(
    `/api/transactions?${queryString}`,
    fetcher
  );

  return {
    transactions: data?.data?.transactions ?? [],
    pagination: data?.data?.pagination,
    isLoading,
    isError: error,
    mutate, // Revalidate data
  };
}

// Create transaction
export async function createTransaction(data: TransactionFormData) {
  const response = await fetch('/api/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create transaction');
  }

  return response.json();
}

// Update transaction
export async function updateTransaction(id: string, data: Partial<TransactionFormData>) {
  const response = await fetch(`/api/transactions/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update transaction');
  }

  return response.json();
}

// Delete transaction
export async function deleteTransaction(id: string) {
  const response = await fetch(`/api/transactions/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete transaction');
  }

  return response.json();
}
```

**File: `hooks/useDashboard.ts`**

```typescript
import useSWR from 'swr';

export function useDashboard(startDate?: string, endDate?: string) {
  const params = new URLSearchParams();
  if (startDate) params.set('startDate', startDate);
  if (endDate) params.set('endDate', endDate);

  const { data, error, isLoading } = useSWR(
    `/api/dashboard/stats?${params.toString()}`,
    fetcher
  );

  return {
    stats: data?.data,
    isLoading,
    isError: error,
  };
}
```

### 8.2 Client State (Zustand - Optional)

**File: `store/ui-store.ts`**

```typescript
import { create } from 'zustand';

interface UIState {
  // Dialog states
  isTransactionDialogOpen: boolean;
  isBudgetDialogOpen: boolean;
  
  // Selected items
  selectedTransaction: Transaction | null;
  selectedBudget: Budget | null;
  
  // Filters
  transactionFilters: {
    type?: 'INCOME' | 'EXPENSE';
    category?: string;
    startDate?: Date;
    endDate?: Date;
    search?: string;
  };
  
  // Actions
  openTransactionDialog: (transaction?: Transaction) => void;
  closeTransactionDialog: () => void;
  setTransactionFilters: (filters: Partial<UIState['transactionFilters']>) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isTransactionDialogOpen: false,
  isBudgetDialogOpen: false,
  selectedTransaction: null,
  selectedBudget: null,
  transactionFilters: {},
  
  openTransactionDialog: (transaction) => set({
    isTransactionDialogOpen: true,
    selectedTransaction: transaction ?? null,
  }),
  
  closeTransactionDialog: () => set({
    isTransactionDialogOpen: false,
    selectedTransaction: null,
  }),
  
  setTransactionFilters: (filters) => set((state) => ({
    transactionFilters: { ...state.transactionFilters, ...filters },
  })),
}));
```

---

## 9. ERROR HANDLING & LOGGING

### 9.1 API Error Handling

**File: `lib/api-error.ts`**

```typescript
export class APIError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleAPIError(error: unknown): Response {
  console.error('API Error:', error);

  if (error instanceof APIError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        details: error.details,
      },
      { status: error.statusCode }
    );
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Record already exists' },
        { status: 409 }
      );
    }
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Record not found' },
        { status: 404 }
      );
    }
  }

  // Default error
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
```

**Usage in API Route:**

```typescript
// app/api/transactions/route.ts
export async function POST(req: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new APIError(401, 'Unauthorized');
    }

    const body = await req.json();
    
    // Validate
    const validated = transactionSchema.parse(body);
    
    // Create
    const transaction = await prisma.transaction.create({
      data: {
        ...validated,
        userId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Transaction created',
        data: transaction,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleAPIError(error);
  }
}
```

### 9.2 Client-Side Error Handling

**File: `components/ErrorBoundary.tsx`**

```typescript
'use client';

import { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
    // TODO: Send to error tracking service (Sentry)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="text-muted-foreground mb-6">
            {this.state.error?.message ?? 'An unexpected error occurred'}
          </p>
          <Button onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Usage:**

```tsx
// app/layout.tsx
<ErrorBoundary>
  <SessionProvider>
    {children}
  </SessionProvider>
</ErrorBoundary>
```

### 9.3 Form Error Handling

```tsx
// components/TransactionForm.tsx
const form = useForm<TransactionFormData>({
  resolver: zodResolver(transactionSchema),
});

async function onSubmit(data: TransactionFormData) {
  try {
    setIsLoading(true);
    
    await createTransaction(data);
    
    toast({
      title: "Success",
      description: "Transaction added successfully",
    });
    
    onClose();
    mutate(); // Revalidate data
  } catch (error) {
    if (error instanceof Error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  } finally {
    setIsLoading(false);
  }
}
```

---

## 10. TESTING STRATEGY

### 10.1 Test Coverage Goals

| Layer | Target Coverage | Tool |
|-------|----------------|------|
| Utilities | 100% | Jest |
| API Routes | 80%+ | Jest + Supertest |
| Components | 70%+ | Jest + React Testing Library |
| E2E Critical Paths | 100% | Playwright (optional) |

### 10.2 Unit Tests (Utilities)

**File: `lib/__tests__/utils.test.ts`**

```typescript
import { formatCurrency, calculatePercentage } from '../utils';

describe('formatCurrency', () => {
  it('formats positive amounts correctly', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('formats negative amounts correctly', () => {
    expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
  });

  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });
});

describe('calculatePercentage', () => {
  it('calculates percentage correctly', () => {
    expect(calculatePercentage(50, 200)).toBe(25);
  });

  it('handles division by zero', () => {
    expect(calculatePercentage(50, 0)).toBe(0);
  });
});
```

### 10.3 API Route Tests

**File: `app/api/transactions/__tests__/route.test.ts`**

```typescript
import { POST, GET } from '../route';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-helpers';

// Mock dependencies
jest.mock('@/lib/prisma');
jest.mock('@/lib/auth-helpers');

describe('POST /api/transactions', () => {
  const mockUserId = 'user123';
  
  beforeEach(() => {
    (getSession as jest.Mock).mockResolvedValue({
      user: { id: mockUserId },
    });
  });

  it('creates transaction successfully', async () => {
    const mockTransaction = {
      id: 'trx123',
      userId: mockUserId,
      amount: 50,
      type: 'EXPENSE',
      category: 'Food',
      date: new Date(),
    };

    (prisma.transaction.create as jest.Mock).mockResolvedValue(mockTransaction);

    const req = new Request('http://localhost:3000/api/transactions', {
      method: 'POST',
      body: JSON.stringify({
        amount: 50,
        type: 'EXPENSE',
        category: 'Food',
        date: new Date().toISOString(),
      }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data).toEqual(mockTransaction);
  });

  it('returns 401 if not authenticated', async () => {
    (getSession as jest.Mock).mockResolvedValue(null);

    const req = new Request('http://localhost:3000/api/transactions', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(req);
    
    expect(response.status).toBe(401);
  });

  it('returns 422 for invalid data', async () => {
    const req = new Request('http://localhost:3000/api/transactions', {
      method: 'POST',
      body: JSON.stringify({
        amount: -50, // Invalid: negative amount
        type: 'INVALID_TYPE',
      }),
    });

    const response = await POST(req);
    
    expect(response.status).toBe(422);
  });
});
```

### 10.4 Component Tests

**File: `components/__tests__/TransactionForm.test.tsx`**

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransactionForm } from '../TransactionForm';

describe('TransactionForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(
      <TransactionForm
        mode="create"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(
      <TransactionForm
        mode="create"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const submitButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/amount is required/i)).toBeInTheDocument();
      expect(screen.getByText(/category is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    
    render(
      <TransactionForm
        mode="create"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    await user.type(screen.getByLabelText(/amount/i), '50');
    await user.click(screen.getByLabelText(/expense/i));
    await user.selectOptions(screen.getByLabelText(/category/i), 'Food');
    await user.type(screen.getByLabelText(/description/i), 'Groceries');

    const submitButton = screen.getByRole('button', { name: /save/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 50,
          type: 'EXPENSE',
          category: 'Food',
          description: 'Groceries',
        })
      );
    });
  });

  it('pre-fills form in edit mode', () => {
    const initialData = {
      id: 'trx123',
      amount: 100,
      type: 'INCOME' as const,
      category: 'Salary',
      description: 'Monthly salary',
      date: new Date('2025-11-01'),
    };

    render(
      <TransactionForm
        mode="edit"
        initialData={initialData}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByDisplayValue('100')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Salary')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Monthly salary')).toBeInTheDocument();
  });
});
```

### 10.5 E2E Tests (Optional with Playwright)

**File: `e2e/auth.spec.ts`**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('user can sign up', async ({ page }) => {
    await page.goto('/signup');

    await page.fill('[name="name"]', 'Test User');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'SecurePass123');

    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('user can log in', async ({ page }) => {
    await page.goto('/login');

    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'SecurePass123');

    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');
  });
});
```

**File: `e2e/transactions.spec.ts`**

```typescript
test.describe('Transactions', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'SecurePass123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('user can add a transaction', async ({ page }) => {
    await page.goto('/transactions');
    
    await page.click('button:has-text("Add Transaction")');
    
    await page.fill('[name="amount"]', '50');
    await page.click('text=Expense');
    await page.selectOption('[name="category"]', 'Food');
    await page.fill('[name="description"]', 'Groceries');
    
    await page.click('button:has-text("Save")');
    
    await expect(page.locator('text=Transaction added')).toBeVisible();
    await expect(page.locator('text=Groceries')).toBeVisible();
  });

  test('user can edit a transaction', async ({ page }) => {
    await page.goto('/transactions');
    
    await page.click('button[aria-label="Edit transaction"]:first');
    
    await page.fill('[name="amount"]', '75');
    await page.click('button:has-text("Update")');
    
    await expect(page.locator('text=Transaction updated')).toBeVisible();
    await expect(page.locator('text=$75')).toBeVisible();
  });

  test('user can delete a transaction', async ({ page }) => {
    await page.goto('/transactions');
    
    await page.click('button[aria-label="Delete transaction"]:first');
    await page.click('button:has-text("Delete")'); // Confirm
    
    await expect(page.locator('text=Transaction deleted')).toBeVisible();
  });
});
```

---

## 11. DEPLOYMENT

### 11.1 Environment Variables

**File: `.env.example`**

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/financeflow?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here" # Generate: openssl rand -base64 32

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Environment
NODE_ENV="development"
```

**Production Environment Variables (Vercel):**

```bash
DATABASE_URL="postgresql://..." # Supabase connection string
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="..." # Strong random secret
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
NODE_ENV="production"
```

### 11.2 Vercel Deployment Steps

**1. Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/financeflow.git
git push -u origin main
```

**2. Connect to Vercel:**
- Go to vercel.com
- Click "New Project"
- Import from GitHub
- Select your repository

**3. Configure Build Settings:**
```
Framework Preset: Next.js
Build Command: npm run build (default)
Output Directory: .next (default)
Install Command: npm install (default)
```

**4. Add Environment Variables:**
- Add all variables from `.env.example`
- Make sure `NEXTAUTH_URL` uses your Vercel URL

**5. Deploy:**
- Click "Deploy"
- Wait 2-3 minutes
- Your app is live! 🎉

### 11.3 Supabase Setup

**1. Create Project:**
- Go to supabase.com
- Click "New Project"
- Choose project name, database password, region
- Wait ~2 minutes for provisioning

**2. Get Connection String:**
- Go to Project Settings → Database
- Copy "Connection String" (Transaction pooler)
- Replace `[YOUR-PASSWORD]` with your database password
- This is your `DATABASE_URL`

**3. Run Migrations:**
```bash
# Local development
npx prisma migrate dev --name init

# Production (from local)
DATABASE_URL="your-supabase-url" npx prisma migrate deploy
```

**4. (Optional) Enable Row Level Security:**
```sql
-- Run in Supabase SQL Editor
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- Policies (example)
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);
```

### 11.4 Post-Deployment Checklist

- [ ] App loads without errors
- [ ] Signup works
- [ ] Login works
- [ ] Google OAuth works (if configured)
- [ ] Add transaction works
- [ ] Dashboard displays data
- [ ] Charts render correctly
- [ ] Mobile responsive
- [ ] Lighthouse score 90+
- [ ] No console errors
- [ ] Environment variables set
- [ ] Database accessible
- [ ] Custom domain configured (optional)

---

## 12. FUTURE ENHANCEMENTS (Post-MVP)

### Phase 2 Features (Weeks 2-3)

**Budget Alerts:**
- Email notification when approaching budget limit
- Push notifications (PWA)
- Weekly spending summary email

**Recurring Transactions:**
- Auto-create monthly bills (rent, subscriptions)
- Templates for common transactions
- Skip/edit recurring entries

**Data Export:**
- Export to PDF report (monthly summary)
- Export to Excel (full transaction history)
- Automatic weekly email reports

### Phase 3 Features (Month 2)

**Multi-Currency:**
- Support multiple currencies
- Auto-conversion rates (API)
- Currency-specific formatting

**Bank Integration:**
- Plaid API for bank connections
- Auto-import transactions
- Account balance sync

**Financial Goals:**
- Set savings goals
- Track progress
- Goal completion notifications

**Advanced Analytics:**
- Year-over-year comparisons
- Spending trends
- Category insights (AI-powered suggestions)

### Phase 4 Features (Month 3+)

**Mobile Apps:**
- React Native iOS/Android
- Push notifications
- Offline support

**Investment Tracking:**
- Stock portfolio
- Crypto holdings
- Net worth calculation

**Shared Accounts:**
- Family budgeting
- Collaborative planning
- Permission management

**AI Features:**
- Auto-categorize transactions
- Spending insights
- Budget recommendations

---

## 13. MAINTENANCE & MONITORING

### 13.1 Monitoring

**Tools:**
- **Vercel Analytics:** Built-in (free)
- **Sentry:** Error tracking (optional)
- **Uptime Robot:** Uptime monitoring (free)

**Metrics to Track:**
- Error rate
- API response times
- Page load times
- User signups
- Active users

### 13.2 Database Maintenance

```sql
-- Run weekly in Supabase SQL Editor

-- Cleanup soft-deleted transactions (older than 30 days)
DELETE FROM transactions
WHERE deleted_at IS NOT NULL
  AND deleted_at < NOW() - INTERVAL '30 days';

-- Vacuum and analyze
VACUUM ANALYZE transactions;
VACUUM ANALYZE users;
```

### 13.3 Dependency Updates

```bash
# Check for outdated packages
npm outdated

# Update all dependencies (minor versions)
npm update

# Update major versions (carefully)
npm install next@latest react@latest
```

---

## 14. DOCUMENTATION

### 14.1 README.md

```markdown
# 📊 FinanceFlow - Personal Finance Tracker

> A modern, full-stack personal finance management application built with Next.js 14, TypeScript, and PostgreSQL.

## ✨ Features

- 🔐 Secure authentication (email + Google OAuth)
- 💰 Transaction management (income/expenses)
- 📊 Interactive analytics dashboard
- 📈 Spending insights by category
- 💾 Budget tracking
- 📱 Fully responsive design
- 🌙 Dark mode support

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript, TailwindCSS, Shadcn/ui
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL (Supabase)
- **Auth:** NextAuth.js
- **Charts:** Recharts
- **Deployment:** Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- PostgreSQL database (or Supabase account)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/financeflow.git
cd financeflow
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

## 📚 Documentation

- [Product Requirements Document (PRD)](./docs/PRD.md)
- [Functional Specification Document (FSD)](./docs/FSD.md)
- [API Documentation](./docs/API.md)

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Generate coverage report
npm test:coverage
```

## 📈 Performance

- **Lighthouse Score:** 92/100
- **Load Time:** <2s (3G)
- **Bundle Size:** <200KB (gzipped)

## 🤝 Contributing

This is a portfolio project, but suggestions are welcome! Open an issue or submit a PR.

## 📧 Contact

Stephanus Sujatmoko
- Email: stephanus1902@gmail.com
- Portfolio: [kairos-projects.com](https://kairos-projects.com)
- LinkedIn: [stephanussujatmoko](https://linkedin.com/in/stephanussujatmoko)

## 📄 License

MIT License - feel free to use this project as inspiration for your own!
```

---

## ✅ FINAL CHECKLIST - Ready to Build!

### **Pre-Development:**
- [ ] Read entire PRD & FSD
- [ ] Setup GitHub repository
- [ ] Setup Supabase account
- [ ] Setup Vercel account
- [ ] Install VS Code extensions (ESLint, Prettier, Prisma)

### **Week 1: Foundation (Days 1-2)**
- [ ] Init Next.js project with TypeScript
- [ ] Setup TailwindCSS & Shadcn/ui
- [ ] Setup Prisma & Supabase connection
- [ ] Create database schema
- [ ] Run migrations
- [ ] Setup NextAuth.js
- [ ] Create signup/login pages
- [ ] Test authentication flow

### **Week 1: Core Features (Days 3-4)**
- [ ] Create transaction API routes (CRUD)
- [ ] Create transaction form component
- [ ] Create transaction list component
- [ ] Implement filters & search
- [ ] Test transaction operations

### **Week 1: Dashboard (Days 5-6)**
- [ ] Create dashboard stats API
- [ ] Create stats cards
- [ ] Implement pie chart
- [ ] Implement line chart
- [ ] Create recent transactions widget
- [ ] Test dashboard data flow

### **Week 1: Polish (Day 7)**
- [ ] Responsive design (test on mobile)
- [ ] Dark mode toggle
- [ ] Loading states
- [ ] Error handling
- [ ] Toast notifications
- [ ] Form validations
- [ ] Deploy to Vercel
- [ ] Test production build

### **Post-Launch:**
- [ ] Write README
- [ ] Take screenshots
- [ ] Record demo video (2 mins)
- [ ] Update resume with project
- [ ] Update LinkedIn featured section
- [ ] Share on Twitter/LinkedIn
- [ ] Start applying to jobs! 🚀

---

## 🎉 YOU'RE READY TO BUILD!

You now have:
✅ Complete Product Requirements Document  
✅ Complete Functional Specification Document  
✅ Database schema  
✅ API specifications  
✅ Component architecture  
✅ UI/UX guidelines  
✅ Authentication flow  
✅ Testing strategy  
✅ Deployment guide  

**Time to code! Start with Day 1 tasks and build your impressive portfolio project.** 💪

**Questions while building? Just ask me!** 😊