import { API_URLS } from "@/constants/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

export const agentService = {
  getProfile: async (agentId: string | number) => {
    const authHeaders = getAuthHeaders();
    const res = await fetch(API_URLS.agents.get(agentId), {
      credentials: "include",
      ...(authHeaders ? { headers: authHeaders } : {}),
    });
    if (!res.ok) throw new Error("Failed to fetch agent profile");
    return res.json();
  },
  updateProfile: async (agentId: string | number, data: any) => {
    const authHeaders = getAuthHeaders();
    const headers = authHeaders
      ? { "Content-Type": "application/json", ...authHeaders }
      : { "Content-Type": "application/json" };
    const res = await fetch(API_URLS.agents.update(agentId), {
      method: "PUT",
      headers,
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update agent profile");
    return res.json();
  },
}; 