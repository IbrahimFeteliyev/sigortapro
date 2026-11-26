import { Check } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ApplicationPanel } from "@/components/forms/ApplicationPanel";
import { FormMessages } from "@/components/forms/FormMessages";
import { CoverageGrid } from "@/components/insurance/CoverageGrid";
import { LifeTariffTable } from "@/components/insurance/LifeTariffTable";
import { ProductCard } from "@/components/insurance/ProductCard";
import { PropertyTariffTable } from "@/components/insurance/PropertyTariffTable";
import { CtaSection } from "@/components/sections/CtaSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCoverage } from "@/lib/api/content";
import { getProduct, getProductSlugs, getProductSummaries } from "@/lib/api/products";
import { resolveLocale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";
import { serviceSchema } from "@/lib/structured-data";
import { isInsuranceSlug } from "@/types/insurance";

type Props = PageProps<"/[locale]/insurance/[slug]">;

export function generateStaticParams() {
  return getProductSlugs().map((slug) => ({ slug }));
}

async function loadProduct(params: Props["params"]) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  if (!isInsuranceSlug(slug)) notFound();
  const product = await getProduct(slug, locale);
  if (!product) notFound();
  return { locale, product };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, product } = await loadProduct(params);
  return buildPageMetadata({
    locale,
    path: `/insurance/${product.slug}`,
    title: product.seo.title,
    description: product.seo.description,
    keywords: product.seo.keywords,
  });
}

export default async function ProductPage({ params }: Props) {
  const { locale, product } = await loadProduct(params);
  const [summaries, t, nav, common] = await Promise.all([
    getProductSummaries(locale),
    getTranslations({ locale, namespace: "ProductPage" }),
    getTranslations({ locale, namespace: "Nav" }),
    getTranslations({ locale, namespace: "Common" }),
  ]);

  const slug = product.slug;
  const path = `/insurance/${slug}`;
  const coverage = getCoverage(slug, locale);
  const related = product.related
    .map((s) => summaries.find((item) => item.slug === s))
    .filter((item) => item !== undefined)
    .slice(0, 3);

  return (
    <>
      {/* Title + photo, with the application form right beside it ---------- */}
      <section className="container-page pt-6 pb-12 sm:pt-8 lg:pb-16">
        <Breadcrumbs
          locale={locale}
          currentPath={path}
          items={[{ name: nav("insurance"), path: "/insurance" }, { name: product.name }]}
        />
        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-12 lg:gap-y-8">
          <div className="lg:col-span-7">
            <p className="text-sm font-semibold text-brand-600">
              {product.isMandatory ? common("mandatory") : common("voluntary")}
            </p>
            <h1 className="mt-2 text-[2.25rem] leading-[1.06] font-semibold text-ink sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">{product.shortDescription}</p>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2.5">
              {product.highlights.map((highlight) => (
                <li key={highlight} className="inline-flex items-center gap-2 text-[0.9375rem] text-ink">
                  <Check aria-hidden className="size-4 text-brand-600" strokeWidth={2.5} />
                  {highlight}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1">
            <ApplicationPanel locale={locale} slug={slug} productName={product.name} />
          </div>

          {/* Sticky on desktop: stays beside long forms instead of leaving a gap. */}
          <div className="lg:sticky lg:top-28 lg:col-span-7 lg:self-start">
            <div className="relative aspect-[3/2] overflow-hidden rounded-3xl bg-surface">
              <Image
                src={product.heroImage.src}
                alt={product.heroImage.alt}
                fill
                preload
                fetchPriority="high"
                sizes="(min-width: 1280px) 700px, (min-width: 1024px) 58vw, 100vw"
                placeholder={typeof product.heroImage.src === "string" ? "empty" : "blur"}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tariffs ------------------------------------------------------------- */}
      {slug === "property" ? (
        <section aria-labelledby="tariffs-heading" className="container-page py-12 sm:py-16">
          <SectionHeading
            id="tariffs-heading"
            title={t("standardTableTitle")}
            description={t("standardTableDescription")}
          />
          <Reveal className="mt-8 max-w-3xl">
            <PropertyTariffTable />
          </Reveal>
        </section>
      ) : null}

      {slug === "life" ? (
        <section aria-labelledby="life-tariffs-heading" className="container-page py-12 sm:py-16">
          <SectionHeading
            id="life-tariffs-heading"
            title={t("lifeTableTitle")}
            description={t("lifeTableDescription")}
          />
          <Reveal className="mt-8">
            <FormMessages>
              <LifeTariffTable />
            </FormMessages>
          </Reveal>
        </section>
      ) : null}

      {/* Coverage ------------------------------------------------------------ */}
      <section aria-labelledby="coverage-heading" className="container-page py-12 sm:py-16">
        <SectionHeading
          id="coverage-heading"
          title={t(`coverageTitle.${slug}`)}
          description={t(`coverageDescription.${slug}`)}
        />
        <div className="mt-8">
          <CoverageGrid
            items={coverage.items}
            columns={slug === "travel" ? 4 : 3}
            note={
              coverage.confirmed ? undefined : slug === "property" ? t("voluntaryNote") : t("coverageNote")
            }
          />
        </div>
      </section>

      <FaqSection title={t("faqTitle")} items={product.faqs} />

      {related.length > 0 ? (
        <section aria-labelledby="related-heading" className="container-page py-12 sm:py-16">
          <SectionHeading id="related-heading" title={t("relatedTitle")} />
          <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} imageClassName="aspect-[3/2]" />
            ))}
          </div>
        </section>
      ) : null}

      <CtaSection />

      <JsonLd data={serviceSchema(locale, product)} />
    </>
  );
}
