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
        title={t("title")}
        description={t("description")}
      />

      <section className="container-page pb-16 sm:pb-24">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <FormMessages>
              <ApplyHub products={products} />
            </FormMessages>
          </div>

          <aside className="lg:col-span-4">
            <div className="space-y-4 lg:sticky lg:top-24">
              <div className="rounded-3xl p-5 ring-1 ring-line">
                <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-surface">
                  <Image
                    src={image.src}
                    alt={image.alt[locale]}
                    fill
                    sizes="(min-width: 1024px) 360px, 100vw"
                    placeholder="blur"
                    className="object-cover"
                  />
                </div>
                <h2 className="mt-5 text-xl font-semibold text-ink">{t("asideTitle")}</h2>
                <p className="mt-1.5 leading-relaxed text-muted">{t("asideText")}</p>
                <div className="mt-5 grid gap-3">
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
                    {common("writeWhatsapp")}
                    <span className="sr-only">{common("newTab")}</span>
                  </a>
                </div>
              </div>
              <div className="flex gap-3 rounded-2xl bg-surface p-5 text-sm leading-relaxed text-muted">
                <LockKeyhole aria-hidden className="mt-0.5 size-4 shrink-0 text-ink" />
                <p>
                  {t("privacyNote")}{" "}
                  <Link
                    href="/privacy-policy"
                    className="font-semibold text-ink underline underline-offset-2"
                  >
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
