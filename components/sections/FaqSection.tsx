import { Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Accordion, type AccordionItem } from "@/components/ui/Accordion";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { siteConfig } from "@/lib/site";
import { faqSchema } from "@/lib/structured-data";

export function FaqSection({
  id = "faq",
  eyebrow,
  title,
  description,
  items,
  withSchema = true,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  items: AccordionItem[];
  /** Emit FAQPage JSON-LD. Use at most once per page. */
  withSchema?: boolean;
}) {
  const common = useTranslations("Common");
  const headingId = `${id}-heading`;

  return (
    <section id={id} aria-labelledby={headingId} className="container-page py-20 sm:py-28">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-4">
          <SectionHeading id={headingId} eyebrow={eyebrow} title={title} description={description} />
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <a
              href={siteConfig.contact.phoneHref}
              className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2.5 font-semibold text-ink transition-colors hover:bg-surface-strong"
            >
              <Phone aria-hidden className="size-4 text-brand-600" />
              {siteConfig.contact.phoneDisplay}
            </a>
            <a
              href={siteConfig.contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2.5 font-semibold text-ink transition-colors hover:bg-surface-strong"
            >
              <WhatsAppIcon className="size-4 text-whatsapp" />
              {common("whatsapp")}
              <span className="sr-only">{common("newTab")}</span>
            </a>
          </div>
        </Reveal>
        <Reveal className="lg:col-span-8" delay={0.08}>
          <Accordion items={items} />
        </Reveal>
      </div>
      {withSchema ? <JsonLd data={faqSchema(items)} /> : null}
    </section>
  );
}
