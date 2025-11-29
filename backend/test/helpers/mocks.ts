import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

// Mock Prisma Service with explicit types
export const mockPrismaService: any = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  transaction: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
    count: jest.fn(),
    aggregate: jest.fn(),
    groupBy: jest.fn(),
  },
  budget: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
    count: jest.fn(),
    aggregate: jest.fn(),
  },
  goal: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  notification: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    count: jest.fn(),
  },
  recurringTransaction: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  $transaction: jest.fn((callback: any) => callback(mockPrismaService)),
  $disconnect: jest.fn(),
};

// Mock Config Service with explicit types
export const mockConfigService: any = {
  get: jest.fn((key: string): any => {
    const config: Record<string, any> = {
      JWT_SECRET: 'test-secret',
      JWT_EXPIRATION: '1h',
      DATABASE_URL: 'postgresql://test@localhost/test',
      PORT: 3001,
    };
    return config[key];
  }),
  getOrThrow: jest.fn((key: string): any => {
    const value: any = mockConfigService.get(key);
    if (!value) throw new Error(`Missing config: ${key}`);
    return value;
  }),
};

// Mock JWT Service
export const mockJwtService: Partial<JwtService> = {
  sign: jest.fn((_payload: any): string => 'mock-jwt-token'),
  signAsync: jest.fn((_payload: any): Promise<string> => Promise.resolve('mock-jwt-token')),
  verify: jest.fn((_token: any): any => ({ sub: 'user-123', email: 'test@example.com' })),
  verifyAsync: jest.fn((_token: any): Promise<any> => Promise.resolve({ sub: 'user-123', email: 'test@example.com' })),
  decode: jest.fn((_token: any): any => ({ sub: 'user-123', email: 'test@example.com' })),
};

// Mock Cache Manager
export const mockCacheManager = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
};

// Mock Bull Queue
export const mockQueue = {
  add: jest.fn(),
  process: jest.fn(),
  on: jest.fn(),
};

// Mock Logger
export const mockLogger = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  verbose: jest.fn(),
};

// Create generic mock helper
export function createMock<T = any>(_token: any): any {
  return {
    provide: _token,
    useValue: {},
  };
}
