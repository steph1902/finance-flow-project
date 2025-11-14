"use client";

import { useMemo, useState } from "react";

import { DashboardDateFilter } from "@/components/dashboard/DashboardDateFilter";
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { SpendingLineChart } from "@/components/dashboard/SpendingLineChart";
import { SpendingPieChart } from "@/components/dashboard/SpendingPieChart";
import { AIInsights } from "@/components/ai/AIInsights";
import { UpcomingRecurringWidget } from "@/components/recurring/UpcomingRecurringWidget";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/hooks/useDashboard";

export function DashboardContent() {
  const [dateRange, setDateRange] = useState<{ startDate?: string; endDate?: string }>({});
  const { data, isLoading, isError, error, refresh } = useDashboard(dateRange);

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
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">Failed to load dashboard data: {error?.message}</p>
        <Button onClick={() => refresh()}>Try again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardDateFilter
        startDate={selectedRange.startDate}
        endDate={selectedRange.endDate}
        onChange={setDateRange}
      />

      <DashboardSummary summary={data?.summary} isLoading={isLoading} />

      <AIInsights />

      <UpcomingRecurringWidget />

      <div className="grid gap-6 lg:grid-cols-2">
        <SpendingPieChart data={data?.spendingByCategory ?? []} isLoading={isLoading} />
        <SpendingLineChart data={data?.dailyTrend ?? []} isLoading={isLoading} />
      </div>

      <RecentTransactions transactions={data?.recentTransactions ?? []} isLoading={isLoading} />
    </div>
  );
}

