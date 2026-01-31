export interface Transfer {
  id: number;
  reference_number: string;
  user_id: number;
  customer_id: number;
  recipient_id: number;
  remittance_method_id: number;
  send_country_id: number;
  receive_country_id: number;
  sent_amount: string;
  receive_amount: string;
  status: TransferStatus;
  isPaid: boolean;
  payment_method: PaymentMethod;
  comment: string;
  send_currency: string;
  receive_currency: string;
  default_currency: string;
  sent_amount_in_send_currency: number;
  sent_amount_in_default_currency: number;
  receive_amount_in_send_currency: number;
  receive_amount_in_default_currency: number;
  platform_exchange_rate: number;
  api_exchange_rate: number;
  sending_agent_commission_percent: number;
  sending_agent_commission_amount: number;
  sending_agent_commission_currency: string;
  payout_agent_commission_percent: number;
  payout_agent_commission_amount: number;
  payout_agent_commission_currency: string;
  nomadrem_commission_amount: number;
  extra_fees_amount: number;
  total_commission_amount: number;
  payout_amount: number;
  total_payable_amount: number;
  created_at: string;
  updated_at: string;
}

export type TransferStatus =
  | "draft"
  | "in-progress"
  | "completed"
  | "cancelled"
  | "blocked"
  | "refunded";

export type PaymentMethod =
  | "bank_transfer"
  | "cash_pickup"
  | "mobile_money"
  | "digital_wallet";

export interface TransferResponse {
  status: boolean;
  message: string;
  data: Transfer;
  errors: any;
}

export interface TransfersListResponse {
  status: boolean;
  message: string;
  data: Transfer[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    last_page: number;
  };
  errors: any;
}

export interface TransferFilters {
  status?: TransferStatus[];
  sending_date?: string;
  receive_currency?: string;
  page?: number;
  per_page?: number;
}

export interface TransactionCreateDataType {
  customer_id: number;
  recipient_id: number;
  remittance_method_id?: number | null;
  send_country_id: number;
  receive_country_id: number;
  payout_agent_id?: number | null;
  remittance_purpose_id?: number | null;
  source_income_id?: number | null;
  payment_method?: string;
  comment?: string;
  send_currency: string;
  receive_currency: string;
  sent_amount: number;
  receive_amount: number;
  extra_fees_applied_percent: number;
  is_all_included_in_send_amount: boolean;
  do_calculate_from_receive_amount: boolean;
}

// get transfer by id
type UserName = {
  id: number;
  first_name: string;
  last_name: string;
};

type IdName = {
  id: number;
  name: string;
  iso2?: string;
};

// Main type
export type GetTransfersDataProps = {
  id: number;
  reference_number?: string;
  total_payable_amount?: string;
  receive_amount?: string;
  created_by: UserName;
  customer: UserName;
  recipient: UserName;
  remittance_method_id: IdName;
  send_country_id: IdName;
  receive_country_id: IdName;
  status: string;
  isPaid: boolean;
  payment_method: string;
  comment: string;
  send_currency: string;
  receive_currency: string;
  default_currency: string;
  sent_amount_in_send_currency: number;
  sent_amount_in_default_currency: number;
  receive_amount_in_send_currency: number;
  receive_amount_in_default_currency: number;
  platform_exchange_rate: number;
  api_exchange_rate: number;
  sending_agent_commission_percent: number;
  sending_agent_commission_amount: number;
  sending_agent_commission_currency: string;
  payout_agent_commission_percent: number;
  payout_agent_commission_amount: number;
  payout_agent_commission_currency: string;
  nomadrem_commission_amount: number;
  extra_fees_amount: number;
  total_commission_amount: number;
  sent_amount: string;
  payout_amount: number;
  created_at: string;
  updated_at: string;
};

// Transaction Preview Types
export interface TransactionPreviewPayload {
  customer_id: number;
  recipient_id: number;
  remittance_method_id?: number | null;
  send_country_id: number;
  receive_country_id: number;
  payout_agent_id?: number | null;
  remittance_purpose_id?: number | null;
  source_income_id?: number | null;
  send_currency: string;
  receive_currency: string;
  sent_amount?: number;
  receive_amount?: number;
  extra_fees_applied_percent: number;
  is_all_included_in_send_amount: boolean;
  do_calculate_from_receive_amount: boolean;
}

// Transaction Preview by Reference (for edit mode)
export interface TransactionPreviewByRefPayload {
  transaction_reference: string;
  send_amount?: number;
  receive_amount?: number;
  send_currency: string;
  receive_currency: string;
  extra_fees_applied_percent: number;
  is_all_included_in_send_amount: boolean;
  do_calculate_from_receive_amount: boolean;
  remittance_method_id?: number | null;
  payout_agent_id?: number | null;
}

export interface TransactionPreviewData {
  send_amount: number;
  send_currency_code: string;
  total_commission: number;
  send_agent_commission: number;
  extra_fees: number;
  total_paypal_amount: number;
  platform_exchange_rate: number;
  receive_amount: number;
  receive_currency_code: string;
  recipient_net_amount: number;
}

export interface TransactionPreviewResponse {
  status: boolean;
  message: string;
  data: TransactionPreviewData;
  errors: null | Record<string, string[]>;
}
