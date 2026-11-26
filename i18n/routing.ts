import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["az", "en", "ru"],
  defaultLocale: "az",
  localePrefix: "always",
  // Azerbaijani is the explicit default: `/` always resolves to `/az`
  // instead of guessing from the browser's Accept-Language header.
  localeDetection: false,
  // hreflang alternates are rendered in <head> via the Metadata API instead.
  alternateLinks: false,
  /*
   * Localized, keyword-bearing URLs per language (SEO). Keys are the internal
   * routes under `app/[locale]`; the middleware rewrites each public URL to
   * its internal route and redirects internal / other-language URLs to the
   * right localized one. Products are listed as static routes so their slugs
   * can be translated too. Keep slugs ASCII, lowercase and hyphenated.
   */
  pathnames: {
    "/": "/",
    "/insurance": {
      az: "/sigorta",
      en: "/insurance",
      ru: "/strahovanie",
    },
    "/insurance/car-insurance": {
      az: "/sigorta/avtomobil-sigortasi",
      en: "/insurance/car-insurance",
      ru: "/strahovanie/avtostrahovanie",
    },
    "/insurance/casco": {
      az: "/sigorta/kasko-sigortasi",
      en: "/insurance/casco",
      ru: "/strahovanie/kasko",
    },
    "/insurance/travel": {
      az: "/sigorta/seyahet-sigortasi",
      en: "/insurance/travel-insurance",
      ru: "/strahovanie/strahovanie-puteshestvennikov",
    },
    "/insurance/property": {
      az: "/sigorta/emlak-sigortasi",
      en: "/insurance/property-insurance",
      ru: "/strahovanie/strahovanie-imushchestva",
    },
    "/insurance/life": {
      az: "/sigorta/heyat-sigortasi",
      en: "/insurance/life-insurance",
      ru: "/strahovanie/strahovanie-zhizni",
    },
    "/prices": {
      az: "/qiymetler",
      en: "/prices",
      ru: "/ceny",
    },
    "/companies": {
      az: "/sigorta-sirketleri",
      en: "/insurance-companies",
      ru: "/strahovye-kompanii",
    },
    "/apply": {
      az: "/muraciet",
      en: "/apply",
      ru: "/zayavka",
    },
    "/about": {
      az: "/haqqimizda",
      en: "/about",
      ru: "/o-nas",
    },
    "/contact": {
      az: "/elaqe",
      en: "/contact",
      ru: "/kontakty",
    },
    "/privacy-policy": {
      az: "/mexfilik-siyaseti",
      en: "/privacy-policy",
      ru: "/politika-konfidencialnosti",
    },
    "/terms": {
      az: "/istifade-sertleri",
      en: "/terms",
      ru: "/usloviya-ispolzovaniya",
    },
  },
});

export type Locale = (typeof routing.locales)[number];

/** An internal route, e.g. "/insurance/car-insurance". */
export type AppPathname = keyof typeof routing.pathnames;

/**
 * Public, locale-less URL path for an internal route, e.g.
 * ("az", "/insurance/car-insurance") → "/sigorta/avtomobil-sigortasi".
 * Unknown paths are returned unchanged.
 */
export function localizePathname(locale: Locale, pathname: string): string {
  const config = (routing.pathnames as Record<string, string | Record<Locale, string>>)[pathname];
  if (config === undefined) return pathname;
  return typeof config === "string" ? config : config[locale];
}
