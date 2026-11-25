import {
  Clock3,
  Layers3,
  MessagesSquare,
  Phone,
  Smartphone,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { photos } from "@/data/images";
import { siteConfig } from "@/lib/site";

type BenefitKey = "easyOnline" | "timeSaving" | "personal" | "options" | "communication" | "simple";

const benefits: { key: BenefitKey; icon: LucideIcon }[] = [
  { key: "easyOnline", icon: Smartphone },
  { key: "timeSaving", icon: Clock3 },
  { key: "personal", icon: UserRound },
  { key: "options", icon: Layers3 },
  { key: "communication", icon: MessagesSquare },
  { key: "simple", icon: Sparkles },
];

export function Benefits() {
  const t = useTranslations("Benefits");
  const nav = useTranslations("Nav");
  const common = useTranslations("Common");
  const locale = useLocale();

  return (
    <section aria-labelledby="benefits-heading" className="container-page py-20 sm:py-28">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          <SectionHeading
            id="benefits-heading"
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("description")}
          />
          <div className="relative isolate mt-10 overflow-hidden rounded-[1.75rem] p-7 pt-40 text-white sm:pt-48">
            <Image
              src={photos.travelSupport.src}
              alt={photos.travelSupport.alt[locale]}
              fill
              sizes="(min-width: 1024px) 460px, 100vw"
              placeholder="blur"
              className="-z-10 object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-linear-to-t from-brand-950 via-brand-950/70 to-transparent"
            />
            <p className="text-lg font-semibold">{nav("needHelp")}</p>
            <a
              href={siteConfig.contact.phoneHref}
              className="mt-4 inline-flex items-center gap-3 text-2xl font-semibold tracking-tight"
            >
              <Phone aria-hidden className="size-5 text-brand-300" />
              {siteConfig.contact.phoneDisplay}
            </a>
            <div>
              <a
                href={siteConfig.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/20 transition-colors hover:bg-white/15"
              >
                <WhatsAppIcon className="size-4" />
                {common("writeWhatsapp")}
                <span className="sr-only">{common("newTab")}</span>
              </a>
            </div>
          </div>
        </div>

        <RevealGroup as="ul" className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
          {benefits.map(({ key, icon: Icon }) => (
            <RevealItem
              as="li"
              key={key}
              className="rounded-[1.75rem] bg-white p-6 shadow-card ring-1 ring-line transition-shadow duration-300 hover:shadow-card-hover sm:p-7"
            >
              <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-700">
                <Icon aria-hidden className="size-[1.375rem]" strokeWidth={1.75} />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-ink">{t(`${key}.title`)}</h3>
              <p className="mt-2 leading-relaxed text-muted">{t(`${key}.text`)}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
