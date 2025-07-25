import { API_URLS } from '@/constants/api';
import { handleApiResponse } from '@/lib/handleApiResponse';
import type { Wallet, WalletResponse } from '@/types/wallet';

export async function getWallet(agentId: string | number): Promise<Wallet> {
  const token = localStorage.getItem('token');

  const response = await fetch(API_URLS.wallet.get(agentId), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: WalletResponse = await response.json();
  return handleApiResponse(data);
}

export async function deleteCurrency(
  walletId: string | number,
  currencyId: string | number
): Promise<void> {
  const token = localStorage.getItem('token');
  const url = API_URLS.wallet.deleteCurrency();

  // URL is empty for now, so we'll just return early
  if (!url) {
    console.log('Delete currency URL not implemented yet', {
      walletId,
      currencyId,
    });
    return;
  }

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}

export async function addCurrency(
  walletId: string | number,
  currencyId: number
): Promise<void> {
  const token = localStorage.getItem('token');

  const response = await fetch(API_URLS.wallet.addCurrency(walletId), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      currency_id: currencyId,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return handleApiResponse(data);
}
