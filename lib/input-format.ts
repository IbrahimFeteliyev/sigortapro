/**
 * Input masks for structured fields. Each takes the raw input value and
 * returns the restricted, formatted value, so invalid characters can never
 * be typed and lengths are capped at the source.
 */

const onlyAlnum = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, "");
const onlyDigits = (value: string) => value.replace(/\D/g, "");
const onlyLetters = (value: string) => value.toUpperCase().replace(/[^A-Z]/g, "");

/** Vehicle plate `10AA100` → `10-AA-100`: digits, letters, digits by position. */
export function formatPlate(value: string): string {
  const chars = onlyAlnum(value);
  let out = "";
  for (const char of chars) {
    const position = out.length;
    if (position >= 7) break;
    const wantsDigit = position < 2 || position >= 4;
    if (wantsDigit ? /\d/.test(char) : /[A-Z]/.test(char)) out += char;
  }
  return [out.slice(0, 2), out.slice(2, 4), out.slice(4)].filter(Boolean).join("-");
}

/** FİN: 7 uppercase letters/digits. */
export function formatFin(value: string): string {
  return onlyAlnum(value).slice(0, 7);
}

/** Fixed-length numeric field (VÖEN, ID-card number…). */
export function formatDigits(value: string, max: number): string {
  return onlyDigits(value).slice(0, max);
}

/** Series + number documents, e.g. `AA 123456`: N letters, then M digits. */
export function formatSeriesNumber(value: string, letters: number, digits: number): string {
  const raw = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const series = onlyLetters(raw.replace(/\d.*$/, "")).slice(0, letters);
  const rest = series.length === letters ? onlyDigits(raw.slice(series.length)).slice(0, digits) : "";
  return rest ? `${series} ${rest}` : series;
}

/**
 * Azerbaijani phone. Local form `0XX XXX XX XX`; when the user starts with
 * `+` (typed or pasted) the international form `+994 XX XXX XX XX` is kept.
 */
export function formatPhone(value: string): string {
  const trimmed = value.trimStart();
  let digits = onlyDigits(trimmed);

  if (trimmed.startsWith("+")) {
    digits = digits.slice(0, 12);
    const parts = [
      digits.slice(0, 3),
      digits.slice(3, 5),
      digits.slice(5, 8),
      digits.slice(8, 10),
      digits.slice(10, 12),
    ];
    return `+${parts.filter(Boolean).join(" ")}`;
  }

  if (digits.startsWith("994") && digits.length > 3) digits = `0${digits.slice(3)}`;
  else if (digits.length > 0 && !digits.startsWith("0") && !"994".startsWith(digits)) digits = `0${digits}`;
  digits = digits.slice(0, 10);
  const parts = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 8), digits.slice(8, 10)];
  return parts.filter(Boolean).join(" ");
}

/** Positive amount with thousands spacing: `25000` → `25 000`. */
export function formatAmount(value: string): string {
  const digits = onlyDigits(value)
    .replace(/^0+(?=\d)/, "")
    .slice(0, 9);
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/** Letters, spaces, hyphens and apostrophes only (names). */
export function formatName(value: string): string {
  return value
    .replace(/[^\p{L}\s'’-]/gu, "")
    .replace(/\s{2,}/g, " ")
    .slice(0, 60);
}

export const unformatAmount = (value: string) => Number(onlyDigits(value));
export const unformat = onlyAlnum;
