import { API_URLS } from "@/constants/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

export interface CustomerSearchParams {
  customerNumber?: string;
  email?: string;
  phoneNumber?: string;
}

export interface CustomerCreateData {
  // Basic Details
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  street_name: string;
  house_number: string;
  postal_code: string;
  extra_address_details: string;
  city_id: string;
  state_id: string;
  country_id: string;
  gender: undefined;
  country_phone_code: string;
  phone_number: string;
  status: string;
}

export interface CustomerIdentityFileData {
  documentType: string;
  documentNumber: string;
  documentIssueDate: string;
  documentExpiryDate: string;
  frontDocument: File | null;
  backDocument: File | null;
}

export interface CustomerIncomeFileData {
  bankStatements: File[];
  extraDocuments: File[];
  extraDocumentsDescription?: string;
}

export const customersService = {
  getCustomers: async (filters: string = "") => {
    const authHeaders = getAuthHeaders();
    const res = await fetch(API_URLS.customers.get(filters), {
      ...(authHeaders ? { headers: authHeaders } : {}),
    });
    if (!res.ok) throw new Error("Failed to fetch customers");
    return res.json();
  },

  getCustomerById: async (id: string | number) => {
    const authHeaders = getAuthHeaders();
    const res = await fetch(API_URLS.customers.getById(id), {
      ...(authHeaders ? { headers: authHeaders } : {}),
    });
    if (!res.ok) throw new Error("Failed to fetch customer");
    return res.json();
  },

  updateCustomer: async (
    id: string | number,
    data: Partial<CustomerCreateData>
  ) => {
    const authHeaders = getAuthHeaders();
    const res = await fetch(API_URLS.customers.update(id), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(authHeaders ? authHeaders : {}),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to update customer");
    }
    return res.json();
  },

  searchCustomer: async (params: CustomerSearchParams) => {
    const authHeaders = getAuthHeaders();
    const queryParams = new URLSearchParams();

    if (params.customerNumber)
      queryParams.append("customer_number", params.customerNumber);
    if (params.email) queryParams.append("email", params.email);
    if (params.phoneNumber)
      queryParams.append("phone_number", params.phoneNumber);

    const res = await fetch(
      `${API_URLS.customers.search}?${queryParams.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(authHeaders ? authHeaders : {}),
        },
      }
    );
    if (!res.ok) throw new Error("Failed to search customers");
    return res.json();
  },

  createCustomer: async (data: CustomerCreateData) => {
    const authHeaders = getAuthHeaders();
    const res = await fetch(API_URLS.customers.create, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeaders ? authHeaders : {}),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to create customer");
    }
    return res.json();
  },

  uploadIdentityDocuments: async (
    id: string | number,
    data: CustomerIdentityFileData
  ) => {
    const authHeaders = getAuthHeaders();
    const formData = new FormData();

    formData.append("document_type", data.documentType);
    formData.append("document_number", data.documentNumber);
    formData.append("document_issue_date", data.documentIssueDate);
    formData.append("document_expiry_date", data.documentExpiryDate);

    if (data.frontDocument) {
      formData.append("front_document", data.frontDocument);
    }
    if (data.backDocument) {
      formData.append("back_document", data.backDocument);
    }

    const res = await fetch(API_URLS.customers.uploadIdentityDocuments(id), {
      method: "POST",
      headers: {
        ...(authHeaders ? authHeaders : {}),
      },
      body: formData,
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        errorData.message || "Failed to upload identity documents"
      );
    }
    return res.json();
  },

  uploadIncomeDocuments: async (
    id: string | number,
    data: CustomerIncomeFileData
  ) => {
    const authHeaders = getAuthHeaders();
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

    const res = await fetch(API_URLS.customers.uploadIncomeDocuments(id), {
      method: "POST",
      headers: {
        ...(authHeaders ? authHeaders : {}),
      },
      body: formData,
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to upload income documents");
    }
    return res.json();
  },
};
