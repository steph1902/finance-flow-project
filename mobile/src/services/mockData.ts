/**
 * Mock Data Service
 * Provides realistic mock data for standalone demo
 * In production, replace these calls with actual API endpoints
 */

import type {
    User,
    AuthTokens,
    Transaction,
    TransactionCategory,
    FinancialSummary,
    BudgetProgress,
} from '@/types';

// ============================================================================
// User & Auth Mock Data
// ============================================================================

export const mockAuthData = {
    getLoginResponse(email: string): { user: User; tokens: AuthTokens } {
        return {
            user: {
                id: 'user_001',
                email: email,
                name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                avatarUrl: undefined,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            tokens: {
                accessToken: 'mock_access_token_' + Date.now(),
                refreshToken: 'mock_refresh_token_' + Date.now(),
                expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
            },
        };
    },
};

// ============================================================================
// Transaction Mock Data
// ============================================================================

const generateId = (): string => Math.random().toString(36).substring(2, 15);

const categories: TransactionCategory[] = [
    'food', 'transport', 'shopping', 'entertainment',
    'bills', 'health', 'education', 'salary', 'investment', 'other'
];

const categoryIcons: Record<TransactionCategory, string> = {
    food: '🍔',
    transport: '🚗',
    shopping: '🛍️',
    entertainment: '🎮',
    bills: '📄',
    health: '💊',
    education: '📚',
    salary: '💰',
    investment: '📈',
    other: '📦',
};

export function getCategoryIcon(category: TransactionCategory): string {
    return categoryIcons[category];
}

const mockTransactions: Transaction[] = [
    {
        id: generateId(),
        amount: 5000,
        type: 'income',
        category: 'salary',
        description: 'Monthly Salary',
        date: new Date().toISOString(),
        merchantName: 'TechCorp Inc.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: generateId(),
        amount: 42.50,
        type: 'expense',
        category: 'food',
        description: 'Lunch with colleagues',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        merchantName: 'Good Food Restaurant',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: generateId(),
        amount: 150,
        type: 'expense',
        category: 'transport',
        description: 'Monthly transit pass',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        merchantName: 'City Transit',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: generateId(),
        amount: 89.99,
        type: 'expense',
        category: 'entertainment',
        description: 'Streaming subscriptions',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        merchantName: 'StreamHub',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: generateId(),
        amount: 245.00,
        type: 'expense',
        category: 'shopping',
        description: 'New running shoes',
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        merchantName: 'SportZone',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: generateId(),
        amount: 1200,
        type: 'expense',
        category: 'bills',
        description: 'Rent payment',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: generateId(),
        amount: 500,
        type: 'income',
        category: 'investment',
        description: 'Dividend payment',
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        merchantName: 'BrokerPlus',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: generateId(),
        amount: 75.00,
        type: 'expense',
        category: 'health',
        description: 'Gym membership',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        merchantName: 'FitLife Gym',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

export const mockTransactionData = {
    getTransactions(): Transaction[] {
        return [...mockTransactions].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    },

    getRecentTransactions(limit: number = 5): Transaction[] {
        return this.getTransactions().slice(0, limit);
    },

    addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Transaction {
        const newTransaction: Transaction = {
            ...transaction,
            id: generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        mockTransactions.unshift(newTransaction);
        return newTransaction;
    },
};

// ============================================================================
// Financial Summary Mock Data
// ============================================================================

export const mockFinancialData = {
    getSummary(): FinancialSummary {
        const transactions = mockTransactionData.getTransactions();

        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const budgetProgress: BudgetProgress[] = [
            { category: 'food', budgeted: 400, spent: 285, percentage: 71 },
            { category: 'transport', budgeted: 200, spent: 150, percentage: 75 },
            { category: 'entertainment', budgeted: 150, spent: 89.99, percentage: 60 },
            { category: 'shopping', budgeted: 300, spent: 245, percentage: 82 },
        ];

        return {
            totalBalance: 12450.75,
            monthlyIncome: income,
            monthlyExpenses: expenses,
            savingsRate: Math.round(((income - expenses) / income) * 100),
            recentTransactions: mockTransactionData.getRecentTransactions(5),
            budgetProgress,
        };
    },
};

export { categories, categoryIcons };
