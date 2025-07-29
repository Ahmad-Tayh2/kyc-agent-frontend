export const CURRENCY_COUNTRY_CODE: Record<string, string> = {
  AFN: 'AF', // Afghanistan
  ALL: 'AL',
  AMD: 'AM',
  ANG: 'CW', // Curaçao (Netherlands Antilles)
  AOA: 'AO',
  ARS: 'AR',
  AUD: 'AU',
  AWG: 'AW',
  AZN: 'AZ',
  BAM: 'BA',
  BBD: 'BB',
  BDT: 'BD',
  BGN: 'BG',
  BHD: 'BH',
  BIF: 'BI',
  BMD: 'BM',
  BND: 'BN',
  BOB: 'BO',
  BRL: 'BR',
  BSD: 'BS',
  BTN: 'BT',
  BWP: 'BW',
  BYN: 'BY',
  BZD: 'BZ',
  CAD: 'CA',
  CDF: 'CD',
  CHF: 'CH',
  CLP: 'CL',
  CNY: 'CN',
  COP: 'CO',
  CRC: 'CR',
  CUP: 'CU',
  CVE: 'CV',
  CZK: 'CZ',
  DJF: 'DJ',
  DKK: 'DK',
  DOP: 'DO',
  DZD: 'DZ',
  EGP: 'EG',
  ERN: 'ER',
  ETB: 'ET',
  EUR: 'EU', // Special case for Euro
  FJD: 'FJ',
  FKP: 'FK',
  FOK: 'FO',
  GBP: 'GB',
  GEL: 'GE',
  GGP: 'GG',
  GHS: 'GH',
  GIP: 'GI',
  GMD: 'GM',
  GNF: 'GN',
  GTQ: 'GT',
  GYD: 'GY',
  HKD: 'HK',
  HNL: 'HN',
  HRK: 'HR',
  HTG: 'HT',
  HUF: 'HU',
  IDR: 'ID',
  ILS: 'IL',
  IMP: 'IM',
  INR: 'IN',
  IQD: 'IQ',
  IRR: 'IR',
  ISK: 'IS',
  JEP: 'JE',
  JMD: 'JM',
  JOD: 'JO',
  JPY: 'JP',
  KES: 'KE',
  KGS: 'KG',
  KHR: 'KH',
  KID: 'KI',
  KMF: 'KM',
  KRW: 'KR',
  KWD: 'KW',
  KYD: 'KY',
  KZT: 'KZ',
  LAK: 'LA',
  LBP: 'LB',
  LKR: 'LK',
  LRD: 'LR',
  LSL: 'LS',
  LYD: 'LY',
  MAD: 'MA',
  MDL: 'MD',
  MGA: 'MG',
  MKD: 'MK',
  MMK: 'MM',
  MNT: 'MN',
  MOP: 'MO',
  MRU: 'MR',
  MUR: 'MU',
  MVR: 'MV',
  MWK: 'MW',
  MXN: 'MX',
  MYR: 'MY',
  MZN: 'MZ',
  NAD: 'NA',
  NGN: 'NG',
  NIO: 'NI',
  NOK: 'NO',
  NPR: 'NP',
  NZD: 'NZ',
  OMR: 'OM',
  PAB: 'PA',
  PEN: 'PE',
  PGK: 'PG',
  PHP: 'PH',
  PKR: 'PK',
  PLN: 'PL',
  PYG: 'PY',
  QAR: 'QA',
  RON: 'RO',
  RSD: 'RS',
  RUB: 'RU',
  RWF: 'RW',
  SAR: 'SA',
  SBD: 'SB',
  SCR: 'SC',
  SDG: 'SD',
  SEK: 'SE',
  SGD: 'SG',
  SHP: 'SH',
  SLE: 'SL',
  SLL: 'SL',
  SOS: 'SO',
  SRD: 'SR',
  SSP: 'SS',
  STN: 'ST',
  SYP: 'SY',
  SZL: 'SZ',
  THB: 'TH',
  TJS: 'TJ',
  TMT: 'TM',
  TND: 'TN',
  TOP: 'TO',
  TRY: 'TR',
  TTD: 'TT',
  TVD: 'TV',
  TWD: 'TW',
  TZS: 'TZ',
  UAH: 'UA',
  UGX: 'UG',
  USD: 'US',
  UYU: 'UY',
  UZS: 'UZ',
  VES: 'VE',
  VND: 'VN',
  VUV: 'VU',
  WST: 'WS',
  XAF: 'CM', // Used in Central Africa (Cameroon as example)
  XCD: 'AG', // Eastern Caribbean (Antigua & Barbuda)
  XOF: 'SN', // West Africa (Senegal)
  XPF: 'PF', // CFP Franc (French Polynesia)
  YER: 'YE',
  ZAR: 'ZA',
  ZMW: 'ZM',
  ZWL: 'ZW',

  // Cryptos (no country flag)
  BTC: '',
  ETH: '',
  USDT: '',

  DEFAULT: '',
};

/**
 * Get country code for a currency code (to be used with ReactCountryFlag)
 * @param currencyCode - The currency code (e.g., 'USD', 'EUR')
 * @returns The country code for the currency or empty string
 */
export const getCurrencyFlag = (currencyCode: string): string => {
  return (
    CURRENCY_COUNTRY_CODE[currencyCode.toUpperCase()] ||
    CURRENCY_COUNTRY_CODE.DEFAULT
  );
};

/**
 * Get all available currency codes
 * @returns Array of all currency codes
 */
export const getAllCurrencyCodes = (): string[] => {
  return Object.keys(CURRENCY_COUNTRY_CODE).filter(
    (code) => code !== 'DEFAULT'
  );
};

/**
 * Check if a currency code has a flag
 * @param currencyCode - The currency code to check
 * @returns True if the currency has a flag, false otherwise
 */
export const hasCurrencyFlag = (currencyCode: string): boolean => {
  return (
    currencyCode.toUpperCase() in CURRENCY_COUNTRY_CODE &&
    currencyCode.toUpperCase() !== 'DEFAULT'
  );
};
