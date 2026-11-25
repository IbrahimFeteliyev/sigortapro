"use client";

import type { InsuranceSlug } from "@/types/insurance";
import { CarInsuranceForm } from "./CarInsuranceForm";
import { CascoForm } from "./CascoForm";
import { LifeForm } from "./LifeForm";
import { PropertyApplication, type PropertyOption } from "./PropertyForms";
import { TravelForm } from "./TravelForm";

/** Renders the application form that belongs to a product. */
export function ProductForm({
  slug,
  productName,
  propertyOption = null,
}: {
  slug: InsuranceSlug;
  productName: string;
  propertyOption?: PropertyOption | null;
}) {
  switch (slug) {
    case "car-insurance":
      return <CarInsuranceForm productName={productName} />;
    case "casco":
      return <CascoForm productName={productName} />;
    case "travel":
      return <TravelForm productName={productName} />;
    case "property":
      return <PropertyApplication productName={productName} initialOption={propertyOption} />;
    case "life":
      return <LifeForm productName={productName} />;
  }
}
