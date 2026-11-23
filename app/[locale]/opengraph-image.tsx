import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { ogSize, renderOgImage } from "@/lib/og";
import az from "@/messages/az.json";
import en from "@/messages/en.json";
import ru from "@/messages/ru.json";

const dictionaries = { az, en, ru };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const alt = "SığortaPro";
export const size = ogSize;
export const contentType = "image/png";

export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = hasLocale(routing.locales, raw) ? raw : routing.defaultLocale;
  const messages = dictionaries[locale];

  return renderOgImage({
    eyebrow: messages.Hero.badge,
    title: messages.Hero.title.replace(/<\/?brand>/g, ""),
    subtitle: messages.Hero.description,
  });
}
