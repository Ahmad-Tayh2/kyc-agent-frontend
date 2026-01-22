import { API_URLS } from '@/constants/api';
import { handleApiResponse } from '@/lib/handleApiResponse';
import type {
  ExtraTransaction,
  ExtraTransactionsResponse,
  WalletTransaction,
  WalletTransactionsResponse,
} from '@/types/transactions';

export async function getExtraTransactions(
  queryParams?: string
): Promise<ExtraTransaction[]> {
  const token = localStorage.getItem('token');
  const url = queryParams
    ? `${API_URLS.transactions.get()}?${queryParams}`
    : API_URLS.transactions.get();

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: ExtraTransactionsResponse = await response.json();
  return handleApiResponse(data);
}

export async function getWalletTransactions(
  queryParams?: string
): Promise<WalletTransaction[]> {
  const token = localStorage.getItem('token');
  const url = queryParams
    ? `${API_URLS.transactions.get()}?${queryParams}`
    : API_URLS.transactions.get();

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: WalletTransactionsResponse = await response.json();
  return handleApiResponse(data);
}
