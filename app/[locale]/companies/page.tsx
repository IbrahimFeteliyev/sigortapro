import { CircleCheck, Info, Phone } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { CompanyGrid } from "@/components/insurance/CompanyGrid";
import { CtaSection } from "@/components/sections/CtaSection";
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
        eyebrow={t("eyebrow")}
        title={t("pageTitle")}
        description={t("pageDescription")}
      />

      <section aria-label={t("eyebrow")} className="container-page pb-16">
        <CompanyGrid companies={getCompanies()} />
        <p className="mt-6 flex max-w-3xl gap-2.5 text-sm leading-relaxed text-muted">
          <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-subtle" />
          {t("disclaimer", { phone: siteConfig.contact.phoneDisplay })}
        </p>
      </section>

      <section aria-labelledby="one-contact-heading" className="container-page pb-20 sm:pb-28">
        <div className="grid items-center gap-10 rounded-[2rem] bg-surface p-6 sm:p-10 lg:grid-cols-2 lg:gap-14 lg:p-12">
          <Reveal className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem]">
            <Image
              src={image.src}
              alt={image.alt[locale]}
              fill
              sizes="(min-width: 1024px) 520px, 100vw"
              placeholder="blur"
              className="object-cover"
            />
          </Reveal>
          <div>
            <h2
              id="one-contact-heading"
              className="text-3xl leading-tight font-semibold text-ink sm:text-4xl"
            >
              {t("contactTitle")}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">{t("contactText")}</p>
            <ul className="mt-6 space-y-3">
              {(t.raw("contactPoints") as string[]).map((point) => (
                <li key={point} className="flex gap-3 text-ink-soft">
                  <CircleCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-brand-600" />
                  {point}
                </li>
              ))}
            </ul>
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

      <CtaSection />
    </>
  );
}
