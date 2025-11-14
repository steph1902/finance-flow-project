import { useState, useEffect, useCallback } from "react";

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
      
      // Parse dates
      const parsed = data.recurringTransactions.map((t: any) => ({
        ...t,
        amount: parseFloat(t.amount),
        startDate: new Date(t.startDate),
        endDate: t.endDate ? new Date(t.endDate) : null,
        nextDate: new Date(t.nextDate),
        lastGenerated: t.lastGenerated ? new Date(t.lastGenerated) : null,
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt),
      }));

      setRecurringTransactions(parsed);
    } catch (err) {
      console.error("Fetch recurring transactions error:", err);
      setError(err instanceof Error ? err.message : "Failed to load recurring transactions");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createRecurringTransaction = async (data: Omit<RecurringTransaction, "id" | "nextDate" | "lastGenerated" | "createdAt" | "updatedAt">) => {
    try {
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
        throw new Error("Failed to create recurring transaction");
      }

      await fetchRecurringTransactions();
      return true;
    } catch (err) {
      console.error("Create recurring transaction error:", err);
      throw err;
    }
  };

  const updateRecurringTransaction = async (id: string, data: Partial<RecurringTransaction>) => {
    try {
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
        throw new Error("Failed to update recurring transaction");
      }

      await fetchRecurringTransactions();
      return true;
    } catch (err) {
      console.error("Update recurring transaction error:", err);
      throw err;
    }
  };

  const deleteRecurringTransaction = async (id: string) => {
    try {
      const response = await fetch(`/api/recurring-transactions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete recurring transaction");
      }

      await fetchRecurringTransactions();
      return true;
    } catch (err) {
      console.error("Delete recurring transaction error:", err);
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
