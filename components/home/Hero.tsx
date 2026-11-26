import { Phone } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { photos } from "@/data/images";
import { getPathname } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";
import type { InsuranceProductSummary } from "@/types/insurance";
import { QuickSelect } from "./QuickSelect";

export function Hero({ products }: { products: InsuranceProductSummary[] }) {
  const t = useTranslations("Hero");
  const common = useTranslations("Common");
  const locale = useLocale();
  const applyPath = getPathname({ href: "/apply", locale });
  const hero = photos.homeHero;

  return (
    <section className="container-page pt-8 pb-6 sm:pt-12 sm:pb-14 lg:pt-14 lg:pb-20">
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-6">
          <h1 className="text-[2.5rem] leading-[1.04] font-semibold tracking-[-0.04em] text-ink sm:text-6xl lg:text-[4rem]">
            {t.rich("title", {
              brand: (chunks) => <span className="text-brand-600">{chunks}</span>,
            })}
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted sm:text-xl">{t("description")}</p>

          <QuickSelect
            action={applyPath}
            products={products.map(({ slug, name }) => ({ slug, name }))}
            label={t("quickLabel")}
            placeholder={t("quickPlaceholder")}
            submitLabel={t("quickSubmit")}
          />

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.9375rem] text-muted">
            <span>{t("help")}</span>
            <a
              href={siteConfig.contact.phoneHref}
              className="inline-flex items-center gap-1.5 font-semibold text-ink underline-offset-4 hover:underline"
            >
              <Phone aria-hidden className="size-4" />
              {siteConfig.contact.phoneDisplay}
            </a>
            <a
              href={siteConfig.contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-ink underline-offset-4 hover:underline"
            >
              <WhatsAppIcon className="size-4 text-whatsapp" />
              {common("whatsapp")}
              <span className="sr-only">{common("newTab")}</span>
            </a>
          </div>
        </div>

        {/*
          From `sm` up only: on phones the hero stays text-first (fast LCP) and
          the photo-led product cards follow immediately.
        */}
        <div className="hidden sm:block lg:col-span-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-surface">
            <Image
              src={hero.src}
              alt={hero.alt[locale]}
              fill
              fetchPriority="high"
              sizes="(min-width: 1280px) 620px, (min-width: 1024px) 50vw, 100vw"
              quality={90}
              placeholder="blur"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
