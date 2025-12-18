import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '@/database/prisma.service';
import { mockPrismaService, mockConfigService } from '../../../test/helpers/mocks';

describe('JwtStrategy', () => {
    let strategy: JwtStrategy;
    let prisma: jest.Mocked<PrismaService>;

    const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        password: '$2b$10$hashedPassword',
        preferredCurrency: 'USD',
        timezone: 'UTC',
        language: 'en',
        onboardingCompleted: true,
        onboardingStep: 4,
        image: null,
        emailVerified: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        // Ensure config returns JWT_SECRET
        mockConfigService.get.mockImplementation((key: string) => {
            if (key === 'JWT_SECRET') return 'test-jwt-secret';
            if (key === 'JWT_EXPIRATION') return '1h';
            return undefined;
        });

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JwtStrategy,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
            ],
        }).compile();

        strategy = module.get<JwtStrategy>(JwtStrategy);
        prisma = module.get(PrismaService) as jest.Mocked<PrismaService>;
    });

    it('should be defined', () => {
        expect(strategy).toBeDefined();
    });

    describe('validate', () => {
        it('should return user data for valid payload', async () => {
            const payload = { sub: 'user-123', email: 'test@example.com' };
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

            const result = await strategy.validate(payload);

            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { id: 'user-123' },
            });
            expect(result).toBeDefined();
            expect(result.sub).toBe('user-123');
            expect(result.email).toBe('test@example.com');
        });

        it('should throw UnauthorizedException if user not found', async () => {
            const payload = { sub: 'nonexistent', email: 'unknown@example.com' };
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(strategy.validate(payload)).rejects.toThrow(
                UnauthorizedException,
            );
        });

        it('should handle missing sub in payload', async () => {
            const payload = { email: 'test@example.com' } as any;
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(strategy.validate(payload)).rejects.toThrow(
                UnauthorizedException,
            );
        });

        it('should return payload with user info when user exists', async () => {
            const payload = { sub: 'user-123', email: 'test@example.com' };
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

            const result = await strategy.validate(payload);

            expect(result).toMatchObject({
                sub: 'user-123',
                email: 'test@example.com',
            });
        });
    });
});
