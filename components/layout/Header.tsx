"use client";

import { ArrowRight, ChevronDown, Menu, Phone, X } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { ProductIcon } from "@/components/insurance/ProductIcon";
import { buttonStyles } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Link, usePathname } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";
import { useDismiss } from "@/lib/hooks/use-dismiss";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { InsuranceSlug } from "@/types/insurance";
import { LocaleSegmented, LocaleSwitcher } from "./LocaleSwitcher";

export interface NavProduct {
  slug: InsuranceSlug;
  name: string;
  shortDescription: string;
}

type NavKey = "home" | "insurance" | "prices" | "companies" | "about" | "contact";
/** "home" is only listed in the mobile menu — on desktop the logo leads home. */
const NAV_ITEMS: { key: NavKey; href: AppPathname }[] = [
  { key: "home", href: "/" },
  { key: "insurance", href: "/insurance" },
  { key: "prices", href: "/prices" },
  { key: "companies", href: "/companies" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
];
const DESKTOP_ITEMS = NAV_ITEMS.filter((item) => item.key !== "home");

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function subscribeToScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

export function Header({ products }: { products: NavProduct[] }) {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const scrolled = useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > 8,
    () => false,
  );

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 bg-white/90 backdrop-blur-xl transition-shadow duration-300",
          scrolled || mobileOpen
            ? "shadow-[0_1px_0_var(--color-line),0_8px_24px_-16px_rgb(0_0_0/0.18)]"
            : "shadow-[0_1px_0_var(--color-line)]",
        )}
      >
        <div className="container-page flex h-16 items-center gap-4 lg:h-20">
          <Link href="/" aria-label={t("homeAria")} className="shrink-0 rounded-xl" onClick={closeMobile}>
            <Logo />
          </Link>

          <nav aria-label={t("mainNav")} className="hidden flex-1 justify-center xl:flex">
            <ul className="flex items-center gap-0.5">
              {DESKTOP_ITEMS.map((item) =>
                item.key === "insurance" ? (
                  <li key={item.key}>
                    <ProductsMenu products={products} active={isActivePath(pathname, item.href)} />
                  </li>
                ) : (
                  <li key={item.key}>
                    <DesktopNavLink href={item.href} active={isActivePath(pathname, item.href)}>
                      {t(item.key)}
                    </DesktopNavLink>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <a
              href={siteConfig.contact.phoneHref}
              className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold whitespace-nowrap text-ink transition-colors hover:bg-surface 2xl:inline-flex"
            >
              <Phone aria-hidden className="size-4" />
              {siteConfig.contact.phoneDisplay}
            </a>
            <LocaleSwitcher className="hidden sm:block" />
            <Link href="/apply" className={buttonStyles({ className: "hidden md:inline-flex" })}>
              {t("apply")}
            </Link>
            <button
              ref={toggleRef}
              type="button"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen((value) => !value)}
              className="grid size-11 place-items-center rounded-full text-ink ring-1 ring-line transition-colors hover:bg-surface xl:hidden"
            >
              <span className="sr-only">{mobileOpen ? t("closeMenu") : t("openMenu")}</span>
              {mobileOpen ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Rendered outside <header>: its backdrop-filter would otherwise become
          the containing block for this fixed panel and collapse it to 0px. */}
      <MobileMenu
        open={mobileOpen}
        onClose={closeMobile}
        products={products}
        pathname={pathname}
        toggleRef={toggleRef}
      />
    </>
  );
}

function DesktopNavLink({ href, active, children }: { href: AppPathname; active: boolean; children: ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative inline-flex h-11 items-center rounded-full px-3 text-[0.9375rem] whitespace-nowrap transition-colors hover:bg-surface 2xl:px-4",
        active ? "font-semibold text-ink" : "font-medium text-ink-soft hover:text-ink",
      )}
    >
      {children}
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-ink transition-opacity duration-200 2xl:inset-x-4",
          active ? "opacity-100" : "opacity-0",
        )}
      />
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/*  Desktop products dropdown                                                 */
/* -------------------------------------------------------------------------- */

