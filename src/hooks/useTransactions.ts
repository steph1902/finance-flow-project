"use client";

import useSWR from "swr";
import { useCallback } from "react";
import { toast } from "sonner";

import { apiFetch, buildQueryString } from "@/lib/api-client";
import { logError } from "@/lib/logger";
import type {
  PaginatedResponse,
  Transaction,
  TransactionFilters,
  TransactionType,
} from "@/types";

type TransactionPayload = {
  amount: number;
  type: TransactionType;
  category: string;
  description?: string | null;
  notes?: string | null;
  date: Date | string;
};

type UseTransactionsOptions = {
  filters?: TransactionFilters;
};

const fetcher = (url: string) => apiFetch<PaginatedResponse<Transaction>>(url);

export function useTransactions(options: UseTransactionsOptions = {}) {
  const { filters = {} } = options;

  const queryString = buildQueryString({
    page: filters.page,
    limit: filters.limit,
    category: filters.category,
    startDate: filters.startDate,
    endDate: filters.endDate,
    search: filters.search,
    sort: filters.sort,
    order: filters.order,
    type: filters.type && filters.type !== "ALL" ? filters.type : undefined,
  });

  const { data, error, isLoading, mutate } = useSWR(`/api/v1/transactions${queryString}`, fetcher);

  const createTransaction = useCallback(
    async (payload: TransactionPayload) => {
      try {
        await mutate(
          async (currentData) => {
            await apiFetch<{ message: string; data: Transaction }>(
              "/api/v1/transactions",
              {
                method: "POST",
                body: {
                  ...payload,
                  date: payload.date instanceof Date ? payload.date.toISOString() : payload.date,
                },
              }
            );

            // Return updated data after API success
            // Server will return fresh data on revalidation
            return currentData;
          },
          {
            optimisticData: (currentData) => {
              if (!currentData) {
                // Return empty response structure instead of undefined
                return {
                  data: [],
                  meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
                };
              }

              // Create optimistic transaction with temporary ID
              const optimisticTransaction: Transaction = {
                id: `temp-${Date.now()}`,
                amount: payload.amount,
                type: payload.type,
                category: payload.category,
                description: payload.description ?? null,
                notes: payload.notes ?? null,
                date: payload.date instanceof Date ? payload.date.toISOString() : payload.date,
                userId: "", // Will be set by server
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };

              return {
                ...currentData,
                data: [optimisticTransaction, ...currentData.data],
                meta: {
                  ...currentData.meta,
                  total: currentData.meta.total + 1,
                },
              };
            },
            rollbackOnError: true,
            revalidate: true, // Revalidate to get real data from server
          }
        );
        toast.success("Transaction created successfully");
      } catch (err) {
        logError("Create transaction error", err);
        toast.error(err instanceof Error ? err.message : "Failed to create transaction");
        throw err;
      }
    },
    [mutate],
  );

  const updateTransaction = useCallback(
    async (id: string, payload: Partial<TransactionPayload>) => {
      try {
        await mutate(
          async (currentData) => {
            await apiFetch<{ message: string; data: Transaction }>(
              `/api/v1/transactions/${id}`,
              {
                method: "PATCH",
                body: {
                  ...payload,
                  date:
                    payload.date instanceof Date
                      ? payload.date.toISOString()
                      : payload.date,
                },
              }
            );

            // Return updated data after API success
            if (!currentData) {
              return {
                data: [],
                meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
              };
            }

            return {
              ...currentData,
              data: currentData.data.map((txn) =>
                txn.id === id
                  ? {
                    ...txn,
                    ...payload,
                    date: payload.date
                      ? payload.date instanceof Date
                        ? payload.date.toISOString()
                        : payload.date
                      : txn.date,
                    updatedAt: new Date().toISOString(),
                  }
                  : txn
              ),
            };
          },
          {
            optimisticData: (currentData) => {
              if (!currentData) {
                return {
                  data: [],
                  meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
                };
              }

              return {
                ...currentData,
                data: currentData.data.map((txn) =>
                  txn.id === id
                    ? {
                      ...txn,
                      ...payload,
                      date: payload.date
                        ? payload.date instanceof Date
                          ? payload.date.toISOString()
                          : payload.date
                        : txn.date,
                      updatedAt: new Date().toISOString(),
                    }
                    : txn
                ),
              };
            },
            rollbackOnError: true,
            revalidate: false,
          }
        );
        toast.success("Transaction updated successfully");
      } catch (err) {
        logError("Update transaction error", err, { id });
        toast.error(err instanceof Error ? err.message : "Failed to update transaction");
        throw err;
      }
    },
    [mutate],
  );

  const deleteTransaction = useCallback(
    async (id: string) => {
      try {
        await mutate(
          async (currentData) => {
            await apiFetch<{ message: string }>(`/api/v1/transactions/${id}`, {
              method: "DELETE",
            });

            // Return updated data after API success
            if (!currentData) return currentData;

            return {
              ...currentData,
              data: currentData.data.filter((txn) => txn.id !== id),
              meta: {
                ...currentData.meta,
                total: currentData.meta.total - 1,
              },
            };
          },
          {
            optimisticData: (currentData) => {
              if (!currentData) {
                return {
                  data: [],
                  meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
                };
              }

              return {
                ...currentData,
                data: currentData.data.filter((txn) => txn.id !== id),
                meta: {
                  ...currentData.meta,
                  total: currentData.meta.total - 1,
                },
              };
            },
            rollbackOnError: true,
            revalidate: false,
          }
        );
        toast.success("Transaction deleted successfully");
      } catch (err) {
        logError("Delete transaction error", err, { id });
        toast.error(err instanceof Error ? err.message : "Failed to delete transaction");
        throw err;
      }
    },
    [mutate],
  );

  return {
    transactions: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    isError: Boolean(error),
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    refresh: mutate,
  };
}

