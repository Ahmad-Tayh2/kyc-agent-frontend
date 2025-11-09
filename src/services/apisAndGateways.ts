import { API_URLS } from "@/constants/api";
import apiClient from "@/lib/axiosInstance";

export const apisAndGatewaysService = {
  getApisAndGateways: async () => {
    const response = await apiClient.get(API_URLS.apisAndGateways.getList);
    return response.data;
  },
};
