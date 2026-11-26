import { useTranslations } from "next-intl";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const steps = ["choose", "apply", "offer"] as const;

/** Three numbered steps in one quiet row. */
export function HowItWorks({ title, className }: { title?: string; className?: string }) {
  const t = useTranslations("HowItWorks");

  return (
    <section
      aria-labelledby="how-it-works-heading"
      className={cn("container-page py-16 sm:py-20", className)}
    >
      <div className="rounded-3xl bg-surface px-6 py-10 sm:px-10 sm:py-12 lg:px-14">
        <SectionHeading id="how-it-works-heading" title={title ?? t("title")} />
        <RevealGroup as="ol" className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
          {steps.map((key, index) => (
            <RevealItem as="li" key={key} className="flex gap-4">
              <span
                aria-hidden
                className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-[0.9375rem] font-semibold text-ink ring-1 ring-line-strong"
              >
                {index + 1}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-ink">{t(`${key}.title`)}</h3>
                <p className="mt-1 leading-relaxed text-muted">{t(`${key}.text`)}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
