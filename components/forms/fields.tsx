"use client";

import { CircleAlert, Minus, Plus } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Shared styles                                                             */
/* -------------------------------------------------------------------------- */

export function controlClass(invalid?: boolean, className?: string) {
  return cn(
    // 16px text prevents iOS zoom on focus.
    "block h-13 w-full rounded-2xl bg-white px-4 text-base text-ink outline-none placeholder:text-subtle",
    "ring-1 ring-line-strong transition-shadow duration-150 ring-inset hover:ring-ink/30",
    "focus-visible:ring-2 focus-visible:ring-ink focus-visible:outline-none",
    invalid && "ring-danger-600 hover:ring-danger-600 focus-visible:ring-danger-600",
    className,
  );
}

export function describedBy(id: string, { hint, error }: { hint?: ReactNode; error?: string }) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

/* -------------------------------------------------------------------------- */
/*  Labels, hints, errors                                                     */
/* -------------------------------------------------------------------------- */

function RequiredMark() {
  return (
    <span aria-hidden className="ml-0.5 text-danger-600">
      *
    </span>
  );
}

function FieldMessages({ id, hint, error }: { id: string; hint?: ReactNode; error?: string }) {
  if (error) {
    return (
      <p id={`${id}-error`} className="mt-2 flex items-start gap-1.5 text-sm font-medium text-danger-700">
        <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
        {error}
      </p>
    );
  }
  if (hint) {
    return (
      <p id={`${id}-hint`} className="mt-2 text-sm text-muted">
        {hint}
      </p>
    );
  }
  return null;
}

interface FieldProps {
  id: string;
  label: ReactNode;
  required?: boolean;
  optionalLabel?: string;
  hint?: ReactNode;
  error?: string;
  className?: string;
  children: ReactNode;
}

/** Label + control + hint/error for single inputs. */
export function Field({ id, label, required, optionalLabel, hint, error, className, children }: FieldProps) {
  return (
    <div className={className}>
      <label
        id={`${id}-label`}
        htmlFor={id}
        className="flex items-baseline justify-between gap-3 text-sm font-semibold text-ink"
      >
        <span>
          {label}
          {required ? <RequiredMark /> : null}
        </span>
        {!required && optionalLabel ? (
          <span className="text-xs font-normal text-muted">{optionalLabel}</span>
        ) : null}
      </label>
      <div className="mt-2">{children}</div>
      <FieldMessages id={id} hint={hint} error={error} />
    </div>
  );
}

/** Fieldset + legend for radio/checkbox groups and compound controls. */
export function FieldGroup({
  id,
  legend,
  required,
  hint,
  error,
  className,
  children,
}: Omit<FieldProps, "optionalLabel" | "label"> & { legend: ReactNode }) {
  return (
    <fieldset
      className={cn("min-w-0", className)}
      aria-describedby={describedBy(id, { hint, error })}
      aria-invalid={error ? true : undefined}
    >
      <legend className="text-sm font-semibold text-ink">
        {legend}
        {required ? <RequiredMark /> : null}
      </legend>
      <div className="mt-3">{children}</div>
      <FieldMessages id={id} hint={hint} error={error} />
    </fieldset>
  );
}

/* -------------------------------------------------------------------------- */
/*  Controls                                                                  */
/* -------------------------------------------------------------------------- */

/** Large selectable card backed by a native radio input. */
export function ChoiceCard({
  title,
  description,
  icon,
  className,
  ...inputProps
}: ComponentPropsWithoutRef<"input"> & {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <label
      className={cn(
        "group relative flex cursor-pointer items-start gap-4 rounded-2xl bg-white p-4 ring-1 ring-line-strong transition-[box-shadow,background-color] duration-150 sm:p-5",
        "hover:ring-ink/30 has-[:checked]:bg-surface has-[:checked]:ring-2 has-[:checked]:ring-ink",
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink",
        className,
      )}
    >
      <input type="radio" className="sr-only" {...inputProps} />
      {icon ? (
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface text-ink transition-colors group-has-[:checked]:bg-ink group-has-[:checked]:text-white">
          {icon}
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-ink">{title}</span>
        {description ? (
          <span className="mt-1 block text-sm leading-snug text-muted">{description}</span>
        ) : null}
      </span>
      <span
        aria-hidden
        className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ring-1 ring-line-strong transition-colors group-has-[:checked]:bg-ink group-has-[:checked]:ring-ink"
      >
        <span className="size-2 rounded-full bg-white opacity-0 transition-opacity group-has-[:checked]:opacity-100" />
      </span>
    </label>
  );
}

/** Pill-shaped option backed by a native checkbox or radio input. */
export function ChoiceChip({
  label,
  type = "checkbox",
  className,
  ...inputProps
}: ComponentPropsWithoutRef<"input"> & { label: ReactNode }) {
  return (
    <label
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[0.9375rem] font-medium text-ink-soft ring-1 ring-line-strong transition-[box-shadow,background-color,color] duration-150 select-none",
        "hover:ring-ink/30 has-[:checked]:bg-surface has-[:checked]:text-ink has-[:checked]:ring-2 has-[:checked]:ring-ink",
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink",
        className,
      )}
    >
      <input type={type} className="sr-only" {...inputProps} />
      {label}
    </label>
  );
}

export function Stepper({
  value,
  onChange,
  min,
  max,
  decreaseLabel,
  increaseLabel,
  labelledBy,
}: {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  decreaseLabel: string;
  increaseLabel: string;
  labelledBy: string;
}) {
  const buttonClass =
    "grid size-11 place-items-center rounded-xl text-ink transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent";
  return (
    <div
      role="group"
      aria-labelledby={labelledBy}
      className="inline-flex items-center gap-2 rounded-2xl p-1 ring-1 ring-line-strong"
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        className={buttonClass}
      >
        <Minus aria-hidden className="size-4" />
        <span className="sr-only">{decreaseLabel}</span>
      </button>
      <output aria-live="polite" className="w-10 text-center text-lg font-semibold text-ink tabular-nums">
        {value}
      </output>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        className={buttonClass}
      >
        <Plus aria-hidden className="size-4" />
        <span className="sr-only">{increaseLabel}</span>
      </button>
    </div>
  );
}
