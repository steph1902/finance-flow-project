import { TransactionType, GoalStatus } from '@prisma/client';

/**
 * Test data factories for creating consistent test data
 */

export const createTestUser = (overrides = {}) => {
  return {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    password: '$2b$10$test.hash',
    createdAt: new Date(),
    updatedAt: new Date(),
    emailVerified: null,
    image: null,
    preferredCurrency: 'USD',
    timezone: 'UTC',
    language: 'en',
    onboardingCompleted: false,
    onboardingStep: 0,
    ...overrides,
  };
};

export const createTestTransaction = (overrides = {}) => {
  return {
    id: 'test-transaction-id',
    userId: 'test-user-id',
    amount: 100.00,
    type: TransactionType.EXPENSE,
    category: 'Food',
    description: 'Test transaction',
    notes: null,
    date: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    ...overrides,
  };
};

export const createTestBudget = (overrides = {}) => {
  const now = new Date();
  return {
    id: 'test-budget-id',
    userId: 'test-user-id',
    category: 'Food',
    amount: 500.00,
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
};

export const createTestGoal = (overrides = {}) => {
  return {
    id: 'test-goal-id',
    userId: 'test-user-id',
    name: 'Test Goal',
    description: 'Test goal description',
    targetAmount: 1000.00,
    currentAmount: 0,
    targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    category: 'Savings',
    status: GoalStatus.ACTIVE,  // Changed from IN_PROGRESS
    priority: 1,
    reminderEnabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    completedAt: null,
    ...overrides,
  };
};

export const createTestNotification = (overrides = {}) => {
  return {
    id: 'test-notification-id',
    userId: 'test-user-id',
    type: 'BUDGET_ALERT',
    title: 'Test Notification',
    message: 'Test notification message',
    status: 'UNREAD',
    priority: 1,
    metadata: {},
    actionUrl: null,
    sentAt: new Date(),
    readAt: null,
    archivedAt: null,
    createdAt: new Date(),
    ...overrides,
  };
};
