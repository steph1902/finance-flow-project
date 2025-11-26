import { Decimal } from '@prisma/client/runtime/library';
import { TransactionType, UserRole, BudgetPeriod, GoalStatus } from '@prisma/client';

/**
 * Test data factories
 * Generate test data with sensible defaults
 */

let userCounter = 0;
let transactionCounter = 0;
let budgetCounter = 0;

export class TestFactories {
  /**
   * Create a test user
   */
  static createUser(overrides: Partial<any> = {}) {
    userCounter++;
    return {
      id: overrides.id || `user-${userCounter}`,
      email: overrides.email || `user${userCounter}@test.com`,
      password: overrides.password || '$2b$10$YourHashedPasswordHere',
      firstName: overrides.firstName || `First${userCounter}`,
      lastName: overrides.lastName || `Last${userCounter}`,
      role: overrides.role || UserRole.USER,
      currency: overrides.currency || 'USD',
      createdAt: overrides.createdAt || new Date(),
      updatedAt: overrides.updatedAt || new Date(),
      ...overrides,
    };
  }

  /**
   * Create a test transaction
   */
  static createTransaction(userId: string, overrides: Partial<any> = {}) {
    transactionCounter++;
    return {
      id: overrides.id || `trans-${transactionCounter}`,
      userId,
      amount: overrides.amount || new Decimal(100.00),
      type: overrides.type || TransactionType.EXPENSE,
      category: overrides.category || 'Food',
      description: overrides.description || `Test transaction ${transactionCounter}`,
      date: overrides.date || new Date(),
      createdAt: overrides.createdAt || new Date(),
      updatedAt: overrides.updatedAt || new Date(),
      ...overrides,
    };
  }

  /**
   * Create a test budget
   */
  static createBudget(userId: string, overrides: Partial<any> = {}) {
    budgetCounter++;
    return {
      id: overrides.id || `budget-${budgetCounter}`,
      userId,
      name: overrides.name || `Budget ${budgetCounter}`,
      amount: overrides.amount || new Decimal(1000.00),
      spent: overrides.spent || new Decimal(0),
      category: overrides.category || 'Food',
      period: overrides.period || BudgetPeriod.MONTHLY,
      startDate: overrides.startDate || new Date(),
      endDate: overrides.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      alertThreshold: overrides.alertThreshold || 80,
      rollover: overrides.rollover || false,
      createdAt: overrides.createdAt || new Date(),
      updatedAt: overrides.updatedAt || new Date(),
      ...overrides,
    };
  }

  /**
   * Create a test goal
   */
  static createGoal(userId: string, overrides: Partial<any> = {}) {
    return {
      id: overrides.id || `goal-${Date.now()}`,
      userId,
      name: overrides.name || 'Test Goal',
      targetAmount: overrides.targetAmount || new Decimal(5000.00),
      currentAmount: overrides.currentAmount || new Decimal(0),
      targetDate: overrides.targetDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      status: overrides.status || GoalStatus.IN_PROGRESS,
      createdAt: overrides.createdAt || new Date(),
      updatedAt: overrides.updatedAt || new Date(),
      ...overrides,
    };
  }

  /**
   * Create a test recurring transaction
   */
  static createRecurringTransaction(userId: string, overrides: Partial<any> = {}) {
    return {
      id: overrides.id || `recurring-${Date.now()}`,
      userId,
      amount: overrides.amount || new Decimal(50.00),
      type: overrides.type || TransactionType.EXPENSE,
      category: overrides.category || 'Subscription',
      description: overrides.description || 'Test Recurring',
      frequency: overrides.frequency || 'MONTHLY',
      nextDate: overrides.nextDate || new Date(),
      isActive: overrides.isActive !== undefined ? overrides.isActive : true,
      createdAt: overrides.createdAt || new Date(),
      updatedAt: overrides.updatedAt || new Date(),
      ...overrides,
    };
  }

  /**
   * Create a test notification
   */
  static createNotification(userId: string, overrides: Partial<any> = {}) {
    return {
      id: overrides.id || `notif-${Date.now()}`,
      userId,
      type: overrides.type || 'BUDGET_ALERT',
      title: overrides.title || 'Test Notification',
      message: overrides.message || 'This is a test notification',
      isRead: overrides.isRead || false,
      createdAt: overrides.createdAt || new Date(),
      ...overrides,
    };
  }

  /**
   * Create JWT payload
   */
  static createJwtPayload(userId: string, overrides: Partial<any> = {}) {
    return {
      sub: userId,
      email: overrides.email || 'test@example.com',
      role: overrides.role || UserRole.USER,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      ...overrides,
    };
  }

  /**
   * Reset counters (use between tests)
   */
  static reset() {
    userCounter = 0;
    transactionCounter = 0;
    budgetCounter = 0;
  }
}
