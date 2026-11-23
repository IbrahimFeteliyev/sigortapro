import { useFormatter, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { Money } from "@/types/insurance";

/** Shows a verified starting price, or "Price on request" when none exists. */
export function PriceTag({ price, className }: { price: Money | null; className?: string }) {
  const t = useTranslations("Common");
  const format = useFormatter();

  if (price) {
    return (
      <span className={cn("font-semibold text-ink", className)}>
        {t("fromPrice", { price: format.number(price.amount, { maximumFractionDigits: 0 }) })}
      </span>
    );
  }

  return <span className={cn("font-medium text-ink-soft", className)}>{t("priceOnRequest")}</span>;
}
