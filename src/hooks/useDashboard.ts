"use client";

import useSWR from "swr";

import { apiFetch, buildQueryString } from "@/lib/api-client";
import type { DashboardStats } from "@/types";

type DashboardFilters = {
  startDate?: string;
  endDate?: string;
};

const fetcher = (url: string) => apiFetch<DashboardStats>(url);

export function useDashboard(filters: DashboardFilters = {}) {
  const queryString = buildQueryString(filters);
  const { data, error, isLoading, mutate } = useSWR(`/api/dashboard/stats${queryString}`, fetcher, {
    revalidateOnFocus: false,
  });

  return {
    data,
    isLoading,
    isError: Boolean(error),
    error,
    refresh: mutate,
  };
}

