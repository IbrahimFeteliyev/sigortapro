import { LockKeyhole, Phone } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ApplyHub } from "@/components/forms/ApplyHub";
import { FormMessages } from "@/components/forms/FormMessages";
import { PageHero } from "@/components/sections/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { buttonStyles } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { photos } from "@/data/images";
import { Link } from "@/i18n/navigation";
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
  const [t, common, footer, products] = await Promise.all([
    getTranslations({ locale, namespace: "ApplyPage" }),
    getTranslations({ locale, namespace: "Common" }),
    getTranslations({ locale, namespace: "Footer" }),
    getProductSummaries(locale),
  ]);
  const image = photos.applySigning;

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
            <FormMessages>
              <ApplyHub products={products} />
            </FormMessages>
          </div>

          <aside className="lg:col-span-4">
            <div className="space-y-4 lg:sticky lg:top-24">
              <div className="relative isolate overflow-hidden rounded-[1.75rem] p-7 pt-36 text-white">
                <Image
                  src={image.src}
                  alt={image.alt[locale]}
                  fill
                  sizes="(min-width: 1024px) 380px, 100vw"
                  placeholder="blur"
                  className="-z-10 object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 -z-10 bg-linear-to-t from-brand-950 via-brand-950/75 to-brand-950/10"
                />
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
                    {footer("privacy")}
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
