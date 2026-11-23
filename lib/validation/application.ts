import { z } from "zod";
import { daysBetweenInclusive, todayISO } from "@/lib/date";
import { INSURANCE_SLUGS, type InsuranceSlug } from "@/types/insurance";

/*
 * Error messages are translation keys from the `Validation` namespace, so the
 * same schema serves every locale. The UI resolves them with `t(key)`.
 */
export const VALIDATION_KEYS = [
  "required",
  "selectType",
  "selectOption",
  "fullName",
  "phone",
  "email",
  "plate",
  "year",
  "amount",
  "engine",
  "date",
  "datePast",
  "dateRange",
  "endBeforeStart",
  "tripLength",
  "travelers",
  "age",
  "coverage",
  "consent",
  "tooLong",
  "tooShort",
] as const;
export type ValidationKey = (typeof VALIDATION_KEYS)[number];

export function isValidationKey(value: unknown): value is ValidationKey {
  return typeof value === "string" && (VALIDATION_KEYS as readonly string[]).includes(value);
}

export const VEHICLE_TYPES = ["car", "truck", "bus", "motorcycle", "other"] as const;
export const CASCO_COVERAGE = ["essential", "standard", "comprehensive", "advice"] as const;
export const PROPERTY_TYPES = ["apartment", "house", "country", "commercial"] as const;
export const PROPERTY_COVERAGE = ["fire", "water", "natural", "theft", "liability"] as const;
export const LIFE_TERMS = ["y1", "y5", "y10", "y15", "y20"] as const;

export type VehicleType = (typeof VEHICLE_TYPES)[number];
export type CascoCoverage = (typeof CASCO_COVERAGE)[number];
export type PropertyType = (typeof PROPERTY_TYPES)[number];
export type PropertyCoverage = (typeof PROPERTY_COVERAGE)[number];
export type LifeTerm = (typeof LIFE_TERMS)[number];

export const MAX_TRAVELERS = 10;
export const MAX_TRIP_DAYS = 365;
/** How far ahead a trip may start. */
export const MAX_BOOKING_DAYS = 730;

/* -------------------------------------------------------------------------- */
/*  Field helpers                                                             */
/* -------------------------------------------------------------------------- */

const k = (key: ValidationKey) => key;

const requiredText = (max: number) => z.string().trim().min(1, k("required")).max(max, k("tooLong"));

const optionalText = (max: number) => z.string().trim().max(max, k("tooLong"));

/** Accepts 070 609 29 69, 0706092969, +994 70 609 29 69, 994706092969. */
export function normalizeAzPhone(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  if (/^994\d{9}$/.test(digits)) return `+${digits}`;
  if (/^0\d{9}$/.test(digits)) return `+994${digits.slice(1)}`;
  if (/^\d{9}$/.test(digits)) return `+994${digits}`;
  return null;
}

const parseAmount = (value: string) => Number(value.replace(/\s/g, "").replace(",", "."));

const yearField = z
  .string()
  .trim()
  .min(1, k("required"))
  .refine((v) => {
    if (!/^\d{4}$/.test(v)) return false;
    const year = Number(v);
    return year >= 1950 && year <= new Date().getFullYear() + 1;
  }, k("year"))
  .transform(Number);

const amountField = z
  .string()
  .trim()
  .min(1, k("required"))
  .refine((v) => {
    const cleaned = v.replace(/\s/g, "");
    return /^\d+([.,]\d{1,2})?$/.test(cleaned) && parseAmount(v) > 0;
  }, k("amount"))
  .transform(parseAmount);

const selectField = <const T extends readonly [string, ...string[]]>(values: T) =>
  z.enum(values, { error: k("selectOption") });

/* -------------------------------------------------------------------------- */
/*  Shared contact block                                                      */
/* -------------------------------------------------------------------------- */

const contactShape = {
  fullName: z
    .string()
    .trim()
    .min(1, k("required"))
    .max(100, k("tooLong"))
    .refine((v) => v.split(/\s+/).filter(Boolean).length >= 2, k("fullName")),
  phone: z
    .string()
    .trim()
    .min(1, k("required"))
    .refine((v) => normalizeAzPhone(v) !== null, k("phone"))
    .transform((v) => normalizeAzPhone(v) as string),
  email: z
    .string()
    .trim()
    .max(120, k("tooLong"))
    .refine((v) => v === "" || z.email().safeParse(v).success, k("email")),
  additionalInfo: optionalText(1000),
  consent: z.boolean().refine((v) => v, k("consent")),
};

/* -------------------------------------------------------------------------- */
/*  Product-specific blocks                                                   */
/* -------------------------------------------------------------------------- */

const carInsuranceSchema = z.object({
  insuranceType: z.literal("car-insurance"),
  registrationNumber: z
    .string()
    .trim()
    .min(1, k("required"))
    .refine((v) => /^\d{2}\s*-?\s*[a-zA-Z]{2}\s*-?\s*\d{3}$/.test(v), k("plate"))
    .transform((v) => {
      const compact = v.replace(/[\s-]/g, "").toUpperCase();
      return `${compact.slice(0, 2)}-${compact.slice(2, 4)}-${compact.slice(4)}`;
    }),
  brandModel: requiredText(80),
  year: yearField,
  vehicleType: selectField(VEHICLE_TYPES),
  engineVolume: z
    .string()
    .trim()
    .refine((v) => v === "" || (/^\d{2,5}$/.test(v) && Number(v) >= 50 && Number(v) <= 20000), k("engine"))
    .transform((v) => (v === "" ? null : Number(v))),
  ...contactShape,
});

