import type { Locale } from "@/i18n/routing";
import type { InsuranceSlug } from "@/types/insurance";
import { isDemoMode } from "./config";
import { apiFetch } from "./http";

/**
 * Body for `POST /api/v1/applications` on the future Spring Boot API.
 * `form` identifies the form variant (e.g. "property-standard").
 */
export interface ApplicationPayload {
  product: InsuranceSlug;
  form: string;
  locale: Locale;
  data: Record<string, unknown>;
}

export type SubmitResult = { status: "demo" } | { status: "submitted"; reference: string | null };

/**
 * Phase 1: there is no backend, so nothing is sent anywhere — not even
 * sensitive fields (FİN, document numbers) or uploaded files, which never
 * leave the browser. The promise resolves with `{ status: "demo" }` and the
 * UI shows a clearly labelled demonstration result. Once
 * `NEXT_PUBLIC_API_BASE_URL` is configured, the same call posts to the API.
 */
export async function submitApplication(payload: ApplicationPayload): Promise<SubmitResult> {
  if (isDemoMode) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { status: "demo" };
  }

  const response = await apiFetch<{ reference?: string }>("/api/v1/applications", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return { status: "submitted", reference: response.reference ?? null };
}
