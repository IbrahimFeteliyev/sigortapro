import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { buttonStyles } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { InsuranceSlug, Tariff } from "@/types/insurance";
import { PriceTag } from "./PriceTag";
import { ProductIcon } from "./ProductIcon";

/**
 * Reusable pricing card. Data comes from the product's `tariffs`; with no
 * verified price, the card shows "Price on request" and a "Get a quote" CTA.
 */
export function TariffCard({
  tariff,
  productSlug,
  productName,
  className,
}: {
  tariff: Tariff;
  productSlug: InsuranceSlug;
  /** When set, the card shows which product the plan belongs to. */
  productName?: string;
  className?: string;
}) {
  const t = useTranslations("Pricing");
  const common = useTranslations("Common");
  const highlighted = tariff.highlighted;

  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-[1.75rem] bg-white p-6 shadow-card sm:p-7",
        highlighted ? "ring-2 ring-brand-600" : "ring-1 ring-line",
        className,
      )}
    >
      {highlighted ? (
        <span className="absolute -top-3 left-6 rounded-full bg-brand-gradient px-3 py-1 text-xs font-semibold text-white shadow-brand">
          {t("recommended")}
        </span>
      ) : null}

      {productName ? (
        <div className="mb-5 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-700">
            <ProductIcon slug={productSlug} className="size-5" />
          </span>
          <p className="text-sm font-semibold text-ink">{productName}</p>
        </div>
      ) : null}

      <p className="text-sm font-medium text-brand-700">{t("plan")}</p>
      <h3 className="mt-1 text-2xl font-semibold text-ink">{tariff.name}</h3>

      <div className="mt-5 rounded-2xl bg-surface px-4 py-3.5">
        <p className="text-xs font-medium text-muted">{t("price")}</p>
        <p className="mt-0.5 text-lg">
          <PriceTag price={tariff.startingPrice} className="text-ink" />
        </p>
      </div>

      <dl className="mt-5 space-y-3 text-[0.9375rem]">
        <div>
          <dt className="text-xs font-medium text-muted">{t("coverage")}</dt>
          <dd className="mt-0.5 leading-relaxed text-ink-soft">{tariff.summary}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-muted">{t("duration")}</dt>
          <dd className="mt-0.5 font-medium text-ink">{tariff.duration}</dd>
        </div>
      </dl>

      <div className="mt-6 flex-1 border-t border-line pt-5">
        <p className="text-sm font-semibold text-ink">{t("included")}</p>
        <ul className="mt-3 space-y-2.5">
          {tariff.features.map((feature) => (
            <li key={feature} className="flex gap-2.5 text-[0.9375rem] leading-snug text-ink-soft">
              <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-600" strokeWidth={2.5} />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <Link
        href={{ pathname: "/apply", query: { type: productSlug, plan: tariff.id } }}
        className={buttonStyles({
          variant: highlighted ? "primary" : "secondary",
          className: "mt-7 w-full",
        })}
      >
        {tariff.startingPrice ? common("apply") : common("getQuote")}
        <span className="sr-only">
          {" "}
          — {productName ? `${productName}, ` : ""}
          {tariff.name}
        </span>
      </Link>
    </article>
  );
}
