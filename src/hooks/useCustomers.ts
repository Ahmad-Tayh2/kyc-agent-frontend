import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  customersService,
  type CustomerSearchParams,
  type CustomerCreateData,
  type CustomerIdentityFileData,
  type CustomerIncomeFileData,
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
    onSuccess: () => {
      toast.success("Customer updated successfully!");
    },
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
    onSuccess: () => {
      toast.success("Customer created successfully!");
    },
  });
}

export function useUploadIdentityDocuments() {
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string | number;
      data: CustomerIdentityFileData;
    }) => customersService.uploadIdentityDocuments(id, data),
    onSuccess: () => {
      toast.success("Identity documents uploaded successfully!");
    },
  });
}

export function useUploadIncomeDocuments() {
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string | number;
      data: CustomerIncomeFileData;
    }) => customersService.uploadIncomeDocuments(id, data),
    onSuccess: () => {
      toast.success("Income documents uploaded successfully!");
    },
  });
}
