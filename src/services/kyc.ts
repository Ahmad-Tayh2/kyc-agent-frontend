import { API_URLS } from "@/constants/api";
import apiClient from "@/lib/axiosInstance";
import type { UploadKycDocumentPayload } from "@/types/kyc";

export const kycService = {
  getStatus: async (customerId: string | number) => {
    const response = await apiClient.get(API_URLS.kyc.status(customerId));
    return response.data;
  },

  getDocuments: async (customerId: string | number) => {
    const response = await apiClient.get(API_URLS.kyc.documents(customerId));
    return response.data;
  },

  uploadDocument: async (data: UploadKycDocumentPayload) => {
    const formData = new FormData();
    formData.append("customer_id", String(data.customer_id));
    formData.append("document_type", data.document_type);
    formData.append("document", data.document);
    if (data.expires_at) {
      formData.append("expires_at", data.expires_at);
    }

    const response = await apiClient.post(
      API_URLS.kyc.uploadDocument,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },
};
