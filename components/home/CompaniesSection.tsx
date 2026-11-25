import { ArrowRight, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { CompanyGrid } from "@/components/insurance/CompanyGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { InsuranceCompany } from "@/data/companies";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";

export function CompaniesSection({ companies }: { companies: InsuranceCompany[] }) {
  const t = useTranslations("Companies");

  return (
    <section aria-labelledby="companies-heading" className="container-page py-20 sm:py-28">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          id="companies-heading"
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />
        <Link
          href="/companies"
          className="group inline-flex shrink-0 items-center gap-2 font-semibold text-brand-700 transition-colors hover:text-brand-800"
        >
          {t("viewAll")}
          <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      <div className="mt-10">
        <CompanyGrid companies={companies} />
      </div>
      <p className="mt-6 flex max-w-3xl gap-2.5 text-sm leading-relaxed text-muted">
        <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-subtle" />
        {t("disclaimer", { phone: siteConfig.contact.phoneDisplay })}
      </p>
    </section>
  );
}
