import type { LocalizedText, Money } from "@/types/insurance";

/**
 * "Güvənli həyat" tariffs.
 *
 * Price = f(category, age group, coverage amount).
 *
 * IMPORTANT: no prices are filled in. The verified tariff tables have not
 * been provided in a readable form, and prices must not be invented or
 * estimated. Every cell is `null`, which the UI shows as "awaiting
 * confirmation" with an individual-offer CTA. Fill `prices` from the official
 * tables; cells left `null` stay unavailable.
 *
 * The age groups are a PLACEHOLDER structure: replace them with the exact
 * bands from the official tables before publishing prices.
 */

const l = (az: string, en: string, ru: string): LocalizedText => ({ az, en, ru });

export const lifeCategories = [
  {
    id: "critical-illness",
    name: l(
      "Sağalmaz xəstəliklərdən sığorta",
      "Critical illness insurance",
      "Страхование от неизлечимых заболеваний",
    ),
    description: l(
      "Ağır xəstəlik diaqnozu qoyulduqda ödəniş nəzərdə tutan sığorta.",
      "Cover that provides a payment on diagnosis of a critical illness.",
      "Страхование с выплатой при диагностике тяжёлого заболевания.",
    ),
  },
  {
    id: "death-any-cause",
    name: l("İstənilən səbəbdən ölüm", "Death from any cause", "Смерть по любой причине"),
    description: l(
      "Sığortalının vəfatı halında faydalanan şəxslərə ödəniş.",
      "A payment to beneficiaries if the insured person passes away.",
      "Выплата выгодоприобретателям в случае смерти застрахованного.",
    ),
  },
  {
    id: "death-and-critical-illness",
    name: l(
      "İstənilən səbəbdən ölüm və sağalmaz xəstəliklərdən sığorta",
      "Death from any cause and critical illness",
      "Смерть по любой причине и неизлечимые заболевания",
    ),
    description: l(
      "Hər iki riski bir polisdə birləşdirən geniş qoruma.",
      "Broad protection combining both risks in one policy.",
      "Широкая защита, объединяющая оба риска в одном полисе.",
    ),
  },
] as const;

export type LifeCategoryId = (typeof lifeCategories)[number]["id"];

/** PLACEHOLDER bands — replace with the official ones. */
export const lifeAgeGroups = [
  { id: "18-30", min: 18, max: 30 },
  { id: "31-40", min: 31, max: 40 },
  { id: "41-50", min: 41, max: 50 },
  { id: "51-60", min: 51, max: 60 },
] as const;

export type LifeAgeGroupId = (typeof lifeAgeGroups)[number]["id"];

export const lifeCoverageAmounts = [5_000, 10_000, 25_000, 50_000] as const;
export type LifeCoverageAmount = (typeof lifeCoverageAmounts)[number];

/** Which coverage amounts each category offers (all, until confirmed otherwise). */
export const lifeCategoryAmounts: Record<LifeCategoryId, readonly LifeCoverageAmount[]> = {
  "critical-illness": lifeCoverageAmounts,
  "death-any-cause": lifeCoverageAmounts,
  "death-and-critical-illness": lifeCoverageAmounts,
};

/** Insurance term options offered in the application form (years). */
export const lifeTermYears = [1, 3, 5, 10] as const;

type PriceTable = Record<LifeAgeGroupId, Record<LifeCoverageAmount, Money | null>>;

const emptyTable = (): PriceTable =>
  Object.fromEntries(
    lifeAgeGroups.map((group) => [
      group.id,
      Object.fromEntries(lifeCoverageAmounts.map((amount) => [amount, null])),
    ]),
  ) as PriceTable;

/** Verified annual prices — `null` = not confirmed / not available. */
export const lifePrices: Record<LifeCategoryId, PriceTable> = {
  "critical-illness": emptyTable(),
  "death-any-cause": emptyTable(),
  "death-and-critical-illness": emptyTable(),
};

export function lifePrice(
  category: LifeCategoryId,
  ageGroup: LifeAgeGroupId,
  amount: LifeCoverageAmount,
): Money | null {
  return lifePrices[category]?.[ageGroup]?.[amount] ?? null;
}

export function ageGroupForAge(age: number) {
  return lifeAgeGroups.find((group) => age >= group.min && age <= group.max) ?? null;
}
