import { getTranslations } from "next-intl/server";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import type { Locale } from "@/i18n/routing";
import { fillContact } from "@/lib/site";
import { PageHero } from "./PageHero";

interface LegalSection {
  title: string;
  body: string[];
}

/** Renders the privacy policy or terms from the `Legal` message namespace. */
export async function LegalDocument({
  locale,
  document,
  path,
}: {
  locale: Locale;
  document: "privacy" | "terms";
  path: string;
}) {
  const [t, meta] = await Promise.all([
    getTranslations({ locale, namespace: "Legal" }),
    getTranslations({ locale, namespace: "Metadata" }),
  ]);
  const title = meta(`${document}.title`);
  const sections = t.raw(document) as LegalSection[];

  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs locale={locale} items={[{ name: title }]} currentPath={path} />}
        title={title}
        description={t("intro")}
      />
      <div className="container-page pb-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <nav aria-label={title} className="hidden lg:col-span-4 lg:block">
            <ol className="sticky top-28 space-y-1 border-l border-line">
              {sections.map((section, index) => (
                <li key={section.title}>
                  <a
                    href={`#section-${index + 1}`}
                    className="-ml-px block border-l border-transparent py-1.5 pl-4 text-sm text-muted transition-colors hover:border-brand-600 hover:text-ink"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <article className="max-w-3xl lg:col-span-8">
            {sections.map((section, index) => (
              <section
                key={section.title}
                id={`section-${index + 1}`}
                aria-labelledby={`section-${index + 1}-heading`}
                className="scroll-mt-28 border-b border-line py-8 first:pt-0 last:border-none"
              >
                <h2
                  id={`section-${index + 1}-heading`}
                  className="text-xl font-semibold text-ink sm:text-2xl"
                >
                  <span className="mr-3 text-brand-600 tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {section.title}
                </h2>
                <div className="mt-4 space-y-4 leading-relaxed text-ink-soft">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{fillContact(paragraph)}</p>
                  ))}
                </div>
              </section>
            ))}
          </article>
        </div>
      </div>
    </>
  );
}
