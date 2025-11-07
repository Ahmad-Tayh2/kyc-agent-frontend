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

export function useAttachCustomerToAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (customerId: string | number) =>
      agentService.attachCustomerToAgent(customerId),
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
    onSuccess: () => {
      toast.success("Customer Attached successfully!");
      queryClient.invalidateQueries({
        queryKey: ["get-customers"],
      });
    },
  });
}

export function useAgentExtraFees(agentId: string | number | null) {
  return useQuery({
    queryKey: ["agent-extra-fees", agentId],
    queryFn: () => agentService.getExtraFees(agentId!),
    enabled: !!agentId,
    staleTime: 5 * 60 * 1000,
  });
}
