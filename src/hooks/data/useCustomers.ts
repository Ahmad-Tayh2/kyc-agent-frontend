import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "sonner";

// import { ROUTES } from "@/constants/routes";
import {
  customersService,
  type CustomerCreateData,
  type CustomerIdentityFileData,
  type CustomerIncomeFileData,
  type CustomerSearchParams,
} from "@/services/customers";
// import { useNavigate } from "react-router-dom";

export function useGetCustomers(filters?: string) {
  return useQuery({
    queryKey: ["get-customers", filters],
    queryFn: () => customersService.getCustomers(filters),
  });
}

export function useGetActiveCustomers(filters?: string) {
  return useQuery({
    queryKey: ["get-active-customers", filters],
    queryFn: () => customersService.getActiveCustomers(filters),
  });
}

/**
 * Hook for infinite scrolling active customers with search support
 * @param searchTerm - Search term for filtering customers
 * @param enabled - Whether the query should be enabled
 */
export function useInfiniteActiveCustomers(searchTerm: string = "", enabled: boolean = true) {
  return useInfiniteQuery({
    queryKey: ["infinite-active-customers", searchTerm],
    queryFn: ({ pageParam = 1 }) => {
      const filters = searchTerm
        ? `?search=${encodeURIComponent(searchTerm)}&page=${pageParam}`
        : `?page=${pageParam}`;
      return customersService.getActiveCustomers(filters);
    },
    getNextPageParam: (lastPage) => {
      // Assuming the API returns pagination info in the meta object
      if (lastPage?.meta?.current_page < lastPage?.meta?.last_page) {
        return lastPage.meta.current_page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled,
  });
}

export function useGetCustomersWithSearch(search: string) {
  return useQuery({
    queryKey: ["get-customers-with-search", search],
    queryFn: () => customersService.getCustomers(`?search=${search}`),
    enabled: !!search,
  });
}

export function useGetCustomer(id: string | number) {
  return useQuery({
    queryKey: ["get-customer", id],
    queryFn: () => customersService.getCustomerById(id),
    enabled: !!id,
  });
}

export function useUpdateCustomer(
  id: string | number,
  onSuccess: () => void,
  onError: (data: any) => void
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CustomerCreateData>) =>
      customersService.updateCustomer(id, data),
    onSuccess: () => {
      onSuccess?.();
      toast.success("Customer updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["get-customers"] });
    },
    onError: (err: any) => {
      console.log(" errrrr   =", err?.response?.data?.errors);
      onError(err?.response?.data?.errors);
    },
  });
}

// export function useUploadCustomerDocuments(
//   id: string | number,
//   onSuccess?: () => void
// ) {
//   return useMutation({
//     mutationFn: (data: any) =>
//       customersService.uploadCustomerDocuments(id, data),
//     onSuccess: () => {
//       onSuccess?.();
//       toast.success("Identity documents updated successfully!");
//     },
//     onError: () => {
//       toast.error("Identity documents upload failed!");
//     },
//   });
// }

export function useSearchCustomer() {
  return useMutation({
    mutationFn: (params: CustomerSearchParams) =>
      customersService.searchCustomer(params),
  });
}

export function useCreateCustomer() {
  // const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CustomerCreateData) =>
      customersService.createCustomer(data),
    onSuccess: () => {
      toast.success("Customer created successfully!");
      queryClient.invalidateQueries({ queryKey: ["get-customers"] });
      // navigate(ROUTES.CUSTOMERS.LIST);
    },
    onError: () => {
      toast.error("Customer creation failed!");
    },
  });
}

// Customer Recipients Hooks
export function useGetCustomerRecipients(customerId: string | number) {
  return useQuery({
    queryKey: ["get-customer-recipients", customerId],
    queryFn: () => customersService.getCustomerRecipients(customerId),
    enabled: !!customerId,
  });
}

export function useAttachRecipientToCustomer() {
  return useMutation({
    mutationFn: ({
      customer_id,
      agent_id,
      recipient_id,
    }: {
      customer_id?: string | number;
      agent_id?: string | number;
      recipient_id: string | number;
    }) =>
      customersService.attachRecipientToCustomer({
        customer_id,
        agent_id,
        recipient_id,
      }),
  });
}

export function useGetIdentityDocuments(customerId: string | number) {
  return useQuery({
    queryKey: ["get-customer-identity", customerId],
    queryFn: () => customersService.getCustomerIndentityDocument(customerId),
    enabled: !!customerId,
  });
}

export function useGetIncomeDocuments(customerId: string | number) {
  return useQuery({
    queryKey: ["get-customer-income", customerId],
    queryFn: () => customersService.getCustomerIncomeDocument(customerId),
    enabled: !!customerId,
  });
}

export function useUploadIdentityDocuments(actions?: {
  onSuccess: () => void;
  onError?: (data: any) => void;
  onCreateError?: (data: any) => void;
}) {
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
      actions?.onSuccess?.();
    },
    onError: (err: any) => {
      console.log(" errrrr   =", err);
      actions?.onError?.(err?.response?.data?.errors);
      actions?.onCreateError?.(err?.response?.data?.errors);
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
