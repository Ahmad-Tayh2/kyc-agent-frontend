import axiosInstance from '@/lib/axiosInstance';
import { handleApiResponse } from '@/lib/handleApiResponse';
import type { AxiosResponse } from 'axios';

export interface WorldpaySessionRequest {
  transactionReference?: string;
  paymentLinkToken?: string;
  description?: string;
}

export interface WorldpaySessionResponse {
  payment_id: string | number;
  transaction_uuid: string;
  redirect_url: string;
  order_code: string;
}

/**
 * Creates a Worldpay payment session
 * @param data Object containing either transactionReference or paymentLinkToken
 * @returns Promise with the Worldpay session data
 */
export const createWorldpaySession = async (data: WorldpaySessionRequest) => {
  return axiosInstance
    .post('http://localhost:8000/api/worldpay/initialize', data)
    .then((response: AxiosResponse) =>
      handleApiResponse<WorldpaySessionResponse>(response.data)
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
      }>(response.data)
    );
};

/**
 * Note: We're using the simplified approach where the Laravel backend handles all Worldpay
 * XML order creation and returns a redirect URL. The frontend simply redirects the user
 * to this URL where they complete payment on Worldpay's secure pages.
 */
