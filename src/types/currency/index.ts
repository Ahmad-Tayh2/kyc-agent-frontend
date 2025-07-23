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
  to_wallet_currency_id: number;
  from_amount: number;
}

export interface ExchangeMoneyResponse {
  status: boolean;
  message: string;
  data: unknown;
  errors: null | Record<string, string[]>;
}
