import { Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { buttonStyles } from "@/components/ui/button";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { siteConfig } from "@/lib/site";

/** Closing contact band: one line of text, call and WhatsApp. */
export function CtaSection({
  title,
  description,
}: {
  title?: string;
  description?: string;
  /** Kept for compatibility; the band now only offers call and WhatsApp. */
  applyHref?: string;
}) {
  const t = useTranslations("Cta");
  const common = useTranslations("Common");

  return (
    <section className="container-page pt-4 pb-16 sm:pb-20">
      <Reveal>
        <div className="flex flex-col gap-8 rounded-3xl bg-brand-950 px-6 py-10 text-white sm:px-10 sm:py-12 lg:flex-row lg:items-center lg:justify-between lg:px-14">
          <div className="max-w-xl">
            <h2 className="text-[1.75rem] leading-tight font-semibold sm:text-3xl">{title ?? t("title")}</h2>
            <p className="mt-3 text-lg leading-relaxed text-white/70">{description ?? t("description")}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href={siteConfig.contact.phoneHref} className={buttonStyles({ variant: "light", size: "lg" })}>
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
      </Reveal>
    </section>
  );
}
