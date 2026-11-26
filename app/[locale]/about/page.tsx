import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { photos } from "@/data/images";
import { resolveLocale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";

const PATH = "/about";

const values = ["transparency", "simplicity", "trust", "care"] as const;

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
        title={t("title")}
        description={t("description")}
      />

      <section aria-labelledby="who-heading" className="container-page pb-12 sm:pb-16">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Not wrapped in <Reveal>: this text is often the LCP element on mobile. */}
          <div className="lg:col-span-6">
            <SectionHeading id="who-heading" title={t("whoTitle")} />
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-ink-soft">
              {(t.raw("whoText") as string[]).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <p className="mt-8 border-l-2 border-brand-900 pl-5 text-xl leading-snug font-medium text-ink">
              {t("missionText")}
            </p>
          </div>
          <Reveal className="lg:col-span-6" delay={0.08}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-surface">
              <Image
                src={photos.aboutTeam.src}
                alt={photos.aboutTeam.alt[locale]}
                fill
                sizes="(min-width: 1024px) 560px, 100vw"
                placeholder="blur"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="values-heading" className="container-page py-12 sm:py-16">
        <SectionHeading id="values-heading" title={t("valuesTitle")} />
        <RevealGroup as="ul" className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((key) => (
            <RevealItem as="li" key={key} className="border-t border-line pt-5">
              <h3 className="text-lg font-semibold text-ink">{t(`${key}.title`)}</h3>
              <p className="mt-1.5 leading-relaxed text-muted">{t(`${key}.text`)}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <CtaSection />
    </>
  );
}
