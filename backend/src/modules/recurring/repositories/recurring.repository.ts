import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { RecurringTransaction, Prisma } from '@prisma/client';

@Injectable()
export class RecurringRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.RecurringTransactionUncheckedCreateInput): Promise<RecurringTransaction> {
    return this.prisma.recurringTransaction.create({ data });
  }

  async findById(id: string, userId: string): Promise<RecurringTransaction | null> {
    return this.prisma.recurringTransaction.findFirst({
      where: { id, userId },
    });
  }

  async findAll(userId: string): Promise<RecurringTransaction[]> {
    return this.prisma.recurringTransaction.findMany({
      where: { userId, isActive: true },
      orderBy: { nextDate: 'asc' },
    });
  }

  async findDue(): Promise<RecurringTransaction[]> {
    return this.prisma.recurringTransaction.findMany({
      where: {
        isActive: true,
        nextDate: { lte: new Date() },
        OR: [
          { endDate: null },
          { endDate: { gte: new Date() } },
        ],
      },
    });
  }

  async update(id: string, data: Prisma.RecurringTransactionUpdateInput): Promise<RecurringTransaction> {
    return this.prisma.recurringTransaction.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<RecurringTransaction> {
    return this.prisma.recurringTransaction.delete({
      where: { id },
    });
  }
}
