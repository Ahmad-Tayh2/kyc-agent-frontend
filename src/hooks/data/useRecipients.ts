import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { recipientsService } from "@/services/recipients";
import type { RecipientUpdatedDataType } from "@/types/recipients";
import type {
  RecipientCreateData,
  RecipientSearchParams,
} from "@/services/recipients";
import type { AxiosError } from "axios";
import type { ErrorResponseData } from "@/lib/axiosInstance";
import { ROUTES } from "@/constants/routes";
import { useNavigate } from "react-router-dom";

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

export function useUpdateRecipient(
  id: string | number,
  onSuccess: () => void,
  onError: (data: any) => void
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<RecipientUpdatedDataType>) =>
      recipientsService.updateRecipient(id, data),
    onSuccess: () => {
      onSuccess?.();
      toast.success("Recipient updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["get-recipients"] });
    },
    onError: (error: any) => {
      console.log(" errrrr   =", error?.response?.data?.errors);
      onError?.(error?.response?.data?.errors);
      toast.error(error?.response?.data?.message);
    },
  });
}

export function useSearchRecipient() {
  return useMutation({
    mutationFn: (params: RecipientSearchParams) =>
      recipientsService.searchRecipient(params),
  });
}

export function useCreateRecipient() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: RecipientCreateData) =>
      recipientsService.createRecipient(data),
    onSuccess: () => {
      toast.success("Recipient created successfully!");
      queryClient.invalidateQueries({ queryKey: ["get-recipients"] });
      navigate(ROUTES.RECIPIENTS.LIST);
    },
    onError: (error: AxiosError<ErrorResponseData>) => {
      toast.error(error?.response?.data?.message);
    },
  });
}

export function useCreateRecipientIntermediate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RecipientCreateData) =>
      recipientsService.createRecipient(data),
    onSuccess: () => {
      toast.success("Recipient created successfully!");
      queryClient.invalidateQueries({ queryKey: ["get-recipients"] });
      // navigate(ROUTES.RECIPIENTS.LIST);
    },
    onError: (error: AxiosError<ErrorResponseData>) => {
      toast.error(error?.response?.data?.message);
    },
  });
}
