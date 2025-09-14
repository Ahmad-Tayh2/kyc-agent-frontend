import { API_URLS } from "@/constants/api";
import apiClient from "@/lib/axiosInstance";

export const remittanceCartsService = {
  getRemittanceCarts: async () => {
    const response = await apiClient.get(API_URLS.remittanceCart.get);
    return response;
  },
};
