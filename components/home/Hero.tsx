import { ArrowRight, ShieldCheck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { buttonStyles } from "@/components/ui/button";
import { getPathname, Link } from "@/i18n/navigation";
import type { InsuranceProductSummary } from "@/types/insurance";
import { HeroVisual } from "./HeroVisual";
import { QuickSelect } from "./QuickSelect";

export function Hero({ products }: { products: InsuranceProductSummary[] }) {
  const t = useTranslations("Hero");
  const locale = useLocale();
  const applyPath = getPathname({ href: "/apply", locale });

  return (
    <section className="relative isolate z-10 overflow-x-clip">
      {/* Soft glows as radial gradients (no CSS filters: cheaper to paint). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(40rem_32rem_at_85%_0%,rgb(220_231_254/0.85),transparent_70%),radial-gradient(28rem_24rem_at_0%_45%,rgb(238_244_255/0.9),transparent_70%)]"
      >
        <div className="absolute inset-0 bg-dot-grid [mask-image:radial-gradient(55%_55%_at_30%_20%,black,transparent)]" />
      </div>

      <div className="container-page grid items-center gap-12 pt-10 pb-16 sm:pt-14 lg:grid-cols-12 lg:gap-8 lg:pt-16 lg:pb-24">
        <div className="lg:col-span-6">
          <p className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-sm font-medium text-ink-soft shadow-xs ring-1 ring-line">
            <ShieldCheck aria-hidden className="size-4 text-brand-600" />
            {t("badge")}
          </p>

          <h1 className="mt-6 text-[2.6rem] leading-[1.04] font-semibold tracking-[-0.035em] text-ink sm:text-6xl lg:text-[4.1rem]">
            {t.rich("title", {
              brand: (chunks) => <span className="text-gradient-brand">{chunks}</span>,
            })}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">{t("description")}</p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/insurance" className={buttonStyles({ size: "lg" })}>
              {t("ctaPrimary")}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
            <Link href="/apply" className={buttonStyles({ variant: "secondary", size: "lg" })}>
              {t("ctaSecondary")}
            </Link>
          </div>

          <QuickSelect
            action={applyPath}
            products={products.map(({ slug, name }) => ({ slug, name }))}
            label={t("quickLabel")}
            placeholder={t("quickPlaceholder")}
            submitLabel={t("quickSubmit")}
          />
        </div>

        <div className="lg:col-span-6">
          <HeroVisual products={products} />
        </div>
      </div>
    </section>
  );
}
