import { recipientRemittanceMethodService } from "@/services/recipientRemittanceMethod";
import type {
  CreateRecipientRemittanceMethodRequest,
  UpdateRecipientRemittanceMethodRequest,
} from "@/types/recipientRemittanceMethod/RecipientRemittanceMethod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useRecipientRemittanceMethods(recipientId: string | number) {
  return useQuery({
    queryKey: ["recipient-remittance-methods", recipientId],
    queryFn: () =>
      recipientRemittanceMethodService.getRecipientRemittanceMethods({
        recipient_id: Number(recipientId),
      }),
    enabled: !!recipientId,
  });
}

export function useRecipientRemittanceMethod(id: string | number) {
  return useQuery({
    queryKey: ["recipient-remittance-method", id],
    queryFn: () =>
      recipientRemittanceMethodService.getRecipientRemittanceMethodById(
        Number(id)
      ),
    enabled: !!id,
  });
}

export function useCreateRecipientRemittanceMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRecipientRemittanceMethodRequest) =>
      recipientRemittanceMethodService.createRecipientRemittanceMethod(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["recipient-remittance-methods"],
      });
      if (variables.recipient_id) {
        queryClient.invalidateQueries({
          queryKey: ["recipient-remittance-methods", variables.recipient_id],
        });
      }
      //added this to refetch data
      queryClient.invalidateQueries({
        queryKey: ["remittance-availability", "recipient-methods"],
      });
    },
  });
}

export function useUpdateRecipientRemittanceMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string | number;
      data: UpdateRecipientRemittanceMethodRequest;
    }) =>
      recipientRemittanceMethodService.updateRecipientRemittanceMethod(
        Number(id),
        data
      ),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ["recipient-remittance-methods"],
      });
      queryClient.invalidateQueries({
        queryKey: ["recipient-remittance-method", id],
      });
    },
  });
}

export function useDeleteRecipientRemittanceMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) =>
      recipientRemittanceMethodService.deleteRecipientRemittanceMethod(
        Number(id)
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["recipient-remittance-methods"],
      });
    },
  });
}
