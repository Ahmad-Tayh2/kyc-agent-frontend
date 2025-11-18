import { API_URLS } from '@/constants/api';
import type {
  RemittanceCountry,
  RemittanceCountryResponse,
  RemittanceMethodAvailability,
  RemittanceMethodsResponse,
  RecipientMethodsData,
  RecipientMethodsResponse,
  RemittanceCurrency,
  RemittanceCurrenciesResponse,
} from '@/types/remittanceAvailability';
import apiClient from '../lib/axiosInstance';

export type {
  RemittanceCountry,
  RemittanceMethodAvailability,
  RecipientMethodsData,
  RemittanceCurrency,
};

export const remittanceAvailabilityService = {
  // Get receive countries
  getReceiveCountries: async (): Promise<RemittanceCountry[]> => {
    const response = await apiClient.get<RemittanceCountryResponse>(
      API_URLS.remittanceAvailability.receiveCountries
    );
    return response.data.data || [];
  },

  // Get send countries
  getSendCountries: async (): Promise<RemittanceCountry[]> => {
    const response = await apiClient.get<RemittanceCountryResponse>(
      API_URLS.remittanceAvailability.sendCountries
    );
    return response.data.data || [];
  },

  // Get remittance methods (optionally filtered by receive country)
  getRemittanceMethods: async (
    receiveCountryId?: number
  ): Promise<RemittanceMethodAvailability[]> => {
    const response = await apiClient.get<RemittanceMethodsResponse>(
      API_URLS.remittanceAvailability.methods(receiveCountryId)
    );
    return response.data.data || [];
  },

  // Get recipient remittance methods and payout agents
  getRecipientMethods: async (
    recipientId: number,
    receiveCountryId: number
  ): Promise<RecipientMethodsData> => {
    const response = await apiClient.get<RecipientMethodsResponse>(
      API_URLS.remittanceAvailability.recipientMethods(
        recipientId,
        receiveCountryId
      )
    );
    return response.data.data;
  },

  // Get send country currencies
  getSendCountryCurrencies: async (
    countryId: number
  ): Promise<RemittanceCurrency[]> => {
    const response = await apiClient.get<RemittanceCurrenciesResponse>(
      API_URLS.remittanceAvailability.sendCountryCurrencies(countryId)
    );
    return response.data.data || [];
  },

  // Get receive country currencies
  getReceiveCountryCurrencies: async (
    countryId: number
  ): Promise<RemittanceCurrency[]> => {
    const response = await apiClient.get<RemittanceCurrenciesResponse>(
      API_URLS.remittanceAvailability.receiveCountryCurrencies(countryId)
    );
    return response.data.data || [];
  },
};
