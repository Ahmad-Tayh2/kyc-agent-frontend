import type { FormattedApiError, ApiError } from "@/types/apiErrors";

export const formatError = (error: ApiError): FormattedApiError => {
  if (error?.response) {
    return {
      message: error?.response?.data?.message || "Something went wrong",
      status: error?.response?.status,
      error_type: error?.response?.data?.error_type,
      errors: error?.response?.data?.errors,
    };
  }
  return {
    message: "Unexpected error occurred",
  };
};
