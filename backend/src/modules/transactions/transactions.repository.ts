import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/database/prisma.service';

/**
 * Transactions Repository
 * Data access layer for transactions
 * Encapsulates all Prisma operations
 */
@Injectable()
export class TransactionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.TransactionUncheckedCreateInput) {
    return this.prisma.transaction.create({ data });
  }

  async findMany(params: {
    where?: Prisma.TransactionWhereInput;
    skip?: number;
    take?: number;
    orderBy?: Prisma.TransactionOrderByWithRelationInput;
  }) {
    return this.prisma.transaction.findMany(params);
  }

  async findOne(params: { where: Prisma.TransactionWhereUniqueInput }) {
    return this.prisma.transaction.findFirst(params);
  }

  async update(params: {
    where: Prisma.TransactionWhereUniqueInput;
    data: Prisma.TransactionUpdateInput;
  }) {
    return this.prisma.transaction.update(params);
  }

  async delete(where: Prisma.TransactionWhereUniqueInput) {
    return this.prisma.transaction.delete({ where });
  }

  async count(where?: Prisma.TransactionWhereInput) {
    return this.prisma.transaction.count({ where });
  }

  async aggregate(params: {
    where?: Prisma.TransactionWhereInput;
    _sum?: Prisma.TransactionSumAggregateInputType;
  }) {
    return this.prisma.transaction.aggregate(params);
  }

  async groupBy(params: {
    by: Prisma.TransactionScalarFieldEnum[];
    where?: Prisma.TransactionWhereInput;
    _sum?: Prisma.TransactionSumAggregateInputType;
    _count?: boolean | Prisma.TransactionCountAggregateInputType;
  }) {
    return this.prisma.transaction.groupBy(params as any);
  }

  async createMany(data: Prisma.TransactionCreateManyInput[]) {
    return this.prisma.transaction.createMany({
      data,
      skipDuplicates: true,
    });
  }
}
