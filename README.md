# SığortaPro — website (Phase 1, frontend only)

Multilingual (AZ / EN / RU) marketing site and online application flow for SığortaPro, built with
Next.js 16 (App Router, Cache Components), TypeScript, Tailwind CSS 4, next-intl, Motion, React Hook
Form and Zod.

**Phase 1 scope:** no backend, database, auth, admin panel or payments. Product content lives in typed
mock data, and the application form validates fully but **does not submit anywhere**. It ends in a clearly
labelled demo state (with an optional, user-initiated WhatsApp hand-off). The data layer is ready to point
at a Spring Boot REST API in Phase 2.

## Getting started

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_SITE_URL
npm run dev                  # http://localhost:3000 → redirects to /az
```

| Script                    | Purpose                                                    |
| ------------------------- | ---------------------------------------------------------- |
| `npm run build` / `start` | Production build / server                                  |
| `npm run lint`            | ESLint (Next.js + React Hooks rules)                       |
| `npm run typecheck`       | Generates route types, then `tsc --noEmit`                 |
| `npm run format`          | Prettier (+ Tailwind class sorting); `format:check` for CI |
| `npm run i18n:check`      | Fails if `en.json` / `ru.json` keys drift from `az.json`   |

### Environment variables

| Variable                   | Required      | Description                                                                                                                                        |
| -------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`     | Yes, for prod | Public origin, e.g. `https://www.example.az`. Drives canonicals, hreflang, sitemap, robots, OG and JSON-LD URLs. The build warns if it is missing. |
| `NEXT_PUBLIC_API_BASE_URL` | No (Phase 2)  | Spring Boot API origin. Empty means mock data plus demo-mode form.                                                                                 |

Both are inlined at **build** time, so rebuild after changing them.

## Project structure

```
app/
  [locale]/                 Localized routes (root layout lives here; `locale` is a root param)
    page.tsx                Home
    insurance/              Catalogue + insurance/[slug] product pages (+ per-product OG images)
    prices/ about/ contact/ apply/ privacy-policy/ terms/
    [...rest]/ not-found.tsx  Localized 404 handling
  global-not-found.tsx      404 for URLs outside any locale
  sitemap.ts robots.ts manifest.ts icon.svg apple-icon.tsx logo.png/
components/
  layout/                   Header (mega-menu, mobile menu), LocaleSwitcher, Footer, WhatsAppFab
  home/                     Homepage sections (Hero, TrustBar, Products, Benefits, Pricing)
  insurance/                ProductCard, ProductGrid, ProductArt, TariffCard, PriceTag, ProductIcon
  sections/                 Shared sections (PageHero, FAQ, CTA, HowItWorks, LegalDocument)
  forms/                    Multi-step application form
  ui/                       Primitives (buttons, Accordion, Carousel, Reveal, Breadcrumbs, JsonLd…)
data/products.ts            Mock product content (AZ/EN/RU per field)
i18n/                       next-intl routing, request config, navigation helpers
lib/api/                    Data-access layer (products, applications, HTTP client)
lib/validation/             Zod schema for the application form
lib/                        SEO metadata, structured data, OG renderer, site config
messages/{az,en,ru}.json    UI strings (az.json is the typed source of truth)
proxy.ts                    Locale routing (Next 16 “proxy”, formerly middleware)
assets/fonts/               Onest static TTFs (OFL) used only for generated OG images
```

## Internationalization

- Routes are always prefixed: `/az` (default), `/en`, `/ru`. `/` redirects to `/az`. Browser-language
  detection is **off** on purpose, so the default is always Azerbaijani. Enable it with `localeDetection` in
  `i18n/routing.ts`.
- The language switcher keeps the current page.
- UI text lives in `messages/*.json`; keys are type-checked against `az.json`. Run `npm run i18n:check`
  after editing translations.
- Validation messages are translation keys returned by the Zod schema and resolved in the UI, so every
  error is localized.
- Product content is stored per locale in `data/products.ts` (mirroring what the API will return
  per `?lang=`).

## Content and pricing

