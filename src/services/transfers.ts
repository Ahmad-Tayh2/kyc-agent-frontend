import { API_URLS } from '@/constants/api';
import apiClient from '@/lib/axiosInstance';
import type {
  TransactionCreateDataType,
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

  getTransferById: async (id: string | number) => {
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
    id: string | number,
    data: Partial<TransactionCreateDataType>
  ) => {
    const response = await apiClient.patch(API_URLS.transfers.update(id), data);
    return response.data;
  },
};
