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
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  streetName: string;
  city: string;
  postalCode: string;
  country: string;
  gender: "male" | "female";
  phoneNumber: string;
  countryCode: string;
  
  // Customer Identity (optional)
  documentType?: string;
  documentNumber?: string;
  documentIssueDate?: string;
  documentExpiryDate?: string;
  identityDocuments?: File[];
  
  // Proof of Income (optional)
  bankStatements?: File[];
  extraDocuments?: File[];
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

  searchCustomer: async (params: CustomerSearchParams) => {
    const authHeaders = getAuthHeaders();
    const queryParams = new URLSearchParams();
    
    if (params.customerNumber) queryParams.append("customer_number", params.customerNumber);
    if (params.email) queryParams.append("email", params.email);
    if (params.phoneNumber) queryParams.append("phone_number", params.phoneNumber);
    
    const res = await fetch(`${API_URLS.customers.search}?${queryParams.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        ...(authHeaders ? authHeaders : {}),
      },
    });
    if (!res.ok) throw new Error("Failed to search customers");
    return res.json();
  },

  createCustomer: async (data: CustomerCreateData) => {
    const authHeaders = getAuthHeaders();
    const formData = new FormData();
    
    // Add basic details
    formData.append("first_name", data.firstName);
    formData.append("last_name", data.lastName);
    formData.append("email", data.email);
    formData.append("date_of_birth", data.dateOfBirth);
    formData.append("street_name", data.streetName);
    formData.append("city", data.city);
    formData.append("postal_code", data.postalCode);
    formData.append("country", data.country);
    formData.append("gender", data.gender);
    formData.append("phone_number", data.phoneNumber);
    formData.append("country_code", data.countryCode);
    
    // Add optional identity details
    if (data.documentType) formData.append("document_type", data.documentType);
    if (data.documentNumber) formData.append("document_number", data.documentNumber);
    if (data.documentIssueDate) formData.append("document_issue_date", data.documentIssueDate);
    if (data.documentExpiryDate) formData.append("document_expiry_date", data.documentExpiryDate);
    
    // Add files
    if (data.identityDocuments) {
      data.identityDocuments.forEach((file) => {
        formData.append("identity_documents", file);
      });
    }
    
    if (data.bankStatements) {
      data.bankStatements.forEach((file) => {
        formData.append("bank_statements", file);
      });
    }
    
    if (data.extraDocuments) {
      data.extraDocuments.forEach((file) => {
        formData.append("extra_documents", file);
      });
    }
    
    const res = await fetch(API_URLS.customers.create, {
      method: "POST",
      headers: {
        ...(authHeaders ? authHeaders : {}),
      },
      body: formData,
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to create customer");
    }
    
    return res.json();
  },
};
