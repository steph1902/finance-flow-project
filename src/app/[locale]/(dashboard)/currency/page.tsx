"use client"

import { CurrencyPreference } from "@/components/currency/CurrencyPreference"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CoinsIcon } from "lucide-react"

export default function CurrencyPage() {
  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <div className="space-y-3">
        <h1 className="type-h2 flex items-center gap-3">
          <CoinsIcon className="size-8 text-primary" />
          Currency Settings
        </h1>
        <p className="type-body text-muted-foreground max-w-2xl">
          Manage your currency display preferences for the dashboard.
        </p>
      </div>

      <div className="grid gap-6">
        <CurrencyPreference />
      </div>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">About Currency Display</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            FinanceFlow allows you to view your financial data in your local currency symbol.
          </p>
          <p>
            Currently, this is a display-only preference. It updates the currency symbol shown throughout the application but does not convert historical transaction values.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
