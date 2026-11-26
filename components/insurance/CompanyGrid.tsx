import Image from "next/image";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import type { InsuranceCompany } from "@/data/companies";

/** Original company logos at a uniform optical size on quiet white tiles. */
export function CompanyGrid({ companies }: { companies: InsuranceCompany[] }) {
  return (
    <RevealGroup as="ul" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {companies.map((company) => (
        <RevealItem
          as="li"
          key={company.id}
          className="grid h-24 place-items-center rounded-2xl bg-white px-5 ring-1 ring-line transition-shadow duration-300 hover:shadow-card-hover sm:h-28"
        >
          <Image
            src={company.logo}
            alt={company.name}
            width={company.logoWidth}
            height={company.logoHeight}
            unoptimized
            className="h-9 w-auto max-w-full object-contain sm:h-10"
          />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
