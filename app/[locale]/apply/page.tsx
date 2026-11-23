import { FlaskConical, LockKeyhole, Phone } from "lucide-react";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { ApplicationForm } from "@/components/forms/ApplicationForm";
import { PageHero } from "@/components/sections/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { buttonStyles } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Link } from "@/i18n/navigation";
import { isDemoMode } from "@/lib/api/config";
import { getProductSummaries } from "@/lib/api/products";
import { resolveLocale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

const PATH = "/apply";

export async function generateMetadata({ params }: PageProps<"/[locale]/apply">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Metadata.apply" });
  return buildPageMetadata({ locale, path: PATH, title: t("title"), description: t("description") });
}

export default async function ApplyPage({ params }: PageProps<"/[locale]/apply">) {
  const locale = await resolveLocale(params);
  const [t, form, common, legal, messages, products] = await Promise.all([
    getTranslations({ locale, namespace: "ApplyPage" }),
    getTranslations({ locale, namespace: "ApplyForm" }),
    getTranslations({ locale, namespace: "Common" }),
    getTranslations({ locale, namespace: "Footer" }),
    getMessages(),
    getProductSummaries(locale),
  ]);

  const formProducts = products.map(({ slug, name, shortDescription }) => ({ slug, name, shortDescription }));

  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs locale={locale} items={[{ name: t("eyebrow") }]} currentPath={PATH} />}
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />

      <section className="container-page pb-24">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            {isDemoMode ? (
              <div
                role="note"
                className="mb-6 flex gap-4 rounded-[1.5rem] bg-brand-50 p-5 ring-1 ring-brand-100 sm:p-6"
              >
                <FlaskConical aria-hidden className="mt-0.5 size-5 shrink-0 text-brand-700" />
                <div>
                  <p className="font-semibold text-brand-950">{form("demoBanner.title")}</p>
                  <p className="mt-1 text-sm leading-relaxed text-brand-900">{form("demoBanner.text")}</p>
                </div>
              </div>
            ) : null}

            <NextIntlClientProvider
              messages={{
                ApplyForm: messages.ApplyForm,
                Validation: messages.Validation,
                Common: messages.Common,
              }}
            >
              <ApplicationForm products={formProducts} />
            </NextIntlClientProvider>
          </div>

          <aside className="lg:col-span-4">
            <div className="space-y-4 lg:sticky lg:top-28">
              <div className="rounded-[1.75rem] bg-hero-panel p-7 text-white">
                <h2 className="text-xl font-semibold">{t("asideTitle")}</h2>
                <p className="mt-2 leading-relaxed text-brand-100">{t("asideText")}</p>
                <div className="mt-6 grid gap-3">
                  <a
                    href={siteConfig.contact.phoneHref}
                    className={buttonStyles({ variant: "light", size: "lg" })}
                  >
                    <Phone aria-hidden className="size-4" />
                    {siteConfig.contact.phoneDisplay}
                  </a>
                  <a
                    href={siteConfig.contact.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonStyles({ variant: "outlineLight", size: "lg" })}
                  >
                    <WhatsAppIcon className="size-5" />
                    {common("writeWhatsapp")}
                    <span className="sr-only">{common("newTab")}</span>
                  </a>
                </div>
              </div>
              <div className="flex gap-3 rounded-[1.5rem] bg-surface p-5 text-sm leading-relaxed text-muted">
                <LockKeyhole aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-600" />
                <p>
                  {t("privacyNote")}{" "}
                  <Link href="/privacy-policy" className="font-semibold text-brand-700 hover:text-brand-800">
                    {legal("privacy")}
                  </Link>
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
