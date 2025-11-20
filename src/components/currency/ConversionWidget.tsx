"use client"

import { useState } from "react"
import { ArrowRightLeftIcon } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CURRENCIES } from "./CurrencySelector"

export function ConversionWidget() {
  const [from, setFrom] = useState("USD")
  const [to, setTo] = useState("EUR")
  const [amount, setAmount] = useState("")
  const [result, setResult] = useState<number | null>(null)
  const [isConverting, setIsConverting] = useState(false)

  const handleConvert = async () => {
    if (!amount || parseFloat(amount) <= 0) return

    setIsConverting(true)
    try {
      const response = await fetch("/api/currency/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          from,
          to,
        }),
      })

      if (!response.ok) throw new Error("Conversion failed")

      const data = await response.json()
      setResult(data.converted)
    } catch (error) {
      console.error("Conversion failed:", error)
      alert("Conversion failed. Please try again.")
    } finally {
      setIsConverting(false)
    }
  }

  const swap = () => {
    const temp = from
    setFrom(to)
    setTo(temp)
    setResult(null)
  }

  const fromCurrency = CURRENCIES.find((c) => c.code === from)
  const toCurrency = CURRENCIES.find((c) => c.code === to)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Currency Converter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="from-amount">From</Label>
            <Input
              id="from-amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="100.00"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                setResult(null)
              }}
            />
            <select
              value={from}
              onChange={(e) => {
                setFrom(e.target.value)
                setResult(null)
              }}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {CURRENCIES.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.flag} {currency.code}
                </option>
              ))}
            </select>
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={swap}
            className="mb-9"
          >
            <ArrowRightLeftIcon className="size-4" />
          </Button>

          <div className="space-y-2">
            <Label htmlFor="to-amount">To</Label>
            <div className="h-9 px-3 py-2 rounded-md border bg-muted text-sm flex items-center">
              {result !== null ? result.toFixed(2) : "—"}
            </div>
            <select
              value={to}
              onChange={(e) => {
                setTo(e.target.value)
                setResult(null)
              }}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {CURRENCIES.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.flag} {currency.code}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button
          onClick={handleConvert}
          disabled={isConverting || !amount || parseFloat(amount) <= 0}
          className="w-full"
        >
          {isConverting ? "Converting..." : "Convert"}
        </Button>

        {result !== null && (
          <div className="text-center text-sm text-muted-foreground">
            {amount} {fromCurrency?.symbol} ({from}) = {result.toFixed(2)}{" "}
            {toCurrency?.symbol} ({to})
          </div>
        )}
      </CardContent>
    </Card>
  )
}
