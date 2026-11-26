import { Check } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ProductGrid } from "@/components/insurance/ProductGrid";
import { CtaSection } from "@/components/sections/CtaSection";
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
import type { InsuranceSlug } from "@/types/insurance";

const PATH = "/insurance";

export async function generateMetadata({ params }: PageProps<"/[locale]/insurance">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Metadata.insurance" });
  return buildPageMetadata({ locale, path: PATH, title: t("title"), description: t("description") });
}

export default async function InsurancePage({ params }: PageProps<"/[locale]/insurance">) {
  const locale = await resolveLocale(params);
  const [products, t, nav] = await Promise.all([
    getProductSummaries(locale),
    getTranslations({ locale, namespace: "InsurancePage" }),
    getTranslations({ locale, namespace: "Nav" }),
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
        title={t("title")}
        description={t("description")}
      />

      <section aria-label={t("title")} className="container-page pb-12 sm:pb-16">
        <ProductGrid products={products} headingLevel="h2" />
      </section>

      <section aria-labelledby="compare-heading" className="container-page py-12 sm:py-16">
        <SectionHeading
          id="compare-heading"
          title={t("compareTitle")}
          description={t("compareDescription")}
        />
        <Reveal className="mt-8 grid gap-4 md:grid-cols-2">
          {compare.map(({ product, points }) =>
            product ? (
              <div key={product.slug} className="rounded-2xl p-6 ring-1 ring-line sm:p-8">
                <h3 className="text-xl font-semibold text-ink">
                  <Link href={`/insurance/${product.slug}`} className="underline-offset-4 hover:underline">
                    {product.name}
                  </Link>
                </h3>
                <ul className="mt-5 space-y-3">
                  {points.map((point) => (
                    <li key={point} className="flex gap-3 text-ink-soft">
                      <Check aria-hidden className="mt-1 size-4 shrink-0 text-brand-600" strokeWidth={2.5} />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null,
          )}
        </Reveal>
        <p className="mt-6 text-muted">{t("compareNote")}</p>
      </section>

      <CtaSection />
      <JsonLd data={itemListSchema(locale, products)} />
    </>
  );
}
