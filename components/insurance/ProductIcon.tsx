import { CarFront, HeartPulse, House, Plane, ShieldCheck, type LucideIcon } from "lucide-react";
import type { InsuranceSlug } from "@/types/insurance";

export const productIcons: Record<InsuranceSlug, LucideIcon> = {
  "car-insurance": CarFront,
  casco: ShieldCheck,
  travel: Plane,
  property: House,
  life: HeartPulse,
};

export function ProductIcon({
  slug,
  className,
  strokeWidth = 1.75,
}: {
  slug: InsuranceSlug;
  className?: string;
  strokeWidth?: number;
}) {
  const Icon = productIcons[slug];
  return <Icon aria-hidden className={className} strokeWidth={strokeWidth} />;
}
