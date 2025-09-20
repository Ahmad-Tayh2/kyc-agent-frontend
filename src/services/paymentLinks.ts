import { API_URLS } from "@/constants/api";
import apiClient from "@/lib/axiosInstance";

export const paymentLinksService = {
  getPaymentLinks: async (filters: string = "") => {
    const response = await apiClient.get(API_URLS.paymentLinks.get(filters));
    return response.data;
  },

  getPaymentLinkByCart: async (cartId: string) => {
    const response = await apiClient.get(
      API_URLS.paymentLinks.getByCart(cartId)
    );
    return response.data;
  },

  getPaymentLinkByTransaction: async (cartId: string) => {
    const response = await apiClient.get(
      API_URLS.paymentLinks.getByTransaction(cartId)
    );
    return response.data;
  },

  createPaymentLinks: async (data: any) => {
    const response = await apiClient.post(API_URLS.paymentLinks.create, data);
    return response.data;
  },

  getPaymentLinkValidation: async (token: string) => {
    const response = await apiClient.get(API_URLS.paymentLinks.validate(token));
    return response.data;
  },
};
