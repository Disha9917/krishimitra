import { API_BASE_URL, API_ENDPOINTS } from "../constants/api";
import { tokenStore } from "../store/token.store";
import { ApiError, ApiErrorCode, PaginatedData } from "../types/api";
import { TokenPair } from "../types/auth";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface QueryParams {
  [key: string]: string | number | boolean | null | undefined;
}

export interface RequestOptions {
  query?: QueryParams;
  headers?: Record<string, string>;
  /** Send a raw FormData body (multipart). Content-Type is set automatically by the browser. */
  formData?: FormData;
  signal?: AbortSignal;
}

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  errorCode?: string | null;
}

export const UNAUTHORIZED_EVENT = "fasaldrishti:unauthorized";

const STATUS_MESSAGES: Record<number, string> = {
  401: "Your session has expired. Please log in again.",
  403: "You don't have permission to perform this action.",
  404: "The requested resource was not found.",
  422: "The submitted data is invalid.",
  429: "Too many requests. Please try again shortly.",
  500: "Something went wrong on our side. Please try again later.",
};

function codeForStatus(status: number): ApiErrorCode | null {
  switch (status) {
    case 401:
      return "UNAUTHORIZED";
    case 403:
      return "FORBIDDEN";
    case 404:
      return "NOT_FOUND";
    case 422:
      return "VALIDATION_ERROR";
    case 429:
      return "RATE_LIMITED";
    default:
      return status >= 500 ? "SERVER_ERROR" : null;
  }
}

function toApiError(status: number, body: unknown, fallback: string): ApiError {
  const details = body && typeof body === "object" ? (body as Record<string, unknown>) : {};

  return {
    message: typeof details.message === "string" ? details.message : STATUS_MESSAGES[status] ?? fallback,
    statusCode: status,
    code: typeof details.errorCode === "string" ? details.errorCode : codeForStatus(status),
    details: details as Record<string, unknown>,
    errors: details.errors as ApiError["errors"],
  };
}

function clearSessionAndNotify(): void {
  tokenStore.clear();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT));
  }
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = tokenStore.getRefreshToken();
  if (!refreshToken) return null;

  refreshPromise ??= (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      if (!response.ok) return null;
      const json = (await response.json().catch(() => null)) as ApiEnvelope<TokenPair> | null;
      const pair = json?.data;
      if (!pair?.access_token) return null;
      tokenStore.setTokens(pair.access_token, pair.refresh_token);
      return pair.access_token;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function doFetch(
  method: HttpMethod,
  endpoint: string,
  body: unknown,
  options?: RequestOptions,
  accessTokenOverride?: string
): Promise<Response> {
  const query = options?.query
    ? `?${new URLSearchParams(
        Object.entries(options.query)
          .filter(([, v]) => v !== undefined && v !== null)
          .map(([k, v]) => [k, String(v)])
      ).toString()}`
    : "";

  const url = `${API_BASE_URL}${endpoint}${query}`;

  const headers: Record<string, string> = { ...options?.headers };
  if (!options?.formData && body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const token = accessTokenOverride ?? tokenStore.getAccessToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(url, {
    method,
    headers,
    body: options?.formData ?? (body !== undefined ? JSON.stringify(body) : undefined),
    signal: options?.signal,
  });
}

async function request<T>(method: HttpMethod, endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
  let response: Response;
  try {
    response = await doFetch(method, endpoint, body, options);
  } catch (error) {
    throw {
      message: "Unable to reach the server. Please check your connection and try again.",
      statusCode: 0,
      code: "NETWORK_ERROR",
      details: error instanceof Error ? { cause: error.message } : null,
    } satisfies ApiError;
  }

  // One transparent retry using a refreshed access token when possible.
  if (response.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      response = await doFetch(method, endpoint, body, options, newToken);
      if (response.status === 401) {
        clearSessionAndNotify();
      }
    } else {
      clearSessionAndNotify();
    }
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  const raw: unknown = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : await response.text().catch(() => null);

  if (!response.ok) {
    throw toApiError(response.status, raw, `Request failed with status ${response.status}.`);
  }

  if (raw && typeof raw === "object" && "success" in raw && "data" in raw) {
    return (raw as ApiEnvelope<T>).data;
  }

  return raw as T;
}

export const apiClient = {
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return request<T>("GET", endpoint, undefined, options);
  },
  async post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>("POST", endpoint, body, options);
  },
  async put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>("PUT", endpoint, body, options);
  },
  async patch<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>("PATCH", endpoint, body, options);
  },
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return request<T>("DELETE", endpoint, undefined, options);
  },
};

export function isApiError(error: unknown): error is ApiError {
  return (
    !!error &&
    typeof error === "object" &&
    "statusCode" in error &&
    "message" in error &&
    (error as ApiError).statusCode !== undefined
  );
}

export type { ApiError, PaginatedData };
