import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { agentService } from "@/services/agent";

export function useAgentProfile(agentId: string | number) {
  return useQuery({
    queryKey: ["agent-profile", agentId],
    queryFn: () => agentService.getProfile(agentId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateAgentProfile(agentId: string | number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => agentService.updateProfile(agentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-profile", agentId] });
    },
  });
} 