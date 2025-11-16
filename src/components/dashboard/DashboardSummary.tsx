"use client";

import { CreditCard, DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { formatCurrency } from "@/lib/formatters";
import type { DashboardSummary as DashboardSummaryType } from "@/types";

type DashboardSummaryProps = {
  summary?: DashboardSummaryType;
  isLoading?: boolean;
};

export function DashboardSummary({ summary, isLoading = false }: DashboardSummaryProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div 
            key={index} 
            className="h-36 animate-pulse rounded-xl bg-linear-to-br from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 shadow-lg" 
          />
        ))}
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  // Calculate mock trends (in a real app, get this from API comparing to previous period)
  const balanceTrend = summary.totalBalance > 0 ? { value: 12.5, isPositive: true } : undefined;
  const incomeTrend = { value: 8.2, isPositive: true };
  const expensesTrend = { value: 3.1, isPositive: false }; // Lower expenses is good
  const transactionsTrend = { value: 15.3, isPositive: true };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Balance"
        value={formatCurrency(summary.totalBalance)}
        description="Income minus expenses"
        icon={<DollarSign className="h-5 w-5 text-primary-600 dark:text-primary-400" />}
        trend={balanceTrend}
        index={0}
      />
      <StatsCard
        title="Total Income"
        value={formatCurrency(summary.totalIncome)}
        description="Total income for period"
        icon={<TrendingUp className="h-5 w-5 text-success-600 dark:text-success-400" />}
        trend={incomeTrend}
        index={1}
      />
      <StatsCard
        title="Total Expenses"
        value={formatCurrency(summary.totalExpenses)}
        description="Total spending for period"
        icon={<TrendingDown className="h-5 w-5 text-danger-600 dark:text-danger-400" />}
        trend={expensesTrend}
        index={2}
      />
      <StatsCard
        title="Transactions"
        value={summary.transactionCount.toLocaleString()}
        description="Number of transactions"
        icon={<CreditCard className="h-5 w-5 text-primary-600 dark:text-primary-400" />}
        trend={transactionsTrend}
        index={3}
      />
    </div>
  );
}

