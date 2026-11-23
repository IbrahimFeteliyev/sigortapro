import { ClipboardList, MousePointerClick, PhoneCall, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const steps: { key: "choose" | "apply" | "offer"; icon: LucideIcon }[] = [
  { key: "choose", icon: MousePointerClick },
  { key: "apply", icon: ClipboardList },
  { key: "offer", icon: PhoneCall },
];

export function HowItWorks({
  title,
  className,
  tone = "surface",
}: {
  title?: string;
  className?: string;
  tone?: "surface" | "white";
}) {
  const t = useTranslations("HowItWorks");

  return (
    <section
      aria-labelledby="how-it-works-heading"
      className={cn("py-20 sm:py-28", tone === "surface" && "bg-surface", className)}
    >
      <div className="container-page">
        <SectionHeading
          id="how-it-works-heading"
          align="center"
          eyebrow={t("eyebrow")}
          title={title ?? t("title")}
          description={t("description")}
        />
        <div className="relative mt-14">
          <span
            aria-hidden
            className="absolute top-[4.25rem] right-[16%] left-[16%] hidden border-t border-dashed border-brand-200 md:block"
          />
          <RevealGroup as="ol" className="relative grid gap-5 md:grid-cols-3 md:gap-6">
            {steps.map(({ key, icon: Icon }, index) => (
              <RevealItem
                as="li"
                key={key}
                className="relative flex flex-col items-center rounded-[1.75rem] bg-white px-6 pt-8 pb-9 text-center shadow-card ring-1 ring-line"
              >
                <span className="relative grid size-[4.5rem] place-items-center rounded-full bg-brand-50 ring-8 ring-white">
                  <Icon aria-hidden className="size-7 text-brand-700" strokeWidth={1.75} />
                  <span className="absolute -top-1 -right-1 grid size-7 place-items-center rounded-full bg-brand-gradient text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                </span>
                <h3 className="mt-6 text-xl font-semibold text-ink">{t(`${key}.title`)}</h3>
                <p className="mt-2 max-w-xs leading-relaxed text-muted">{t(`${key}.text`)}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
