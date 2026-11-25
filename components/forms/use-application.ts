"use client";

import { useLocale } from "next-intl";
import { useCallback, useState } from "react";
import { submitApplication } from "@/lib/api/applications";
import type { InsuranceSlug } from "@/types/insurance";

export interface SummaryRow {
  label: string;
  value: string;
  /** Personal identifiers: masked on screen, never put in the WhatsApp text. */
  sensitive?: boolean;
}

export type ApplicationStatus = "idle" | "submitting" | "error" | "demo" | "submitted";

/**
 * Shared submit flow for every product form. Data stays in memory only:
 * nothing is written to localStorage, sessionStorage or analytics.
 */
export function useApplication(product: InsuranceSlug, form: string) {
  const locale = useLocale();
  const [status, setStatus] = useState<ApplicationStatus>("idle");
  const [summary, setSummary] = useState<SummaryRow[]>([]);
  const [reference, setReference] = useState<string | null>(null);
  const [lastData, setLastData] = useState<Record<string, unknown> | null>(null);

  const submit = useCallback(
    async (data: Record<string, unknown>, rows: SummaryRow[]) => {
      setStatus("submitting");
      setLastData(data);
      setSummary(rows);
      try {
        const result = await submitApplication({ product, form, locale, data });
        setReference(result.status === "submitted" ? result.reference : null);
        setStatus(result.status);
      } catch {
        setStatus("error");
      }
    },
    [product, form, locale],
  );

  const retry = useCallback(() => {
    if (lastData) void submit(lastData, summary);
  }, [lastData, summary, submit]);

  const reset = useCallback(() => {
    setStatus("idle");
    setSummary([]);
    setReference(null);
    setLastData(null);
  }, []);

  return { status, summary, reference, submit, retry, reset };
}
