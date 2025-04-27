"use client";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
const EXTERNAL_API_URL = process.env.NEXT_PUBLIC_EXTERNAL_API_URL || "";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type ApiSource = "local" | "external";

interface FetchOptions<TData = unknown> extends RequestInit {
  method?: RequestMethod;
  data?: TData;
  source?: ApiSource;
}

/**
 * Wrapper around fetch for making API requests
 */
export async function apiClient<TResponse, TData = unknown>(
  endpoint: string,
  options: FetchOptions<TData> = {},
): Promise<TResponse> {
  const { method = "GET", data, source = "local", ...customConfig } = options;

  // Choose base URL based on source
  const baseUrl = source === "local" ? API_BASE_URL : EXTERNAL_API_URL;

  // Ensure the API URL always has a leading slash for local APIs
  const url =
    source === "local"
      ? `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`
      : `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...customConfig.headers,
    },
    ...customConfig,
  };

  // Add request body if data is provided
  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return Promise.reject(
        new Error(
          errorData.message ||
            `API error: ${response.status} ${response.statusText}`,
        ),
      );
    }

    // For responses with no content
    if (response.status === 204) {
      return {} as TResponse;
    }

    // Parse JSON response
    return await response.json();
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * API client methods for local Next.js API routes
 */
export const api = {
  get: <TResponse>(
    endpoint: string,
    options?: Omit<FetchOptions, "method" | "data">,
  ) =>
    apiClient<TResponse>(endpoint, {
      ...options,
      method: "GET",
      source: "local",
    }),

  post: <TResponse, TData = unknown>(
    endpoint: string,
    data: TData,
    options?: Omit<FetchOptions<TData>, "method" | "data">,
  ) =>
    apiClient<TResponse, TData>(endpoint, {
      ...options,
      method: "POST",
      data,
      source: "local",
    }),

  put: <TResponse, TData = unknown>(
    endpoint: string,
    data: TData,
    options?: Omit<FetchOptions<TData>, "method" | "data">,
  ) =>
    apiClient<TResponse, TData>(endpoint, {
      ...options,
      method: "PUT",
      data,
      source: "local",
    }),

  patch: <TResponse, TData = unknown>(
    endpoint: string,
    data: TData,
    options?: Omit<FetchOptions<TData>, "method" | "data">,
  ) =>
    apiClient<TResponse, TData>(endpoint, {
      ...options,
      method: "PATCH",
      data,
      source: "local",
    }),

  delete: <TResponse>(
    endpoint: string,
    options?: Omit<FetchOptions, "method">,
  ) =>
    apiClient<TResponse>(endpoint, {
      ...options,
      method: "DELETE",
      source: "local",
    }),
};

/**
 * API client methods for external backend
 */
export const externalApi = {
  get: <TResponse>(
    endpoint: string,
    options?: Omit<FetchOptions, "method" | "data">,
  ) =>
    apiClient<TResponse>(endpoint, {
      ...options,
      method: "GET",
      source: "external",
    }),

  post: <TResponse, TData = unknown>(
    endpoint: string,
    data: TData,
    options?: Omit<FetchOptions<TData>, "method" | "data">,
  ) =>
    apiClient<TResponse, TData>(endpoint, {
      ...options,
      method: "POST",
      data,
      source: "external",
    }),

  put: <TResponse, TData = unknown>(
    endpoint: string,
    data: TData,
    options?: Omit<FetchOptions<TData>, "method" | "data">,
  ) =>
    apiClient<TResponse, TData>(endpoint, {
      ...options,
      method: "PUT",
      data,
      source: "external",
    }),

  patch: <TResponse, TData = unknown>(
    endpoint: string,
    data: TData,
    options?: Omit<FetchOptions<TData>, "method" | "data">,
  ) =>
    apiClient<TResponse, TData>(endpoint, {
      ...options,
      method: "PATCH",
      data,
      source: "external",
    }),

  delete: <TResponse>(
    endpoint: string,
    options?: Omit<FetchOptions, "method">,
  ) =>
    apiClient<TResponse>(endpoint, {
      ...options,
      method: "DELETE",
      source: "external",
    }),
};
