export interface Transfer {
  id: number;
  user_id: number;
  customer_id: number;
  recipient_id: number;
  remittance_method_id: number;
  send_country_id: number;
  receive_country_id: number;
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
  created_at: string;
  updated_at: string;
}

export type TransferStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled"
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
  remittance_method_id: number;
  send_country_id: number;
  receive_country_id: number;
  remittance_purpose_id: number;
  source_income_id: number;
  payment_method?: string;
  comment?: string;
  send_currency: string;
  receive_currency: string;
  sent_amount_in_send_currency: number;
  sent_amount_in_default_currency: number;
  receive_amount_in_send_currency: number;
  receive_amount_in_default_currency?: number;
  sending_agent_commission_currency?: string;
  payout_agent_commission_percent?: number;
  payout_agent_commission_amount?: number;
  payout_agent_commission_currency?: string;
  nomadrem_commission_amount?: number;
  extra_fees_amount?: number;
  total_commission_amount?: number;
  payout_amount: number;
}
export interface TransactionCreateDataType {}

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
  payout_amount: number;
  created_at: string;
  updated_at: string;
};
export interface TransactionCreateDataType {
  customer_id: number;
  recipient_id: number;
  remittance_method_id: number;
  send_country_id: number;
  receive_country_id: number;
  remittance_purpose_id: number;
  source_income_id: number;
  payment_method?: string;
  comment?: string;
  send_currency: string;
  receive_currency: string;
  sent_amount_in_send_currency: number;
  sent_amount_in_default_currency: number;
  receive_amount_in_send_currency: number;
  receive_amount_in_default_currency?: number;
  sending_agent_commission_currency?: string;
  payout_agent_commission_percent?: number;
  payout_agent_commission_amount?: number;
  payout_agent_commission_currency?: string;
  nomadrem_commission_amount?: number;
  extra_fees_amount?: number;
  total_commission_amount?: number;
  payout_amount: number;
}
