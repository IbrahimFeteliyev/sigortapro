import type { StaticImageData } from "next/image";
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

/** Local static import today; a CDN URL string once the API serves media. */
export interface ImageAsset {
  src: StaticImageData | string;
  alt: string;
}

/* -------------------------------------------------------------------------- */
/*  Records — the content store (mock data today, CMS/API later)              */
/* -------------------------------------------------------------------------- */

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
  benefits: TitledTextRecord[];
  faqs: FaqRecord[];
  related: InsuranceSlug[];
  /** Keys into `data/images.ts`. */
  heroImage: string;
  cardImage: string;
  seo: {
    title: LocalizedText;
    description: LocalizedText;
    keywords: LocalizedText[];
  };
}

/* -------------------------------------------------------------------------- */
/*  View models — localized DTOs consumed by the UI.                          */
/*  They mirror what GET /api/v1/products/{slug}?lang=az is expected to return.*/
/* -------------------------------------------------------------------------- */

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
  benefits: TitledText[];
  faqs: Faq[];
  related: InsuranceSlug[];
  heroImage: ImageAsset;
  cardImage: ImageAsset;
  seo: { title: string; description: string; keywords: string[] };
}

export type InsuranceProductSummary = Pick<
  InsuranceProduct,
  "slug" | "isMandatory" | "name" | "shortName" | "tagline" | "shortDescription" | "cardImage"
>;

/** A potential-coverage card. Illustrative only — the contract defines terms. */
export interface CoverageItem {
  id: string;
  title: string;
  description: string;
  image: ImageAsset | null;
  /** Icon key (see `components/insurance/CoverageIcon.tsx`) when there is no photo. */
  icon: string | null;
}
