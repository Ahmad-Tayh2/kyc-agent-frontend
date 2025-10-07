import { payoutLocationService } from '@/services/payoutLocation';
import { useQuery } from '@tanstack/react-query';

export const usePayoutLocations = (filtersString?: string) => {
  return useQuery({
    queryKey: ['payoutLocations', filtersString],
    queryFn: () => payoutLocationService.getPayoutLocations(filtersString),
  });
};
