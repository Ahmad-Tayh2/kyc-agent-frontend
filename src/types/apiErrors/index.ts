export interface ApiError {
  response?: {
    status?: number;
    message?: string;
    data?: any;
    errors?: any;
  };
}

export interface FormattedApiError {
  message: string;
  status?: number;
  error_type?: string;
  errors?: any;
}
