import { useQuery } from '@tanstack/react-query';
import * as transactionsService from '@/services/transactions';

export function useExtraTransactions(filterString?: string) {
  return useQuery({
    queryKey: ['extraTransactions', filterString],
    queryFn: () => transactionsService.getExtraTransactions(filterString),
    enabled: true,
  });
}
