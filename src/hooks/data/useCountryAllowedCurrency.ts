import {
  countryAllowedCurrencyService,
  type CountryAllowedCurrency,
  type CountryCurrenciesResponse,
  type CurrencyCountriesResponse,
} from "@/services/countryAllowedCurrency";
import { useQuery } from "@tanstack/react-query";

// Hook to get all country-allowed-currencies with filters
export function useGetCountryAllowedCurrencies(filters?: string) {
  return useQuery<CountryAllowedCurrency[]>({
    queryKey: ["country-allowed-currencies", filters],
    queryFn: () =>
      countryAllowedCurrencyService.getCountryAllowedCurrencies(filters || ""),
  });
}

// Hook to get currencies for a specific country
export function useGetCountryCurrencies(
  countryId: string | number,
  filters?: string
) {
  return useQuery<CountryCurrenciesResponse>({
    queryKey: ["country-currencies", countryId, filters],
    queryFn: () =>
      countryAllowedCurrencyService.getCountryCurrencies(
        countryId,
        filters || ""
      ),
    enabled: !!countryId,
  });
}

// Hook to get countries for a specific currency
export function useGetCurrencyCountries(
  currencyId: string | number,
  filters?: string
) {
  return useQuery<CurrencyCountriesResponse>({
    queryKey: ["currency-countries", currencyId, filters],
    queryFn: () =>
      countryAllowedCurrencyService.getCurrencyCountries(
        currencyId,
        filters || ""
      ),
    enabled: !!currencyId,
  });
}

// Convenience hooks for specific roles

// Get sending currencies for all countries
export function useGetSendingCurrencies(distinctCountries?: boolean) {
  const filters = `?role=send${
    distinctCountries ? "&distinct_countries=true" : ""
  }`;

  return useGetCountryAllowedCurrencies(filters);
}

// Get receiving currencies for all countries
export function useGetReceivingCurrencies(distinctCountries?: boolean) {
  const filters = `?role=receive${
    distinctCountries ? "&distinct_countries=true" : ""
  }`;
  return useGetCountryAllowedCurrencies(filters);
}

// Get sending currencies for a specific country
export function useGetCountrySendingCurrencies(countryId: string | number) {
  return useGetCountryCurrencies(countryId, "?role=send");
}

// Get receiving currencies for a specific country
export function useGetCountryReceivingCurrencies(countryId: string | number) {
  return useGetCountryCurrencies(countryId, "?role=receive");
}

// Get countries that can send a specific currency
export function useGetCurrencySendingCountries(currencyId: string | number) {
  return useGetCurrencyCountries(currencyId, "?role=send");
}

// Get countries that can receive a specific currency
export function useGetCurrencyReceivingCountries(currencyId: string | number) {
  return useGetCurrencyCountries(currencyId, "?role=receive");
}
