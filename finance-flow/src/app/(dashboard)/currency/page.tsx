"use client"

import { ConversionWidget } from "@/components/currency/ConversionWidget"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CoinsIcon } from "lucide-react"

export default function CurrencyPage() {
  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <div className="space-y-3">
        <h1 className="type-h2 flex items-center gap-3">
          <CoinsIcon className="size-8 text-primary" />
          Currency Tools
        </h1>
        <p className="type-body text-muted-foreground max-w-2xl">
          Convert between currencies and view current exchange rates
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ConversionWidget />
        
        <Card>
          <CardHeader>
            <CardTitle>Exchange Rates</CardTitle>
            <CardDescription>Current rates from USD</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">🇪🇺 EUR</span>
                <span className="text-muted-foreground">0.92</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">🇬🇧 GBP</span>
                <span className="text-muted-foreground">0.79</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">🇯🇵 JPY</span>
                <span className="text-muted-foreground">149.50</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">🇦🇺 AUD</span>
                <span className="text-muted-foreground">1.52</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium">🇨🇦 CAD</span>
                <span className="text-muted-foreground">1.36</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">About Currency Conversion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Our currency conversion tool uses real-time exchange rates to provide accurate conversions between major world currencies.
          </p>
          <p>
            Exchange rates are updated regularly throughout the day. Rates shown are for informational purposes and may differ from actual transaction rates.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
