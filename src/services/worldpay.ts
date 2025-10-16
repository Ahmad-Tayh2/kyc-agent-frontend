import axiosInstance from '@/lib/axiosInstance';
import { handleApiResponse } from '@/lib/handleApiResponse';
import type { AxiosResponse } from 'axios';

export interface WorldpaySessionRequest {
  transactionReference?: string;
  paymentLinkToken?: string;
}

export interface WorldpaySessionResponse {
  payment_id: string | number;
  transaction_uuid: string;
  merchant_code: string;
  session_id: string; // This is actually the full session URL, not just an ID
}

/**
 * Creates a Worldpay payment session
 * @param data Object containing either transactionReference or paymentLinkToken
 * @returns Promise with the Worldpay session data
 */
export const createWorldpaySession = async (data: WorldpaySessionRequest) => {
  return axiosInstance
    .post('http://localhost:8000/api/payments/worldpay/session', data)
    .then((response: AxiosResponse) =>
      handleApiResponse<WorldpaySessionResponse>(response.data)
    );
};

/**
 * Note: We're using Worldpay Hosted Payment Pages via direct URL redirect instead of
 * the JavaScript client, as our backend returns a complete payment session URL.
 * No need to load the Worldpay.js script anymore.
 */
