import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Goal, Prisma } from '@prisma/client';

@Injectable()
export class GoalRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.GoalUncheckedCreateInput): Promise<Goal> {
    return this.prisma.goal.create({ data });
  }

  async findById(id: string, userId: string): Promise<Goal | null> {
    return this.prisma.goal.findFirst({
      where: { id, userId },
    });
  }

  async findAll(userId: string): Promise<Goal[]> {
    return this.prisma.goal.findMany({
      where: { userId },
      orderBy: { targetDate: 'asc' },
    });
  }

  async update(id: string, data: Prisma.GoalUpdateInput): Promise<Goal> {
    return this.prisma.goal.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Goal> {
    return this.prisma.goal.delete({
      where: { id },
    });
  }
}
