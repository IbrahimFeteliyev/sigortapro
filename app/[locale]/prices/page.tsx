import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { FormMessages } from "@/components/forms/FormMessages";
import { LifeTariffTable } from "@/components/insurance/LifeTariffTable";
import { ProductCard } from "@/components/insurance/ProductCard";
import { PropertyTariffTable } from "@/components/insurance/PropertyTariffTable";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Link } from "@/i18n/navigation";
import { getProductSummaries } from "@/lib/api/products";
import { resolveLocale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";
import type { InsuranceSlug } from "@/types/insurance";

const PATH = "/prices";
const QUOTE_PRODUCTS: InsuranceSlug[] = ["car-insurance", "casco", "travel"];

export async function generateMetadata({ params }: PageProps<"/[locale]/prices">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Metadata.prices" });
  return buildPageMetadata({ locale, path: PATH, title: t("title"), description: t("description") });
}

function ApplyLink({ product, children }: { product: InsuranceSlug; children: string }) {
  return (
    <Link
      href={{ pathname: `/insurance/${product}`, hash: "apply" }}
      className="group mt-5 inline-flex items-center gap-1.5 font-semibold text-ink underline-offset-4 hover:underline"
    >
      {children}
      <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
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
        title={t("title")}
        description={t("description")}
      />

      <section aria-labelledby="life-prices" className="container-page pb-12 sm:pb-16">
        <SectionHeading id="life-prices" title={t("lifeTitle")} description={t("lifeDescription")} />
        <Reveal className="mt-8">
          <FormMessages>
            <LifeTariffTable />
          </FormMessages>
        </Reveal>
        <ApplyLink product="life">{t("applyLife")}</ApplyLink>
      </section>

      <section aria-labelledby="property-prices" className="container-page py-12 sm:py-16">
        <SectionHeading
          id="property-prices"
          title={t("propertyTitle")}
          description={t("propertyDescription")}
        />
        <Reveal className="mt-8 max-w-3xl">
          <PropertyTariffTable />
        </Reveal>
        <ApplyLink product="property">{t("applyProperty")}</ApplyLink>
      </section>

      <section aria-labelledby="quote-prices" className="container-page py-12 sm:py-16">
        <SectionHeading id="quote-prices" title={t("quoteTitle")} description={t("quoteDescription")} />
        <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {quoteProducts.map((product) => (
            <ProductCard key={product.slug} product={product} imageClassName="aspect-[3/2]" />
          ))}
        </div>
      </section>

      <CtaSection />
    </>
  );
}
