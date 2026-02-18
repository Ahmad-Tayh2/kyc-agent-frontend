import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { remittanceCartsService } from '@/services/remittanceCart';
import { toast } from 'sonner';

export function useGetRemittanceCarts(filters?: string) {
  return useQuery({
    queryKey: ['get-remittance-carts', filters],
    queryFn: () => remittanceCartsService.getRemittanceCarts(filters),
    refetchInterval: 60 * 1000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
}

export function useCreateRemittanceCart() {
  return useMutation({
    mutationFn: (data: any) =>
      remittanceCartsService.createRemittanceCart(data),
  });
}

export function useAddTransactionToCart() {
  return useMutation({
    mutationFn: (data: any) =>
      remittanceCartsService.addTransactionToCart(data),
    onSuccess: () => {
      toast.success('Transaction added to cart successfully!');
    },
    onError: () => {
      toast.error('Transaction adding failed!');
    },
  });
}

export function useRemoveTransactionFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionId: number) =>
      remittanceCartsService.removeTransactionFromCart(transactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-remittance-carts'] });
    },
  });
}
