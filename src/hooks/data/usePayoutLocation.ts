import { useQuery } from '@tanstack/react-query';
import { payoutLocationService } from '@/services/payoutLocation';

export const usePayoutLocations = () => {
  return useQuery({
    queryKey: ['payoutLocations'],
    queryFn: payoutLocationService.getPayoutLocations,
  });
};
