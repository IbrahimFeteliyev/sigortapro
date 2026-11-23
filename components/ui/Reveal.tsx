"use client";

import { m, type Variants } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

// Fixed pixel margin: a percentage of a tall viewport can keep content near
// the end of the page from ever being considered "in view".
const viewport = { once: true, margin: "0px 0px -64px 0px" } as const;

/** Fades + lifts its children into view once. Use only below the fold. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <m.div
      data-reveal=""
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={item}
      transition={{ delay }}
    >
      {children}
    </m.div>
  );
}

/** Staggers the reveal of direct `RevealItem` children. */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  as?: "div" | "ul" | "ol";
}) {
  const Component = as === "ul" ? m.ul : as === "ol" ? m.ol : m.div;
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </Component>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  const Component = as === "li" ? m.li : m.div;
  return (
    <Component data-reveal="" className={className} variants={item}>
      {children}
    </Component>
  );
}
