import { API_URLS } from '@/constants/api';
import type {
  CreateRecipientRemittanceMethodRequest,
  GetRecipientRemittanceMethodsParams,
  RecipientRemittanceMethod,
  UpdateRecipientRemittanceMethodRequest,
} from '@/types/recipientRemittanceMethod/RecipientRemittanceMethod';

function getHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse(res: Response) {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Request failed');
  }
  return res.json();
}

export const recipientRemittanceMethodService = {
  async getRecipientRemittanceMethods(
    params: GetRecipientRemittanceMethodsParams
  ): Promise<RecipientRemittanceMethod[]> {
    const queryParams = new URLSearchParams({
      recipient_id: params.recipient_id.toString(),
    });

    const res = await fetch(
      `${API_URLS.recipientRemittanceMethods.get()}?${queryParams}`,
      {
        method: 'GET',
        headers: getHeaders(),
      }
    );
    const response = await handleResponse(res);
    return response.data || []; // Extract the data array from the API response
  },

  async getRecipientRemittanceMethodById(
    id: number
  ): Promise<RecipientRemittanceMethod> {
    const res = await fetch(API_URLS.recipientRemittanceMethods.getById(id), {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async createRecipientRemittanceMethod(
    data: CreateRecipientRemittanceMethodRequest
  ): Promise<RecipientRemittanceMethod> {
    const res = await fetch(API_URLS.recipientRemittanceMethods.create(), {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateRecipientRemittanceMethod(
    id: number,
    data: UpdateRecipientRemittanceMethodRequest
  ): Promise<RecipientRemittanceMethod> {
    const res = await fetch(API_URLS.recipientRemittanceMethods.update(id), {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteRecipientRemittanceMethod(id: number): Promise<void> {
    const res = await fetch(API_URLS.recipientRemittanceMethods.delete(id), {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Delete request failed');
    }
  },
};
