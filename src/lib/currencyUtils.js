export const CURRENCY_CONFIG = {
  USD: { symbol: "$", rate: 1.0, locale: "en-US" },
  INR: { symbol: "₹", rate: 83.25, locale: "en-IN" },
  EUR: { symbol: "€", rate: 0.93, locale: "de-DE" },
  GBP: { symbol: "£", rate: 0.80, locale: "en-GB" },
  JPY: { symbol: "¥", rate: 154.50, locale: "ja-JP" },
  AED: { symbol: "د.إ", rate: 3.67, locale: "ar-AE" },
  SGD: { symbol: "S$", rate: 1.35, locale: "en-SG" },
  AUD: { symbol: "A$", rate: 1.55, locale: "en-AU" },
  THB: { symbol: "฿", rate: 35.50, locale: "th-TH" },
  KRW: { symbol: "₩", rate: 1340.0, locale: "ko-KR" },
  CHF: { symbol: "Fr", rate: 0.88, locale: "de-CH" },
  MXN: { symbol: "MX$", rate: 17.15, locale: "es-MX" },
};

export const formatCurrency = (amount, code = "USD") => {
  const config = CURRENCY_CONFIG[code];
  if (!config) {
    return `$${Math.round(amount).toLocaleString()}`;
  }
  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: code,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const convertFromUSD = (usdAmount, targetCode) => {
  const config = CURRENCY_CONFIG[targetCode];
  return usdAmount * (config?.rate || 1);
};

export const convertToUSD = (amount, sourceCode) => {
  const config = CURRENCY_CONFIG[sourceCode];
  return amount / (config?.rate || 1);
};

export const parsePriceToUSD = (priceStr) => {
  if (typeof priceStr !== 'string') return priceStr;
  const numeric = parseFloat(priceStr.replace(/[^0-9.]/g, ""));
  return isNaN(numeric) ? 0 : numeric;
};
