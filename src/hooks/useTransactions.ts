import { useQuery } from '@tanstack/react-query';
import * as transactionsService from '@/services/transactions';

export function useExtraTransactions() {
  return useQuery({
    queryKey: ['extraTransactions'],
    queryFn: transactionsService.getExtraTransactions,
  });
}
