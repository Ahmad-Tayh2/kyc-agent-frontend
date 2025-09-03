import {
  transferPurposeAndSourceService,
  type RemittancePurposeResponse,
  type RemittancePurposesResponse,
  type SourceIncomeResponse,
  type SourceIncomesResponse,
} from "@/services/transferPurposeAndSource";
import { useQuery } from "@tanstack/react-query";

// Remittance Purposes Hooks

// Hook to get all remittance purposes with filters => reasons
export function useGetRemittancePurposes(filters?: string) {
  return useQuery<any /*RemittancePurposesResponse*/>({
    queryKey: ["remittance-purposes", filters],
    queryFn: () =>
      transferPurposeAndSourceService.getRemittancePurposes(filters || ""),
  });
}

// Hook to get a specific remittance purpose by ID
export function useGetRemittancePurpose(id: string | number) {
  return useQuery<RemittancePurposeResponse>({
    queryKey: ["remittance-purpose", id],
    queryFn: () => transferPurposeAndSourceService.getRemittancePurposeById(id),
    enabled: !!id,
  });
}

// Source Incomes Hooks

// Hook to get all source incomes with filters => fund
export function useGetSourceIncomes(filters?: string) {
  return useQuery<any /*SourceIncomesResponse*/>({
    queryKey: ["source-incomes", filters],
    queryFn: () =>
      transferPurposeAndSourceService.getSourceIncomes(filters || ""),
  });
}

// Hook to get a specific source income by ID
export function useGetSourceIncome(id: string | number) {
  return useQuery<SourceIncomeResponse>({
    queryKey: ["source-income", id],
    queryFn: () => transferPurposeAndSourceService.getSourceIncomeById(id),
    enabled: !!id,
  });
}

// Convenience hooks for specific service providers

// Get remittance purposes for a specific service provider
export function useGetRemittancePurposesByProvider(
  serviceProviderId: string | number
) {
  const filters = `?service_provider_id=${serviceProviderId}`;
  return useGetRemittancePurposes(filters);
}

// Get source incomes for a specific service provider
export function useGetSourceIncomesByProvider(
  serviceProviderId: string | number
) {
  const filters = `?service_provider_id=${serviceProviderId}`;
  return useGetSourceIncomes(filters);
}
