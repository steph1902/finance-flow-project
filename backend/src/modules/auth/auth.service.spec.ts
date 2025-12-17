import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '@/database/prisma.service';
import { mockPrismaService, mockJwtService, mockConfigService } from '../../../test/helpers/mocks';

// Mock bcrypt
jest.mock('bcrypt');
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;
  let prisma: jest.Mocked<PrismaService>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    password: '$2b$10$hashedPassword',
    name: 'Test User',
    preferredCurrency: 'USD',
    timezone: 'UTC',
    language: 'en',
    onboardingCompleted: false,
    onboardingStep: 0,
    image: null,
    emailVerified: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get(PrismaService) as jest.Mocked<PrismaService>;
    jwtService = module.get(JwtService) as jest.Mocked<JwtService>;
    configService = module.get(ConfigService) as jest.Mocked<ConfigService>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    const signupDto = {
      email: 'newuser@example.com',
      password: 'Password123!',
      name: 'New User',
    };

    it('should successfully register a new user', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      mockBcrypt.hash.mockResolvedValue('hashedPassword123' as never);
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
      jwtService.sign.mockReturnValue('access-token');
      configService.get.mockReturnValue('test-refresh-secret');

      const result = await service.signup(signupDto);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: signupDto.email },
      });
      expect(mockBcrypt.hash).toHaveBeenCalledWith(signupDto.password, 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: signupDto.email,
          password: 'hashedPassword123',
          name: signupDto.name,
        },
      });
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw ConflictException if user already exists', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await expect(service.signup(signupDto)).rejects.toThrow(
        ConflictException,
      );
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('should throw error if password hashing fails', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      mockBcrypt.hash.mockRejectedValue(new Error('Hashing failed') as never);

      await expect(service.signup(signupDto)).rejects.toThrow(
        'Hashing failed',
      );
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe('signin', () => {
    const signinDto = {
      email: 'test@example.com',
      password: 'Password123!',
    };

    it('should successfully login with valid credentials', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(true as never);
      jwtService.sign.mockReturnValue('access-token');
      configService.get.mockReturnValue('test-refresh-secret');

      const result = await service.signin(signinDto);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: signinDto.email },
      });
      expect(mockBcrypt.compare).toHaveBeenCalledWith(
        signinDto.password,
        mockUser.password,
      );
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.signin(signinDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockBcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(false as never);

      await expect(service.signin(signinDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user has no password (OAuth user)', async () => {
      const oauthUser = { ...mockUser, password: null };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(oauthUser);

      await expect(service.signin(signinDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockBcrypt.compare).not.toHaveBeenCalled();
    });
  });

  describe('validateUser', () => {
    it('should return user data if user exists', async () => {
      const payload = { sub: 'user-123', email: 'test@example.com' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.validateUser(payload);

      expect(result).toBeDefined();
      expect(result?.email).toBe(mockUser.email);
      expect(result).not.toHaveProperty('password');
    });

    it('should return null if user not found', async () => {
      const payload = { sub: 'nonexistent', email: 'test@example.com' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.validateUser(payload);

      expect(result).toBeNull();
    });
  });

  describe('refreshToken', () => {
    const refreshToken = 'valid-refresh-token';

    it('should return new tokens with valid refresh token', async () => {
      const decoded = { sub: 'user-123', email: 'test@example.com' };
      jwtService.verify.mockReturnValue(decoded);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      jwtService.sign.mockReturnValue('new-access-token');
      configService.get.mockReturnValue('test-refresh-secret');

      const result = await service.refreshToken(refreshToken);

      expect(jwtService.verify).toHaveBeenCalledWith(refreshToken, {
        secret: 'test-refresh-secret',
      });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-123' },
      });
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw UnauthorizedException if token verification fails', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refreshToken(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const decoded = { sub: 'user-123', email: 'test@example.com' };
      jwtService.verify.mockReturnValue(decoded);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.refreshToken(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});