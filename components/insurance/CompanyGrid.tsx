import Image from "next/image";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import type { InsuranceCompany } from "@/data/companies";

/**
 * Company name cards. Authorised logos render at a uniform size; until one
 * is provided, a neutral monogram is shown (never a recreated logo).
 */
export function CompanyGrid({ companies }: { companies: InsuranceCompany[] }) {
  return (
    <RevealGroup as="ul" className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
      {companies.map((company) => (
        <RevealItem
          as="li"
          key={company.id}
          className="group flex flex-col items-center justify-center rounded-[1.5rem] bg-white px-4 py-6 text-center shadow-xs ring-1 ring-line transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-card-hover motion-reduce:hover:translate-y-0"
        >
          <span className="grid h-14 w-full place-items-center">
            {company.logo ? (
              <Image
                src={company.logo}
                alt={company.name}
                width={140}
                height={56}
                className="h-12 w-auto object-contain"
              />
            ) : (
              <span
                aria-hidden
                className="grid size-14 place-items-center rounded-2xl bg-surface text-base font-semibold tracking-tight text-brand-800 ring-1 ring-line transition-colors group-hover:bg-brand-50"
              >
                {company.monogram}
              </span>
            )}
          </span>
          <span className="mt-3 text-sm leading-snug font-semibold text-ink">{company.name}</span>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
