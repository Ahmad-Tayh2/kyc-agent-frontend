import { API_URLS } from "@/constants/api";
import apiClient from "@/lib/axiosInstance";
import { handleApiResponse } from "@/lib/handleApiResponse";
import type {
  CustomerCreateData,
  CustomerIdentityFileData,
  CustomerIncomeFileData,
  // CustomerRecipientsResponse,
  CustomerSearchParams,
} from "@/types/customers";

// Re-export types for backwards compatibility
export type {
  CustomerCreateData,
  CustomerIdentityFileData,
  CustomerIncomeFileData,
  CustomerRecipientsResponse,
  CustomerSearchParams,
} from "@/types/customers";

export const customersService = {
  getCustomers: async (filters: string = "") => {
    const response = await apiClient.get(API_URLS.customers.get(filters));
    return response.data;
  },

  getCustomerById: async (id: string | number) => {
    const response = await apiClient.get(API_URLS.customers.getById(id));
    return response.data;
  },

  updateCustomer: async (
    id: string | number,
    data: Partial<CustomerCreateData>
  ) => {
    const response = await apiClient.patch(API_URLS.customers.update(id), data);
    return response.data;
  },

  searchCustomer: async (params: CustomerSearchParams) => {
    const queryParams = new URLSearchParams();

    if (params.customerNumber)
      queryParams.append("reference_number", params.customerNumber);
    if (params.email) queryParams.append("email", params.email);
    if (params.phoneNumber)
      queryParams.append("phone_number", params.phoneNumber);

    const response = await apiClient.get(
      `${API_URLS.customers.search}?${queryParams.toString()}`
    );
    return response.data;
  },

  createCustomer: async (data: CustomerCreateData) => {
    const response = await apiClient.post(API_URLS.customers.create, data);
    return response.data;
  },

  // Customer Recipients
  getCustomerRecipients: async (
    customerId: string | number
  ) /*: Promise<CustomerRecipientsResponse> */ => {
    const response = await apiClient.get(
      API_URLS.customers.getRecipients(customerId)
    );
    console.log(" getCustomerRecipients --------- ", response?.data);
    return response?.data;
    // return handleApiResponse(response.data);
  },

  attachRecipientToCustomer: async (
    customerId: string | number,
    recipientId: string | number
  ) => {
    const response = await apiClient.post(
      API_URLS.customers.attachRecipient(customerId, recipientId)
    );
    return handleApiResponse(response.data);
  },

  uploadIdentityDocuments: async (
    id: string | number,
    data: CustomerIdentityFileData
  ) => {
    const formData = new FormData();
    formData.append("document_type", data.documentType);
    formData.append("document_number", data.documentNumber);
    formData.append("document_issue_date", data.documentIssueDate);
    formData.append("document_expiry_date", data.documentExpiryDate);
    if (data.frontDocument)
      formData.append("front_document", data.frontDocument);
    if (data.backDocument) formData.append("back_document", data.backDocument);

    const response = await apiClient.post(
      API_URLS.customers.uploadIdentityDocuments(id),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  uploadIncomeDocuments: async (
    id: string | number,
    data: CustomerIncomeFileData
  ) => {
    const formData = new FormData();
    data.bankStatements.forEach((file, index) => {
      formData.append(`bank_statements[${index}]`, file);
    });
    data.extraDocuments.forEach((file, index) => {
      formData.append(`extra_documents[${index}]`, file);
    });
    if (data.extraDocumentsDescription) {
      formData.append(
        "extra_documents_description",
        data.extraDocumentsDescription
      );
    }

    const response = await apiClient.post(
      API_URLS.customers.uploadIncomeDocuments(id),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // uploadIdentityDocuments: async (
  //   id: string | number,
  //   data: CustomerIdentityFileData
  // ) => {
  //   const authHeaders = getAuthHeaders();
  //   const formData = new FormData();

  //   formData.append("document_type", data.documentType);
  //   formData.append("document_number", data.documentNumber);
  //   formData.append("document_issue_date", data.documentIssueDate);
  //   formData.append("document_expiry_date", data.documentExpiryDate);

  //   if (data.frontDocument) {
  //     formData.append("front_document", data.frontDocument);
  //   }
  //   if (data.backDocument) {
  //     formData.append("back_document", data.backDocument);
  //   }

  //   const res = await fetch(API_URLS.customers.uploadIdentityDocuments(id), {
  //     method: "POST",
  //     headers: {
  //       ...(authHeaders ? authHeaders : {}),
  //     },
  //     body: formData,
  //   });
  //   if (!res.ok) {
  //     const errorData = await res.json();
  //     throw new Error(
  //       errorData.message || "Failed to upload identity documents"
  //     );
  //   }
  //   return res.json();
  // },

  // uploadIncomeDocuments: async (
  //   id: string | number,
  //   data: CustomerIncomeFileData
  // ) => {
  //   const authHeaders = getAuthHeaders();
  //   const formData = new FormData();

  //   data.bankStatements.forEach((file, index) => {
  //     formData.append(`bank_statements[${index}]`, file);
  //   });

  //   data.extraDocuments.forEach((file, index) => {
  //     formData.append(`extra_documents[${index}]`, file);
  //   });

  //   if (data.extraDocumentsDescription) {
  //     formData.append(
  //       "extra_documents_description",
  //       data.extraDocumentsDescription
  //     );
  //   }

  //   const res = await fetch(API_URLS.customers.uploadIncomeDocuments(id), {
  //     method: "POST",
  //     headers: {
  //       ...(authHeaders ? authHeaders : {}),
  //     },
  //     body: formData,
  //   });
  //   if (!res.ok) {
  //     const errorData = await res.json();
  //     throw new Error(errorData.message || "Failed to upload income documents");
  //   }
  //   return res.json();
  // },
};
