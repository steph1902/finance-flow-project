/**
 * Custom hook for managing goals
 * Uses SWR for data fetching with automatic revalidation
 */

import useSWR from 'swr';
import { useState } from 'react';

export interface Goal {
  id: string;
  name: string;
  description: string | null;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date | null;
  category: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'PAUSED';
  priority: number;
  createdAt: Date;
}

export interface CreateGoalData {
  name: string;
  description?: string;
  targetAmount: number;
  targetDate?: string;
  category?: string;
  priority?: number;
  status?: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'PAUSED';
}

interface AddContributionData {
  amount: number;
  notes?: string | null;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useGoals(status?: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'PAUSED') {
  const url = status ? `/api/goals?status=${status}` : '/api/goals';
  const { data, error, mutate } = useSWR(url, fetcher);

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  /**
   * Create a new goal
   */
  const createGoal = async (goalData: CreateGoalData) => {
    setIsCreating(true);
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goalData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create goal');
      }

      const { goal } = await response.json();

      // Optimistically update the UI
      mutate();

      return goal;
    } catch (error) {
      console.error('Failed to create goal:', error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  /**
   * Update a goal
   */
  const updateGoal = async (goalId: string, updates: Partial<CreateGoalData>) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update goal');
      }

      // Revalidate data
      mutate();
    } catch (error) {
      console.error('Failed to update goal:', error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Delete a goal
   */
  const deleteGoal = async (goalId: string) => {
    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete goal');
      }

      // Optimistically update the UI
      mutate();
    } catch (error) {
      console.error('Failed to delete goal:', error);
      throw error;
    }
  };

  /**
   * Add contribution to a goal
   */
  const addContribution = async (goalId: string, contributionData: AddContributionData) => {
    try {
      const response = await fetch(`/api/goals/${goalId}/contributions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contributionData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add contribution');
      }

      const { contribution } = await response.json();

      // Revalidate data
      mutate();

      return contribution;
    } catch (error) {
      console.error('Failed to add contribution:', error);
      throw error;
    }
  };

  return {
    goals: data?.goals || [],
    loading: !error && !data,
    error,
    isCreating,
    isUpdating,
    createGoal,
    updateGoal,
    deleteGoal,
    addContribution,
    refresh: mutate,
  };
}
