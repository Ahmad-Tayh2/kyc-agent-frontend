import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as walletService from '@/services/wallet';

export function useWallet(agentId: string | number) {
  return useQuery({
    queryKey: ['wallet', agentId],
    queryFn: () => walletService.getWallet(agentId),
    enabled: !!agentId,
  });
}

export function useDeleteCurrency() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      walletId,
      currencyId,
    }: {
      walletId: string | number;
      currencyId: string | number;
    }) => walletService.deleteCurrency(walletId, currencyId),
    onSuccess: () => {
      // Invalidate and refetch wallet data after successful deletion
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
    },
  });
}
