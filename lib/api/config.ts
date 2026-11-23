/**
 * API configuration.
 *
 * Phase 1 runs entirely on mock data. Setting `NEXT_PUBLIC_API_BASE_URL`
 * (e.g. https://api.example.az) switches the data layer to the Spring Boot
 * REST API without touching any component.
 */
export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") || null,
} as const;

export const isApiEnabled = apiConfig.baseUrl !== null;

/** True while there is no backend: forms validate but never submit. */
export const isDemoMode = !isApiEnabled;
