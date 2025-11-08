"use client";

import useSWR from "swr";
import { useCallback } from "react";

import { apiFetch, buildQueryString } from "@/lib/api-client";
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
      await apiFetch<{ message: string; data: Budget }>("/api/budgets", {
        method: "POST",
        body: payload,
      });
      await mutate();
    },
    [mutate],
  );

  const updateBudget = useCallback(
    async (id: string, payload: Partial<BudgetPayload>) => {
      await apiFetch<{ message: string; data: Budget }>(`/api/budgets/${id}`, {
        method: "PATCH",
        body: payload,
      });
      await mutate();
    },
    [mutate],
  );

  const deleteBudget = useCallback(
    async (id: string) => {
      await apiFetch<{ message: string }>(`/api/budgets/${id}`, {
        method: "DELETE",
      });
      await mutate();
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

