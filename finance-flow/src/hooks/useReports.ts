"use client"

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export interface Report {
  id: string;
  userId: string;
  name: string;
  type: 'MONTHLY' | 'YEARLY' | 'CATEGORY' | 'TAX' | 'CUSTOM';
  startDate: string;
  endDate: string;
  data: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

interface ReportsResponse {
  reports: Report[];
}

export function useReports(limit = 20, offset = 0) {
  const { data, error, isLoading, mutate } = useSWR<ReportsResponse>(
    `/api/reports?limit=${limit}&offset=${offset}`,
    fetcher
  );

  return {
    reports: data?.reports || [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function useReport(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<{ report: Report }>(
    id ? `/api/reports/${id}` : null,
    fetcher
  );

  return {
    report: data?.report,
    isLoading,
    isError: error,
    mutate,
  };
}

export async function createReport(
  name: string,
  type: Report['type'],
  startDate: Date,
  endDate: Date,
  filters?: Record<string, unknown>
): Promise<Report> {
  const response = await fetch('/api/reports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      type,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      filters,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create report');
  }

  const { report } = await response.json();
  return report;
}

export async function deleteReport(id: string): Promise<void> {
  const response = await fetch(`/api/reports/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete report');
  }
}

export function downloadReport(id: string, format: 'csv' | 'json' = 'csv') {
  window.open(`/api/reports/${id}/download?format=${format}`, '_blank');
}
