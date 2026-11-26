import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { InsuranceSlug } from "@/types/insurance";
import { FormMessages } from "./FormMessages";
import { ProductForm } from "./ProductForm";

/** Card that frames a product's application form (used in product heroes). */
export async function ApplicationPanel({
  locale,
  slug,
  productName,
  className,
}: {
  locale: Locale;
  slug: InsuranceSlug;
  productName: string;
  className?: string;
}) {
  const t = await getTranslations({ locale, namespace: "ProductPage" });

  return (
    <section
      id="apply"
      aria-labelledby="apply-heading"
      className={cn("scroll-mt-24 rounded-3xl bg-white p-5 shadow-pop ring-1 ring-line sm:p-7", className)}
    >
      <div className="mb-5">
        <h2 id="apply-heading" className="text-xl font-semibold text-ink sm:text-[1.375rem]">
          {t(`applyTitle.${slug}`)}
        </h2>
        <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted">{t("applyDescription")}</p>
      </div>
      <FormMessages>
        <ProductForm slug={slug} productName={productName} />
      </FormMessages>
    </section>
  );
}
