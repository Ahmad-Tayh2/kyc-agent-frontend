import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { transfersService } from "@/services/transfers";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import type { TransactionCreateDataType } from "@/types/transfers";

export function useGetTransfers(filters?: string) {
  return useQuery({
    queryKey: ["get-transfers", filters],
    queryFn: () => transfersService.getTransfers(filters),
  });
}

export function useGetTransfer(id: string | number) {
  return useQuery({
    queryKey: ["get-transfer", id],
    queryFn: () => transfersService.getTransferById(id),
    enabled: !!id,
  });
}

export function useCreateCustomer() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TransactionCreateDataType) =>
      transfersService.createTransfer(data),
    onSuccess: () => {
      toast.success("Transfer created successfully!");
      queryClient.invalidateQueries({ queryKey: ["get-transfers"] });
      navigate(ROUTES.TRANSFERS.LIST);
    },
    onError: () => {
      toast.error("Transfer creation failed!");
    },
  });
}

export function useUpdateCustomer(id: string | number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<TransactionCreateDataType>) =>
      transfersService.updateTransfer(id, data),
    onSuccess: () => {
      toast.success("Transfer updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["get-transfers"] });
    },
  });
}
