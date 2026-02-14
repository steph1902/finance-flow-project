import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';

describe('Notifications (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let testUserId: string;
  let notificationId: string;

  const testUser = {
    email: `notifications-test-${Date.now()}@example.com`,
    password: 'TestPassword123!',
    name: 'Notifications Test User',
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

    // Create test notification
    if (testUserId) {
      const notification = await prisma.notification.create({
        data: {
          userId: testUserId,
          type: 'BUDGET_ALERT',
          title: 'Test Notification',
          message: 'This is a test notification',
          isRead: false,
        },
      });
      notificationId = notification.id;
    }
  });

  afterAll(async () => {
    // Cleanup test data
    if (testUserId) {
      await prisma.notification.deleteMany({ where: { userId: testUserId } });
      await prisma.user.delete({ where: { id: testUserId } }).catch(() => {});
    }
    await app.close();
  });

  describe('GET /notifications', () => {
    it('should return 401 without auth token', () => {
      return request(app.getHttpServer()).get('/notifications').expect(401);
    });

    it('should return paginated notifications', () => {
      return request(app.getHttpServer())
        .get('/notifications')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });
  });

  describe('GET /notifications/unread-count', () => {
    it('should return unread count', () => {
      return request(app.getHttpServer())
        .get('/notifications/unread-count')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('count');
          expect(typeof res.body.count).toBe('number');
        });
    });
  });

  describe('PUT /notifications/:id/read', () => {
    it('should mark notification as read', () => {
      return request(app.getHttpServer())
        .put(`/notifications/${notificationId}/read`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.isRead).toBe(true);
        });
    });
  });

  describe('PUT /notifications/mark-all-read', () => {
    it('should mark all notifications as read', () => {
      return request(app.getHttpServer())
        .put('/notifications/mark-all-read')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('updated');
        });
    });
  });

  describe('DELETE /notifications/:id', () => {
    it('should delete a notification', () => {
      return request(app.getHttpServer())
        .delete(`/notifications/${notificationId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);
    });
  });
});
