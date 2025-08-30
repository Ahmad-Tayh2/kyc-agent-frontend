import * as currencyService from '@/services/currency';
import type {
  ExchangeMoneyPayload,
  ExchangePreviewAnyPayload,
  ExchangePreviewPayload,
} from '@/types/currency';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useCurrencies() {
  return useQuery({
    queryKey: ['currencies'],
    queryFn: currencyService.getCurrencies,
  });
}

export function useExchangeMoney() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ExchangeMoneyPayload) =>
      currencyService.exchangeMoney(payload),
    onSuccess: () => {
      // Invalidate and refetch wallet data after successful exchange
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['extraTransactions'] });
    },
  });
}

export function useExchangeMoneyPreview(payload?: ExchangePreviewPayload) {
  return useQuery({
    queryKey: ['exchangePreview', payload],
    queryFn: () => currencyService.previewExchangeMoney(payload!),
    enabled:
      !!payload &&
      payload.from_amount > 0 &&
      !!payload.from_wallet_currency_id &&
      !!payload.to_currency_id,
    staleTime: 3000, // 3 seconds
  });
}

export function useExchangeAnyPreview(payload?: ExchangePreviewAnyPayload) {
  return useQuery({
    queryKey: ['exchangeAnyPreview', payload],
    queryFn: () => currencyService.previewAnyExchange(payload!),
    enabled:
      !!payload &&
      payload.from_amount > 0 &&
      !!payload.from_currency_id &&
      !!payload.to_currency_id,
    staleTime: 3000, // 3 seconds
  });
}
