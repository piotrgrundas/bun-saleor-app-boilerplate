const CURRENCY_DECIMALS: Record<string, number> = {
  BHD: 3,
  BIF: 0,
  CLF: 4,
  CLP: 0,
  CVE: 0,
  DJF: 0,
  GNF: 0,
  IQD: 3,
  ISK: 0,
  JOD: 3,
  JPY: 0,
  KMF: 0,
  KRW: 0,
  KWD: 3,
  LYD: 3,
  OMR: 3,
  PYG: 0,
  RWF: 0,
  TND: 3,
  UGX: 0,
  UYI: 0,
  VND: 0,
  VUV: 0,
  XAF: 0,
  XOF: 0,
  XPF: 0,
};

export function getCurrencyDecimals(currency: string): number {
  return CURRENCY_DECIMALS[currency.toUpperCase()] ?? 2;
}

export function toCents(amount: number, currency: string): number {
  const decimals = getCurrencyDecimals(currency);
  return Math.round(amount * 10 ** decimals);
}

export function fromCents(cents: number, currency: string): number {
  const decimals = getCurrencyDecimals(currency);
  return cents / 10 ** decimals;
}
