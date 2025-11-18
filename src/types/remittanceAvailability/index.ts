// Country types for send/receive remittance
export interface RemittanceCountry {
  id: number;
  name: string;
  iso2: string;
  iso3: string;
}

export interface RemittanceCountryResponse {
  status: boolean;
  message: string;
  data: RemittanceCountry[];
  errors: null | unknown;
}

// Remittance method types
export interface RemittanceMethodAvailability {
  id: number;
  name: string;
  type_id: number;
  description: string;
}

export interface RemittanceMethodsResponse {
  status: boolean;
  message: string;
  data: RemittanceMethodAvailability[];
  errors: null | unknown;
}

// Recipient remittance methods and payout agents
export interface RecipientPayoutAgent {
  id: number;
  recipient_id: number;
  payout_agent_id: number;
  account_number: string | null;
  country_phone_code: string | null;
  phone_number: string | null;
  payout_agent_business_name: string;
  payout_agent_code: string;
  payout_agent_address: string;
  payout_agent_service_provider_id: number;
  payout_agent_agent_id: number | null;
  payout_agent_country_code: string;
  payout_agent_currency: string;
  payout_agent_is_active: number;
}

export interface RecipientMethodsData {
  remittance_methods: RemittanceMethodAvailability[];
  payout_agents: RecipientPayoutAgent[] | null;
}

export interface RecipientMethodsResponse {
  status: boolean;
  message: string;
  data: RecipientMethodsData;
  errors: null | unknown;
}

// Query parameters
export interface RemittanceMethodsParams {
  receive_country: number;
}

export interface RecipientMethodsParams {
  receive_country: number;
}

// Currency types for send/receive countries
export interface RemittanceCurrency {
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

export interface RemittanceCurrenciesResponse {
  status: boolean;
  message: string;
  data: RemittanceCurrency[];
  errors: null | unknown;
}
