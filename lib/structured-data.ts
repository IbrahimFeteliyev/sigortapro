import type { Locale } from "@/i18n/routing";
import { absoluteUrl, siteConfig } from "@/lib/site";
import type { Faq, InsuranceProduct } from "@/types/insurance";

const organizationId = `${siteConfig.url}/#organization`;

/**
 * Only verifiable facts are published: name, URL, logo and phone number.
 * No address, ratings, reviews or licences are claimed.
 */
export function organizationSchema(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description,
    telephone: siteConfig.contact.phoneE164,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.contact.phoneE164,
      contactType: "customer service",
      areaServed: "AZ",
    },
  };
}

export function websiteSchema(locale: Locale, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${absoluteUrl(locale)}/#website`,
    name: siteConfig.name,
    url: absoluteUrl(locale),
    description,
    inLanguage: locale,
    publisher: { "@id": organizationId },
  };
}

export interface BreadcrumbEntry {
  name: string;
  /** Locale-less path; omit for the current page. */
  path?: string;
}

export function breadcrumbSchema(locale: Locale, items: BreadcrumbEntry[], currentPath: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(locale, item.path ?? currentPath),
    })),
  };
}

export function serviceSchema(locale: Locale, product: InsuranceProduct) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: product.name,
    serviceType: product.name,
    description: product.seo.description,
    url: absoluteUrl(locale, `/insurance/${product.slug}`),
    inLanguage: locale,
    provider: { "@id": organizationId },
    areaServed: { "@type": "Country", name: "Azerbaijan" },
  };
}

export function itemListSchema(locale: Locale, products: Pick<InsuranceProduct, "slug" | "name">[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: product.name,
      url: absoluteUrl(locale, `/insurance/${product.slug}`),
    })),
  };
}

/** Only emit for FAQs that are rendered visibly on the same page. */
export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
