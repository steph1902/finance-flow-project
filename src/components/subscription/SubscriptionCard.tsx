"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CreditCardIcon, ExternalLinkIcon, ZapIcon } from "lucide-react"
import { type SubscriptionTier, getFeatureLimits, getUsagePercentage } from "@/lib/feature-gates"
import { formatCurrency } from "@/lib/formatters"

interface SubscriptionCardProps {
  tier: SubscriptionTier;
  usage: {
    transactions: number;
    aiRequests: number;
    goals: number;
    budgets: number;
  };
  billingDate?: string;
  amount?: number;
}

const TIER_COLORS: Record<SubscriptionTier, 'default' | 'secondary'> = {
  FREE: 'secondary',
  BASIC: 'default',
  PREMIUM: 'default',
  ENTERPRISE: 'default',
};

export function SubscriptionCard({ tier, usage, billingDate, amount }: SubscriptionCardProps) {
  const limits = getFeatureLimits(tier)

  const handleManageSubscription = async () => {
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Failed to create portal session')

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Portal error:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CreditCardIcon className="size-5" />
            Current Plan
          </CardTitle>
          <Badge variant={TIER_COLORS[tier]} className="flex items-center gap-1">
            {tier === 'PREMIUM' && <ZapIcon className="size-3" />}
            {tier}
          </Badge>
        </div>
        {amount && (
          <CardDescription>
            {formatCurrency(amount)}/month • Next billing: {billingDate}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <UsageItem
            label="Transactions"
            current={usage.transactions}
            limit={limits.transactions}
            tier={tier}
          />
          <UsageItem
            label="AI Requests"
            current={usage.aiRequests}
            limit={limits.aiRequests}
            tier={tier}
          />
          <UsageItem
            label="Goals"
            current={usage.goals}
            limit={limits.goals}
            tier={tier}
          />
          <UsageItem
            label="Budgets"
            current={usage.budgets}
            limit={limits.budgets}
            tier={tier}
          />
        </div>

        {tier !== 'FREE' && (
          <Button
            variant="outline"
            className="w-full"
            onClick={handleManageSubscription}
          >
            <ExternalLinkIcon className="size-4 mr-2" />
            Manage Subscription
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

function UsageItem({
  label,
  current,
  limit,
  tier,
}: {
  label: string;
  current: number;
  limit: number;
  tier: SubscriptionTier;
}) {
  type FeatureLimitKey = 'transactions' | 'aiRequests' | 'goals' | 'budgets' | 'sharedBudgets' | 'reports'
  const featureMap: Record<string, FeatureLimitKey> = {
    'Transactions': 'transactions',
    'AI Requests': 'aiRequests',
    'Goals': 'goals',
    'Budgets': 'budgets',
  }
  const featureKey = featureMap[label]
  const percentage = featureKey ? getUsagePercentage(tier, featureKey, current) : null
  const isUnlimited = limit === -1

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-medium">
          {current} {isUnlimited ? '' : `/ ${limit}`}
          {isUnlimited && <span className="text-muted-foreground ml-1">∞</span>}
        </span>
      </div>
      {!isUnlimited && percentage !== null && (
        <Progress
          value={percentage}
          className={percentage > 90 ? 'bg-destructive/20' : ''}
        />
      )}
    </div>
  )
}
