import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { agentService } from "@/services/agent";
import type { agentDocsData, UpdateAgentProfileRequest } from "@/types/agent";
import { toast } from "sonner";

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
    mutationFn: (data: UpdateAgentProfileRequest) =>
      agentService.updateProfile(agentId!, data),
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["agent-profile", agentId] });
    },
  });
}

export function useUploadAgentDocs() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: agentDocsData }) =>
      agentService.uploadDocs(id!, data),
    onSuccess: () => {
      toast.success("documents uploaded successfully!");
      queryClient.invalidateQueries({
        queryKey: ["agent-docs-upload"],
      });
    },
  });
}
