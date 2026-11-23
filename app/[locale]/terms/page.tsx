import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LegalDocument } from "@/components/sections/LegalDocument";
import { resolveLocale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";

const PATH = "/terms";

export async function generateMetadata({ params }: PageProps<"/[locale]/terms">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Metadata.terms" });
  return buildPageMetadata({ locale, path: PATH, title: t("title"), description: t("description") });
}

export default async function TermsPage({ params }: PageProps<"/[locale]/terms">) {
  const locale = await resolveLocale(params);
  return <LegalDocument locale={locale} document="terms" path={PATH} />;
}
