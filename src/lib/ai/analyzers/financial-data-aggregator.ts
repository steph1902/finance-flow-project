// src/lib/ai/analyzers/financial-data-aggregator.ts
/**
 * Financial Data Aggregator
 * Analyzes 90-day transaction history to compute metrics for Big 4 Decision Intelligence
 */

import { prisma } from '@/lib/prisma';
import { type Transaction, type RecurringTransaction } from '@prisma/client';

export interface FinancialMetrics {
    // Time period
    periodStart: Date;
    periodEnd: Date;

    // Cashflow metrics
    netCashflow90d: number;
    cashflowTrendPercent: number;
    discretionaryVariability: number;
    burnRate: number;
    safetyMargin: number;

    // Risk metrics
    cashBuffer: number;
    bufferMultiple: number;
    monthlyIncome: number;
    incomeStability: 'stable' | 'variable' | 'volatile';

    // Spending breakdown
    totalExpenses90d: number;
    discretionarySpending: number;
    fixedExpenses: number;

    // Monthly breakdowns
    monthlyData: MonthlyBreakdown[];
}

interface MonthlyBreakdown {
    month: number;
    year: number;
    income: number;
    expenses: number;
    netCashflow: number;
    discretionary: number;
    fixed: number;
}

// Categories considered "discretionary" 
const DISCRETIONARY_CATEGORIES = [
    'Dining',
    'Entertainment',
    'Shopping',
    'Travel',
    'Hobbies',
    'Subscriptions'
];

export class FinancialDataAggregator {

    /**
     * Aggregate financial data for a user over the last 90 days
     */
    async aggregateData(userId: string): Promise<FinancialMetrics> {
        const periodEnd = new Date();
        const periodStart = new Date();
        periodStart.setDate(periodStart.getDate() - 90);

        // Fetch all transactions in the period
        const transactions = await prisma.transaction.findMany({
            where: {
                userId,
                date: {
                    gte: periodStart,
                    lte: periodEnd
                },
                deletedAt: null
            },
            orderBy: { date: 'asc' }
        });

        // Fetch active recurring transactions
        const recurring = await prisma.recurringTransaction.findMany({
            where: {
                userId,
                isActive: true
            }
        });

        // Group transactions by month
        const monthlyData = this.groupByMonth(transactions, periodStart, periodEnd);

        // Calculate cashflow metrics
        const netCashflow90d = this.calculateNetCashflow(monthlyData);
        const cashflowTrendPercent = this.calculateCashflowTrend(monthlyData);
        const discretionaryVariability = this.calculateDiscretionaryVariability(monthlyData);

        // Calculate burn rate and safety margin
        const totalExpenses90d = monthlyData.reduce((sum, m) => sum + m.expenses, 0);
        const monthlyExpenseAvg = totalExpenses90d / 3;
        const burnRate = monthlyExpenseAvg;

        // Calculate income metrics
        const monthlyIncome = this.calculateMonthlyIncome(monthlyData);
        const incomeStability = this.determineIncomeStability(monthlyData);

        // Calculate cash buffer (current balance)
        const currentBalance = transactions.reduce((sum, t) => {
            return sum + (t.type === 'INCOME' ? Number(t.amount) : -Number(t.amount));
        }, 0);

        const cashBuffer = Math.max(0, currentBalance);
        const bufferMultiple = monthlyExpenseAvg > 0 ? cashBuffer / monthlyExpenseAvg : 0;
        const safetyMargin = (bufferMultiple / 3) * 100; // % of 3x target

        // Calculate spending breakdown
        const discretionarySpending = this.calculateDiscretionarySpending(transactions);
        const fixedExpenses = totalExpenses90d - discretionarySpending;

        return {
            periodStart,
            periodEnd,
            netCashflow90d,
            cashflowTrendPercent,
            discretionaryVariability,
            burnRate,
            safetyMargin,
            cashBuffer,
            bufferMultiple,
            monthlyIncome,
            incomeStability,
            totalExpenses90d,
            discretionarySpending,
            fixedExpenses,
            monthlyData
        };
    }

    /**
     * Save financial snapshot to database for caching
     */
    async saveSnapshot(userId: string, metrics: FinancialMetrics): Promise<void> {
        await prisma.financialSnapshot.create({
            data: {
                userId,
                periodStart: metrics.periodStart,
                periodEnd: metrics.periodEnd,
                netCashflow90d: metrics.netCashflow90d,
                cashflowTrendPercent: metrics.cashflowTrendPercent,
                discretionaryVariability: metrics.discretionaryVariability,
                burnRate: metrics.burnRate,
                safetyMargin: metrics.safetyMargin,
                cashBuffer: metrics.cashBuffer,
                bufferMultiple: metrics.bufferMultiple,
                monthlyIncome: metrics.monthlyIncome,
                incomeStability: metrics.incomeStability,
                totalExpenses90d: metrics.totalExpenses90d,
                discretionarySpending: metrics.discretionarySpending,
                fixedExpenses: metrics.fixedExpenses
            }
        });
    }

    /**
     * Get cached snapshot or generate new one
     */
    async getOrCreateSnapshot(userId: string): Promise<FinancialMetrics> {
        // Check for recent snapshot (within 24 hours)
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);

