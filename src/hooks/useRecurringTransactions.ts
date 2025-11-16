import { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import { logError } from "@/lib/logger";
import { toast } from "sonner";

// Validation schemas
const RecurringFrequencySchema = z.enum([
  "DAILY",
  "WEEKLY",
  "BIWEEKLY",
  "MONTHLY",
  "QUARTERLY",
  "YEARLY",
]);

const TransactionTypeSchema = z.enum(["INCOME", "EXPENSE"]);

const RecurringTransactionCreateSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  type: TransactionTypeSchema,
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  notes: z.string().optional(),
  frequency: RecurringFrequencySchema,
  startDate: z.date(),
  endDate: z.date().nullable().optional(),
  isActive: z.boolean(),
}).refine(
  (data) => {
    if (data.endDate) {
      return data.startDate < data.endDate;
    }
    return true;
  },
  {
    message: "End date must be after start date",
    path: ["endDate"],
  }
);

const RecurringTransactionUpdateSchema = z.object({
  amount: z.number().positive("Amount must be positive").optional(),
  type: TransactionTypeSchema.optional(),
  category: z.string().min(1, "Category is required").optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
  frequency: RecurringFrequencySchema.optional(),
  startDate: z.date().optional(),
  endDate: z.date().nullable().optional(),
  isActive: z.boolean().optional(),
}).refine(
  (data) => {
    if (data.endDate && data.startDate) {
      return data.startDate < data.endDate;
    }
    return true;
  },
  {
    message: "End date must be after start date",
    path: ["endDate"],
  }
);

// API response type
interface RecurringTransactionResponse {
  id: string;
  amount: string;
  type: "INCOME" | "EXPENSE";
  category: string;
  description?: string | null;
  notes?: string | null;
  frequency: "DAILY" | "WEEKLY" | "BIWEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";
  startDate: string;
  endDate?: string | null;
  nextDate: string;
  isActive: boolean;
  lastGenerated?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RecurringTransaction {
  id: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  description?: string;
  notes?: string;
  frequency: "DAILY" | "WEEKLY" | "BIWEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";
  startDate: Date;
  endDate?: Date | null;
  nextDate: Date;
  isActive: boolean;
  lastGenerated?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export function useRecurringTransactions() {
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecurringTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/recurring-transactions");
      
      if (!response.ok) {
        throw new Error("Failed to fetch recurring transactions");
      }

      const data = await response.json();
      
      // Parse dates with proper typing
      const parsed: RecurringTransaction[] = data.recurringTransactions.map((t: RecurringTransactionResponse) => ({
        ...t,
        amount: parseFloat(t.amount),
        description: t.description ?? undefined,
        notes: t.notes ?? undefined,
        startDate: new Date(t.startDate),
        endDate: t.endDate ? new Date(t.endDate) : null,
        nextDate: new Date(t.nextDate),
        lastGenerated: t.lastGenerated ? new Date(t.lastGenerated) : null,
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt),
      }));

      setRecurringTransactions(parsed);
    } catch (err) {
      logError("Fetch recurring transactions error", err);
      setError(err instanceof Error ? err.message : "Failed to load recurring transactions");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createRecurringTransaction = async (data: Omit<RecurringTransaction, "id" | "nextDate" | "lastGenerated" | "createdAt" | "updatedAt">) => {
    try {
      // Validate input data
      const validationResult = RecurringTransactionCreateSchema.safeParse(data);
      
      if (!validationResult.success) {
        const errors = validationResult.error.issues.map(e => e.message).join(", ");
        toast.error(`Validation failed: ${errors}`);
        throw new Error(errors);
      }

      const response = await fetch("/api/recurring-transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          startDate: data.startDate.toISOString(),
          endDate: data.endDate?.toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create recurring transaction");
      }

      await fetchRecurringTransactions();
      toast.success("Recurring transaction created successfully");
      return true;
    } catch (err) {
      logError("Create recurring transaction error", err);
      if (err instanceof Error && !err.message.includes("Validation failed")) {
        toast.error(err.message || "Failed to create recurring transaction");
      }
      throw err;
    }
  };

  const updateRecurringTransaction = async (id: string, data: Partial<RecurringTransaction>) => {
    try {
      // Validate input data
      const validationResult = RecurringTransactionUpdateSchema.safeParse(data);
      
      if (!validationResult.success) {
        const errors = validationResult.error.issues.map(e => e.message).join(", ");
        toast.error(`Validation failed: ${errors}`);
        throw new Error(errors);
      }

      const response = await fetch(`/api/recurring-transactions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          startDate: data.startDate?.toISOString(),
          endDate: data.endDate?.toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update recurring transaction");
      }

      await fetchRecurringTransactions();
      toast.success("Recurring transaction updated successfully");
      return true;
    } catch (err) {
      logError("Update recurring transaction error", err, { id });
      if (err instanceof Error && !err.message.includes("Validation failed")) {
        toast.error(err.message || "Failed to update recurring transaction");
      }
      throw err;
    }
  };

  const deleteRecurringTransaction = async (id: string) => {
    try {
      const response = await fetch(`/api/recurring-transactions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete recurring transaction");
      }

      await fetchRecurringTransactions();
      toast.success("Recurring transaction deleted successfully");
      return true;
    } catch (err) {
      logError("Delete recurring transaction error", err, { id });
      toast.error(err instanceof Error ? err.message : "Failed to delete recurring transaction");
      throw err;
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    return updateRecurringTransaction(id, { isActive });
  };

  useEffect(() => {
    fetchRecurringTransactions();
  }, [fetchRecurringTransactions]);

  return {
    recurringTransactions,
    isLoading,
    error,
    refresh: fetchRecurringTransactions,
    createRecurringTransaction,
    updateRecurringTransaction,
    deleteRecurringTransaction,
    toggleActive,
  };
}
