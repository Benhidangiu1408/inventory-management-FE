// noinspection ExceptionCaughtLocallyJS

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type FetchOptions = RequestInit & {
  headers?: Record<string, string>;
};

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function fetcher<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  // Handle the Base URL
  const url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const config = {
    ...options,
    headers: {
      // Set default headers (like JSON)
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  try {
    // 1. Attempt to connect
    const response = await fetch(url, config);
    // 2. Handle HTTP Errors (400, 500)
    if (!response.ok) {
      let errorMessage = `API Error: ${response.status}`;

      try {
        const data = await response.json();
        errorMessage = data.message || data.error || errorMessage;
      } catch {
        // Fallback to text if JSON parsing fails
        errorMessage = (await response.text()) || response.statusText;
      }

      throw new ApiError(response.status, errorMessage);
    }

    if (response.status === 204) return {} as T;
    const text = await response.text();
    // If text is empty, return an empty object (or null) instead of crashing
    if (!text) return {} as T;
    // Otherwise, parse the JSON
    return JSON.parse(text);
    /* eslint-disable  @typescript-eslint/no-explicit-any */
  } catch (error: any) {
    // 🚨 3. Handle Network Errors (ECONNREFUSED, Network Down)
    // If 'error' is already our custom ApiError, just re-throw it
    if (error instanceof ApiError) {
      throw error;
    }

    // Check for standard fetch failures
    if (error.name === "TypeError" && error.message === "fetch failed") {
      console.error(`Network Error calling ${url}:`, error.cause);
      // Throw a clean 503 Service Unavailable error
      throw new ApiError(
        503,
        "Unable to connect to the server. Is the backend running?",
      );
    }
    // Handle unknown errors
    console.error("Unknown API Error:", error);
    throw new ApiError(500, error.message || "An unexpected error occurred");
  }
}

// Export cleaner functions to use in your services
export const apiClient = {
  get: <T>(url: string, options?: FetchOptions) =>
    fetcher<T>(url, { method: "GET", ...options }),

  post: <T>(url: string, body: unknown, options?: FetchOptions) =>
    fetcher<T>(url, { method: "POST", body: JSON.stringify(body), ...options }),

  put: <T>(url: string, body: unknown, options?: FetchOptions) =>
    fetcher<T>(url, { method: "PUT", body: JSON.stringify(body), ...options }),

  patch: <T>(url: string, body: unknown, options?: FetchOptions) =>
    fetcher<T>(url, {
      method: "PATCH",
      body: JSON.stringify(body),
      ...options,
    }),

  delete: <T>(
    url: string,
    permissionIds: number[],
    p0: { headers: { Authorization: string }; cache: string },
    options?: FetchOptions,
  ) =>
    fetcher<T>(url, {
      method: "DELETE",
      body: JSON.stringify(permissionIds),
      ...options,
    }),
};
