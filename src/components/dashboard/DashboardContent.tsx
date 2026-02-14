"use client";

import { useMemo, useState, useEffect } from "react";

import { DashboardDateFilter } from "@/components/dashboard/DashboardDateFilter";
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { SpendingLineChart } from "@/components/dashboard/SpendingLineChart";
import { SpendingPieChart } from "@/components/dashboard/SpendingPieChart";
import { SpendingForecast } from "@/components/dashboard/SpendingForecast";
import { AIInsights } from "@/components/ai/AIInsights";
import { UpcomingRecurringWidget } from "@/components/recurring/UpcomingRecurringWidget";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import { Button } from "@/components/ui/button";
import { LiveRegion } from "@/components/ui/live-region";
import { useDashboard } from "@/hooks/useDashboard";

export function DashboardContent() {
  const [dateRange, setDateRange] = useState<{
    startDate?: string;
    endDate?: string;
  }>({});
  const { data, isLoading, isError, error, refresh } = useDashboard(dateRange);
  const [liveMessage, setLiveMessage] = useState("");

  useEffect(() => {
    if (isLoading) {
      setLiveMessage("Loading dashboard data");
    } else if (data) {
      setLiveMessage("Dashboard data loaded successfully");
    }
  }, [isLoading, data]);

  const selectedRange = useMemo(() => {
    if (!data?.period) {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .slice(0, 10);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        .toISOString()
        .slice(0, 10);
      return { startDate: start, endDate: end };
    }

    return {
      startDate: data.period.start.slice(0, 10),
      endDate: data.period.end.slice(0, 10),
    };
  }, [data]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return (
      <>
        <div
          className="flex flex-col items-center justify-center gap-4 rounded-lg border bg-card p-8 text-center"
          role="alert"
          aria-live="assertive"
        >
          <p className="text-sm text-muted-foreground">
            Failed to load dashboard data: {error?.message}
          </p>
          <Button onClick={() => refresh()}>Try again</Button>
        </div>
        <LiveRegion
          message={`Error loading dashboard: ${error?.message}`}
          politeness="assertive"
        />
      </>
    );
  }

  return (
    <div className="space-y-6">
      {/* Live region for dynamic updates */}
      <LiveRegion message={liveMessage} politeness="polite" clearAfter={3000} />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif text-foreground">Overview</h2>
          <p className="text-muted-foreground">
            Your financial health at a glance.
          </p>
        </div>
        <DashboardDateFilter
          startDate={selectedRange.startDate}
          endDate={selectedRange.endDate}
          onChange={setDateRange}
        />
      </div>

      <div className="space-y-6">
        {/* Top Stats Row */}
        <DashboardSummary summary={data?.summary} isLoading={isLoading} />

        {/* Main Grid: 2/3 + 1/3 Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (Wide) - Spans 2 cols */}
          <div className="lg:col-span-2 space-y-6">
            <SpendingLineChart
              data={data?.dailyTrend ?? []}
              isLoading={isLoading}
            />
            <RecentTransactions
              transactions={data?.recentTransactions ?? []}
              isLoading={isLoading}
            />
          </div>

          {/* Right Column (Narrow) - Spans 1 col */}
          <div className="space-y-6">
            <AIInsights />
            <SpendingPieChart
              data={data?.spendingByCategory ?? []}
              isLoading={isLoading}
            />
            <SpendingForecast />
            <UpcomingRecurringWidget />
          </div>
        </div>
      </div>
    </div>
  );
}
