import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recipientPayoutService } from '@/services/recipientPayout';
import type {
  CreateRecipientPayoutRequest,
  UpdateRecipientPayoutRequest,
  RecipientPayoutFilters
} from '@/types/recipientPayout';

export function useRecipientPayouts(filters: RecipientPayoutFilters = {}) {
  return useQuery({
    queryKey: ['recipient-payouts', filters],
    queryFn: () => recipientPayoutService.getRecipientPayouts(filters),
  });
}

export function useRecipientPayout(id: string | number) {
  return useQuery({
    queryKey: ['recipient-payout', id],
    queryFn: () => recipientPayoutService.getRecipientPayoutById(id),
    enabled: !!id,
  });
}

export function useCreateRecipientPayout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRecipientPayoutRequest) =>
      recipientPayoutService.createRecipientPayout(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipient-payouts'] });
    },
  });
}

export function useUpdateRecipientPayout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: UpdateRecipientPayoutRequest }) =>
      recipientPayoutService.updateRecipientPayout(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['recipient-payouts'] });
      queryClient.invalidateQueries({ queryKey: ['recipient-payout', id] });
    },
  });
}

export function useDeleteRecipientPayout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) =>
      recipientPayoutService.deleteRecipientPayout(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipient-payouts'] });
    },
  });
}