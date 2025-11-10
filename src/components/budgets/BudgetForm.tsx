"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { EXPENSE_CATEGORIES } from "@/constants/categories";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Budget } from "@/types";

const schema = z.object({
  category: z.string().min(1, "Category is required"),
  amount: z.number().positive("Amount must be greater than 0"),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(2100),
});

export type BudgetFormValues = z.infer<typeof schema>;

type BudgetFormProps = {
  budget?: Budget;
  onSubmit: (values: BudgetFormValues) => Promise<void> | void;
  onCancel?: () => void;
  onDelete?: () => Promise<void> | void;
  isSubmitting?: boolean;
  submitLabel?: string;
};

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const yearOptions = Array.from({ length: 5 }, (_, index) => currentYear - 2 + index);

export function BudgetForm({
  budget,
  onSubmit,
  onCancel,
  onDelete,
  isSubmitting = false,
  submitLabel = "Save",
}: BudgetFormProps) {
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: budget?.category ?? EXPENSE_CATEGORIES[0],
      amount: budget?.amount ?? 0,
      month: budget?.month ?? currentDate.getMonth() + 1,
      year: budget?.year ?? currentYear,
    },
  });

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(async (values) => {
          await onSubmit(values);
        })}
      >
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monthly budget amount</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="month"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Month</FormLabel>
                <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
                      <SelectItem key={month} value={String(month)}>
                        {new Date(0, month - 1).toLocaleString(undefined, { month: "long" })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={String(year)}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
          <div>
            {onDelete ? (
              <Button type="button" variant="destructive" disabled={isSubmitting} onClick={() => onDelete()}>
                Delete
              </Button>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            {onCancel ? (
              <Button type="button" variant="outline" disabled={isSubmitting} onClick={onCancel}>
                Cancel
              </Button>
            ) : null}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : submitLabel}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

