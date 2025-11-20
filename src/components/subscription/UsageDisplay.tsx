"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertCircleIcon, TrendingUpIcon } from "lucide-react"
import { type SubscriptionTier, getFeatureLimits, getUsagePercentage, getRemainingUsage } from "@/lib/feature-gates"

interface UsageDisplayProps {
  tier: SubscriptionTier;
  usage: {
    transactions: number;
    aiRequests: number;
    goals: number;
    budgets: number;
    sharedBudgets: number;
    reports: number;
  };
}

export function UsageDisplay({ tier, usage }: UsageDisplayProps) {
  const limits = getFeatureLimits(tier)

  const usageItems = [
    { label: 'Transactions', current: usage.transactions, limit: limits.transactions, key: 'transactions' as const },
    { label: 'AI Requests', current: usage.aiRequests, limit: limits.aiRequests, key: 'aiRequests' as const },
    { label: 'Goals', current: usage.goals, limit: limits.goals, key: 'goals' as const },
    { label: 'Budgets', current: usage.budgets, limit: limits.budgets, key: 'budgets' as const },
    { label: 'Shared Budgets', current: usage.sharedBudgets, limit: limits.sharedBudgets, key: 'sharedBudgets' as const },
    { label: 'Reports', current: usage.reports, limit: limits.reports, key: 'reports' as const },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUpIcon className="size-5" />
          Usage Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {usageItems.map((item) => {
            const percentage = getUsagePercentage(tier, item.key, item.current)
            const remaining = getRemainingUsage(tier, item.key, item.current)
            const isUnlimited = item.limit === -1
            const isNearLimit = percentage !== null && percentage > 80

            return (
              <div key={item.key} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{item.label}</span>
                  <div className="flex items-center gap-2">
                    {isNearLimit && (
                      <AlertCircleIcon className="size-4 text-destructive" />
                    )}
                    <span className="text-sm font-medium">
                      {item.current}
                      {!isUnlimited && ` / ${item.limit}`}
                      {isUnlimited && <span className="text-muted-foreground ml-1">∞</span>}
                    </span>
                  </div>
                </div>

                {!isUnlimited && percentage !== null && (
                  <>
                    <Progress
                      value={percentage}
                      className={percentage > 90 ? '[&>div]:bg-destructive' : ''}
                    />
                    {remaining !== null && (
                      <p className="text-xs text-muted-foreground">
                        {remaining} remaining this month
                      </p>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
