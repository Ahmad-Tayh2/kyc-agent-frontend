import { useMutation, useQuery } from "@tanstack/react-query";
import { customersService, type CustomerSearchParams, type CustomerCreateData } from "@/services/customers";

export function useSearchCustomer() {
  return useMutation({
    mutationFn: (params: CustomerSearchParams) => customersService.searchCustomer(params),
  });
}

export function useCreateCustomer() {
  return useMutation({
    mutationFn: (data: CustomerCreateData) => customersService.createCustomer(data),
  });
} 