/**
 * Reporting Engine
 *
 * Generates comprehensive financial reports:
 * - Monthly summaries
 * - Yearly summaries
 * - Category deep-dives
 * - Tax preparation helpers
 * - Custom date range reports
 */

import { prisma } from "@/lib/prisma";
import { logInfo, logError } from "@/lib/logger";
import { Decimal } from "@prisma/client/runtime/library";
import { Prisma, Transaction } from "@prisma/client";

export type ReportType = "MONTHLY" | "YEARLY" | "CATEGORY" | "TAX" | "CUSTOM";
export type ReportFormat = "JSON" | "CSV" | "PDF";

export interface GenerateReportInput {
  userId: string;
  type: ReportType;
  startDate: Date;
  endDate: Date;
  filters?: {
    categories?: string[];
    types?: ("INCOME" | "EXPENSE")[];
    minAmount?: number;
    maxAmount?: number;
  };
  format?: ReportFormat;
}

export interface ReportSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  transactionCount: number;
  averageTransaction: number;
  topCategories: {
    category: string;
    total: number;
    percentage: number;
    transactionCount: number;
  }[];
  dailyAverage: number;
  monthlyProjection?: number;
}

export interface CategoryBreakdown {
  category: string;
  type: "INCOME" | "EXPENSE";
  total: number;
  count: number;
  average: number;
  min: number;
  max: number;
  percentage: number;
}

/**
 * Generate financial report
 */
export async function generateReport(input: GenerateReportInput) {
  try {
    const { userId, type, startDate, endDate, filters } = input;

    logInfo("Generating report", { userId, type, startDate, endDate });

    // Fetch transactions
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        deletedAt: null,
        date: {
          gte: startDate,
          lte: endDate,
        },
        ...(filters?.categories &&
          filters.categories.length > 0 && {
            category: { in: filters.categories },
          }),
        ...(filters?.types &&
          filters.types.length > 0 && {
            type: { in: filters.types },
          }),
        ...(filters?.minAmount && {
          amount: { gte: new Decimal(filters.minAmount) },
        }),
        ...(filters?.maxAmount && {
          amount: { lte: new Decimal(filters.maxAmount) },
        }),
      },
      orderBy: { date: "desc" },
    });

    // Calculate summary
    const summary = calculateSummary(transactions, startDate, endDate);

    // Calculate category breakdown
    const categoryBreakdown = calculateCategoryBreakdown(transactions);

    // Build report data
    const reportData = {
      summary,
      categoryBreakdown,
      transactions: transactions.map((tx) => ({
        id: tx.id,
        date: tx.date,
        amount: Number(tx.amount),
        type: tx.type,
        category: tx.category,
        description: tx.description,
      })),
      period: {
        startDate,
        endDate,
        days: Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
        ),
      },
    };

    // Save report to database
    const report = await prisma.report.create({
      data: {
        userId,
        type,
        format: input.format || "JSON",
        name: generateReportName(type, startDate, endDate),
        description: `Financial report from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`,
        startDate,
        endDate,
        filters: filters || {},
        data: reportData as unknown as Prisma.InputJsonValue,
      },
    });

    logInfo("Report generated successfully", { reportId: report.id, userId });

    return report;
  } catch (error) {
    logError("Report generation failed", error);
    throw new Error("Failed to generate report");
  }
}

/**
 * Calculate summary statistics
 */
