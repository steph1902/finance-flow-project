"use client"

import { useState } from "react"
import { GlobeIcon, CheckIcon } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { CURRENCIES } from "@/lib/services/currency-service"

export function CurrencyPreference() {
    const [currency, setCurrency] = useState("USD")
    const [isLoading, setIsLoading] = useState(false)

    const handleSave = async () => {
        setIsLoading(true)
        try {
            const response = await fetch("/api/currency/preference", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currency }),
            })

            if (!response.ok) throw new Error("Failed to update currency")

            toast.success("Currency updated", {
                description: "Your dashboard will now display values in " + currency,
            })
        } catch (error) {
            toast.error("Error", {
                description: "Failed to save currency preference",
            })
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const selectedCurrency = CURRENCIES.find((c) => c.code === currency)

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <GlobeIcon className="size-5" />
                    Display Currency
                </CardTitle>
                <CardDescription>
                    Select the currency you want to see across your dashboard.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="currency-select">Preferred Currency</Label>
                    <Select value={currency} onValueChange={setCurrency} disabled={isLoading}>
                        <SelectTrigger id="currency-select">
                            <SelectValue>
                                {selectedCurrency && (
                                    <span className="flex items-center gap-2">
                                        <span className="text-xl">{selectedCurrency.flag}</span>
                                        <span>{selectedCurrency.code} - {selectedCurrency.name}</span>
                                    </span>
                                )}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {CURRENCIES.map((c) => (
                                <SelectItem key={c.code} value={c.code}>
                                    <span className="flex items-center gap-2">
                                        <span className="text-xl">{c.flag}</span>
                                        <span>{c.code} - {c.name}</span>
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-md bg-muted p-4 text-sm text-muted-foreground">
                    <p>
                        Note: This setting only changes the display symbol. Actual exchange rates are not applied to historical data.
                    </p>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSave} disabled={isLoading} className="w-full sm:w-auto">
                    {isLoading ? (
                        "Saving..."
                    ) : (
                        <>
                            <CheckIcon className="mr-2 size-4" />
                            Save Preference
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}
