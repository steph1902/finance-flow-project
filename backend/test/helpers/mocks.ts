import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);

/**
 * Mock implementations for common dependencies
 */

export const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  transaction: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    aggregate: jest.fn(),
    groupBy: jest.fn(),
  },
  budget: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  goal: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  recurringTransaction: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  notification: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  refreshToken: {
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
  $transaction: jest.fn((callback) => callback(mockPrismaService)),
  $connect: jest.fn(),
  $disconnect: jest.fn(),
};

export const mockConfigService = {
  get: jest.fn((key: string, defaultValue?: any) => {
    const config: Record<string, any> = {
      'database.url': 'postgresql://test:test@localhost:5432/test',
      'jwt.secret': 'test-secret',
      'jwt.expiresIn': '15m',
      'jwt.refreshSecret': 'test-refresh-secret',
      'jwt.refreshExpiresIn': '7d',
      'redis.host': 'localhost',
      'redis.port': 6379,
      NODE_ENV: 'test',
    };
    return config[key] ?? defaultValue;
  }),
  getOrThrow: jest.fn((key: string) => {
    const value = mockConfigService.get(key);
    if (!value) throw new Error(`Config key ${key} not found`);
    return value;
  }),
};

export const mockJwtService = {
  sign: jest.fn((payload) => 'mock-jwt-token'),
  signAsync: jest.fn((payload) => Promise.resolve('mock-jwt-token')),
  verify: jest.fn((token) => ({ sub: 'user-123', email: 'test@example.com' })),
  verifyAsync: jest.fn((token) => Promise.resolve({ sub: 'user-123', email: 'test@example.com' })),
  decode: jest.fn((token) => ({ sub: 'user-123', email: 'test@example.com' })),
};

export const mockCacheService = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  delPattern: jest.fn(),
  has: jest.fn(),
  getOrSet: jest.fn(),
  increment: jest.fn(),
  setex: jest.fn(),
  reset: jest.fn(),
};

export const mockQueue = {
  add: jest.fn(),
  process: jest.fn(),
  getJob: jest.fn(),
  getJobs: jest.fn(),
  getWaitingCount: jest.fn(),
  getActiveCount: jest.fn(),
  getCompletedCount: jest.fn(),
  getFailedCount: jest.fn(),
  getDelayedCount: jest.fn(),
  clean: jest.fn(),
  close: jest.fn(),
};

export const mockEmailService = {
  sendEmail: jest.fn(),
  sendBudgetAlert: jest.fn(),
  sendGoalAchieved: jest.fn(),
  sendWelcomeEmail: jest.fn(),
};

export const mockLogger = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  verbose: jest.fn(),
};

/**
 * Create a mock for any provider using metadata
 */
export function createMock<T = any>(token: any): any {
  if (typeof token === 'function') {
    const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
    const Mock = moduleMocker.generateFromMetadata(mockMetadata);
    return new Mock();
  }
  return {};
}

/**
 * Reset all mocks
 */
export function resetAllMocks() {
  Object.values(mockPrismaService).forEach((mock: any) => {
    if (typeof mock === 'object') {
      Object.values(mock).forEach((fn: any) => {
        if (jest.isMockFunction(fn)) {
          fn.mockClear();
        }
      });
    }
    if (jest.isMockFunction(mock)) {
      mock.mockClear();
    }
  });

  jest.clearAllMocks();
}
