import { useId } from "react";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  const gradientId = useId();
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={cn("size-9", className)}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3a67e8" />
          <stop offset="1" stopColor="#172b66" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill={`url(#${gradientId})`} />
      <path
        d="M20 9.5 29 12.8v6.6c0 5.6-3.7 10.1-9 11.9-5.3-1.8-9-6.3-9-11.9v-6.6L20 9.5Z"
        fill="none"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="m15.8 20.2 3 3 5.6-6"
        fill="none"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Brand lockup. "SığortaPro" is a proper name and is not translated. */
export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span
        className={cn("text-[1.3rem] font-semibold tracking-[-0.03em]", inverted ? "text-white" : "text-ink")}
      >
        Sığorta<span className={inverted ? "text-brand-300" : "text-brand-600"}>Pro</span>
      </span>
    </span>
  );
}
