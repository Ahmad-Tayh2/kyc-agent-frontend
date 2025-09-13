export interface Currency {
  id: number;
  name: string;
  code: string;
  symbol: string;
  type: string;
  market_rate: number;
  platform_rate: number;
  default: boolean;
  is_enabled: boolean;
  is_rate_auto: boolean;
  rate_updated_at: string;
  created_at: string;
  updated_at: string;
}

export interface CurrenciesResponse {
  status: boolean;
  message: string;
  data: Currency[];
  errors: null | Record<string, string[]>;
}

export interface ExchangeMoneyPayload {
  from_wallet_currency_id: number;
  to_currency_id: number;
  from_amount: number;
}

export interface ExchangeMoneyResponse {
  status: boolean;
  message: string;
  data: unknown;
  errors: null | Record<string, string[]>;
}

export interface ExchangePreviewPayload {
  from_wallet_currency_id: number;
  to_currency_id: number;
  from_amount: number;
}

export interface ExchangePreviewAnyPayload {
  from_currency_id: number;
  to_currency_id: number;
  from_amount: number;
}

export interface ExchangePreviewCurrency {
  id: number;
  code: string;
  name: string;
  available_amount?: number;
}

export interface ExchangePreviewDetails {
  from_amount: number;
  to_amount: number;
  applied_exchange_rate: number;
  market_rate: number;
  margin_percentage: number;
  margin_amount: number;
}

export interface ExchangePreviewData {
  from_currency: ExchangePreviewCurrency;
  to_currency: ExchangePreviewCurrency;
  sufficient_balance: boolean;
  exchange_details: ExchangePreviewDetails;
}

export interface ExchangePreviewResponse {
  status: boolean;
  message: string;
  data: ExchangePreviewData;
  errors: null | Record<string, string[]>;
}
