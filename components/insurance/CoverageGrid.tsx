import {
  Accessibility,
  BadgeCheck,
  Bean,
  Brain,
  Building2,
  HandHeart,
  HeartPulse,
  Info,
  Ribbon,
  Users,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import type { CoverageItem } from "@/types/insurance";

const icons: Record<string, LucideIcon> = {
  users: Users,
  building: Building2,
  badge: BadgeCheck,
  ribbon: Ribbon,
  brain: Brain,
  heart: HeartPulse,
  kidney: Bean,
  paralysis: Accessibility,
  transplant: HandHeart,
};

/** Potential-coverage cards: photo cards or (for life) calm icon cards. */
export function CoverageGrid({
  items,
  note,
  columns = 3,
}: {
  items: CoverageItem[];
  /** Disclaimer shown when the list is illustrative. */
  note?: string;
  columns?: 2 | 3 | 4;
}) {
  return (
    <div>
      <RevealGroup
        as="ul"
        className={cn(
          "grid gap-x-6 gap-y-8 sm:grid-cols-2",
          columns === 3 && "lg:grid-cols-3",
          columns === 4 && "lg:grid-cols-4",
        )}
      >
        {items.map((item) => {
          const Icon = item.icon ? (icons[item.icon] ?? BadgeCheck) : BadgeCheck;
          return (
            <RevealItem as="li" key={item.id} className="group">
              {item.image ? (
                <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-surface">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                    placeholder={typeof item.image.src === "string" ? "empty" : "blur"}
                    className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.03] motion-reduce:transition-none"
                  />
                </div>
              ) : (
                <span className="grid size-12 place-items-center rounded-full bg-surface text-ink">
                  <Icon aria-hidden className="size-[1.375rem]" strokeWidth={1.6} />
                </span>
              )}
              <h3 className="mt-4 text-lg font-semibold text-ink">{item.title}</h3>
              <p className="mt-1 leading-relaxed text-muted">{item.description}</p>
            </RevealItem>
          );
        })}
      </RevealGroup>
      {note ? (
        <p className="mt-8 flex max-w-3xl gap-2.5 text-sm leading-relaxed text-muted">
          <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-subtle" />
          {note}
        </p>
      ) : null}
    </div>
  );
}