- **No prices are shown.** Every `startingPrice` in `data/products.ts` is `null`, so cards show
  “Qiymət sorğu əsasında” with a **“Qiymət təklifi al”** button. To publish a verified price, set
  `startingPrice: { amount, currency: "AZN" }` on the product or tariff; the UI then renders it.
- Coverage and plan descriptions are written as non-binding and are accompanied by a disclaimer. Have a
  licensed insurer or partner verify all product wording before launch.
- **Imagery:** product visuals are branded SVG illustrations (no stock photos). To use photography, put
  files in `public/images/products/` and set `image: { src, alt: {az,en,ru} }` on a product. `ProductArt`
  switches to an optimized `next/image` automatically.

## Application form

`components/forms/ApplicationForm.tsx`: 4 steps (type → product-specific details → contact → review),
React Hook Form and Zod, localized errors, focus management, deep links
(`/az/apply?type=casco&plan=standard`).

- **Phase 1 (no API URL):** a banner explains demo mode; submission resolves locally to a “Demo” result.
  It never claims the application was received and never shows an application number. Users can
  optionally send their summary themselves via a pre-filled WhatsApp link.
- **Phase 2:** with `NEXT_PUBLIC_API_BASE_URL` set, `submitApplication()` POSTs the payload instead
  (see below), and the banner and demo state disappear.

## Backend integration contract (Phase 2)

`lib/api/products.ts` and `lib/api/applications.ts` switch from mocks to HTTP automatically when the API
URL is set:

| Method | Endpoint                             | Returns / body                                                            |
| ------ | ------------------------------------ | ------------------------------------------------------------------------- |
| GET    | `/api/v1/products?lang={az\|en\|ru}` | `InsuranceProduct[]` (see `types/insurance.ts`)                           |
| GET    | `/api/v1/products/{slug}?lang=…`     | `InsuranceProduct`, or `404`                                              |
| POST   | `/api/v1/applications`               | Body: `ApplicationPayload` (`lib/api/applications.ts`) → `{ reference? }` |

Product data is cached with `"use cache"` and tag `products`. Call `revalidateTag("products")` (e.g. from
an admin webhook route) to refresh pages after content changes. Phone numbers are normalized to E.164
(`+994…`), and amounts and years are sent as numbers.

## SEO

- Per-page `generateMetadata`: unique title/description, canonical, `hreflang` (az/en/ru + `x-default`),
  Open Graph and Twitter tags. Generated 1200×630 OG images per locale and per product.
- JSON-LD: `Organization`, `WebSite` (every page), `Service` (products), `BreadcrumbList` (inner pages),
  `ItemList` (catalogue) and `FAQPage` (only where the FAQ is visible). No ratings, reviews, addresses or
  licences are claimed.
- `sitemap.xml` lists all 39 localized URLs with alternates; `robots.txt` points to it.
- Unknown product slugs and unknown paths return HTTP 404.

## Quality notes

Lighthouse (mobile, simulated throttling) on the production build, median of 3–5 runs:
Performance 94–100, Accessibility 100, Best Practices 100, SEO 100. LCP ≈ 0.9 s, CLS 0. Scores vary with
hosting and hardware, so treat them as a baseline.

- All pages are statically prerendered.
- Fonts are self-hosted through `next/font`. Onest was chosen because it covers the Azerbaijani **ə/Ə**,
  Cyrillic and the manat sign **₼**; many popular fonts lack the schwa.
- Motion loads its features lazily, animations respect `prefers-reduced-motion`, and above-the-fold
  content is never hidden behind scroll animations.

## Before launch

1. Set `NEXT_PUBLIC_SITE_URL` to the real domain and rebuild.
2. Have the Privacy Policy and Terms (`messages/*.json` → `Legal`) reviewed by a lawyer. They are generic
   templates without company registration details.
3. Verify all product and coverage wording with the insurer/partner, and add real prices only if verified.
4. Optionally add real photography (see “Content and pricing”).
5. If you add analytics or marketing pixels, add a cookie-consent mechanism and update the Privacy Policy
   (it currently states that no tracking cookies are used).