        const cached = await prisma.financialSnapshot.findFirst({
            where: {
                userId,
                periodEnd: { gte: oneDayAgo }
            },
            orderBy: { periodEnd: 'desc' }
        });

        if (cached) {
            // Reconstruct metrics from cached data
            return {
                periodStart: cached.periodStart,
                periodEnd: cached.periodEnd,
                netCashflow90d: Number(cached.netCashflow90d),
                cashflowTrendPercent: Number(cached.cashflowTrendPercent),
                discretionaryVariability: Number(cached.discretionaryVariability),
                burnRate: Number(cached.burnRate),
                safetyMargin: Number(cached.safetyMargin),
                cashBuffer: Number(cached.cashBuffer),
                bufferMultiple: Number(cached.bufferMultiple),
                monthlyIncome: Number(cached.monthlyIncome),
                incomeStability: cached.incomeStability as 'stable' | 'variable' | 'volatile',
                totalExpenses90d: Number(cached.totalExpenses90d),
                discretionarySpending: Number(cached.discretionarySpending),
                fixedExpenses: Number(cached.fixedExpenses),
                monthlyData: [] // Not cached, would need separate query
            };
        }

        // Generate new snapshot
        const metrics = await this.aggregateData(userId);
        await this.saveSnapshot(userId, metrics);
        return metrics;
    }

    // ========== PRIVATE HELPER METHODS ==========

    private groupByMonth(transactions: Transaction[], start: Date, end: Date): MonthlyBreakdown[] {
        const months: Map<string, MonthlyBreakdown> = new Map();

        // Initialize 3 months
        for (let i = 0; i < 3; i++) {
            const date = new Date(end);
            date.setMonth(date.getMonth() - i);
            const key = `${date.getFullYear()}-${date.getMonth() + 1}`;

            months.set(key, {
                month: date.getMonth() + 1,
                year: date.getFullYear(),
                income: 0,
                expenses: 0,
                netCashflow: 0,
                discretionary: 0,
                fixed: 0
            });
        }

        // Aggregate transactions
        for (const tx of transactions) {
            const key = `${tx.date.getFullYear()}-${tx.date.getMonth() + 1}`;
            const month = months.get(key);

            if (!month) continue;

            const amount = Number(tx.amount);

            if (tx.type === 'INCOME') {
                month.income += amount;
            } else {
                month.expenses += amount;

                if (DISCRETIONARY_CATEGORIES.includes(tx.category)) {
                    month.discretionary += amount;
                } else {
                    month.fixed += amount;
                }
            }
        }

        // Calculate net cashflow
        months.forEach(month => {
            month.netCashflow = month.income - month.expenses;
        });

        return Array.from(months.values()).reverse(); // Oldest to newest
    }

    private calculateNetCashflow(monthlyData: MonthlyBreakdown[]): number {
        return monthlyData.reduce((sum, m) => sum + m.netCashflow, 0) / monthlyData.length;
    }

    private calculateCashflowTrend(monthlyData: MonthlyBreakdown[]): number {
        if (monthlyData.length < 2) return 0;

        const latest = monthlyData[monthlyData.length - 1].netCashflow;
        const previous = monthlyData[monthlyData.length - 2].netCashflow;

        if (previous === 0) return 0;

        return ((latest - previous) / Math.abs(previous)) * 100;
    }

    private calculateDiscretionaryVariability(monthlyData: MonthlyBreakdown[]): number {
        if (monthlyData.length < 2) return 0;

        const discretionaryAmounts = monthlyData.map(m => m.discretionary);
        const avg = discretionaryAmounts.reduce((a, b) => a + b, 0) / discretionaryAmounts.length;

        if (avg === 0) return 0;

        // Calculate standard deviation as % of mean
        const variance = discretionaryAmounts.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / discretionaryAmounts.length;
        const stdDev = Math.sqrt(variance);

        return (stdDev / avg) * 100;
    }

    private calculateMonthlyIncome(monthlyData: MonthlyBreakdown[]): number {
        const totalIncome = monthlyData.reduce((sum, m) => sum + m.income, 0);
        return totalIncome / monthlyData.length;
    }

    private determineIncomeStability(monthlyData: MonthlyBreakdown[]): 'stable' | 'variable' | 'volatile' {
        if (monthlyData.length < 2) return 'stable';

        const incomes = monthlyData.map(m => m.income);
        const avg = incomes.reduce((a, b) => a + b, 0) / incomes.length;

        if (avg === 0) return 'volatile';

        const variance = incomes.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / incomes.length;
        const cvPercent = (Math.sqrt(variance) / avg) * 100;

        if (cvPercent < 10) return 'stable';
        if (cvPercent < 30) return 'variable';
        return 'volatile';
    }

    private calculateDiscretionarySpending(transactions: Transaction[]): number {
        return transactions
            .filter(t => t.type === 'EXPENSE' && DISCRETIONARY_CATEGORIES.includes(t.category))
            .reduce((sum, t) => sum + Number(t.amount), 0);
    }
}

// Export singleton instance
export const financialDataAggregator = new FinancialDataAggregator();
