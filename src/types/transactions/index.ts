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
}

export interface ExtraTransactionsResponse {
  status: boolean;
  message: string;
  data: ExtraTransaction[];
  errors: null | Record<string, string[]>;
}
