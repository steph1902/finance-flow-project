type RequestOptions = RequestInit & {
  body?: any;
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

  const response = await fetch(url, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  return parseResponse<T>(response);
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

