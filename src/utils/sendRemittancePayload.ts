import type { SendRemittanceData } from '@/types/sendRemittance';

/**
 * Utility functions for constructing API payloads from send remittance store data
 */

export interface TransferPayload {
  customer_id: number;
  recipient_id: number;
  send_country_id: number;
  receive_country_id: number;
  send_currency: string;
  receive_currency: string;
  sent_amount: number;
  receive_amount: number;
  remittance_method_id?: number | null;
  payout_agent_id?: number | null;
  remittance_purpose_id?: number | null;
  source_income_id?: number | null;
  extra_fees_applied_percent: number;
  is_all_included_in_send_amount: boolean;
  do_calculate_from_receive_amount: boolean;
}

/**
 * Constructs a draft transfer payload from step data
 * Used in step 2 (currencies) to create a draft transfer
 * This matches exactly the structure sent to the preview endpoint
 */
export const buildDraftTransferPayload = (
  data: SendRemittanceData
): TransferPayload | null => {
  const { stepOne, stepTwo } = data;

  // Validate required fields
  if (
    !stepOne.customer?.id ||
    !stepOne.recipient?.id ||
    !stepOne.sendCountry?.id ||
    !stepOne.receiveCountry?.id ||
    !stepTwo.sendCurrency?.code ||
    !stepTwo.receiveCurrency?.code ||
    !stepTwo.sendAmount
  ) {
    return null;
  }

  const payload: TransferPayload = {
    customer_id: stepOne.customer.id,
    recipient_id: stepOne.recipient.id,
    remittance_method_id: stepOne.remittanceMethod?.id || null,
    send_country_id: stepOne.sendCountry.id,
    receive_country_id: stepOne.receiveCountry.id,
    payout_agent_id: stepOne.payoutAgent?.id || null,
    remittance_purpose_id: null, // Will be added in step 3
    source_income_id: null, // Will be added in step 3
    send_currency: stepTwo.sendCurrency.code,
    receive_currency: stepTwo.receiveCurrency.code,
    sent_amount: stepTwo.sendAmount,
    receive_amount: stepTwo.receiveAmount || 0,
    extra_fees_applied_percent: stepTwo.extraFeesPercent || 0,
    is_all_included_in_send_amount: stepTwo.isAllFeesIncludedInSendAmount,
    do_calculate_from_receive_amount: stepTwo.isCalculateFromReceiveAmount,
  };

  return payload;
};

/**
 * Constructs an update transfer payload from step data
 * Used in step 3 (review) to update transfer with additional details
 * Only includes non-null values to avoid sending unnecessary data
 */
export const buildUpdateTransferPayload = (
  data: SendRemittanceData
): Partial<TransferPayload> | null => {
  const basePayload = buildDraftTransferPayload(data);

  if (!basePayload) {
    return null;
  }

  // Add step 3 data - update the null values from draft
  const { stepThree } = data;

  basePayload.remittance_purpose_id = stepThree.remittancePurpose?.id || null;
  basePayload.source_income_id = stepThree.sourceOfIncome?.id || null;

  // Filter out null and undefined values to only send updated fields
  const filteredPayload: Partial<TransferPayload> = {};

  Object.entries(basePayload).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      filteredPayload[key as keyof TransferPayload] = value as never;
    }
  });

  return filteredPayload;
};

/**
 * Validates if the data is sufficient to create a draft transfer
 */
export const canCreateDraftTransfer = (data: SendRemittanceData): boolean => {
  return buildDraftTransferPayload(data) !== null;
};

/**
 * Validates if the data is sufficient to update a transfer
 */
export const canUpdateTransfer = (data: SendRemittanceData): boolean => {
  return buildUpdateTransferPayload(data) !== null;
};
