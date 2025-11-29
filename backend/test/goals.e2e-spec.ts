import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestDatabase } from './helpers/test-database';

describe('Goals (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: string;
  let goalId: string;

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
        email: 'goaluser@test.com',
        password: 'StrongP@ss123',
        name: 'Goal User',
      })
      .expect(HttpStatus.CREATED);

    authToken = signupResponse.body.tokens.accessToken;
    userId = signupResponse.body.user.id;
  });

  afterAll(async () => {
    await TestDatabase.cleanup();
    await app.close();
  });

  describe('POST /goals', () => {
    it('should create a new goal', async () => {
      const response = await request(app.getHttpServer())
        .post('/goals')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Emergency Fund',
          description: 'Save for emergencies',
          targetAmount: 10000,
          currentAmount: 2000,
          targetDate: '2026-12-31',
          category: 'SAVINGS',
          priority: 'HIGH',
        })
        .expect(HttpStatus.CREATED);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        userId,
        name: 'Emergency Fund',
        targetAmount: expect.any(Number),
        currentAmount: expect.any(Number),
        category: 'SAVINGS',
        priority: 'HIGH',
      });

      goalId = response.body.id;
    });

    it('should create a goal without initial amount', async () => {
      const response = await request(app.getHttpServer())
        .post('/goals')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Vacation Fund',
          targetAmount: 5000,
          targetDate: '2026-06-01',
          category: 'TRAVEL',
          priority: 'MEDIUM',
        })
        .expect(HttpStatus.CREATED);

      expect(response.body.currentAmount).toBeDefined();
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .post('/goals')
        .send({
          name: 'Test Goal',
          targetAmount: 1000,
          targetDate: '2026-12-31',
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should fail with invalid target amount', async () => {
      await request(app.getHttpServer())
        .post('/goals')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Invalid Goal',
          targetAmount: -1000,
          targetDate: '2026-12-31',
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should fail with missing required fields', async () => {
      await request(app.getHttpServer())
        .post('/goals')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Incomplete Goal',
        })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('GET /goals', () => {
    beforeAll(async () => {
      // Create additional goals for testing
      await request(app.getHttpServer())
        .post('/goals')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Car Fund',
          targetAmount: 15000,
          currentAmount: 5000,
          targetDate: '2027-01-01',
          category: 'PURCHASE',
          priority: 'LOW',
        });
    });

    it('should return all goals for authenticated user', async () => {
      const response = await request(app.getHttpServer())
        .get('/goals')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('progress');
      expect(response.body[0]).toHaveProperty('remaining');
      expect(response.body[0]).toHaveProperty('isCompleted');
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .get('/goals')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('GET /goals/:id', () => {
    it('should return a goal by id with enriched data', async () => {
      const response = await request(app.getHttpServer())
        .get(`/goals/${goalId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toMatchObject({
        id: goalId,
        userId,
        name: 'Emergency Fund',
        targetAmount: expect.any(Number),
        currentAmount: expect.any(Number),
        progress: expect.any(Number),
        remaining: expect.any(Number),
        isCompleted: expect.any(Boolean),
      });
      expect(response.body.progress).toBeGreaterThanOrEqual(0);
      expect(response.body.progress).toBeLessThanOrEqual(100);
    });

    it('should return 404 for non-existent goal', async () => {
      await request(app.getHttpServer())
        .get('/goals/nonexistent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .get(`/goals/${goalId}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('PUT /goals/:id', () => {
    it('should update a goal', async () => {
      const response = await request(app.getHttpServer())
        .put(`/goals/${goalId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Emergency Fund',
          targetAmount: 15000,
        })
        .expect(HttpStatus.OK);

      expect(response.body).toMatchObject({
        id: goalId,
        name: 'Updated Emergency Fund',
        targetAmount: expect.any(Number),
      });
    });

    it('should update current amount and recalculate progress', async () => {
      const response = await request(app.getHttpServer())
        .put(`/goals/${goalId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentAmount: 7500,
        })
        .expect(HttpStatus.OK);

      expect(response.body.currentAmount).toBeDefined();
      expect(response.body.progress).toBeGreaterThan(0);
    });

    it('should return 404 for non-existent goal', async () => {
      await request(app.getHttpServer())
        .put('/goals/nonexistent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Test' })
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .put(`/goals/${goalId}`)
        .send({ name: 'Test' })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('POST /goals/:id/contribute', () => {
    it('should add contribution to goal', async () => {
      const response = await request(app.getHttpServer())
        .post(`/goals/${goalId}/contribute`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 1000,
        })
        .expect(HttpStatus.OK);

      expect(response.body.currentAmount).toBeGreaterThan(0);
      expect(response.body.progress).toBeGreaterThan(0);
      expect(response.body.remaining).toBeLessThan(response.body.targetAmount);
    });

    it('should mark goal as completed when target reached', async () => {
      // Get current goal state
      const currentResponse = await request(app.getHttpServer())
        .get(`/goals/${goalId}`)
        .set('Authorization', `Bearer ${authToken}`);

      const remainingAmount = currentResponse.body.remaining;

      // Contribute remaining amount
      const response = await request(app.getHttpServer())
        .post(`/goals/${goalId}/contribute`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: remainingAmount,
        })
        .expect(HttpStatus.OK);

      expect(response.body.isCompleted).toBe(true);
      expect(response.body.progress).toBe(100);
      expect(response.body.remaining).toBe(0);
    });

    it('should fail with invalid contribution amount', async () => {
      await request(app.getHttpServer())
        .post(`/goals/${goalId}/contribute`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: -500,
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 404 for non-existent goal', async () => {
      await request(app.getHttpServer())
        .post('/goals/nonexistent-id/contribute')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ amount: 100 })
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .post(`/goals/${goalId}/contribute`)
        .send({ amount: 100 })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('DELETE /goals/:id', () => {
    let deleteableGoalId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/goals')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Temporary Goal',
          targetAmount: 1000,
          targetDate: '2026-12-31',
          category: 'OTHER',
        });
      deleteableGoalId = response.body.id;
    });

    it('should delete a goal', async () => {
      await request(app.getHttpServer())
        .delete(`/goals/${deleteableGoalId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.NO_CONTENT);

      // Verify deletion
      await request(app.getHttpServer())
        .get(`/goals/${deleteableGoalId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return 404 for non-existent goal', async () => {
      await request(app.getHttpServer())
        .delete('/goals/nonexistent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .delete(`/goals/${goalId}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('Goal Progress Tracking', () => {
    let progressGoalId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/goals')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Progress Test Goal',
          targetAmount: 1000,
          currentAmount: 0,
          targetDate: '2026-12-31',
          category: 'SAVINGS',
        });
      progressGoalId = response.body.id;
    });

    it('should track progress through multiple contributions', async () => {
      // First contribution
      let response = await request(app.getHttpServer())
        .post(`/goals/${progressGoalId}/contribute`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ amount: 250 });
      expect(response.body.progress).toBe(25);

      // Second contribution
      response = await request(app.getHttpServer())
        .post(`/goals/${progressGoalId}/contribute`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ amount: 250 });
      expect(response.body.progress).toBe(50);

      // Third contribution
      response = await request(app.getHttpServer())
        .post(`/goals/${progressGoalId}/contribute`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ amount: 500 });
      expect(response.body.progress).toBe(100);
      expect(response.body.isCompleted).toBe(true);
    });
  });
});
