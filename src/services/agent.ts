import { API_URLS } from "@/constants/api";
import type {
  AgentProfileResponse,
  UpdateAgentProfileRequest,
} from "@/types/agent";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

export const agentService = {
  getProfile: async (
    agentId: string | number
  ): Promise<AgentProfileResponse> => {
    const authHeaders = getAuthHeaders();
    const res = await fetch(API_URLS.agents.get(agentId), {
      ...(authHeaders ? { headers: authHeaders } : {}),
    });
    if (!res.ok) throw new Error("Failed to fetch agent profile");
    return res.json();
  },

  updateProfile: async (
    agentId: string | number,
    data: UpdateAgentProfileRequest
  ): Promise<AgentProfileResponse> => {
    const authHeaders = getAuthHeaders();
    const headers = authHeaders
      ? { "Content-Type": "application/json", ...authHeaders }
      : { "Content-Type": "application/json" };
    console.log(" data = ", data);
    const res = await fetch(API_URLS.agents.update(agentId), {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update agent profile");
    return res.json();
  },
};
