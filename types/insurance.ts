import type { Locale } from "@/i18n/routing";

export const INSURANCE_SLUGS = ["car-insurance", "casco", "travel", "property", "life"] as const;

export type InsuranceSlug = (typeof INSURANCE_SLUGS)[number];

export function isInsuranceSlug(value: string): value is InsuranceSlug {
  return (INSURANCE_SLUGS as readonly string[]).includes(value);
}

/** A string translated into every supported locale. */
export type LocalizedText = Record<Locale, string>;

export interface Money {
  amount: number;
  currency: "AZN";
}

/* -------------------------------------------------------------------------- */
/*  Records — the shape of the content store (mock data today, CMS/API later) */
/* -------------------------------------------------------------------------- */

export interface TariffRecord {
  id: string;
  name: LocalizedText;
  summary: LocalizedText;
  duration: LocalizedText;
  features: LocalizedText[];
  /** `null` when no verified price exists — the UI shows "Get a quote". */
  startingPrice: Money | null;
  highlighted?: boolean;
}

export interface TitledTextRecord {
  title: LocalizedText;
  description: LocalizedText;
}

export interface FaqRecord {
  question: LocalizedText;
  answer: LocalizedText;
}

export interface ProductRecord {
  slug: InsuranceSlug;
  isMandatory: boolean;
  name: LocalizedText;
  shortName: LocalizedText;
  tagline: LocalizedText;
  shortDescription: LocalizedText;
  description: LocalizedText[];
  highlights: LocalizedText[];
  coverage: TitledTextRecord[];
  benefits: TitledTextRecord[];
  tariffs: TariffRecord[];
  faqs: FaqRecord[];
  /** `null` when no verified price exists — the UI shows "Get a quote". */
  startingPrice: Money | null;
  related: InsuranceSlug[];
  /** Optional photography. When absent the UI renders a branded illustration. */
  image?: { src: string; alt: LocalizedText };
  seo: {
    title: LocalizedText;
    description: LocalizedText;
    keywords: LocalizedText[];
  };
}

/* -------------------------------------------------------------------------- */
/*  View models — localized DTOs consumed by the UI.                          */
/*  These mirror what a REST endpoint such as                                 */
/*  GET /api/v1/products/{slug}?lang=az is expected to return.                */
/* -------------------------------------------------------------------------- */

export interface Tariff {
  id: string;
  name: string;
  summary: string;
  duration: string;
  features: string[];
  startingPrice: Money | null;
  highlighted: boolean;
}

export interface TitledText {
  title: string;
  description: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface InsuranceProduct {
  slug: InsuranceSlug;
  isMandatory: boolean;
  name: string;
  shortName: string;
  tagline: string;
  shortDescription: string;
  description: string[];
  highlights: string[];
  coverage: TitledText[];
  benefits: TitledText[];
  tariffs: Tariff[];
  faqs: Faq[];
  startingPrice: Money | null;
  related: InsuranceSlug[];
  image: { src: string; alt: string } | null;
  seo: { title: string; description: string; keywords: string[] };
}

export type InsuranceProductSummary = Pick<
  InsuranceProduct,
  "slug" | "isMandatory" | "name" | "shortName" | "tagline" | "shortDescription" | "startingPrice" | "image"
> & {
  featuredTariff: Tariff | null;
};
