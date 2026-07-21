export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  errorCode?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  details?: Record<string, any>;
}