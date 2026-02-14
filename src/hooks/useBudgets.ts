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
  data: Array<
    Budget & { spent?: number; remaining?: number; progress?: number }
  >;
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
  const { data, error, isLoading, mutate } = useSWR(
    `/api/budgets${queryString}`,
    fetcher,
  );

  const createBudget = useCallback(
    async (payload: BudgetPayload) => {
      try {
        await mutate(
          async (currentData) => {
            await apiFetch<{ message: string; data: Budget }>("/api/budgets", {
              method: "POST",
              body: payload,
            });

            // Return current data, will revalidate to get fresh data with spent/remaining
            return currentData;
          },
          {
            optimisticData: (currentData) => {
              if (!currentData) {
                return {
                  data: [],
                  period: {
                    month: payload.month,
                    year: payload.year,
                    start: "",
                    end: "",
                  },
                };
              }

              // Create optimistic budget
              const optimisticBudget: Budget & {
                spent?: number;
                remaining?: number;
                progress?: number;
              } = {
                id: `temp-${Date.now()}`,
                userId: "",
                category: payload.category,
                amount: payload.amount,
                month: payload.month,
                year: payload.year,
                spent: 0,
                remaining: payload.amount,
                progress: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };

              return {
                ...currentData,
                data: [...currentData.data, optimisticBudget],
              };
            },
            rollbackOnError: true,
            revalidate: true, // Revalidate to get accurate spent/remaining from server
          },
        );
        toast.success("Budget created successfully");
      } catch (err) {
        logError("Create budget error", err);
        toast.error(
          err instanceof Error ? err.message : "Failed to create budget",
        );
        throw err;
      }
    },
    [mutate],
  );

  const updateBudget = useCallback(
    async (id: string, payload: Partial<BudgetPayload>) => {
      try {
        await mutate(
          async (currentData) => {
            await apiFetch<{ message: string; data: Budget }>(
              `/api/budgets/${id}`,
              {
                method: "PATCH",
                body: payload,
              },
            );

            // Return updated data
            if (!currentData) {
              return {
                data: [],
                period: { month: 1, year: 2024, start: "", end: "" },
              };
            }

            return {
              ...currentData,
              data: currentData.data.map((budget) =>
                budget.id === id
                  ? {
                      ...budget,
                      ...payload,
                      // Recalculate remaining if amount changed
                      ...(payload.amount && budget.spent !== undefined
                        ? {
                            remaining: payload.amount - budget.spent,
                            progress: (budget.spent / payload.amount) * 100,
                          }
                        : {}),
                      updatedAt: new Date().toISOString(),
                    }
                  : budget,
              ),
            };
          },
          {
            optimisticData: (currentData) => {
              if (!currentData) {
                return {
                  data: [],
                  period: { month: 1, year: 2024, start: "", end: "" },
                };
              }

              return {
                ...currentData,
                data: currentData.data.map((budget) =>
                  budget.id === id
                    ? {
                        ...budget,
                        ...payload,
                        // Recalculate remaining if amount changed
                        ...(payload.amount && budget.spent !== undefined
                          ? {
                              remaining: payload.amount - budget.spent,
                              progress: (budget.spent / payload.amount) * 100,
                            }
                          : {}),
                        updatedAt: new Date().toISOString(),
                      }
                    : budget,
                ),
              };
            },
            rollbackOnError: true,
            revalidate: false,
          },
        );
        toast.success("Budget updated successfully");
      } catch (err) {
        logError("Update budget error", err, { id });
        toast.error(
          err instanceof Error ? err.message : "Failed to update budget",
        );
        throw err;
      }
    },
    [mutate],
  );

  const deleteBudget = useCallback(
    async (id: string) => {
      try {
        await mutate(
          async (currentData) => {
            await apiFetch<{ message: string }>(`/api/budgets/${id}`, {
              method: "DELETE",
            });

            // Return filtered data
            if (!currentData) {
              return {
                data: [],
                period: { month: 1, year: 2024, start: "", end: "" },
              };
            }

            return {
              ...currentData,
              data: currentData.data.filter((budget) => budget.id !== id),
            };
          },
          {
            optimisticData: (currentData) => {
              if (!currentData) {
                return {
                  data: [],
                  period: { month: 1, year: 2024, start: "", end: "" },
                };
              }

              return {
                ...currentData,
                data: currentData.data.filter((budget) => budget.id !== id),
              };
            },
            rollbackOnError: true,
            revalidate: false,
          },
        );
        toast.success("Budget deleted successfully");
      } catch (err) {
        logError("Delete budget error", err, { id });
        toast.error(
          err instanceof Error ? err.message : "Failed to delete budget",
        );
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
