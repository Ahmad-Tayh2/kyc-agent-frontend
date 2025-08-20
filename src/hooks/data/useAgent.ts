import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { agentService } from "@/services/agent";
import type { UpdateAgentProfileRequest } from "@/types/agent";

export function useAgentProfile(agentId: string | number | null) {
  return useQuery({
    queryKey: ["agent-profile", agentId],
    queryFn: () => agentService.getProfile(agentId!),
    enabled: !!agentId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateAgentProfile(agentId: string | number | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateAgentProfileRequest) => agentService.updateProfile(agentId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-profile", agentId] });
    },
  });
} 