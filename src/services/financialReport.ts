import { API_URLS } from "@/constants/api";
import apiClient from "@/lib/axiosInstance";

export const financialReport = {
  getCommissionEarned: async (filters: string = "") => {
    const response = await apiClient.get(
      API_URLS.financialReport.getCommissionEarned(filters)
    );
    return response.data;
  },
  getAccountStatements: async (filters: string = "") => {
    const response = await apiClient.get(
      API_URLS.financialReport.getAccountStatements(filters)
    );
    return response.data;
  },
};
