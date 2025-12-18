/**
 * FinanceFlow Mobile App - Type Definitions
 * All core TypeScript interfaces and types for the application
 */

// ============================================================================
// User & Authentication Types
// ============================================================================

export interface User {
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthState {
    user: User | null;
    tokens: AuthTokens | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

// ============================================================================
// Financial Data Types
// ============================================================================

export type TransactionType = 'income' | 'expense';

export type TransactionCategory =
    | 'food'
    | 'transport'
    | 'shopping'
    | 'entertainment'
    | 'bills'
    | 'health'
    | 'education'
    | 'salary'
    | 'investment'
    | 'other';

export interface Transaction {
    id: string;
    amount: number;
    type: TransactionType;
    category: TransactionCategory;
    description: string;
    date: string;
    merchantName?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTransactionPayload {
    amount: number;
    type: TransactionType;
    category: TransactionCategory;
    description: string;
    date: string;
    merchantName?: string;
}

export interface Budget {
    id: string;
    category: TransactionCategory;
    amount: number;
    spent: number;
    month: string; // YYYY-MM format
    alertThreshold: number; // percentage 0-100
}

export interface Account {
    id: string;
    name: string;
    type: 'checking' | 'savings' | 'credit' | 'investment';
    balance: number;
    currency: string;
    institution?: string;
}

export interface FinancialSummary {
    totalBalance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    savingsRate: number;
    recentTransactions: Transaction[];
    budgetProgress: BudgetProgress[];
}

export interface BudgetProgress {
    category: TransactionCategory;
    budgeted: number;
    spent: number;
    percentage: number;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface ApiError {
    success: false;
    message: string;
    code?: string;
    errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// ============================================================================
// UI State Types
// ============================================================================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
    data: T | null;
    status: LoadingState;
    error: string | null;
}

// ============================================================================
// Form Types
// ============================================================================

export interface LoginFormData {
    email: string;
    password: string;
}

export interface TransactionFormData {
    amount: string;
    type: TransactionType;
    category: TransactionCategory;
    description: string;
    date: Date;
    merchantName: string;
}
