import { ArrowRight, Info } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ProductIcon } from "@/components/insurance/ProductIcon";
import { TariffCard } from "@/components/insurance/TariffCard";
import { CtaSection } from "@/components/sections/CtaSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { PageHero } from "@/components/sections/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/ui/Reveal";
import { Link } from "@/i18n/navigation";
import { getProducts } from "@/lib/api/products";
import { resolveLocale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import type { Faq } from "@/types/insurance";

const PATH = "/prices";

export async function generateMetadata({ params }: PageProps<"/[locale]/prices">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Metadata.prices" });
  return buildPageMetadata({ locale, path: PATH, title: t("title"), description: t("description") });
}

export default async function PricesPage({ params }: PageProps<"/[locale]/prices">) {
  const locale = await resolveLocale(params);
  const [products, t, nav, pricing] = await Promise.all([
    getProducts(locale),
    getTranslations({ locale, namespace: "PricesPage" }),
    getTranslations({ locale, namespace: "Nav" }),
    getTranslations({ locale, namespace: "Pricing" }),
  ]);

  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs locale={locale} items={[{ name: nav("prices") }]} currentPath={PATH} />}
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      >
        <p className="mt-6 flex max-w-2xl gap-2.5 rounded-2xl bg-white/80 p-4 text-sm leading-relaxed text-muted ring-1 ring-line">
          <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-600" />
          {pricing("disclaimer")}
        </p>
      </PageHero>

      {/* In-page navigation */}
      <nav
        aria-label={nav("productsMenu")}
        className="sticky top-16 z-30 border-y border-line bg-white/90 backdrop-blur-xl lg:top-[4.5rem]"
      >
        <ul className="container-page no-scrollbar flex gap-2 overflow-x-auto py-3">
          {products.map((product) => (
            <li key={product.slug} className="shrink-0">
              <a
                href={`#${product.slug}`}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-ink-soft ring-1 ring-line transition-colors hover:bg-surface hover:text-ink"
              >
                <ProductIcon slug={product.slug} className="size-4 text-brand-600" />
                {product.shortName}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="container-page divide-y divide-line">
        {products.map((product) => {
          const count = product.tariffs.length;
          return (
            <section
              key={product.slug}
              id={product.slug}
              aria-labelledby={`${product.slug}-heading`}
              className="scroll-mt-36 py-16 sm:py-20"
            >
              <Reveal>
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <div className="flex items-start gap-4">
                    <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-700">
                      <ProductIcon slug={product.slug} className="size-7" strokeWidth={1.6} />
                    </span>
                    <div>
                      <h2
                        id={`${product.slug}-heading`}
                        className="text-2xl font-semibold text-ink sm:text-3xl"
                      >
                        {product.name}
                      </h2>
                      <p className="mt-1.5 text-muted">{product.tagline}</p>
                    </div>
                  </div>
                  <Link
                    href={`/insurance/${product.slug}`}
                    className="group inline-flex shrink-0 items-center gap-2 font-semibold text-brand-700 hover:text-brand-800"
                  >
                    {t("viewProduct")}
                    <span className="sr-only">— {product.name}</span>
                    <ArrowRight
                      aria-hidden
                      className="size-4 transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>
              </Reveal>
              <div
                className={cn(
                  "mt-10 grid gap-6",
                  count === 1 && "max-w-md",
                  count === 2 && "md:grid-cols-2 lg:max-w-4xl",
                  count >= 3 && "md:grid-cols-2 lg:grid-cols-3",
                )}
              >
                {product.tariffs.map((tariff) => (
                  <TariffCard key={tariff.id} tariff={tariff} productSlug={product.slug} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="border-t border-line">
        <FaqSection title={t("faqTitle")} items={t.raw("faq") as Faq[]} />
      </div>
      <CtaSection />
    </>
  );
}
