import { ArrowRight, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ProductIcon } from "@/components/insurance/ProductIcon";
import { buttonStyles } from "@/components/ui/button";
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
    <section className="relative isolate z-10 overflow-x-clip">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(40rem_32rem_at_85%_0%,rgb(220_231_254/0.85),transparent_70%),radial-gradient(28rem_24rem_at_0%_45%,rgb(238_244_255/0.9),transparent_70%)]"
      >
        <div className="absolute inset-0 bg-dot-grid [mask-image:radial-gradient(55%_55%_at_30%_20%,black,transparent)]" />
      </div>

      <div className="container-page grid items-center gap-12 pt-10 pb-16 sm:pt-14 lg:grid-cols-12 lg:gap-10 lg:pt-16 lg:pb-20">
        <div className="lg:col-span-6">
          <p className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-sm font-medium text-ink-soft shadow-xs ring-1 ring-line">
            <ShieldCheck aria-hidden className="size-4 text-brand-600" />
            {t("badge")}
          </p>

          <h1 className="mt-6 text-[2.6rem] leading-[1.04] font-semibold tracking-[-0.035em] text-ink sm:text-6xl lg:text-[4.1rem]">
            {t.rich("title", {
              brand: (chunks) => <span className="text-gradient-brand">{chunks}</span>,
            })}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">{t("description")}</p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#products" className={buttonStyles({ size: "lg" })}>
              {t("ctaPrimary")}
              <ArrowRight aria-hidden className="size-4" />
            </a>
            <a
              href={siteConfig.contact.phoneHref}
              className={buttonStyles({ variant: "secondary", size: "lg" })}
            >
              {siteConfig.contact.phoneDisplay}
            </a>
          </div>

          <QuickSelect
            action={applyPath}
            products={products.map(({ slug, name }) => ({ slug, name }))}
            label={t("quickLabel")}
            placeholder={t("quickPlaceholder")}
            submitLabel={t("quickSubmit")}
          />
        </div>

        {/*
          Photo composition — from `sm` up. On phones the hero stays text-first
          (fast LCP) and the photo-led product cards follow immediately. Lazy +
          display:none means phones never download this image.
        */}
        <div className="relative hidden sm:block lg:col-span-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2.25rem] bg-surface shadow-[0_40px_80px_-32px_rgb(13_26_66/0.45)] lg:aspect-[5/4.4]">
            <Image
              src={hero.src}
              alt={hero.alt[locale]}
              fill
              fetchPriority="high"
              sizes="(min-width: 1024px) 600px, 100vw"
              placeholder="blur"
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-linear-to-t from-brand-950/55 via-transparent to-transparent"
            />
            <a
              href={siteConfig.contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-white/95 py-2 pr-4 pl-2 text-sm font-semibold text-ink shadow-float transition-colors hover:bg-white"
            >
              <span className="grid size-7 place-items-center rounded-full bg-whatsapp text-white">
                <WhatsAppIcon className="size-4" />
              </span>
              {t("visualWhatsapp")}
              <span className="sr-only">{common("newTab")}</span>
            </a>
          </div>

          <div
            aria-hidden
            className="absolute -top-4 right-4 flex items-center gap-2 rounded-full bg-white py-2 pr-4 pl-2 text-sm font-semibold text-ink shadow-float sm:right-8 lg:top-10 lg:right-auto lg:-left-6"
          >
            <span className="grid size-7 place-items-center rounded-full bg-brand-50">
              <ShieldCheck className="size-4 text-brand-600" />
            </span>
            {t("visualProtected")}
          </div>

          <div
            aria-hidden
            className="absolute -right-2 -bottom-6 hidden w-60 rounded-2xl bg-white p-4 shadow-pop ring-1 ring-line sm:block lg:-right-6"
          >
            <p className="text-sm font-semibold text-ink">{t("visualApplication")}</p>
            <p className="mt-0.5 text-xs text-muted">{t("visualApplicationText")}</p>
            <div className="mt-3 flex -space-x-2">
              {products.map((product) => (
                <span
                  key={product.slug}
                  className="grid size-9 place-items-center rounded-full bg-brand-50 text-brand-700 ring-2 ring-white"
                >
                  <ProductIcon slug={product.slug} className="size-4" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
