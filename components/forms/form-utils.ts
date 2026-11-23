"use client";

import { useFormatter, useLocale, useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { daysBetweenInclusive } from "@/lib/date";
import { isValidationKey, type ApplicationFormValues } from "@/lib/validation/application";
import type { InsuranceSlug } from "@/types/insurance";

export interface FormProduct {
  slug: InsuranceSlug;
  name: string;
  shortDescription: string;
}

export type FieldName = keyof ApplicationFormValues;

/** Returns a resolver from field name to its localized error message. */
export function useFieldErrors() {
  const {
    formState: { errors },
  } = useFormContext<ApplicationFormValues>();
  const t = useTranslations("Validation");

  return (name: FieldName): string | undefined => {
    const message = errors[name]?.message;
    if (!message) return undefined;
    return t(isValidationKey(message) ? message : "required");
  };
}

/* -------------------------------------------------------------------------- */
/*  Review summary                                                            */
/* -------------------------------------------------------------------------- */

export interface SummaryRow {
  label: string;
  value: string;
}

export interface SummarySection {
  key: "type" | "details" | "contact";
  step: number;
  title: string;
  rows: SummaryRow[];
}

/** Parses `YYYY-MM-DD` at UTC noon so formatting never shifts the day. */
function isoDateToUtc(value: string) {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12));
}

export function useApplicationSummary(
  values: ApplicationFormValues,
  products: FormProduct[],
): SummarySection[] {
  const t = useTranslations("ApplyForm");
  const format = useFormatter();
  const locale = useLocale();
  const missing = t("review.notProvided");

  const text = (value: string) => value.trim() || missing;
  const money = (value: string) => {
    const amount = Number(value.replace(/\s/g, "").replace(",", "."));
    return value.trim() && Number.isFinite(amount)
      ? `${format.number(amount, { maximumFractionDigits: 2 })} ₼`
      : missing;
  };
  const date = (value: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value || missing;
    // Browsers ship incomplete ICU data for Azerbaijani (e.g. "2027 M12 6"),
    // so use the local dd.mm.yyyy convention instead of Intl for `az`.
    if (locale === "az") return value.split("-").reverse().join(".");
    return format.dateTime(isoDateToUtc(value), { dateStyle: "long", timeZone: "UTC" });
  };

  let details: SummaryRow[] = [];
  switch (values.insuranceType) {
    case "car-insurance":
      details = [
        {
          label: t("fields.registrationNumber"),
          value: values.registrationNumber.trim() ? values.registrationNumber.toUpperCase() : missing,
        },
        { label: t("fields.brandModel"), value: text(values.brandModel) },
        { label: t("fields.year"), value: text(values.year) },
        {
          label: t("fields.vehicleType"),
          value: values.vehicleType ? t(`options.vehicleType.${values.vehicleType}`) : missing,
        },
        { label: t("fields.engineVolume"), value: text(values.engineVolume) },
      ];
      break;
    case "casco":
      details = [
        { label: t("fields.brandModel"), value: text(values.brandModel) },
        { label: t("fields.year"), value: text(values.year) },
        { label: t("fields.vehicleValue"), value: money(values.vehicleValue) },
        {
          label: t("fields.cascoCoverage"),
          value: values.cascoCoverage ? t(`options.cascoCoverage.${values.cascoCoverage}`) : missing,
        },
      ];
      break;
    case "travel": {
      const days = daysBetweenInclusive(values.startDate, values.endDate);
      details = [
        { label: t("fields.destination"), value: text(values.destination) },
        { label: t("fields.startDate"), value: date(values.startDate) },
        { label: t("fields.endDate"), value: date(values.endDate) },
        { label: t("fields.duration"), value: days ? t("fields.durationValue", { count: days }) : missing },
        { label: t("fields.travelers"), value: String(values.travelers) },
      ];
      break;
    }
    case "property":
      details = [
        { label: t("fields.propertyAddress"), value: text(values.propertyAddress) },
        {
          label: t("fields.propertyType"),
          value: values.propertyType ? t(`options.propertyType.${values.propertyType}`) : missing,
        },
        { label: t("fields.propertyValue"), value: money(values.propertyValue) },
        {
          label: t("fields.propertyCoverage"),
          value: values.propertyCoverage.length
            ? values.propertyCoverage.map((item) => t(`options.propertyCoverage.${item}`)).join(", ")
            : missing,
        },
      ];
      break;
    case "life":
      details = [
        { label: t("fields.age"), value: text(values.age) },
        {
          label: t("fields.lifeTerm"),
          value: values.lifeTerm ? t(`options.lifeTerm.${values.lifeTerm}`) : missing,
        },
      ];
      break;
  }

  const product = products.find((item) => item.slug === values.insuranceType);

  return [
    {
      key: "type",
      step: 0,
      title: t("review.type"),
      rows: [{ label: t("fields.insuranceType"), value: product?.name ?? missing }],
    },
    { key: "details", step: 1, title: t("review.details"), rows: details },
    {
      key: "contact",
      step: 2,
      title: t("review.contact"),
      rows: [
        { label: t("fields.fullName"), value: text(values.fullName) },
        { label: t("fields.phone"), value: text(values.phone) },
        { label: t("fields.email"), value: text(values.email) },
        { label: t("fields.additionalInfo"), value: text(values.additionalInfo) },
      ],
    },
  ];
}

/** Plain-text version of the summary for a pre-filled WhatsApp message. */
export function summaryToMessage(intro: string, sections: SummarySection[]) {
  const lines = [intro, ""];
  for (const section of sections) {
    lines.push(`*${section.title}*`);
    for (const row of section.rows) lines.push(`${row.label}: ${row.value}`);
    lines.push("");
  }
  return lines.join("\n").trim();
}
