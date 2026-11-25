import type { Metadata, Viewport } from "next";
import { Onest } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { JsonLd } from "@/components/ui/JsonLd";
import { routing } from "@/i18n/routing";
import { getProductSummaries } from "@/lib/api/products";
import { resolveLocale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";
import { organizationSchema, websiteSchema } from "@/lib/structured-data";
import "../globals.css";

const onest = Onest({
  // The subsets option only controls preloading: Latin + Latin-ext (Azerbaijani ə, ğ, ı…)
  // are preloaded for the default locales; Cyrillic still loads on demand via
  // unicode-range on Russian pages.
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-onest",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: t("home.title"), template: `%s | ${siteConfig.name}` },
    description: t("home.description"),
    applicationName: siteConfig.name,
    formatDetection: { telephone: false, email: false, address: false },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const locale = await resolveLocale(params);

  const [messages, products, nav, meta] = await Promise.all([
    getMessages(),
    getProductSummaries(locale),
    getTranslations({ locale, namespace: "Nav" }),
    getTranslations({ locale, namespace: "Metadata" }),
  ]);

  // Only ship the namespaces that layout-level client components need.
  const clientMessages = {
    Nav: messages.Nav,
    LocaleSwitcher: messages.LocaleSwitcher,
    Common: messages.Common,
  };

  const navProducts = products.map(({ slug, name, shortDescription }) => ({ slug, name, shortDescription }));

  return (
    <html lang={locale} className={onest.variable}>
      <body className="flex min-h-dvh flex-col bg-white text-ink antialiased">
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-xl focus:bg-white focus:px-4 focus:py-3 focus:font-semibold focus:shadow-pop"
        >
          {nav("skipToContent")}
        </a>
        <NextIntlClientProvider messages={clientMessages}>
          <MotionProvider>
            <Header products={navProducts} />
            <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
              {children}
            </main>
            <Footer locale={locale} products={navProducts} />
            <WhatsAppFab />
          </MotionProvider>
        </NextIntlClientProvider>
        <JsonLd
          data={[
            organizationSchema(meta("home.description")),
            websiteSchema(locale, meta("home.description")),
          ]}
        />
      </body>
    </html>
  );
}
