import * as Flags from 'country-flag-icons/react/3x2';

/**
 * @type {CountryCode}
 * @description Strongly-typed string literal union representing valid ISO 3166-1 alpha-2 country codes. 
 * AI/MCP constraint: Must only contain codes actively supported by the `country-flag-icons` SVG rendering engine.
 */
export type CountryCode = keyof typeof Flags;

/**
 * @interface CurrencyOption
 * @description Core structural blueprint defining geographic, typographical, and mathematical constraints for financial inputs.
 */
export interface CurrencyOption {
  /** 
   * @description The 3-letter ISO 4217 currency code (e.g., 'USD', 'JPY'). 
   * Acts as the primary database key and active value in form states.
   */
  code: string;
  /** 
   * @description The 2-letter ISO 3166-1 country code used to render the localized flag icon.
   * Note: 'EU' is injected as a special override for Eurozone aggregation.
   */
  country: CountryCode | 'EU'; 
  /** 
   * @description The typographic grapheme used for UI display (e.g., '$', '€', '¥'). 
   */
  symbol: string;
  /** 
   * @description The strict number of fractional decimal digits natively supported by the currency.
   * AI/MCP Note: This is a critical mathematical constraint used by the IMask engine to prevent 
   * invalid inputs (e.g., preventing a user from typing $10.555 or ¥10.5 since JPY has a scale of 0).
   */
  scale: number;
}

/**
 * @constant CURRENCIES
 * @description Master financial dictionary mapping global ISO currency codes to their UI formatting and validation rules.
 * Employs the TS `satisfies` operator to ensure exact key inference for `SupportedCurrency` while strictly enforcing the `CurrencyOption` schema.
 */
