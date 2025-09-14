import { paymentService } from '@/services/payment';
import type { PaymentRequest, PaymentResponse } from '@/types/payment';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';

interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export function useCreatePayment() {
  return useMutation({
    mutationFn: (paymentData: PaymentRequest) =>
      paymentService.createPayment(paymentData),
    onSuccess: (response: PaymentResponse) => {
      if (response.status) {
        toast.success(response.message || 'Payment processed successfully!');
      } else {
        // Handle API response with status: false
        const errorMessage = response.errors
          ? Object.values(response.errors).flat().join(', ')
          : response.message || 'Payment failed';
        toast.error(errorMessage);
      }
    },
    onError: (error: unknown) => {
      console.error('Payment error:', error);

      // Handle different types of errors
      let errorMessage = 'Payment failed. Please try again.';

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    },
  });
}

export function useValidatePayment() {
  return {
    validate: (paymentData: PaymentRequest) => {
      const errors = paymentService.validatePaymentRequest(paymentData);

      if (errors.length > 0) {
        errors.forEach((error) => toast.error(error));
        return false;
      }

      return true;
    },
  };
}
