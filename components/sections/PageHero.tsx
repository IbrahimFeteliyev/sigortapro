import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Header block for inner pages: breadcrumbs, H1 and one line of lead text. */
export function PageHero({
  title,
  description,
  breadcrumbs,
  children,
  className,
}: {
  /** Accepted for compatibility; inner pages no longer show an eyebrow. */
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  breadcrumbs?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("container-page pt-6 pb-10 sm:pt-8 sm:pb-12", className)}>
      {breadcrumbs}
      <div className="mt-8 max-w-3xl sm:mt-10">
        <h1 className="text-[2.25rem] leading-[1.08] font-semibold text-ink sm:text-5xl">{title}</h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{description}</p>
        ) : null}
        {children}
      </div>
    </section>
  );
}
