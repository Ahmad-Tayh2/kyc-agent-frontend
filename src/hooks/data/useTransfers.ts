import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { transfersService } from '@/services/transfers';
import type { TransactionCreateDataType } from '@/types/transfers';

export function useGetTransfers(filters?: string) {
  return useQuery({
    queryKey: ['get-transfers', filters],
    queryFn: () => transfersService.getTransfers(filters),
  });
}

export function useGetTransfer(ref: string) {
  return useQuery({
    queryKey: ['get-transfer', ref],
    queryFn: () => transfersService.getTransferByRef(ref),
    enabled: !!ref,
  });
}
export function useGetTransferById(id: string | number) {
  return useQuery({
    queryKey: ['get-transfer-byId', id],
    queryFn: () => transfersService.getTransferById(id),
    enabled: !!id,
  });
}

export function useCreateTransfer(onSuccess?: () => void) {
  return useMutation({
    mutationFn: (data: TransactionCreateDataType) =>
      transfersService.createTransfer(data),
    onSuccess: () => {
      toast.success('Transfer created successfully!');
      onSuccess?.();
      //queryClient.invalidateQueries({ queryKey: ["get-transfers"] });
      //navigate(ROUTES.TRANSFERS.LIST);
    },
    onError: () => {
      toast.error('Transfer creation failed!');
    },
  });
}

export function useUpdateTransfer(ref: string) {
  return useMutation({
    mutationFn: (data: Partial<TransactionCreateDataType>) =>
      transfersService.updateTransfer(ref, data),

    onSuccess: () => {
      // toast.success("Transfer updated successfully!");
      //queryClient.invalidateQueries({ queryKey: ["get-transfers"] });
    },
  });
}
