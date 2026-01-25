import { PrismaClient, RecurringFrequency, TransactionType, NotificationType } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Current date reference
const NOW = new Date();

// Enhanced merchant database with more realistic variety
const MERCHANTS = {
    Groceries: ['Whole Foods Market', 'Trader Joe\'s', 'Safeway', 'Kroger', 'Costco Wholesale', 'Sprouts Farmers Market', 'Target', 'Walmart Supercenter'],
    Dining: ['Chipotle Mexican Grill', 'The Cheesecake Factory', 'Olive Garden', 'Panera Bread', 'Five Guys', 'In-N-Out Burger', 'Shake Shack', 'Local Bistro'],
    Coffee: ['Starbucks', 'Peet\'s Coffee', 'Blue Bottle Coffee', 'Philz Coffee', 'Local Coffee Shop', 'Dunkin\''],
    FastFood: ['McDonald\'s', 'Taco Bell', 'Subway', 'Pizza Hut', 'KFC', 'Wendy\'s', 'Burger King'],
    Delivery: ['DoorDash', 'Uber Eats', 'Grubhub', 'Postmates'],
    Transportation: ['Shell', 'Chevron', '76 Gas Station', 'Costco Gas', 'BP', 'Arco'],
    Rideshare: ['Uber', 'Lyft'],
    Utilities: ['PG&E Electric', 'SoCal Gas', 'City Water Utility', 'Comcast Xfinity', 'AT&T', 'Verizon Wireless'],
    Shopping: ['Amazon.com', 'Target', 'Walmart', 'Best Buy', 'Nike', 'H&M', 'Zara', 'Apple Store', 'IKEA', 'Home Depot'],
    Entertainment: ['Netflix', 'Spotify Premium', 'Disney+', 'HBO Max', 'YouTube Premium', 'Amazon Prime', 'AMC Theatres', 'Steam'],
    Healthcare: ['CVS Pharmacy', 'Walgreens', '24 Hour Fitness', 'Planet Fitness', 'Doctor Office', 'Dental Care'],
    Other: ['Amazon.com', 'eBay', 'Etsy', 'PayPal'],
    Salary: ['Tech Corp Inc', 'Acme Industries', 'Innovation Labs'],
    Freelance: ['Freelance Client A', 'Freelance Client B', 'Consulting Project'],
};

// Helper functions
function randomAmount(min: number, max: number): number {
    return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]!;
}

function subtractMonths(date: Date, months: number): Date {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() - months);
    return newDate;
}

function addDays(date: Date, days: number): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
}

