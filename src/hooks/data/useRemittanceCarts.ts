import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { remittanceCartsService } from "@/services/remittanceCart";
import { toast } from "sonner";

export function useGetRemittanceCarts(filters?: string) {
  return useQuery({
    queryKey: ["get-remittance-carts"],
    queryFn: () => remittanceCartsService.getRemittanceCarts(filters),
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
      toast.success("Transaction added to cart successfully!");
    },
    onError: () => {
      toast.error("Transaction adding failed!");
    },
  });
}

export function useRemoveTransactionFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionId: number) =>
      remittanceCartsService.removeTransactionFromCart(transactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-remittance-carts"] });
    },
  });
}
