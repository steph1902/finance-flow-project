import { PrismaClient } from '@prisma/client';

/**
 * Test database helper
 * Manages test database lifecycle
 */
export class TestDatabase {
  private static instance: PrismaClient;

  static getInstance(): PrismaClient {
    if (!this.instance) {
      this.instance = new PrismaClient({
        datasources: {
          db: {
            url: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
          },
        },
      });
    }
    return this.instance;
  }

  static async connect(): Promise<void> {
    const prisma = this.getInstance();
    await prisma.$connect();
  }

  static async disconnect(): Promise<void> {
    const prisma = this.getInstance();
    await prisma.$disconnect();
  }

  /**
   * Clean all tables in the database
   */
  static async cleanup(): Promise<void> {
    const prisma = this.getInstance();

    // Delete in correct order to avoid foreign key constraints
    await prisma.notification.deleteMany();
    await prisma.recurringTransaction.deleteMany();
    await prisma.goal.deleteMany();
    await prisma.budget.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
  }

  /**
   * Seed test data
   */
  static async seed(): Promise<{
    testUser: any;
    adminUser: any;
  }> {
    const prisma = this.getInstance();

    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: '$2b$10$YourHashedPasswordHere', // bcrypt hash of 'password123'
        firstName: 'Test',
        lastName: 'User',
        role: 'USER',
      },
    });

    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: '$2b$10$YourHashedPasswordHere',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
      },
    });

    return { testUser, adminUser };
  }
}
