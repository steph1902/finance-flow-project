/**
 * Realistic Demo Data for FinanceFlow
 * Provides relatable scenarios to show instant value to new users
 */

export interface DemoTransaction {
    id: string;
    description: string;
    amount: number;
    category: string;
    date: string;
    emoji: string;
    isRecurring?: boolean;
}

export interface DemoDataPoint {
    date: string;
    income: number;
    expenses: number;
}

/**
 * Demo persona: Freelance Designer
 * Relatable, realistic scenario with common transactions
 */
export const DEMO_TRANSACTIONS: DemoTransaction[] = [
    // Income
    {
        id: 'demo-1',
        description: 'Client Payment - Website Redesign',
        amount: 3500,
        category: 'Freelance Income',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        emoji: '💰',
    },
    {
        id: 'demo-2',
        description: 'Logo Design Project',
        amount: 850,
        category: 'Freelance Income',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        emoji: '🎨',
    },

    // Coffee (the relatable expense!)
    {
        id: 'demo-3',
        description: 'Starbucks (again 😅)',
        amount: -12.5,
        category: 'Food & Dining',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        emoji: '☕',
    },
    {
        id: 'demo-4',
        description: 'Morning Coffee - Blue Bottle',
        amount: -8.0,
        category: 'Food & Dining',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        emoji: '☕',
    },

    // Subscriptions (everyone has these)
    {
        id: 'demo-5',
        description: 'Adobe Creative Cloud',
        amount: -54.99,
        category: 'Subscriptions',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        emoji: '🎨',
        isRecurring: true,
    },
    {
        id: 'demo-6',
        description: 'Spotify Premium',
        amount: -9.99,
        category: 'Entertainment',
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        emoji: '🎵',
        isRecurring: true,
    },
    {
        id: 'demo-7',
        description: 'Netflix',
        amount: -15.99,
        category: 'Entertainment',
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        emoji: '📺',
        isRecurring: true,
    },

    // Transportation
    {
        id: 'demo-8',
        description: 'Uber to client meeting',
        amount: -18.5,
        category: 'Transportation',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        emoji: '🚗',
    },
    {
        id: 'demo-9',
        description: 'Gas - Shell Station',
        amount: -45.0,
        category: 'Transportation',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        emoji: '⛽',
    },

    // Groceries
    {
        id: 'demo-10',
        description: 'Whole Foods',
        amount: -87.32,
        category: 'Groceries',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        emoji: '🛒',
    },
    {
        id: 'demo-11',
        description: 'Trader Joe\'s',
        amount: -52.18,
        category: 'Groceries',
        date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        emoji: '🛒',
    },

    // Dining
    {
        id: 'demo-12',
        description: 'Lunch - Chipotle',
        amount: -14.25,
        category: 'Food & Dining',
        date: new Date().toISOString(),
        emoji: '🌯',
    },
    {
        id: 'demo-13',
        description: 'Dinner - Italian Restaurant',
        amount: -68.5,
        category: 'Food & Dining',
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        emoji: '🍝',
    },

    // Misc
    {
        id: 'demo-14',
        description: 'Amazon - Office Supplies',
        amount: -42.99,
        category: 'Shopping',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        emoji: '📦',
    },
    {
        id: 'demo-15',
        description: 'Gym Membership',
        amount: -49.99,
        category: 'Health & Fitness',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        emoji: '💪',
        isRecurring: true,
    },
];

/**
 * Generate realistic 30-day spending trend
 */
export function generateDemoChartData(): DemoDataPoint[] {
    const data: DemoDataPoint[] = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        // Realistic pattern: higher income on specific days, daily expenses
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        // Income: occasional client payments (simulate freelance)
        let income = 0;
        if (i % 7 === 0) income = 2000 + Math.random() * 1500; // Weekly client payment
        if (i === 15) income = 3500; // Mid-month larger project

        // Expenses: daily spending with variation
        let expenses = 20 + Math.random() * 40; // Base daily expenses $20-60

        // Higher expenses on weekends (dining out)
        if (isWeekend) expenses += 30 + Math.random() * 50;

        // Occasional larger expenses
        if (i === 5) expenses += 350; // Rent portion
        if (i === 12) expenses += 120; // Utilities
        if (i === 20) expenses += 200; // Shopping

        data.push({
            date: date.toISOString().split('T')[0],
            income: Math.round(income),
            expenses: Math.round(expenses),
        });
    }

    return data;
}

/**
 * Relatable AI insights for demo
 */
export const DEMO_AI_INSIGHTS = [
    {
        type: 'spending_alert',
        message: 'You\'re spending $240/mo on coffee - that\'s a vacation fund! ☕→✈️',
        severity: 'info',
    },
    {
        type: 'income_comparison',
        message: 'Your income is 40% higher than average designers in your city 🎉',
        severity: 'positive',
    },
    {
        type: 'budget_tip',
        message: 'Try the "no eating out" challenge this week. You could save $150! 💪',
        severity: 'suggestion',
    },
    {
        type: 'subscription_audit',
        message: 'You have 5 active subscriptions totaling $130/mo. Still using all of them? 🤔',
        severity: 'warning',
    },
];

/**
 * Quick-add transaction templates
 */
export const QUICK_ADD_TEMPLATES = [
    { emoji: '☕', label: 'Coffee', amount: -5, category: 'Food & Dining' },
    { emoji: '🍔', label: 'Lunch', amount: -15, category: 'Food & Dining' },
    { emoji: '🚗', label: 'Ride', amount: -12, category: 'Transportation' },
    { emoji: '🛒', label: 'Groceries', amount: -50, category: 'Groceries' },
    { emoji: '⛽', label: 'Gas', amount: -45, category: 'Transportation' },
    { emoji: '🎬', label: 'Movie', amount: -18, category: 'Entertainment' },
];

/**
 * Demo summary stats
 */
export function calculateDemoStats() {
    const totalIncome = DEMO_TRANSACTIONS
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = Math.abs(
        DEMO_TRANSACTIONS
            .filter(t => t.amount < 0)
            .reduce((sum, t) => sum + t.amount, 0)
    );

    const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;

    return {
        totalIncome,
        totalExpenses,
        netSavings: totalIncome - totalExpenses,
        savingsRate: Math.round(savingsRate),
        transactionCount: DEMO_TRANSACTIONS.length,
        averageTransaction: totalExpenses / DEMO_TRANSACTIONS.filter(t => t.amount < 0).length,
    };
}
