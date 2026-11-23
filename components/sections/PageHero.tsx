import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

/** Header block for inner pages: breadcrumbs, eyebrow, H1 and lead text. */
export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
  children,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  breadcrumbs?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative isolate overflow-hidden", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[460px] bg-linear-to-b from-brand-50 via-brand-50/40 to-white"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[460px] bg-dot-grid [mask-image:radial-gradient(60%_70%_at_70%_0%,black,transparent)]"
      />
      <div className="container-page pt-8 pb-12 sm:pt-10 sm:pb-16">
        {breadcrumbs}
        <div className="mt-10 max-w-3xl">
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          <h1 className="mt-3 text-[2.5rem] leading-[1.06] font-semibold text-ink sm:text-5xl lg:text-[3.5rem]">
            {title}
          </h1>
          {description ? (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">{description}</p>
          ) : null}
          {children}
        </div>
      </div>
    </section>
  );
}
