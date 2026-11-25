import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { buttonStyles } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { InsuranceProductSummary } from "@/types/insurance";
import { ProductIcon } from "./ProductIcon";

/** Photo-led product card: the card opens the product page, the button jumps to its form. */
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
  const Heading = headingLevel;
  const href = `/insurance/${product.slug}` as const;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-card ring-1 ring-line",
        "transition-[box-shadow,transform] duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-card-hover",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
      )}
    >
      <div className={cn("relative overflow-hidden bg-surface", imageClassName)}>
        <Image
          src={product.cardImage.src}
          alt={product.cardImage.alt}
          fill
          sizes={sizes}
          preload={preload}
          placeholder={typeof product.cardImage.src === "string" ? "empty" : "blur"}
          className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.04] motion-reduce:transition-none"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-ink/35 via-transparent to-transparent"
        />
        <span className="absolute bottom-4 left-4 grid size-11 place-items-center rounded-2xl bg-white/95 text-brand-700 shadow-float">
          <ProductIcon slug={product.slug} className="size-5" />
        </span>
        {product.isMandatory ? (
          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-ink shadow-xs">
            <span aria-hidden className="size-1.5 rounded-full bg-brand-600" />
            {t("mandatory")}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <Heading className="text-xl font-semibold text-ink">
          <Link
            href={href}
            className="outline-none after:absolute after:inset-0 after:rounded-[1.75rem] after:content-[''] focus-visible:after:ring-2 focus-visible:after:ring-brand-600"
          >
            {product.name}
          </Link>
        </Heading>
        <p className="mt-2 line-clamp-3 text-[0.9375rem] leading-relaxed text-muted">
          {product.shortDescription}
        </p>
        <div className="relative z-10 mt-auto flex items-center justify-between gap-3 pt-5">
          <Link href={`${href}#apply`} className={buttonStyles({ size: "md" })}>
            {t("apply")}
            <span className="sr-only"> — {product.name}</span>
          </Link>
          <span
            aria-hidden
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 transition-transform group-hover:translate-x-0.5"
          >
            {t("details")}
            <ArrowRight className="size-4" />
          </span>
        </div>
      </div>
    </article>
  );
}
