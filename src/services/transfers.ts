import { API_URLS } from '@/constants/api';
import apiClient from '@/lib/axiosInstance';
import type {
  TransactionCreateDataType,
  TransactionPreviewByRefPayload,
  TransactionPreviewPayload,
  TransactionPreviewResponse,
  TransferResponse,
  TransfersListResponse,
} from '@/types/transfers';

export const transfersService = {
  getTransfers: async (filters: string = '') => {
    const response = await apiClient.get<TransfersListResponse>(
      API_URLS.transfers.get(filters)
    );
    return response.data;
  },

  getTransferByRef: async (ref: string) => {
    const response = await apiClient.get<TransferResponse>(
      API_URLS.transfers.getByRef(ref)
    );
    return response.data;
  },
  getTransferById: async (id: number | string) => {
    const response = await apiClient.get<TransferResponse>(
      API_URLS.transfers.getById(id)
    );
    return response.data;
  },

  createTransfer: async (data: TransactionCreateDataType) => {
    const response = await apiClient.post(API_URLS.transfers.create, data);
    return response.data;
  },

  updateTransfer: async (
    ref: string,
    data: Partial<TransactionCreateDataType>
  ) => {
    try {
      const response = await apiClient.patch(
        API_URLS.transfers.update(ref),
        data
      );
      return response.data;
    } catch (error: any) {
      // If the error has a response with data, return that
      // This handles cases where the API returns a structured error response
      if (error.response?.data) {
        return error.response.data;
      }
      // Otherwise, throw the error to be handled by the caller
      throw error;
    }
  },

  previewTransaction: async (data: TransactionPreviewPayload) => {
    const response = await apiClient.post<TransactionPreviewResponse>(
      API_URLS.transfers.preview,
      data
    );
    return response.data;
  },

  previewTransactionByRef: async (
    ref: string,
    data: Omit<TransactionPreviewByRefPayload, 'transaction_reference'>
  ) => {
    const response = await apiClient.post<TransactionPreviewResponse>(
      API_URLS.transfers.previewByRef(ref),
      {
        transaction_reference: ref,
        ...data,
      }
    );
    return response.data;
  },
};
