import { ArrowRight, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { TariffCard } from "@/components/insurance/TariffCard";
import { Carousel } from "@/components/ui/Carousel";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Link } from "@/i18n/navigation";
import type { InsuranceProductSummary } from "@/types/insurance";

/** Featured plan per product, presented as a horizontal carousel. */
export function PricingSection({ products }: { products: InsuranceProductSummary[] }) {
  const t = useTranslations("Pricing");

  return (
    <section aria-labelledby="pricing-heading" className="overflow-hidden bg-surface py-20 sm:py-28">
      <div className="container-page">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="pricing-heading"
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("description")}
          />
          <Link
            href="/prices"
            className="group inline-flex shrink-0 items-center gap-2 font-semibold text-brand-700 transition-colors hover:text-brand-800"
          >
            {t("viewAll")}
            <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <Carousel label={t("title")} previousLabel={t("previous")} nextLabel={t("next")} className="mt-8">
          {products.map((product) =>
            product.featuredTariff ? (
              <div key={product.slug} className="flex w-[85%] max-w-[22rem] shrink-0 snap-start sm:w-[22rem]">
                <TariffCard
                  tariff={product.featuredTariff}
                  productSlug={product.slug}
                  productName={product.name}
                  className="w-full"
                />
              </div>
            ) : null,
          )}
        </Carousel>

        <p className="mt-2 flex max-w-3xl gap-2.5 text-sm leading-relaxed text-muted">
          <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-subtle" />
          {t("disclaimer")}
        </p>
      </div>
    </section>
  );
}
