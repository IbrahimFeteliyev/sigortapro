import "server-only";
import { companies, type InsuranceCompany } from "@/data/companies";
import { coverage } from "@/data/coverage";
import { photo } from "@/data/image-lookup";
import type { Locale } from "@/i18n/routing";
import type { CoverageItem, InsuranceSlug } from "@/types/insurance";

/*
 * Supporting content (coverage cards, companies). Read synchronously from
 * the mock store today; same shapes as the future API responses.
 */

export function getCoverage(
  slug: InsuranceSlug,
  locale: Locale,
): { confirmed: boolean; items: CoverageItem[] } {
  const group = coverage[slug];
  return {
    confirmed: group.confirmed,
    items: group.items.map((item) => ({
      id: item.id,
      title: item.title[locale],
      description: item.description[locale],
      image: item.image ? photo(item.image, locale) : null,
      icon: item.icon ?? null,
    })),
  };
}

export function getCompanies(): InsuranceCompany[] {
  return companies;
}
