export interface FeeCurrency {
  id: number;
  name: string;
  code: string;
}

export enum TransactionStatus {
  INITIATED = 'initiated',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

// Old ExtraTransaction type (kept for backwards compatibility)
export interface ExtraTransaction {
  id: number;
  reference_number: string;
  wallet_id: number;
  agent_id: number;
  created_by: number;
  processed_by: number | null;
  forced_by: number | null;
  type: string;
  type_label: string;
  status: TransactionStatus;
  status_label: string;
  fee_amount: number;
  fee_currency_id: number;
  is_forced: boolean;
  forced_reason: string | null;
  notes: string;
  failure_reason: string | null;
  initiated_at: string;
  processed_at: string | null;
  completed_at: string | null;
  failed_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
  is_in_progress: boolean;
  is_completed: boolean;
  is_failed: boolean;
  is_cancelled: boolean;
  fee_currency: FeeCurrency;
  currency: { id: number; name: string; code: string };
}

export interface ExtraTransactionsResponse {
  status: boolean;
  message: string;
  data: ExtraTransaction[];
  errors: null | Record<string, string[]>;
}

// New Wallet Transaction types
export type WalletTransactionType =
  | 'add_money'
  | 'exchange'
  | 'commission'
  | 'extra_fee'
  | 'remittance_payment'
  | 'withdrawal';

export type WalletTransactionDirection = 'credit' | 'debit';

export interface WalletTransactionAgent {
  id: number;
  ref: string;
  name: string;
}

export interface WalletTransactionExchange {
  from_currency: string;
  to_currency: string;
  from_amount: number | null;
  to_amount: number | null;
  fee: number | null;
  rate: number | null;
}

export interface WalletTransaction {
  id: number;
  reference_number: string;
  transaction_type: WalletTransactionType;
  direction: WalletTransactionDirection;
  created_at: string;
  amount: number;
  currency_code: string;
  notes: string | null;
  status: 'completed';
  agent: WalletTransactionAgent;
  balance_before: number;
  balance_after: number;
  // Optional fields based on transaction_type
  exchange?: WalletTransactionExchange;
  source_transaction_ref?: string;
}

export interface WalletTransactionsResponse {
  status: boolean;
  message: string;
  data: WalletTransaction[];
  errors: null | Record<string, string[]>;
}
