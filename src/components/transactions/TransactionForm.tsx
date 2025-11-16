"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { EXPENSE_CATEGORIES, getCategoriesForType, TRANSACTION_TYPE_OPTIONS } from "@/constants/categories";
import { AILoading } from "@/components/ai/AILoading";
import { CategorySuggestionCard } from "@/components/ai/CategorySuggestionCard";
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
import type { CategorySuggestion, Transaction, TransactionType } from "@/types";
import { logError } from "@/lib/logger";

const formSchema = z.object({
  amount: z.string().min(1, "Amount is required").refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "Amount must be greater than 0"
  ),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().min(1, "Category is required"),
  description: z.string().max(191, "Description must be 191 characters or less").optional().or(z.literal("")),
  notes: z.string().max(2000, "Notes must be 2000 characters or less").optional().or(z.literal("")),
  date: z.string().min(1, "Date is required"),
});

export type TransactionFormValues = z.infer<typeof formSchema>;

type TransactionFormProps = {
  transaction?: Transaction;
  onSubmit: (values: {
    amount: number;
    type: "INCOME" | "EXPENSE";
    category: string;
    description?: string;
    notes?: string;
    date: string;
  }) => Promise<void> | void;
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
    amount: transaction?.amount?.toString() ?? "",
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
  const currentDescription = form.watch("description");
  const currentAmount = form.watch("amount");

  const [aiSuggestion, setAiSuggestion] = useState<CategorySuggestion | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Trigger AI categorization when description changes (for new transactions)
  useEffect(() => {
    if (!transaction && currentDescription && currentDescription.length > 3 && Number(currentAmount) > 0) {
      const timer = setTimeout(async () => {
        setIsLoadingAI(true);
        setAiError(null);
        try {
          const response = await fetch("/api/ai/categorize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              description: currentDescription,
              amount: currentAmount,
              type: selectedType,
            }),
          });
          
          if (response.ok) {
            const data = await response.json();
            setAiSuggestion(data);
          } else {
            // Only show error for non-auth errors (auth errors are expected when not logged in)
            if (response.status !== 401) {
              const errorData = await response.json().catch(() => ({ error: "Failed to get AI suggestion" }));
              setAiError(errorData.error || "AI categorization unavailable");
            }
          }
        } catch (error) {
          logError("AI categorization error", error);
          setAiError("Network error. AI suggestions temporarily unavailable.");
        } finally {
          setIsLoadingAI(false);
        }
      }, 800); // Debounce API calls

      return () => clearTimeout(timer);
    } else {
      // Clear suggestions when conditions aren't met
      setAiSuggestion(null);
      setAiError(null);
    }
  }, [currentDescription, currentAmount, selectedType, transaction]);

  // Handle accepting AI suggestion
  const handleAcceptSuggestion = () => {
    if (aiSuggestion) {
      form.setValue("category", aiSuggestion.category);
      setAiSuggestion(null);
    }
  };

  const categories = useMemo(() => {
    const base = getCategoriesForType(selectedType as TransactionType);
    if (transaction?.category && !(base as readonly string[]).includes(transaction.category)) {
      return [transaction.category, ...base];
    }
    return base;
  }, [selectedType, transaction?.category]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          await onSubmit({
            amount: Number(values.amount),
            type: values.type,
            category: values.category,
            description: values.description?.trim() || undefined,
            notes: values.notes?.trim() || undefined,
            date: values.date,
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

        {/* AI Category Suggestion - Loading State */}
        {isLoadingAI && !aiSuggestion && (
          <AILoading message="AI is analyzing your transaction..." />
        )}

        {/* AI Category Suggestion - Success State */}
        {aiSuggestion && !isLoadingAI && (
          <CategorySuggestionCard
            suggestion={aiSuggestion}
            onAccept={handleAcceptSuggestion}
            onReject={() => setAiSuggestion(null)}
            isLoading={false}
          />
        )}

        {/* AI Category Suggestion - Error State */}
        {aiError && !isLoadingAI && !aiSuggestion && (
          <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-200">
            <p className="font-medium">AI Suggestion Unavailable</p>
            <p className="mt-1 text-xs">{aiError}</p>
          </div>
        )}

        <FormField
          control={form.control}
          name="notes"
          render={({ field}) => (
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

