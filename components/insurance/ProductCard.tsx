import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { buttonStyles } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { formatAzn } from "@/lib/format";
import { priceHint } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import type { InsuranceProductSummary } from "@/types/insurance";

/**
 * Listing-style product card: a large photo, the name, one line of text and
 * the price line. The whole card opens the product page (form at the top).
 */
export function ProductCard({
  product,
  imageClassName = "aspect-[4/3]",
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  headingLevel = "h3",
  preload = false,
}: {
  product: InsuranceProductSummary;
  imageClassName?: string;
  sizes?: string;
  headingLevel?: "h2" | "h3";
  preload?: boolean;
}) {
  const t = useTranslations("Common");
  const locale = useLocale() as Locale;
  const Heading = headingLevel;
  const hint = priceHint(product.slug);

  return (
    <article className="group relative flex h-full flex-col">
      <div className={cn("relative overflow-hidden rounded-2xl bg-surface", imageClassName)}>
        <Image
          src={product.cardImage.src}
          alt={product.cardImage.alt}
          fill
          sizes={sizes}
          preload={preload}
          placeholder={typeof product.cardImage.src === "string" ? "empty" : "blur"}
          className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.03] motion-reduce:transition-none"
        />
        {product.isMandatory ? (
          <span className="absolute top-3 left-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink shadow-xs">
            {t("mandatory")}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col pt-4">
        <Heading className="text-lg leading-snug font-semibold text-ink">
          <Link
            href={`/insurance/${product.slug}`}
            className="outline-none after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:after:ring-2 focus-visible:after:ring-ink focus-visible:after:ring-offset-4"
          >
            {product.name}
          </Link>
        </Heading>
        <p className="mt-1 line-clamp-2 text-[0.9375rem] leading-relaxed text-muted">
          {product.shortDescription}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <p className="text-[0.9375rem] font-semibold text-ink">
            {hint.kind === "from"
              ? t("fromPrice", { price: formatAzn(hint.amount, locale) })
              : t(hint.kind === "statutory" ? "statutoryPrice" : "individualPrice")}
          </p>
          <Link
            href={{ pathname: `/insurance/${product.slug}`, hash: "apply" }}
            className={buttonStyles({ variant: "secondary", size: "sm", className: "relative z-10" })}
          >
            {t("apply")}
            <span className="sr-only"> — {product.name}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
