import { API_URLS } from '@/constants/api';
import type {
  AccountVerificationRequest,
  AccountVerificationResponse,
} from '@/types/remittanceMethod/RemittanceMethod';

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

export const remittanceMethodService = {
  async getRemittanceMethods() {
    const res = await fetch(API_URLS.remittanceMethods.get(), {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async verifyAccountInfo(
    data: AccountVerificationRequest
  ): Promise<AccountVerificationResponse> {
    const res = await fetch(API_URLS.remittanceMethods.verifyAccountInfo(), {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
};
