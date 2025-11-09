"use client";

import { useMemo } from "react";

import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, TRANSACTION_TYPE_OPTIONS } from "@/constants/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TransactionFilters, TransactionType } from "@/types";

export type FilterState = {
  type: TransactionFilters["type"];
  category?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
};

type TransactionFiltersProps = {
  value: FilterState;
  onChange: (value: FilterState) => void;
  onReset: () => void;
};

export function TransactionFilters({ value, onChange, onReset }: TransactionFiltersProps) {
  const categoryOptions = useMemo(() => {
    if (value.type === "INCOME") {
      return INCOME_CATEGORIES;
    }

    if (value.type === "EXPENSE") {
      return EXPENSE_CATEGORIES;
    }

    return [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];
  }, [value.type]);

  const handleChange = (key: keyof FilterState, newValue: string | undefined) => {
    onChange({
      ...value,
      [key]: newValue,
    });
  };

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search description or notes"
            value={value.search ?? ""}
            onChange={(event) => handleChange("search", event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Type</Label>
          <Select
            value={value.type ?? "ALL"}
            onValueChange={(newValue) => handleChange("type", newValue as TransactionType | "ALL")}
          >
            <SelectTrigger>
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              {TRANSACTION_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={value.category ?? "ALL"}
            onValueChange={(newValue) => handleChange("category", newValue === "ALL" ? undefined : newValue)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All categories</SelectItem>
              {categoryOptions.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Date range</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              value={value.startDate ?? ""}
              onChange={(event) => handleChange("startDate", event.target.value)}
            />
            <Input
              type="date"
              value={value.endDate ?? ""}
              onChange={(event) => handleChange("endDate", event.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button variant="outline" onClick={onReset}>
          Reset filters
        </Button>
      </div>
    </div>
  );
}

