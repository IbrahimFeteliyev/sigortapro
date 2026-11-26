"use client";

import { ArrowRight } from "lucide-react";
import { useState, type FormEvent } from "react";
import { ProductIcon } from "@/components/insurance/ProductIcon";
import { buttonStyles } from "@/components/ui/button";
import { Select } from "@/components/ui/Select";
import type { InsuranceSlug } from "@/types/insurance";

/** Hero search pill: pick an insurance type, then continue to the form (GET /apply?type=…). */
export function QuickSelect({
  action,
  products,
  label,
  placeholder,
  submitLabel,
}: {
  action: string;
  products: { slug: InsuranceSlug; name: string }[];
  label: string;
  placeholder: string;
  submitLabel: string;
}) {
  const [type, setType] = useState("");
  const [shake, setShake] = useState(false);

  const onSubmit = (event: FormEvent) => {
    if (!type) {
      event.preventDefault();
      setShake(true);
      document.getElementById("hero-quick-type")?.click();
    }
  };

  return (
    <form
      action={action}
      method="get"
      onSubmit={onSubmit}
      onAnimationEnd={() => setShake(false)}
      className={`mt-8 flex max-w-xl items-center gap-2 rounded-full bg-white p-2 shadow-float ring-1 ring-line transition-shadow focus-within:ring-2 focus-within:ring-ink ${shake ? "ring-2 ring-ink" : ""}`}
    >
      <div className="min-w-0 flex-1 pr-3 pl-5">
        <p id="hero-quick-label" className="text-xs font-semibold text-ink">
          {label}
        </p>
        <Select
          id="hero-quick-type"
          variant="bare"
          aria-labelledby="hero-quick-label"
          value={type}
          onChange={setType}
          placeholder={placeholder}
          options={products.map((p) => ({
            value: p.slug,
            label: p.name,
            icon: <ProductIcon slug={p.slug} className="size-[1.125rem]" />,
          }))}
        />
        <input type="hidden" name="type" value={type} />
      </div>
      <button type="submit" className={buttonStyles({ size: "lg", className: "rounded-full px-5 sm:px-6" })}>
        <span className="hidden sm:inline">{submitLabel}</span>
        <ArrowRight aria-hidden className="size-5 sm:size-4" />
        <span className="sr-only sm:hidden">{submitLabel}</span>
      </button>
    </form>
  );
}
