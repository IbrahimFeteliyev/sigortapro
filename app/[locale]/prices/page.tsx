import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { FormMessages } from "@/components/forms/FormMessages";
import { LifeTariffTable } from "@/components/insurance/LifeTariffTable";
import { ProductIcon } from "@/components/insurance/ProductIcon";
import { PropertyTariffTable } from "@/components/insurance/PropertyTariffTable";
import { CtaSection } from "@/components/sections/CtaSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { PageHero } from "@/components/sections/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Link } from "@/i18n/navigation";
import { getProductSummaries } from "@/lib/api/products";
import { resolveLocale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";
import type { Faq, InsuranceSlug } from "@/types/insurance";

const PATH = "/prices";
const QUOTE_PRODUCTS: InsuranceSlug[] = ["car-insurance", "casco", "travel"];

export async function generateMetadata({ params }: PageProps<"/[locale]/prices">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Metadata.prices" });
  return buildPageMetadata({ locale, path: PATH, title: t("title"), description: t("description") });
}

export default async function PricesPage({ params }: PageProps<"/[locale]/prices">) {
  const locale = await resolveLocale(params);
  const [products, t, nav] = await Promise.all([
    getProductSummaries(locale),
    getTranslations({ locale, namespace: "PricesPage" }),
    getTranslations({ locale, namespace: "Nav" }),
  ]);
  const quoteProducts = products.filter((p) => QUOTE_PRODUCTS.includes(p.slug));

  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs locale={locale} items={[{ name: nav("prices") }]} currentPath={PATH} />}
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />

      <section aria-labelledby="property-prices" className="container-page pb-20 sm:pb-24">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <SectionHeading
              id="property-prices"
              title={t("propertyTitle")}
              description={t("propertyDescription")}
            />
            <Link
              href="/insurance/property#apply"
              className="group mt-6 inline-flex items-center gap-2 font-semibold text-brand-700 hover:text-brand-800"
            >
              {t("applyProperty")}
              <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <Reveal className="lg:col-span-7">
            <PropertyTariffTable />
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="life-prices" className="bg-surface py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading
            id="life-prices"
            title={t("lifeTitle")}
            description={t("lifeDescription")}
            className="max-w-3xl"
          />
          <Reveal className="mt-10">
            <FormMessages>
              <LifeTariffTable />
            </FormMessages>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="quote-prices" className="container-page py-20 sm:py-24">
        <SectionHeading
          id="quote-prices"
          title={t("quoteTitle")}
          description={t("quoteDescription")}
          className="max-w-3xl"
        />
        <RevealGroup as="ul" className="mt-10 grid gap-5 md:grid-cols-3">
          {quoteProducts.map((product) => (
            <RevealItem
              as="li"
              key={product.slug}
              className="group relative overflow-hidden rounded-[1.75rem] bg-white shadow-card ring-1 ring-line transition-shadow hover:shadow-card-hover"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={product.cardImage.src}
                  alt={product.cardImage.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  placeholder={typeof product.cardImage.src === "string" ? "empty" : "blur"}
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <div className="p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-ink">
                  <ProductIcon slug={product.slug} className="size-5 text-brand-600" />
                  <Link
                    href={`/insurance/${product.slug}#apply`}
                    className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:ring-2 focus-visible:after:ring-brand-600"
                  >
                    {product.name}
                  </Link>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t(`quoteNote.${product.slug}`)}</p>
                <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                  {t("getQuote")}
                  <ArrowRight aria-hidden className="size-4" />
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <div className="border-t border-line">
        <FaqSection title={t("faqTitle")} items={t.raw("faq") as Faq[]} />
      </div>
      <CtaSection />
    </>
  );
}
