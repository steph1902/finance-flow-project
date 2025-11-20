"use client"

import useSWR from 'swr'
import { type SubscriptionTier } from '@/lib/feature-gates'

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface Subscription {
  tier: SubscriptionTier
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'TRIAL'
  currentPeriodStart: string | null
  currentPeriodEnd: string | null
  cancelAtPeriodEnd: boolean
}

export function useSubscription() {
  const { data, error, isLoading } = useSWR<Subscription>('/api/stripe/subscription', fetcher)

  return {
    subscription: data,
    isLoading,
    isError: error,
  }
}
