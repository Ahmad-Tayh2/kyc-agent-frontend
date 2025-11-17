import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as walletService from "@/services/wallet";

export function useWallet(agentId: string | number) {
  return useQuery({
    queryKey: ["wallet", agentId],
    queryFn: () => walletService.getWallet(agentId),
    enabled: !!agentId,
    refetchInterval: 60 * 1000,
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
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
}

export function useAddCurrency() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      walletId,
      currencyId,
    }: {
      walletId: string | number;
      currencyId: number;
    }) => walletService.addCurrency(walletId, currencyId),
    onSuccess: () => {
      // Invalidate and refetch wallet data after successful addition
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
}

export function useAddMoneyTransactions(filters?: string) {
  return useQuery({
    queryKey: ["get-add-money-transactions", filters],
    queryFn: () => walletService.getAddMoneyTransactions(filters),
  });
}
