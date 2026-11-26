import { Phone } from "lucide-react";
import { cacheLife } from "next/cache";
import { getTranslations } from "next-intl/server";
import { Logo } from "@/components/ui/Logo";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Link } from "@/i18n/navigation";
import type { AppPathname, Locale } from "@/i18n/routing";
import { siteConfig } from "@/lib/site";
import type { InsuranceSlug } from "@/types/insurance";

async function getCurrentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export async function Footer({
  locale,
  products,
}: {
  locale: Locale;
  products: { slug: InsuranceSlug; name: string }[];
}) {
  const [t, nav, common, year] = await Promise.all([
    getTranslations({ locale, namespace: "Footer" }),
    getTranslations({ locale, namespace: "Nav" }),
    getTranslations({ locale, namespace: "Common" }),
    getCurrentYear(),
  ]);

  const navigation: { href: AppPathname; label: string }[] = [
    { href: "/", label: nav("home") },
    { href: "/insurance", label: nav("insurance") },
    { href: "/companies", label: nav("companies") },
    { href: "/prices", label: nav("prices") },
    { href: "/about", label: nav("about") },
    { href: "/contact", label: nav("contact") },
    { href: "/apply", label: nav("apply") },
  ];

  const linkClass = "text-[0.9375rem] text-muted transition-colors hover:text-ink";

  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        <div className="sm:col-span-2 lg:col-span-4">
          <Link href="/" aria-label={nav("homeAria")} className="inline-block rounded-xl">
            <Logo />
          </Link>
          <p className="mt-5 max-w-sm leading-relaxed text-muted">{t("description")}</p>
        </div>

        <nav aria-labelledby="footer-nav" className="lg:col-span-2">
          <h2 id="footer-nav" className="text-sm font-semibold tracking-normal text-ink">
            {t("navigation")}
          </h2>
          <ul className="mt-4 space-y-3">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-insurance" className="lg:col-span-3">
          <h2 id="footer-insurance" className="text-sm font-semibold tracking-normal text-ink">
            {t("insurance")}
          </h2>
          <ul className="mt-4 space-y-3">
            {products.map((product) => (
              <li key={product.slug}>
                <Link href={`/insurance/${product.slug}`} className={linkClass}>
                  {product.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <h2 className="text-sm font-semibold tracking-normal text-ink">{t("contact")}</h2>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">{t("contactText")}</p>
          <ul className="mt-5 space-y-3">
            <li>
              <a
                href={siteConfig.contact.phoneHref}
                className="inline-flex items-center gap-3 font-semibold text-ink transition-colors hover:text-ink-soft"
              >
                <span className="grid size-9 place-items-center rounded-full bg-white shadow-xs ring-1 ring-line">
                  <Phone aria-hidden className="size-4 text-ink" />
                </span>
                {siteConfig.contact.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={siteConfig.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 font-semibold text-ink transition-colors hover:text-ink-soft"
              >
                <span className="grid size-9 place-items-center rounded-full bg-white shadow-xs ring-1 ring-line">
                  <WhatsAppIcon className="size-4 text-whatsapp" />
                </span>
                {common("whatsapp")}
                <span className="sr-only">{common("newTab")}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-4 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>{t("copyright", { year })}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link href="/privacy-policy" className="transition-colors hover:text-ink">
                {t("privacy")}
              </Link>
            </li>
            <li>
              <Link href="/terms" className="transition-colors hover:text-ink">
                {t("terms")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
