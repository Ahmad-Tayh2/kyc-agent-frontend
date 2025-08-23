import { API_URLS } from "@/constants/api";
import apiClient from "@/lib/axiosInstance";
import type { TransferResponse, TransfersListResponse } from "@/types/transfers";

export const transfersService = {
  getTransfers: async (filters: string = "") => {
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
}; 