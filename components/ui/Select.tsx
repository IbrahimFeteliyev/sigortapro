"use client";

import { Check, ChevronDown } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useCallback, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useDismiss } from "@/lib/hooks/use-dismiss";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

/**
 * Accessible custom select (WAI-ARIA listbox pattern). Replaces the native
 * <select>, whose popup cannot be styled. Supports arrows, Home/End,
 * Enter/Space, Escape and type-ahead.
 */
export function Select({
  id,
  value,
  onChange,
  onBlur,
  options,
  placeholder,
  invalid,
  variant = "field",
  className,
  "aria-describedby": describedBy,
  "aria-labelledby": labelledBy,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  options: SelectOption[];
  placeholder: string;
  invalid?: boolean;
  /** "field": bordered form control. "bare": borderless, for embedding (hero search). */
  variant?: "field" | "bare";
  className?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ text: "", timer: 0 as unknown as ReturnType<typeof setTimeout> });
  const autoId = useId();
  const baseId = id ?? autoId;
  const listId = `${baseId}-listbox`;
  const selected = options.find((o) => o.value === value);

  const close = useCallback(
    (reason?: "outside" | "escape") => {
      setOpen(false);
      if (reason === "escape") buttonRef.current?.focus();
      else onBlur?.();
    },
    [onBlur],
  );
  useDismiss(open, close, containerRef);

  const openList = () => {
    const index = Math.max(
      0,
      options.findIndex((o) => o.value === value),
    );
    setActive(index);
    setOpen(true);
    requestAnimationFrame(() => listRef.current?.focus({ preventScroll: true }));
  };

  const choose = (index: number) => {
    const option = options[index];
    if (option) onChange(option.value);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const scrollIntoView = (index: number) =>
    listRef.current
      ?.querySelector(`#${CSS.escape(`${baseId}-opt-${index}`)}`)
      ?.scrollIntoView({ block: "nearest" });

  const move = (index: number) => {
    const next = Math.min(options.length - 1, Math.max(0, index));
    setActive(next);
    scrollIntoView(next);
  };

  const onListKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        return move(active + 1);
      case "ArrowUp":
        event.preventDefault();
        return move(active - 1);
      case "Home":
        event.preventDefault();
        return move(0);
      case "End":
        event.preventDefault();
        return move(options.length - 1);
      case "Enter":
      case " ":
        event.preventDefault();
        return choose(active);
      case "Tab":
        return close();
      default:
        if (event.key.length === 1) {
          const t = typeahead.current;
          clearTimeout(t.timer);
          t.text += event.key.toLocaleLowerCase();
          t.timer = setTimeout(() => (t.text = ""), 600);
          const match = options.findIndex((o) => o.label.toLocaleLowerCase().startsWith(t.text));
          if (match >= 0) move(match);
        }
    }
  };

  const onButtonKeyDown = (event: KeyboardEvent) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      openList();
    }
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        ref={buttonRef}
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={labelledBy ? `${labelledBy} ${baseId}-value` : undefined}
        aria-describedby={describedBy}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onButtonKeyDown}
        className={cn(
          "flex w-full cursor-pointer items-center gap-3 text-left outline-none",
          variant === "field" &&
            "h-13 rounded-2xl bg-white px-4 ring-1 ring-line-strong transition-shadow ring-inset hover:ring-ink/30 focus-visible:ring-2 focus-visible:ring-ink",
          variant === "field" && open && "ring-2 ring-ink",
          variant === "field" &&
            invalid &&
            "ring-danger-600 hover:ring-danger-600 focus-visible:ring-danger-600",
          variant === "bare" && "h-7 bg-transparent focus-visible:outline-none",
        )}
      >
        {selected?.icon ? <span className="shrink-0 text-ink">{selected.icon}</span> : null}
        <span
          id={`${baseId}-value`}
          className={cn(
            "min-w-0 flex-1 truncate",
            variant === "field" ? "text-base" : "text-[0.9375rem]",
            selected ? "text-ink" : "text-subtle",
          )}
        >
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          aria-hidden
          className={cn(
            "size-4 shrink-0 text-subtle transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <m.ul
            ref={listRef}
            id={listId}
            role="listbox"
            tabIndex={-1}
            aria-labelledby={labelledBy}
            aria-activedescendant={`${baseId}-opt-${active}`}
            onKeyDown={onListKeyDown}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "absolute z-50 mt-2 max-h-80 min-w-full origin-top overflow-y-auto overscroll-contain rounded-2xl bg-white p-1.5 shadow-pop ring-1 ring-line outline-none",
              variant === "bare" ? "-left-3 w-[calc(100%+1.5rem)] min-w-72" : "left-0",
            )}
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;
              return (
                <li
                  key={option.value}
                  id={`${baseId}-opt-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  onPointerMove={() => active !== index && setActive(index)}
                  onClick={() => choose(index)}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-[0.9375rem] text-ink-soft select-none",
                    index === active && "bg-surface text-ink",
                    isSelected && "font-semibold text-ink",
                  )}
                >
                  {option.icon ? (
                    <span
                      className={cn(
                        "grid size-9 shrink-0 place-items-center rounded-xl",
                        isSelected ? "bg-ink text-white" : "bg-surface text-ink",
                      )}
                    >
                      {option.icon}
                    </span>
                  ) : null}
                  <span className="min-w-0 flex-1">{option.label}</span>
                  {isSelected ? <Check aria-hidden className="size-4 shrink-0 text-ink" /> : null}
                </li>
              );
            })}
          </m.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
