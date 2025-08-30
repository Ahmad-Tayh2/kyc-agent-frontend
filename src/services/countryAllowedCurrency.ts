import { API_URLS } from '@/constants/api';
import apiClient from '@/lib/axiosInstance';
import { handleApiResponse } from '@/lib/handleApiResponse';
import type {
  CountryAllowedCurrency,
  CountryCurrenciesResponse,
  CurrencyCountriesResponse,
} from '@/types/shared/countryAllowedCurrency';

// Re-export types for easy access
export type {
  CountryAllowedCurrency,
  CountryCurrenciesResponse,
  CountryCurrency,
  CurrencyCountriesResponse,
  CurrencyCountry,
  CurrencyRole,
} from '@/types/shared/countryAllowedCurrency';

export const countryAllowedCurrencyService = {
  // Get all country-allowed-currencies with filters
  getCountryAllowedCurrencies: async (
    filters: string = ''
  ): Promise<CountryAllowedCurrency[]> => {
    const response = await apiClient.get(
      API_URLS.countryAllowedCurrencies.get(filters)
    );
    return handleApiResponse(response.data);
  },

  // Get currencies for a specific country
  getCountryCurrencies: async (
    countryId: string | number,
    filters: string = ''
  ): Promise<CountryCurrenciesResponse> => {
    const response = await apiClient.get(
      API_URLS.countryAllowedCurrencies.getByCountry(countryId, filters)
    );
    return handleApiResponse(response.data);
  },

  // Get countries for a specific currency
  getCurrencyCountries: async (
    currencyId: string | number,
    filters: string = ''
  ): Promise<CurrencyCountriesResponse> => {
    const response = await apiClient.get(
      API_URLS.countryAllowedCurrencies.getByCurrency(currencyId, filters)
    );
    return handleApiResponse(response.data);
  },
};
