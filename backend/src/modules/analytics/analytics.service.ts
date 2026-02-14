import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AnalyticsQueryDto } from './dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get financial overview
   */
  async getOverview(userId: string, query: AnalyticsQueryDto) {
    const { startDate, endDate } = this.getDateRange(query);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    let totalIncome = new Decimal(0);
    let totalExpenses = new Decimal(0);

    for (const transaction of transactions) {
      if (transaction.type === 'INCOME') {
        totalIncome = totalIncome.plus(transaction.amount);
      } else {
        totalExpenses = totalExpenses.plus(transaction.amount);
      }
    }

    const netSavings = totalIncome.minus(totalExpenses);

    return {
      totalIncome: totalIncome.toNumber(),
      totalExpenses: totalExpenses.toNumber(),
      netSavings: netSavings.toNumber(),
      transactionCount: transactions.length,
      period: { startDate, endDate },
    };
  }

  /**
   * Get spending trends over time
   */
  async getSpendingTrends(userId: string, query: AnalyticsQueryDto) {
    const { startDate, endDate } = this.getDateRange(query);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        type: 'EXPENSE',
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'asc' },
    });

    // Group by day/week/month based on date range
    const groupedData = this.groupTransactionsByPeriod(transactions, startDate, endDate);

    return {
      trends: groupedData,
      period: { startDate, endDate },
    };
  }

  /**
   * Get category breakdown
   */
  async getCategoryBreakdown(userId: string, query: AnalyticsQueryDto) {
    const { startDate, endDate } = this.getDateRange(query);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        type: 'EXPENSE',
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const categoryMap = new Map<string, Decimal>();

    for (const transaction of transactions) {
      const category = transaction.category || 'Uncategorized';
      const current = categoryMap.get(category) || new Decimal(0);
      categoryMap.set(category, current.plus(transaction.amount));
    }

    const breakdown = Array.from(categoryMap.entries())
      .map(([category, amount]) => ({
        category,
        amount: amount.toNumber(),
      }))
      .sort((a, b) => b.amount - a.amount);

    const total = breakdown.reduce((sum, item) => sum + item.amount, 0);

    return {
      breakdown: breakdown.map((item) => ({
        ...item,
        percentage: (item.amount / total) * 100,
      })),
      total,
      period: { startDate, endDate },
    };
  }

  /**
   * Get income vs expenses
   */
  async getIncomeVsExpenses(userId: string, query: AnalyticsQueryDto) {
    const { startDate, endDate } = this.getDateRange(query);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const monthlyData = new Map<string, { income: Decimal; expenses: Decimal }>();

    for (const transaction of transactions) {
      const monthKey = `${transaction.date.getFullYear()}-${String(transaction.date.getMonth() + 1).padStart(2, '0')}`;
      const current = monthlyData.get(monthKey) || {
        income: new Decimal(0),
        expenses: new Decimal(0),
      };

      if (transaction.type === 'INCOME') {
        current.income = current.income.plus(transaction.amount);
      } else {
        current.expenses = current.expenses.plus(transaction.amount);
      }

      monthlyData.set(monthKey, current);
    }

    const comparison = Array.from(monthlyData.entries())
      .map(([month, data]) => ({
        month,
        income: data.income.toNumber(),
        expenses: data.expenses.toNumber(),
        netSavings: data.income.minus(data.expenses).toNumber(),
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return {
      comparison,
      period: { startDate, endDate },
    };
  }

  /**
   * Get monthly comparison
   */
  async getMonthlyComparison(userId: string, query: AnalyticsQueryDto) {
    const currentMonth = new Date();
    const previousMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);

    const currentData = await this.getOverview(userId, {
      startDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1),
      endDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0),
    });

    const previousData = await this.getOverview(userId, {
      startDate: previousMonth,
      endDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0),
    });

    return {
      current: currentData,
      previous: previousData,
      changes: {
        income:
          ((currentData.totalIncome - previousData.totalIncome) / previousData.totalIncome) * 100,
        expenses:
          ((currentData.totalExpenses - previousData.totalExpenses) / previousData.totalExpenses) *
          100,
        savings:
          ((currentData.netSavings - previousData.netSavings) / Math.abs(previousData.netSavings)) *
          100,
      },
    };
  }

  /**
   * Get date range from query or default to current month
   */
  private getDateRange(query: AnalyticsQueryDto): { startDate: Date; endDate: Date } {
    if (query.startDate && query.endDate) {
      return { startDate: query.startDate, endDate: query.endDate };
    }

    const now = new Date();
    return {
      startDate: new Date(now.getFullYear(), now.getMonth(), 1),
      endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0),
    };
  }

  /**
   * Group transactions by period
   */
  private groupTransactionsByPeriod(transactions: any[], startDate: Date, endDate: Date) {
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const groupBy = daysDiff <= 31 ? 'day' : daysDiff <= 90 ? 'week' : 'month';

    const grouped = new Map<string, Decimal>();

    for (const transaction of transactions) {
      let key: string;
      const date = transaction.date;

      if (groupBy === 'day') {
        key = date.toISOString().split('T')[0];
      } else if (groupBy === 'week') {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0] || '';
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }

      const current = grouped.get(key) || new Decimal(0);
      grouped.set(key, current.plus(transaction.amount));
    }

    return Array.from(grouped.entries())
      .map(([period, amount]) => ({
        period,
        amount: amount.toNumber(),
      }))
      .sort((a, b) => a.period.localeCompare(b.period));
  }
}
