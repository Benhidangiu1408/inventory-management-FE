import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type FetchOptions = RequestInit & {
  headers?: Record<string, string>;
};

class ApiError extends Error {
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

  const config: RequestInit = {
    ...options,
    headers: {
      // Set default headers (like JSON)
      "Content-Type": "application/json",
      ...options.headers,
    } as Record<string, string>,
  };

  const token = (await cookies()).get("jwt")?.value;
  if (token) {
    (config.headers as Record<string, string>)["Authorization"] =
      `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    // 2. Handle HTTP Errors (400, 500)
    if (!response.ok) {
      let errorMessage = `API Error: ${response.status}`;

      // Read the stream exactly ONCE and store it as a plain string
      const rawText = await response.text();

      if (rawText) {
        try {
          // Safely try to parse that string into a JSON object
          const data = JSON.parse(rawText);
          errorMessage = data.message || data.error || rawText;
        } catch {
          // If JSON.parse fails, it means the server sent plain text or HTML
          errorMessage = rawText;
        }
      } else {
        // If the server sent absolutely nothing in the body
        errorMessage = response.statusText;
      }

      throw new ApiError(response.status, errorMessage);
    }

    // Handle Successful Responses
    if (response.status === 204) return {} as T;
    const text = await response.text();
    // If text is empty, return an empty object (or null) instead of crashing
    if (!text) return {} as T;

    return JSON.parse(text);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  delete: <T>(url: string, body: unknown, options?: FetchOptions) =>
    fetcher<T>(url, {
      method: "DELETE",
      body: JSON.stringify(body),
      ...options,
    }),
};
