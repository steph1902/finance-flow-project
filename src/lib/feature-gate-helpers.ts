import { type SubscriptionTier, canUseFeature } from '@/lib/feature-gates'

interface FeatureGateResult {
  canUse: boolean
  showUpgrade: boolean
  message?: string
}

export async function checkFeatureAccess(
  userId: string,
  feature: 'transactions' | 'aiRequests' | 'goals' | 'budgets' | 'sharedBudgets' | 'reports',
  currentUsage: number
): Promise<FeatureGateResult> {
  // Get user's subscription tier
  const { prisma } = await import('@/lib/prisma')
  
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  })

  const tier: SubscriptionTier = subscription?.tier || 'FREE'

  const canUse = canUseFeature(tier, feature, currentUsage)

  const result: FeatureGateResult = {
    canUse,
    showUpgrade: !canUse,
  }

  if (!canUse) {
    result.message = `You've reached your ${tier} plan limit for ${feature}. Upgrade to continue.`
  }

  return result
}

export function withFeatureGate<T extends (...args: unknown[]) => unknown>(
  _feature: 'transactions' | 'aiRequests' | 'goals' | 'budgets' | 'sharedBudgets' | 'reports',
  fn: T
): T {
  return (async (...args: unknown[]) => {
    // This is a placeholder for runtime feature gating
    // In a real implementation, you'd check the user's tier and usage
    // For now, just execute the function
    return fn(...args)
  }) as T
}
