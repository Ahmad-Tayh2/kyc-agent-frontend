import { useQuery } from "@tanstack/react-query";
import { financialReport } from "@/services/financialReport";

export function useGetCommissionEarned(filters?: string) {
  return useQuery({
    queryKey: ["get-commission-earned", filters],
    queryFn: () => financialReport.getCommissionEarned(filters),
    // refetchInterval: 60 * 1000
  });
}
export function useGetAccountStatements(filters?: string) {
  return useQuery({
    queryKey: ["get-account-statements", filters],
    queryFn: () => financialReport.getAccountStatements(filters),
  });
}
