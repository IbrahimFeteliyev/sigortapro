"use client";

import { Check } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Suspense, useEffect, useRef, useState } from "react";
import { ProductIcon } from "@/components/insurance/ProductIcon";
import { cn } from "@/lib/utils";
import { isInsuranceSlug, type InsuranceProductSummary, type InsuranceSlug } from "@/types/insurance";
import { ProductForm } from "./ProductForm";

/** Reads `?type=…` so older links and product CTAs pre-select a product. */
function TypeFromUrl({ onType }: { onType: (slug: InsuranceSlug) => void }) {
  const type = useSearchParams().get("type");
  useEffect(() => {
    if (type && isInsuranceSlug(type)) onType(type);
  }, [type, onType]);
  return null;
}

export function ApplyHub({ products }: { products: InsuranceProductSummary[] }) {
  const t = useTranslations("Forms");
  const [selected, setSelected] = useState<InsuranceSlug | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const product = products.find((p) => p.slug === selected) ?? null;

  const choose = (slug: InsuranceSlug) => {
    setSelected(slug);
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return (
    <div>
      <Suspense fallback={null}>
        <TypeFromUrl onType={setSelected} />
      </Suspense>

      <div
        role="radiogroup"
        aria-label={t("chooseProduct")}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
      >
        {products.map((p, index) => {
          const active = p.slug === selected;
          return (
            <button
              key={p.slug}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => choose(p.slug)}
              className={cn(
                "group relative isolate aspect-[4/3] overflow-hidden rounded-2xl bg-surface text-left transition-[box-shadow,transform] duration-200 focus-visible:outline-offset-2",
                active
                  ? "ring-2 ring-ink ring-offset-2"
                  : "hover:-translate-y-0.5 hover:shadow-card-hover",
                index === products.length - 1 && "col-span-2 aspect-[8/3] sm:col-span-1 sm:aspect-[4/3]",
              )}
            >
              <Image
                src={p.cardImage.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 230px, (min-width: 640px) 33vw, 100vw"
                placeholder={typeof p.cardImage.src === "string" ? "empty" : "blur"}
                className="-z-10 object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              />
              <span
                aria-hidden
                className="absolute inset-0 -z-10 bg-linear-to-t from-black/75 via-black/20 to-transparent"
              />
              {active ? (
                <span className="absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-white text-ink">
                  <Check aria-hidden className="size-4" strokeWidth={3} />
                </span>
              ) : null}
              <span className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-3">
                <ProductIcon slug={p.slug} className="size-4 shrink-0 text-white" />
                <span className="text-sm leading-snug font-semibold text-white">{p.name}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div ref={formRef} className="scroll-mt-24">
        <AnimatePresence mode="wait" initial={false}>
          {product ? (
            <m.section
              key={product.slug}
              aria-label={product.name}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 rounded-3xl bg-white p-5 shadow-pop ring-1 ring-line sm:p-8"
            >
              <h2 className="mb-6 text-2xl font-semibold text-ink">{product.name}</h2>
              <ProductForm slug={product.slug} productName={product.name} />
            </m.section>
          ) : (
            <p className="mt-8 rounded-2xl bg-surface px-5 py-6 text-center text-muted">
              {t("chooseProductHint")}
            </p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
