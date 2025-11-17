import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { paymentLinksService } from "@/services/paymentLinks";

export function useGetPaymentLinks(filters?: string) {
  return useQuery({
    queryKey: ["get-payment-links", filters],
    queryFn: () => paymentLinksService.getPaymentLinks(filters),
    refetchInterval: 60 * 1000,
  });
}
export function useGetPaymentLinkByTransaction(transactionId: string) {
  return useQuery({
    queryKey: ["get-payment-link-by-transaction", transactionId],
    queryFn: () =>
      paymentLinksService.getPaymentLinkByTransaction(transactionId),
    refetchInterval: 60 * 1000,
  });
}

export function useGetPaymentLinkByCart(cartId: string) {
  return useQuery({
    queryKey: ["get-payment-link-by-Cart", cartId],
    queryFn: () => paymentLinksService.getPaymentLinkByCart(cartId),
    enabled: !!cartId,
  });
}
export function useCreatePaymentLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => paymentLinksService.createPaymentLinks(data),
    onSuccess: () => {
      toast.success("Payment link created successfully!");
      queryClient.invalidateQueries({
        queryKey: ["get-payment-link-by-transaction"],
      });
    },
    onError: () => {
      toast.error("Payment link creation failed!");
    },
  });
}
export function useRegeneratePaymentLink() {
  return useMutation({
    mutationFn: (id: number) => paymentLinksService.regeneratePaymentLink(id),
    onSuccess: () => {
      toast.success("Payment link regenerated successfully!");
    },
    onError: () => {
      toast.error("Payment link regeneration failed!");
    },
  });
}

export function useCheckPaymentLinkValidation(token: string) {
  return useQuery({
    queryKey: ["get-payment-link-validation", token],
    queryFn: () => paymentLinksService.getPaymentLinkValidation(token),
    enabled: !!token,
  });
}

export function useExpireLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) =>
      paymentLinksService.expirePaymentLinks(id),
    onSuccess: () => {
      toast.success("Payment link is expired now!");
      queryClient.invalidateQueries({ queryKey: ["get-payment-links"] });
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ?? "Payment link expiration failed!"
      );
    },
  });
}
export function useMarkLinkSuccessful() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) =>
      paymentLinksService.markLinkSuccessful(id),
    onSuccess: () => {
      toast.success("Payment link is successful now!");
      queryClient.invalidateQueries({ queryKey: ["get-payment-links"] });
    },
    onError: () => {
      toast.error("Payment link marking successful failed!");
    },
  });
}
export function useRegenerateToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) =>
      paymentLinksService.regenerateToken(id),
    onSuccess: () => {
      toast.success("Payment link is regenerated successfully!");
      queryClient.invalidateQueries({ queryKey: ["get-payment-links"] });
    },
    onError: () => {
      toast.error("Payment link regeneration failed!");
    },
  });
}