function calculateSummary(
  transactions: Transaction[],
  startDate: Date,
  endDate: Date,
): ReportSummary {
  const income = transactions
    .filter((tx) => tx.type === "INCOME")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const expense = transactions
    .filter((tx) => tx.type === "EXPENSE")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const netBalance = income - expense;
  const transactionCount = transactions.length;
  const averageTransaction =
    transactionCount > 0 ? (income + expense) / transactionCount : 0;

  // Calculate daily average
  const days = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  const dailyAverage = days > 0 ? expense / days : 0;

  // Monthly projection
  const monthlyProjection = dailyAverage * 30;

  // Top categories
  const categoryTotals = new Map<string, number>();
  const categoryCounts = new Map<string, number>();

  for (const tx of transactions.filter((tx) => tx.type === "EXPENSE")) {
    const current = categoryTotals.get(tx.category) || 0;
    const count = categoryCounts.get(tx.category) || 0;
    categoryTotals.set(tx.category, current + Number(tx.amount));
    categoryCounts.set(tx.category, count + 1);
  }

  const topCategories = Array.from(categoryTotals.entries())
    .map(([category, total]) => ({
      category,
      total,
      percentage: (total / expense) * 100,
      transactionCount: categoryCounts.get(category) || 0,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  return {
    totalIncome: income,
    totalExpense: expense,
    netBalance,
    transactionCount,
    averageTransaction,
    topCategories,
    dailyAverage,
    monthlyProjection,
  };
}

/**
 * Calculate category breakdown
 */
function calculateCategoryBreakdown(
  transactions: Transaction[],
): CategoryBreakdown[] {
  const categoryData = new Map<
    string,
    {
      type: "INCOME" | "EXPENSE";
      amounts: number[];
    }
  >();

  for (const tx of transactions) {
    if (!categoryData.has(tx.category)) {
      categoryData.set(tx.category, {
        type: tx.type,
        amounts: [],
      });
    }
    categoryData.get(tx.category)!.amounts.push(Number(tx.amount));
  }

  const total = transactions.reduce((sum, tx) => sum + Number(tx.amount), 0);

  return Array.from(categoryData.entries())
    .map(([category, data]) => {
      const categoryTotal = data.amounts.reduce((sum, amt) => sum + amt, 0);
      return {
        category,
        type: data.type,
        total: categoryTotal,
        count: data.amounts.length,
        average: categoryTotal / data.amounts.length,
        min: Math.min(...data.amounts),
        max: Math.max(...data.amounts),
        percentage: (categoryTotal / total) * 100,
      };
    })
    .sort((a, b) => b.total - a.total);
}

/**
 * Generate report name
 */
function generateReportName(
  type: ReportType,
  startDate: Date,
  endDate: Date,
): string {
  const start = startDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
  const end = endDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  switch (type) {
    case "MONTHLY":
      return `Monthly Report - ${start}`;
    case "YEARLY":
      return `Yearly Report - ${startDate.getFullYear()}`;
    case "CATEGORY":
      return `Category Analysis - ${start} to ${end}`;
    case "TAX":
      return `Tax Report - ${startDate.getFullYear()}`;
    case "CUSTOM":
      return `Custom Report - ${start} to ${end}`;
    default:
      return `Financial Report - ${start} to ${end}`;
  }
}

/**
 * Get user reports
 */
export async function getUserReports(userId: string, limit = 20) {
  try {
    const reports = await prisma.report.findMany({
      where: { userId },
      orderBy: { generatedAt: "desc" },
      take: limit,
      select: {
        id: true,
        type: true,
        format: true,
        name: true,
        description: true,
        startDate: true,
        endDate: true,
        generatedAt: true,
        fileUrl: true,
      },
    });

    return reports;
  } catch (error) {
    logError("Failed to get user reports", error);
    throw new Error("Failed to get reports");
  }
}

/**
 * Get report by ID
 */
export async function getReportById(reportId: string, userId: string) {
  try {
    const report = await prisma.report.findFirst({
      where: { id: reportId, userId },
    });

    if (!report) {
      throw new Error("Report not found");
    }

    return report;
  } catch (error) {
    logError("Failed to get report", error);
    throw new Error("Failed to get report");
  }
}

/**
 * Delete report
 */
export async function deleteReport(reportId: string, userId: string) {
  try {
    const result = await prisma.report.deleteMany({
      where: { id: reportId, userId },
    });

    if (result.count === 0) {
      throw new Error("Report not found");
    }

    logInfo("Report deleted", { reportId, userId });
    return { success: true };
  } catch (error) {
    logError("Failed to delete report", error);
    throw new Error("Failed to delete report");
  }
}

/**
 * Generate tax report helper
 */
export async function generateTaxReport(userId: string, year: number) {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31, 23, 59, 59);

  return await generateReport({
    userId,
    type: "TAX",
    startDate,
    endDate,
    format: "JSON",
  });
}
