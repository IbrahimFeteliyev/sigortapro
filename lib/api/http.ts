import { apiConfig } from "./config";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Minimal JSON client for the future Spring Boot API.
 * Paths are relative to `NEXT_PUBLIC_API_BASE_URL`, e.g. `/api/v1/products`.
 */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!apiConfig.baseUrl) {
    throw new Error("apiFetch called without NEXT_PUBLIC_API_BASE_URL configured");
  }

  const response = await fetch(`${apiConfig.baseUrl}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      body = undefined;
    }
    throw new ApiError(response.status, `Request to ${path} failed with ${response.status}`, body);
  }

  return (await response.json()) as T;
}
