import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
  children?: ReactNode;
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-brand-700",
        className,
      )}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand-500" />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as: Heading = "h2",
  id,
  className,
  children,
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div className={cn("max-w-2xl", centered && "mx-auto text-center", className)}>
      {eyebrow ? <Eyebrow className={cn(centered && "justify-center")}>{eyebrow}</Eyebrow> : null}
      <Heading
        id={id}
        className={cn(
          "font-semibold text-ink",
          eyebrow && "mt-3",
          Heading === "h1"
            ? "text-4xl leading-[1.08] sm:text-5xl"
            : "text-3xl leading-[1.12] sm:text-[2.5rem]",
        )}
      >
        {title}
      </Heading>
      {description ? <p className="mt-4 text-lg leading-relaxed text-muted">{description}</p> : null}
      {children}
    </div>
  );
}
