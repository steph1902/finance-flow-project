/**
 * Investment Tracking Service
 * Handles portfolio management, performance tracking, and analytics
 */

import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { InvestmentType, InvestmentTransactionType } from "@prisma/client";

export interface InvestmentWithPerformance {
  id: string;
  symbol: string;
  name: string;
  type: InvestmentType;
  quantity: number;
  costBasis: number;
  currentValue: number;
  currency: string;
  purchaseDate: Date;
  gainLoss: number;
  gainLossPercentage: number;
  lastUpdated: Date;
}

export interface PortfolioSummary {
  totalValue: number;
  totalCostBasis: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
  investmentCount: number;
  byType: Record<
    InvestmentType,
    {
      count: number;
      value: number;
      costBasis: number;
      gainLoss: number;
    }
  >;
}

/**
 * Create a new investment
 */
export async function createInvestment(
  userId: string,
  data: {
    symbol: string;
    name: string;
    type: InvestmentType;
    quantity: number;
    costBasis: number;
    currentValue?: number;
    currency?: string;
    purchaseDate: Date;
    notes?: string;
  },
) {
  try {
    const investment = await prisma.investment.create({
      data: {
        userId,
        symbol: data.symbol,
        name: data.name,
        type: data.type,
        quantity: data.quantity,
        costBasis: data.costBasis,
        currentValue: data.currentValue ?? data.costBasis,
        currency: data.currency ?? "USD",
        purchaseDate: data.purchaseDate,
        ...(data.notes && { notes: data.notes }),
      },
    });

    // Create initial purchase transaction
    await prisma.investmentTransaction.create({
      data: {
        investmentId: investment.id,
        type: "BUY",
        quantity: data.quantity,
        price: data.costBasis / data.quantity,
        totalAmount: data.costBasis,
        date: data.purchaseDate,
      },
    });

    logger.info("Investment created", { userId, investmentId: investment.id });
    return investment;
  } catch (error: unknown) {
    logger.error("Failed to create investment", error);
    throw new Error("Failed to create investment");
  }
}

/**
 * Update investment current value
 */
export async function updateInvestmentValue(
  investmentId: string,
  currentValue: number,
) {
  try {
    const investment = await prisma.investment.update({
      where: { id: investmentId },
      data: {
        currentValue,
        lastUpdated: new Date(),
      },
    });

    logger.info("Investment value updated", { investmentId, currentValue });
    return investment;
  } catch (error: unknown) {
    logger.error("Failed to update investment value", error);
    throw new Error("Failed to update investment value");
  }
}

/**
 * Record investment transaction (buy, sell, dividend, etc.)
 */
export async function recordInvestmentTransaction(
  investmentId: string,
  data: {
    type: InvestmentTransactionType;
    quantity: number;
    price: number;
    fees?: number;
    date: Date;
    notes?: string;
  },
) {
  try {
    const investment = await prisma.investment.findUnique({
      where: { id: investmentId },
    });

    if (!investment) {
      throw new Error("Investment not found");
    }

    const totalAmount = data.quantity * data.price;
    const fees = data.fees || 0;

    // Create transaction
    const transaction = await prisma.investmentTransaction.create({
      data: {
        investmentId,
        type: data.type,
        quantity: data.quantity,
        price: data.price,
        totalAmount,
        fees,
        date: data.date,
        notes: data.notes ?? null,
      },
    });

    // Update investment based on transaction type
    let newQuantity = Number(investment.quantity);
    let newCostBasis = Number(investment.costBasis);

    if (data.type === "BUY") {
      newQuantity += data.quantity;
      newCostBasis += totalAmount + fees;
    } else if (data.type === "SELL") {
      newQuantity -= data.quantity;
      // Proportional cost basis reduction
      const costBasisPerShare = newCostBasis / Number(investment.quantity);
      newCostBasis -= costBasisPerShare * data.quantity;
    }

    await prisma.investment.update({
      where: { id: investmentId },
      data: {
        quantity: newQuantity,
        costBasis: newCostBasis,
        lastUpdated: new Date(),
      },
    });

    logger.info("Investment transaction recorded", {
      investmentId,
      type: data.type,
      amount: totalAmount,
    });

    return transaction;
  } catch (error: unknown) {
    logger.error("Failed to record investment transaction", error);
    throw new Error("Failed to record transaction");
  }
}

/**
 * Get user's investments with performance metrics
 */
