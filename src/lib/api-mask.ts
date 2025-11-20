const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type FetchOptions = RequestInit & {
  headers?: Record<string, string>;
};

async function fetcher<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  // 1. Handle the Base URL automatically
  const url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const config = {
    ...options,
    headers: {
      // 2. Set default headers (like JSON)
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  // 3. Handle Errors (Axios does this, Fetch doesn't by default)
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `API Error: ${response.status} - ${errorBody || response.statusText}`,
    );
  }

  // 4. Handle empty responses (like DELETE requests)
  if (response.status === 204) {
    return {} as T;
  }

  // 5. Automatically parse JSON
  return response.json();
}

// Export cleaner functions to use in your services
export const apiClient = {
  get: <T>(url: string, options?: FetchOptions) =>
    fetcher<T>(url, { method: "GET", ...options }),

  post: <T>(url: string, body: unknown, options?: FetchOptions) =>
    fetcher<T>(url, { method: "POST", body: JSON.stringify(body), ...options }),

  put: <T>(url: string, body: unknown, options?: FetchOptions) =>
    fetcher<T>(url, { method: "PUT", body: JSON.stringify(body), ...options }),

  delete: <T>(url: string, options?: FetchOptions) =>
    fetcher<T>(url, { method: "DELETE", ...options }),
};
