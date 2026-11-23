"use client";

import { Plus } from "lucide-react";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  question: string;
  answer: string;
}

/**
 * Answers stay in the DOM when collapsed (only visually hidden + inert), so
 * search engines and FAQPage structured data always see the full content.
 */
export function Accordion({
  items,
  headingLevel = 3,
  className,
}: {
  items: AccordionItem[];
  headingLevel?: 2 | 3 | 4;
  className?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();
  const Heading = `h${headingLevel}` as const;

  return (
    <div className={cn("divide-y divide-line border-y border-line", className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const buttonId = `${baseId}-trigger-${index}`;
        const panelId = `${baseId}-panel-${index}`;
        return (
          <div key={item.question}>
            <Heading className="text-base font-medium tracking-normal sm:text-[1.0625rem]">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="group flex w-full items-center justify-between gap-6 py-5 text-left text-ink transition-colors hover:text-brand-700"
              >
                <span>{item.question}</span>
                <span
                  aria-hidden
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full ring-1 ring-line-strong transition-[transform,background-color] duration-300 ease-out-soft group-hover:bg-surface motion-reduce:transition-none",
                    isOpen && "rotate-45 bg-brand-50 ring-brand-200",
                  )}
                >
                  <Plus className="size-4" />
                </span>
              </button>
            </Heading>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!isOpen}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-300 ease-out-soft motion-reduce:transition-none",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="pr-10 pb-6 leading-relaxed text-muted">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
