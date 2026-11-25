import { Eye, HeartHandshake, Scale, Sparkles, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { CtaSection } from "@/components/sections/CtaSection";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { PageHero } from "@/components/sections/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { LogoMark } from "@/components/ui/Logo";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { photos } from "@/data/images";
import { resolveLocale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";

const PATH = "/about";

const values: { key: "transparency" | "simplicity" | "trust" | "care"; icon: LucideIcon }[] = [
  { key: "transparency", icon: Eye },
  { key: "simplicity", icon: Sparkles },
  { key: "trust", icon: Scale },
  { key: "care", icon: HeartHandshake },
];

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Metadata.about" });
  return buildPageMetadata({ locale, path: PATH, title: t("title"), description: t("description") });
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const locale = await resolveLocale(params);
  const [t, nav] = await Promise.all([
    getTranslations({ locale, namespace: "AboutPage" }),
    getTranslations({ locale, namespace: "Nav" }),
  ]);

  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs locale={locale} items={[{ name: nav("about") }]} currentPath={PATH} />}
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />

      <section aria-labelledby="who-heading" className="container-page pb-20 sm:pb-28">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Not wrapped in <Reveal>: this text is often the LCP element on mobile. */}
          <div className="lg:col-span-6">
            <SectionHeading id="who-heading" title={t("whoTitle")} />
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink-soft">
              {(t.raw("whoText") as string[]).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <Reveal className="lg:col-span-6" delay={0.08}>
            <figure className="relative isolate overflow-hidden rounded-[2rem] p-8 pt-56 text-white sm:p-12 sm:pt-72">
              <Image
                src={photos.aboutTeam.src}
                alt={photos.aboutTeam.alt[locale]}
                fill
                sizes="(min-width: 1024px) 560px, 100vw"
                placeholder="blur"
                className="-z-10 object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 -z-10 bg-linear-to-t from-brand-950 via-brand-950/75 to-brand-950/5"
              />
              <LogoMark className="size-11" />
              <figcaption className="mt-6 text-sm font-semibold tracking-wide text-brand-200">
                {t("missionTitle")}
              </figcaption>
              <blockquote className="mt-3 text-2xl leading-snug font-medium tracking-tight sm:text-[1.75rem]">
                {t("missionText")}
              </blockquote>
            </figure>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="values-heading" className="container-page pb-20 sm:pb-28">
        <SectionHeading id="values-heading" title={t("valuesTitle")} description={t("valuesDescription")} />
        <RevealGroup as="ul" className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ key, icon: Icon }) => (
            <RevealItem
              as="li"
              key={key}
              className="rounded-[1.75rem] bg-white p-6 shadow-card ring-1 ring-line sm:p-7"
            >
              <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-700">
                <Icon aria-hidden className="size-[1.375rem]" strokeWidth={1.75} />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-ink">{t(`${key}.title`)}</h3>
              <p className="mt-2 leading-relaxed text-muted">{t(`${key}.text`)}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <HowItWorks />
      <div className="pt-20 sm:pt-28">
        <CtaSection />
      </div>
    </>
  );
}