function ProductsMenu({ products, active }: { products: NavProduct[]; active: boolean }) {
  const t = useTranslations("Nav");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelId = useId();

  const close = useCallback((reason?: "outside" | "escape") => {
    setOpen(false);
    if (reason === "escape") triggerRef.current?.focus();
  }, []);
  useDismiss(open, close, containerRef);

  useEffect(
    () => () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    },
    [],
  );

  const scheduleHover = (next: boolean) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpen(next), next ? 60 : 160);
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      onPointerEnter={(event) => event.pointerType === "mouse" && scheduleHover(true)}
      onPointerLeave={(event) => event.pointerType === "mouse" && scheduleHover(false)}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "relative inline-flex h-11 items-center gap-1 rounded-full px-3 text-[0.9375rem] whitespace-nowrap transition-colors hover:bg-surface 2xl:px-4",
          active ? "font-semibold text-ink" : "font-medium text-ink-soft hover:text-ink",
        )}
      >
        {t("insurance")}
        <ChevronDown
          aria-hidden
          className={cn("size-4 transition-transform duration-200", open && "rotate-180")}
        />
        <span
          aria-hidden
          className={cn(
            "absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-ink transition-opacity 2xl:inset-x-4",
            active ? "opacity-100" : "opacity-0",
          )}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <m.div
            id={panelId}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full left-1/2 z-50 w-[42rem] -translate-x-1/2 pt-3"
          >
            <div className="rounded-3xl bg-white p-3 shadow-pop ring-1 ring-line">
              <p className="px-3 pt-2 pb-2 text-xs font-semibold tracking-wide text-muted">
                {t("productsMenu")}
              </p>
              <ul className="grid grid-cols-2 gap-1">
                {products.map((product) => (
                  <li key={product.slug}>
                    <Link
                      href={`/insurance/${product.slug}`}
                      onClick={() => setOpen(false)}
                      className="group flex gap-3.5 rounded-2xl p-3 transition-colors hover:bg-surface"
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface text-ink transition-colors group-hover:bg-white group-hover:shadow-xs">
                        <ProductIcon slug={product.slug} className="size-5" />
                      </span>
                      <span>
                        <span className="block text-[0.9375rem] font-semibold text-ink">{product.name}</span>
                        <span className="mt-0.5 line-clamp-2 text-sm leading-snug text-muted">
                          {product.shortDescription}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/insurance"
                    onClick={() => setOpen(false)}
                    className="flex h-full items-center justify-between gap-3 rounded-2xl bg-surface p-4 text-[0.9375rem] font-semibold text-ink transition-colors hover:bg-surface-strong"
                  >
                    {t("allProducts")}
                    <ArrowRight aria-hidden className="size-4" />
                  </Link>
                </li>
              </ul>
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Mobile menu                                                               */
/* -------------------------------------------------------------------------- */

function MobileMenu({
  open,
  onClose,
  products,
  pathname,
  toggleRef,
}: {
  open: boolean;
  onClose: () => void;
  products: NavProduct[];
  pathname: string;
  /** The header's open/close button, kept inside the focus loop. */
  toggleRef: RefObject<HTMLButtonElement | null>;
}) {
  const t = useTranslations("Nav");
  const common = useTranslations("Common");
  const panelRef = useRef<HTMLDivElement>(null);

  // Lock page scroll, move focus into the menu and close on Escape.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    const firstLink = panelRef.current?.querySelector<HTMLElement>("a, button");
    firstLink?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      root.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  // Keep keyboard focus inside the open menu.
  const trapFocus = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab" || !panelRef.current) return;
    const focusable = [
      ...panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
      ...(toggleRef.current ? [toggleRef.current] : []),
    ];
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <m.div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={t("mobileNav")}
          onKeyDown={trapFocus}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 top-16 bottom-0 z-[45] overflow-y-auto overscroll-contain bg-white lg:top-20 xl:hidden"
        >
          <nav
            aria-label={t("mobileNav")}
            className="container-page flex min-h-full flex-col gap-8 pt-4 pb-10"
          >
            <ul className="divide-y divide-line">
              {NAV_ITEMS.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <li key={item.key} className="py-1">
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center justify-between rounded-xl py-3.5 text-2xl tracking-tight",
                        active ? "font-semibold text-ink" : "font-medium text-ink-soft",
                      )}
                    >
                      {t(item.key)}
                      {active ? <span aria-hidden className="size-2 rounded-full bg-ink" /> : null}
                    </Link>
                    {item.key === "insurance" ? (
                      <ul className="grid grid-cols-1 gap-1 pb-3 min-[420px]:grid-cols-2">
                        {products.map((product) => (
                          <li key={product.slug}>
                            <Link
                              href={`/insurance/${product.slug}`}
                              onClick={onClose}
                              className="flex items-center gap-3 rounded-2xl p-2.5 transition-colors hover:bg-surface"
                            >
                              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface text-ink">
                                <ProductIcon slug={product.slug} className="size-5" />
                              </span>
                              <span className="text-[0.9375rem] font-medium text-ink">{product.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ul>

            <LocaleSegmented onNavigate={onClose} />

            <div className="mt-auto grid gap-3">
              <Link
                href="/apply"
                onClick={onClose}
                className={buttonStyles({ size: "lg", className: "w-full" })}
              >
                {t("apply")}
              </Link>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={siteConfig.contact.phoneHref}
                  className={buttonStyles({ variant: "secondary", size: "lg" })}
                >
                  <Phone aria-hidden className="size-4" />
                  {common("call")}
                </a>
                <a
                  href={siteConfig.contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonStyles({ variant: "secondary", size: "lg" })}
                >
                  <WhatsAppIcon className="size-5 text-whatsapp" />
                  {common("whatsapp")}
                  <span className="sr-only">{common("newTab")}</span>
                </a>
              </div>
              <p className="text-center text-sm text-muted">
                {t("needHelp")}{" "}
                <a href={siteConfig.contact.phoneHref} className="font-semibold text-ink">
                  {siteConfig.contact.phoneDisplay}
                </a>
              </p>
            </div>
          </nav>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
