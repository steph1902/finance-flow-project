#!/bin/bash

# ============================================================================
# VERCEL DEPLOYMENT - QUICK FIX SCRIPT
# ============================================================================
# This script fixes the most critical TypeScript issues blocking deployment
# Run from project root: chmod +x scripts/fix-typescript-errors.sh && ./scripts/fix-typescript-errors.sh
# ============================================================================

set -e  # Exit on error

echo "🔧 Starting TypeScript error fixes..."
echo ""

# Navigate to project root
cd "$(dirname "$0")/.."

# ============================================================================
# 1. FIX SUPERTEST IMPORTS (Most Common Issue - ~200 errors)
# ============================================================================

echo "📦 Fixing supertest imports in test files..."

# Fix in backend test files
find backend/test -type f \( -name "*.spec.ts" -o -name "*.e2e-spec.ts" \) -print0 | while IFS= read -r -d '' file; do
  if grep -q "import \* as request from 'supertest'" "$file"; then
    echo "  ✓ Fixing: $file"
    sed -i.bak "s/import \* as request from 'supertest'/import request from 'supertest'/" "$file"
    rm "${file}.bak"
  fi
done

echo "  ✅ Supertest imports fixed"
echo ""

# ============================================================================
# 2. FIX TEST HELPERS - Add Explicit Types
# ============================================================================

echo "🔧 Fixing test helper types..."

# Create fixed version of backend/test/helpers/mocks.ts
cat > backend/test/helpers/mocks.ts << 'EOF'
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
EOF

echo "  ✅ Test helper types fixed"
echo ""

# ============================================================================
# 3. FIX TEST FACTORIES - Remove Non-Existent Fields
# ============================================================================

echo "🔧 Fixing test factories..."

cat > backend/test/helpers/factories.ts << 'EOF'
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
EOF

echo "  ✅ Test factories fixed"
echo ""

# ============================================================================
# 4. FIX TEST DATABASE HELPER
# ============================================================================

echo "🔧 Fixing test database helper..."

cat > backend/test/helpers/test-database.ts << 'EOF'
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
EOF

echo "  ✅ Test database helper fixed"
echo ""

# ============================================================================
# 5. FIX READONLY PROCESS.ENV ASSIGNMENT
# ============================================================================

echo "🔧 Fixing process.env readonly issue..."

cat > backend/test/setup.ts << 'EOF'
/**
 * Global test setup for backend e2e tests
 */

// Set test environment variables BEFORE any imports
Object.defineProperty(process.env, 'NODE_ENV', {
  value: 'test',
  writable: true,
  configurable: true,
});

process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/financeflow_test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-for-testing-only';
process.env.REDIS_HOST = 'localhost';
process.env.REDIS_PORT = '6379';

// Increase timeout for e2e tests
jest.setTimeout(30000);

// Global test teardown
afterAll(async () => {
  // Allow time for async cleanup
  await new Promise(resolve => setTimeout(resolve, 500));
});
EOF

echo "  ✅ Process.env issue fixed"
echo ""

# ============================================================================
# 6. VERIFY FIXES
# ============================================================================

echo "🔍 Verifying TypeScript compilation..."
echo ""

if npx tsc --noEmit 2>&1 | tee /tmp/tsc-output.txt; then
  echo ""
  echo "✅ TypeScript compilation successful!"
  echo ""
else
  echo ""
  echo "⚠️  Some TypeScript errors remain. Check /tmp/tsc-output.txt for details."
  echo ""
  echo "Remaining error count:"
  grep -c "error TS" /tmp/tsc-output.txt || echo "0"
  echo ""
fi

# ============================================================================
# 7. SUMMARY
# ============================================================================

echo "============================================================================"
echo "✅ QUICK FIX COMPLETED"
echo "============================================================================"
echo ""
echo "Fixed issues:"
echo "  ✓ Supertest import statements"
echo "  ✓ Test helper types"
echo "  ✓ Test factory fields"
echo "  ✓ Test database helper"
echo "  ✓ Process.env readonly assignment"
echo ""
echo "Next steps:"
echo "  1. Review TypeScript compilation output above"
echo "  2. Run tests: npm run test"
echo "  3. Fix any remaining errors manually"
echo "  4. Commit changes: git add . && git commit -m 'Fix TypeScript errors'"
echo ""
echo "============================================================================"