// Generate realistic transactions with patterns
function generateEnhancedTransactions(userId: string, months: number) {
    const transactions: Array<{
        userId: string;
        amount: number;
        type: TransactionType;
        category: string;
        description: string;
        date: Date;
    }> = [];

    const startDate = subtractMonths(NOW, months);

    for (let monthOffset = 0; monthOffset < months; monthOffset++) {
        const monthDate = subtractMonths(NOW, months - monthOffset - 1);
        const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();

        // Monthly Income - Salary (1st and 15th of each month)
        transactions.push({
            userId,
            amount: randomAmount(3200, 3350),
            type: 'INCOME',
            category: 'Salary',
            description: `Paycheck - ${MERCHANTS.Salary[0]!}`,
            date: new Date(monthDate.getFullYear(), monthDate.getMonth(), 1, 9, 0),
        });

        transactions.push({
            userId,
            amount: randomAmount(3200, 3350),
            type: 'INCOME',
            category: 'Salary',
            description: `Paycheck - ${MERCHANTS.Salary[0]!}`,
            date: new Date(monthDate.getFullYear(), monthDate.getMonth(), 15, 9, 0),
        });

        // Occasional freelance income
        if (Math.random() > 0.7) {
            transactions.push({
                userId,
                amount: randomAmount(500, 2000),
                type: 'INCOME',
                category: 'Freelance',
                description: randomItem(MERCHANTS.Freelance),
                date: new Date(monthDate.getFullYear(), monthDate.getMonth(), Math.floor(Math.random() * 28) + 1),
            });
        }

        // Monthly Fixed Expenses
        // Rent (1st of month)
        transactions.push({
            userId,
            amount: 1850,
            type: 'EXPENSE',
            category: 'Housing',
            description: 'Monthly Rent Payment',
            date: new Date(monthDate.getFullYear(), monthDate.getMonth(), 1, 8, 0),
        });

        // Utilities
        transactions.push({
            userId,
            amount: randomAmount(110, 145),
            type: 'EXPENSE',
            category: 'Utilities',
            description: MERCHANTS.Utilities[0]!,
            date: new Date(monthDate.getFullYear(), monthDate.getMonth(), 5),
        });

        transactions.push({
            userId,
            amount: 79.99,
            type: 'EXPENSE',
            category: 'Utilities',
            description: `${MERCHANTS.Utilities[3]!} - Internet`,
            date: new Date(monthDate.getFullYear(), monthDate.getMonth(), 10),
        });

        transactions.push({
            userId,
            amount: 85,
            type: 'EXPENSE',
            category: 'Utilities',
            description: `${MERCHANTS.Utilities[5]!} - Mobile`,
            date: new Date(monthDate.getFullYear(), monthDate.getMonth(), 15),
        });

        // Car Insurance
        transactions.push({
            userId,
            amount: 142,
            type: 'EXPENSE',
            category: 'Transportation',
            description: 'Auto Insurance Premium',
            date: new Date(monthDate.getFullYear(), monthDate.getMonth(), 20),
        });

        // Gym Membership
        transactions.push({
            userId,
            amount: 49.99,
            type: 'EXPENSE',
            category: 'Healthcare',
            description: MERCHANTS.Healthcare[2]!,
            date: new Date(monthDate.getFullYear(), monthDate.getMonth(), 1),
        });

        // Subscriptions
        const subscriptions = [
            { name: 'Netflix', amount: 15.99, day: 5 },
            { name: 'Spotify Premium', amount: 10.99, day: 8 },
            { name: 'Amazon Prime', amount: 14.99, day: 12 },
        ];

        subscriptions.forEach(sub => {
            transactions.push({
                userId,
                amount: sub.amount,
                type: 'EXPENSE',
                category: 'Entertainment',
                description: sub.name,
                date: new Date(monthDate.getFullYear(), monthDate.getMonth(), sub.day),
            });
        });

        // Weekly Patterns
        for (let week = 0; week < 4; week++) {
            // Weekly grocery shopping (usually Sunday)
            const groceryDay = week * 7 + (Math.random() > 0.5 ? 0 : 1); // Sunday or Monday
            if (groceryDay < daysInMonth) {
                transactions.push({
                    userId,
                    amount: randomAmount(80, 150),
                    type: 'EXPENSE',
                    category: 'Groceries',
                    description: randomItem(MERCHANTS.Groceries),
                    date: new Date(monthDate.getFullYear(), monthDate.getMonth(), groceryDay + 1, Math.floor(Math.random() * 6) + 10),
                });
            }

            // Gas fill-up (usually mid-week)
            const gasDay = week * 7 + 3 + Math.floor(Math.random() * 2);
            if (gasDay < daysInMonth) {
                transactions.push({
                    userId,
                    amount: randomAmount(45, 75),
                    type: 'EXPENSE',
                    category: 'Transportation',
                    description: randomItem(MERCHANTS.Transportation),
                    date: new Date(monthDate.getFullYear(), monthDate.getMonth(), gasDay + 1),
                });
            }
        }

        // Daily Patterns
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
            const dayOfWeek = currentDate.getDay();

            // Weekday coffee (Mon-Fri, 70% chance)
            if (dayOfWeek >= 1 && dayOfWeek <= 5 && Math.random() > 0.3) {
                transactions.push({
                    userId,
                    amount: randomAmount(4.5, 7.5),
                    type: 'EXPENSE',
                    category: 'Dining',
                    description: randomItem(MERCHANTS.Coffee),
                    date: new Date(currentDate.setHours(8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60))),
                });
            }

            // Lunch transactions (Mon-Fri, 40% chance)
            if (dayOfWeek >= 1 && dayOfWeek <= 5 && Math.random() > 0.6) {
                transactions.push({
                    userId,
                    amount: randomAmount(12, 18),
                    type: 'EXPENSE',
                    category: 'Dining',
                    description: randomItem(MERCHANTS.FastFood),
                    date: new Date(currentDate.setHours(12, Math.floor(Math.random() * 60))),
                });
            }

            // Weekend dining out (Fri-Sun, higher amounts)
            if ((dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0) && Math.random() > 0.6) {
                transactions.push({
                    userId,
                    amount: randomAmount(35, 85),
                    type: 'EXPENSE',
                    category: 'Dining',
                    description: randomItem(MERCHANTS.Dining),
                    date: new Date(currentDate.setHours(18 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 60))),
                });
            }

            // Delivery orders (random, 15% chance)
            if (Math.random() > 0.85) {
                transactions.push({
                    userId,
                    amount: randomAmount(25, 55),
                    type: 'EXPENSE',
                    category: 'Dining',
                    description: randomItem(MERCHANTS.Delivery),
                    date: new Date(currentDate.setHours(18 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 60))),
                });
            }

            // Uber/Lyft rides (random, 10% chance)
            if (Math.random() > 0.9) {
                transactions.push({
                    userId,
                    amount: randomAmount(15, 45),
                    type: 'EXPENSE',
                    category: 'Transportation',
                    description: randomItem(MERCHANTS.Rideshare),
                    date: new Date(currentDate.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60))),
                });
            }
        }

        // Monthly Shopping
        const shoppingCount = Math.floor(Math.random() * 5) + 3; // 3-7 purchases
        for (let i = 0; i < shoppingCount; i++) {
            transactions.push({
                userId,
                amount: randomAmount(25, 300),
                type: 'EXPENSE',
                category: 'Shopping',
                description: randomItem(MERCHANTS.Shopping),
                date: new Date(monthDate.getFullYear(), monthDate.getMonth(), Math.floor(Math.random() * 28) + 1),
            });
        }

        // Healthcare expenses (occasional)
        if (Math.random() > 0.7) {
            transactions.push({
                userId,
                amount: randomAmount(15, 85),
                type: 'EXPENSE',
                category: 'Healthcare',
                description: randomItem(MERCHANTS.Healthcare.slice(0, 2)),
                date: new Date(monthDate.getFullYear(), monthDate.getMonth(), Math.floor(Math.random() * 28) + 1),
            });
        }

        // Entertainment (movies, games, etc.)
        const entertainmentCount = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < entertainmentCount; i++) {
            transactions.push({
                userId,
                amount: randomAmount(12, 60),
                type: 'EXPENSE',
                category: 'Entertainment',
                description: randomItem([...MERCHANTS.Entertainment.slice(6, 8), 'PlayStation Store', 'Concert Tickets']),
                date: new Date(monthDate.getFullYear(), monthDate.getMonth(), Math.floor(Math.random() * 28) + 1),
            });
        }
    }

    return transactions;
}

