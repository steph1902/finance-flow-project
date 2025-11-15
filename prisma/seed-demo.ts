import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Helper function to calculate next date for recurring transactions
function calculateNextDate(startDate: Date, frequency: string): Date {
  const next = new Date(startDate);
  
  switch (frequency) {
    case 'DAILY':
      next.setDate(next.getDate() + 1);
      break;
    case 'WEEKLY':
      next.setDate(next.getDate() + 7);
      break;
    case 'BIWEEKLY':
      next.setDate(next.getDate() + 14);
      break;
    case 'MONTHLY':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'QUARTERLY':
      next.setMonth(next.getMonth() + 3);
      break;
    case 'YEARLY':
      next.setFullYear(next.getFullYear() + 1);
      break;
  }
  
  return next;
}

async function main() {
  console.log('🌱 Seeding comprehensive demo data...');

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
  console.log('   Password: Demo1234');

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
