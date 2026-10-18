/**
 * Formats an integer amount in the currency's minor unit (as stored by the
 * backend) for display, e.g. 150000 EGP → 1,500.00 EGP in the locale's style.
 * Uses the currency's own exponent, so it stays correct for zero-decimal
 * (JPY) and three-decimal (KWD) currencies.
 */
export function formatPrice(minorUnits: number, currency: string, locale = "ar-EG"): string {
  const formatter = new Intl.NumberFormat(locale, { style: "currency", currency });
  const fractionDigits = formatter.resolvedOptions().maximumFractionDigits ?? 2;

  return formatter.format(minorUnits / 10 ** fractionDigits);
}
