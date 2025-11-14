"use client";

import { useMemo, useState } from "react";
import { DashboardDateFilter } from "@/components/dashboard/DashboardDateFilter";
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { SpendingLineChart } from "@/components/dashboard/SpendingLineChart";
import { SpendingPieChart } from "@/components/dashboard/SpendingPieChart";
import { BudgetProgress } from "@/components/dashboard/BudgetProgress";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/hooks/useDashboard";
import { useBudgets } from "@/hooks/useBudgets";
import { motion } from "framer-motion";

export function DashboardContent() {
  const [dateRange, setDateRange] = useState<{ startDate?: string; endDate?: string }>({});
  const { data, isLoading, isError, error, refresh } = useDashboard(dateRange);
  const { budgets, isLoading: budgetsLoading } = useBudgets();

  const selectedRange = useMemo(() => {
    if (!data?.period) {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
      return { startDate: start, endDate: end };
    }

    return {
      startDate: data.period.start.slice(0, 10),
      endDate: data.period.end.slice(0, 10),
    };
  }, [data]);

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center gap-4 rounded-lg border border-danger-200 dark:border-danger-800 bg-danger-50 dark:bg-danger-950/20 p-8 text-center"
      >
        <p className="text-sm text-danger-700 dark:text-danger-300">
          Failed to load dashboard data: {error?.message}
        </p>
        <Button onClick={() => refresh()} variant="outline" className="border-danger-300 hover:bg-danger-100">
          Try again
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Date Filter */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <DashboardDateFilter
          startDate={selectedRange.startDate}
          endDate={selectedRange.endDate}
          onChange={setDateRange}
        />
      </motion.div>

      {/* Summary Cards */}
      <DashboardSummary summary={data?.summary} isLoading={isLoading} />

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SpendingPieChart data={data?.spendingByCategory ?? []} isLoading={isLoading} />
        <SpendingLineChart data={data?.dailyTrend ?? []} isLoading={isLoading} />
      </div>

      {/* Budget and Transactions Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <BudgetProgress budgets={budgets ?? []} isLoading={budgetsLoading} />
        </div>
        <div className="lg:col-span-2">
          <RecentTransactions transactions={data?.recentTransactions ?? []} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