export async function getUserInvestments(
  userId: string,
): Promise<InvestmentWithPerformance[]> {
  try {
    const investments = await prisma.investment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return investments.map((inv) => {
      const quantity = Number(inv.quantity);
      const costBasis = Number(inv.costBasis);
      const currentValue = Number(inv.currentValue);
      const gainLoss = currentValue - costBasis;
      const gainLossPercentage =
        costBasis > 0 ? (gainLoss / costBasis) * 100 : 0;

      return {
        id: inv.id,
        symbol: inv.symbol,
        name: inv.name,
        type: inv.type,
        quantity,
        costBasis,
        currentValue,
        currency: inv.currency,
        purchaseDate: inv.purchaseDate,
        gainLoss,
        gainLossPercentage,
        lastUpdated: inv.lastUpdated,
      };
    });
  } catch (error: unknown) {
    logger.error("Failed to get user investments", error);
    throw new Error("Failed to fetch investments");
  }
}

/**
 * Get portfolio summary with analytics
 */
export async function getPortfolioSummary(
  userId: string,
): Promise<PortfolioSummary> {
  try {
    const investments = await getUserInvestments(userId);

    const summary: PortfolioSummary = {
      totalValue: 0,
      totalCostBasis: 0,
      totalGainLoss: 0,
      totalGainLossPercentage: 0,
      investmentCount: investments.length,
      byType: {} as Record<
        InvestmentType,
        {
          count: number;
          value: number;
          costBasis: number;
          gainLoss: number;
        }
      >,
    };

    // Initialize byType for all investment types
    const types: InvestmentType[] = [
      "STOCK",
      "BOND",
      "MUTUAL_FUND",
      "ETF",
      "CRYPTO",
      "REAL_ESTATE",
      "COMMODITY",
      "OTHER",
    ];
    types.forEach((type) => {
      summary.byType[type] = {
        count: 0,
        value: 0,
        costBasis: 0,
        gainLoss: 0,
      };
    });

    // Calculate totals
    investments.forEach((inv) => {
      summary.totalValue += inv.currentValue;
      summary.totalCostBasis += inv.costBasis;
      summary.totalGainLoss += inv.gainLoss;

      const typeData = summary.byType[inv.type];
      typeData.count++;
      typeData.value += inv.currentValue;
      typeData.costBasis += inv.costBasis;
      typeData.gainLoss += inv.gainLoss;
    });

    summary.totalGainLossPercentage =
      summary.totalCostBasis > 0
        ? (summary.totalGainLoss / summary.totalCostBasis) * 100
        : 0;

    return summary;
  } catch (error: unknown) {
    logger.error("Failed to get portfolio summary", error);
    throw new Error("Failed to calculate portfolio summary");
  }
}

/**
 * Get investment transactions
 */
export async function getInvestmentTransactions(investmentId: string) {
  try {
    return await prisma.investmentTransaction.findMany({
      where: { investmentId },
      orderBy: { date: "desc" },
    });
  } catch (error: unknown) {
    logger.error("Failed to get investment transactions", error);
    throw new Error("Failed to fetch transactions");
  }
}

/**
 * Delete an investment
 */
export async function deleteInvestment(userId: string, investmentId: string) {
  try {
    const investment = await prisma.investment.findFirst({
      where: {
        id: investmentId,
        userId,
      },
    });

    if (!investment) {
      throw new Error("Investment not found");
    }

    // Transactions will be cascade deleted
    await prisma.investment.delete({
      where: { id: investmentId },
    });

    logger.info("Investment deleted", { userId, investmentId });
  } catch (error: unknown) {
    logger.error("Failed to delete investment", error);
    throw new Error("Failed to delete investment");
  }
}

/**
 * Calculate portfolio performance over time
 */
export async function getPortfolioPerformance(
  userId: string,
  days: number = 30,
) {
  try {
    const investments = await getUserInvestments(userId);

    // For now, return current snapshot
    // In a real app, you'd track historical values
    const dataPoints = [];
    const endDate = new Date();

    for (let i = days; i >= 0; i--) {
      const date = new Date(endDate);
      date.setDate(date.getDate() - i);

      // Simplified: use current values (in production, fetch historical data)
      const totalValue = investments.reduce(
        (sum, inv) => sum + inv.currentValue,
        0,
      );

      dataPoints.push({
        date: date.toISOString().split("T")[0],
        value: totalValue,
      });
    }

    return dataPoints;
  } catch (error: unknown) {
    logger.error("Failed to get portfolio performance", error);
    throw new Error("Failed to calculate performance");
  }
}
