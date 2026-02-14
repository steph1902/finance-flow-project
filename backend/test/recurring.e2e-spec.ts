import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';

describe('Recurring Transactions (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let testUserId: string;
  let recurringId: string;

  const testUser = {
    email: `recurring-test-${Date.now()}@example.com`,
    password: 'TestPassword123!',
    name: 'Recurring Test User',
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
  });

  afterAll(async () => {
    // Cleanup test data
    if (testUserId) {
      await prisma.recurringTransaction.deleteMany({ where: { userId: testUserId } });
      await prisma.user.delete({ where: { id: testUserId } }).catch(() => {});
    }
    await app.close();
  });

  describe('POST /recurring', () => {
    it('should return 401 without auth token', () => {
      return request(app.getHttpServer())
        .post('/recurring')
        .send({
          description: 'Monthly Rent',
          amount: 1500,
          type: 'EXPENSE',
          frequency: 'MONTHLY',
        })
        .expect(401);
    });

    it('should create a recurring transaction', async () => {
      const response = await request(app.getHttpServer())
        .post('/recurring')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          description: 'Monthly Rent',
          amount: 1500,
          type: 'EXPENSE',
          category: 'Rent',
          frequency: 'MONTHLY',
          startDate: new Date().toISOString(),
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.description).toBe('Monthly Rent');
      recurringId = response.body.id;
    });
  });

  describe('GET /recurring', () => {
    it('should return all recurring transactions', () => {
      return request(app.getHttpServer())
        .get('/recurring')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('GET /recurring/:id', () => {
    it('should return a recurring transaction by id', () => {
      return request(app.getHttpServer())
        .get(`/recurring/${recurringId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(recurringId);
        });
    });

    it('should return 404 for non-existent id', () => {
      return request(app.getHttpServer())
        .get('/recurring/non-existent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('PUT /recurring/:id', () => {
    it('should update a recurring transaction', () => {
      return request(app.getHttpServer())
        .put(`/recurring/${recurringId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ amount: 1600 })
        .expect(200)
        .expect((res) => {
          expect(res.body.amount).toBe(1600);
        });
    });
  });

  describe('POST /recurring/:id/skip', () => {
    it('should skip the next occurrence', () => {
      return request(app.getHttpServer())
        .post(`/recurring/${recurringId}/skip`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });
  });

  describe('DELETE /recurring/:id', () => {
    it('should delete a recurring transaction', () => {
      return request(app.getHttpServer())
        .delete(`/recurring/${recurringId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);
    });
  });
});
