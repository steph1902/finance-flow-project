import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Current date: January 21, 2026
const NOW = new Date('2026-01-21T12:00:00Z');

// Realistic merchant names by category
const MERCHANTS = {
    Food: ['Whole Foods', 'Trader Joes', 'Safeway', 'Local Market', 'Farmers Market', 'Chipotle', 'Panera Bread', 'Starbucks Coffee', 'Subway', 'Pizza Hut'],
    Transport: ['Shell Gas Station', 'Chevron', 'Uber', 'Lyft', 'Metro Card', 'Auto Service', 'Car Wash Express', 'BP Gas'],
    Utilities: ['PG&E Electric', 'Water District', 'Comcast Internet', 'AT&T Mobile', 'Verizon', 'Gas Company'],
    Entertainment: ['Netflix', 'Spotify Premium', 'AMC Theaters', 'Steam Games', 'PlayStation Store', 'Apple Music', 'HBO Max', 'Disney Plus'],
    Shopping: ['Amazon.com', 'Target', 'Walmart', 'Best Buy', 'Nike Store', 'H&M', 'Zara', 'Apple Store', 'IKEA'],
    Health: ['CVS Pharmacy', 'Walgreens', 'HealthFirst Gym', 'Dental Care Plus', 'Vision Center', 'Yoga Studio'],
    Education: ['Coursera', 'Udemy', 'O\'Reilly Books', 'LinkedIn Learning', 'University Bookstore'],
    Housing: ['Rent Payment', 'Property Manager', 'HOA Fees'],
    Salary: ['Company Payroll', 'Freelance Client', 'Consulting Gig'],
    Savings: ['Emergency Fund', 'Investment Transfer', 'Retirement 401k'],
};

