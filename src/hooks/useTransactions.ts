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

  const { data, error, isLoading, mutate } = useSWR(`/api/transactions${queryString}`, fetcher);

  const createTransaction = useCallback(
    async (payload: TransactionPayload) => {
      try {
        await apiFetch<{ message: string; data: Transaction }>("/api/transactions", {
          method: "POST",
          body: {
            ...payload,
            date: payload.date instanceof Date ? payload.date.toISOString() : payload.date,
          },
        });
        await mutate();
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
        await apiFetch<{ message: string; data: Transaction }>(`/api/transactions/${id}`, {
          method: "PATCH",
          body: {
            ...payload,
            date:
              payload.date instanceof Date
                ? payload.date.toISOString()
                : payload.date,
          },
        });
        await mutate();
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
        await apiFetch<{ message: string }>(`/api/transactions/${id}`, {
          method: "DELETE",
        });
        await mutate();
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

