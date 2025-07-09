import { useQuery } from "@tanstack/react-query";
import { addressService } from "@/services/address";
// import type { Country, City } from "@/services/address";

export const useCountries = () => {
  return useQuery({
    queryKey: ["countries"],
    queryFn: addressService.getCountries,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCitiesByCountry = (countryId: string | number | null) => {
  return useQuery({
    queryKey: ["cities", countryId],
    queryFn: () => addressService.getCitiesByCountry(countryId!),
    enabled: !!countryId, // Only fetch when countryId is provided
    staleTime: 5 * 60 * 1000,
  });
};
