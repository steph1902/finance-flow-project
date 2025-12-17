"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function BudgetsSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Skeleton */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* AI Optimizer Skeleton */}
      <div className="rounded-xl border border-border/50 bg-linear-to-br from-primary/5 via-primary/10 to-primary/5 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-48" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-4 w-full" />
      </div>

      {/* Filters Skeleton */}
      <div className="rounded-xl border border-border/30 bg-card/50 p-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Budget Cards Skeleton */}
      <div className="rounded-lg border bg-card p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-lg border border-border/30 p-4">
              <div className="flex items-start justify-between mb-3">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-2 w-full mb-2 rounded-full" />
              <div className="flex items-center justify-between text-xs">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
