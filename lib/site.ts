import type { Locale } from "@/i18n/routing";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const siteConfig = {
  name: "SığortaPro",
  url: rawSiteUrl.replace(/\/+$/, ""),
  contact: {
    phoneDisplay: "070 609 29 69",
    phoneInternational: "+994 70 609 29 69",
    phoneE164: "+994706092969",
    phoneHref: "tel:+994706092969",
    whatsappUrl: "https://wa.me/994706092969",
  },
} as const;

export const ogLocales: Record<Locale, string> = {
  az: "az_AZ",
  en: "en_US",
  ru: "ru_RU",
};

/** Builds a WhatsApp deep link with an optional pre-filled message. */
export function whatsappLink(text?: string) {
  const base = siteConfig.contact.whatsappUrl;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** Absolute URL for a locale-prefixed path, e.g. ("az", "/about"). */
export function absoluteUrl(locale: Locale, path = "") {
  const normalized = path === "/" ? "" : path;
  return `${siteConfig.url}/${locale}${normalized}`;
}
