export type SubscriptionTier = 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';

export interface FeatureLimits {
  transactions: number;
  aiRequests: number;
  goals: number;
  budgets: number;
  sharedBudgets: number;
  reports: number;
}

const FEATURE_LIMITS: Record<SubscriptionTier, FeatureLimits> = {
  FREE: {
    transactions: 50,
    aiRequests: 10,
    goals: 3,
    budgets: 5,
    sharedBudgets: 0,
    reports: 3,
  },
  BASIC: {
    transactions: 500,
    aiRequests: 100,
    goals: 10,
    budgets: 15,
    sharedBudgets: 2,
    reports: 20,
  },
  PREMIUM: {
    transactions: -1, // unlimited
    aiRequests: -1,
    goals: -1,
    budgets: -1,
    sharedBudgets: 10,
    reports: -1,
  },
  ENTERPRISE: {
    transactions: -1,
    aiRequests: -1,
    goals: -1,
    budgets: -1,
    sharedBudgets: -1,
    reports: -1,
  },
};

export function getFeatureLimits(tier: SubscriptionTier): FeatureLimits {
  return FEATURE_LIMITS[tier];
}

export function canUseFeature(
  tier: SubscriptionTier,
  feature: keyof FeatureLimits,
  currentUsage: number
): boolean {
  const limits = FEATURE_LIMITS[tier];
  const limit = limits[feature];
  
  // -1 means unlimited
  if (limit === -1) return true;
  
  return currentUsage < limit;
}

export function getRemainingUsage(
  tier: SubscriptionTier,
  feature: keyof FeatureLimits,
  currentUsage: number
): number | null {
  const limits = FEATURE_LIMITS[tier];
  const limit = limits[feature];
  
  // -1 means unlimited
  if (limit === -1) return null;
  
  return Math.max(0, limit - currentUsage);
}

export function getUsagePercentage(
  tier: SubscriptionTier,
  feature: keyof FeatureLimits,
  currentUsage: number
): number | null {
  const limits = FEATURE_LIMITS[tier];
  const limit = limits[feature];
  
  // -1 means unlimited
  if (limit === -1) return null;
  
  return Math.min(100, (currentUsage / limit) * 100);
}
