/**
 * Global test setup
 * Runs before all tests
 */

// Set test environment
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/financeflow_test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-for-testing-only';
process.env.REDIS_HOST = 'localhost';
process.env.REDIS_PORT = '6379';

// Increase timeout for slow tests
jest.setTimeout(10000);

// Mock external services globally
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: () => 'Mocked AI response',
        },
      }),
    }),
  })),
}));

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn().mockResolvedValue({ id: 'mock-email-id' }),
    },
  })),
}));

jest.mock('stripe', () => {
  const mockStripe = {
    customers: {
      create: jest.fn().mockResolvedValue({ id: 'cus_test' }),
      retrieve: jest.fn().mockResolvedValue({ id: 'cus_test' }),
    },
    subscriptions: {
      create: jest.fn().mockResolvedValue({ id: 'sub_test', status: 'active' }),
      retrieve: jest.fn().mockResolvedValue({ id: 'sub_test', status: 'active' }),
      update: jest.fn().mockResolvedValue({ id: 'sub_test', status: 'active' }),
    },
    paymentIntents: {
      create: jest.fn().mockResolvedValue({ id: 'pi_test', status: 'succeeded' }),
    },
  };
  
  return jest.fn(() => mockStripe);
});

jest.mock('plaid', () => ({
  PlaidApi: jest.fn().mockImplementation(() => ({
    linkTokenCreate: jest.fn().mockResolvedValue({ 
      data: { link_token: 'link-test-token' } 
    }),
    itemPublicTokenExchange: jest.fn().mockResolvedValue({
      data: { access_token: 'access-test-token' }
    }),
    transactionsGet: jest.fn().mockResolvedValue({
      data: { transactions: [] }
    }),
  })),
  Configuration: jest.fn(),
  PlaidEnvironments: {
    sandbox: 'https://sandbox.plaid.com',
  },
}));

// Console suppression for cleaner test output
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  // Keep error for debugging
  error: console.error,
};
