import { API_URLS } from '@/constants/api';
import type {
  CreateRecipientPayoutRequest,
  UpdateRecipientPayoutRequest,
  RecipientPayoutListResponse,
  RecipientPayoutResponse,
  RecipientPayoutFilters
} from '@/types/recipientPayout';

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

function buildQueryString(filters: RecipientPayoutFilters): string {
  const params = new URLSearchParams();

  if (filters.recipient_id !== undefined) {
    params.append('recipient_id', filters.recipient_id.toString());
  }

  return params.toString() ? `?${params.toString()}` : '';
}

export const recipientPayoutService = {
  async getRecipientPayouts(filters: RecipientPayoutFilters = {}): Promise<RecipientPayoutListResponse> {
    const queryString = buildQueryString(filters);
    const res = await fetch(`${API_URLS.recipientPayouts.get()}${queryString}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getRecipientPayoutById(id: string | number): Promise<RecipientPayoutResponse> {
    const res = await fetch(API_URLS.recipientPayouts.getById(id), {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async createRecipientPayout(data: CreateRecipientPayoutRequest): Promise<RecipientPayoutResponse> {
    const res = await fetch(API_URLS.recipientPayouts.create(), {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateRecipientPayout(id: string | number, data: UpdateRecipientPayoutRequest): Promise<RecipientPayoutResponse> {
    const res = await fetch(API_URLS.recipientPayouts.update(id), {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteRecipientPayout(id: string | number): Promise<{ status: boolean; message: string }> {
    const res = await fetch(API_URLS.recipientPayouts.delete(id), {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};