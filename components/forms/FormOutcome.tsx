"use client";

import { CircleCheck, FlaskConical, Phone, RotateCcw, ShieldCheck } from "lucide-react";
import { m } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { buttonStyles } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { siteConfig, whatsappLink } from "@/lib/site";
import type { SummaryRow } from "./use-application";

const mask = (value: string) =>
  value.length <= 2 ? "••" : `${"•".repeat(Math.min(6, value.length - 2))}${value.slice(-2)}`;

/**
 * Phase 1 shows the "demo" outcome: the form validated but nothing was sent.
 * It never claims the application was received and shows no application
 * number. "submitted" is reserved for the real API.
 */
export function FormOutcome({
  status,
  reference,
  productName,
  rows,
  onRestart,
}: {
  status: "demo" | "submitted";
  reference: string | null;
  productName: string;
  rows: SummaryRow[];
  onRestart: () => void;
}) {
  const t = useTranslations("Forms");
  const common = useTranslations("Common");
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  if (status === "submitted") {
    return (
      <div className="py-6 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-success-50">
          <CircleCheck aria-hidden className="size-8 text-success-600" />
        </span>
        <h3 ref={headingRef} tabIndex={-1} className="mt-6 text-2xl font-semibold text-ink outline-none">
          {t("submittedTitle")}
        </h3>
        <p className="mx-auto mt-3 max-w-md text-muted">{t("submittedText")}</p>
        {reference ? <p className="mt-4 font-semibold text-ink">{t("reference", { reference })}</p> : null}
        <button
          type="button"
          onClick={onRestart}
          className={buttonStyles({ variant: "secondary", className: "mt-8" })}
        >
          <RotateCcw aria-hidden className="size-4" />
          {t("restart")}
        </button>
      </div>
    );
  }

  const shareable = rows.filter((row) => !row.sensitive);
  const message = [
    t("whatsappIntro", { product: productName }),
    "",
    ...shareable.map((row) => `${row.label}: ${row.value}`),
  ].join("\n");

  return (
    <m.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-50">
          <FlaskConical aria-hidden className="size-6 text-brand-700" />
        </span>
        <div>
          <span className="inline-flex rounded-full bg-brand-950 px-2.5 py-1 text-xs font-semibold tracking-wide text-white uppercase">
            {t("demoBadge")}
          </span>
          <h3
            ref={headingRef}
            tabIndex={-1}
            className="mt-2 text-xl font-semibold text-ink outline-none sm:text-2xl"
          >
            {t("demoTitle")}
          </h3>
        </div>
      </div>
      <p role="status" className="mt-4 leading-relaxed text-muted">
        {t("demoText")}
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <a
          href={whatsappLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonStyles({ variant: "whatsapp", size: "lg" })}
        >
          <WhatsAppIcon className="size-5" />
          {t("sendWhatsapp")}
          <span className="sr-only">{common("newTab")}</span>
        </a>
        <a href={siteConfig.contact.phoneHref} className={buttonStyles({ variant: "secondary", size: "lg" })}>
          <Phone aria-hidden className="size-4" />
          {siteConfig.contact.phoneDisplay}
        </a>
      </div>
      {rows.some((row) => row.sensitive) ? (
        <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted">
          <ShieldCheck aria-hidden className="mt-0.5 size-3.5 shrink-0 text-brand-600" />
          {t("sensitiveNote")}
        </p>
      ) : null}

      <dl className="mt-6 divide-y divide-line rounded-2xl bg-surface px-4">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-wrap justify-between gap-x-4 gap-y-0.5 py-2.5 text-sm">
            <dt className="text-muted">{row.label}</dt>
            <dd className="font-medium break-words text-ink">
              {row.sensitive ? mask(row.value) : row.value}
            </dd>
          </div>
        ))}
      </dl>

      <button
        type="button"
        onClick={onRestart}
        className={buttonStyles({ variant: "ghost", className: "mt-4 px-3" })}
      >
        <RotateCcw aria-hidden className="size-4" />
        {t("restart")}
      </button>
    </m.div>
  );
}
