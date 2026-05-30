import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { kycService } from "@/services/kyc";
import type { UploadKycDocumentPayload } from "@/types/kyc";

export function useGetKycStatus(customerId: string | number) {
  return useQuery({
    queryKey: ["kyc-status", customerId],
    queryFn: () => kycService.getStatus(customerId),
    enabled: !!customerId,
  });
}

export function useGetKycDocuments(customerId: string | number) {
  return useQuery({
    queryKey: ["kyc-documents", customerId],
    queryFn: () => kycService.getDocuments(customerId),
    enabled: !!customerId,
  });
}

export function useUploadKycDocument(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UploadKycDocumentPayload) =>
      kycService.uploadDocument(data),
    onSuccess: (_data, variables) => {
      toast.success("KYC document uploaded successfully!");
      queryClient.invalidateQueries({
        queryKey: ["kyc-status", variables.customer_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["kyc-documents", variables.customer_id],
      });
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to upload KYC document.");
    },
  });
}
