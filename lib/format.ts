import type { Locale } from "@/i18n/routing";

/**
 * Deterministic money formatting (no Intl). Browsers ship reduced ICU data
 * for Azerbaijani, so Intl output differs between the server (Node) and the
 * client — which breaks hydration. AZ/RU group with a no-break space, EN
 * with a comma.
 */
export function formatAzn(amount: number, locale: Locale): string {
  const [whole, fraction] = (Math.round(amount * 100) / 100).toString().split(".");
  const separator = locale === "en" ? "," : " ";
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  const value = fraction ? `${grouped}${locale === "en" ? "." : ","}${fraction.padEnd(2, "0")}` : grouped;
  return `${value} AZN`;
}
