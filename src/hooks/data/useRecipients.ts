import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { recipientsService } from "@/services/recipients";
import type { RecipientUpdatedDataType } from "@/types/recipients";
import type { AxiosError } from "axios";
import type { ErrorResponseData } from "@/lib/axiosInstance";
// import { ROUTES } from "@/constants/routes";
// import { useNavigate } from "react-router-dom";

export function useRecipients(filters: string) {
  return useQuery({
    queryKey: ["get-recipients", filters],
    queryFn: () => recipientsService.getRecipients(filters),
  });
}

export function useGetRecipient(id: string | number) {
  return useQuery({
    queryKey: ["get-recipient", id],
    queryFn: () => recipientsService.getRecipientById(id),
    enabled: !!id,
  });
}

export function useUpdateRecipient(id: string | number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<RecipientUpdatedDataType>) =>
      recipientsService.updateCustomer(id, data),
    onSuccess: () => {
      toast.success("Recipient updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["get-recipients"] });
    },
    onError: (error: AxiosError<ErrorResponseData>) => {
      toast.error(error?.response?.data?.message);
    },
  });
}