// Generate realistic transactions
function generateTransactions(userId: string, startDate: Date, endDate: Date) {
    const transactions = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        const dayOfMonth = currentDate.getDate();
        const dayOfWeek = currentDate.getDay();

        // Monthly salary (1st and 15th)
        if (dayOfMonth === 1 || dayOfMonth === 15) {
            transactions.push({
                userId,
                amount: dayOfMonth === 1 ? 5500 : 2500, // Bi-weekly pay
                type: 'INCOME' as const,
                category: 'Salary',
                description: `Paycheck - ${MERCHANTS.Salary[0]}`,
                date: new Date(currentDate),
            });
        }

        // Monthly rent (1st of month)
        if (dayOfMonth === 1) {
            transactions.push({
                userId,
                amount: 1850,
                type: 'EXPENSE' as const,
                category: 'Housing',
                description: MERCHANTS.Housing[0],
                date: new Date(currentDate),
            });
        }

        // Monthly utilities (5th of month)
        if (dayOfMonth === 5) {
            transactions.push({
                userId,
                amount: 120 + Math.random() * 30,
                type: 'EXPENSE' as const,
                category: 'Utilities',
                description: MERCHANTS.Utilities[0],
                date: new Date(currentDate),
            });
            transactions.push({
                userId,
                amount: 80 + Math.random() * 20,
                type: 'EXPENSE' as const,
                category: 'Utilities',
                description: MERCHANTS.Utilities[2],
                date: new Date(currentDate),
            });
        }

        // Weekly groceries (Sunday)
        if (dayOfWeek === 0) {
            transactions.push({
                userId,
                amount: 120 + Math.random() * 80,
                type: 'EXPENSE' as const,
                category: 'Food',
                description: MERCHANTS.Food[Math.floor(Math.random() * 5)],
                date: new Date(currentDate),
            });
        }

        // Weekday coffee (Mon-Fri)
        if (dayOfWeek >= 1 && dayOfWeek <= 5 && Math.random() > 0.3) {
            transactions.push({
                userId,
                amount: 5 + Math.random() * 3,
                type: 'EXPENSE' as const,
                category: 'Food',
                description: MERCHANTS.Food[7], // Starbucks
                date: new Date(currentDate),
            });
        }

        // Random daily transactions
        const randomTransCount = Math.floor(Math.random() * 3);
        for (let i = 0; i < randomTransCount; i++) {
            const categories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Health'];
            const category = categories[Math.floor(Math.random() * categories.length)]!;
            const merchants = MERCHANTS[category as keyof typeof MERCHANTS];

            transactions.push({
                userId,
                amount: 15 + Math.random() * 85,
                type: 'EXPENSE' as const,
                category,
                description: merchants[Math.floor(Math.random() * merchants.length)],
                date: new Date(currentDate),
            });
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return transactions;
}

async function main() {
    console.log('🌱 Seeding natural demo data for January 2026...\n');

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
        },
    });

    console.log('✅ Demo user ready:', demoUser.email);
    console.log('   Password: Demo1234\n');

    // Clear existing transactions for demo user
    await prisma.transaction.deleteMany({ where: { userId: demoUser.id } });
    console.log('🧹 Cleared old transactions\n');

    // Generate transactions for last 6 months (Aug 2025 - Jan 2026)
    const startDate = new Date('2025-08-01T00:00:00Z');
    const endDate = NOW;

    console.log(`📅 Generating transactions from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}...\n`);

    const transactions = generateTransactions(demoUser.id, startDate, endDate);

    await prisma.transaction.createMany({
        data: transactions,
    });

    console.log(`✅ Created ${transactions.length} natural transactions\n`);

    // Create budgets for current month (January 2026)
    console.log('💰 Creating budgets for January 2026...\n');

    const budgets = [
        { category: 'Food', amount: 800, alertThreshold: 90 },
        { category: 'Transport', amount: 300, alertThreshold: 85 },
        { category: 'Shopping', amount: 400, alertThreshold: 90 },
        { category: 'Entertainment', amount: 200, alertThreshold: 80 },
        { category: 'Health', amount: 150, alertThreshold: 90 },
    ];

    for (const budget of budgets) {
        await prisma.budget.upsert({
            where: {
                userId_category_month_year: {
                    userId: demoUser.id,
                    category: budget.category,
                    month: 1,
                    year: 2026,
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
                month: 1,
                year: 2026,
                alertThreshold: budget.alertThreshold,
                rollover: false,
            },
        });
    }

    console.log('✅ Created 5 budgets with alert thresholds\n');

    // Create savings goals
    console.log('🎯 Creating savings goals...\n');

    await prisma.goal.createMany({
        data: [
            {
                userId: demoUser.id,
                name: 'Emergency Fund',
                description: '6 months of expenses',
                targetAmount: 15000,
                currentAmount: 5200,
                category: 'Savings',
                status: 'ACTIVE',
                priority: 2,
                targetDate: new Date('2026-12-31'),
            },
            {
                userId: demoUser.id,
                name: 'Vacation to Japan',
                description: 'Spring 2027 trip',
                targetAmount: 5000,
                currentAmount: 1800,
                category: 'Travel',
                status: 'ACTIVE',
                priority: 1,
                targetDate: new Date('2027-04-01'),
            },
            {
                userId: demoUser.id,
                name: 'New Laptop',
                description: 'MacBook Pro upgrade',
                targetAmount: 2500,
                currentAmount: 900,
                category: 'Tech',
                status: 'ACTIVE',
                priority: 1,
                targetDate: new Date('2026-06-01'),
            },
        ],
    });

    console.log('✅ Created 3 active savings goals\n');

    // Summary
    const stats = {
        totalIncome: transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0),
        totalExpense: transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0),
    };

    console.log('📊 Summary:');
    console.log(`   Total Income: $${stats.totalIncome.toFixed(2)}`);
    console.log(`   Total Expenses: $${stats.totalExpense.toFixed(2)}`);
    console.log(`   Net Savings: $${(stats.totalIncome - stats.totalExpense).toFixed(2)}\n`);

    console.log('🎉 Demo account is ready!');
    console.log('   Login at: http://localhost:3000/login');
    console.log('   Email: demo@financeflow.com');
    console.log('   Password: Demo1234');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
