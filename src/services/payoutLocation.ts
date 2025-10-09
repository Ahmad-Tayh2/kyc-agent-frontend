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

export const payoutLocationService = {
  async getPayoutLocations(filtersString?: string) {
    const url = filtersString
      ? `${API_URLS.payoutLocations.get()}${filtersString}`
      : API_URLS.payoutLocations.get();

    const res = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};
