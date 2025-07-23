import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as currencyService from '@/services/currency';
import type { ExchangeMoneyPayload } from '@/types/currency';

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
    },
  });
}
