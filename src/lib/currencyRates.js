// Static offline exchange rates (INR as base = 1 INR)
// 1 INR = X of each currency
export const RATES_FROM_INR = {
  INR: 1,
  USD: 0.01201,
  EUR: 0.01103,
  GBP: 0.00950,
  JPY: 1.784,
  AED: 0.04411,
  CHF: 0.01082,
  IDR: 196.2,
};

// Human-readable labels
export const CURRENCY_META = {
  INR: { symbol: "₹", name: "Indian Rupee",    flag: "🇮🇳" },
  USD: { symbol: "$", name: "US Dollar",       flag: "🇺🇸" },
  EUR: { symbol: "€", name: "Euro",            flag: "🇪🇺" },
  GBP: { symbol: "£", name: "British Pound",  flag: "🇬🇧" },
  JPY: { symbol: "¥", name: "Japanese Yen",   flag: "🇯🇵" },
  AED: { symbol: "د.إ", name: "UAE Dirham",   flag: "🇦🇪" },
  CHF: { symbol: "Fr", name: "Swiss Franc",   flag: "🇨🇭" },
  IDR: { symbol: "Rp", name: "Indonesian Rupiah", flag: "🇮🇩" },
};

// Venue location keyword → default currency mapping
export const VENUE_CURRENCY = {
  mumbai: "INR", ahmedabad: "INR", india: "INR", modi: "INR", dypatil: "INR",
  barcelona: "EUR", madrid: "EUR", spain: "EUR", campnou: "EUR", bernabeu: "EUR",
  london: "GBP", uk: "GBP", wembley: "GBP",
  usa: "USD", metlife: "USD", rutherford: "USD",
};

/**
 * Convert an amount from one currency to another using INR as bridge.
 * @param {number} amount
 * @param {string} from  e.g. "INR"
 * @param {string} to    e.g. "USD"
 */
export function convertCurrency(amount, from, to) {
  if (!amount || from === to) return amount;
  const amountInINR = from === "INR" ? amount : amount / RATES_FROM_INR[from];
  return to === "INR" ? amountInINR : amountInINR * RATES_FROM_INR[to];
}

/**
 * Returns the default currency code for a venue location or name.
 */
export function getCurrencyForVenue(venueName = "") {
  const lower = venueName.toLowerCase();
  for (const [key, code] of Object.entries(VENUE_CURRENCY)) {
    if (lower.includes(key)) return code;
  }
  return "USD";
}

/**
 * Format a number with its currency symbol.
 */
export function formatAmount(amount, currencyCode) {
  const meta = CURRENCY_META[currencyCode] || { symbol: currencyCode };
  const num = Number(amount);
  if (!isFinite(num)) return `${meta.symbol}0`;
  if (Math.abs(num) >= 1000000) return `${meta.symbol}${(num / 1000000).toFixed(2)}M`;
  if (Math.abs(num) >= 1000) return `${meta.symbol}${num.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  return `${meta.symbol}${num.toFixed(2)}`;
}
