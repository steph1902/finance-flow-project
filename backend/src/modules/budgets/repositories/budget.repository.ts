import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Budget, Prisma } from '@prisma/client';
import { BudgetQueryDto } from '../dto';

@Injectable()
export class BudgetRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.BudgetUncheckedCreateInput): Promise<Budget> {
    return this.prisma.budget.create({ data });
  }

  async findById(id: string, userId: string): Promise<Budget | null> {
    return this.prisma.budget.findFirst({
      where: { id, userId },
    });
  }

  async findAll(userId: string, query: BudgetQueryDto): Promise<Budget[]> {
    const where: Prisma.BudgetWhereInput = { userId };

    if (query.category) {
      where.category = query.category;
    }

    if (query.startDate || query.endDate) {
      where.AND = [];
      if (query.startDate) {
        where.AND.push({ endDate: { gte: query.startDate } });
      }
      if (query.endDate) {
        where.AND.push({ startDate: { lte: query.endDate } });
      }
    }

    return this.prisma.budget.findMany({
      where,
      orderBy: { startDate: 'desc' },
    });
  }

  async findOverlapping(
    userId: string,
    category: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Budget[]> {
    return this.prisma.budget.findMany({
      where: {
        userId,
        category,
        OR: [
          {
            AND: [{ startDate: { lte: startDate } }, { endDate: { gte: startDate } }],
          },
          {
            AND: [{ startDate: { lte: endDate } }, { endDate: { gte: endDate } }],
          },
          {
            AND: [{ startDate: { gte: startDate } }, { endDate: { lte: endDate } }],
          },
        ],
      },
    });
  }

  async update(id: string, data: Prisma.BudgetUpdateInput): Promise<Budget> {
    return this.prisma.budget.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Budget> {
    return this.prisma.budget.delete({
      where: { id },
    });
  }

  async updateSpent(id: string, spent: Prisma.Decimal): Promise<Budget> {
    return this.prisma.budget.update({
      where: { id },
      data: { spent },
    });
  }

  async findRolloverCandidates(userId: string): Promise<Budget[]> {
    const now = new Date();
    return this.prisma.budget.findMany({
      where: {
        userId,
        rollover: true,
        endDate: { lt: now },
      },
    });
  }

  async incrementSpent(id: string, amount: Prisma.Decimal): Promise<Budget> {
    return this.prisma.budget.update({
      where: { id },
      data: {
        spent: {
          increment: amount,
        },
      },
    });
  }
}
