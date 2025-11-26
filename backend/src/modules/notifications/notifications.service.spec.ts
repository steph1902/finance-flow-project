import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationRepository } from './repositories/notification.repository';
import { EmailService } from './services/email.service';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let repository: jest.Mocked<NotificationRepository>;
  let emailService: jest.Mocked<EmailService>;

  const mockUserId = 'user-123';
  const mockNotificationId = 'notification-123';

  const mockNotification = {
    id: mockNotificationId,
    userId: mockUserId,
    title: 'Test Notification',
    message: 'This is a test notification',
    type: 'INFO',
    link: '/dashboard',
    read: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockNotificationRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    countUnread: jest.fn(),
    markAllAsRead: jest.fn(),
  };

  const mockEmailService = {
    sendNotification: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: NotificationRepository,
          useValue: mockNotificationRepository,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    repository = module.get(NotificationRepository);
    emailService = module.get(EmailService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a notification without sending email', async () => {
      const createData = {
        userId: mockUserId,
        title: 'Test Notification',
        message: 'This is a test',
        type: 'INFO',
        sendEmail: false,
      };

      repository.create.mockResolvedValue(mockNotification);

      const result = await service.create(createData);

      expect(repository.create).toHaveBeenCalledWith({
        userId: mockUserId,
        title: 'Test Notification',
        message: 'This is a test',
        type: 'INFO',
        link: undefined,
        read: false,
      });
      expect(emailService.sendNotification).not.toHaveBeenCalled();
      expect(result).toEqual(mockNotification);
    });

    it('should create a notification and send email', async () => {
      const createData = {
        userId: mockUserId,
        title: 'Important Alert',
        message: 'This requires immediate attention',
        type: 'ALERT',
        link: '/dashboard/alerts',
        sendEmail: true,
      };

      repository.create.mockResolvedValue(mockNotification);
      emailService.sendNotification.mockResolvedValue(undefined);

      const result = await service.create(createData);

      expect(repository.create).toHaveBeenCalled();
      expect(emailService.sendNotification).toHaveBeenCalledWith(mockUserId, {
        title: 'Important Alert',
        message: 'This requires immediate attention',
        link: '/dashboard/alerts',
      });
      expect(result).toEqual(mockNotification);
    });
  });

  describe('findAll', () => {
    it('should return all notifications for user', async () => {
      const notifications = [mockNotification, { ...mockNotification, id: 'notification-456' }];
      const query = { read: false };

      repository.findAll.mockResolvedValue(notifications);

      const result = await service.findAll(mockUserId, query);

      expect(repository.findAll).toHaveBeenCalledWith(mockUserId, query);
      expect(result).toEqual(notifications);
    });
  });

  describe('getUnreadCount', () => {
    it('should return unread notification count', async () => {
      repository.countUnread.mockResolvedValue(5);

      const result = await service.getUnreadCount(mockUserId);

      expect(repository.countUnread).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual({ count: 5 });
    });

    it('should return zero when no unread notifications', async () => {
      repository.countUnread.mockResolvedValue(0);

      const result = await service.getUnreadCount(mockUserId);

      expect(result).toEqual({ count: 0 });
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      const readNotification = { ...mockNotification, read: true };

      repository.findById.mockResolvedValue(mockNotification);
      repository.update.mockResolvedValue(readNotification);

      const result = await service.markAsRead(mockUserId, mockNotificationId);

      expect(repository.findById).toHaveBeenCalledWith(mockNotificationId, mockUserId);
      expect(repository.update).toHaveBeenCalledWith(mockNotificationId, { read: true });
      expect(result).toEqual(readNotification);
    });

    it('should throw NotFoundException if notification not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.markAsRead(mockUserId, 'nonexistent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.markAsRead(mockUserId, 'nonexistent')).rejects.toThrow(
        'Notification with ID nonexistent not found',
      );
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', async () => {
      repository.markAllAsRead.mockResolvedValue(undefined);

      const result = await service.markAllAsRead(mockUserId);

      expect(repository.markAllAsRead).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual({ message: 'All notifications marked as read' });
    });
  });

  describe('remove', () => {
    it('should delete a notification successfully', async () => {
      repository.findById.mockResolvedValue(mockNotification);
      repository.delete.mockResolvedValue(undefined);

      await service.remove(mockUserId, mockNotificationId);

      expect(repository.findById).toHaveBeenCalledWith(mockNotificationId, mockUserId);
      expect(repository.delete).toHaveBeenCalledWith(mockNotificationId);
    });

    it('should throw NotFoundException if notification not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.remove(mockUserId, 'nonexistent')).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });

  describe('sendBudgetAlert', () => {
    it('should create budget alert notification with email', async () => {
      const budgetData = {
        category: 'GROCERIES',
        percentUsed: 85,
      };

      repository.create.mockResolvedValue(mockNotification);
      emailService.sendNotification.mockResolvedValue(undefined);

      await service.sendBudgetAlert(mockUserId, budgetData);

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockUserId,
          title: 'Budget Alert',
          message: 'You have used 85% of your GROCERIES budget',
          type: 'BUDGET_ALERT',
          read: false,
        }),
      );
      expect(emailService.sendNotification).toHaveBeenCalledWith(
        mockUserId,
        expect.objectContaining({
          title: 'Budget Alert',
          message: 'You have used 85% of your GROCERIES budget',
        }),
      );
    });

    it('should handle 100% budget usage', async () => {
      const budgetData = {
        category: 'ENTERTAINMENT',
        percentUsed: 100,
      };

      repository.create.mockResolvedValue(mockNotification);
      emailService.sendNotification.mockResolvedValue(undefined);

      await service.sendBudgetAlert(mockUserId, budgetData);

      const createCall = repository.create.mock.calls[0][0];
      expect(createCall.message).toContain('100%');
    });
  });

  describe('sendGoalMilestone', () => {
    it('should create goal milestone notification with email', async () => {
      const goalData = {
        name: 'Emergency Fund',
        progress: 50,
      };

      repository.create.mockResolvedValue(mockNotification);
      emailService.sendNotification.mockResolvedValue(undefined);

      await service.sendGoalMilestone(mockUserId, goalData);

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockUserId,
          title: 'Goal Milestone',
          message: "Congratulations! You've reached 50% of your Emergency Fund goal",
          type: 'GOAL_MILESTONE',
          read: false,
        }),
      );
      expect(emailService.sendNotification).toHaveBeenCalledWith(
        mockUserId,
        expect.objectContaining({
          title: 'Goal Milestone',
          message: "Congratulations! You've reached 50% of your Emergency Fund goal",
        }),
      );
    });

    it('should handle 100% goal completion', async () => {
      const goalData = {
        name: 'Vacation Fund',
        progress: 100,
      };

      repository.create.mockResolvedValue(mockNotification);
      emailService.sendNotification.mockResolvedValue(undefined);

      await service.sendGoalMilestone(mockUserId, goalData);

      const createCall = repository.create.mock.calls[0][0];
      expect(createCall.message).toContain('100%');
    });
  });
});
