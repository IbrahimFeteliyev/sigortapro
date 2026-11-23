import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { ProductGrid } from "@/components/insurance/ProductGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Link } from "@/i18n/navigation";
import type { InsuranceProductSummary } from "@/types/insurance";

export function ProductsSection({ products }: { products: InsuranceProductSummary[] }) {
  const t = useTranslations("Products");

  return (
    <section id="products" aria-labelledby="products-heading" className="container-page py-20 sm:py-28">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          id="products-heading"
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />
        <Link
          href="/insurance"
          className="group inline-flex shrink-0 items-center gap-2 font-semibold text-brand-700 transition-colors hover:text-brand-800"
        >
          {t("viewAll")}
          <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      <ProductGrid products={products} className="mt-12" />
    </section>
  );
}
