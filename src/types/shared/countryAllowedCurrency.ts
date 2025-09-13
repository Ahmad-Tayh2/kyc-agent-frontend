import type { Country } from './location';

export interface Currency {
  id: number;
  name: string;
  code: string;
  symbol: string;
}

export interface CountryAllowedCurrency {
  id: number;
  role: 'send' | 'receive';
  country: Country;
  currency: Currency;
  created_at: string;
  updated_at: string | null;
}

export interface CountryAllowedCurrenciesResponse {
  data: CountryAllowedCurrency[];
}

export interface CountryCurrency {
  id: number;
  role: 'send' | 'receive';
  currency: Currency;
  created_at: string;
  updated_at: string | null;
}

export interface CountryCurrenciesResponse {
  data: CountryCurrency[];
}

export interface CurrencyCountry {
  id: number;
  role: 'send' | 'receive';
  country: Country;
  created_at: string;
  updated_at: string | null;
}

export interface CurrencyCountriesResponse {
  data: CurrencyCountry[];
}

export type CurrencyRole = 'send' | 'receive';
