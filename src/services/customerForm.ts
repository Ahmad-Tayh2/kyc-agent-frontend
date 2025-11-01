import { API_URLS } from "@/constants/api";
import type { CreateCustomerFormRequest } from "../types/customerForm/CreateCustomerFormRequest";
import type { CustomerForm } from "../types/customerForm/CustomerForm";
import type { CustomerFormValidationResponse } from "../types/customerForm/CustomerFormValidation";
import type { CustomerFormSubmissionRequest } from "../types/customerForm/CustomerFormSubmission";
import type { CustomerFormSubmissionResponse } from "../types/customerForm/CustomerFormSubmissionResponse";
import { handleApiResponse } from "@/lib/handleApiResponse";
import apiClient from "@/lib/axiosInstance";

function getHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json();

  // This covers even non-2xx responses
  return handleApiResponse<T>(json);
}

export const customerFormService = {
  async getCustomerForms(filters: string = ""): Promise<CustomerForm[]> {
    const url = filters
      ? `${API_URLS.customerForms.get()}?${filters}`
      : API_URLS.customerForms.get();

    // Log the URL for debugging
    console.log("Fetching customer forms with URL:", url);

    const res = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse<CustomerForm[]>(res);
  },

  async getCustomerFormById(id: string | number): Promise<CustomerForm> {
    const res = await fetch(API_URLS.customerForms.getById(id), {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse<CustomerForm>(res);
  },

  async createCustomerForm(
    data: CreateCustomerFormRequest
  ): Promise<CustomerForm> {
    const res = await fetch(API_URLS.customerForms.create(), {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<CustomerForm>(res);
  },

  async validateToken(token: string): Promise<CustomerFormValidationResponse> {
    const res = await fetch(API_URLS.customerForms.validateToken(token), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handleResponse<CustomerFormValidationResponse>(res);
  },

  async submitCustomerForm(
    token: string,
    data: CustomerFormSubmissionRequest
  ): Promise<CustomerFormSubmissionResponse> {
    const res = await fetch(API_URLS.customerForms.submit(token), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return handleResponse<CustomerFormSubmissionResponse>(res);
  },

  regenerateToken: async (id: string | number) => {
    const response = await apiClient.patch(
      API_URLS.customerForms.regenerateToken(id)
    );
    return response.data;
  },
};
