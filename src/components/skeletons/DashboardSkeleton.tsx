"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Date Filter Skeleton */}
      <div className="flex gap-3">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border border-border/50 bg-card p-6 shadow-card">
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* AI Insights Skeleton */}
      <div className="rounded-xl border border-border/50 bg-linear-to-br from-primary/5 via-primary/10 to-primary/5 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>

      {/* Charts Skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="rounded-xl border border-border/50 bg-card p-6 shadow-card">
            <Skeleton className="h-6 w-40 mb-6" />
            <Skeleton className="h-64 w-full" />
          </div>
        ))}
      </div>

      {/* Recent Transactions Skeleton */}
      <div className="rounded-xl border border-border/50 bg-card p-6 shadow-card">
        <Skeleton className="h-6 w-48 mb-6" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
