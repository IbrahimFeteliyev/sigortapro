"use client";

import { Check, ChevronDown, Globe } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useId, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useDismiss } from "@/lib/hooks/use-dismiss";
import { cn } from "@/lib/utils";

/** Dropdown language switcher; keeps the current page when switching. */
export function LocaleSwitcher({ className }: { className?: string }) {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  const close = useCallback((reason?: "outside" | "escape") => {
    setOpen(false);
    if (reason === "escape") triggerRef.current?.focus();
  }, []);
  useDismiss(open, close, containerRef);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-11 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold text-ink transition-colors hover:bg-surface"
      >
        <Globe aria-hidden className="size-[1.125rem]" strokeWidth={1.75} />
        <span className="uppercase">{locale}</span>
        <span className="sr-only">— {t("change")}</span>
        <ChevronDown
          aria-hidden
          className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <m.div
            id={menuId}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute top-full right-0 z-50 mt-2 w-52 origin-top-right rounded-2xl bg-white p-1.5 shadow-pop ring-1 ring-line"
          >
            <p className="px-3 pt-2 pb-1.5 text-xs font-medium text-muted">{t("label")}</p>
            <ul>
              {routing.locales.map((value) => {
                const active = value === locale;
                return (
                  <li key={value}>
                    <Link
                      href={pathname}
                      locale={value}
                      hrefLang={value}
                      lang={value}
                      aria-current={active ? "true" : undefined}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-3 py-2.5 text-[0.9375rem] transition-colors hover:bg-surface",
                        active ? "font-semibold text-ink" : "text-ink-soft",
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span className="w-6 text-xs font-semibold text-muted uppercase">{value}</span>
                        {t(value)}
                      </span>
                      {active ? <Check aria-hidden className="size-4 text-brand-600" /> : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </m.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/** Compact segmented variant for the mobile menu. */
export function LocaleSegmented({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div role="group" aria-label={t("label")} className="grid grid-cols-3 gap-1 rounded-2xl bg-surface p-1">
      {routing.locales.map((value) => {
        const active = value === locale;
        return (
          <Link
            key={value}
            href={pathname}
            locale={value}
            hrefLang={value}
            lang={value}
            aria-current={active ? "true" : undefined}
            onClick={onNavigate}
            className={cn(
              "rounded-xl py-2.5 text-center text-sm font-semibold transition-colors",
              active ? "bg-white text-ink shadow-xs" : "text-muted hover:text-ink",
            )}
          >
            <span className="sr-only">{t(value)}</span>
            <span aria-hidden className="uppercase">
              {value}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
