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

    // Convert date range to month/year filters
    if (query.startDate || query.endDate) {
      const startMonth = query.startDate ? query.startDate.getMonth() + 1 : undefined;
      const startYear = query.startDate ? query.startDate.getFullYear() : undefined;
      const endMonth = query.endDate ? query.endDate.getMonth() + 1 : undefined;
      const endYear = query.endDate ? query.endDate.getFullYear() : undefined;

      where.AND = [];
      if (startYear && startMonth) {
        where.AND.push({
          OR: [{ year: { gt: startYear } }, { year: startYear, month: { gte: startMonth } }],
        });
      }
      if (endYear && endMonth) {
        where.AND.push({
          OR: [{ year: { lt: endYear } }, { year: endYear, month: { lte: endMonth } }],
        });
      }
    }

    return this.prisma.budget.findMany({
      where,
      orderBy: { year: 'desc', month: 'desc' },
    });
  }

  async findOverlapping(
    userId: string,
    category: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Budget[]> {
    const startMonth = startDate.getMonth() + 1;
    const startYear = startDate.getFullYear();
    const endMonth = endDate.getMonth() + 1;
    const endYear = endDate.getFullYear();

    return this.prisma.budget.findMany({
      where: {
        userId,
        category,
        OR: [
          // Budget starts in the given range
          {
            AND: [
              { year: startYear, month: { gte: startMonth } },
              { year: startYear, month: { lte: endMonth } },
            ],
          },
          // Budget ends in the given range
          {
            AND: [
              { year: endYear, month: { gte: startMonth } },
              { year: endYear, month: { lte: endMonth } },
            ],
          },
          // Budget spans the entire range
          {
            AND: [
              { year: startYear, month: { lte: startMonth } },
              { year: endYear, month: { gte: endMonth } },
            ],
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
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Find budgets from previous month with rollover enabled
    let prevMonth = currentMonth - 1;
    let prevYear = currentYear;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear = currentYear - 1;
    }

    return this.prisma.budget.findMany({
      where: {
        userId,
        rollover: true,
        month: prevMonth,
        year: prevYear,
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
