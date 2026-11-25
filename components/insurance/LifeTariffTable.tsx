"use client";

import { Info } from "lucide-react";
import { m } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { formatAzn } from "@/lib/format";
import { useState } from "react";
import {
  lifeAgeGroups,
  lifeCategories,
  lifeCategoryAmounts,
  lifeCoverageAmounts,
  lifePrice,
  type LifeCategoryId,
} from "@/data/life-tariffs";
import { cn } from "@/lib/utils";

/**
 * Interactive tariff table (category tabs × age group × coverage amount).
 * Cells show only verified prices; unconfirmed cells show "—".
 */
export function LifeTariffTable() {
  const t = useTranslations("Forms.life");
  const locale = useLocale();
  const [category, setCategory] = useState<LifeCategoryId>(lifeCategories[0].id);
  const offered = lifeCategoryAmounts[category];
  const anyPrice = lifeAgeGroups.some((g) => lifeCoverageAmounts.some((a) => lifePrice(category, g.id, a)));

  return (
    <div>
      <div
        role="tablist"
        aria-label={t("category")}
        className="-mx-1 no-scrollbar flex gap-2 overflow-x-auto px-1 pb-1"
      >
        {lifeCategories.map((c) => {
          const active = c.id === category;
          return (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setCategory(c.id)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition-[background-color,color,box-shadow] duration-200",
                active
                  ? "bg-brand-gradient text-white shadow-brand"
                  : "bg-surface text-ink-soft hover:bg-surface-strong",
              )}
            >
              {c.name[locale]}
            </button>
          );
        })}
      </div>

      <m.div
        key={category}
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="mt-5 overflow-x-auto rounded-[1.5rem] ring-1 ring-line"
      >
        <table className="w-full min-w-[34rem] border-collapse bg-white text-sm">
          <caption className="sr-only">{lifeCategories.find((c) => c.id === category)?.name[locale]}</caption>
          <thead>
            <tr className="bg-surface">
              <th scope="col" className="px-4 py-3 text-left font-semibold text-ink">
                {t("ageGroup")}
              </th>
              {lifeCoverageAmounts.map((amount) => (
                <th
                  key={amount}
                  scope="col"
                  className="px-4 py-3 text-right font-semibold text-ink tabular-nums"
                >
                  {formatAzn(amount, locale)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {lifeAgeGroups.map((group) => (
              <tr key={group.id}>
                <th scope="row" className="px-4 py-3 text-left font-medium text-ink-soft">
                  {t("ageGroupValue", { min: group.min, max: group.max })}
                </th>
                {lifeCoverageAmounts.map((amount) => {
                  const price = offered.includes(amount) ? lifePrice(category, group.id, amount) : null;
                  return (
                    <td key={amount} className="px-4 py-3 text-right tabular-nums">
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
      {!anyPrice ? (
        <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-muted">
          <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-600" />
          {t("tableUnavailableNote")}
        </p>
      ) : null}
    </div>
  );
}
