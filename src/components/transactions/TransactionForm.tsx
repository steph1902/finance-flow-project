"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { EXPENSE_CATEGORIES, getCategoriesForType, TRANSACTION_TYPE_OPTIONS } from "@/constants/categories";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Transaction, TransactionType } from "@/types";

const formSchema = z.object({
  amount: z.coerce.number({ invalid_type_error: "Amount must be a number" }).positive("Amount must be greater than 0"),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().min(1, "Category is required"),
  description: z.string().max(191).optional().or(z.literal("")),
  notes: z.string().max(2000).optional().or(z.literal("")),
  date: z.string().min(1, "Date is required"),
});

export type TransactionFormValues = z.infer<typeof formSchema>;

type TransactionFormProps = {
  transaction?: Transaction;
  onSubmit: (values: TransactionFormValues) => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
};

export function TransactionForm({
  transaction,
  onSubmit,
  onDelete,
  onCancel,
  isSubmitting = false,
  submitLabel = "Save",
}: TransactionFormProps) {
  const defaultValues: TransactionFormValues = {
    amount: transaction?.amount ?? 0,
    type: transaction?.type ?? "EXPENSE",
    category: transaction?.category ?? EXPENSE_CATEGORIES[0],
    description: transaction?.description ?? "",
    notes: transaction?.notes ?? "",
    date: transaction?.date ? format(new Date(transaction.date), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
  };

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const selectedType = form.watch("type");

  const categories = useMemo(() => {
    const base = getCategoriesForType(selectedType as TransactionType);
    if (transaction?.category && !base.includes(transaction.category)) {
      return [transaction.category, ...base];
    }
    return base;
  }, [selectedType, transaction?.category]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          await onSubmit({
            ...values,
            description: values.description?.trim() ? values.description : undefined,
            notes: values.notes?.trim() ? values.notes : undefined,
          });
          form.reset();
        })}
        className="space-y-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TRANSACTION_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
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
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  {selectedType === "INCOME"
                    ? "Common income sources"
                    : "Common expense categories"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Grocery shopping" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Optional notes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
          <div>
            {onDelete ? (
              <Button type="button" variant="destructive" onClick={() => onDelete()} disabled={isSubmitting}>
                Delete
              </Button>
            ) : (
              <div />
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            {onCancel ? (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
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

