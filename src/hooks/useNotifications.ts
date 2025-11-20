/**
 * Custom hook for managing notifications
 * Uses SWR for data fetching with automatic revalidation
 */

import useSWR from 'swr';
import { useState } from 'react';

interface Notification {
  id: string;
  type: 'BUDGET_ALERT' | 'BILL_REMINDER' | 'GOAL_MILESTONE' | 'GOAL_ACHIEVED' | 'SHARED_BUDGET_INVITE' | 'SYSTEM_ANNOUNCEMENT';
  title: string;
  message: string;
  priority: number;
  read: boolean;
  actionUrl: string | null;
  createdAt: Date;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useNotifications(unreadOnly = false) {
  const url = unreadOnly ? '/api/notifications?unreadOnly=true' : '/api/notifications';
  const { data, error, mutate } = useSWR(url, fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  });

  const { data: countData, mutate: mutateCount } = useSWR('/api/notifications/unread-count', fetcher, {
    refreshInterval: 30000,
  });

  const [isMarking, setIsMarking] = useState(false);

  /**
   * Mark a notification as read
   */
  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to mark as read');
      }

      // Revalidate data
      mutate();
      mutateCount();
    } catch (error) {
      console.error('Failed to mark as read:', error);
      throw error;
    }
  };

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = async () => {
    setIsMarking(true);
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to mark all as read');
      }

      // Revalidate data
      mutate();
      mutateCount();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      throw error;
    } finally {
      setIsMarking(false);
    }
  };

  /**
   * Delete a notification
   */
  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete notification');
      }

      // Revalidate data
      mutate();
      mutateCount();
    } catch (error) {
      console.error('Failed to delete notification:', error);
      throw error;
    }
  };

  return {
    notifications: data?.notifications || [],
    unreadCount: countData?.count || 0,
    loading: !error && !data,
    error,
    isMarking,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh: mutate,
  };
}
