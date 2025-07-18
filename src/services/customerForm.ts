import { API_URLS } from '@/constants/api';
import type { CreateCustomerFormRequest } from '../types/customerForm/CreateCustomerFormRequest';
import type { CustomerForm } from '../types/customerForm/CustomerForm';
import { handleApiResponse } from '@/lib/handleApiResponse';

function getHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json();

  // This covers even non-2xx responses
  return handleApiResponse<T>(json);
}

export const customerFormService = {
  async getCustomerForms(): Promise<CustomerForm[]> {
    const res = await fetch(API_URLS.customerForms.get(), {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse<CustomerForm[]>(res);
  },

  async getCustomerFormById(id: string | number): Promise<CustomerForm> {
    const res = await fetch(API_URLS.customerForms.getById(id), {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse<CustomerForm>(res);
  },

  async createCustomerForm(
    data: CreateCustomerFormRequest
  ): Promise<CustomerForm> {
    const res = await fetch(API_URLS.customerForms.create(), {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<CustomerForm>(res);
  },
};
