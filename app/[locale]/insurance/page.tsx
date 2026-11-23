import { CircleCheck } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ProductGrid } from "@/components/insurance/ProductGrid";
import { ProductIcon } from "@/components/insurance/ProductIcon";
import { CtaSection } from "@/components/sections/CtaSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { PageHero } from "@/components/sections/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Link } from "@/i18n/navigation";
import { getProductSummaries } from "@/lib/api/products";
import { resolveLocale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";
import { itemListSchema } from "@/lib/structured-data";
import type { Faq, InsuranceSlug } from "@/types/insurance";

const PATH = "/insurance";

export async function generateMetadata({ params }: PageProps<"/[locale]/insurance">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Metadata.insurance" });
  return buildPageMetadata({ locale, path: PATH, title: t("title"), description: t("description") });
}

export default async function InsurancePage({ params }: PageProps<"/[locale]/insurance">) {
  const locale = await resolveLocale(params);
  const [products, t, nav, faq] = await Promise.all([
    getProductSummaries(locale),
    getTranslations({ locale, namespace: "InsurancePage" }),
    getTranslations({ locale, namespace: "Nav" }),
    getTranslations({ locale, namespace: "Faq" }),
  ]);

  const bySlug = (slug: InsuranceSlug) => products.find((p) => p.slug === slug);
  const compare = [
    { product: bySlug("car-insurance"), points: t.raw("compulsoryPoints") as string[] },
    { product: bySlug("casco"), points: t.raw("cascoPoints") as string[] },
  ];

  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs locale={locale} items={[{ name: nav("insurance") }]} currentPath={PATH} />}
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />

      <section aria-label={t("eyebrow")} className="container-page pb-20 sm:pb-28">
        <ProductGrid products={products} headingLevel="h2" />
      </section>

      <section aria-labelledby="compare-heading" className="container-page pb-20 sm:pb-28">
        <Reveal>
          <div className="rounded-[2rem] bg-surface p-6 sm:p-10 lg:p-14">
            <SectionHeading
              id="compare-heading"
              title={t("compareTitle")}
              description={t("compareDescription")}
            />
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {compare.map(({ product, points }) =>
                product ? (
                  <div
                    key={product.slug}
                    className="rounded-[1.75rem] bg-white p-6 shadow-card ring-1 ring-line sm:p-8"
                  >
                    <div className="flex items-center gap-4">
                      <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-700">
                        <ProductIcon slug={product.slug} className="size-6" />
                      </span>
                      <h3 className="text-xl font-semibold text-ink">
                        <Link href={`/insurance/${product.slug}`} className="hover:text-brand-700">
                          {product.name}
                        </Link>
                      </h3>
                    </div>
                    <ul className="mt-6 space-y-3">
                      {points.map((point) => (
                        <li key={point} className="flex gap-3 text-ink-soft">
                          <CircleCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-brand-600" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null,
              )}
            </div>
            <p className="mt-8 text-muted">{t("compareNote")}</p>
          </div>
        </Reveal>
      </section>

      <HowItWorks />
      <FaqSection
        eyebrow={faq("eyebrow")}
        title={faq("title")}
        description={faq("description")}
        items={faq.raw("items") as Faq[]}
      />
      <CtaSection />
      <JsonLd data={itemListSchema(locale, products)} />
    </>
  );
}
