"use client";

import { GlobeIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import { CURRENCIES } from "@/lib/services/currency-service";

interface CurrencySelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export function CurrencySelector({
  value,
  onValueChange,
  disabled = false,
}: CurrencySelectorProps) {
  const selectedCurrency = CURRENCIES.find((c) => c.code === value);

  return (
    <div className="space-y-2">
      <Label htmlFor="currency">
        <GlobeIcon className="inline size-4 mr-1" />
        Preferred Currency
      </Label>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger id="currency" className="w-full">
          <SelectValue>
            {selectedCurrency && (
              <span className="flex items-center gap-2">
                <span className="text-xl">{selectedCurrency.flag}</span>
                <span>
                  {selectedCurrency.code} - {selectedCurrency.name}
                </span>
              </span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {CURRENCIES.map((currency) => (
            <SelectItem key={currency.code} value={currency.code}>
              <span className="flex items-center gap-2">
                <span className="text-xl">{currency.flag}</span>
                <span>
                  {currency.code} - {currency.name}
                </span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
