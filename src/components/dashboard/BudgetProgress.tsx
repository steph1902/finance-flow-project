"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, TrendingUp, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import type { Budget } from "@/types";
import { DURATION, STAGGER_DELAY } from "@/config/animations";

type BudgetProgressProps = {
  budgets: Array<Budget & { spent?: number; remaining?: number; progress?: number }>;
  isLoading?: boolean;
};

export function BudgetProgress({ budgets, isLoading = false }: BudgetProgressProps) {
  // Only show top 5 budgets by progress percentage
  const topBudgets = [...budgets]
    .map((budget) => ({
      ...budget,
      spent: budget.spent ?? 0,
      progress: budget.progress ?? (budget.amount === 0 ? 0 : ((budget.spent ?? 0) / budget.amount) * 100),
    }))
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 5);

  const getStatusIcon = (progress: number) => {
    if (progress >= 90) return <AlertCircle className="h-4 w-4 text-danger-600 dark:text-danger-400" />;
    if (progress >= 70) return <TrendingUp className="h-4 w-4 text-warning-600 dark:text-warning-400" />;
    return <CheckCircle className="h-4 w-4 text-success-600 dark:text-success-400" />;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return "bg-danger-500";
    if (progress >= 70) return "bg-warning-500";
    return "bg-success-500";
  };

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-neutral-900 dark:text-white flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          Budget Overview
        </CardTitle>
        <CardDescription className="text-neutral-600 dark:text-neutral-400">
          Track your spending against monthly budgets
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-3 w-10" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : topBudgets.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center text-neutral-500">
            <Wallet className="h-12 w-12 mb-3 text-neutral-300" />
            <p className="text-sm">No budgets set yet</p>
            <p className="text-xs text-neutral-400 mt-1">Create budgets to track your spending</p>
          </div>
        ) : (
          <div className="space-y-4">
            {topBudgets.map((budget, index) => {
              const progress = Math.min(budget.progress, 100);
              const remaining = Math.max(budget.amount - budget.spent, 0);

              return (
                <motion.div
                  key={budget.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * STAGGER_DELAY.medium }}
                  className="space-y-2 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(progress)}
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">
                        {budget.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                      <span className={`font-semibold ${
                        progress >= 90
                          ? "text-danger-600 dark:text-danger-400"
                          : progress >= 70
                          ? "text-warning-600 dark:text-warning-400"
                          : "text-success-600 dark:text-success-400"
                      }`}>
                        {Math.round(progress)}%
                      </span>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="h-2 w-full rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: DURATION.slowest, delay: index * STAGGER_DELAY.slow }}
                        className={`h-full rounded-full ${getProgressColor(progress)} transition-colors`}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Spent: <span className="font-medium text-neutral-900 dark:text-white">{formatCurrency(budget.spent)}</span>
                    </span>
                    <span className="text-neutral-600 dark:text-neutral-400">
                      of <span className="font-medium">{formatCurrency(budget.amount)}</span>
                    </span>
                  </div>
                  {remaining === 0 && progress >= 100 && (
                    <div className="text-xs text-danger-600 dark:text-danger-400 font-medium flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Budget exceeded by {formatCurrency(budget.spent - budget.amount)}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
