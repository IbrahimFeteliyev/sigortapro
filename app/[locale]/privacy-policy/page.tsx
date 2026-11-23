import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LegalDocument } from "@/components/sections/LegalDocument";
import { resolveLocale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";

const PATH = "/privacy-policy";

export async function generateMetadata({ params }: PageProps<"/[locale]/privacy-policy">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Metadata.privacy" });
  return buildPageMetadata({ locale, path: PATH, title: t("title"), description: t("description") });
}

export default async function PrivacyPolicyPage({ params }: PageProps<"/[locale]/privacy-policy">) {
  const locale = await resolveLocale(params);
  return <LegalDocument locale={locale} document="privacy" path={PATH} />;
}