const cascoSchema = z.object({
  insuranceType: z.literal("casco"),
  brandModel: requiredText(80),
  year: yearField,
  vehicleValue: amountField,
  cascoCoverage: selectField(CASCO_COVERAGE),
  ...contactShape,
});

/** A real calendar date in `YYYY-MM-DD` form (rejects e.g. 5-digit years). */
const isoDateField = z
  .string()
  .min(1, k("date"))
  .refine((v) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
    const [y, m, d] = v.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
  }, k("date"));

const travelSchema = z
  .object({
    insuranceType: z.literal("travel"),
    destination: requiredText(80).refine((v) => v.length >= 2, k("tooShort")),
    startDate: isoDateField,
    endDate: isoDateField,
    travelers: z.number().int().min(1, k("travelers")).max(MAX_TRAVELERS, k("travelers")),
    ...contactShape,
  })
  .superRefine((value, ctx) => {
    const today = todayISO();
    const start = value.startDate;
    const end = value.endDate;
    const wellFormed = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v);
    if (!wellFormed(start)) return;
    if (start < today) {
      ctx.addIssue({ code: "custom", path: ["startDate"], message: k("datePast") });
    } else if ((daysBetweenInclusive(today, start) ?? 0) > MAX_BOOKING_DAYS) {
      ctx.addIssue({ code: "custom", path: ["startDate"], message: k("dateRange") });
    }
    if (!wellFormed(end)) return;
    if (end < start) {
      ctx.addIssue({ code: "custom", path: ["endDate"], message: k("endBeforeStart") });
    } else if ((daysBetweenInclusive(start, end) ?? 0) > MAX_TRIP_DAYS) {
      ctx.addIssue({ code: "custom", path: ["endDate"], message: k("tripLength") });
    }
  });

const propertySchema = z.object({
  insuranceType: z.literal("property"),
  propertyAddress: requiredText(200).refine((v) => v.length >= 5, k("tooShort")),
  propertyType: selectField(PROPERTY_TYPES),
  propertyValue: amountField,
  propertyCoverage: z.array(z.enum(PROPERTY_COVERAGE)).min(1, k("coverage")),
  ...contactShape,
});

const lifeSchema = z.object({
  insuranceType: z.literal("life"),
  age: z
    .string()
    .trim()
    .min(1, k("required"))
    .refine((v) => /^\d{1,3}$/.test(v) && Number(v) >= 18 && Number(v) <= 80, k("age"))
    .transform(Number),
  lifeTerm: selectField(LIFE_TERMS),
  ...contactShape,
});

export const applicationSchema = z.discriminatedUnion(
  "insuranceType",
  [carInsuranceSchema, cascoSchema, travelSchema, propertySchema, lifeSchema],
  { error: k("selectType") },
);

/** Validated, normalized application — what the API will receive. */
export type ApplicationData = z.output<typeof applicationSchema>;

/**
 * Flat form state: every field for every product lives in one form so users
 * can switch insurance type without losing shared answers (e.g. car details).
 * The schema strips fields that don't belong to the selected type.
 */
export interface ApplicationFormValues {
  insuranceType: InsuranceSlug | "";
  registrationNumber: string;
  brandModel: string;
  year: string;
  vehicleType: VehicleType | "";
  engineVolume: string;
  vehicleValue: string;
  cascoCoverage: CascoCoverage | "";
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  propertyAddress: string;
  propertyType: PropertyType | "";
  propertyValue: string;
  propertyCoverage: PropertyCoverage[];
  age: string;
  lifeTerm: LifeTerm | "";
  fullName: string;
  phone: string;
  email: string;
  additionalInfo: string;
  consent: boolean;
}

export const emptyApplication: ApplicationFormValues = {
  insuranceType: "",
  registrationNumber: "",
  brandModel: "",
  year: "",
  vehicleType: "",
  engineVolume: "",
  vehicleValue: "",
  cascoCoverage: "",
  destination: "",
  startDate: "",
  endDate: "",
  travelers: 1,
  propertyAddress: "",
  propertyType: "",
  propertyValue: "",
  propertyCoverage: [],
  age: "",
  lifeTerm: "",
  fullName: "",
  phone: "",
  email: "",
  additionalInfo: "",
  consent: false,
};

/** Fields validated on the "details" step, per insurance type. */
export const detailFields: Record<InsuranceSlug, (keyof ApplicationFormValues)[]> = {
  "car-insurance": ["registrationNumber", "brandModel", "year", "vehicleType", "engineVolume"],
  casco: ["brandModel", "year", "vehicleValue", "cascoCoverage"],
  travel: ["destination", "startDate", "endDate", "travelers"],
  property: ["propertyAddress", "propertyType", "propertyValue", "propertyCoverage"],
  life: ["age", "lifeTerm"],
};

export const contactFields: (keyof ApplicationFormValues)[] = [
  "fullName",
  "phone",
  "email",
  "additionalInfo",
  "consent",
];

export { INSURANCE_SLUGS };
