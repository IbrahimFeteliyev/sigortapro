import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Benefits } from "@/components/home/Benefits";
import { CompaniesSection } from "@/components/home/CompaniesSection";
import { Hero } from "@/components/home/Hero";
import { ProductsSection } from "@/components/home/ProductsSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { getCompanies } from "@/lib/api/content";
import { getProductSummaries } from "@/lib/api/products";
import { resolveLocale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";
import type { Faq } from "@/types/insurance";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Metadata.home" });
  return buildPageMetadata({
    locale,
    path: "",
    title: t("title"),
    description: t("description"),
    absoluteTitle: true,
  });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const locale = await resolveLocale(params);
  const [products, faq] = await Promise.all([
    getProductSummaries(locale),
    getTranslations({ locale, namespace: "Faq" }),
  ]);

  return (
    <>
      <Hero products={products} />
      <ProductsSection products={products} />
      <HowItWorks />
      <Benefits />
      <CompaniesSection companies={getCompanies()} />
      <FaqSection
        eyebrow={faq("eyebrow")}
        title={faq("title")}
        description={faq("description")}
        items={faq.raw("items") as Faq[]}
      />
      <CtaSection />
    </>
  );
}
