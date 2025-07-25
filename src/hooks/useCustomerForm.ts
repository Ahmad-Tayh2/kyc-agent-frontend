import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerFormService } from '@/services/customerForm';
import type { CreateCustomerFormRequest } from '../types/customerForm/CreateCustomerFormRequest';
import type { CustomerForm } from '../types/customerForm/CustomerForm';
import type { CustomerFormSubmissionRequest } from '../types/customerForm/CustomerFormSubmission';

export const useCustomerForm = (filters: string = '') => {
  return useQuery({
    queryKey: ['customerForm', filters],
    queryFn: () => customerFormService.getCustomerForms(filters),
  });
};

export const useCustomerFormById = (id: string | number) => {
  return useQuery({
    queryKey: ['customerForm', id],
    queryFn: () => customerFormService.getCustomerFormById(id),
    enabled: !!id, // Only run the query if id is provided
  });
};

export const useCreateCustomerForm = () => {
  const queryClient = useQueryClient();

  return useMutation<CustomerForm, Error, CreateCustomerFormRequest>({
    mutationFn: (data: CreateCustomerFormRequest) =>
      customerFormService.createCustomerForm(data),
    onSuccess: () => {
      // Invalidate and refetch customer forms after successful creation
      queryClient.invalidateQueries({ queryKey: ['customerForm'] });
    },
    onError: (error) => {
      console.error('Error creating customer form:', error);
    },
  });
};

export const useValidateCustomerFormToken = (token: string) => {
  return useQuery({
    queryKey: ['customerFormValidation', token],
    queryFn: () => customerFormService.validateToken(token),
    enabled: !!token,
    retry: false, // Don't retry on validation failures
  });
};

export const useSubmitCustomerForm = (token: string) => {
  return useMutation({
    mutationFn: (data: CustomerFormSubmissionRequest) =>
      customerFormService.submitCustomerForm(token, data),
    onError: (error) => {
      console.error('Error submitting customer form:', error);
    },
  });
};
