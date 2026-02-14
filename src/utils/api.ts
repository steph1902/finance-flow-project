/**
 * API Client Utility - Centralized API calls with versioning
 */

const API_BASE = "/api/v1";

export async function apiRequest<T = unknown>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const url = endpoint.startsWith("/")
    ? `${API_BASE}${endpoint}`
    : `${API_BASE}/${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    // Try to parse error message
    let errorMessage = `HTTP ${response.status}`;
    try {
      const error = (await response.json()) as {
        message?: string;
        error?: string;
      };
      errorMessage = error.message || error.error || errorMessage;
    } catch {
      errorMessage = `${response.status} ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

/**
 * Get full API URL with versioning
 */
export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${cleanPath}`;
}
