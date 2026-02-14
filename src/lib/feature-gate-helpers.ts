import { type SubscriptionTier, canUseFeature } from "@/lib/feature-gates";

interface FeatureGateResult {
  canUse: boolean;
  showUpgrade: boolean;
  message?: string;
}

export async function checkFeatureAccess(
  userId: string,
  feature:
    | "transactions"
    | "aiRequests"
    | "goals"
    | "budgets"
    | "sharedBudgets"
    | "reports",
  currentUsage: number,
): Promise<FeatureGateResult> {
  // Since subscriptions have been removed, all features are now available to all users.
  // Always allow access.
  const result: FeatureGateResult = {
    canUse: true,
    showUpgrade: false,
  };

  return result;
}

export function withFeatureGate<T extends (...args: unknown[]) => unknown>(
  _feature:
    | "transactions"
    | "aiRequests"
    | "goals"
    | "budgets"
    | "sharedBudgets"
    | "reports",
  fn: T,
): T {
  return (async (...args: unknown[]) => {
    // This is a placeholder for runtime feature gating
    // In a real implementation, you'd check the user's tier and usage
    // For now, just execute the function
    return fn(...args);
  }) as T;
}
