import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Helper function to generate random amounts within a range
function randomAmount(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

// Helper to get random item from array
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

// Helper to get random date within a range
function randomDate(monthsAgo: number): Date {
  const now = new Date();
  const date = new Date(now);
  date.setMonth(date.getMonth() - monthsAgo);
  date.setDate(Math.floor(Math.random() * 28) + 1);
  date.setHours(Math.floor(Math.random() * 14) + 8); // 8am - 10pm
  date.setMinutes(Math.floor(Math.random() * 60));
  return date;
}

async function main() {
  console.log('🌱 Seeding database with 1000+ NATURAL demo transactions...\n');

  // Clear existing data first
  console.log('🧹 Clearing existing demo data...');
  const existingUser = await prisma.user.findUnique({ where: { email: 'demo@financeflow.com' } });
  if (existingUser) {
    await prisma.transaction.deleteMany({ where: { userId: existingUser.id } });
    await prisma.budget.deleteMany({ where: { userId: existingUser.id } });
    await prisma.goal.deleteMany({ where: { userId: existingUser.id } });
    await prisma.recurringTransaction.deleteMany({ where: { userId: existingUser.id } });
    await prisma.notification.deleteMany({ where: { userId: existingUser.id } });
  }

  // Create demo user
  const hashedPassword = await bcrypt.hash('Demo1234', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@financeflow.com' },
    update: { name: 'Alex Johnson' },
    create: {
      email: 'demo@financeflow.com',
      name: 'Alex Johnson',
      password: hashedPassword,
    },
  });
  console.log('✅ Created demo user:', demoUser.email);

  const transactions: Array<{
    userId: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    category: string;
    description: string;
    date: Date;
    merchantName?: string;
  }> = [];

  // ================ REALISTIC INCOME SOURCES ================

  // Primary job salary (24 months - bi-weekly pay)
  const employers = ['Acme Technologies', 'Innovate Corp', 'TechStart Inc'];
  const employer = randomItem(employers);
  const baseSalary = 3250; // ~$6500/month

  for (let month = 0; month < 24; month++) {
    // Two paychecks per month
    for (let paycheck of [1, 15]) {
      const variance = randomAmount(-50, 50);
      transactions.push({
        userId: demoUser.id,
        amount: baseSalary + variance,
        type: 'INCOME',
        category: 'Salary',
        description: `Direct Deposit - ${employer}`,
        date: new Date(new Date().getFullYear(), new Date().getMonth() - month, paycheck),
        merchantName: employer,
      });
    }
  }

  // Annual bonus (December)
  transactions.push({
    userId: demoUser.id,
    amount: randomAmount(8000, 12000),
    type: 'INCOME',
    category: 'Salary',
    description: 'Annual Performance Bonus',
    date: new Date(new Date().getFullYear(), 11, 20),
    merchantName: employer,
  });

  // Freelance income (irregular)
  const freelanceClients = [
    'Startup XYZ', 'Local Restaurant', 'Boutique Agency', 'E-commerce Store',
    'Real Estate Office', 'Dental Practice', 'Law Firm', 'Marketing Agency'
  ];
  const freelanceServices = [
    'Website Development', 'Logo Design', 'SEO Consulting', 'Content Writing',
    'Social Media Setup', 'Email Marketing', 'WordPress Maintenance', 'App Prototype'
  ];

  for (let month = 0; month < 12; month++) {
    const projectCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < projectCount; i++) {
      const client = randomItem(freelanceClients);
      transactions.push({
        userId: demoUser.id,
        amount: randomAmount(350, 2800),
        type: 'INCOME',
        category: 'Freelance',
        description: `${randomItem(freelanceServices)} - ${client}`,
        date: randomDate(month),
        merchantName: client,
      });
    }
  }

  // Dividend income
  const stocks = ['AAPL', 'MSFT', 'VTI', 'VXUS', 'BND', 'VNQ'];
  for (let quarter = 0; quarter < 8; quarter++) {
    for (const stock of stocks.slice(0, Math.floor(Math.random() * 4) + 2)) {
      transactions.push({
        userId: demoUser.id,
        amount: randomAmount(15, 180),
        type: 'INCOME',
        category: 'Investment',
        description: `${stock} Quarterly Dividend`,
        date: new Date(new Date().getFullYear(), (quarter * 3) % 12, randomItem([15, 20, 25])),
        merchantName: 'Fidelity Investments',
      });
    }
  }

  // Side income
  const sideIncomeTypes = [
    { desc: 'eBay Sales', range: [25, 200] },
    { desc: 'Facebook Marketplace', range: [50, 300] },
    { desc: 'Cashback Rewards', range: [15, 75] },
    { desc: 'Survey Rewards', range: [5, 25] },
    { desc: 'Referral Bonus', range: [50, 100] },
    { desc: 'Credit Card Points Redemption', range: [25, 150] },
  ];

  for (let month = 0; month < 12; month++) {
    const count = Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const income = randomItem(sideIncomeTypes);
      transactions.push({
        userId: demoUser.id,
        amount: randomAmount(income.range[0], income.range[1]),
        type: 'INCOME',
        category: 'Other',
        description: income.desc,
        date: randomDate(month),
      });
    }
  }

  // ================ REALISTIC EXPENSE CATEGORIES ================

  // Housing (fixed monthly)
  for (let month = 0; month < 24; month++) {
    transactions.push({
      userId: demoUser.id,
      amount: 2150,
      type: 'EXPENSE',
      category: 'Housing',
      description: 'Monthly Rent - Apartment 4B',
      date: new Date(new Date().getFullYear(), new Date().getMonth() - month, 1),
      merchantName: 'Oakwood Properties LLC',
    });
  }

  // Utilities (variable monthly)
  const utilityProviders = {
    electricity: { name: 'Pacific Gas & Electric', range: [85, 180] },
    gas: { name: 'SoCal Gas', range: [35, 95] },
    water: { name: 'City Water Services', range: [45, 75] },
    internet: { name: 'Comcast Xfinity', amount: 79.99 },
    phone: { name: 'Verizon Wireless', amount: 85 },
  };

  for (let month = 0; month < 12; month++) {
    // Variable utilities
    transactions.push({
      userId: demoUser.id,
      amount: randomAmount(utilityProviders.electricity.range[0], utilityProviders.electricity.range[1]),
      type: 'EXPENSE',
      category: 'Utilities',
      description: 'Electric Bill',
      date: new Date(new Date().getFullYear(), new Date().getMonth() - month, 8),
      merchantName: utilityProviders.electricity.name,
    });
    transactions.push({
      userId: demoUser.id,
      amount: randomAmount(utilityProviders.gas.range[0], utilityProviders.gas.range[1]),
      type: 'EXPENSE',
      category: 'Utilities',
      description: 'Natural Gas',
      date: new Date(new Date().getFullYear(), new Date().getMonth() - month, 12),
      merchantName: utilityProviders.gas.name,
    });
    transactions.push({
      userId: demoUser.id,
      amount: randomAmount(utilityProviders.water.range[0], utilityProviders.water.range[1]),
      type: 'EXPENSE',
      category: 'Utilities',
      description: 'Water & Sewer',
      date: new Date(new Date().getFullYear(), new Date().getMonth() - month, 15),
      merchantName: utilityProviders.water.name,
    });
    // Fixed utilities
    transactions.push({
      userId: demoUser.id,
      amount: utilityProviders.internet.amount,
      type: 'EXPENSE',
      category: 'Utilities',
      description: 'Internet - 500 Mbps',
      date: new Date(new Date().getFullYear(), new Date().getMonth() - month, 5),
      merchantName: utilityProviders.internet.name,
    });
    transactions.push({
      userId: demoUser.id,
      amount: utilityProviders.phone.amount,
      type: 'EXPENSE',
      category: 'Utilities',
      description: 'Mobile Phone - Unlimited Plan',
      date: new Date(new Date().getFullYear(), new Date().getMonth() - month, 18),
      merchantName: utilityProviders.phone.name,
    });
  }

  // Groceries (multiple times per week)
  const groceryStores = [
    { name: 'Whole Foods Market', range: [45, 120] },
    { name: 'Trader Joes', range: [35, 85] },
    { name: 'Costco', range: [150, 350] },
    { name: 'Safeway', range: [40, 95] },
    { name: 'Sprouts Farmers Market', range: [30, 75] },
    { name: 'Target', range: [25, 65] },
    { name: '99 Ranch Market', range: [40, 90] },
  ];

  for (let month = 0; month < 12; month++) {
    const tripsPerMonth = Math.floor(Math.random() * 4) + 6; // 6-10 trips
    for (let i = 0; i < tripsPerMonth; i++) {
      const store = randomItem(groceryStores);
      transactions.push({
        userId: demoUser.id,
        amount: randomAmount(store.range[0], store.range[1]),
        type: 'EXPENSE',
        category: 'Groceries',
        description: store.name,
        date: randomDate(month),
        merchantName: store.name,
      });
    }
  }

  // Dining out (frequent)
  const restaurants = [
    { name: 'Chipotle', range: [12, 18] },
    { name: 'Panera Bread', range: [14, 22] },
    { name: 'The Cheesecake Factory', range: [35, 75] },
    { name: 'Olive Garden', range: [25, 55] },
    { name: 'Local Coffee Shop', range: [5, 12] },
    { name: 'Starbucks', range: [6, 15] },
    { name: 'Sushi Roku', range: [45, 95] },
    { name: 'In-N-Out Burger', range: [8, 16] },
    { name: 'Sweetgreen', range: [14, 20] },
    { name: 'Thai Kitchen', range: [18, 32] },
    { name: 'Pho 88', range: [12, 22] },
    { name: 'Pizzeria Locale', range: [18, 35] },
    { name: 'DoorDash Order', range: [25, 55] },
    { name: 'Uber Eats Order', range: [22, 48] },
    { name: 'Grubhub Order', range: [20, 45] },
  ];

  for (let month = 0; month < 12; month++) {
    const mealsOut = Math.floor(Math.random() * 8) + 10; // 10-18 per month
    for (let i = 0; i < mealsOut; i++) {
      const restaurant = randomItem(restaurants);
      transactions.push({
        userId: demoUser.id,
        amount: randomAmount(restaurant.range[0], restaurant.range[1]),
        type: 'EXPENSE',
        category: 'Dining',
        description: restaurant.name,
        date: randomDate(month),
        merchantName: restaurant.name,
      });
    }
  }

  // Transportation
  const gasStations = ['Shell', 'Chevron', '76 Station', 'Costco Gas', 'Arco'];
  for (let month = 0; month < 12; month++) {
    // Gas (2-4 times per month)
    const fillUps = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < fillUps; i++) {
      transactions.push({
        userId: demoUser.id,
        amount: randomAmount(45, 75),
        type: 'EXPENSE',
        category: 'Transportation',
        description: `Gas - ${randomItem(gasStations)}`,
        date: randomDate(month),
        merchantName: randomItem(gasStations),
      });
    }
    // Car insurance (monthly)
    transactions.push({
      userId: demoUser.id,
      amount: 142,
      type: 'EXPENSE',
      category: 'Transportation',
      description: 'Auto Insurance Premium',
      date: new Date(new Date().getFullYear(), new Date().getMonth() - month, 22),
      merchantName: 'Geico',
    });
    // Occasional Uber/Lyft
    const ridesPerMonth = Math.floor(Math.random() * 4);
    for (let i = 0; i < ridesPerMonth; i++) {
      transactions.push({
        userId: demoUser.id,
        amount: randomAmount(12, 45),
        type: 'EXPENSE',
        category: 'Transportation',
        description: randomItem(['Uber', 'Lyft']) + ' ride',
        date: randomDate(month),
        merchantName: randomItem(['Uber', 'Lyft']),
      });
    }
  }
  // Car maintenance (occasional)
  const carMaintenance = [
    { desc: 'Oil Change - Jiffy Lube', amount: [45, 75] },
    { desc: 'Tire Rotation - Discount Tire', amount: [25, 40] },
    { desc: 'Car Wash - Splash & Dash', amount: [15, 35] },
    { desc: 'Brake Service - Midas', amount: [250, 450] },
    { desc: 'New Tires - Americas Tire', amount: [400, 800] },
  ];
  for (let i = 0; i < 8; i++) {
    const maintenance = randomItem(carMaintenance.slice(0, 3)); // More common ones
    transactions.push({
      userId: demoUser.id,
      amount: randomAmount(maintenance.amount[0], maintenance.amount[1]),
      type: 'EXPENSE',
      category: 'Transportation',
      description: maintenance.desc,
      date: randomDate(Math.floor(Math.random() * 12)),
    });
  }

  // Entertainment & Subscriptions
  const subscriptions = [
    { name: 'Netflix', amount: 15.99 },
    { name: 'Spotify Premium', amount: 10.99 },
    { name: 'YouTube Premium', amount: 13.99 },
    { name: 'Disney+', amount: 10.99 },
    { name: 'HBO Max', amount: 15.99 },
    { name: 'Apple iCloud', amount: 2.99 },
    { name: 'Audible', amount: 14.95 },
    { name: 'Amazon Prime', amount: 14.99 },
  ];

  for (let month = 0; month < 12; month++) {
    for (const sub of subscriptions) {
      transactions.push({
        userId: demoUser.id,
        amount: sub.amount,
        type: 'EXPENSE',
        category: 'Entertainment',
        description: sub.name + ' Subscription',
        date: new Date(new Date().getFullYear(), new Date().getMonth() - month, randomItem([1, 5, 10, 15])),
        merchantName: sub.name,
      });
    }
  }

  // Entertainment activities
  const entertainment = [
    { desc: 'AMC Movie Theater', range: [15, 35] },
    { desc: 'Concert Tickets - Ticketmaster', range: [75, 250] },
    { desc: 'Comedy Show', range: [35, 75] },
    { desc: 'Bowling Night', range: [25, 55] },
    { desc: 'Escape Room', range: [30, 50] },
    { desc: 'Museum Admission', range: [15, 35] },
    { desc: 'Theme Park - Six Flags', range: [60, 120] },
    { desc: 'Video Game - Steam', range: [20, 60] },
    { desc: 'PlayStation Store', range: [15, 70] },
    { desc: 'Book - Amazon', range: [10, 25] },
    { desc: 'Kindle Purchase', range: [8, 18] },
  ];

  for (let month = 0; month < 12; month++) {
    const activities = Math.floor(Math.random() * 4) + 2;
    for (let i = 0; i < activities; i++) {
      const activity = randomItem(entertainment);
      transactions.push({
        userId: demoUser.id,
        amount: randomAmount(activity.range[0], activity.range[1]),
        type: 'EXPENSE',
        category: 'Entertainment',
        description: activity.desc,
        date: randomDate(month),
      });
    }
  }

  // Shopping
  const shoppingStores = [
    { name: 'Amazon', range: [15, 200] },
    { name: 'Target', range: [25, 120] },
    { name: 'Walmart', range: [20, 85] },
    { name: 'Best Buy', range: [50, 500] },
    { name: 'Apple Store', range: [100, 800] },
    { name: 'Nike', range: [65, 180] },
    { name: 'H&M', range: [35, 95] },
    { name: 'Nordstrom', range: [75, 250] },
    { name: 'REI', range: [45, 200] },
    { name: 'IKEA', range: [30, 350] },
    { name: 'Home Depot', range: [25, 150] },
    { name: 'Etsy', range: [20, 75] },
  ];

  for (let month = 0; month < 12; month++) {
    const purchases = Math.floor(Math.random() * 5) + 3;
    for (let i = 0; i < purchases; i++) {
      const store = randomItem(shoppingStores);
      transactions.push({
        userId: demoUser.id,
        amount: randomAmount(store.range[0], store.range[1]),
        type: 'EXPENSE',
        category: 'Shopping',
        description: store.name,
        date: randomDate(month),
        merchantName: store.name,
      });
    }
  }

  // Healthcare
  const healthcareExpenses = [
    { desc: 'CVS Pharmacy', range: [15, 75] },
    { desc: 'Walgreens', range: [12, 65] },
    { desc: 'Doctor Visit Copay', range: [25, 50] },
    { desc: 'Dentist - Cleaning', range: [0, 25] },
    { desc: 'Eye Exam - LensCrafters', range: [25, 75] },
    { desc: 'Prescription - Express Scripts', range: [10, 45] },
    { desc: 'Vitamins - GNC', range: [25, 60] },
    { desc: 'Therapy Session', range: [30, 50] },
  ];

  // Gym membership
  for (let month = 0; month < 12; month++) {
    transactions.push({
      userId: demoUser.id,
      amount: 49.99,
      type: 'EXPENSE',
      category: 'Healthcare',
      description: '24 Hour Fitness Membership',
      date: new Date(new Date().getFullYear(), new Date().getMonth() - month, 1),
      merchantName: '24 Hour Fitness',
    });
    // Other healthcare
    const healthItems = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < healthItems; i++) {
      const item = randomItem(healthcareExpenses);
      transactions.push({
        userId: demoUser.id,
        amount: randomAmount(item.range[0], item.range[1]),
        type: 'EXPENSE',
        category: 'Healthcare',
        description: item.desc,
        date: randomDate(month),
      });
    }
  }

  // Personal care & Other
  const otherExpenses = [
    { desc: 'Haircut - Great Clips', range: [25, 45] },
    { desc: 'Dry Cleaning', range: [20, 50] },
    { desc: 'Pet Supplies - Petco', range: [30, 80] },
    { desc: 'Gift - Birthday', range: [25, 100] },
    { desc: 'Gift - Wedding', range: [75, 200] },
    { desc: 'Gift - Holiday', range: [50, 150] },
    { desc: 'Charity Donation', range: [25, 100] },
    { desc: 'ATM Withdrawal', range: [60, 200] },
    { desc: 'Bank Fee', range: [10, 35] },
    { desc: 'Parking Fee', range: [5, 25] },
    { desc: 'Laundromat', range: [15, 30] },
    { desc: 'Office Supplies - Staples', range: [15, 50] },
    { desc: 'Postage - USPS', range: [5, 20] },
  ];

  for (let month = 0; month < 12; month++) {
    const miscCount = Math.floor(Math.random() * 5) + 3;
    for (let i = 0; i < miscCount; i++) {
      const expense = randomItem(otherExpenses);
      transactions.push({
        userId: demoUser.id,
        amount: randomAmount(expense.range[0], expense.range[1]),
        type: 'EXPENSE',
        category: 'Other',
        description: expense.desc,
        date: randomDate(month),
      });
    }
  }

  // Travel (occasional big expenses)
  const travelExpenses = [
    { desc: 'United Airlines - Flight to NYC', amount: [250, 450] },
    { desc: 'Delta Airlines - Flight to Seattle', amount: [200, 380] },
    { desc: 'Southwest - Flight to Denver', amount: [150, 280] },
    { desc: 'Hotel - Marriott', amount: [150, 300] },
    { desc: 'Hotel - Hilton', amount: [175, 350] },
    { desc: 'Airbnb - Weekend Getaway', amount: [180, 400] },
    { desc: 'Rental Car - Enterprise', amount: [60, 150] },
    { desc: 'VRBO - Beach House', amount: [250, 500] },
  ];

  for (let i = 0; i < 8; i++) {
    const travel = randomItem(travelExpenses);
    transactions.push({
      userId: demoUser.id,
      amount: randomAmount(travel.amount[0], travel.amount[1]),
      type: 'EXPENSE',
      category: 'Other',
      description: travel.desc,
      date: randomDate(Math.floor(Math.random() * 12)),
    });
  }

  console.log(`📝 Creating ${transactions.length} transactions...`);

  // Batch insert transactions
  const batchSize = 100;
  for (let i = 0; i < transactions.length; i += batchSize) {
    const batch = transactions.slice(i, i + batchSize);
    await prisma.transaction.createMany({
      data: batch.map(tx => ({
        userId: tx.userId,
        amount: tx.amount,
        type: tx.type,
        category: tx.category,
        description: tx.description,
        date: tx.date,
      })),
    });
    console.log(`   Inserted ${Math.min(i + batchSize, transactions.length)}/${transactions.length}`);
  }

  console.log(`✅ Created ${transactions.length} transactions\n`);

  // Create budgets
  const budgetCategories = [
    { category: 'Housing', amount: 2300 },
    { category: 'Utilities', amount: 400 },
    { category: 'Groceries', amount: 600 },
    { category: 'Dining', amount: 350 },
    { category: 'Transportation', amount: 500 },
    { category: 'Entertainment', amount: 300 },
    { category: 'Shopping', amount: 400 },
    { category: 'Healthcare', amount: 200 },
    { category: 'Other', amount: 500 },
  ];

  for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
    const budgetDate = new Date();
    budgetDate.setMonth(budgetDate.getMonth() - monthOffset);
    for (const budget of budgetCategories) {
      await prisma.budget.upsert({
        where: {
          userId_category_month_year: {
            userId: demoUser.id,
            category: budget.category,
            month: budgetDate.getMonth() + 1,
            year: budgetDate.getFullYear(),
          },
        },
        update: {},
        create: {
          userId: demoUser.id,
          category: budget.category,
          amount: budget.amount,
          month: budgetDate.getMonth() + 1,
          year: budgetDate.getFullYear(),
        },
      });
    }
  }
  console.log('✅ Created 12 months of budgets\n');

  // Create goals
  const goals = [
    { name: 'Emergency Fund (6 months)', target: 25000, current: 18500, category: 'Savings' },
    { name: 'New Car Down Payment', target: 12000, current: 7800, category: 'Transportation' },
    { name: 'Japan Trip 2026', target: 8000, current: 3200, category: 'Entertainment' },
    { name: 'Home Down Payment', target: 80000, current: 22000, category: 'Housing' },
    { name: 'MBA Program Fund', target: 30000, current: 8500, category: 'Other' },
  ];

  for (const goal of goals) {
    await prisma.goal.create({
      data: {
        userId: demoUser.id,
        name: goal.name,
        targetAmount: goal.target,
        currentAmount: goal.current,
        targetDate: new Date(new Date().getFullYear() + 1, 11, 31),
        category: goal.category,
      },
    });
  }
  console.log(`✅ Created ${goals.length} financial goals\n`);

  // Create notifications
  const notifications = [
    { type: 'BUDGET_ALERT', title: 'Dining Budget Warning', message: 'You\'ve used 85% of your monthly dining budget.' },
    { type: 'GOAL_MILESTONE', title: 'Goal Progress', message: 'Great job! Emergency Fund is now 74% complete.' },
    { type: 'BILL_REMINDER', title: 'Rent Due Tomorrow', message: 'Your rent payment of $2,150 is due tomorrow.' },
    { type: 'SYSTEM', title: 'Welcome to FinanceFlow', message: 'Your account is set up. Start by connecting your bank accounts!' },
  ];

  for (const notif of notifications) {
    await prisma.notification.create({
      data: {
        userId: demoUser.id,
        type: notif.type,
        title: notif.title,
        message: notif.message,
        isRead: false,
      },
    });
  }
  console.log(`✅ Created ${notifications.length} notifications\n`);

  console.log('🎉 Seeding completed with 1000+ transactions!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('   📧 Email:    demo@financeflow.com');
  console.log('   🔑 Password: Demo1234');
  console.log(`   📊 Transactions: ${transactions.length}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
