import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { recipientsService } from "@/services/recipients";
import type { RecipientUpdatedDataType } from "@/types/recipients";
import type { RecipientCreateData, RecipientSearchParams } from "@/services/recipients";
import type { AxiosError } from "axios";
import type { ErrorResponseData } from "@/lib/axiosInstance";
import { ROUTES } from "@/constants/routes";
import { useNavigate } from "react-router-dom";
import { formatError } from "@/lib/errorHandler";
import { toastError } from "@/utils/toastHelper";

export function useRecipients(filters?: string) {
  return useQuery({
    queryKey: ["get-recipients", filters],
    queryFn: () => recipientsService.getRecipients(filters),
  });
}

/**
 * Hook for infinite scrolling recipients with search support
 * @param searchTerm - Search term for filtering by name or phone number
 * @param enabled - Whether the query should be enabled
 */
export function useInfiniteRecipients(searchTerm: string = "", enabled: boolean = true) {
  return useInfiniteQuery({
    queryKey: ["infinite-recipients", searchTerm],
    queryFn: ({ pageParam = 1 }) => {
      const filters = searchTerm
        ? `?search_term=${encodeURIComponent(searchTerm)}&page=${pageParam}`
        : `?page=${pageParam}`;
      return recipientsService.getRecipients(filters);
    },
    getNextPageParam: (lastPage) => {
      // Assuming the API returns pagination info in the meta object
      if (lastPage?.meta?.current_page < lastPage?.meta?.last_page) {
        return lastPage.meta.current_page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled,
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
  onError: (data: any) => void,
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
      const err = formatError(error);
      toastError(err);
      onError?.(error?.response?.data?.errors);
    },
  });
}

export function useSearchRecipient() {
  return useMutation({
    mutationFn: (params: RecipientSearchParams) => recipientsService.searchRecipient(params),
  });
}

export function useCreateRecipient() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: RecipientCreateData) => recipientsService.createRecipient(data),
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

export function useCreateRecipientIntermediate({
  keyToInvalidate = "get-recipients",
  onError,
}: {
  keyToInvalidate: string;
  onError: (errors: any) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RecipientCreateData) => recipientsService.createRecipient(data),
    onSuccess: () => {
      toast.success("Recipient created successfully!");
      queryClient.invalidateQueries({ queryKey: [keyToInvalidate] });
      // navigate(ROUTES.RECIPIENTS.LIST);
    },
    onError: (error: AxiosError<ErrorResponseData>) => {
      const err = formatError(error);
      toastError(err);
      onError?.(err?.errors);
    },
  });
}
