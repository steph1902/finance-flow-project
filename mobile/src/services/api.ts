/**
 * API Service
 * Axios instance with interceptors for auth and error handling
 */

import axios, {
    type AxiosInstance,
    type AxiosError,
    type InternalAxiosRequestConfig,
} from 'axios';
import { env } from '@/config/env';
import { authService } from './auth';
import { normalizeError } from '@/utils/errorHandler';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
    baseURL: env.apiUrl,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
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
            console.error('Error getting access token:', error);
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
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
    }
);

// ============================================================================
// API Methods
// In a real app, these would make actual API calls
// For demo, they use mock data
// ============================================================================

import { mockTransactionData, mockFinancialData } from './mockData';
import type { Transaction, FinancialSummary, CreateTransactionPayload } from '@/types';

// Simulate network delay
const delay = (ms: number = 500): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));

export const financeApi = {
    async getFinancialSummary(): Promise<FinancialSummary> {
        await delay();
        return mockFinancialData.getSummary();
    },

    async getTransactions(): Promise<Transaction[]> {
        await delay();
        return mockTransactionData.getTransactions();
    },

    async addTransaction(payload: CreateTransactionPayload): Promise<Transaction> {
        await delay();
        return mockTransactionData.addTransaction({
            ...payload,
            date: payload.date,
        });
    },
};

export default api;
