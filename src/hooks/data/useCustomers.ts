import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ROUTES } from '@/constants/routes';
import {
  customersService,
  type CustomerCreateData,
  type CustomerIdentityFileData,
  type CustomerIncomeFileData,
  type CustomerSearchParams,
} from '@/services/customers';
import { useNavigate } from 'react-router-dom';

export function useGetCustomers(filters?: string) {
  return useQuery({
    queryKey: ['get-customers', filters],
    queryFn: () => customersService.getCustomers(filters),
  });
}

export function useGetCustomer(id: string | number) {
  return useQuery({
    queryKey: ['get-customer', id],
    queryFn: () => customersService.getCustomerById(id),
    enabled: !!id,
  });
}

export function useUpdateCustomer(id: string | number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CustomerCreateData>) =>
      customersService.updateCustomer(id, data),
    onSuccess: () => {
      toast.success('Customer updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['get-customers'] });
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CustomerCreateData) =>
      customersService.createCustomer(data),
    onSuccess: () => {
      toast.success('Customer created successfully!');
      queryClient.invalidateQueries({ queryKey: ['get-customers'] });
      navigate(ROUTES.CUSTOMERS.LIST);
    },
    onError: () => {
      toast.error('Customer creation failed!');
    },
  });
}

// Customer Recipients Hooks
export function useGetCustomerRecipients(customerId: string | number) {
  return useQuery({
    queryKey: ['get-customer-recipients', customerId],
    queryFn: () => customersService.getCustomerRecipients(customerId),
    enabled: !!customerId,
  });
}

export function useAttachRecipientToCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      customerId,
      recipientId,
    }: {
      customerId: string | number;
      recipientId: string | number;
    }) => customersService.attachRecipientToCustomer(customerId, recipientId),
    onSuccess: (_, { customerId }) => {
      toast.success('Recipient attached to customer successfully!');
      queryClient.invalidateQueries({
        queryKey: ['get-customer-recipients', customerId],
      });
    },
    onError: () => {
      toast.error('Failed to attach recipient to customer!');
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
      toast.success('Identity documents uploaded successfully!');
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
      toast.success('Income documents uploaded successfully!');
    },
  });
}
