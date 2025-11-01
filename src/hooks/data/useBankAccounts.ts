import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { bankAccountsService } from "@/services/bankAccounts";
import type { BankAccountCreateData } from "@/services/recipients";
import type { AxiosError } from "axios";
import type { ErrorResponseData } from "@/lib/axiosInstance";

export function useCreateBankAccount({
  onSuccess,
  keyToInvalidate,
}: {
  onSuccess?: () => void;
  keyToInvalidate?: string;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BankAccountCreateData) =>
      bankAccountsService.createBankAccount(data),
    onSuccess: () => {
      toast.success("Bank account created successfully!");
      onSuccess?.();
      keyToInvalidate &&
        queryClient.invalidateQueries({ queryKey: [keyToInvalidate] });
    },
    onError: (error: AxiosError<ErrorResponseData>) => {
      toast.error(error?.response?.data?.message);
    },
  });
}
