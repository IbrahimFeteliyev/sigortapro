import { cn } from "@/lib/utils";

/**
 * SığortaPro mark: a soft geometric shield carrying a single-stroke "S".
 * Kept in sync with `lib/brand.ts` (favicons, OG images, structured data).
 */
export function LogoMark({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("size-8", className)}>
      <path
        d="M16 2.6c3.5 1.8 7.2 2.9 10.9 3.2.5 0 .8.4.8.9v7.9c0 7.4-4.5 12.8-11.2 15.1-.3.1-.7.1-1 0C8.8 27.4 4.3 22 4.3 14.6V6.7c0-.5.3-.9.8-.9C8.8 5.5 12.5 4.4 16 2.6Z"
        className={inverted ? "fill-white" : "fill-brand-900"}
      />
      <path
        d="M20.2 10.7c-.9-1.2-2.4-1.9-4.2-1.9-2.5 0-4.2 1.3-4.2 3.2 0 4.4 8.6 2.6 8.6 7.2 0 2-1.9 3.4-4.5 3.4-2 0-3.6-.8-4.5-2.1"
        fill="none"
        className={inverted ? "stroke-brand-900" : "stroke-white"}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Brand lockup. "SığortaPro" is a proper name and is not translated. */
export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark inverted={inverted} />
      <span
        className={cn(
          "text-[1.375rem] leading-none font-semibold tracking-[-0.035em]",
          inverted ? "text-white" : "text-ink",
        )}
      >
        Sığorta<span className={inverted ? "text-brand-300" : "text-brand-600"}>Pro</span>
      </span>
    </span>
  );
}
