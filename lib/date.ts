/** Local calendar date as `YYYY-MM-DD` (matches `<input type="date">`). */
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

/** Inclusive number of calendar days between two `YYYY-MM-DD` dates. */
export function daysBetweenInclusive(start: string, end: string): number | null {
  if (!start || !end) return null;
  const [sy, sm, sd] = start.split("-").map(Number);
  const [ey, em, ed] = end.split("-").map(Number);
  const startUtc = Date.UTC(sy, sm - 1, sd);
  const endUtc = Date.UTC(ey, em - 1, ed);
  if (Number.isNaN(startUtc) || Number.isNaN(endUtc) || endUtc < startUtc) return null;
  return Math.round((endUtc - startUtc) / 86_400_000) + 1;
}
