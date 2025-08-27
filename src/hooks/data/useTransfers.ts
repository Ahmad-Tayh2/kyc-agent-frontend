import { useQuery } from "@tanstack/react-query";
import { transfersService } from "@/services/transfers";

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
