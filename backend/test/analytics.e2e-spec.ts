import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';

describe('Analytics (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let testUserId: string;

  const testUser = {
    email: `analytics-test-${Date.now()}@example.com`,
    password: 'TestPassword123!',
    name: 'Analytics Test User',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);

    // Register and login test user
    const signupResponse = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(testUser)
      .expect(201);

    accessToken = signupResponse.body.accessToken;
    testUserId = signupResponse.body.user?.id;

    // Seed some test transactions
    if (testUserId) {
      const now = new Date();
      await prisma.transaction.createMany({
        data: [
          {
            userId: testUserId,
            type: 'INCOME',
            amount: 5000,
            category: 'Salary',
            description: 'Monthly salary',
            date: new Date(now.getFullYear(), now.getMonth(), 5),
            currency: 'USD',
          },
          {
            userId: testUserId,
            type: 'EXPENSE',
            amount: 1500,
            category: 'Rent',
            description: 'Monthly rent',
            date: new Date(now.getFullYear(), now.getMonth(), 1),
            currency: 'USD',
          },
          {
            userId: testUserId,
            type: 'EXPENSE',
            amount: 500,
            category: 'Food',
            description: 'Groceries',
            date: new Date(now.getFullYear(), now.getMonth(), 10),
            currency: 'USD',
          },
        ],
      });
    }
  });

  afterAll(async () => {
    // Cleanup test data
    if (testUserId) {
      await prisma.transaction.deleteMany({ where: { userId: testUserId } });
      await prisma.user.delete({ where: { id: testUserId } }).catch(() => {});
    }
    await app.close();
  });

  describe('GET /analytics/overview', () => {
    it('should return 401 without auth token', () => {
      return request(app.getHttpServer()).get('/analytics/overview').expect(401);
    });

    it('should return financial overview with valid token', () => {
      return request(app.getHttpServer())
        .get('/analytics/overview')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('totalIncome');
          expect(res.body).toHaveProperty('totalExpenses');
          expect(res.body).toHaveProperty('netSavings');
          expect(res.body).toHaveProperty('transactionCount');
          expect(res.body).toHaveProperty('period');
        });
    });

    it('should accept date range query params', () => {
      const startDate = new Date(new Date().getFullYear(), 0, 1).toISOString();
      const endDate = new Date().toISOString();

      return request(app.getHttpServer())
        .get('/analytics/overview')
        .query({ startDate, endDate })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });
  });

  describe('GET /analytics/spending-trends', () => {
    it('should return spending trends', () => {
      return request(app.getHttpServer())
        .get('/analytics/spending-trends')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('trends');
          expect(Array.isArray(res.body.trends)).toBe(true);
          expect(res.body).toHaveProperty('period');
        });
    });
  });

  describe('GET /analytics/category-breakdown', () => {
    it('should return category breakdown', () => {
      return request(app.getHttpServer())
        .get('/analytics/category-breakdown')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('breakdown');
          expect(Array.isArray(res.body.breakdown)).toBe(true);
          expect(res.body).toHaveProperty('total');
        });
    });

    it('should include percentage for each category', () => {
      return request(app.getHttpServer())
        .get('/analytics/category-breakdown')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          if (res.body.breakdown.length > 0) {
            res.body.breakdown.forEach((item: any) => {
              expect(item).toHaveProperty('category');
              expect(item).toHaveProperty('amount');
              expect(item).toHaveProperty('percentage');
            });
          }
        });
    });
  });

  describe('GET /analytics/income-vs-expenses', () => {
    it('should return income vs expenses comparison', () => {
      return request(app.getHttpServer())
        .get('/analytics/income-vs-expenses')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('comparison');
          expect(Array.isArray(res.body.comparison)).toBe(true);
        });
    });
  });

  describe('GET /analytics/monthly-comparison', () => {
    it('should return monthly comparison', () => {
      return request(app.getHttpServer())
        .get('/analytics/monthly-comparison')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('current');
          expect(res.body).toHaveProperty('previous');
          expect(res.body).toHaveProperty('changes');
        });
    });

    it('should include percentage changes', () => {
      return request(app.getHttpServer())
        .get('/analytics/monthly-comparison')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.changes).toHaveProperty('income');
          expect(res.body.changes).toHaveProperty('expenses');
          expect(res.body.changes).toHaveProperty('savings');
        });
    });
  });
});
