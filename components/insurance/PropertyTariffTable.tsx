import { useLocale, useTranslations } from "next-intl";
import { propertyRegionTariffs } from "@/data/property-tariffs";
import type { Locale } from "@/i18n/routing";
import { formatAzn } from "@/lib/format";

/** Standard property insurance tariffs by region (from `data/property-tariffs.ts`). */
export function PropertyTariffTable() {
  const t = useTranslations("Forms.property");
  const locale = useLocale() as Locale;
  const money = (amount: number) => formatAzn(amount, locale);

  return (
    <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-line">
      <table className="w-full border-collapse text-[0.9375rem]">
        <caption className="sr-only">{t("standardTitle")}</caption>
        <thead>
          <tr className="border-b border-line bg-surface">
            <th scope="col" className="px-4 py-3.5 text-left font-semibold text-ink sm:px-6">
              {t("region")}
            </th>
            <th scope="col" className="px-4 py-3.5 text-right font-semibold text-ink sm:px-6">
              {t("coverageAmount")}
            </th>
            <th scope="col" className="px-4 py-3.5 text-right font-semibold text-ink sm:px-6">
              {t("price")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {propertyRegionTariffs.map((row) => (
            <tr key={row.id} className="transition-colors hover:bg-surface/60">
              <th scope="row" className="px-4 py-3.5 text-left font-medium text-ink sm:px-6">
                {row.name[locale]}
              </th>
              <td className="px-4 py-3.5 text-right text-muted tabular-nums sm:px-6">
                {money(row.coverage.amount)}
              </td>
              <td className="px-4 py-3.5 text-right font-semibold text-ink tabular-nums sm:px-6">
                {money(row.price.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
