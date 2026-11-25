import {
  BadgeCheck,
  CircleCheck,
  HeartHandshake,
  Phone,
  ShieldCheck,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";
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
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { photo } from "@/data/image-lookup";
import type { PhotoKey } from "@/data/images";
import { getCoverage } from "@/lib/api/content";
import { getProduct, getProductSlugs, getProductSummaries } from "@/lib/api/products";
import { resolveLocale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { serviceSchema } from "@/lib/structured-data";
import { isInsuranceSlug, type InsuranceSlug } from "@/types/insurance";

type Props = PageProps<"/[locale]/insurance/[slug]">;

const benefitIcons: LucideIcon[] = [Sparkles, BadgeCheck, HeartHandshake, Zap];

/** Secondary photo for the overview section. */
const overviewPhoto: Record<InsuranceSlug, PhotoKey> = {
  "car-insurance": "carDriving",
  casco: "cascoDamage",
  travel: "travelAirport",
  property: "propertyInterior",
  life: "lifeHealth",
};

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
  const secondary = photo(overviewPhoto[slug], locale);
  const related = product.related
    .map((s) => summaries.find((item) => item.slug === s))
    .filter((item) => item !== undefined);

  return (
    <>
      {/* Hero: copy + photo, with the application form right beside it ---- */}
      <section className="relative isolate">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] bg-linear-to-b from-brand-50 via-brand-50/40 to-white"
        />
        <div className="container-page pt-6 pb-16 sm:pt-8 lg:pb-24">
          <Breadcrumbs
            locale={locale}
            currentPath={path}
            items={[{ name: nav("insurance"), path: "/insurance" }, { name: product.name }]}
          />
          <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-12 lg:gap-y-8">
            <div className="lg:col-span-7">
              <p className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-ink-soft shadow-xs ring-1 ring-line">
                <ShieldCheck aria-hidden className="size-4 text-brand-600" />
                {product.isMandatory ? common("mandatory") : common("voluntary")}
              </p>
              <h1 className="mt-5 text-[2.4rem] leading-[1.05] font-semibold text-ink sm:text-5xl lg:text-[3.4rem]">
                {product.name}
              </h1>
              <p className="mt-4 text-xl leading-snug font-medium text-ink-soft">{product.tagline}</p>
              <p className="mt-3 max-w-xl text-lg leading-relaxed text-muted">{product.shortDescription}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {product.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-ink-soft ring-1 ring-line"
                  >
                    <CircleCheck aria-hidden className="size-4 text-brand-600" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1">
              <ApplicationPanel
                locale={locale}
                slug={slug}
                productName={product.name}
                className="lg:sticky lg:top-24"
              />
            </div>

            <div className="lg:col-span-7">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] bg-surface shadow-card">
                <Image
                  src={product.heroImage.src}
                  alt={product.heroImage.alt}
                  fill
                  preload
                  fetchPriority="high"
                  sizes="(min-width: 1024px) 680px, 100vw"
                  placeholder={typeof product.heroImage.src === "string" ? "empty" : "blur"}
                  className="object-cover"
                />
                <a
                  href={siteConfig.contact.phoneHref}
                  className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/95 py-2 pr-4 pl-2 text-sm font-semibold text-ink shadow-float transition-colors hover:bg-white"
                >
                  <span className="grid size-8 place-items-center rounded-full bg-brand-gradient text-white">
                    <Phone aria-hidden className="size-4" />
                  </span>
                  {siteConfig.contact.phoneDisplay}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property: standard tariff table --------------------------------- */}
      {slug === "property" ? (
        <section aria-labelledby="tariffs-heading" className="container-page pb-20 sm:pb-28">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <Reveal className="lg:col-span-5">
              <SectionHeading
                id="tariffs-heading"
                eyebrow={t("standardEyebrow")}
                title={t("standardTableTitle")}
                description={t("standardTableDescription")}
              />
              <div className="relative mt-8 hidden aspect-[4/3] overflow-hidden rounded-[1.75rem] lg:block">
                <Image
                  src={photo("propertyStandard", locale).src}
                  alt={photo("propertyStandard", locale).alt}
                  fill
                  sizes="420px"
                  placeholder="blur"
                  className="object-cover"
                />
              </div>
            </Reveal>
            <Reveal className="lg:col-span-7" delay={0.08}>
              <PropertyTariffTable />
              <p className="mt-4 text-sm leading-relaxed text-muted">{t("standardTableNote")}</p>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* Coverage cards --------------------------------------------------- */}
      <section aria-labelledby="coverage-heading" className="bg-surface py-20 sm:py-28">
        <div className="container-page">
          <SectionHeading
            id="coverage-heading"
            eyebrow={slug === "property" ? t("voluntaryEyebrow") : undefined}
            title={t(`coverageTitle.${slug}`)}
            description={t(`coverageDescription.${slug}`)}
            className="max-w-3xl"
          />
          <div className="mt-12">
            <CoverageGrid
              items={coverage.items}
              columns={slug === "travel" ? 4 : 3}
              note={
                coverage.confirmed ? undefined : slug === "property" ? t("voluntaryNote") : t("coverageNote")
              }
            />
          </div>
        </div>
      </section>

      {/* Life: tariff explorer ---------------------------------------------- */}
      {slug === "life" ? (
        <section aria-labelledby="life-tariffs-heading" className="container-page py-20 sm:py-28">
          <SectionHeading
            id="life-tariffs-heading"
            title={t("lifeTableTitle")}
            description={t("lifeTableDescription")}
            className="max-w-3xl"
          />
          <Reveal className="mt-10">
            <FormMessages>
              <LifeTariffTable />
            </FormMessages>
          </Reveal>
        </section>
      ) : null}

      {/* Overview + secondary photo ---------------------------------------- */}
      <section
        aria-labelledby="overview-heading"
        className={slug === "life" ? "container-page pb-20 sm:pb-28" : "container-page py-20 sm:py-28"}
      >
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-card lg:col-span-6">
            <Image
              src={secondary.src}
              alt={secondary.alt}
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              placeholder="blur"
              className="object-cover"
            />
          </Reveal>
          <div className="lg:col-span-6">
            <SectionHeading id="overview-heading" title={t("overview")} />
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink-soft">
              {product.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        <RevealGroup
          as="ul"
          className="mt-16 grid gap-6 border-t border-line pt-12 sm:grid-cols-2 lg:grid-cols-4"
        >
          {product.benefits.map((benefit, index) => {
            const Icon = benefitIcons[index % benefitIcons.length];
            return (
              <RevealItem as="li" key={benefit.title}>
                <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-700">
                  <Icon aria-hidden className="size-[1.375rem]" strokeWidth={1.75} />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-ink">{benefit.title}</h3>
                <p className="mt-1.5 leading-relaxed text-muted">{benefit.description}</p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </section>

      <HowItWorks title={t("howTitle")} />

      <FaqSection title={t("faqTitle")} items={product.faqs} />

      {related.length > 0 ? (
        <section aria-labelledby="related-heading" className="container-page pb-20 sm:pb-28">
          <SectionHeading
            id="related-heading"
            title={t("relatedTitle")}
            description={t("relatedDescription")}
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} imageClassName="aspect-[16/10]" />
            ))}
          </div>
        </section>
      ) : null}

      <CtaSection
        title={t("ctaTitle", { name: product.name })}
        description={t("ctaDescription")}
        applyHref={`${path}#apply`}
      />

      <JsonLd data={serviceSchema(locale, product)} />
    </>
  );
}
