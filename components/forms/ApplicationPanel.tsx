import { Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { siteConfig } from "@/lib/site";
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
      className={cn("scroll-mt-24 rounded-[2rem] bg-white p-5 shadow-pop ring-1 ring-line sm:p-7", className)}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 id="apply-heading" className="text-xl font-semibold text-ink sm:text-2xl">
            {t(`applyTitle.${slug}`)}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted">{t("applyDescription")}</p>
        </div>
        <a
          href={siteConfig.contact.phoneHref}
          className="hidden shrink-0 items-center gap-1.5 rounded-full bg-surface px-3 py-2 text-xs font-semibold text-ink transition-colors hover:bg-surface-strong sm:inline-flex"
        >
          <Phone aria-hidden className="size-3.5 text-brand-600" />
          {siteConfig.contact.phoneDisplay}
        </a>
      </div>
      <FormMessages>
        <ProductForm slug={slug} productName={productName} />
      </FormMessages>
    </section>
  );
}
