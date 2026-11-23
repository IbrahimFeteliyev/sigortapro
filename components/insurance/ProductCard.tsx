import { useTranslations } from "next-intl";
import { buttonStyles } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { InsuranceProductSummary } from "@/types/insurance";
import { PriceTag } from "./PriceTag";
import { ProductArt } from "./ProductArt";

export function ProductCard({
  product,
  artClassName = "aspect-[4/3]",
  compact = false,
  headingLevel = "h3",
}: {
  product: InsuranceProductSummary;
  /** Aspect-ratio classes for the visual. */
  artClassName?: string;
  /** Hides the price row and clamps the description (used for related items). */
  compact?: boolean;
  headingLevel?: "h2" | "h3";
}) {
  const t = useTranslations("Common");
  const Heading = headingLevel;
  const href = `/insurance/${product.slug}` as const;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col rounded-[1.75rem] bg-white p-2.5 shadow-card ring-1 ring-line",
        "transition-[box-shadow,transform] duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-card-hover",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
      )}
    >
      <ProductArt
        slug={product.slug}
        image={product.image}
        label={product.isMandatory ? t("mandatory") : undefined}
        className={cn("rounded-[1.35rem]", artClassName)}
      />
      <div className="flex flex-1 flex-col px-2.5 pt-5 pb-2.5 sm:px-3">
        <Heading className="text-xl font-semibold text-ink">
          <Link
            href={href}
            className="outline-none after:absolute after:inset-0 after:rounded-[1.75rem] after:content-[''] focus-visible:after:ring-2 focus-visible:after:ring-brand-600"
          >
            {product.name}
          </Link>
        </Heading>
        <p
          className={cn(
            "mt-2 leading-relaxed text-muted",
            compact ? "line-clamp-2 text-[0.9375rem]" : "text-[0.9375rem]",
          )}
        >
          {product.shortDescription}
        </p>
        {!compact ? (
          <p className="mt-auto pt-5 text-sm">
            <PriceTag price={product.startingPrice} />
          </p>
        ) : null}
        <div className={cn("relative z-10 flex gap-2", compact ? "mt-5" : "mt-4")}>
          <Link
            href={href}
            className={buttonStyles({ variant: "secondary", size: "sm", className: "flex-1" })}
          >
            {t("details")}
            <span className="sr-only"> — {product.name}</span>
          </Link>
          <Link
            href={{ pathname: "/apply", query: { type: product.slug } }}
            className={buttonStyles({ size: "sm", className: "flex-1" })}
          >
            {t("apply")}
            <span className="sr-only"> — {product.name}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
