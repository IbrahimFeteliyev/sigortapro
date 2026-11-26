"use client";

import { m } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import {
  lifeAgeGroups,
  lifeCategories,
  lifeCoverageAmounts,
  lifePrice,
  type LifeCategoryId,
} from "@/data/life-tariffs";
import type { Locale } from "@/i18n/routing";
import { formatAzn } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Tariff table: pick a category, then read the premium by age group (rows)
 * and coverage amount (columns). Prices come from `data/life-tariffs.ts`.
 */
export function LifeTariffTable() {
  const t = useTranslations("Forms.life");
  const locale = useLocale() as Locale;
  const [category, setCategory] = useState<LifeCategoryId>(lifeCategories[0].id);
  const current = lifeCategories.find((c) => c.id === category) ?? lifeCategories[0];

  return (
    <div>
      <div
        role="tablist"
        aria-label={t("category")}
        className="-m-1 no-scrollbar flex gap-2 overflow-x-auto p-1"
      >
        {lifeCategories.map((c) => {
          const active = c.id === category;
          return (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls="life-tariff-panel"
              onClick={() => setCategory(c.id)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors duration-200",
                active ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-line-strong hover:ring-ink",
              )}
            >
              {c.name[locale]}
            </button>
          );
        })}
      </div>

      <m.div
        id="life-tariff-panel"
        role="tabpanel"
        key={category}
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="mt-5 overflow-x-auto rounded-2xl ring-1 ring-line"
      >
        <table className="w-full min-w-[34rem] border-collapse bg-white text-[0.9375rem]">
          <caption className="sr-only">{current.name[locale]}</caption>
          <thead>
            <tr className="border-b border-line bg-surface">
              <th
                scope="col"
                className="sticky left-0 bg-surface px-4 py-3.5 text-left font-semibold text-ink sm:px-5"
              >
                {t("ageGroup")}
              </th>
              {lifeCoverageAmounts.map((amount) => (
                <th
                  key={amount}
                  scope="col"
                  className="px-4 py-3.5 text-right font-semibold text-ink tabular-nums sm:px-5"
                >
                  <span className="block text-xs font-medium text-muted">{t("amount")}</span>
                  {formatAzn(amount, locale)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {lifeAgeGroups.map((group) => (
              <tr key={group.id} className="transition-colors hover:bg-surface/60">
                <th
                  scope="row"
                  className="sticky left-0 bg-white px-4 py-3.5 text-left font-medium text-ink sm:px-5"
                >
                  {t("ageGroupValue", { min: group.min, max: group.max })}
                </th>
                {lifeCoverageAmounts.map((amount) => {
                  const price = lifePrice(category, group.id, amount);
                  return (
                    <td key={amount} className="px-4 py-3.5 text-right tabular-nums sm:px-5">
                      {price ? (
                        <span className="font-semibold text-ink">{formatAzn(price.amount, locale)}</span>
                      ) : (
                        <span className="text-subtle" aria-label={t("priceUnavailable")}>
                          —
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </m.div>
      <p className="mt-3 text-sm leading-relaxed text-muted">{t("tableNote")}</p>
    </div>
  );
}
