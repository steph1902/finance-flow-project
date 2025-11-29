import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Notification, Prisma } from '@prisma/client';
import { NotificationQueryDto } from '../dto';

@Injectable()
export class NotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.NotificationUncheckedCreateInput): Promise<Notification> {
    return this.prisma.notification.create({ data });
  }

  async findById(id: string, userId: string): Promise<Notification | null> {
    return this.prisma.notification.findFirst({
      where: { id, userId },
    });
  }

  async findAll(userId: string, query: NotificationQueryDto): Promise<Notification[]> {
    const where: Prisma.NotificationWhereInput = { userId };

    if (query.read !== undefined) {
      where.status = query.read ? 'READ' : 'UNREAD';
    }

    if (query.type) {
      where.type = query.type;
    }

    return this.prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: query.limit || 50,
      skip: query.offset || 0,
    });
  }

  async countUnread(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { userId, status: 'UNREAD' },
    });
  }

  async update(id: string, data: Prisma.NotificationUpdateInput): Promise<Notification> {
    return this.prisma.notification.update({
      where: { id },
      data,
    });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { userId, status: 'UNREAD' },
      data: { status: 'READ', readAt: new Date() },
    });
  }

  async delete(id: string): Promise<Notification> {
    return this.prisma.notification.delete({
      where: { id },
    });
  }
}
