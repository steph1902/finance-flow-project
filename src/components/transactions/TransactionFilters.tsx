"use client";

import { useMemo } from "react";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  TRANSACTION_TYPE_OPTIONS,
} from "@/constants/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TransactionFilters, TransactionType } from "@/types";
import { Search, X, Calendar, Filter } from "lucide-react";
import { motion } from "framer-motion";

export type FilterState = {
  type: TransactionFilters["type"] | undefined;
  category?: string | undefined;
  search?: string | undefined;
  startDate?: string | undefined;
  endDate?: string | undefined;
};

type TransactionFiltersProps = {
  value: FilterState;
  onChange: (value: FilterState) => void;
  onReset: () => void;
};

export function TransactionFilters({
  value,
  onChange,
  onReset,
}: TransactionFiltersProps) {
  const categoryOptions = useMemo(() => {
    if (value.type === "INCOME") {
      return INCOME_CATEGORIES;
    }

    if (value.type === "EXPENSE") {
      return EXPENSE_CATEGORIES;
    }

    return [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];
  }, [value.type]);

  const handleChange = (
    key: keyof FilterState,
    newValue: string | undefined,
  ) => {
    onChange({
      ...value,
      [key]: newValue,
    });
  };

  const activeFiltersCount = [
    value.type && value.type !== "ALL",
    value.category,
    value.search,
    value.startDate,
    value.endDate,
  ].filter(Boolean).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl bg-white p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
              {activeFiltersCount} active
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 text-muted-foreground hover:text-destructive transition-colors"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="search" className="text-foreground font-medium">
            Search
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search transactions..."
              value={value.search ?? ""}
              onChange={(event) => handleChange("search", event.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-foreground font-medium">Type</Label>
          <Select
            value={value.type ?? "ALL"}
            onValueChange={(newValue) =>
              handleChange("type", newValue as TransactionType | "ALL")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              {TRANSACTION_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-foreground font-medium">Category</Label>
          <Select
            value={value.category ?? "ALL"}
            onValueChange={(newValue) =>
              handleChange(
                "category",
                newValue === "ALL" ? undefined : newValue,
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Categories</SelectItem>
              {categoryOptions.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 lg:col-span-1">
          <Label className="text-neutral-700 font-medium flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Date Range
          </Label>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Input
              type="date"
              value={value.startDate ?? ""}
              onChange={(event) =>
                handleChange("startDate", event.target.value)
              }
              className="border-neutral-300 focus:ring-2 focus:ring-primary-500 text-sm"
              placeholder="Start"
            />
            <Input
              type="date"
              value={value.endDate ?? ""}
              onChange={(event) => handleChange("endDate", event.target.value)}
              className="border-neutral-300 focus:ring-2 focus:ring-primary-500 text-sm"
              placeholder="End"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
