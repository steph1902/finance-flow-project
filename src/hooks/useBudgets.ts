"use client";

import useSWR from "swr";
import { useCallback } from "react";
import { toast } from "sonner";

import { apiFetch, buildQueryString } from "@/lib/api-client";
import { logError } from "@/lib/logger";
import type { Budget, BudgetFilters } from "@/types";

type BudgetPayload = {
  category: string;
  amount: number;
  month: number;
  year: number;
};

type BudgetsResponse = {
  data: Array<Budget & { spent?: number; remaining?: number; progress?: number }>;
  period: {
    month: number;
    year: number;
    start: string;
    end: string;
  };
};

const fetcher = (url: string) => apiFetch<BudgetsResponse>(url);

export function useBudgets(filters: BudgetFilters = {}) {
  const queryString = buildQueryString(filters);
  const { data, error, isLoading, mutate } = useSWR(`/api/budgets${queryString}`, fetcher);

  const createBudget = useCallback(
    async (payload: BudgetPayload) => {
      try {
        await apiFetch<{ message: string; data: Budget }>("/api/budgets", {
          method: "POST",
          body: payload,
        });
        await mutate();
        toast.success("Budget created successfully");
      } catch (err) {
        logError("Create budget error", err);
        toast.error(err instanceof Error ? err.message : "Failed to create budget");
        throw err;
      }
    },
    [mutate],
  );

  const updateBudget = useCallback(
    async (id: string, payload: Partial<BudgetPayload>) => {
      try {
        await apiFetch<{ message: string; data: Budget }>(`/api/budgets/${id}`, {
          method: "PATCH",
          body: payload,
        });
        await mutate();
        toast.success("Budget updated successfully");
      } catch (err) {
        logError("Update budget error", err, { id });
        toast.error(err instanceof Error ? err.message : "Failed to update budget");
        throw err;
      }
    },
    [mutate],
  );

  const deleteBudget = useCallback(
    async (id: string) => {
      try {
        await apiFetch<{ message: string }>(`/api/budgets/${id}`, {
          method: "DELETE",
        });
        await mutate();
        toast.success("Budget deleted successfully");
      } catch (err) {
        logError("Delete budget error", err, { id });
        toast.error(err instanceof Error ? err.message : "Failed to delete budget");
        throw err;
      }
    },
    [mutate],
  );

  return {
    budgets: data?.data ?? [],
    period: data?.period,
    isLoading,
    isError: Boolean(error),
    error,
    createBudget,
    updateBudget,
    deleteBudget,
    refresh: mutate,
  };
}

