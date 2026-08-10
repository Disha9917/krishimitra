export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  errorCode?: string;
}

export type ApiErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "RATE_LIMITED"
  | "SERVER_ERROR"
  | "NETWORK_ERROR"
  | string;

export interface ValidationErrors {
  [field: string]: string[];
}

export interface ApiError {
  message: string;
  statusCode: number;
  code?: ApiErrorCode | null;
  details?: Record<string, unknown> | null;
  errors?: ValidationErrors;
}

/** Laravel `LengthAwarePaginator` JSON shape (used by all paginated endpoints). */
export interface PaginatedData<T> {
  current_page: number;
  data: T[];
  first_page_url: string | null;
  from: number | null;
  last_page: number;
  last_page_url: string | null;
  links: Array<{ url: string | null; label: string; active: boolean }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}
