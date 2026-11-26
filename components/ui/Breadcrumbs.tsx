import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { breadcrumbSchema, type BreadcrumbEntry } from "@/lib/structured-data";
import { JsonLd } from "./JsonLd";

/**
 * Visible breadcrumb trail + matching BreadcrumbList structured data.
 * `items` excludes the home entry; the last item is the current page.
 */
export function Breadcrumbs({
  locale,
  items,
  currentPath,
}: {
  locale: Locale;
  items: BreadcrumbEntry[];
  currentPath: string;
}) {
  const t = useTranslations("Breadcrumbs");
  const trail: BreadcrumbEntry[] = [{ name: t("home"), path: "/" }, ...items];

  return (
    <>
      <nav aria-label={t("label")} className="text-sm">
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-muted">
          {trail.map((item, index) => {
            const isLast = index === trail.length - 1;
            return (
              <li key={`${item.name}-${index}`} className="flex items-center gap-1.5">
                {isLast ? (
                  <span aria-current="page" className="font-medium text-ink">
                    {item.name}
                  </span>
                ) : (
                  <>
                    <Link href={item.path ?? "/"} className="rounded-sm transition-colors hover:text-ink">
                      {item.name}
                    </Link>
                    <ChevronRight aria-hidden className="size-3.5 text-subtle" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbSchema(locale, trail, currentPath)} />
    </>
  );
}
