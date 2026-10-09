import { CurrencyCode } from "@/lib/types/invoice";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  decimals: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: "USD", symbol: "$", name: "US Dollar", decimals: 2 },
  EUR: { code: "EUR", symbol: "€", name: "Euro", decimals: 2 },
  GBP: { code: "GBP", symbol: "£", name: "British Pound", decimals: 2 },
  BDT: { code: "BDT", symbol: "৳", name: "Bangladeshi Taka", decimals: 2 },
  CAD: { code: "CAD", symbol: "CA$", name: "Canadian Dollar", decimals: 2 },
  AUD: { code: "AUD", symbol: "A$", name: "Australian Dollar", decimals: 2 },
  JPY: { code: "JPY", symbol: "¥", name: "Japanese Yen", decimals: 0 },
  INR: { code: "INR", symbol: "₹", name: "Indian Rupee", decimals: 2 },
  SGD: { code: "SGD", symbol: "S$", name: "Singapore Dollar", decimals: 2 },
};

export function formatCurrency(
  amount: number,
  currency: CurrencyCode = "USD",
  locale: string = "en-US"
): string {
  const config = CURRENCIES[currency] || CURRENCIES.USD;
  const safeAmount = isNaN(amount) ? 0 : amount;

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: config.code,
      minimumFractionDigits: config.decimals,
      maximumFractionDigits: config.decimals,
    }).format(safeAmount);
  } catch {
    return `${config.symbol}${safeAmount.toFixed(config.decimals)}`;
  }
}

export function getCurrencySymbol(currency: CurrencyCode = "USD"): string {
  return CURRENCIES[currency]?.symbol || "$";
}
