import { ArrowRight, CircleCheck, ClipboardList, Phone } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { FaqSection } from "@/components/sections/FaqSection";
import { PageHero } from "@/components/sections/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { buttonStyles, type ButtonVariant } from "@/components/ui/button";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Link } from "@/i18n/navigation";
import { resolveLocale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import type { Faq } from "@/types/insurance";

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
    <div className="flex h-full flex-col rounded-[1.75rem] bg-white p-7 shadow-card ring-1 ring-line sm:p-8">
      <span className="grid size-14 place-items-center rounded-2xl bg-brand-50">{icon}</span>
      <h2 className="mt-6 text-xl font-semibold text-ink">{title}</h2>
      <p className="mt-2 leading-relaxed text-muted">{text}</p>
      {value ? <p className="mt-5 text-2xl font-semibold tracking-tight text-ink">{value}</p> : null}
      <div className="mt-auto pt-7">{action}</div>
    </div>
  );
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const locale = await resolveLocale(params);
  const [t, nav, common, faq] = await Promise.all([
    getTranslations({ locale, namespace: "ContactPage" }),
    getTranslations({ locale, namespace: "Nav" }),
    getTranslations({ locale, namespace: "Common" }),
    getTranslations({ locale, namespace: "Faq" }),
  ]);

  const action = (variant: ButtonVariant) => buttonStyles({ variant, size: "lg", className: "w-full" });

  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs locale={locale} items={[{ name: nav("contact") }]} currentPath={PATH} />}
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />

      <section className="container-page pb-20 sm:pb-28">
        <RevealGroup className="grid gap-5 md:grid-cols-3">
          <RevealItem className="h-full">
            <ContactCard
              icon={<Phone aria-hidden className="size-6 text-brand-700" />}
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
              icon={<WhatsAppIcon className="size-6 text-whatsapp" />}
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
              icon={<ClipboardList aria-hidden className="size-6 text-brand-700" />}
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

        <div className="mt-16 rounded-[2rem] bg-surface p-7 sm:p-10 lg:p-12">
          <h2 className="text-2xl font-semibold text-ink sm:text-3xl">{t("helpTitle")}</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {(t.raw("helpItems") as string[]).map((item) => (
              <li key={item} className="flex gap-3 rounded-2xl bg-white p-5 text-ink-soft ring-1 ring-line">
                <CircleCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-brand-600" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="border-t border-line">
        <FaqSection
          eyebrow={faq("eyebrow")}
          title={faq("title")}
          description={faq("description")}
          items={faq.raw("items") as Faq[]}
        />
      </div>
    </>
  );
}
