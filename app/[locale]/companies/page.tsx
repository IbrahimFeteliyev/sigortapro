import { Phone } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { CompanyGrid } from "@/components/insurance/CompanyGrid";
import { PageHero } from "@/components/sections/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { buttonStyles } from "@/components/ui/button";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { photos } from "@/data/images";
import { getCompanies } from "@/lib/api/content";
import { resolveLocale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

const PATH = "/companies";

export async function generateMetadata({ params }: PageProps<"/[locale]/companies">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Metadata.companies" });
  return buildPageMetadata({ locale, path: PATH, title: t("title"), description: t("description") });
}

export default async function CompaniesPage({ params }: PageProps<"/[locale]/companies">) {
  const locale = await resolveLocale(params);
  const [t, nav, common] = await Promise.all([
    getTranslations({ locale, namespace: "Companies" }),
    getTranslations({ locale, namespace: "Nav" }),
    getTranslations({ locale, namespace: "Common" }),
  ]);
  const image = photos.companiesHandshake;

  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs locale={locale} items={[{ name: nav("companies") }]} currentPath={PATH} />}
        title={t("pageTitle")}
        description={t("pageDescription")}
      />

      <section aria-label={t("pageTitle")} className="container-page pb-12 sm:pb-16">
        <CompanyGrid companies={getCompanies()} />
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted">{t("disclaimer")}</p>
      </section>

      <section aria-labelledby="one-contact-heading" className="container-page pb-16 sm:pb-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal className="relative aspect-[3/2] overflow-hidden rounded-3xl bg-surface">
            <Image
              src={image.src}
              alt={image.alt[locale]}
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              placeholder="blur"
              className="object-cover"
            />
          </Reveal>
          <div>
            <h2
              id="one-contact-heading"
              className="text-[1.75rem] leading-tight font-semibold text-ink sm:text-[2.125rem]"
            >
              {t("contactTitle")}
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-muted">{t("contactText")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={siteConfig.contact.phoneHref} className={buttonStyles({ size: "lg" })}>
                <Phone aria-hidden className="size-4" />
                {siteConfig.contact.phoneDisplay}
              </a>
              <a
                href={siteConfig.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonStyles({ variant: "secondary", size: "lg" })}
              >
                <WhatsAppIcon className="size-5 text-whatsapp" />
                {common("whatsapp")}
                <span className="sr-only">{common("newTab")}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
