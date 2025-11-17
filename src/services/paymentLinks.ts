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

  getPaymentLinkByTransaction: async (transactionId: string) => {
    const response = await apiClient.get(
      API_URLS.paymentLinks.getByTransaction(transactionId)
    );
    return response.data;
  },

  createPaymentLinks: async (data: any) => {
    const response = await apiClient.post(API_URLS.paymentLinks.create, data);
    return response.data;
  },

  regeneratePaymentLink: async (id: number) => {
    const response = await apiClient.post(API_URLS.paymentLinks.regenerate(id));
    return response.data;
  },

  getPaymentLinkValidation: async (token: string) => {
    const response = await apiClient.get(API_URLS.paymentLinks.validate(token));
    return response.data;
  },

  expirePaymentLinks: async (id: string | number) => {
    const response = await apiClient.post(API_URLS.paymentLinks.expire(id));
    return response.data;
  },
  markLinkSuccessful: async (id: string | number) => {
    const response = await apiClient.post(
      API_URLS.paymentLinks.markSuccessful(id)
    );
    return response.data;
  },
  regenerateToken: async (id: string | number) => {
    const response = await apiClient.post(
      API_URLS.paymentLinks.regenerateToken(id)
    );
    return response.data;
  },
};
