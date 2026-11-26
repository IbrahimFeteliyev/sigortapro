import { ArrowRight, ClipboardList, Phone } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { PageHero } from "@/components/sections/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { buttonStyles, type ButtonVariant } from "@/components/ui/button";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Link } from "@/i18n/navigation";
import { resolveLocale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

const PATH = "/contact";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Metadata.contact" });
  return buildPageMetadata({
    locale,
    path: PATH,
    title: t("title"),
    description: t("description", { phone: siteConfig.contact.phoneDisplay }),
  });
}

function ContactCard({
  icon,
  title,
  text,
  value,
  action,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  value?: string;
  action: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col rounded-3xl p-7 ring-1 ring-line sm:p-8">
      <span className="grid size-12 place-items-center rounded-full bg-surface">{icon}</span>
      <h2 className="mt-6 text-xl font-semibold text-ink">{title}</h2>
      <p className="mt-1.5 leading-relaxed text-muted">{text}</p>
      {value ? <p className="mt-5 text-2xl font-semibold tracking-tight text-ink">{value}</p> : null}
      <div className="mt-auto pt-7">{action}</div>
    </div>
  );
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const locale = await resolveLocale(params);
  const [t, nav, common] = await Promise.all([
    getTranslations({ locale, namespace: "ContactPage" }),
    getTranslations({ locale, namespace: "Nav" }),
    getTranslations({ locale, namespace: "Common" }),
  ]);

  const action = (variant: ButtonVariant) => buttonStyles({ variant, size: "lg", className: "w-full" });

  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs locale={locale} items={[{ name: nav("contact") }]} currentPath={PATH} />}
        title={t("title")}
        description={t("description")}
      />

      <section className="container-page pb-16 sm:pb-24">
        <RevealGroup className="grid gap-5 md:grid-cols-3">
          <RevealItem className="h-full">
            <ContactCard
              icon={<Phone aria-hidden className="size-5 text-ink" />}
              title={t("phoneTitle")}
              text={t("phoneText")}
              value={siteConfig.contact.phoneDisplay}
              action={
                <a href={siteConfig.contact.phoneHref} className={action("primary")}>
                  <Phone aria-hidden className="size-4" />
                  {common("call")}
                </a>
              }
            />
          </RevealItem>
          <RevealItem className="h-full">
            <ContactCard
              icon={<WhatsAppIcon className="size-5 text-whatsapp" />}
              title={t("whatsappTitle")}
              text={t("whatsappText")}
              value={siteConfig.contact.phoneInternational}
              action={
                <a
                  href={siteConfig.contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={action("whatsapp")}
                >
                  <WhatsAppIcon className="size-5" />
                  {t("whatsappAction")}
                  <span className="sr-only">{common("newTab")}</span>
                </a>
              }
            />
          </RevealItem>
          <RevealItem className="h-full">
            <ContactCard
              icon={<ClipboardList aria-hidden className="size-5 text-ink" />}
              title={t("applyTitle")}
              text={t("applyText")}
              action={
                <Link href="/apply" className={action("secondary")}>
                  {t("applyAction")}
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
              }
            />
          </RevealItem>
        </RevealGroup>
      </section>
    </>
  );
}
