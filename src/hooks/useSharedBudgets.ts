"use client"

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export interface SharedBudgetMember {
  id: string;
  userId: string;
  sharedBudgetId: string;
  role: 'OWNER' | 'EDITOR' | 'VIEWER';
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  joinedAt: string;
}

export interface SharedBudget {
  id: string;
  name: string;
  category: string;
  limit: number;
  period: 'MONTHLY' | 'YEARLY';
  ownerId: string;
  owner: {
    id: string;
    name: string | null;
    email: string;
  };
  members: SharedBudgetMember[];
  _count?: {
    members: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface SharedBudgetsResponse {
  sharedBudgets: SharedBudget[];
}

export function useSharedBudgets() {
  const { data, error, isLoading, mutate } = useSWR<SharedBudgetsResponse>(
    '/api/shared-budgets',
    fetcher
  );

  return {
    sharedBudgets: data?.sharedBudgets || [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function useSharedBudget(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<{ sharedBudget: SharedBudget }>(
    id ? `/api/shared-budgets/${id}` : null,
    fetcher
  );

  return {
    sharedBudget: data?.sharedBudget,
    isLoading,
    isError: error,
    mutate,
  };
}

export async function createSharedBudget(
  name: string,
  category: string,
  limit: number,
  period: 'MONTHLY' | 'YEARLY'
): Promise<SharedBudget> {
  const response = await fetch('/api/shared-budgets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, category, limit, period }),
  });

  if (!response.ok) {
    throw new Error('Failed to create shared budget');
  }

  const { sharedBudget } = await response.json();
  return sharedBudget;
}

export async function updateSharedBudget(
  id: string,
  updates: Partial<Pick<SharedBudget, 'name' | 'category' | 'limit' | 'period'>>
): Promise<SharedBudget> {
  const response = await fetch(`/api/shared-budgets/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error('Failed to update shared budget');
  }

  const { sharedBudget } = await response.json();
  return sharedBudget;
}

export async function deleteSharedBudget(id: string): Promise<void> {
  const response = await fetch(`/api/shared-budgets/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete shared budget');
  }
}

export async function inviteToSharedBudget(
  budgetId: string,
  email: string,
  role: 'EDITOR' | 'VIEWER'
): Promise<SharedBudgetMember> {
  const response = await fetch(`/api/shared-budgets/${budgetId}/invite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, role }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to invite user');
  }

  const { member } = await response.json();
  return member;
}

export async function leaveSharedBudget(budgetId: string): Promise<void> {
  const response = await fetch(`/api/shared-budgets/${budgetId}/leave`, {
    method: 'POST',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to leave budget');
  }
}

export async function updateMemberPermissions(
  budgetId: string,
  memberId: string,
  role: 'OWNER' | 'EDITOR' | 'VIEWER'
): Promise<SharedBudgetMember> {
  const response = await fetch(`/api/shared-budgets/${budgetId}/permissions`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ memberId, role }),
  });

  if (!response.ok) {
    throw new Error('Failed to update permissions');
  }

  const { member } = await response.json();
  return member;
}
