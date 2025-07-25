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

export interface WalletCurrency {
  id: number;
  wallet_id: number;
  currency_id: number;
  amount: string;
  created_at: string;
  updated_at: string;
  currency: Currency;
}

export interface Wallet {
  id: number;
  agent_id: number;
  created_at: string;
  updated_at: string;
  wallet_currencies: WalletCurrency[];
}

export interface WalletResponse {
  status: boolean;
  message: string;
  data: Wallet;
  errors: null | Record<string, string[]>;
}
