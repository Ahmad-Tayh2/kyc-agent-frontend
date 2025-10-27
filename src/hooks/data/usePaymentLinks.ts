import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { paymentLinksService } from "@/services/paymentLinks";

export function useGetPaymentLinks(filters?: string) {
  return useQuery({
    queryKey: ["get-payment-links", filters],
    queryFn: () => paymentLinksService.getPaymentLinks(filters),
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
  return useMutation({
    mutationFn: (data: any) => paymentLinksService.createPaymentLinks(data),
    onSuccess: () => {
      toast.success("Payment link created successfully!");
    },
    onError: () => {
      toast.error("Payment link creation failed!");
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
    onError: () => {
      toast.error("Payment link expiration failed!");
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
