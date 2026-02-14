import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let notificationsService: jest.Mocked<NotificationsService>;

  const mockNotificationsService = {
    findAll: jest.fn(),
    getUnreadCount: jest.fn(),
    markAsRead: jest.fn(),
    markAllAsRead: jest.fn(),
    remove: jest.fn(),
  };

  const userId = 'user-123';
  const notificationId = 'notification-123';

  const mockNotification = {
    id: notificationId,
    userId,
    type: 'BUDGET_ALERT',
    title: 'Budget Warning',
    message: 'You have exceeded 80% of your food budget',
    isRead: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<NotificationsController>(NotificationsController);
    notificationsService = module.get(NotificationsService) as jest.Mocked<NotificationsService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all notifications', async () => {
      const notifications = [mockNotification];
      mockNotificationsService.findAll.mockResolvedValue({
        data: notifications,
        total: 1,
        page: 1,
        limit: 10,
      });

      const result = await controller.findAll(userId, {});

      expect(notificationsService.findAll).toHaveBeenCalledWith(userId, {});
      expect(result.data).toEqual(notifications);
    });

    it('should pass query parameters to service', async () => {
      const query = { unreadOnly: true, page: 1, limit: 20 };
      mockNotificationsService.findAll.mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 20,
      });

      await controller.findAll(userId, query);

      expect(notificationsService.findAll).toHaveBeenCalledWith(userId, query);
    });
  });

  describe('getUnreadCount', () => {
    it('should return unread notification count', async () => {
      mockNotificationsService.getUnreadCount.mockResolvedValue({ count: 5 });

      const result = await controller.getUnreadCount(userId);

      expect(notificationsService.getUnreadCount).toHaveBeenCalledWith(userId);
      expect(result).toEqual({ count: 5 });
    });

    it('should return zero when no unread notifications', async () => {
      mockNotificationsService.getUnreadCount.mockResolvedValue({ count: 0 });

      const result = await controller.getUnreadCount(userId);

      expect(result).toEqual({ count: 0 });
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      const readNotification = { ...mockNotification, isRead: true };
      mockNotificationsService.markAsRead.mockResolvedValue(readNotification);

      const result = await controller.markAsRead(userId, notificationId);

      expect(notificationsService.markAsRead).toHaveBeenCalledWith(userId, notificationId);
      expect(result.isRead).toBe(true);
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', async () => {
      mockNotificationsService.markAllAsRead.mockResolvedValue({ updated: 5 });

      const result = await controller.markAllAsRead(userId);

      expect(notificationsService.markAllAsRead).toHaveBeenCalledWith(userId);
      expect(result).toEqual({ updated: 5 });
    });
  });

  describe('remove', () => {
    it('should delete a notification', async () => {
      mockNotificationsService.remove.mockResolvedValue(undefined);

      await controller.remove(userId, notificationId);

      expect(notificationsService.remove).toHaveBeenCalledWith(userId, notificationId);
    });
  });
});
