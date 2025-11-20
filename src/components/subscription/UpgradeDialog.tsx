"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ZapIcon, CheckIcon, ArrowRightIcon } from "lucide-react"
import { type SubscriptionTier } from "@/lib/feature-gates"
import { useState } from "react"
import { toast } from "sonner"

interface UpgradeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: SubscriptionTier;
  feature?: string;
  limitReached?: boolean;
}

const UPGRADE_BENEFITS = {
  BASIC: [
    '500 transactions per month',
    '100 AI requests',
    'Receipt scanning',
    'Advanced insights',
  ],
  PREMIUM: [
    'Unlimited everything',
    'AI-powered forecasting',
    'Budget simulator',
    'Priority support',
  ],
  BUSINESS: [
    'All Premium features',
    'Team collaboration',
    'API access',
    'Dedicated support',
  ],
};

export function UpgradeDialog({
  isOpen,
  onClose,
  currentTier,
  feature,
  limitReached,
}: UpgradeDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  const suggestedTier: SubscriptionTier = currentTier === 'FREE' ? 'BASIC' : 'PREMIUM'
  const benefits = UPGRADE_BENEFITS[suggestedTier]

  const handleUpgrade = async () => {
    setIsLoading(true)
    try {
      const priceIds = {
        BASIC: 'price_basic_monthly',
        PREMIUM: 'price_premium_monthly',
        BUSINESS: 'price_business_monthly',
      }

      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: priceIds[suggestedTier] }),
      })

      if (!response.ok) throw new Error('Failed to create checkout session')

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Upgrade error:', error)
      toast.error('Failed to start upgrade. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <ZapIcon className="size-6 text-primary" />
            Upgrade to {suggestedTier}
          </DialogTitle>
          <DialogDescription>
            {limitReached
              ? `You've reached your ${currentTier} plan limit for ${feature}. Upgrade to continue.`
              : `Unlock more features with ${suggestedTier}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {limitReached && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm font-medium">Limit Reached</p>
              <p className="text-sm text-muted-foreground mt-1">
                Upgrade your plan to add more {feature}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <p className="font-medium">What you&apos;ll get:</p>
            <ul className="space-y-2">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckIcon className="size-4 text-green-500 mt-0.5 shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-muted">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{suggestedTier} Plan</p>
                <p className="text-sm text-muted-foreground">
                  ${suggestedTier === 'BASIC' ? '9' : suggestedTier === 'PREMIUM' ? '19' : '49'}/month
                </p>
              </div>
              <Badge className="text-sm px-3 py-1">
                Best Value
              </Badge>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Maybe Later
            </Button>
            <Button onClick={handleUpgrade} disabled={isLoading} className="flex-1">
              {isLoading ? 'Loading...' : (
                <>
                  Upgrade Now
                  <ArrowRightIcon className="size-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
