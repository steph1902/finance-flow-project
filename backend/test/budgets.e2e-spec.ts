import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestDatabase } from './helpers/test-database';

describe('Budgets (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: string;
  let budgetId: string;

  beforeAll(async () => {
    await TestDatabase.cleanup();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    // Create test user and get auth token
    const signupResponse = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: 'budgetuser@test.com',
        password: 'StrongP@ss123',
        name: 'Budget User',
      })
      .expect(HttpStatus.CREATED);

    authToken = signupResponse.body.tokens.accessToken;
    userId = signupResponse.body.user.id;
  });

  afterAll(async () => {
    await TestDatabase.cleanup();
    await app.close();
  });

  describe('POST /budgets', () => {
    it('should create a new budget', async () => {
      const response = await request(app.getHttpServer())
        .post('/budgets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          category: 'GROCERIES',
          amount: 500,
          startDate: '2025-11-01',
          endDate: '2025-11-30',
          rollover: false,
          alertThreshold: 80,
        })
        .expect(HttpStatus.CREATED);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        userId,
        category: 'GROCERIES',
        amount: 500,
        spent: 0,
        remaining: 500,
        percentUsed: 0,
        rollover: false,
        alertThreshold: 80,
        isOverBudget: false,
      });

      budgetId = response.body.id;
    });

    it('should fail with invalid date range', async () => {
      await request(app.getHttpServer())
        .post('/budgets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          category: 'ENTERTAINMENT',
          amount: 200,
          startDate: '2025-11-30',
          endDate: '2025-11-01',
          rollover: false,
          alertThreshold: 80,
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .post('/budgets')
        .send({
          category: 'DINING',
          amount: 300,
          startDate: '2025-11-01',
          endDate: '2025-11-30',
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should fail with invalid amount', async () => {
      await request(app.getHttpServer())
        .post('/budgets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          category: 'TRANSPORTATION',
          amount: -100,
          startDate: '2025-11-01',
          endDate: '2025-11-30',
        })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('GET /budgets', () => {
    beforeAll(async () => {
      // Create additional budgets for testing
      await request(app.getHttpServer())
        .post('/budgets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          category: 'ENTERTAINMENT',
          amount: 200,
          startDate: '2025-11-01',
          endDate: '2025-11-30',
          rollover: false,
          alertThreshold: 75,
        });
    });

    it('should return all budgets for authenticated user', async () => {
      const response = await request(app.getHttpServer())
        .get('/budgets')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('category');
      expect(response.body[0]).toHaveProperty('amount');
    });

    it('should filter budgets by category', async () => {
      const response = await request(app.getHttpServer())
        .get('/budgets')
        .query({ category: 'GROCERIES' })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

      expect(response.body.every((b: any) => b.category === 'GROCERIES')).toBe(true);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .get('/budgets')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('GET /budgets/summary', () => {
    it('should return budget summary', async () => {
      const response = await request(app.getHttpServer())
        .get('/budgets/summary')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toMatchObject({
        totalBudgeted: expect.any(Number),
        totalSpent: expect.any(Number),
        totalRemaining: expect.any(Number),
        overallPercentUsed: expect.any(Number),
        categoryBreakdown: expect.any(Array),
        period: {
          start: expect.any(String),
          end: expect.any(String),
        },
      });
    });

    it('should return summary for specific month', async () => {
      const response = await request(app.getHttpServer())
        .get('/budgets/summary')
        .query({ month: '2025-11' })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toHaveProperty('totalBudgeted');
      expect(response.body.categoryBreakdown).toBeInstanceOf(Array);
    });
  });

  describe('GET /budgets/:id', () => {
    it('should return a budget by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/budgets/${budgetId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toMatchObject({
        id: budgetId,
        userId,
        category: 'GROCERIES',
        amount: 500,
      });
    });

    it('should return 404 for non-existent budget', async () => {
      await request(app.getHttpServer())
        .get('/budgets/nonexistent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .get(`/budgets/${budgetId}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('PUT /budgets/:id', () => {
    it('should update a budget', async () => {
      const response = await request(app.getHttpServer())
        .put(`/budgets/${budgetId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 600,
          alertThreshold: 85,
        })
        .expect(HttpStatus.OK);

      expect(response.body).toMatchObject({
        id: budgetId,
        amount: 600,
        alertThreshold: 85,
      });
    });

    it('should return 404 for non-existent budget', async () => {
      await request(app.getHttpServer())
        .put('/budgets/nonexistent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ amount: 700 })
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .put(`/budgets/${budgetId}`)
        .send({ amount: 700 })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('POST /budgets/rollover', () => {
    beforeAll(async () => {
      // Create a budget with rollover enabled
      await request(app.getHttpServer())
        .post('/budgets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          category: 'SAVINGS',
          amount: 1000,
          startDate: '2025-10-01',
          endDate: '2025-10-31',
          rollover: true,
          alertThreshold: 90,
        });
    });

    it('should process budget rollover', async () => {
      const response = await request(app.getHttpServer())
        .post('/budgets/rollover')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('rollover processed successfully');
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .post('/budgets/rollover')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('DELETE /budgets/:id', () => {
    let deleteableBudgetId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/budgets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          category: 'OTHER',
          amount: 100,
          startDate: '2025-11-01',
          endDate: '2025-11-30',
        });
      deleteableBudgetId = response.body.id;
    });

    it('should delete a budget', async () => {
      await request(app.getHttpServer())
        .delete(`/budgets/${deleteableBudgetId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.NO_CONTENT);

      // Verify deletion
      await request(app.getHttpServer())
        .get(`/budgets/${deleteableBudgetId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return 404 for non-existent budget', async () => {
      await request(app.getHttpServer())
        .delete('/budgets/nonexistent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .delete(`/budgets/${budgetId}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });
});
