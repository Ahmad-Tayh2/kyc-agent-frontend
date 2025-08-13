import { API_URLS } from "@/constants/api";
import apiClient from "@/lib/axiosInstance";
import type { BankAccountCreateData } from "@/services/recipients";

export const bankAccountsService = {
  createBankAccount: async (data: BankAccountCreateData) => {
    const response = await apiClient.post(API_URLS.bankAccounts.create, data);
    return response.data;
  },
}; 