"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Usage {
  transactions: number;
  aiRequests: number;
  goals: number;
  budgets: number;
  sharedBudgets: number;
  reports: number;
}

export function useUsage() {
  const { data, error, isLoading } = useSWR<Usage>(
    "/api/stripe/usage",
    fetcher,
  );

  return {
    usage: data,
    isLoading,
    isError: error,
  };
}
