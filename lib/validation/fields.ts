import { z } from "zod";
import { documentFormats } from "@/data/form-options";
import { LIFE_MAX_AGE, LIFE_MIN_AGE } from "@/data/life-tariffs";
import { unformat, unformatAmount } from "@/lib/input-format";

/*
 * Shared field rules. Messages are keys of the `Validation` namespace, so one
 * schema serves every locale and the UI translates them with `t(key)`.
 */
export const VALIDATION_KEYS = [
  "required",
  "selectOption",
  "name",
  "fullName",
  "phone",
  "email",
  "plate",
  "fin",
  "voen",
  "idNumber",
  "registrationCertificate",
  "drivingLicence",
  "year",
  "amount",
  "date",
  "datePast",
  "dateRange",
  "endBeforeStart",
  "tripLength",
  "travelers",
  "age",
  "consent",
  "tooLong",
  "tooShort",
] as const;

export type ValidationKey = (typeof VALIDATION_KEYS)[number];

export function isValidationKey(value: unknown): value is ValidationKey {
  return typeof value === "string" && (VALIDATION_KEYS as readonly string[]).includes(value);
}

export const k = (key: ValidationKey) => key;

export const requiredText = (max: number) => z.string().trim().min(1, k("required")).max(max, k("tooLong"));

export const optionalText = (max: number) => z.string().trim().max(max, k("tooLong"));

export const choice = <const T extends readonly [string, ...string[]]>(values: T) =>
  z.enum(values, { error: k("selectOption") });

export const nameField = requiredText(60).refine((v) => /^[\p{L}\s'’-]+$/u.test(v), k("name"));

export const fullNameField = requiredText(100)
  .refine((v) => /^[\p{L}\s'’-]+$/u.test(v), k("name"))
  .refine((v) => v.split(/\s+/).filter(Boolean).length >= 2, k("fullName"));

/* -------------------------------------------------------------------------- */
/*  Phone (Azerbaijan)                                                        */
/* -------------------------------------------------------------------------- */

/** Mobile operators and landline area codes (0 + 2 digits + 7 digits). */
const PHONE_PATTERN = /^0(10|12|18|2\d|3\d|40|44|50|51|55|60|70|77|99)\d{7}$/;

export function normalizeAzPhone(value: string): string | null {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("994")) digits = `0${digits.slice(3)}`;
  return PHONE_PATTERN.test(digits) ? `+994${digits.slice(1)}` : null;
}

export const phoneField = z
  .string()
  .trim()
  .min(1, k("required"))
  .refine((v) => normalizeAzPhone(v) !== null, k("phone"));

export const optionalEmailField = z
  .string()
  .trim()
  .max(120, k("tooLong"))
  .refine((v) => v === "" || z.email().safeParse(v).success, k("email"));

/* -------------------------------------------------------------------------- */
/*  Numbers & dates                                                           */
/* -------------------------------------------------------------------------- */

export const yearField = z
  .string()
  .trim()
  .min(1, k("required"))
  .refine((v) => {
    if (!/^\d{4}$/.test(v)) return false;
    const year = Number(v);
    return year >= 1950 && year <= new Date().getFullYear() + 1;
  }, k("year"));

export const amountField = z
  .string()
  .trim()
  .min(1, k("required"))
  .refine((v) => unformatAmount(v) > 0, k("amount"));

/** Age of the insured person, within the life tariff bands. */
export const ageField = z
  .string()
  .trim()
  .min(1, k("required"))
  .refine((v) => /^\d{1,3}$/.test(v) && Number(v) >= LIFE_MIN_AGE && Number(v) <= LIFE_MAX_AGE, k("age"));

/** A real calendar date in `YYYY-MM-DD` form. */
export const isoDateField = z
  .string()
  .min(1, k("date"))
  .refine((v) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
    const [y, m, d] = v.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
  }, k("date"));

export const consentField = z.boolean().refine((v) => v, k("consent"));

/* -------------------------------------------------------------------------- */
/*  Documents                                                                 */
/* -------------------------------------------------------------------------- */

const documentField = (format: { pattern: RegExp }, key: ValidationKey) =>
  z
    .string()
    .trim()
    .min(1, k("required"))
    .refine((v) => format.pattern.test(unformat(v)), key);

export const plateField = documentField(documentFormats.plate, "plate");
export const finField = documentField(documentFormats.fin, "fin");
export const voenField = documentField(documentFormats.voen, "voen");
export const registrationCertificateField = documentField(
  documentFormats.registrationCertificate,
  "registrationCertificate",
);
export const drivingLicenceField = documentField(documentFormats.drivingLicence, "drivingLicence");
