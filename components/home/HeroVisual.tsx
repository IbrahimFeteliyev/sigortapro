import { ChevronRight, CircleCheck, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { ProductIcon } from "@/components/insurance/ProductIcon";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { cn } from "@/lib/utils";
import type { InsuranceProductSummary } from "@/types/insurance";

/**
 * Product-UI composition used instead of stock photography: a deep-blue panel
 * with a "choose your cover" card and status chips. Decorative only.
 *
 * Layout: the card sits in the upper part of the panel; chips live on the
 * dark panel (top-right corner and the bottom strip) so they never cover
 * the card's content.
 */
export function HeroVisual({ products }: { products: InsuranceProductSummary[] }) {
  const t = useTranslations("Hero");
  const selectedIndex = 1;

  return (
    <div
      aria-hidden
      className="relative mx-auto w-full max-w-[34rem] animate-fade-in motion-reduce:animate-none lg:max-w-none"
    >
      <div className="relative aspect-[1/1.2] overflow-hidden rounded-[2.25rem] bg-hero-panel shadow-[0_40px_80px_-32px_rgb(13_26_66/0.6)] sm:aspect-square lg:aspect-[7/6]">
        <svg
          viewBox="0 0 600 600"
          fill="none"
          className="absolute -top-44 -right-44 size-[40rem] text-white/10"
        >
          <circle cx="300" cy="300" r="110" stroke="currentColor" />
          <circle cx="300" cy="300" r="180" stroke="currentColor" />
          <circle cx="300" cy="300" r="250" stroke="currentColor" />
        </svg>
        <div className="absolute inset-0 bg-[linear-gradient(rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.04)_1px,transparent_1px)] bg-[size:44px_44px]" />

        {/* Main card */}
        <div className="absolute inset-x-5 top-16 sm:inset-x-12">
          <div className="rounded-[1.6rem] bg-white p-3 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.45)]">
            <p className="px-2 pt-1 pb-2.5 text-[0.9375rem] font-semibold text-ink">{t("visualTitle")}</p>
            <ul className="space-y-1">
              {products.map((product, index) => {
                const selected = index === selectedIndex;
                return (
                  <li
                    key={product.slug}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-2.5 py-2",
                      selected && "bg-brand-50 ring-1 ring-brand-200",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-9 shrink-0 place-items-center rounded-xl",
                        selected ? "bg-brand-gradient text-white" : "bg-surface text-brand-700",
                      )}
                    >
                      <ProductIcon slug={product.slug} className="size-[1.125rem]" />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">
                      {product.name}
                    </span>
                    {selected ? (
                      <CircleCheck className="size-5 shrink-0 text-brand-600" />
                    ) : (
                      <ChevronRight className="size-4 shrink-0 text-subtle" />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Top-right chip, overlapping only the card's empty corner */}
        <div className="absolute top-5 right-5 sm:top-6 sm:right-8">
          <div className="flex items-center gap-2 rounded-full bg-white py-2 pr-4 pl-2 text-sm font-semibold text-ink shadow-float">
            <span className="grid size-7 place-items-center rounded-full bg-brand-50">
              <ShieldCheck className="size-4 text-brand-600" />
            </span>
            {t("visualProtected")}
          </div>
        </div>

        {/* Bottom strip */}
        <div className="absolute inset-x-5 bottom-5 hidden items-end justify-between gap-4 sm:inset-x-8 sm:bottom-7 sm:flex">
          <div className="flex items-center gap-2 rounded-full bg-brand-950/70 py-2 pr-4 pl-2 text-sm font-medium text-white ring-1 ring-white/20 backdrop-blur">
            <span className="grid size-7 place-items-center rounded-full bg-whatsapp">
              <WhatsAppIcon className="size-4" />
            </span>
            {t("visualWhatsapp")}
          </div>
          <div className="w-52 rounded-2xl bg-white p-3.5 shadow-float">
            <p className="text-sm font-semibold text-ink">{t("visualApplication")}</p>
            <p className="mt-0.5 text-xs text-muted">{t("visualApplicationText")}</p>
            <div className="mt-3 grid grid-cols-4 gap-1.5">
              <span className="h-1.5 rounded-full bg-brand-600" />
              <span className="h-1.5 rounded-full bg-brand-600" />
              <span className="h-1.5 rounded-full bg-brand-600" />
              <span className="h-1.5 rounded-full bg-brand-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
