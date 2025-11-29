import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import { TestDatabase } from './helpers/test-database';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Apply same global pipes as main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    
    prisma = app.get<PrismaService>(PrismaService);
    
    // Clean database before tests
    await TestDatabase.cleanup();
  });

  afterAll(async () => {
    await TestDatabase.cleanup();
    await app.close();
  });

  afterEach(async () => {
    // Clean between tests
    await TestDatabase.cleanup();
  });

  describe('/auth/signup (POST)', () => {
    it('should register a new user successfully', async () => {
      const signupDto = {
        email: 'newuser@example.com',
        password: 'Password123!',
        name: 'New User',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupDto)
        .expect(201);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body).toHaveProperty('expiresIn');
      expect(response.body.tokenType).toBe('Bearer');

      // Verify user was created in database
      const user = await prisma.user.findUnique({
        where: { email: signupDto.email },
      });
      expect(user).toBeDefined();
      expect(user?.name).toBe(signupDto.name);
    });

    it('should fail with weak password', async () => {
      const signupDto = {
        email: 'test@example.com',
        password: 'weak',
        name: 'Test User',
      };

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupDto)
        .expect(400);
    });

    it('should fail with invalid email', async () => {
      const signupDto = {
        email: 'not-an-email',
        password: 'Password123!',
        name: 'Test User',
      };

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupDto)
        .expect(400);
    });

    it('should fail if email already exists', async () => {
      const signupDto = {
        email: 'existing@example.com',
        password: 'Password123!',
        name: 'Existing User',
      };

      // First signup
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupDto)
        .expect(201);

      // Second signup with same email
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupDto)
        .expect(409); // Conflict
    });
  });

  describe('/auth/signin (POST)', () => {
    const userCredentials = {
      email: 'loginuser@example.com',
      password: 'Password123!',
      name: 'Login User',
    };

    beforeEach(async () => {
      // Create user for login tests
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(userCredentials);
    });

    it('should login successfully with valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: userCredentials.email,
          password: userCredentials.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('should fail with invalid password', async () => {
      await request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: userCredentials.email,
          password: 'WrongPassword123!',
        })
        .expect(401);
    });

    it('should fail with non-existent email', async () => {
      await request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123!',
        })
        .expect(401);
    });
  });

  describe('/auth/refresh (POST)', () => {
    let refreshToken: string;

    beforeEach(async () => {
      const signupDto = {
        email: 'refreshuser@example.com',
        password: 'Password123!',
        name: 'Refresh User',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupDto);

      refreshToken = response.body.refreshToken;
    });

    it('should refresh token successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.accessToken).not.toBe(refreshToken);
    });

    it('should fail with invalid refresh token', async () => {
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);
    });
  });

  describe('/auth/profile (GET)', () => {
    let accessToken: string;

    beforeEach(async () => {
      const signupDto = {
        email: 'profileuser@example.com',
        password: 'Password123!',
        name: 'Profile User',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupDto);

      accessToken = response.body.accessToken;
    });

    it('should get user profile with valid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('name');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should fail without authorization token', async () => {
      await request(app.getHttpServer())
        .get('/auth/profile')
        .expect(401);
    });

    it('should fail with invalid token', async () => {
      await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('/auth/logout (POST)', () => {
    let accessToken: string;

    beforeEach(async () => {
      const signupDto = {
        email: 'logoutuser@example.com',
        password: 'Password123!',
        name: 'Logout User',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupDto);

      accessToken = response.body.accessToken;
    });

    it('should logout successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });

    it('should fail without authorization token', async () => {
      await request(app.getHttpServer())
        .post('/auth/logout')
        .expect(401);
    });
  });
});
