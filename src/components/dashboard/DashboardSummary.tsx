"use client";

import { memo } from "react";
import { CreditCard, DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { formatCurrency } from "@/lib/formatters";
import type { DashboardSummary as DashboardSummaryType } from "@/types";

type DashboardSummaryProps = {
  summary?: DashboardSummaryType | undefined;
  isLoading?: boolean;
};

const DashboardSummaryComponent = ({
  summary,
  isLoading = false,
}: DashboardSummaryProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-36 animate-pulse rounded-xl bg-linear-to-br from-muted/50 to-muted shadow-md"
          />
        ))}
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  // Calculate mock trends (in a real app, get this from API comparing to previous period)
  const balanceTrend =
    summary.totalBalance > 0 ? { value: 12.5, isPositive: true } : undefined;
  const incomeTrend = { value: 8.2, isPositive: true };
  const expensesTrend = { value: 3.1, isPositive: false }; // Lower expenses is good
  const transactionsTrend = { value: 15.3, isPositive: true };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Balance"
        value={formatCurrency(summary.totalBalance)}
        description="Income minus expenses"
        icon={<DollarSign className="h-5 w-5 text-primary" />}
        {...(balanceTrend && { trend: balanceTrend })}
        index={0}
      />
      <StatsCard
        title="Total Income"
        value={formatCurrency(summary.totalIncome)}
        description="Total income for period"
        icon={<TrendingUp className="h-5 w-5 text-success" />}
        trend={incomeTrend}
        index={1}
      />
      <StatsCard
        title="Total Expenses"
        value={formatCurrency(summary.totalExpenses)}
        description="Total spending for period"
        icon={<TrendingDown className="h-5 w-5 text-destructive" />}
        trend={expensesTrend}
        index={2}
      />
      <StatsCard
        title="Transactions"
        value={summary.transactionCount.toLocaleString()}
        description="Number of transactions"
        icon={<CreditCard className="h-5 w-5 text-primary" />}
        trend={transactionsTrend}
        index={3}
      />
    </div>
  );
};

// Memoize to prevent re-renders when parent state changes
export const DashboardSummary = memo(
  DashboardSummaryComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.isLoading === nextProps.isLoading &&
      prevProps.summary?.totalBalance === nextProps.summary?.totalBalance &&
      prevProps.summary?.totalIncome === nextProps.summary?.totalIncome &&
      prevProps.summary?.totalExpenses === nextProps.summary?.totalExpenses &&
      prevProps.summary?.transactionCount ===
        nextProps.summary?.transactionCount
    );
  },
);

DashboardSummary.displayName = "DashboardSummary";
