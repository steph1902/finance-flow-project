import { Metadata } from 'next'
import { PricingTable } from '@/components/subscription/PricingTable'
import { SubscriptionCard } from '@/components/subscription/SubscriptionCard'
import { UsageDisplay } from '@/components/subscription/UsageDisplay'

export const metadata: Metadata = {
  title: 'Subscription - FinanceFlow',
  description: 'Manage your subscription and view pricing plans',
}

export default function SubscriptionPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Subscription</h1>
        <p className="text-muted-foreground">
          Manage your plan and view usage
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Pricing Plans</h2>
          <PricingTable />
        </div>
        
        <div className="space-y-6">
          {/* These will be populated from API */}
          <SubscriptionCard
            tier="FREE"
            usage={{
              transactions: 0,
              aiRequests: 0,
              goals: 0,
              budgets: 0,
            }}
          />
          <UsageDisplay
            tier="FREE"
            usage={{
              transactions: 0,
              aiRequests: 0,
              goals: 0,
              budgets: 0,
              sharedBudgets: 0,
              reports: 0,
            }}
          />
        </div>
      </div>
    </div>
  )
}
