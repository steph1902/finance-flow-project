import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Helper function to generate random amounts within a range
function randomAmount(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Helper to get random item from array
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

async function main() {
  console.log('🌱 Seeding database with EXTENSIVE demo data...');

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

  const now = new Date();
  const transactions = [];

  // ============== INCOME TRANSACTIONS (100+ entries) ==============

  // Monthly salary for 12 months
  for (let month = 0; month < 12; month++) {
    const salary = month < 6 ? 5500 : 5300; // Raise after 6 months
    transactions.push({
      userId: demoUser.id,
      amount: salary,
      type: 'INCOME' as const,
      category: 'Salary',
      description: 'Full-time salary - Tech Company',
      monthsAgo: month,
      day: 28,
    });
  }

  // Quarterly bonuses
  [2, 5, 8, 11].forEach(month => {
    transactions.push({
      userId: demoUser.id,
      amount: randomAmount(1500, 3000),
      type: 'INCOME' as const,
      category: 'Salary',
      description: 'Quarterly Performance Bonus',
      monthsAgo: month,
      day: 15,
    });
  });

  // Freelance projects (2-4 per month)
  const freelanceDescriptions = [
    'Website redesign', 'Logo design', 'E-commerce development',
    'Mobile app consultation', 'UI/UX design', 'WordPress customization',
    'React consulting', 'Database optimization', 'API development',
    'SEO optimization', 'Content management system', 'Landing page design'
  ];

  for (let month = 0; month < 12; month++) {
    const projectCount = randomAmount(2, 4);
    for (let i = 0; i < projectCount; i++) {
      transactions.push({
        userId: demoUser.id,
        amount: randomAmount(300, 2500),
        type: 'INCOME' as const,
        category: 'Freelance',
        description: randomItem(freelanceDescriptions),
        monthsAgo: month,
        day: randomAmount(1, 28),
      });
    }
  }

  // Investment income (monthly)
  const investmentTypes = [
    'Stock dividends', 'Index fund dividends', 'Bond interest',
    'Savings account interest', 'Cryptocurrency gains', 'REIT dividends'
  ];

  for (let month = 0; month < 12; month++) {
    const investmentCount = randomAmount(2, 4);
    for (let i = 0; i < investmentCount; i++) {
      transactions.push({
        userId: demoUser.id,
        amount: randomAmount(50, 300),
        type: 'INCOME' as const,
        category: 'Investment',
        description: randomItem(investmentTypes),
        monthsAgo: month,
        day: randomAmount(1, 28),
      });
    }
  }

  // Side business / Other income
  const otherIncomeTypes = [
    'Online course sales', 'Affiliate marketing', 'Digital product sales',
    'Consulting fees', 'Credit card cashback', 'Tax refund',
    'Rebate', 'Product return refund', 'Insurance reimbursement'
  ];

  for (let month = 0; month < 12; month++) {
    const otherCount = randomAmount(1, 3);
    for (let i = 0; i < otherCount; i++) {
      transactions.push({
        userId: demoUser.id,
        amount: randomAmount(25, 800),
        type: 'INCOME' as const,
        category: 'Other',
        description: randomItem(otherIncomeTypes),
        monthsAgo: month,
        day: randomAmount(1, 28),
      });
    }
  }

  // ============== EXPENSE TRANSACTIONS (400+ entries) ==============

  // Monthly recurring expenses
  const recurringExpenses = [
    { category: 'Housing', amount: 1850, description: 'Monthly rent - Downtown apartment' },
    { category: 'Utilities', amount: 85, description: 'Internet - Fiber 1Gbps' },
    { category: 'Utilities', amount: 55, description: 'Mobile phone plan' },
    { category: 'Transportation', amount: 125, description: 'Car insurance' },
    { category: 'Healthcare', amount: 89, description: 'Gym membership' },
    { category: 'Entertainment', amount: 16.99, description: 'Netflix Premium' },
    { category: 'Entertainment', amount: 14.99, description: 'Spotify Premium' },
    { category: 'Entertainment', amount: 19.99, description: 'YouTube Premium' },
    { category: 'Other', amount: 85, description: 'Storage unit rental' },
  ];

  for (let month = 0; month < 12; month++) {
    recurringExpenses.forEach(expense => {
      transactions.push({
        userId: demoUser.id,
        amount: expense.amount,
        type: 'EXPENSE' as const,
        category: expense.category,
        description: expense.description,
        monthsAgo: month,
        day: randomAmount(1, 5),
      });
    });
  }

  // Variable utility bills (monthly)
  for (let month = 0; month < 12; month++) {
    transactions.push({
      userId: demoUser.id,
      amount: randomAmount(90, 150),
      type: 'EXPENSE' as const,
      category: 'Utilities',
      description: 'Electricity bill',
      monthsAgo: month,
      day: 8,
    });
    transactions.push({
      userId: demoUser.id,
      amount: randomAmount(55, 75),
      type: 'EXPENSE' as const,
      category: 'Utilities',
      description: 'Water & sewage',
      monthsAgo: month,
      day: 12,
    });
  }

  // Groceries (weekly - 4 per month)
  const groceryStores = [
    'Whole Foods', 'Trader Joes', 'Costco', 'Safeway',
    'Local farmers market', 'Asian supermarket', 'Organic market'
  ];

  for (let month = 0; month < 12; month++) {
    for (let week = 0; week < 4; week++) {
      transactions.push({
        userId: demoUser.id,
        amount: randomAmount(100, 200),
        type: 'EXPENSE' as const,
        category: 'Groceries',
        description: `${randomItem(groceryStores)} - Weekly shopping`,
        monthsAgo: month,
        day: week * 7 + randomAmount(1, 6),
      });
    }
  }

  // Dining out (5-10 times per month)
  const restaurants = [
    'Italian restaurant', 'Sushi place', 'Mexican restaurant',
    'Thai restaurant', 'Steakhouse', 'Coffee shop', 'Fast food',
    'Chinese restaurant', 'Vietnamese restaurant', 'Indian cuisine',
    'Brunch cafe', 'Pizza place', 'Food truck'
  ];

  for (let month = 0; month < 12; month++) {
    const diningCount = randomAmount(5, 10);
    for (let i = 0; i < diningCount; i++) {
      transactions.push({
        userId: demoUser.id,
        amount: randomAmount(15, 150),
        type: 'EXPENSE' as const,
        category: 'Dining',
        description: randomItem(restaurants),
        monthsAgo: month,
        day: randomAmount(1, 28),
      });
    }
  }

  // Transportation (gas, maintenance, parking)
  for (let month = 0; month < 12; month++) {
    // Gas (2-3 times per month)
    const gasCount = randomAmount(2, 3);
    for (let i = 0; i < gasCount; i++) {
      transactions.push({
        userId: demoUser.id,
        amount: randomAmount(50, 80),
        type: 'EXPENSE' as const,
        category: 'Transportation',
        description: 'Gasoline',
        monthsAgo: month,
        day: randomAmount(1, 28),
      });
    }

    // Occasional maintenance, parking, tolls
    if (Math.random() > 0.5) {
      const transportTypes = [
        { desc: 'Car wash', amount: [25, 45] as const },
        { desc: 'Oil change', amount: [60, 90] as const },
        { desc: 'Parking fee', amount: [15, 40] as const },
        { desc: 'Bridge toll', amount: [5, 25] as const },
        { desc: 'Uber ride', amount: [20, 60] as const },
      ];
      const transport = randomItem(transportTypes);
      transactions.push({
        userId: demoUser.id,
        amount: randomAmount(transport.amount[0]!, transport.amount[1]!),
        type: 'EXPENSE' as const,
        category: 'Transportation',
        description: transport.desc,
        monthsAgo: month,
        day: randomAmount(1, 28),
      });
    }
  }

  // Shopping (2-5 times per month)
  const shoppingItems = [
    { desc: 'Clothing - H&M', range: [30, 150] as const },
    { desc: 'Electronics - Best Buy', range: [50, 800] as const },
    { desc: 'Shoes - Nike', range: [60, 200] as const },
    { desc: 'Home decor - Target', range: [40, 200] as const },
    { desc: 'Books - Amazon', range: [15, 80] as const },
    { desc: 'Kitchen items', range: [30, 150] as const },
    { desc: 'Cosmetics - Sephora', range: [25, 120] as const },
    { desc: 'Sports equipment', range: [40, 300] as const },
  ];

  for (let month = 0; month < 12; month++) {
    const shopCount = randomAmount(2, 5);
    for (let i = 0; i < shopCount; i++) {
      const item = randomItem(shoppingItems);
      transactions.push({
        userId: demoUser.id,
        amount: randomAmount(item.range[0]!, item.range[1]!),
        type: 'EXPENSE' as const,
        category: 'Shopping',
        description: item.desc,
        monthsAgo: month,
        day: randomAmount(1, 28),
      });
    }
  }

  // Healthcare (1-3 times per month)
  const healthcareItems = [
    'Pharmacy - Prescriptions', 'Doctor visit', 'Dentist appointment',
    'Vitamins & supplements', 'Eye exam', 'Physical therapy',
    'Massage therapy', 'Chiropractor', 'Medical copay'
  ];

  for (let month = 0; month < 12; month++) {
    const healthCount = randomAmount(1, 3);
    for (let i = 0; i < healthCount; i++) {
      transactions.push({
        userId: demoUser.id,
        amount: randomAmount(30, 200),
        type: 'EXPENSE' as const,
        category: 'Healthcare',
        description: randomItem(healthcareItems),
        monthsAgo: month,
        day: randomAmount(1, 28),
      });
    }
  }

  // Entertainment & subscriptions
  const entertainmentItems = [
    'Movie theater', 'Concert tickets', 'Video games', 'Books',
    'Streaming service', 'Sports event', 'Museum visit',
    'Amusement park', 'Theater show', 'Bowling', 'Mini golf'
  ];

  for (let month = 0; month < 12; month++) {
    const entertainCount = randomAmount(2, 5);
    for (let i = 0; i < entertainCount; i++) {
      transactions.push({
        userId: demoUser.id,
        amount: randomAmount(15, 250),
        type: 'EXPENSE' as const,
        category: 'Entertainment',
        description: randomItem(entertainmentItems),
        monthsAgo: month,
        day: randomAmount(1, 28),
      });
    }
  }

  // Other expenses (miscellaneous)
  const otherExpenses = [
    'Haircut', 'Dry cleaning', 'Pet supplies', 'Gifts',
    'Charity donation', 'Professional development', 'Online course',
    'Subscription service', 'Home improvement', 'Laundry service'
  ];

  for (let month = 0; month < 12; month++) {
    const otherCount = randomAmount(3, 6);
    for (let i = 0; i < otherCount; i++) {
      transactions.push({
        userId: demoUser.id,
        amount: randomAmount(20, 300),
        type: 'EXPENSE' as const,
        category: 'Other',
        description: randomItem(otherExpenses),
        monthsAgo: month,
        day: randomAmount(1, 28),
      });
    }
  }

  // Create all transactions
  console.log(`📝 Creating ${transactions.length} transactions...`);

  const transactionPromises = transactions.map(tx => {
    const date = new Date(now);
    date.setMonth(date.getMonth() - tx.monthsAgo);
    date.setDate(tx.day);

    return prisma.transaction.create({
      data: {
        userId: tx.userId,
        amount: tx.amount,
        type: tx.type,
        category: tx.category,
        description: tx.description,
        date: date,
      },
    });
  });

  await Promise.all(transactionPromises);
  console.log(`✅ Created ${transactions.length} transactions`);

  // ============== BUDGETS (12 months) ==============
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const budgetCategories = [
    { category: 'Housing', amount: 2000 },
    { category: 'Utilities', amount: 400 },
    { category: 'Groceries', amount: 700 },
    { category: 'Dining', amount: 400 },
    { category: 'Transportation', amount: 600 },
    { category: 'Entertainment', amount: 250 },
    { category: 'Shopping', amount: 500 },
    { category: 'Healthcare', amount: 300 },
    { category: 'Other', amount: 600 },
  ];

  console.log('📊 Creating budgets for past 12 months...');

  for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
    const budgetDate = new Date(now);
    budgetDate.setMonth(budgetDate.getMonth() - monthOffset);
    const month = budgetDate.getMonth() + 1;
    const year = budgetDate.getFullYear();

    for (const budget of budgetCategories) {
      await prisma.budget.upsert({
        where: {
          userId_category_month_year: {
            userId: demoUser.id,
            category: budget.category,
            month: month,
            year: year,
          },
        },
        update: {},
        create: {
          userId: demoUser.id,
          category: budget.category,
          amount: budget.amount,
          month: month,
          year: year,
        },
      });
    }
  }

  console.log(`✅ Created budgets for 12 months`);

  // ============== FINANCIAL GOALS ==============
  const goals = [
    {
      name: 'Emergency Fund',
      targetAmount: 10000,
      currentAmount: 7500,
      deadline: new Date(currentYear + 1, 2, 31),
      category: 'Savings',
    },
    {
      name: 'New Car Down Payment',
      targetAmount: 15000,
      currentAmount: 8200,
      deadline: new Date(currentYear + 1, 5, 30),
      category: 'Transportation',
    },
    {
      name: 'Vacation to Europe',
      targetAmount: 5000,
      currentAmount: 2800,
      deadline: new Date(currentYear + 1, 7, 15),
      category: 'Entertainment',
    },
    {
      name: 'Home Down Payment',
      targetAmount: 50000,
      currentAmount: 12500,
      deadline: new Date(currentYear + 2, 11, 31),
      category: 'Housing',
    },
    {
      name: 'Professional Certification',
      targetAmount: 3000,
      currentAmount: 2100,
      deadline: new Date(currentYear, 11, 31),
      category: 'Other',
    },
  ];

  console.log('🎯 Creating financial goals...');

  for (const goal of goals) {
    await prisma.goal.create({
      data: {
        userId: demoUser.id,
        name: goal.name,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        targetDate: goal.deadline,
        category: goal.category,
      },
    });
  }

  console.log(`✅ Created ${goals.length} financial goals`);

  // ============== RECURRING TRANSACTIONS ==============
  const recurringTransactions = [
    {
      amount: 1850,
      type: 'EXPENSE' as const,
      category: 'Housing',
      description: 'Monthly rent payment',
      frequency: 'MONTHLY' as const,
      day: 1,
    },
    {
      amount: 5500,
      type: 'INCOME' as const,
      category: 'Salary',
      description: 'Monthly salary from Tech Company',
      frequency: 'MONTHLY' as const,
      day: 28,
    },
    {
      amount: 125,
      type: 'EXPENSE' as const,
      category: 'Transportation',
      description: 'Car insurance premium',
      frequency: 'MONTHLY' as const,
      day: 1,
    },
    {
      amount: 89,
      type: 'EXPENSE' as const,
      category: 'Healthcare',
      description: '24 Hour Fitness membership',
      frequency: 'MONTHLY' as const,
      day: 1,
    },
    {
      amount: 85,
      type: 'EXPENSE' as const,
      category: 'Utilities',
      description: 'Internet service - Fiber 1Gbps',
      frequency: 'MONTHLY' as const,
      day: 15,
    },
    {
      amount: 55,
      type: 'EXPENSE' as const,
      category: 'Utilities',
      description: 'Mobile phone plan',
      frequency: 'MONTHLY' as const,
      day: 5,
    },
    {
      amount: 16.99,
      type: 'EXPENSE' as const,
      category: 'Entertainment',
      description: 'Netflix Premium subscription',
      frequency: 'MONTHLY' as const,
      day: 3,
    },
    {
      amount: 14.99,
      type: 'EXPENSE' as const,
      category: 'Entertainment',
      description: 'Spotify Premium subscription',
      frequency: 'MONTHLY' as const,
      day: 5,
    },
    {
      amount: 19.99,
      type: 'EXPENSE' as const,
      category: 'Entertainment',
      description: 'YouTube Premium subscription',
      frequency: 'MONTHLY' as const,
      day: 7,
    },
    {
      amount: 11.99,
      type: 'EXPENSE' as const,
      category: 'Entertainment',
      description: 'Audible subscription',
      frequency: 'MONTHLY' as const,
      day: 12,
    },
    {
      amount: 49,
      type: 'EXPENSE' as const,
      category: 'Other',
      description: 'LinkedIn Learning subscription',
      frequency: 'MONTHLY' as const,
      day: 6,
    },
    {
      amount: 85,
      type: 'EXPENSE' as const,
      category: 'Other',
      description: 'Storage unit rental',
      frequency: 'MONTHLY' as const,
      day: 1,
    },
    {
      amount: 120,
      type: 'EXPENSE' as const,
      category: 'Other',
      description: 'House cleaning service',
      frequency: 'WEEKLY' as const,
      day: 5, // Friday
    },
    {
      amount: 150,
      type: 'EXPENSE' as const,
      category: 'Groceries',
      description: 'Weekly grocery shopping',
      frequency: 'WEEKLY' as const,
      day: 0, // Sunday
    },
    {
      amount: 500,
      type: 'EXPENSE' as const,
      category: 'Other',
      description: 'Investment portfolio contribution',
      frequency: 'MONTHLY' as const,
      day: 30,
    },
  ];

  console.log('🔄 Creating recurring transactions...');

  for (const recurring of recurringTransactions) {
    const startDate = new Date(now.getFullYear(), now.getMonth(), recurring.day);
    const nextDate = new Date(startDate);

    if (recurring.frequency === 'MONTHLY') {
      nextDate.setMonth(nextDate.getMonth() + 1);
    } else if (recurring.frequency === 'WEEKLY') {
      nextDate.setDate(nextDate.getDate() + 7);
    }

    await prisma.recurringTransaction.create({
      data: {
        userId: demoUser.id,
        amount: recurring.amount,
        type: recurring.type,
        category: recurring.category,
        description: recurring.description,
        frequency: recurring.frequency,
        startDate: startDate,
        nextDate: nextDate,
        isActive: true,
      },
    });
  }

  console.log(`✅ Created ${recurringTransactions.length} recurring transactions`);

  console.log('\n🎉 Seeding completed with EXTENSIVE demo data!');
  console.log('📊 Demo account summary:');
  console.log('   Email: demo@financeflow.com');
  console.log('   Password: Demo1234');
  console.log(`   Transactions: ${transactions.length}+ (12 months of detailed data)`);
  console.log(`   Budgets: ${budgetCategories.length * 12} (12 months across ${budgetCategories.length} categories)`);
  console.log(`   Goals: ${goals.length} active goals`);
  console.log(`   Recurring: ${recurringTransactions.length} recurring transactions`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
