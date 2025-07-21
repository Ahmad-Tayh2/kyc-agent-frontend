import { API_URLS } from '@/constants/api';

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
};
