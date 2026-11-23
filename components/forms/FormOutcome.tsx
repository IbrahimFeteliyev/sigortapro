"use client";

import { CircleCheck, FlaskConical, Phone, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Ref } from "react";
import { buttonStyles } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { siteConfig, whatsappLink } from "@/lib/site";
import { summaryToMessage, type SummarySection } from "./form-utils";

/**
 * Phase 1 shows the "demo" outcome: the form validated successfully but
 * nothing was sent. It never claims the application was received and never
 * shows an application number. "submitted" is reserved for the real API.
 */
export function FormOutcome({
  status,
  reference,
  sections,
  onRestart,
  headingRef,
}: {
  status: "demo" | "submitted";
  reference: string | null;
  sections: SummarySection[];
  onRestart: () => void;
  headingRef: Ref<HTMLHeadingElement>;
}) {
  const t = useTranslations("ApplyForm");
  const common = useTranslations("Common");

  if (status === "submitted") {
    return (
      <div className="py-6 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-success-50">
          <CircleCheck aria-hidden className="size-8 text-success-600" />
        </span>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="mt-6 text-2xl font-semibold text-ink outline-none sm:text-3xl"
        >
          {t("submitted.title")}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted">{t("submitted.text")}</p>
        {reference ? (
          <p className="mt-4 font-semibold text-ink">{t("submitted.reference", { reference })}</p>
        ) : null}
        <button
          type="button"
          onClick={onRestart}
          className={buttonStyles({ variant: "secondary", className: "mt-8" })}
        >
          <RotateCcw aria-hidden className="size-4" />
          {t("submitted.restart")}
        </button>
      </div>
    );
  }

  const message = summaryToMessage(t("whatsappIntro"), sections);

  return (
    <div>
      <div className="flex flex-col items-start gap-5 sm:flex-row">
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-brand-50">
          <FlaskConical aria-hidden className="size-7 text-brand-700" />
        </span>
        <div>
          <span className="inline-flex items-center rounded-full bg-brand-950 px-2.5 py-1 text-xs font-semibold tracking-wide text-white uppercase">
            {t("demoSuccess.badge")}
          </span>
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="mt-3 text-2xl font-semibold text-ink outline-none sm:text-3xl"
          >
            {t("demoSuccess.title")}
          </h2>
          <p role="status" className="mt-3 max-w-xl leading-relaxed text-muted">
            {t("demoSuccess.text")}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <a
          href={whatsappLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonStyles({ variant: "whatsapp", size: "lg" })}
        >
          <WhatsAppIcon className="size-5" />
          {t("demoSuccess.whatsapp")}
          <span className="sr-only">{common("newTab")}</span>
        </a>
        <a href={siteConfig.contact.phoneHref} className={buttonStyles({ variant: "secondary", size: "lg" })}>
          <Phone aria-hidden className="size-4" />
          {siteConfig.contact.phoneDisplay}
        </a>
        <button type="button" onClick={onRestart} className={buttonStyles({ variant: "ghost", size: "lg" })}>
          <RotateCcw aria-hidden className="size-4" />
          {t("demoSuccess.restart")}
        </button>
      </div>

      <div className="mt-10 space-y-4">
        {sections.map((section) => (
          <section key={section.key} aria-label={section.title} className="rounded-2xl bg-surface px-5 py-4">
            <h3 className="text-sm font-semibold text-ink">{section.title}</h3>
            <dl className="mt-2 space-y-1.5 text-sm">
              {section.rows.map((row) => (
                <div key={row.label} className="flex flex-wrap gap-x-2">
                  <dt className="text-muted">{row.label}:</dt>
                  <dd className="font-medium break-words text-ink">{row.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </div>
  );
}
