import { useQuery } from '@tanstack/react-query';
import { remittanceAvailabilityService } from '@/services/remittanceAvailability';

// Hook to get receive countries
export const useReceiveCountries = () => {
  return useQuery({
    queryKey: ['remittance-availability', 'receive-countries'],
    queryFn: remittanceAvailabilityService.getReceiveCountries,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get send countries
export const useSendCountries = () => {
  return useQuery({
    queryKey: ['remittance-availability', 'send-countries'],
    queryFn: remittanceAvailabilityService.getSendCountries,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get remittance methods (optionally filtered by receive country)
export const useRemittanceMethods = (receiveCountryId?: number) => {
  return useQuery({
    queryKey: ['remittance-availability', 'methods', receiveCountryId],
    queryFn: () =>
      remittanceAvailabilityService.getRemittanceMethods(receiveCountryId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get recipient remittance methods and payout agents
export const useRecipientMethods = (
  recipientId: number | null,
  receiveCountryId: number | null
) => {
  return useQuery({
    queryKey: [
      'remittance-availability',
      'recipient-methods',
      recipientId,
      receiveCountryId,
    ],
    queryFn: () =>
      remittanceAvailabilityService.getRecipientMethods(
        recipientId!,
        receiveCountryId!
      ),
    enabled: !!recipientId && !!receiveCountryId, // Only fetch when both IDs are provided
    staleTime: 2 * 60 * 1000, // 2 minutes (shorter since this is more dynamic)
  });
};

// Hook to get send country currencies
export const useSendCountryCurrencies = (countryId: number | null) => {
  return useQuery({
    queryKey: ['remittance-availability', 'send-country-currencies', countryId],
    queryFn: () =>
      remittanceAvailabilityService.getSendCountryCurrencies(countryId!),
    enabled: !!countryId, // Only fetch when country ID is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get receive country currencies
export const useReceiveCountryCurrencies = (countryId: number | null) => {
  return useQuery({
    queryKey: [
      'remittance-availability',
      'receive-country-currencies',
      countryId,
    ],
    queryFn: () =>
      remittanceAvailabilityService.getReceiveCountryCurrencies(countryId!),
    enabled: !!countryId, // Only fetch when country ID is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
