/**
 * API Service
 * Axios instance with interceptors for auth and error handling
 */

import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { env } from "@/config/env";
import { authService } from "./auth";
import { normalizeError } from "@/utils/errorHandler";
import type {
  Transaction,
  FinancialSummary,
  CreateTransactionPayload,
} from "@/types";

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: env.apiUrl,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ============================================================================
// Request Interceptor - Add auth token to requests
// ============================================================================

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await authService.getAccessToken();

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting access token:", error);
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// ============================================================================
// Response Interceptor - Handle errors globally
// ============================================================================

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && originalRequest) {
      // In production, you would attempt token refresh here
      // For now, just logout
      await authService.logout();
    }

    // Normalize error for consistent handling
    const normalizedError = normalizeError(error);

    return Promise.reject(normalizedError);
  },
);

// ============================================================================
// API Methods - Real Backend Integration
// ============================================================================

export const financeApi = {
  async getFinancialSummary(): Promise<FinancialSummary> {
    const response = await api.get<{ summary: FinancialSummary }>(
      "/dashboard/stats",
    );
    return response.data.summary;
  },

  async getTransactions(): Promise<Transaction[]> {
    const response = await api.get<{ transactions: Transaction[] }>(
      "/transactions",
    );
    return response.data.transactions;
  },

  async addTransaction(
    payload: CreateTransactionPayload,
  ): Promise<Transaction> {
    const response = await api.post<{ transaction: Transaction }>(
      "/transactions",
      {
        ...payload,
        date:
          payload.date instanceof Date
            ? payload.date.toISOString()
            : payload.date,
      },
    );
    return response.data.transaction;
  },

  async deleteTransaction(id: string): Promise<void> {
    await api.delete(`/transactions/${id}`);
  },

  async updateTransaction(
    id: string,
    payload: Partial<CreateTransactionPayload>,
  ): Promise<Transaction> {
    const response = await api.patch<{ transaction: Transaction }>(
      `/transactions/${id}`,
      payload,
    );
    return response.data.transaction;
  },
};

export default api;
