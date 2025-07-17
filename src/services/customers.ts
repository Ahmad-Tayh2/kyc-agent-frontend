import { API_URLS } from "@/constants/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : undefined;
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
};
