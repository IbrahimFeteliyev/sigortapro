import { lifeMinPrice } from "@/data/life-tariffs";
import { propertyRegionTariffs } from "@/data/property-tariffs";
import type { InsuranceSlug } from "@/types/insurance";

export type PriceHint = { kind: "from"; amount: number } | { kind: "statutory" } | { kind: "quote" };

/** Short price line for product cards, derived from the tariff files. */
export function priceHint(slug: InsuranceSlug): PriceHint {
  switch (slug) {
    case "property":
      return { kind: "from", amount: Math.min(...propertyRegionTariffs.map((t) => t.price.amount)) };
    case "life":
      return { kind: "from", amount: lifeMinPrice() };
    case "car-insurance":
      return { kind: "statutory" };
    default:
      return { kind: "quote" };
  }
}
