import { API_URLS } from '@/constants/api';
import apiClient from '@/lib/axiosInstance';
import { handleApiResponse } from '@/lib/handleApiResponse';
import type {
  RemittancePurposeResponse,
  RemittancePurposesResponse,
  SourceIncomeResponse,
  SourceIncomesResponse,
} from '@/types/shared/transferPurposeAndSource';

// Re-export types for easy access
export type {
  RemittancePurpose,
  RemittancePurposeResponse,
  RemittancePurposesResponse,
  SourceIncome,
  SourceIncomeResponse,
  SourceIncomesResponse,
} from '@/types/shared/transferPurposeAndSource';

export const transferPurposeAndSourceService = {
  // Remittance Purposes
  getRemittancePurposes: async (
    filters: string = ''
  ): Promise<RemittancePurposesResponse> => {
    const response = await apiClient.get(
      API_URLS.remittancePurposes.get(filters)
    );
    return handleApiResponse(response.data);
  },

  getRemittancePurposeById: async (
    id: string | number
  ): Promise<RemittancePurposeResponse> => {
    const response = await apiClient.get(
      API_URLS.remittancePurposes.getById(id)
    );
    return handleApiResponse(response.data);
  },

  // Source Incomes
  getSourceIncomes: async (
    filters: string = ''
  ): Promise<SourceIncomesResponse> => {
    const response = await apiClient.get(API_URLS.sourceIncomes.get(filters));
    return handleApiResponse(response.data);
  },

  getSourceIncomeById: async (
    id: string | number
  ): Promise<SourceIncomeResponse> => {
    const response = await apiClient.get(API_URLS.sourceIncomes.getById(id));
    return handleApiResponse(response.data);
  },
};
