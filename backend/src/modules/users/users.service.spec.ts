import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '@/database/prisma.service';
import { mockPrismaService } from '../../../test/helpers/mocks';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: jest.Mocked<PrismaService>;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    password: '$2b$10$hashedPassword',
    name: 'Test User',
    image: null,
    emailVerified: null,
    preferredCurrency: 'USD',
    timezone: 'UTC',
    language: 'en',
    onboardingCompleted: false,
    onboardingStep: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserResponse = {
    id: mockUser.id,
    email: mockUser.email,
    name: mockUser.name,
    image: mockUser.image,
    preferredCurrency: mockUser.preferredCurrency,
    timezone: mockUser.timezone,
    language: mockUser.language,
    onboardingCompleted: mockUser.onboardingCompleted,
    onboardingStep: mockUser.onboardingStep,
    createdAt: mockUser.createdAt,
    updatedAt: mockUser.updatedAt,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get(PrismaService) as jest.Mocked<PrismaService>;

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      (prisma.user.delete as jest.Mock).mockRejectedValue(new Error('Delete failed'));

      const result = await service.findById('user-123');

      expect(result).toEqual(mockUserResponse);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        select: expect.objectContaining({
          id: true,
          email: true,
          name: true,
        }),
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
      await expect(service.findById('nonexistent')).rejects.toThrow('User not found');
    });
  });

  describe('findByEmail', () => {
    it('should return user when found', async () => {
      (prisma.user.delete as jest.Mock).mockRejectedValue(new Error('Delete failed'));

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should return null when user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('updateProfile', () => {
    const updateDto = {
      name: 'Updated Name',
      timezone: 'America/New_York',
      preferredCurrency: 'EUR',
    };

    it('should update user profile successfully', async () => {
      const updatedUser = { ...mockUser, ...updateDto };
      (prisma.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await service.updateProfile('user-123', updateDto);

      expect(result).toBeDefined();
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: updateDto,
        select: expect.objectContaining({
          id: true,
          email: true,
          name: true,
        }),
      });
    });

    it('should handle partial updates', async () => {
      const partialUpdate = { name: 'New Name' };
      const updatedUser = { ...mockUser, ...partialUpdate };
      (prisma.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await service.updateProfile('user-123', partialUpdate);

      expect(result).toBeDefined();
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: partialUpdate,
        select: expect.any(Object),
      });
    });
  });

  describe('updateOnboarding', () => {
    it('should update onboarding status with step', async () => {
      const updatedUser = {
        ...mockUser,
        onboardingCompleted: true,
        onboardingStep: 5,
      };
      (prisma.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await service.updateOnboarding('user-123', true, 5);

      expect(result).toBeDefined();
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: {
          onboardingCompleted: true,
          onboardingStep: 5,
        },
      });
    });

    it('should update onboarding status without step', async () => {
      const updatedUser = { ...mockUser, onboardingCompleted: true };
      (prisma.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await service.updateOnboarding('user-123', true);

      expect(result).toBeDefined();
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: {
          onboardingCompleted: true,
        },
      });
    });

    it('should handle marking onboarding incomplete', async () => {
      const updatedUser = {
        ...mockUser,
        onboardingCompleted: false,
        onboardingStep: 2,
      };
      (prisma.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await service.updateOnboarding('user-123', false, 2);

      expect(result).toBeDefined();
      expect(result.onboardingCompleted).toBe(false);
    });
  });

  describe('deleteAccount', () => {
    it('should delete user account successfully', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.deleteAccount('user-123');

      expect(result).toEqual({ message: 'Account successfully deleted' });
      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: 'user-123' },
      });
    });

    it('should handle deletion errors', async () => {
      (prisma.user.delete as jest.Mock).mockRejectedValue(new Error('Delete failed'));

      await expect(service.deleteAccount('user-123')).rejects.toThrow('Database error');
    });
  });
});
