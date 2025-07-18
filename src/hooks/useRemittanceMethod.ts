import { useQuery } from '@tanstack/react-query';
import { remittanceMethodService } from '@/services/remittanceMethod';

export function useRemittanceMethods() {
  return useQuery({
    queryKey: ['remittance-methods'],
    queryFn: remittanceMethodService.getRemittanceMethods,
  });
}
