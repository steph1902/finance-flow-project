"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Repeat, DollarSign, Info, AlertCircle } from "lucide-react";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/constants/categories";
import { logError } from "@/lib/logger";

const recurringTransactionSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  notes: z.string().optional(),
  frequency: z.enum(["DAILY", "WEEKLY", "BIWEEKLY", "MONTHLY", "QUARTERLY", "YEARLY"]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  isActive: z.boolean(),
});

type RecurringTransactionFormData = z.infer<typeof recurringTransactionSchema>;

interface RecurringTransactionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Partial<RecurringTransactionFormData>;
}

const FREQUENCY_OPTIONS = [
  { value: "DAILY", label: "Daily", description: "Every day" },
  { value: "WEEKLY", label: "Weekly", description: "Every 7 days" },
  { value: "BIWEEKLY", label: "Bi-weekly", description: "Every 14 days" },
  { value: "MONTHLY", label: "Monthly", description: "Every month" },
  { value: "QUARTERLY", label: "Quarterly", description: "Every 3 months" },
  { value: "YEARLY", label: "Yearly", description: "Every year" },
];

export function RecurringTransactionForm({
  onSuccess,
  onCancel,
  initialData,
}: RecurringTransactionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextOccurrence, setNextOccurrence] = useState<Date | null>(null);

  const defaultStartDate = (initialData?.startDate || new Date().toISOString().split("T")[0]) as string;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RecurringTransactionFormData>({
    resolver: zodResolver(recurringTransactionSchema),
    defaultValues: {
      type: initialData?.type ?? "EXPENSE",
      frequency: initialData?.frequency ?? "MONTHLY",
      isActive: initialData?.isActive ?? true,
      startDate: defaultStartDate,
      ...(initialData?.amount !== undefined && { amount: initialData.amount }),
      ...(initialData?.category !== undefined && { category: initialData.category }),
      ...(initialData?.description !== undefined && { description: initialData.description }),
      ...(initialData?.notes !== undefined && { notes: initialData.notes }),
      ...(initialData?.endDate !== undefined && { endDate: initialData.endDate }),
    },
  });

  const watchType = watch("type");
  const watchFrequency = watch("frequency");
  const watchStartDate = watch("startDate");

  // Calculate next occurrence preview
  const calculateNextOccurrence = (startDate: string, frequency: string) => {
    if (!startDate) return null;

    const start = new Date(startDate);
    const next = new Date(start);

    switch (frequency) {
      case "DAILY":
        next.setDate(next.getDate() + 1);
        break;
      case "WEEKLY":
        next.setDate(next.getDate() + 7);
        break;
      case "BIWEEKLY":
        next.setDate(next.getDate() + 14);
        break;
      case "MONTHLY":
        next.setMonth(next.getMonth() + 1);
        break;
      case "QUARTERLY":
        next.setMonth(next.getMonth() + 3);
        break;
      case "YEARLY":
        next.setFullYear(next.getFullYear() + 1);
        break;
    }

    return next;
  };

  // Update preview when frequency or start date changes
  useState(() => {
    if (watchStartDate && watchFrequency) {
      const next = calculateNextOccurrence(watchStartDate, watchFrequency);
      setNextOccurrence(next);
    }
  });

  const onSubmit = async (data: RecurringTransactionFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch("/api/recurring-transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          amount: parseFloat(data.amount),
          startDate: new Date(data.startDate).toISOString(),
          endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create recurring transaction");
      }

      onSuccess?.();
    } catch (err) {
      logError("Submit error for recurring transaction", err);
      setError(err instanceof Error ? err.message : "Failed to create recurring transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = watchType === "INCOME" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const selectedFrequency = FREQUENCY_OPTIONS.find(opt => opt.value === watchFrequency);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Transaction Type */}
      <div className="space-y-2">
        <Label htmlFor="type">Transaction Type *</Label>
        <Select
          value={watchType}
          onValueChange={(value) => setValue("type", value as "INCOME" | "EXPENSE")}
        >
          <SelectTrigger id="type" aria-label="Select transaction type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EXPENSE">💸 Expense</SelectItem>
            <SelectItem value="INCOME">💰 Income</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Amount and Category Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount *</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              className="pl-9"
              aria-describedby="amount-description"
              {...register("amount")}
            />
          </div>
          {errors.amount && (
            <p className="text-sm text-destructive" role="alert">{errors.amount.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={watch("category")}
            onValueChange={(value) => setValue("category", value)}
          >
            <SelectTrigger id="category" aria-label="Select category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat: string) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-destructive" role="alert">{errors.category.message}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          placeholder="e.g., Netflix Subscription, Rent Payment"
          maxLength={100}
          aria-describedby="description-hint"
          {...register("description")}
        />
        <p id="description-hint" className="text-xs text-muted-foreground">
          Optional: Add a memorable name for this recurring transaction
        </p>
      </div>

      {/* Frequency Selection */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Repeat className="h-4 w-4" />
            Recurrence Pattern *
          </CardTitle>
          <CardDescription>How often should this transaction repeat?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            value={watchFrequency}
            onValueChange={(value) => {
              setValue("frequency", value as "DAILY" | "WEEKLY" | "BIWEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY");
              if (watchStartDate) {
                const next = calculateNextOccurrence(watchStartDate, value);
                setNextOccurrence(next);
              }
            }}
          >
            <SelectTrigger aria-label="Select recurrence frequency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FREQUENCY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex flex-col">
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-muted-foreground">{option.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedFrequency && (
            <div className="flex items-start gap-2 p-3 bg-background rounded-md border">
              <Info className="h-4 w-4 mt-0.5 text-blue-500" />
              <p className="text-sm text-muted-foreground">
                Transactions will be created <strong>{selectedFrequency.description.toLowerCase()}</strong>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Date Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                {...register("startDate")}
                onChange={(e) => {
                  register("startDate").onChange(e);
                  if (e.target.value && watchFrequency) {
                    const next = calculateNextOccurrence(e.target.value, watchFrequency);
                    setNextOccurrence(next);
                  }
                }}
              />
              {errors.startDate && (
                <p className="text-sm text-destructive">{errors.startDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <Input
                id="endDate"
                type="date"
                {...register("endDate")}
              />
              <p className="text-xs text-muted-foreground">Leave empty for indefinite recurrence</p>
            </div>
          </div>

          {nextOccurrence && (
            <div className="p-3 bg-green-50 rounded-md border border-green-200">
              <p className="text-sm text-green-700">
                <strong>Next occurrence:</strong> {nextOccurrence.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Additional details about this recurring transaction..."
          rows={3}
          {...register("notes")}
        />
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? "Creating..." : "Create Recurring Transaction"}
        </Button>
      </div>
    </form>
  );
}
