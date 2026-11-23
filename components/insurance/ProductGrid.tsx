import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import type { InsuranceProductSummary } from "@/types/insurance";
import { ProductCard } from "./ProductCard";

/**
 * Bento layout: the two motor products lead in wide cards, the remaining
 * three share the second row. Collapses gracefully on smaller screens.
 */
export function ProductGrid({
  products,
  headingLevel = "h3",
  className,
}: {
  products: InsuranceProductSummary[];
  headingLevel?: "h2" | "h3";
  className?: string;
}) {
  return (
    <RevealGroup className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-6", className)}>
      {products.map((product, index) => {
        const featured = index < 2;
        const lastOdd = index === products.length - 1 && products.length % 2 === 1;
        return (
          <RevealItem
            key={product.slug}
            className={cn(
              "h-full",
              featured ? "lg:col-span-3" : "lg:col-span-2",
              lastOdd && "sm:col-span-2 lg:col-span-2",
            )}
          >
            <ProductCard
              product={product}
              headingLevel={headingLevel}
              artClassName={
                featured ? "aspect-[16/9]" : lastOdd ? "aspect-[16/9] lg:aspect-[4/3]" : "aspect-[4/3]"
              }
            />
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
