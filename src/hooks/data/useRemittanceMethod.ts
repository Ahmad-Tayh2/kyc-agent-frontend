import { remittanceMethodService } from '@/services/remittanceMethod';
import type { AccountVerificationRequest } from '@/types/remittanceMethod/RemittanceMethod';
import { useMutation, useQuery } from '@tanstack/react-query';

export function useRemittanceMethods() {
  return useQuery({
    queryKey: ['remittance-methods'],
    queryFn: remittanceMethodService.getRemittanceMethods,
  });
}

export function useVerifyAccountInfo() {
  return useMutation({
    mutationFn: (data: AccountVerificationRequest) =>
      remittanceMethodService.verifyAccountInfo(data),
  });
}
