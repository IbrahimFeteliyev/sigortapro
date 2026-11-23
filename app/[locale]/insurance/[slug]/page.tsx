import {
  ArrowRight,
  BadgeCheck,
  CircleCheck,
  HeartHandshake,
  Info,
  Phone,
  ShieldCheck,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PriceTag } from "@/components/insurance/PriceTag";
import { ProductArt } from "@/components/insurance/ProductArt";
import { ProductCard } from "@/components/insurance/ProductCard";
import { TariffCard } from "@/components/insurance/TariffCard";
import { CtaSection } from "@/components/sections/CtaSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { buttonStyles } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/JsonLd";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Link } from "@/i18n/navigation";
import { getProduct, getProductSlugs, getProductSummaries } from "@/lib/api/products";
import { resolveLocale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { serviceSchema } from "@/lib/structured-data";
import { cn } from "@/lib/utils";
import { isInsuranceSlug } from "@/types/insurance";

type Props = PageProps<"/[locale]/insurance/[slug]">;

const benefitIcons: LucideIcon[] = [Sparkles, BadgeCheck, HeartHandshake, Zap];

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
  const [summaries, t, nav, common, pricing] = await Promise.all([
    getProductSummaries(locale),
    getTranslations({ locale, namespace: "ProductPage" }),
    getTranslations({ locale, namespace: "Nav" }),
    getTranslations({ locale, namespace: "Common" }),
    getTranslations({ locale, namespace: "Pricing" }),
  ]);

  const path = `/insurance/${product.slug}`;
  const related = product.related
    .map((slug) => summaries.find((item) => item.slug === slug))
    .filter((item) => item !== undefined);
  const tariffCount = product.tariffs.length;

  return (
    <>
      {/* Hero ---------------------------------------------------------- */}
      <section className="relative isolate overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-linear-to-b from-brand-50 via-brand-50/40 to-white"
        />
        <div className="container-page pt-8 pb-16 sm:pt-10 lg:pb-24">
          <Breadcrumbs
            locale={locale}
            currentPath={path}
            items={[{ name: nav("insurance"), path: "/insurance" }, { name: product.name }]}
          />
          <div className="mt-10 grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-6">
              <p className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-ink-soft shadow-xs ring-1 ring-line">
                <ShieldCheck aria-hidden className="size-4 text-brand-600" />
                {product.isMandatory ? common("mandatory") : common("voluntary")}
              </p>
              <h1 className="mt-5 text-[2.5rem] leading-[1.05] font-semibold text-ink sm:text-5xl lg:text-[3.5rem]">
                {product.name}
              </h1>
              <p className="mt-5 text-xl leading-snug font-medium text-ink-soft">{product.tagline}</p>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">{product.shortDescription}</p>

              <ul className="mt-7 flex flex-wrap gap-2">
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

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href={{ pathname: "/apply", query: { type: product.slug } }}
                  className={buttonStyles({ size: "lg" })}
                >
                  {common("applyNow")}
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
                <a
                  href={siteConfig.contact.phoneHref}
                  className={buttonStyles({ variant: "secondary", size: "lg" })}
                >
                  <Phone aria-hidden className="size-4" />
                  {siteConfig.contact.phoneDisplay}
                </a>
              </div>
            </div>
            <div className="lg:col-span-6">
              <ProductArt
                slug={product.slug}
                image={product.image}
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="aspect-[4/3] rounded-[2rem] shadow-card ring-1 ring-line"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Overview ------------------------------------------------------ */}
      <section aria-labelledby="overview-heading" className="container-page pb-20 sm:pb-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading id="overview-heading" title={t("overview")} />
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink-soft">
              {product.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <aside className="lg:col-span-5">
            <div className="rounded-[1.75rem] bg-white p-7 shadow-card ring-1 ring-line lg:sticky lg:top-28">
              <h2 className="text-lg font-semibold text-ink">{t("highlights")}</h2>
              <ul className="mt-5 space-y-3">
                {product.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-3 text-ink-soft">
                    <CircleCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-brand-600" />
                    {highlight}
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-2xl bg-surface px-4 py-3.5">
                <p className="text-xs font-medium text-muted">{pricing("price")}</p>
                <p className="mt-0.5 text-lg">
                  <PriceTag price={product.startingPrice} />
                </p>
              </div>
              <Link
                href={{ pathname: "/apply", query: { type: product.slug } }}
                className={buttonStyles({ className: "mt-6 w-full" })}
              >
                {product.startingPrice ? common("apply") : common("getQuote")}
              </Link>
              <a
                href={siteConfig.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonStyles({ variant: "secondary", className: "mt-3 w-full" })}
              >
                {common("writeWhatsapp")}
                <span className="sr-only">{common("newTab")}</span>
              </a>
            </div>
          </aside>
        </div>
      </section>

      {/* Coverage ------------------------------------------------------ */}
      <section aria-labelledby="coverage-heading" className="bg-surface py-20 sm:py-28">
        <div className="container-page">
          <SectionHeading
            id="coverage-heading"
            title={t("coverageTitle")}
            description={t("coverageDescription")}
          />
          <RevealGroup
            as="ul"
            className={cn(
              "mt-12 grid gap-4 sm:grid-cols-2",
              product.coverage.length % 4 === 0 ? "lg:grid-cols-4" : "lg:grid-cols-3",
            )}
          >
            {product.coverage.map((item) => (
              <RevealItem
                as="li"
                key={item.title}
                className="rounded-[1.75rem] bg-white p-6 shadow-card ring-1 ring-line sm:p-7"
              >
                <span className="grid size-11 place-items-center rounded-2xl bg-brand-50 text-brand-700">
                  <ShieldCheck aria-hidden className="size-5" strokeWidth={1.75} />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{item.description}</p>
              </RevealItem>
            ))}
          </RevealGroup>
          <p className="mt-8 flex max-w-3xl gap-2.5 text-sm leading-relaxed text-muted">
            <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-subtle" />
            {t("coverageNote")}
          </p>
        </div>
      </section>

      {/* Tariffs ------------------------------------------------------- */}
      <section id="tariffs" aria-labelledby="tariffs-heading" className="container-page py-20 sm:py-28">
        <SectionHeading
          id="tariffs-heading"
          align="center"
          title={t("tariffsTitle")}
          description={t("tariffsDescription")}
        />
        <div
          className={cn(
            "mx-auto mt-14 grid gap-6",
            tariffCount === 1 && "max-w-md",
            tariffCount === 2 && "max-w-4xl md:grid-cols-2",
            tariffCount >= 3 && "md:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {product.tariffs.map((tariff) => (
            <TariffCard key={tariff.id} tariff={tariff} productSlug={product.slug} />
          ))}
        </div>
        <p className="mx-auto mt-8 flex max-w-3xl justify-center gap-2.5 text-center text-sm leading-relaxed text-muted">
          <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-subtle" />
          {pricing("disclaimer")}
        </p>
      </section>

      {/* Benefits ------------------------------------------------------ */}
      <section aria-labelledby="benefits-heading" className="container-page pb-20 sm:pb-28">
        <div className="border-t border-line pt-16 sm:pt-20">
          <SectionHeading id="benefits-heading" title={t("benefitsTitle")} />
          <RevealGroup as="ul" className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {product.benefits.map((benefit, index) => {
              const Icon = benefitIcons[index % benefitIcons.length];
              return (
                <RevealItem as="li" key={benefit.title}>
                  <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-700">
                    <Icon aria-hidden className="size-[1.375rem]" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-ink">{benefit.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{benefit.description}</p>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      <HowItWorks title={t("howTitle")} />

      <FaqSection title={t("faqTitle")} items={product.faqs} />

      {/* Related ------------------------------------------------------- */}
      {related.length > 0 ? (
        <section aria-labelledby="related-heading" className="container-page pb-20 sm:pb-28">
          <SectionHeading
            id="related-heading"
            title={t("relatedTitle")}
            description={t("relatedDescription")}
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} compact artClassName="aspect-[16/9]" />
            ))}
          </div>
        </section>
      ) : null}

      <CtaSection
        title={t("ctaTitle", { name: product.name })}
        description={t("ctaDescription")}
        applyType={product.slug}
      />

      <JsonLd data={serviceSchema(locale, product)} />
    </>
  );
}
