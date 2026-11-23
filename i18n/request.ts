import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { routing } from "./routing";

export default getRequestConfig(async ({ locale }) => {
  // An explicit locale (e.g. `getTranslations({ locale })`) wins. Otherwise
  // read the `[locale]` root segment, which keeps every page statically
  // renderable without touching request headers.
  let resolved = locale;
  if (!resolved) {
    const param = await rootLocale();
    resolved = hasLocale(routing.locales, param) ? param : routing.defaultLocale;
  }

  return {
    locale: resolved,
    timeZone: "Asia/Baku",
    messages: (await import(`../messages/${resolved}.json`)).default,
  };
});
