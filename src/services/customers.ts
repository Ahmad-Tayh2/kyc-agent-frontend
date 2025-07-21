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
  houseNumber: string;
  city: string;
  postalCode: string;
  country: string;
  gender: string;
  phoneNumber: string;
  countryCode: string;
  status: string;

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

  getCustomerById: async (id: string | number) => {
    const authHeaders = getAuthHeaders();
    const res = await fetch(API_URLS.customers.getById(id), {
      ...(authHeaders ? { headers: authHeaders } : {}),
    });
    if (!res.ok) throw new Error("Failed to fetch customer");
    return res.json();
  },

  updateCustomer: async (id: string | number, data: Partial<CustomerCreateData>) => {
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
};
