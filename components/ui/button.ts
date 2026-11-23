import { cn } from "@/lib/utils";

const base =
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-semibold select-none transition-[background-color,box-shadow,color,filter,transform] duration-200 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 motion-reduce:transition-none motion-reduce:active:scale-100 [&_svg]:shrink-0";

const variants = {
  primary:
    "bg-brand-gradient text-white shadow-brand hover:brightness-[1.08] hover:shadow-[0_16px_36px_-12px_rgb(33_73_207/0.65)]",
  secondary: "bg-white text-ink ring-1 ring-inset ring-line-strong hover:bg-surface hover:ring-ink/25",
  ghost: "text-ink hover:bg-surface",
  dark: "bg-ink text-white hover:bg-ink-soft",
  light: "bg-white text-brand-900 shadow-xs hover:bg-brand-50",
  outlineLight: "text-white ring-1 ring-inset ring-white/35 hover:bg-white/10 hover:ring-white/60",
  whatsapp: "bg-whatsapp text-white hover:brightness-110",
} as const;

const sizes = {
  sm: "h-9 rounded-xl px-3.5 text-sm",
  md: "h-11 rounded-xl px-5 text-[0.9375rem]",
  lg: "h-13 rounded-2xl px-6 text-base",
  icon: "size-11 rounded-full",
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(base, variants[variant], sizes[size], className);
}
