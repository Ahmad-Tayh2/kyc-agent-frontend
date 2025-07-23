import { API_URLS } from '@/constants/api';
import { handleApiResponse } from '@/lib/handleApiResponse';
import type {
  Currency,
  CurrenciesResponse,
  ExchangeMoneyPayload,
  ExchangeMoneyResponse,
} from '@/types/currency';

export async function getCurrencies(): Promise<Currency[]> {
  const token = localStorage.getItem('token');

  const response = await fetch(API_URLS.currencies.get(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: CurrenciesResponse = await response.json();
  return handleApiResponse(data);
}

export async function exchangeMoney(
  payload: ExchangeMoneyPayload
): Promise<unknown> {
  const token = localStorage.getItem('token');

  const response = await fetch(API_URLS.currencies.exchange(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: ExchangeMoneyResponse = await response.json();
  return handleApiResponse(data);
}
