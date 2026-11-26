import { z } from "zod";
import {
  carAddons,
  engineCapacities,
  idCardSeries,
  MAX_BOOKING_DAYS,
  MAX_TRAVELERS,
  MAX_TRIP_DAYS,
  personTypes,
  travelDestinations,
  vehicleTypes,
} from "@/data/form-options";
import { lifeCategories, lifeCoverageAmounts, lifeTermYears } from "@/data/life-tariffs";
import { propertyRegionTariffs, propertyTypes } from "@/data/property-tariffs";
import { daysBetweenInclusive, todayISO } from "@/lib/date";
import {
  ageField,
  amountField,
  choice,
  consentField,
  drivingLicenceField,
  finField,
  fullNameField,
  isoDateField,
  k,
  nameField,
  optionalEmailField,
  phoneField,
  plateField,
  registrationCertificateField,
  requiredText,
  voenField,
  yearField,
} from "./fields";

const ids = <T extends { id: string | number }>(list: readonly T[]) =>
  list.map((item) => String(item.id)) as [string, ...string[]];

/* -------------------------------------------------------------------------- */
/*  Compulsory motor insurance (3 steps)                                      */
/* -------------------------------------------------------------------------- */

export const carInsuranceSchema = z
  .object({
    // Step 1 — vehicle
    vehicleType: choice(ids(vehicleTypes)),
    engineCapacity: choice(ids(engineCapacities)),
    year: yearField,
    // Step 2 — person & vehicle documents
    personType: choice(ids(personTypes)),
    phone: phoneField,
    email: optionalEmailField,
    fin: z.string().trim(),
    idSeries: z.string(),
    idNumber: z.string().trim(),
    voen: z.string().trim(),
    plate: plateField,
    registrationCertificate: registrationCertificateField,
    drivingLicence: z.string().trim(),
    taxi: z.boolean(),
    // Step 3 — add-ons
    addons: z.array(z.enum(ids(carAddons))),
    consent: consentField,
  })
  .superRefine((value, ctx) => {
    const issue = (path: string, result: { success: boolean; error?: z.ZodError }) => {
      if (!result.success) {
        ctx.addIssue({
          code: "custom",
          path: [path],
          message: result.error?.issues[0]?.message ?? k("required"),
        });
      }
    };
    if (value.personType === "legal") {
      issue("voen", voenField.safeParse(value.voen));
      return;
    }
    issue("fin", finField.safeParse(value.fin));
    issue("drivingLicence", drivingLicenceField.safeParse(value.drivingLicence));
    const series = idCardSeries.find((s) => s.id === value.idSeries);
    if (!series) {
      ctx.addIssue({ code: "custom", path: ["idSeries"], message: k("selectOption") });
    } else if (!value.idNumber) {
      ctx.addIssue({ code: "custom", path: ["idNumber"], message: k("required") });
    } else if (!new RegExp(`^\\d{${series.digits}}$`).test(value.idNumber)) {
      ctx.addIssue({ code: "custom", path: ["idNumber"], message: k("idNumber") });
    }
  });

export type CarInsuranceValues = z.input<typeof carInsuranceSchema>;

export const carInsuranceSteps = [
  ["vehicleType", "engineCapacity", "year"],
  [
    "personType",
    "phone",
    "email",
    "fin",
    "idSeries",
    "idNumber",
    "voen",
    "plate",
    "registrationCertificate",
    "drivingLicence",
    "taxi",
  ],
  ["addons", "consent"],
] as const satisfies readonly (readonly (keyof CarInsuranceValues)[])[];

/* -------------------------------------------------------------------------- */
/*  CASCO                                                                     */
/* -------------------------------------------------------------------------- */

export const cascoSchema = z.object({
  brand: requiredText(40),
  model: requiredText(40),
  year: yearField,
  marketValue: amountField,
  firstName: nameField,
  lastName: nameField,
  phone: phoneField,
  consent: consentField,
});

export type CascoValues = z.input<typeof cascoSchema>;

/* -------------------------------------------------------------------------- */
/*  Travel                                                                    */
/* -------------------------------------------------------------------------- */

export const travelSchema = z
  .object({
    destination: choice(ids(travelDestinations)),
    startDate: isoDateField,
    endDate: isoDateField,
    travelers: z.number().int().min(1, k("travelers")).max(MAX_TRAVELERS, k("travelers")),
    fullName: fullNameField,
    phone: phoneField,
    email: optionalEmailField,
    consent: consentField,
  })
  .superRefine((value, ctx) => {
    const wellFormed = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v);
    const today = todayISO();
    const { startDate: start, endDate: end } = value;
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

export type TravelValues = z.input<typeof travelSchema>;

/* -------------------------------------------------------------------------- */
/*  Property — standard (fixed tariff) and Property CASCO (value-based)       */
/* -------------------------------------------------------------------------- */

export const propertyStandardSchema = z.object({
  region: choice(ids(propertyRegionTariffs)),
  address: requiredText(200).refine((v) => v.length >= 5, k("tooShort")),
  propertyType: choice(ids(propertyTypes)),
  fullName: fullNameField,
  phone: phoneField,
  consent: consentField,
});

export type PropertyStandardValues = z.input<typeof propertyStandardSchema>;

export const propertyCascoSchema = z.object({
  propertyType: choice(ids(propertyTypes)),
  region: choice(ids(propertyRegionTariffs)),
  address: requiredText(200).refine((v) => v.length >= 5, k("tooShort")),
  marketValue: amountField,
  fullName: fullNameField,
  phone: phoneField,
  consent: consentField,
});

export type PropertyCascoValues = z.input<typeof propertyCascoSchema>;

/* -------------------------------------------------------------------------- */
/*  Life                                                                      */
/* -------------------------------------------------------------------------- */

export const lifeSchema = z.object({
  category: choice(ids(lifeCategories)),
  amount: choice(lifeCoverageAmounts.map(String) as [string, ...string[]]),
  term: choice(lifeTermYears.map(String) as [string, ...string[]]),
  firstName: nameField,
  lastName: nameField,
  age: ageField,
  phone: phoneField,
  email: optionalEmailField,
  consent: consentField,
});

export type LifeValues = z.input<typeof lifeSchema>;
