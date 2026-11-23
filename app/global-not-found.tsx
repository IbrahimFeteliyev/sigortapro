import type { Metadata } from "next";
import { Onest } from "next/font/google";
import az from "@/messages/az.json";
import en from "@/messages/en.json";
import ru from "@/messages/ru.json";
import "./globals.css";

/*
 * Rendered for URLs outside any locale (e.g. /unknown.txt) where no localized
 * layout applies. Content is static and shown in all three languages.
 */

const onest = Onest({
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  variable: "--font-onest",
});

export const metadata: Metadata = {
  title: `${az.NotFound.code} — ${az.Metadata.siteName}`,
  robots: { index: false, follow: true },
};

const copy = [
  { locale: "az", title: az.NotFound.title, action: az.NotFound.home },
  { locale: "en", title: en.NotFound.title, action: en.NotFound.home },
  { locale: "ru", title: ru.NotFound.title, action: ru.NotFound.home },
] as const;

export default function GlobalNotFound() {
  return (
    <html lang="az" className={onest.variable}>
      <body className="grid min-h-dvh place-items-center bg-white px-5 text-ink antialiased">
        <main className="flex max-w-md flex-col items-center py-20 text-center">
          <p className="text-gradient-brand text-7xl font-semibold tracking-tight">{az.NotFound.code}</p>
          <ul className="mt-8 w-full space-y-3">
            {copy.map((item) => (
              <li
                key={item.locale}
                lang={item.locale}
                className="flex items-center justify-between gap-4 rounded-2xl px-5 py-4 ring-1 ring-line"
              >
                <span className="font-medium">{item.title}</span>
                <a
                  href={`/${item.locale}`}
                  hrefLang={item.locale}
                  className="text-sm font-semibold whitespace-nowrap text-brand-700 hover:text-brand-800"
                >
                  {item.action} →
                </a>
              </li>
            ))}
          </ul>
        </main>
      </body>
    </html>
  );
}