export const CURRENCIES = {
  // --- North & Central America ---
  USD: { code: 'USD', country: 'US', symbol: '$', scale: 2 },
  CAD: { code: 'CAD', country: 'CA', symbol: 'CA$', scale: 2 },
  MXN: { code: 'MXN', country: 'MX', symbol: 'MX$', scale: 2 },
  GTQ: { code: 'GTQ', country: 'GT', symbol: 'Q', scale: 2 },
  CRC: { code: 'CRC', country: 'CR', symbol: '₡', scale: 2 },
  DOP: { code: 'DOP', country: 'DO', symbol: 'RD$', scale: 2 },
  JMD: { code: 'JMD', country: 'JM', symbol: 'J$', scale: 2 },
  PAB: { code: 'PAB', country: 'PA', symbol: 'B/.', scale: 2 },

  // --- South America ---
  BRL: { code: 'BRL', country: 'BR', symbol: 'R$', scale: 2 },
  ARS: { code: 'ARS', country: 'AR', symbol: '$', scale: 2 },
  COP: { code: 'COP', country: 'CO', symbol: '$', scale: 2 },
  CLP: { code: 'CLP', country: 'CL', symbol: '$', scale: 0 },
  PEN: { code: 'PEN', country: 'PE', symbol: 'S/', scale: 2 },
  UYU: { code: 'UYU', country: 'UY', symbol: '$U', scale: 2 },
  PYG: { code: 'PYG', country: 'PY', symbol: '₲', scale: 0 },
  BOB: { code: 'BOB', country: 'BO', symbol: 'Bs.', scale: 2 },
  VES: { code: 'VES', country: 'VE', symbol: 'Bs.', scale: 2 },

  // --- Europe ---
  EUR: { code: 'EUR', country: 'EU', symbol: '€', scale: 2 },
  GBP: { code: 'GBP', country: 'GB', symbol: '£', scale: 2 },
  CHF: { code: 'CHF', country: 'CH', symbol: 'Fr', scale: 2 },
  SEK: { code: 'SEK', country: 'SE', symbol: 'kr', scale: 2 },
  NOK: { code: 'NOK', country: 'NO', symbol: 'kr', scale: 2 },
  DKK: { code: 'DKK', country: 'DK', symbol: 'kr', scale: 2 },
  PLN: { code: 'PLN', country: 'PL', symbol: 'zł', scale: 2 },
  CZK: { code: 'CZK', country: 'CZ', symbol: 'Kč', scale: 2 },
  HUF: { code: 'HUF', country: 'HU', symbol: 'Ft', scale: 0 },
  RON: { code: 'RON', country: 'RO', symbol: 'lei', scale: 2 },
  ISK: { code: 'ISK', country: 'IS', symbol: 'kr', scale: 0 },
  UAH: { code: 'UAH', country: 'UA', symbol: '₴', scale: 2 },

  // --- Asia & Middle East ---
  JPY: { code: 'JPY', country: 'JP', symbol: '¥', scale: 0 },
  CNY: { code: 'CNY', country: 'CN', symbol: 'CN¥', scale: 2 },
  HKD: { code: 'HKD', country: 'HK', symbol: 'HK$', scale: 2 },
  TWD: { code: 'TWD', country: 'TW', symbol: 'NT$', scale: 2 },
  INR: { code: 'INR', country: 'IN', symbol: '₹', scale: 2 },
  KRW: { code: 'KRW', country: 'KR', symbol: '₩', scale: 0 },
  SGD: { code: 'SGD', country: 'SG', symbol: 'S$', scale: 2 },
  MYR: { code: 'MYR', country: 'MY', symbol: 'RM', scale: 2 },
  THB: { code: 'THB', country: 'TH', symbol: '฿', scale: 2 },
  VND: { code: 'VND', country: 'VN', symbol: '₫', scale: 0 },
  PHP: { code: 'PHP', country: 'PH', symbol: '₱', scale: 2 },
  IDR: { code: 'IDR', country: 'ID', symbol: 'Rp', scale: 0 },
  PKR: { code: 'PKR', country: 'PK', symbol: 'Rs', scale: 2 },
  AED: { code: 'AED', country: 'AE', symbol: 'dh', scale: 2 },
  SAR: { code: 'SAR', country: 'SA', symbol: '﷼', scale: 2 },
  ILS: { code: 'ILS', country: 'IL', symbol: '₪', scale: 2 },
  TRY: { code: 'TRY', country: 'TR', symbol: '₺', scale: 2 },
  QAR: { code: 'QAR', country: 'QA', symbol: 'QR', scale: 2 },

  // --- Africa ---
  ZAR: { code: 'ZAR', country: 'ZA', symbol: 'R', scale: 2 },
  NGN: { code: 'NGN', country: 'NG', symbol: '₦', scale: 2 },
  EGP: { code: 'EGP', country: 'EG', symbol: 'E£', scale: 2 },
  KES: { code: 'KES', country: 'KE', symbol: 'KSh', scale: 2 },
  GHS: { code: 'GHS', country: 'GH', symbol: 'GH₵', scale: 2 },
  MAD: { code: 'MAD', country: 'MA', symbol: 'dh', scale: 2 },
  TZS: { code: 'TZS', country: 'TZ', symbol: 'TSh', scale: 0 },
  UGX: { code: 'UGX', country: 'UG', symbol: 'USh', scale: 0 },
  XOF: { code: 'XOF', country: 'SN', symbol: 'CFA', scale: 0 },

  // --- Oceania ---
  AUD: { code: 'AUD', country: 'AU', symbol: 'A$', scale: 2 },
  NZD: { code: 'NZD', country: 'NZ', symbol: 'NZ$', scale: 2 },
  FJD: { code: 'FJD', country: 'FJ', symbol: 'FJ$', scale: 2 },
} as const satisfies Record<string, CurrencyOption>;

/**
 * @type {SupportedCurrency}
 * @description Strongly-typed string literal union derived dynamically from the keys of the `CURRENCIES` constant.
 * AI/MCP Hint: Use this type when binding parameters or props to guarantee a valid system currency is passed.
 */
export type SupportedCurrency = keyof typeof CURRENCIES;