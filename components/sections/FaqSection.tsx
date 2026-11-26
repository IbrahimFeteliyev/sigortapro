import { Accordion, type AccordionItem } from "@/components/ui/Accordion";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fillContact } from "@/lib/site";
import { faqSchema } from "@/lib/structured-data";

export function FaqSection({
  id = "faq",
  title,
  description,
  items,
  withSchema = true,
}: {
  id?: string;
  /** Accepted for compatibility; FAQ sections no longer show an eyebrow. */
  eyebrow?: string;
  title: string;
  description?: string;
  items: AccordionItem[];
  /** Emit FAQPage JSON-LD. Use at most once per page. */
  withSchema?: boolean;
}) {
  const headingId = `${id}-heading`;
  const filled = items.map((item) => ({ question: item.question, answer: fillContact(item.answer) }));

  return (
    <section id={id} aria-labelledby={headingId} className="container-page py-12 sm:py-16">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <SectionHeading id={headingId} title={title} description={description} />
        </div>
        <Reveal className="lg:col-span-8">
          <Accordion items={filled} />
        </Reveal>
      </div>
      {withSchema ? <JsonLd data={faqSchema(filled)} /> : null}
    </section>
  );
}
