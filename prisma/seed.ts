import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('Demo1234', 10);
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@financeflow.com' },
    update: {},
    create: {
      email: 'demo@financeflow.com',
      name: 'Demo User',
      password: hashedPassword,
    },
  });

  console.log('✅ Created demo user:', demoUser.email);

  // Create transactions for the past 3 months
  const now = new Date();
  const transactions = [];

  // Income transactions
  const incomeData = [
    { amount: 5000, category: 'Salary', description: 'Monthly salary', monthsAgo: 0 },
    { amount: 5000, category: 'Salary', description: 'Monthly salary', monthsAgo: 1 },
    { amount: 5000, category: 'Salary', description: 'Monthly salary', monthsAgo: 2 },
    { amount: 800, category: 'Freelance', description: 'Web development project', monthsAgo: 0 },
    { amount: 1200, category: 'Freelance', description: 'Consulting work', monthsAgo: 1 },
    { amount: 150, category: 'Investment', description: 'Stock dividends', monthsAgo: 0 },
    { amount: 200, category: 'Investment', description: 'Interest income', monthsAgo: 2 },
  ];

  // Expense transactions
  const expenseData = [
    // Housing
    { amount: 1500, category: 'Housing', description: 'Monthly rent', monthsAgo: 0 },
    { amount: 1500, category: 'Housing', description: 'Monthly rent', monthsAgo: 1 },
    { amount: 1500, category: 'Housing', description: 'Monthly rent', monthsAgo: 2 },
    { amount: 120, category: 'Utilities', description: 'Electricity bill', monthsAgo: 0 },
    { amount: 110, category: 'Utilities', description: 'Electricity bill', monthsAgo: 1 },
    { amount: 80, category: 'Utilities', description: 'Water bill', monthsAgo: 0 },
    
    // Food
    { amount: 450, category: 'Groceries', description: 'Weekly groceries', monthsAgo: 0 },
    { amount: 380, category: 'Groceries', description: 'Weekly groceries', monthsAgo: 1 },
    { amount: 420, category: 'Groceries', description: 'Weekly groceries', monthsAgo: 2 },
    { amount: 85, category: 'Dining', description: 'Restaurant dinner', monthsAgo: 0 },
    { amount: 45, category: 'Dining', description: 'Lunch with colleagues', monthsAgo: 0 },
    { amount: 120, category: 'Dining', description: 'Weekend brunch', monthsAgo: 1 },
    
    // Transportation
    { amount: 250, category: 'Transportation', description: 'Gas for car', monthsAgo: 0 },
    { amount: 280, category: 'Transportation', description: 'Gas for car', monthsAgo: 1 },
    { amount: 60, category: 'Transportation', description: 'Public transit pass', monthsAgo: 0 },
    { amount: 150, category: 'Transportation', description: 'Car maintenance', monthsAgo: 2 },
    
    // Entertainment
    { amount: 15, category: 'Entertainment', description: 'Netflix subscription', monthsAgo: 0 },
    { amount: 15, category: 'Entertainment', description: 'Netflix subscription', monthsAgo: 1 },
    { amount: 75, category: 'Entertainment', description: 'Concert tickets', monthsAgo: 0 },
    { amount: 45, category: 'Entertainment', description: 'Movie night', monthsAgo: 1 },
    { amount: 120, category: 'Entertainment', description: 'Gaming subscription', monthsAgo: 2 },
    
    // Shopping
    { amount: 200, category: 'Shopping', description: 'Clothing purchase', monthsAgo: 0 },
    { amount: 350, category: 'Shopping', description: 'Electronics', monthsAgo: 1 },
    { amount: 80, category: 'Shopping', description: 'Books and supplies', monthsAgo: 2 },
    
    // Health
    { amount: 150, category: 'Healthcare', description: 'Gym membership', monthsAgo: 0 },
    { amount: 150, category: 'Healthcare', description: 'Gym membership', monthsAgo: 1 },
    { amount: 85, category: 'Healthcare', description: 'Doctor visit', monthsAgo: 2 },
    { amount: 45, category: 'Healthcare', description: 'Pharmacy', monthsAgo: 0 },
    
    // Other
    { amount: 50, category: 'Other', description: 'Haircut', monthsAgo: 0 },
    { amount: 100, category: 'Other', description: 'Pet supplies', monthsAgo: 1 },
    { amount: 200, category: 'Other', description: 'Home improvements', monthsAgo: 2 },
  ];

  // Create income transactions
  for (const item of incomeData) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - item.monthsAgo);
    date.setDate(Math.floor(Math.random() * 28) + 1);

    transactions.push(
      prisma.transaction.create({
        data: {
          userId: demoUser.id,
          amount: item.amount,
          type: 'INCOME',
          category: item.category,
          description: item.description,
          date: date,
        },
      })
    );
  }

  // Create expense transactions
  for (const item of expenseData) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - item.monthsAgo);
    date.setDate(Math.floor(Math.random() * 28) + 1);

    transactions.push(
      prisma.transaction.create({
        data: {
          userId: demoUser.id,
          amount: item.amount,
          type: 'EXPENSE',
          category: item.category,
          description: item.description,
          date: date,
        },
      })
    );
  }

  await Promise.all(transactions);
  console.log(`✅ Created ${transactions.length} transactions`);

  // Create budgets for current month
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const budgets = [
    { category: 'Housing', amount: 1600 },
    { category: 'Groceries', amount: 500 },
    { category: 'Dining', amount: 200 },
    { category: 'Transportation', amount: 350 },
    { category: 'Entertainment', amount: 150 },
    { category: 'Shopping', amount: 300 },
    { category: 'Healthcare', amount: 200 },
    { category: 'Utilities', amount: 150 },
  ];

  for (const budget of budgets) {
    await prisma.budget.upsert({
      where: {
        userId_category_month_year: {
          userId: demoUser.id,
          category: budget.category,
          month: currentMonth,
          year: currentYear,
        },
      },
      update: {},
      create: {
        userId: demoUser.id,
        category: budget.category,
        amount: budget.amount,
        month: currentMonth,
        year: currentYear,
      },
    });
  }

  console.log(`✅ Created ${budgets.length} budgets`);
  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
