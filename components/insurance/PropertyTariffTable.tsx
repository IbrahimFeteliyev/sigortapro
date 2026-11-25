import { useLocale, useTranslations } from "next-intl";
import { formatAzn } from "@/lib/format";
import { propertyRegionTariffs } from "@/data/property-tariffs";

/** Standard property insurance tariffs by region (from `data/property-tariffs.ts`). */
export function PropertyTariffTable() {
  const t = useTranslations("Forms.property");
  const locale = useLocale();
  const money = (amount: number) => formatAzn(amount, locale);

  return (
    <div className="overflow-hidden rounded-[1.5rem] bg-white shadow-card ring-1 ring-line">
      <table className="w-full border-collapse text-sm sm:text-[0.9375rem]">
        <caption className="sr-only">{t("standardTitle")}</caption>
        <thead>
          <tr className="bg-surface">
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
            <tr key={row.id} className="transition-colors hover:bg-brand-50/40">
              <th scope="row" className="px-4 py-3.5 text-left font-medium text-ink sm:px-6">
                {row.name[locale]}
              </th>
              <td className="px-4 py-3.5 text-right text-ink-soft tabular-nums sm:px-6">
                {money(row.coverage.amount)}
              </td>
              <td className="px-4 py-3.5 text-right font-semibold text-brand-700 tabular-nums sm:px-6">
                {money(row.price.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
