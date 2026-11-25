import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { languageAlternates } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { INSURANCE_SLUGS } from "@/types/insurance";

const pages: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/insurance", priority: 0.9, changeFrequency: "weekly" },
  ...INSURANCE_SLUGS.map((slug) => ({
    path: `/insurance/${slug}`,
    priority: 0.9,
    changeFrequency: "monthly" as const,
  })),
  { path: "/prices", priority: 0.8, changeFrequency: "monthly" },
  { path: "/companies", priority: 0.7, changeFrequency: "monthly" },
  { path: "/apply", priority: 0.7, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

/** One entry per locale, each listing every language alternate (hreflang). */
export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap(({ path, priority, changeFrequency }) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(locale, path),
      changeFrequency,
      priority,
      alternates: { languages: languageAlternates(path) },
    })),
  );
}
