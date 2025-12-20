import { transfersService } from "@/services/transfers";
import type {
  TransactionCreateDataType,
  TransactionPreviewByRefPayload,
  TransactionPreviewPayload,
} from "@/types/transfers";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useGetTransfers(filters?: string) {
  return useQuery({
    queryKey: ["get-transfers", filters],
    queryFn: () => transfersService.getTransfers(filters),
    staleTime: 0,
  });
}

export function useGetTransfer(ref: string) {
  return useQuery({
    queryKey: ["get-transfer", ref],
    queryFn: () => transfersService.getTransferByRef(ref),
    enabled: !!ref,
  });
}
export function useGetTransferById(id: string | number) {
  return useQuery({
    queryKey: ["get-transfer-byId", id],
    queryFn: () => transfersService.getTransferById(id),
    enabled: !!id,
  });
}

export function useCreateTransfer(onSuccess?: () => void) {
  return useMutation({
    mutationFn: (data: TransactionCreateDataType) =>
      transfersService.createTransfer(data),
    onSuccess: () => {
      toast.success("Transfer created successfully!");
      onSuccess?.();
      //queryClient.invalidateQueries({ queryKey: ["get-transfers"] });
      //navigate(ROUTES.TRANSFERS.LIST);
    },
    onError: () => {
      toast.error("Transfer creation failed!");
    },
  });
}

export function useUpdateTransfer(ref: string) {
  return useMutation({
    mutationFn: async (data: Partial<TransactionCreateDataType>) => {
      const response = await transfersService.updateTransfer(ref, data);

      // Check if the response indicates failure
      if (!response.status) {
        // Throw an error with the message from the API
        throw new Error(response.message || 'Failed to update transfer');
      }

      return response;
    },

    onSuccess: () => {
      // toast.success("Transfer updated successfully!");
      //queryClient.invalidateQueries({ queryKey: ["get-transfers"] });
    },

    onError: (error: Error) => {
      // Error will be automatically thrown and can be caught by the consumer
      console.error('Transfer update error:', error.message);
    },
  });
}

export function useTransactionPreview(payload?: TransactionPreviewPayload) {
  return useQuery({
    queryKey: ["transactionPreview", payload],
    queryFn: () => transfersService.previewTransaction(payload!),
    enabled:
      !!payload &&
      !!payload.customer_id &&
      !!payload.recipient_id &&
      !!payload.send_country_id &&
      !!payload.receive_country_id &&
      !!payload.send_currency &&
      !!payload.receive_currency &&
      (payload.sent_amount ? payload.sent_amount > 0 : true),
    staleTime: 3000, // 3 seconds
  });
}

export function useTransactionPreviewByRef(
  ref: string | undefined,
  payload?: Omit<TransactionPreviewByRefPayload, "transaction_reference">
) {
  return useQuery({
    queryKey: ["transactionPreviewByRef", ref, payload],
    queryFn: () => transfersService.previewTransactionByRef(ref!, payload!),
    enabled:
      !!ref &&
      !!payload &&
      !!payload.send_currency &&
      !!payload.receive_currency &&
      (!!payload.send_amount || !!payload.receive_amount),
    staleTime: 3000, // 3 seconds
  });
}
