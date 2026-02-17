import * as walletService from '@/services/wallet';
import type { canPayTransactionData, payTransactionData } from '@/types/wallet';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useWallet(agentId: string | number) {
  return useQuery({
    queryKey: ['wallet', agentId],
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
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
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
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
    },
  });
}

export function useAddMoneyTransactions(filters?: string) {
  return useQuery({
    queryKey: ['get-add-money-transactions', filters],
    queryFn: () => walletService.getAddMoneyTransactions(filters),
  });
}

export function useCanPayTransaction(transactionReference: string) {
  return useQuery<canPayTransactionData>({
    queryKey: ['can-pay-transaction', transactionReference],
    queryFn: () => walletService.canPayTransaction(transactionReference),
    enabled: !!transactionReference,
  });
}

export function usePayTransaction() {
  const queryClient = useQueryClient();

  return useMutation<
    payTransactionData,
    Error,
    { transactionReference: string; notes?: string }
  >({
    mutationFn: (payload: { transactionReference: string; notes?: string }) =>
      walletService.payTransaction(payload),
    onSuccess: () => {
      // Invalidate and refetch wallet and transaction data after successful payment
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({
        queryKey: ['get-add-money-transactions'],
      });
    },
  });
}
