import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Helper function to calculate next date for recurring transactions
// function calculateNextDate(startDate: Date, frequency: string): Date {



async function main() {
  console.log('🌱 Seeding comprehensive demo data...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('Demo1234', 10);

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@financeflow.com' },
    update: {
      password: hashedPassword,
    },
    create: {
      email: 'demo@financeflow.com',
      name: 'Demo User',
      password: hashedPassword,
    },
  });

  console.log('✅ Created demo user:', demoUser.email);
  console.log('   Password: Demo1234');

  // Generate 1000 transactions
  console.log('🔄 Generating 1000 demo transactions...');
  const categories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Education', 'Salary', 'Investment', 'Freelance'];
  const transactions = [];

  for (let i = 0; i < 1000; i++) {
    const isIncome = Math.random() > 0.7; // 30% chance of income
    const type = isIncome ? 'INCOME' : 'EXPENSE';
    const category = categories[Math.floor(Math.random() * categories.length)];
    const amount = isIncome
      ? Math.floor(Math.random() * 5000) + 1000 // Income: 1000-6000
      : Math.floor(Math.random() * 200) + 10;   // Expense: 10-210

    // Random date within last 365 days
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 365));

    transactions.push({
      userId: demoUser.id,
      amount: amount,
      type: type as 'INCOME' | 'EXPENSE',
      category: category,
      description: `${type === 'INCOME' ? 'Received' : 'Paid for'} ${category} #${i + 1}`,
      date: date,
    });
  }

  // Batch insert transactions
  await prisma.transaction.createMany({
    data: transactions,
  });

  console.log('✅ Created 1000 transactions');

  console.log('\n🎉 Demo account is ready!');
  console.log('Login at: http://localhost:3000/login');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
