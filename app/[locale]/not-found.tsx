import { ArrowLeft, ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { ProductIcon } from "@/components/insurance/ProductIcon";
import { buttonStyles } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getProductSummaries } from "@/lib/api/products";

export async function generateMetadata() {
  const t = await getTranslations("Metadata.notFound");
  return { title: t("title") };
}

export default async function NotFound() {
  const locale = await getLocale();
  const [t, products] = await Promise.all([getTranslations("NotFound"), getProductSummaries(locale)]);

  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-dot-grid [mask-image:radial-gradient(50%_60%_at_50%_30%,black,transparent)]"
      />
      <div className="container-page flex flex-col items-center py-24 text-center sm:py-32">
        <p className="text-gradient-brand text-7xl font-semibold tracking-tight sm:text-8xl">{t("code")}</p>
        <h1 className="mt-6 text-3xl font-semibold text-ink sm:text-4xl">{t("title")}</h1>
        <p className="mt-4 max-w-md text-lg text-muted">{t("description")}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/" className={buttonStyles({ size: "lg" })}>
            <ArrowLeft aria-hidden className="size-4" />
            {t("home")}
          </Link>
          <Link href="/insurance" className={buttonStyles({ variant: "secondary", size: "lg" })}>
            {t("browse")}
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
        <ul className="mt-14 flex flex-wrap justify-center gap-2">
          {products.map((product) => (
            <li key={product.slug}>
              <Link
                href={`/insurance/${product.slug}`}
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-ink shadow-xs ring-1 ring-line transition-colors hover:bg-surface"
              >
                <ProductIcon slug={product.slug} className="size-4 text-brand-600" />
                {product.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
