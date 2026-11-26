import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { CompanyGrid } from "@/components/insurance/CompanyGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { InsuranceCompany } from "@/data/companies";
import { Link } from "@/i18n/navigation";

export function CompaniesSection({ companies }: { companies: InsuranceCompany[] }) {
  const t = useTranslations("Companies");

  return (
    <section aria-labelledby="companies-heading" className="container-page py-12 sm:py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading id="companies-heading" title={t("title")} description={t("description")} />
        <Link
          href="/companies"
          className="group inline-flex shrink-0 items-center gap-1.5 font-semibold text-ink underline-offset-4 hover:underline"
        >
          {t("viewAll")}
          <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      <div className="mt-8">
        <CompanyGrid companies={companies} />
      </div>
    </section>
  );
}
