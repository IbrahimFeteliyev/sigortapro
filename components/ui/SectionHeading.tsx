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
  return <p className={cn("text-sm font-semibold text-brand-600", className)}>{children}</p>;
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
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <Heading
        id={id}
        className={cn(
          "font-semibold text-ink",
          eyebrow && "mt-2",
          Heading === "h1"
            ? "text-4xl leading-[1.08] sm:text-5xl"
            : "text-[1.75rem] leading-[1.15] sm:text-[2.125rem]",
        )}
      >
        {title}
      </Heading>
      {description ? (
        <p className="mt-3 text-base leading-relaxed text-muted sm:text-lg">{description}</p>
      ) : null}
      {children}
    </div>
  );
}
