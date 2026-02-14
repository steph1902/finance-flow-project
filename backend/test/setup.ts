/**
 * Global test setup for backend e2e tests
 */

// Set test environment variables BEFORE any imports
Object.defineProperty(process.env, 'NODE_ENV', {
  value: 'test',
  writable: true,
  configurable: true,
});

process.env.DATABASE_URL =
  process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/financeflow_test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-for-testing-only';
process.env.REDIS_HOST = 'localhost';
process.env.REDIS_PORT = '6379';

// Increase timeout for e2e tests
jest.setTimeout(30000);

// Global test teardown
afterAll(async () => {
  // Allow time for async cleanup
  await new Promise((resolve) => setTimeout(resolve, 500));
});