async function main() {
    console.log('🌱 Seeding ENHANCED natural demo data...\n');

    // Create/update demo user
    const hashedPassword = await bcrypt.hash('Demo1234', 10);

    const demoUser = await prisma.user.upsert({
        where: { email: 'demo@financeflow.com' },
        update: {
            password: hashedPassword,
            name: 'Demo User',
            onboardingCompleted: true,
        },
        create: {
            email: 'demo@financeflow.com',
            name: 'Demo User',
            password: hashedPassword,
            onboardingCompleted: true,
            preferredCurrency: 'USD',
            timezone: 'America/Los_Angeles',
        },
    });

    console.log('✅ Demo user ready:', demoUser.email);

    // Clear existing data
    console.log('🧹 Clearing old data...');
    await prisma.transaction.deleteMany({ where: { userId: demoUser.id } });
    await prisma.recurringTransaction.deleteMany({ where: { userId: demoUser.id } });
    await prisma.budget.deleteMany({ where: { userId: demoUser.id } });
    await prisma.goal.deleteMany({ where: { userId: demoUser.id } });
    await prisma.notification.deleteMany({ where: { userId: demoUser.id } });

    // Generate transactions for last 6 months
    console.log('📝 Generating 6 months of natural transactions...');
    const transactions = generateEnhancedTransactions(demoUser.id, 6);

    // Batch insert
    const batchSize = 100;
    for (let i = 0; i < transactions.length; i += batchSize) {
        const batch = transactions.slice(i, i + batchSize);
        await prisma.transaction.createMany({ data: batch });
        console.log(`   Inserted ${Math.min(i + batchSize, transactions.length)}/${transactions.length}`);
    }

    console.log(`✅ Created ${transactions.length} transactions\n`);

    // Create Recurring Transactions
    console.log('🔄 Creating recurring transactions...');

    const recurringTransactions = [
        {
            userId: demoUser.id,
            amount: 1850,
            type: 'EXPENSE' as TransactionType,
            category: 'Housing',
            description: 'Monthly Rent Payment',
            frequency: 'MONTHLY' as RecurringFrequency,
            startDate: subtractMonths(NOW, 12),
            nextDate: new Date(NOW.getFullYear(), NOW.getMonth() + 1, 1),
            isActive: true,
        },
        {
            userId: demoUser.id,
            amount: 79.99,
            type: 'EXPENSE' as TransactionType,
            category: 'Utilities',
            description: 'Comcast Xfinity - Internet',
            frequency: 'MONTHLY' as RecurringFrequency,
            startDate: subtractMonths(NOW, 12),
            nextDate: new Date(NOW.getFullYear(), NOW.getMonth() + 1, 10),
            isActive: true,
        },
        {
            userId: demoUser.id,
            amount: 85,
            type: 'EXPENSE' as TransactionType,
            category: 'Utilities',
            description: 'Verizon Wireless - Mobile',
            frequency: 'MONTHLY' as RecurringFrequency,
            startDate: subtractMonths(NOW, 12),
            nextDate: new Date(NOW.getFullYear(), NOW.getMonth() + 1, 15),
            isActive: true,
        },
        {
            userId: demoUser.id,
            amount: 15.99,
            type: 'EXPENSE' as TransactionType,
            category: 'Entertainment',
            description: 'Netflix Subscription',
            frequency: 'MONTHLY' as RecurringFrequency,
            startDate: subtractMonths(NOW, 12),
            nextDate: new Date(NOW.getFullYear(), NOW.getMonth() + 1, 5),
            isActive: true,
        },
        {
            userId: demoUser.id,
            amount: 10.99,
            type: 'EXPENSE' as TransactionType,
            category: 'Entertainment',
            description: 'Spotify Premium',
            frequency: 'MONTHLY' as RecurringFrequency,
            startDate: subtractMonths(NOW, 12),
            nextDate: new Date(NOW.getFullYear(), NOW.getMonth() + 1, 8),
            isActive: true,
        },
        {
            userId: demoUser.id,
            amount: 49.99,
            type: 'EXPENSE' as TransactionType,
            category: 'Healthcare',
            description: '24 Hour Fitness Membership',
            frequency: 'MONTHLY' as RecurringFrequency,
            startDate: subtractMonths(NOW, 6),
            nextDate: new Date(NOW.getFullYear(), NOW.getMonth() + 1, 1),
            isActive: true,
        },
        {
            userId: demoUser.id,
            amount: 3275,
            type: 'INCOME' as TransactionType,
            category: 'Salary',
            description: 'Bi-weekly Paycheck',
            frequency: 'BIWEEKLY' as RecurringFrequency,
            startDate: subtractMonths(NOW, 12),
            nextDate: addDays(NOW, 14 - (NOW.getDate() % 14)),
            isActive: true,
        },
    ];

    await prisma.recurringTransaction.createMany({ data: recurringTransactions });
    console.log(`✅ Created ${recurringTransactions.length} recurring transactions\n`);

    // Create Budgets for current month
    console.log('💰 Creating budgets...');

    const budgets = [
        { category: 'Housing', amount: 1900, alertThreshold: 95 },
        { category: 'Utilities', amount: 350, alertThreshold: 90 },
        { category: 'Groceries', amount: 600, alertThreshold: 85 },
        { category: 'Dining', amount: 400, alertThreshold: 80 },
        { category: 'Transportation', amount: 500, alertThreshold: 85 },
        { category: 'Entertainment', amount: 250, alertThreshold: 80 },
        { category: 'Shopping', amount: 400, alertThreshold: 90 },
        { category: 'Healthcare', amount: 200, alertThreshold: 90 },
    ];

    for (const budget of budgets) {
        await prisma.budget.upsert({
            where: {
                userId_category_month_year: {
                    userId: demoUser.id,
                    category: budget.category,
                    month: NOW.getMonth() + 1,
                    year: NOW.getFullYear(),
                },
            },
            update: {
                amount: budget.amount,
                alertThreshold: budget.alertThreshold,
            },
            create: {
                userId: demoUser.id,
                category: budget.category,
                amount: budget.amount,
                month: NOW.getMonth() + 1,
                year: NOW.getFullYear(),
                alertThreshold: budget.alertThreshold,
                rollover: false,
            },
        });
    }

    console.log(`✅ Created ${budgets.length} budgets\n`);

    // Create Goals
    console.log('🎯 Creating savings goals...');

    const goals = [
        {
            userId: demoUser.id,
            name: 'Emergency Fund',
            description: '6 months of living expenses for financial security',
            targetAmount: 18000,
            currentAmount: 7500,
            category: 'Savings',
            status: 'ACTIVE' as const,
            priority: 2,
            targetDate: new Date(NOW.getFullYear() + 1, 11, 31),
        },
        {
            userId: demoUser.id,
            name: 'Vacation to Japan',
            description: '2-week trip to Tokyo and Kyoto',
            targetAmount: 6000,
            currentAmount: 2800,
            category: 'Travel',
            status: 'ACTIVE' as const,
            priority: 1,
            targetDate: new Date(NOW.getFullYear() + 1, 6, 1),
        },
        {
            userId: demoUser.id,
            name: 'New MacBook Pro',
            description: 'Upgrade laptop for work',
            targetAmount: 2500,
            currentAmount: 1200,
            category: 'Tech',
            status: 'ACTIVE' as const,
            priority: 1,
            targetDate: new Date(NOW.getFullYear(), NOW.getMonth() + 4, 1),
        },
        {
            userId: demoUser.id,
            name: 'Home Down Payment',
            description: 'Saving for first home purchase',
            targetAmount: 50000,
            currentAmount: 12000,
            category: 'Housing',
            status: 'ACTIVE' as const,
            priority: 2,
            targetDate: new Date(NOW.getFullYear() + 3, 0, 1),
        },
    ];

    await prisma.goal.createMany({ data: goals });
    console.log(`✅ Created ${goals.length} goals\n`);

    // Create Notifications
    console.log('🔔 Creating notifications...');

    const notifications = [
        {
            userId: demoUser.id,
            type: 'BUDGET_ALERT' as NotificationType,
            title: 'Dining Budget Alert',
            message: 'You\'ve used 85% of your Dining budget for this month.',
            priority: 1,
        },
        {
            userId: demoUser.id,
            type: 'GOAL_MILESTONE' as NotificationType,
            title: 'Goal Milestone Reached!',
            message: 'Congratulations! Your MacBook Pro fund is now 48% complete.',
            priority: 0,
        },
        {
            userId: demoUser.id,
            type: 'BILL_REMINDER' as NotificationType,
            title: 'Upcoming Bill',
            message: 'Your rent payment of $1,850 is due in 3 days.',
            priority: 2,
        },
        {
            userId: demoUser.id,
            type: 'SYSTEM' as NotificationType,
            title: 'Welcome to FinanceFlow!',
            message: 'Your demo account is ready. Explore budgets, goals, and AI-powered insights.',
            priority: 0,
        },
    ];

    await prisma.notification.createMany({ data: notifications });
    console.log(`✅ Created ${notifications.length} notifications\n`);

    // Summary
    const stats = {
        totalIncome: transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0),
        totalExpenses: transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0),
    };

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 ENHANCED DEMO DATA SEEDING COMPLETE!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧 Email:             demo@financeflow.com`);
    console.log(`🔑 Password:          Demo1234`);
    console.log(`📊 Transactions:      ${transactions.length}`);
    console.log(`🔄 Recurring:         ${recurringTransactions.length}`);
    console.log(`💰 Budgets:           ${budgets.length}`);
    console.log(`🎯 Goals:             ${goals.length}`);
    console.log(`🔔 Notifications:     ${notifications.length}`);
    console.log(`💵 Total Income:      $${stats.totalIncome.toFixed(2)}`);
    console.log(`💸 Total Expenses:    $${stats.totalExpenses.toFixed(2)}`);
    console.log(`💎 Net Savings:       $${(stats.totalIncome - stats.totalExpenses).toFixed(2)}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
