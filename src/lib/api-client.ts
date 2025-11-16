type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: Record<string, unknown> | unknown;
  timeout?: number; // Timeout in milliseconds (default: 30000)
};

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");
  const isJSON = contentType?.includes("application/json");
  const payload = isJSON ? await response.json() : await response.text();

  if (!response.ok) {
    const errorMessage = isJSON ? payload?.error ?? "Request failed" : String(payload);
    throw new Error(errorMessage);
  }

  return payload as T;
}

export async function apiFetch<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  // Setup timeout with AbortController
  const timeout = options.timeout ?? 30000; // Default 30 seconds
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    // Prepare body as string or undefined
    const bodyString = options.body ? JSON.stringify(options.body) : undefined;
    
    // Extract custom options and prepare fetch options
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { timeout: _timeout, body: _body, ...restOptions } = options;
    
    // Build fetch options, only including body if it exists
    const fetchInit: RequestInit = {
      ...restOptions,
      headers,
      signal: controller.signal,
    };
    
    if (bodyString) {
      fetchInit.body = bodyString;
    }
    
    const response = await fetch(url, fetchInit);

    clearTimeout(timeoutId);
    return parseResponse<T>(response);
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Handle abort errors
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    
    throw error;
  }
}

export function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, String(item)));
      return;
    }

    searchParams.set(key, String(value));
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

