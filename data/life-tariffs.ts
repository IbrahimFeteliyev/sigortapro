import type { LocalizedText, Money } from "@/types/insurance";

/**
 * "Güvənli həyat" tariffs — annual premium (AZN).
 *
 * Price = f(category, age group, coverage amount). Source: the business's
 * official tariff tables (photographed sheets + the 5 000 AZN critical-illness
 * flyer). Update the numbers here; the tariff table, the price box in the
 * application form and the prices page all read from this file.
 *
 * Note: in the photographed critical-illness sheet the 5 000 AZN column is
 * cropped, so that column comes from the flyer. For 51–55 the flyer says
 * 110 AZN while the 10 000 AZN column (215 AZN) implies ≈107.5 AZN — confirm.
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
      "Ağır xəstəlik diaqnozu qoyulduqda ödəniş.",
      "A payment on diagnosis of a critical illness.",
      "Выплата при диагностике тяжёлого заболевания.",
    ),
  },
  {
    id: "death-any-cause",
    name: l("İstənilən səbəbdən ölüm", "Death from any cause", "Смерть по любой причине"),
    description: l(
      "Vəfat halında yaxınlarınıza ödəniş.",
      "A payment to your loved ones if you pass away.",
      "Выплата близким в случае смерти.",
    ),
  },
  {
    id: "death-and-critical-illness",
    name: l(
      "İstənilən səbəbdən ölüm + Sağalmaz xəstəliklər",
      "Death from any cause + Critical illness",
      "Смерть по любой причине + Неизлечимые заболевания",
    ),
    description: l("Hər iki risk bir polisdə.", "Both risks in one policy.", "Оба риска в одном полисе."),
  },
] as const;

export type LifeCategoryId = (typeof lifeCategories)[number]["id"];

/**
 * Age bands exactly as printed in the tariff tables ("0–18", "18–40", …).
 * The printed bands share age 18; an 18-year-old is placed in "18–40"
 * (see `ageGroupForAge`).
 */
export const lifeAgeGroups = [
  { id: "0-18", min: 0, max: 18 },
  { id: "18-40", min: 18, max: 40 },
  { id: "41-50", min: 41, max: 50 },
  { id: "51-55", min: 51, max: 55 },
  { id: "56-60", min: 56, max: 60 },
  { id: "61-65", min: 61, max: 65 },
] as const;

export type LifeAgeGroupId = (typeof lifeAgeGroups)[number]["id"];

export const LIFE_MIN_AGE = lifeAgeGroups[0].min;
export const LIFE_MAX_AGE = lifeAgeGroups[lifeAgeGroups.length - 1].max;

export const lifeCoverageAmounts = [5_000, 10_000, 25_000, 50_000] as const;
export type LifeCoverageAmount = (typeof lifeCoverageAmounts)[number];

/** Which coverage amounts each category offers. */
export const lifeCategoryAmounts: Record<LifeCategoryId, readonly LifeCoverageAmount[]> = {
  "critical-illness": lifeCoverageAmounts,
  "death-any-cause": lifeCoverageAmounts,
  "death-and-critical-illness": lifeCoverageAmounts,
};

/** Insurance term options offered in the application form (years). */
export const lifeTermYears = [1, 3, 5, 10] as const;

/** One row per age group: premiums for 5 000 / 10 000 / 25 000 / 50 000 AZN. */
type Row = readonly [number, number, number, number];

const tables: Record<LifeCategoryId, Record<LifeAgeGroupId, Row>> = {
  "critical-illness": {
    "0-18": [5, 10, 25, 50],
    "18-40": [15, 30, 75, 150],
    "41-50": [45, 90, 225, 450],
    "51-55": [110, 215, 538, 1_075],
    "56-60": [180, 360, 900, 1_800],
    "61-65": [260, 520, 1_300, 2_600],
  },
  "death-any-cause": {
    "0-18": [5, 10, 25, 50],
    "18-40": [25, 50, 125, 250],
    "41-50": [50, 100, 250, 500],
    "51-55": [80, 160, 400, 800],
    "56-60": [125, 250, 625, 1_250],
    "61-65": [180, 360, 900, 1_800],
  },
  "death-and-critical-illness": {
    "0-18": [8, 16, 40, 80],
    "18-40": [30, 60, 150, 300],
    "41-50": [60, 120, 300, 600],
    "51-55": [125, 250, 625, 1_250],
    "56-60": [200, 400, 1_000, 2_000],
    "61-65": [300, 600, 1_500, 3_000],
  },
};

export function lifePrice(
  category: LifeCategoryId,
  ageGroup: LifeAgeGroupId,
  amount: LifeCoverageAmount,
): Money | null {
  if (!lifeCategoryAmounts[category].includes(amount)) return null;
  const column = lifeCoverageAmounts.indexOf(amount);
  const value = tables[category]?.[ageGroup]?.[column];
  return value === undefined ? null : { amount: value, currency: "AZN" };
}

/** Lowest premium in a category (for "from … AZN" labels). */
export function lifeMinPrice(category?: LifeCategoryId): number {
  const ids = category ? [category] : (Object.keys(tables) as LifeCategoryId[]);
  return Math.min(...ids.flatMap((id) => Object.values(tables[id]).map((row) => row[0])));
}

/** Age band for an exact age; the shared boundary (18) belongs to the adult band. */
export function ageGroupForAge(age: number) {
  for (let i = lifeAgeGroups.length - 1; i >= 0; i--) {
    const group = lifeAgeGroups[i];
    if (age >= group.min && age <= group.max) return group;
  }
  return null;
}
