import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { paymentLinksService } from "@/services/paymentLinks";

export function useGetPaymentLink(filters?: string) {
  return useQuery({
    queryKey: ["get-payment-links", filters],
    queryFn: () => paymentLinksService.getPaymentLinks(filters),
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
