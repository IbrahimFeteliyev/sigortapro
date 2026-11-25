import type { LocalizedText, Money } from "@/types/insurance";

/**
 * Standard property insurance — business-provided tariff table.
 * Update amounts here; every page and form reads from this file.
 */
export interface PropertyRegionTariff {
  id: string;
  name: LocalizedText;
  /** Sum insured. */
  coverage: Money;
  /** Insurance price (premium). */
  price: Money;
}

const l = (az: string, en: string, ru: string): LocalizedText => ({ az, en, ru });
const azn = (amount: number): Money => ({ amount, currency: "AZN" });

export const propertyRegionTariffs: PropertyRegionTariff[] = [
  { id: "baku", name: l("Bakı", "Baku", "Баку"), coverage: azn(25_000), price: azn(50) },
  { id: "ganja", name: l("Gəncə", "Ganja", "Гянджа"), coverage: azn(20_000), price: azn(40) },
  { id: "sumgait", name: l("Sumqayıt", "Sumgait", "Сумгайыт"), coverage: azn(20_000), price: azn(40) },
  { id: "nakhchivan", name: l("Naxçıvan", "Nakhchivan", "Нахчыван"), coverage: azn(20_000), price: azn(40) },
  {
    id: "other",
    name: l("Digər rayonlar", "Other districts", "Другие районы"),
    coverage: azn(15_000),
    price: azn(30),
  },
];

export type PropertyRegionId = (typeof propertyRegionTariffs)[number]["id"];

export const propertyTypes = [
  { id: "apartment", name: l("Mənzil", "Apartment", "Квартира") },
  { id: "house", name: l("Fərdi yaşayış evi", "Private house", "Частный дом") },
  { id: "country-house", name: l("Bağ evi", "Country house", "Дача") },
  { id: "non-residential", name: l("Qeyri-yaşayış sahəsi", "Non-residential premises", "Нежилое помещение") },
] as const;
