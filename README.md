# SığortaPro — website (Phase 1, frontend only)

Multilingual (AZ / EN / RU) insurance website with per-product online application forms, built with
Next.js 16 (App Router, Cache Components), TypeScript, Tailwind CSS 4, next-intl, Motion, React Hook
Form and Zod.

**Phase 1 scope:** there is no backend, database, auth, admin panel or payment. Content and tariffs live
in typed config files, and every form validates fully but **does not submit anywhere**. Each form ends in
a clearly labelled demo state, with an optional WhatsApp hand-off that the user sends themselves. Nothing
is ever stored: no localStorage, no sessionStorage, no analytics. The data layer is ready to point at a
Spring Boot REST API in Phase 2.

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
| `NEXT_PUBLIC_API_BASE_URL` | No (Phase 2)  | Spring Boot API origin. If empty, the site uses mock data and the forms run in demo mode.                                                          |

Both are inlined at **build** time, so rebuild after changing them.

## Where to edit things

| What                                                            | File                                              |
| --------------------------------------------------------------- | ------------------------------------------------- |
| **Phone number / WhatsApp** (single source of truth)            | `lib/site.ts` → `siteConfig.contact`              |
| Product texts, FAQs, SEO, hero/card photos                      | `data/products.ts`                                |
| Coverage cards (CASCO, travel, Property CASCO, illnesses…)      | `data/coverage.ts` (`confirmed` flag per product) |
| Insurance companies (names, monograms, authorised logos)        | `data/companies.ts`                               |
| Standard property tariffs by region                             | `data/property-tariffs.ts`                        |
| Life tariffs (categories, age groups, amounts, prices)          | `data/life-tariffs.ts`                            |
| Form options, document formats, AVTO+/AVTO EXTRA prices, upload | `data/form-options.ts`                            |
| Photos (static imports + localized alt text)                    | `data/images.ts`, files in `public/images/`       |
| UI text                                                         | `messages/{az,en,ru}.json`                        |

Long-form translated text uses a `{phone}` placeholder that is filled from `siteConfig`, so the number is
never typed into translations.

## Project structure

```
app/[locale]/
  page.tsx                    Home: hero, product selection, steps, benefits, companies, FAQ
  insurance/                  Catalogue + [slug] product pages (form embedded in the hero)
  companies/ prices/ about/ contact/ apply/ privacy-policy/ terms/
components/
  forms/                      Product forms + shared kit
    CarInsuranceForm          3 steps: vehicle → person & documents → AVTO+/AVTO EXTRA
    CascoForm, TravelForm     Single-page forms
    PropertyForms             Standard (region tariff) / Property CASCO (individual quote)
    LifeForm, DocumentUpload  Category → age group → amount price lookup; local-only ID upload
    kit.tsx, fields.tsx       Masked inputs, custom select, checkboxes, consent, errors
    FormOutcome               Demo result (sensitive values masked, excluded from WhatsApp text)
  insurance/                  ProductCard/Grid, CoverageGrid, PropertyTariffTable, LifeTariffTable, CompanyGrid
  home/ layout/ sections/ ui/
lib/
  validation/                 fields.ts (shared rules) + schemas.ts (one Zod schema per form)
  input-format.ts             Input masks (plate, FİN, phone, documents, amounts, names)
  format.ts                   Deterministic AZN formatting (no Intl → no hydration mismatches)
  api/                        products, content, applications (mock today, REST in Phase 2)
```

## Forms and validation

Every structured field is **masked while typing**, so invalid characters never enter it. **Zod** then
validates the value, and the error appears in the current language.

| Field                    | Rule                                                                       |
| ------------------------ | -------------------------------------------------------------------------- |
| Registration plate       | `10-AA-100`: 2 digits, 2 letters, 3 digits, uppercase, max 7 characters    |
| FİN                      | 7 letters/digits, uppercase                                                |
| ID card                  | Series `AZE` → 8 digits, series `AA` → 7 digits                            |
| VÖEN (legal entity)      | 10 digits                                                                  |
| Registration certificate | 2 letters + 6 digits (configurable in `data/form-options.ts`)              |
| Driving licence          | 2 letters + 6 digits (configurable)                                        |
| Phone                    | `0XX XXX XX XX` or `+994 XX XXX XX XX`, valid operator/area code           |
| Year / amounts / dates   | 1950 – next year; positive amounts; start ≥ today, end ≥ start, ≤ 365 days |

**Identity document upload (life insurance) is a local demonstration.** Files are previewed in the
browser only. They are never uploaded, transmitted or persisted, and the UI says so.

## Pricing data — what is real and what is pending

- **Standard property insurance:** the table you provided (Baku 25,000/50 AZN; Ganja, Sumgait and
  Nakhchivan 20,000/40 AZN; other districts 15,000/30 AZN), shown live when a region is selected.
- **Life insurance:** the categories and the 5,000/10,000/25,000/50,000 AZN amounts are set up, but
  **no prices are filled in**, because the tariff tables were not available in a readable form. Every
  cell shows "Tarif hələ təsdiqlənməyib". The age groups in `data/life-tariffs.ts` are a **placeholder**
  structure: replace them with the official bands, then fill `lifePrices`.
- **AVTO+ / AVTO EXTRA:** `price: null` until confirmed. The total is calculated automatically once
  prices are set.
- **Compulsory motor, CASCO, travel, Property CASCO:** individual quotes; no premium is calculated.

## Photos

All photos are CC0 / public domain, found via the Openverse API (sources mostly StockSnap and rawpixel)
and listed in `public/images/credits.json`. They were resized to ≤ 1200 px and compressed. None contain
third-party contact details or ad branding. Replace them with your own professional photography at any
time by keeping the file names or editing `data/images.ts`.

## Backend integration contract (Phase 2)

| Method | Endpoint                             | Returns / body                                                                   |
| ------ | ------------------------------------ | -------------------------------------------------------------------------------- |
| GET    | `/api/v1/products?lang={az\|en\|ru}` | `InsuranceProduct[]` (see `types/insurance.ts`)                                  |
| GET    | `/api/v1/products/{slug}?lang=…`     | `InsuranceProduct`, or `404`                                                     |
| POST   | `/api/v1/applications`               | `{ product, form, locale, data }` (`lib/api/applications.ts`) → `{ reference? }` |

Product data is cached with `"use cache"` and the `products` tag, so call `revalidateTag("products")`
after content changes.

## Quality notes

Lighthouse (mobile, simulated throttling) on the production build, median of 3 runs per page:
**Performance 99–100, Accessibility 100, Best Practices 100, SEO 100**, with LCP ≈ 0.9 s and CLS 0. On
phones the homepage hero is text-first and the photo-led product cards follow immediately; this keeps
LCP fast.

## Before launch

1. Set `NEXT_PUBLIC_SITE_URL` to the real domain and rebuild.
2. Fill in the **life tariff tables** and their real **age groups** (`data/life-tariffs.ts`), and the
   **AVTO+ / AVTO EXTRA** prices and descriptions (`data/form-options.ts`).
3. Confirm the **coverage lists** (`data/coverage.ts`), then set `confirmed: true` to remove the
   "illustrative" notes.
4. Add **authorised company logos** (`data/companies.ts` → `logo`). Until then neutral monograms are
   shown. Confirm what may be said about each company. No partnership is claimed today.
5. Confirm the **registration certificate and driving licence formats** (`data/form-options.ts`).
6. Have the Privacy Policy and Terms reviewed by a lawyer.
