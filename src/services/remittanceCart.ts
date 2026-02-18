import { API_URLS } from '@/constants/api';
import apiClient from '@/lib/axiosInstance';

export const remittanceCartsService = {
  getRemittanceCarts: async (filters?: string) => {
    const response = await apiClient.get(
      API_URLS.remittanceCart.get(filters ?? ''),
    );
    return response;
  },
  createRemittanceCart: async (data: any) => {
    const response = await apiClient.post(API_URLS.remittanceCart.create, data);
    return response.data;
  },
  addTransactionToCart: async (data: any) => {
    const response = await apiClient.post(
      API_URLS.remittanceCart.addTransaction,
      {
        transaction_id: data?.transaction_id,
      },
    );
    return response.data;
  },

  removeTransactionFromCart: async (transactionId: number) => {
    console.log(' test removeeeee ');
    const response = await apiClient.delete(
      API_URLS.remittanceCart.removeTransaction(transactionId),
    );
    return response;
  },
};
