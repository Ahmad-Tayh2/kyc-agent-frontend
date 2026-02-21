import { baseUrl } from '@/constants/api';
import axiosInstance from '@/lib/axiosInstance';
import { handleApiResponse } from '@/lib/handleApiResponse';
import type { AxiosResponse } from 'axios';

export interface WorldpaySessionRequest {
  transactionReference?: string;
  paymentLinkToken?: string;
  walletCurrencyId?: number;
  amount?: number;
  description?: string;
}

export interface WorldpaySessionResponse {
  payment_id: string | number;
  transaction_uuid: string;
  redirect_url: string;
  order_code: string;
  total_amount?: string;
  currency?: string;
  payable_amount?: number;
  payable_currency?: string;
}

/**
 * Creates a Worldpay payment session
 * @param data Object containing either transactionReference, paymentLinkToken, or walletCurrencyId (with amount)
 * @returns Promise with the Worldpay session data
 */
export const createWorldpaySession = async (data: WorldpaySessionRequest) => {
  return axiosInstance
    .post(`${baseUrl}/worldpay/initialize`, data)
    .then((response: AxiosResponse) =>
      handleApiResponse<WorldpaySessionResponse>(response.data),
    );
};

/**
 * Marks a payment as processing after Worldpay redirect success
 * @param data Object containing either payment_id or transaction_uuid
 * @returns Promise with the updated payment status
 */
export const markPaymentProcessing = async (data: {
  payment_id?: number | string;
  transaction_uuid?: string;
}) => {
  return axiosInstance
    .post(`${baseUrl}/worldpay/mark-processing`, data)
    .then((response: AxiosResponse) =>
      handleApiResponse<{
        payment_id: number;
        transaction_uuid: string;
        status: string;
      }>(response.data),
    );
};

/**
 * Verifies payment status by order code
 * @param orderCode The Worldpay order code to verify
 * @returns Promise with the payment status data
 */
export const verifyPaymentStatus = async (orderCode: string) => {
  return axiosInstance
    .get(`/api/payments/status/${orderCode}`)
    .then((response: AxiosResponse) =>
      handleApiResponse<{
        status: string;
        order_code: string;
        amount?: number;
        currency?: string;
      }>(response.data),
    );
};

/**
 * Note: We're using the simplified approach where the Laravel backend handles all Worldpay
 * XML order creation and returns a redirect URL. The frontend simply redirects the user
 * to this URL where they complete payment on Worldpay's secure pages.
 */
