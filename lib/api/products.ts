import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { products } from "@/data/products";
import type { Locale } from "@/i18n/routing";
import {
  INSURANCE_SLUGS,
  type InsuranceProduct,
  type InsuranceProductSummary,
  type InsuranceSlug,
  type ProductRecord,
} from "@/types/insurance";
import { isApiEnabled } from "./config";
import { apiFetch } from "./http";

/* -------------------------------------------------------------------------- */
/*  Mapping: content record -> localized view model                           */
/* -------------------------------------------------------------------------- */

function localize(record: ProductRecord, locale: Locale): InsuranceProduct {
  return {
    slug: record.slug,
    isMandatory: record.isMandatory,
    name: record.name[locale],
    shortName: record.shortName[locale],
    tagline: record.tagline[locale],
    shortDescription: record.shortDescription[locale],
    description: record.description.map((p) => p[locale]),
    highlights: record.highlights.map((h) => h[locale]),
    coverage: record.coverage.map((c) => ({
      title: c.title[locale],
      description: c.description[locale],
    })),
    benefits: record.benefits.map((b) => ({
      title: b.title[locale],
      description: b.description[locale],
    })),
    tariffs: record.tariffs.map((t) => ({
      id: t.id,
      name: t.name[locale],
      summary: t.summary[locale],
      duration: t.duration[locale],
      features: t.features.map((f) => f[locale]),
      startingPrice: t.startingPrice,
      highlighted: t.highlighted ?? false,
    })),
    faqs: record.faqs.map((f) => ({ question: f.question[locale], answer: f.answer[locale] })),
    startingPrice: record.startingPrice,
    related: record.related,
    image: record.image ? { src: record.image.src, alt: record.image.alt[locale] } : null,
    seo: {
      title: record.seo.title[locale],
      description: record.seo.description[locale],
      keywords: record.seo.keywords.map((k) => k[locale]),
    },
  };
}

function toSummary(product: InsuranceProduct): InsuranceProductSummary {
  return {
    slug: product.slug,
    isMandatory: product.isMandatory,
    name: product.name,
    shortName: product.shortName,
    tagline: product.tagline,
    shortDescription: product.shortDescription,
    startingPrice: product.startingPrice,
    image: product.image,
    featuredTariff: product.tariffs.find((t) => t.highlighted) ?? product.tariffs[0] ?? null,
  };
}

/* -------------------------------------------------------------------------- */
/*  Data sources                                                              */
/* -------------------------------------------------------------------------- */

interface ProductSource {
  list(locale: Locale): Promise<InsuranceProduct[]>;
  get(slug: InsuranceSlug, locale: Locale): Promise<InsuranceProduct | null>;
}

const mockSource: ProductSource = {
  async list(locale) {
    return products.map((record) => localize(record, locale));
  },
  async get(slug, locale) {
    const record = products.find((p) => p.slug === slug);
    return record ? localize(record, locale) : null;
  },
};

/** Expected contract for the Spring Boot API (localized server-side via `lang`). */
const remoteSource: ProductSource = {
  list(locale) {
    return apiFetch<InsuranceProduct[]>(`/api/v1/products?lang=${locale}`);
  },
  async get(slug, locale) {
    try {
      return await apiFetch<InsuranceProduct>(`/api/v1/products/${slug}?lang=${locale}`);
    } catch (error) {
      if (error instanceof Error && "status" in error && error.status === 404) return null;
      throw error;
    }
  },
};

const source = isApiEnabled ? remoteSource : mockSource;

function applyCachePolicy() {
  // Mock data only changes on deploy; API data refreshes hourly and can be
  // revalidated on demand with `revalidateTag("products")`.
  if (isApiEnabled) cacheLife("hours");
  else cacheLife("max");
  cacheTag("products");
}

/* -------------------------------------------------------------------------- */
/*  Public API                                                                */
/* -------------------------------------------------------------------------- */

export async function getProducts(locale: Locale): Promise<InsuranceProduct[]> {
  "use cache";
  applyCachePolicy();
  return source.list(locale);
}

export async function getProductSummaries(locale: Locale): Promise<InsuranceProductSummary[]> {
  "use cache";
  applyCachePolicy();
  const list = await source.list(locale);
  return list.map(toSummary);
}

export async function getProduct(slug: InsuranceSlug, locale: Locale): Promise<InsuranceProduct | null> {
  "use cache";
  applyCachePolicy();
  return source.get(slug, locale);
}

export function getProductSlugs(): readonly InsuranceSlug[] {
  return INSURANCE_SLUGS;
}
