import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: jest.Mocked<UsersService>;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    image: null,
    preferredCurrency: 'USD',
    timezone: 'UTC',
    language: 'en',
    onboardingCompleted: false,
    onboardingStep: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findById: jest.fn(),
            updateProfile: jest.fn(),
            deleteAccount: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get(UsersService) as jest.Mocked<UsersService>;

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCurrentUser', () => {
    it('should return user profile', async () => {
      service.findById.mockResolvedValue(mockUser);

      const result = await controller.getCurrentUser('user-123');

      expect(result).toEqual(mockUser);
      expect(service.findById).toHaveBeenCalledWith('user-123');
    });
  });

  describe('updateProfile', () => {
    const updateDto = {
      name: 'Updated Name',
      timezone: 'America/New_York',
    };

    it('should update user profile', async () => {
      const updatedUser = { ...mockUser, ...updateDto };
      service.updateProfile.mockResolvedValue(updatedUser);

      const result = await controller.updateProfile('user-123', updateDto);

      expect(result).toEqual(updatedUser);
      expect(service.updateProfile).toHaveBeenCalledWith('user-123', updateDto);
    });
  });

  describe('deleteAccount', () => {
    it('should delete user account', async () => {
      const deleteResponse = { message: 'Account successfully deleted' };
      service.deleteAccount.mockResolvedValue(deleteResponse);

      const result = await controller.deleteAccount('user-123');

      expect(result).toEqual(deleteResponse);
      expect(service.deleteAccount).toHaveBeenCalledWith('user-123');
    });
  });
});
