import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { absoluteUrl, ogLocales, siteConfig } from "@/lib/site";

interface PageMetadataInput {
  locale: Locale;
  /** Locale-less path, e.g. "/about" or "" for the home page. */
  path: string;
  title: string;
  description: string;
  /** Use the title as-is instead of applying the "%s | SığortaPro" template. */
  absoluteTitle?: boolean;
  keywords?: string[];
}

/** hreflang map for every locale plus x-default (Azerbaijani). */
export function languageAlternates(path: string) {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = absoluteUrl(locale, path);
  }
  languages["x-default"] = absoluteUrl(routing.defaultLocale, path);
  return languages;
}

export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  absoluteTitle = false,
  keywords,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(locale, path);
  const socialTitle = absoluteTitle ? title : `${title} | ${siteConfig.name}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords,
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      url,
      title: socialTitle,
      description,
      locale: ogLocales[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => ogLocales[l]),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
    },
  };
}
