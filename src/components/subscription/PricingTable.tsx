"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckIcon, ZapIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface PricingTier {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  stripePriceId?: string;
}

const PRICING_TIERS: PricingTier[] = [
  {
    name: 'FREE',
    price: 0,
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      '50 transactions per month',
      '3 financial goals',
      '5 budgets',
      '3 reports per month',
      '10 AI requests per month',
      'Basic insights',
    ],
  },
  {
    name: 'BASIC',
    price: 9,
    period: 'month',
    description: 'Great for personal finance',
    features: [
      '500 transactions per month',
      '10 financial goals',
      '15 budgets',
      '2 shared budgets',
      '20 reports per month',
      '100 AI requests per month',
      'Advanced insights',
      'Receipt scanning',
    ],
    stripePriceId: 'price_basic_monthly',
  },
  {
    name: 'PREMIUM',
    price: 19,
    period: 'month',
    description: 'Best for power users',
    popular: true,
    features: [
      'Unlimited transactions',
      'Unlimited goals',
      'Unlimited budgets',
      '10 shared budgets',
      'Unlimited reports',
      'Unlimited AI requests',
      'AI-powered forecasting',
      'Receipt scanning',
      'Budget simulator',
      'Priority support',
    ],
    stripePriceId: 'price_premium_monthly',
  },
  {
    name: 'BUSINESS',
    price: 49,
    period: 'month',
    description: 'For teams and businesses',
    features: [
      'Everything in Premium',
      'Unlimited shared budgets',
      'Team collaboration',
      'Advanced permissions',
      'API access',
      'Custom reports',
      'Dedicated support',
      'SLA guarantee',
    ],
    stripePriceId: 'price_business_monthly',
  },
];

export function PricingTable() {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleSubscribe = async (tier: PricingTier) => {
    if (!tier.stripePriceId) {
      toast.info("You're already on the free plan!")
      return
    }

    setIsLoading(tier.name)
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: tier.stripePriceId }),
      })

      if (!response.ok) throw new Error('Failed to create checkout session')

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Subscription error:', error)
      toast.error('Failed to start subscription. Please try again.')
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {PRICING_TIERS.map((tier) => (
        <Card
          key={tier.name}
          className={tier.popular ? 'border-primary shadow-lg' : ''}
        >
          {tier.popular && (
            <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium rounded-t-lg">
              Most Popular
            </div>
          )}
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{tier.name}</CardTitle>
              {tier.popular && <ZapIcon className="size-5 text-primary" />}
            </div>
            <CardDescription>{tier.description}</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">${tier.price}</span>
              <span className="text-muted-foreground">/{tier.period}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {tier.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckIcon className="size-4 text-green-500 mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              className="w-full"
              variant={tier.popular ? 'default' : 'outline'}
              onClick={() => handleSubscribe(tier)}
              disabled={isLoading === tier.name}
            >
              {isLoading === tier.name
                ? 'Loading...'
                : tier.price === 0
                ? 'Current Plan'
                : 'Subscribe'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
