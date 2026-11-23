import { hasLocale } from "next-intl";
import { products } from "@/data/products";
import { routing } from "@/i18n/routing";
import { ogSize, renderOgImage } from "@/lib/og";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export const alt = "SığortaPro";
export const size = ogSize;
export const contentType = "image/png";

export default async function ProductOpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = hasLocale(routing.locales, raw) ? raw : routing.defaultLocale;
  const product = products.find((item) => item.slug === slug) ?? products[0];

  return renderOgImage({
    eyebrow: product.shortName[locale],
    title: product.name[locale],
    subtitle: product.tagline[locale],
  });
}
