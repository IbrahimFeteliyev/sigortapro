import { ArrowRight, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { buttonStyles } from "@/components/ui/button";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";

export function CtaSection({
  title,
  description,
  applyHref = "/apply",
}: {
  title?: string;
  description?: string;
  /** Where the primary button leads, e.g. a product form anchor. */
  applyHref?: string;
}) {
  const t = useTranslations("Cta");
  const common = useTranslations("Common");

  return (
    <section className="container-page pb-20 sm:pb-28">
      <Reveal>
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-hero-panel px-6 py-14 text-white sm:px-12 sm:py-16 lg:px-16">
          <svg
            aria-hidden
            viewBox="0 0 600 600"
            fill="none"
            className="pointer-events-none absolute -top-40 -right-40 -z-10 size-[36rem] text-white/10"
          >
            <circle cx="300" cy="300" r="120" stroke="currentColor" />
            <circle cx="300" cy="300" r="190" stroke="currentColor" />
            <circle cx="300" cy="300" r="260" stroke="currentColor" />
          </svg>
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 className="text-3xl leading-tight font-semibold sm:text-4xl">{title ?? t("title")}</h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-brand-100">
                {description ?? t("description")}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:col-span-5 lg:justify-end">
              <Link href={applyHref} className={buttonStyles({ variant: "light", size: "lg" })}>
                {common("applyNow")}
                <ArrowRight aria-hidden className="size-4" />
              </Link>
              <a
                href={siteConfig.contact.phoneHref}
                className={buttonStyles({ variant: "outlineLight", size: "lg" })}
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
                {common("whatsapp")}
                <span className="sr-only">{common("newTab")}</span>
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
