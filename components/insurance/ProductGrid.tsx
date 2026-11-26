import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import type { InsuranceProductSummary } from "@/types/insurance";
import { ProductCard } from "./ProductCard";

/**
 * Photo-led selection grid: the two motor products lead in wide cards,
 * the other three share the second row.
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
    <RevealGroup className={cn("grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-6", className)}>
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
              imageClassName={
                featured ? "aspect-[3/2]" : lastOdd ? "aspect-[3/2] lg:aspect-[4/3]" : "aspect-[4/3]"
              }
              sizes={
                featured
                  ? "(min-width: 1024px) 600px, (min-width: 640px) 50vw, 100vw"
                  : "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
              }
            />
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
