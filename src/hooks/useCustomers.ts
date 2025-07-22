import { useQuery, useMutation } from "@tanstack/react-query";
import {
  customersService,
  type CustomerSearchParams,
  type CustomerCreateData,
} from "@/services/customers";

export function useGetCustomers(filters: string) {
  return useQuery({
    queryKey: ["get-customers", filters],
    queryFn: () => customersService.getCustomers(filters),
  });
}

export function useGetCustomer(id: string | number) {
  return useQuery({
    queryKey: ["get-customer", id],
    queryFn: () => customersService.getCustomerById(id),
    enabled: !!id,
  });
}

export function useUpdateCustomer(id: string | number) {
  return useMutation({
    mutationFn: (data: Partial<CustomerCreateData>) =>
      customersService.updateCustomer(id, data),
  });
}

export function useSearchCustomer() {
  return useMutation({
    mutationFn: (params: CustomerSearchParams) =>
      customersService.searchCustomer(params),
  });
}

export function useCreateCustomer() {
  return useMutation({
    mutationFn: (data: CustomerCreateData) =>
      customersService.createCustomer(data),
  });
}
