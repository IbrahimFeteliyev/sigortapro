import type { Locale } from "@/i18n/routing";
import { daysBetweenInclusive } from "@/lib/date";
import type { ApplicationData } from "@/lib/validation/application";
import { isDemoMode } from "./config";
import { apiFetch } from "./http";

/** Body for `POST /api/v1/applications` on the future Spring Boot API. */
export type ApplicationPayload = ApplicationData & {
  locale: Locale;
  tariffId: string | null;
  /** Travel only: inclusive trip length in days. */
  durationDays?: number | null;
};

export type SubmitResult = { status: "demo" } | { status: "submitted"; reference: string | null };

export function buildApplicationPayload(
  data: ApplicationData,
  locale: Locale,
  tariffId: string | null,
): ApplicationPayload {
  const payload: ApplicationPayload = { ...data, locale, tariffId };
  if (data.insuranceType === "travel") {
    payload.durationDays = daysBetweenInclusive(data.startDate, data.endDate);
  }
  return payload;
}

/**
 * Phase 1: no backend exists, so nothing is sent anywhere. The promise
 * resolves with `{ status: "demo" }` and the UI shows a clearly labelled
 * demonstration state. Once `NEXT_PUBLIC_API_BASE_URL` is configured, the
 * same call posts to the REST API.
 */
export async function submitApplication(payload: ApplicationPayload): Promise<SubmitResult> {
  if (isDemoMode) {
    await new Promise((resolve) => setTimeout(resolve, 900));
    return { status: "demo" };
  }

  const response = await apiFetch<{ reference?: string }>("/api/v1/applications", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return { status: "submitted", reference: response.reference ?? null };
}
