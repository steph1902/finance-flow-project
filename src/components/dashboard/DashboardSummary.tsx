"use client";

import { CreditCard, DollarSign, TrendingDown, TrendingUp } from "lucide-react";

import { StatsCard } from "@/components/dashboard/StatsCard";
import type { DashboardSummary as DashboardSummaryType } from "@/types";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

type DashboardSummaryProps = {
  summary?: DashboardSummaryType;
  isLoading?: boolean;
};

export function DashboardSummary({ summary, isLoading = false }: DashboardSummaryProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total balance"
        value={currencyFormatter.format(summary.totalBalance)}
        description="Income minus expenses"
        icon={<DollarSign className="h-5 w-5 text-muted-foreground" />}
      />
      <StatsCard
        title="Income"
        value={currencyFormatter.format(summary.totalIncome)}
        description="Total income for selected period"
        icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
      />
      <StatsCard
        title="Expenses"
        value={currencyFormatter.format(summary.totalExpenses)}
        description="Total spending for selected period"
        icon={<TrendingDown className="h-5 w-5 text-rose-500" />}
      />
      <StatsCard
        title="Transactions"
        value={summary.transactionCount.toLocaleString()}
        description="Number of transactions"
        icon={<CreditCard className="h-5 w-5 text-muted-foreground" />}
      />
    </div>
  );
}

