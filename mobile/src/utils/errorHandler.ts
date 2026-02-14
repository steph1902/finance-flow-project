/**
 * Error Handler Utilities
 * Centralized error normalization and user-friendly messages
 */

import { AxiosError } from "axios";

export interface NormalizedError {
  message: string;
  code?: string;
  isNetworkError: boolean;
  isServerError: boolean;
  isValidationError: boolean;
  originalError: unknown;
}

/**
 * Normalize any error into a consistent format
 */
export function normalizeError(error: unknown): NormalizedError {
  // Handle Axios errors
  if (error instanceof AxiosError) {
    return normalizeAxiosError(error);
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return {
      message: error.message,
      code: undefined,
      isNetworkError: false,
      isServerError: false,
      isValidationError: false,
      originalError: error,
    };
  }

  // Handle string errors
  if (typeof error === "string") {
    return {
      message: error,
      code: undefined,
      isNetworkError: false,
      isServerError: false,
      isValidationError: false,
      originalError: error,
    };
  }

  // Unknown error type
  return {
    message: "An unexpected error occurred",
    code: "UNKNOWN_ERROR",
    isNetworkError: false,
    isServerError: false,
    isValidationError: false,
    originalError: error,
  };
}

/**
 * Normalize Axios errors with specific handling
 */
function normalizeAxiosError(error: AxiosError): NormalizedError {
  const response = error.response;

  // Network error (no response)
  if (!response) {
    if (error.code === "ECONNABORTED") {
      return {
        message:
          "Request timed out. Please check your connection and try again.",
        code: "TIMEOUT",
        isNetworkError: true,
        isServerError: false,
        isValidationError: false,
        originalError: error,
      };
    }

    return {
      message: "Unable to connect. Please check your internet connection.",
      code: "NETWORK_ERROR",
      isNetworkError: true,
      isServerError: false,
      isValidationError: false,
      originalError: error,
    };
  }

  const status = response.status;
  const data = response.data as Record<string, unknown> | undefined;

  // Validation error (400)
  if (status === 400) {
    return {
      message:
        (data?.message as string) || "Please check your input and try again.",
      code: "VALIDATION_ERROR",
      isNetworkError: false,
      isServerError: false,
      isValidationError: true,
      originalError: error,
    };
  }

  // Unauthorized (401)
  if (status === 401) {
    return {
      message: "Your session has expired. Please log in again.",
      code: "UNAUTHORIZED",
      isNetworkError: false,
      isServerError: false,
      isValidationError: false,
      originalError: error,
    };
  }

  // Forbidden (403)
  if (status === 403) {
    return {
      message: "You do not have permission to perform this action.",
      code: "FORBIDDEN",
      isNetworkError: false,
      isServerError: false,
      isValidationError: false,
      originalError: error,
    };
  }

  // Not found (404)
  if (status === 404) {
    return {
      message: "The requested resource was not found.",
      code: "NOT_FOUND",
      isNetworkError: false,
      isServerError: false,
      isValidationError: false,
      originalError: error,
    };
  }

  // Server error (5xx)
  if (status >= 500) {
    return {
      message: "Something went wrong on our end. Please try again later.",
      code: "SERVER_ERROR",
      isNetworkError: false,
      isServerError: true,
      isValidationError: false,
      originalError: error,
    };
  }

  // Other errors
  return {
    message:
      (data?.message as string) || "An error occurred. Please try again.",
    code: `HTTP_${status}`,
    isNetworkError: false,
    isServerError: false,
    isValidationError: false,
    originalError: error,
  };
}

/**
 * Get a user-friendly message for any error
 */
export function getErrorMessage(error: unknown): string {
  const normalized = normalizeError(error);
  return normalized.message;
}
