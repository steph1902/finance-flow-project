import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import { TestDatabase } from './helpers/test-database';

describe('TransactionsController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    
    prisma = app.get<PrismaService>(PrismaService);
    await TestDatabase.cleanup();

    // Create test user and get auth token
    const signupResponse = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: 'transactions-test@example.com',
        password: 'Password123!',
        name: 'Transactions Test User',
      });

    accessToken = signupResponse.body.accessToken;
    
    const user = await prisma.user.findUnique({
      where: { email: 'transactions-test@example.com' },
    });
    userId = user!.id;
  });

  afterAll(async () => {
    await TestDatabase.cleanup();
    await app.close();
  });

  afterEach(async () => {
    // Clean transactions between tests
    await prisma.transaction.deleteMany({
      where: { userId },
    });
  });

  describe('/transactions (POST)', () => {
    it('should create a new transaction', async () => {
      const transactionDto = {
        amount: 150.75,
        type: 'EXPENSE',
        category: 'Food',
        description: 'Dinner',
        date: new Date().toISOString(),
      };

      const response = await request(app.getHttpServer())
        .post('/transactions')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(transactionDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.amount).toBe('150.75');
      expect(response.body.type).toBe('EXPENSE');
      expect(response.body.category).toBe('Food');
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .post('/transactions')
        .send({ amount: 100, type: 'EXPENSE', category: 'Food' })
        .expect(401);
    });

    it('should validate required fields', async () => {
      await request(app.getHttpServer())
        .post('/transactions')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ amount: 100 }) // Missing type and category
        .expect(400);
    });

    it('should validate amount is positive', async () => {
      await request(app.getHttpServer())
        .post('/transactions')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          amount: -100,
          type: 'EXPENSE',
          category: 'Food',
          date: new Date(),
        })
        .expect(400);
    });
  });

  describe('/transactions (GET)', () => {
    beforeEach(async () => {
      // Create test transactions
      await prisma.transaction.createMany({
        data: [
          {
            userId,
            amount: 100,
            type: 'EXPENSE',
            category: 'Food',
            description: 'Groceries',
            date: new Date('2025-01-15'),
          },
          {
            userId,
            amount: 3000,
            type: 'INCOME',
            category: 'Salary',
            description: 'Monthly salary',
            date: new Date('2025-01-01'),
          },
          {
            userId,
            amount: 50,
            type: 'EXPENSE',
            category: 'Transport',
            description: 'Gas',
            date: new Date('2025-01-10'),
          },
        ],
      });
    });

    it('should get all user transactions', async () => {
      const response = await request(app.getHttpServer())
        .get('/transactions')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.data).toHaveLength(3);
      expect(response.body.meta).toHaveProperty('total', 3);
      expect(response.body.meta).toHaveProperty('page', 1);
    });

    it('should filter by type', async () => {
      const response = await request(app.getHttpServer())
        .get('/transactions?type=EXPENSE')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every((t: any) => t.type === 'EXPENSE')).toBe(true);
    });

    it('should filter by category', async () => {
      const response = await request(app.getHttpServer())
        .get('/transactions?category=Food')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].category).toBe('Food');
    });

    it('should paginate results', async () => {
      const response = await request(app.getHttpServer())
        .get('/transactions?page=1&limit=2')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.meta.totalPages).toBe(2);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .get('/transactions')
        .expect(401);
    });
  });

  describe('/transactions/:id (GET)', () => {
    let transactionId: string;

    beforeEach(async () => {
      const transaction = await prisma.transaction.create({
        data: {
          userId,
          amount: 100,
          type: 'EXPENSE',
          category: 'Food',
          date: new Date(),
        },
      });
      transactionId = transaction.id;
    });

    it('should get single transaction', async () => {
      const response = await request(app.getHttpServer())
        .get(`/transactions/${transactionId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.id).toBe(transactionId);
      expect(response.body.amount).toBe('100');
    });

    it('should return 404 for non-existent transaction', async () => {
      await request(app.getHttpServer())
        .get('/transactions/nonexistent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('/transactions/:id (PUT)', () => {
    let transactionId: string;

    beforeEach(async () => {
      const transaction = await prisma.transaction.create({
        data: {
          userId,
          amount: 100,
          type: 'EXPENSE',
          category: 'Food',
          date: new Date(),
        },
      });
      transactionId = transaction.id;
    });

    it('should update transaction', async () => {
      const updateDto = {
        amount: 200,
        category: 'Entertainment',
        description: 'Updated description',
      };

      const response = await request(app.getHttpServer())
        .put(`/transactions/${transactionId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateDto)
        .expect(200);

      expect(response.body.amount).toBe('200');
      expect(response.body.category).toBe('Entertainment');
      expect(response.body.description).toBe('Updated description');
    });

    it('should return 404 for non-existent transaction', async () => {
      await request(app.getHttpServer())
        .put('/transactions/nonexistent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ amount: 200 })
        .expect(404);
    });
  });

  describe('/transactions/:id (DELETE)', () => {
    let transactionId: string;

    beforeEach(async () => {
      const transaction = await prisma.transaction.create({
        data: {
          userId,
          amount: 100,
          type: 'EXPENSE',
          category: 'Food',
          date: new Date(),
        },
      });
      transactionId = transaction.id;
    });

    it('should soft delete transaction', async () => {
      await request(app.getHttpServer())
        .delete(`/transactions/${transactionId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const deleted = await prisma.transaction.findUnique({
        where: { id: transactionId },
      });

      expect(deleted?.deletedAt).not.toBeNull();
    });

    it('should return 404 for non-existent transaction', async () => {
      await request(app.getHttpServer())
        .delete('/transactions/nonexistent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('/transactions/statistics (GET)', () => {
    beforeEach(async () => {
      await prisma.transaction.createMany({
        data: [
          {
            userId,
            amount: 3000,
            type: 'INCOME',
            category: 'Salary',
            date: new Date('2025-01-01'),
          },
          {
            userId,
            amount: 1000,
            type: 'EXPENSE',
            category: 'Food',
            date: new Date('2025-01-15'),
          },
          {
            userId,
            amount: 500,
            type: 'EXPENSE',
            category: 'Transport',
            date: new Date('2025-01-20'),
          },
        ],
      });
    });

    it('should get transaction statistics', async () => {
      const response = await request(app.getHttpServer())
        .get('/transactions/statistics')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('totalIncome');
      expect(response.body).toHaveProperty('totalExpenses');
      expect(response.body).toHaveProperty('netIncome');
      expect(response.body.transactionCount).toBeGreaterThan(0);
    });

    it('should filter statistics by date range', async () => {
      const response = await request(app.getHttpServer())
        .get('/transactions/statistics?startDate=2025-01-01&endDate=2025-01-31')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('totalIncome');
    });
  });

  describe('/transactions/export (GET)', () => {
    beforeEach(async () => {
      await prisma.transaction.create({
        data: {
          userId,
          amount: 100,
          type: 'EXPENSE',
          category: 'Food',
          description: 'Test',
          date: new Date(),
        },
      });
    });

    it('should export transactions as CSV', async () => {
      const response = await request(app.getHttpServer())
        .get('/transactions/export')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.headers['content-type']).toContain('text/csv');
      expect(response.text).toContain('Date,Amount,Type,Category,Description');
    });
  });
});
