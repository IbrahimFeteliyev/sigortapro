import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { ProductGrid } from "@/components/insurance/ProductGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Link } from "@/i18n/navigation";
import type { InsuranceProductSummary } from "@/types/insurance";

export function ProductsSection({ products }: { products: InsuranceProductSummary[] }) {
  const t = useTranslations("Products");

  return (
    <section
      id="products"
      aria-labelledby="products-heading"
      className="container-page scroll-mt-24 pt-8 pb-12 sm:py-16"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading id="products-heading" title={t("title")} description={t("description")} />
        <Link
          href="/insurance"
          className="group inline-flex shrink-0 items-center gap-1.5 font-semibold text-ink underline-offset-4 hover:underline"
        >
          {t("viewAll")}
          <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      <ProductGrid products={products} className="mt-10" />
    </section>
  );
}
