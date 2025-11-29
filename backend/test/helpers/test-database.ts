import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

export async function setupTestDatabase(): Promise<PrismaClient> {
  if (!prisma) {
    const databaseUrl = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      throw new Error('TEST_DATABASE_URL or DATABASE_URL must be set');
    }

    prisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
      log: process.env.DEBUG ? ['query', 'error', 'warn'] : ['error'],
    });

    await prisma.$connect();
  }

  return prisma;
}

export async function cleanupTestDatabase(): Promise<void> {
  if (!prisma) return;

  try {
    // Delete in correct order (respecting foreign keys)
    await prisma.notification.deleteMany();
    await prisma.goalContribution.deleteMany();
    await prisma.goalMilestone.deleteMany();
    await prisma.goal.deleteMany();
    await prisma.recurringTransaction.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.budget.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();
  } catch (error) {
    console.error('Error cleaning up test database:', error);
  }
}

export async function teardownTestDatabase(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
  }
}

export async function createTestUser(data = {}) {
  return prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
      password: '$2b$10$test.hash',
      preferredCurrency: 'USD',
      timezone: 'UTC',
      language: 'en',
      ...data,
    },
  });
}

export async function createAdminUser(data = {}) {
  return prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: '$2b$10$admin.hash',
      preferredCurrency: 'USD',
      timezone: 'UTC',
      language: 'en',
      ...data,
    },
  });
}
