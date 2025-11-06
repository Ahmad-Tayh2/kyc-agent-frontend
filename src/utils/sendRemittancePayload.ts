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
  total_payable_amount: number;
  rm_sp_id: number;
  comment?: string;
  remittance_method_id?: number;
  payout_agent_id?: number;
  remittance_purpose_id?: number;
  source_income_id?: number;
}

/**
 * Constructs a draft transfer payload from step data
 * Used in step 2 (currencies) to create a draft transfer
 */
export const buildDraftTransferPayload = (
  data: SendRemittanceData,
  options?: { comment?: string; rmSpId?: number }
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
    send_country_id: stepOne.sendCountry.id,
    receive_country_id: stepOne.receiveCountry.id,
    send_currency: stepTwo.sendCurrency.code,
    receive_currency: stepTwo.receiveCurrency.code,
    sent_amount: stepTwo.sendAmount,
    total_payable_amount: stepTwo.sendAmount, // Will be calculated properly later
    rm_sp_id: options?.rmSpId || 1, // TODO: Get from proper source
    comment: options?.comment || 'Transfer created',
  };

  // Add either remittance_method_id or payout_agent_id based on selection
  if (
    stepOne.selectedPaymentMethodType === 'remittance_method' &&
    stepOne.remittanceMethod?.id
  ) {
    payload.remittance_method_id = stepOne.remittanceMethod.id;
  } else if (
    stepOne.selectedPaymentMethodType === 'payout_agent' &&
    stepOne.payoutAgent?.id
  ) {
    payload.payout_agent_id = stepOne.payoutAgent.id;
  }

  return payload;
};

/**
 * Constructs an update transfer payload from step data
 * Used in step 3 (review) to update transfer with additional details
 */
export const buildUpdateTransferPayload = (
  data: SendRemittanceData,
  options?: { comment?: string; rmSpId?: number }
): TransferPayload | null => {
  const basePayload = buildDraftTransferPayload(data, options);

  if (!basePayload) {
    return null;
  }

  // Add step 3 data
  const { stepThree } = data;

  if (stepThree.remittancePurpose?.id) {
    basePayload.remittance_purpose_id = stepThree.remittancePurpose.id;
  }

  if (stepThree.sourceOfIncome?.id) {
    basePayload.source_income_id = stepThree.sourceOfIncome.id;
  }

  return basePayload;
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
