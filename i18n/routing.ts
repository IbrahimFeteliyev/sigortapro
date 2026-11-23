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
});

export type Locale = (typeof routing.locales)[number];
