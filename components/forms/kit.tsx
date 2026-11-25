"use client";

import { CircleAlert, FlaskConical, LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useSyncExternalStore, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { Controller, useFormContext, type FieldValues } from "react-hook-form";
import { buttonStyles } from "@/components/ui/button";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Link } from "@/i18n/navigation";
import { isDemoMode } from "@/lib/api/config";
import { todayISO } from "@/lib/date";
import { cn } from "@/lib/utils";
import { isValidationKey } from "@/lib/validation/fields";
import { controlClass, describedBy, Field, FieldGroup, Stepper } from "./fields";

/** Localized error message for a field, or undefined. */
export function useFieldError(name: string): string | undefined {
  const {
    formState: { errors },
  } = useFormContext<FieldValues>();
  const t = useTranslations("Validation");
  const message = errors[name]?.message;
  if (!message) return undefined;
  return t(isValidationKey(message) ? message : "required");
}

type InputProps = Omit<
  ComponentPropsWithoutRef<"input">,
  "name" | "id" | "value" | "onChange" | "onBlur" | "children"
>;

/** Text input with optional mask (`format` runs on every keystroke). */
export function TextInput({
  name,
  label,
  required,
  hint,
  format,
  className,
  ...inputProps
}: InputProps & {
  name: string;
  label: string;
  required?: boolean;
  hint?: ReactNode;
  format?: (value: string) => string;
}) {
  const t = useTranslations("Forms");
  const { control } = useFormContext();
  const error = useFieldError(name);
  const id = `field-${name}`;

  return (
    <Field
      id={id}
      label={label}
      required={required}
      optionalLabel={t("optional")}
      hint={hint}
      error={error}
      className={className}
    >
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <input
            id={id}
            type="text"
            {...inputProps}
            ref={field.ref}
            name={field.name}
            value={(field.value as string) ?? ""}
            onChange={(event) => field.onChange(format ? format(event.target.value) : event.target.value)}
            onBlur={field.onBlur}
            aria-required={required || undefined}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy(id, { hint, error })}
            className={controlClass(Boolean(error))}
          />
        )}
      />
    </Field>
  );
}

export function SelectInput({
  name,
  label,
  options,
  required,
  hint,
  className,
}: {
  name: string;
  label: string;
  options: SelectOption[];
  required?: boolean;
  hint?: ReactNode;
  className?: string;
}) {
  const t = useTranslations("Forms");
  const { control } = useFormContext();
  const error = useFieldError(name);
  const id = `field-${name}`;

  return (
    <Field
      id={id}
      label={label}
      required={required}
      optionalLabel={t("optional")}
      hint={hint}
      error={error}
      className={className}
    >
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            id={id}
            value={String(field.value ?? "")}
            onChange={field.onChange}
            onBlur={field.onBlur}
            options={options}
            placeholder={t("selectPlaceholder")}
            invalid={Boolean(error)}
            aria-labelledby={`${id}-label`}
            aria-describedby={describedBy(id, { hint, error })}
          />
        )}
      />
    </Field>
  );
}

const noopSubscribe = () => () => {};

/** Today's date on the client, empty during prerender (no `min` in static HTML). */
export function useToday() {
  return useSyncExternalStore(noopSubscribe, todayISO, () => "");
}

export function DateInput({
  name,
  label,
  min,
  required,
}: {
  name: string;
  label: string;
  min?: string;
  required?: boolean;
}) {
  const { register } = useFormContext();
  const error = useFieldError(name);
  const id = `field-${name}`;
  return (
    <Field id={id} label={label} required={required} error={error}>
      <input
        id={id}
        type="date"
        min={min || undefined}
        {...register(name)}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, { error })}
        className={controlClass(Boolean(error))}
      />
    </Field>
  );
}

export function StepperInput({
  name,
  label,
  min,
  max,
}: {
  name: string;
  label: string;
  min: number;
  max: number;
}) {
  const t = useTranslations("Forms");
  const { control } = useFormContext();
  const labelId = useId();
  const error = useFieldError(name);
  return (
    <div>
      <p id={labelId} className="text-sm font-semibold text-ink">
        {label}
        <span aria-hidden className="ml-0.5 text-danger-600">
          *
        </span>
      </p>
      <div className="mt-2">
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <Stepper
              value={field.value as number}
              onChange={(value) => field.onChange(Math.min(max, Math.max(min, value)))}
              min={min}
              max={max}
              decreaseLabel={t("decrease")}
              increaseLabel={t("increase")}
              labelledBy={labelId}
            />
          )}
        />
      </div>
      {error ? <p className="mt-2 text-sm font-medium text-danger-700">{error}</p> : null}
    </div>
  );
}

/** Large checkbox row (e.g. "Used as a taxi", add-ons). */
export function CheckboxInput({
  name,
  value,
  label,
  description,
  aside,
  className,
}: {
  name: string;
  /** Set for checkbox groups (array values). */
  value?: string;
  label: ReactNode;
  description?: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  const { register } = useFormContext();
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3.5 rounded-2xl bg-white p-4 ring-1 ring-line-strong transition-[box-shadow,background-color] hover:ring-ink/30",
        "has-[:checked]:bg-brand-50/60 has-[:checked]:ring-2 has-[:checked]:ring-brand-600",
        className,
      )}
    >
      <input
        type="checkbox"
        value={value}
        {...register(name)}
        className="mt-0.5 size-5 shrink-0 cursor-pointer accent-brand-600"
      />
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-ink">{label}</span>
        {description ? (
          <span className="mt-1 block text-sm leading-snug text-muted">{description}</span>
        ) : null}
      </span>
      {aside ? <span className="shrink-0 text-sm font-semibold text-ink">{aside}</span> : null}
    </label>
  );
}

export function ConsentInput() {
  const t = useTranslations("Forms");
  const { register } = useFormContext();
  const error = useFieldError("consent");
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-surface p-4 text-[0.9375rem] leading-relaxed text-ink-soft">
        <input
          type="checkbox"
          {...register("consent")}
          aria-required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "field-consent-error" : undefined}
          className="mt-0.5 size-5 shrink-0 cursor-pointer accent-brand-600"
        />
        <span>
          {t.rich("consent", {
            link: (chunks) => (
              <Link
                href="/privacy-policy"
                target="_blank"
                className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
              >
                {chunks}
              </Link>
            ),
          })}
          <span aria-hidden className="ml-0.5 text-danger-600">
            *
          </span>
        </span>
      </label>
      {error ? (
        <p id="field-consent-error" className="mt-2 text-sm font-medium text-danger-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Radio-card group bound to a form field. */
export function ChoiceGroup({
  name,
  legend,
  options,
  columns = 2,
}: {
  name: string;
  legend: string;
  options: { value: string; title: string; description?: string; icon?: ReactNode }[];
  columns?: 1 | 2 | 3;
}) {
  const { register } = useFormContext();
  const error = useFieldError(name);
  return (
    <FieldGroup id={`field-${name}`} legend={legend} required error={error}>
      <div className={cn("grid gap-3", columns === 3 && "sm:grid-cols-3", columns === 2 && "sm:grid-cols-2")}>
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              "group flex cursor-pointer items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-line-strong transition-[box-shadow,background-color] hover:ring-ink/30",
              "has-[:checked]:bg-brand-50/60 has-[:checked]:ring-2 has-[:checked]:ring-brand-600",
              "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-600",
            )}
          >
            <input type="radio" value={option.value} {...register(name)} className="sr-only" />
            {option.icon ? (
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface text-brand-700 group-has-[:checked]:bg-brand-gradient group-has-[:checked]:text-white">
                {option.icon}
              </span>
            ) : null}
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-ink">{option.title}</span>
              {option.description ? (
                <span className="mt-1 block text-sm leading-snug text-muted">{option.description}</span>
              ) : null}
            </span>
            <span
              aria-hidden
              className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ring-1 ring-line-strong group-has-[:checked]:bg-brand-600 group-has-[:checked]:ring-brand-600"
            >
              <span className="size-2 rounded-full bg-white opacity-0 group-has-[:checked]:opacity-100" />
            </span>
          </label>
        ))}
      </div>
    </FieldGroup>
  );
}

/* -------------------------------------------------------------------------- */
/*  Layout helpers                                                            */
/* -------------------------------------------------------------------------- */

export function RequiredHint() {
  const t = useTranslations("Forms");
  return <p className="text-xs text-muted">{t("requiredHint")}</p>;
}

export function ErrorNotice({ show }: { show: boolean }) {
  const t = useTranslations("Forms");
  const {
    formState: { errors },
  } = useFormContext();
  if (!show || Object.keys(errors).length === 0) return null;
  return (
    <div
      role="alert"
      className="flex items-center gap-2.5 rounded-2xl bg-danger-50 px-4 py-3 text-sm font-medium text-danger-700"
    >
      <CircleAlert aria-hidden className="size-4 shrink-0" />
      {t("fixErrors")}
    </div>
  );
}

export function SubmitButton({
  submitting,
  children,
  className,
}: {
  submitting: boolean;
  children: ReactNode;
  className?: string;
}) {
  const t = useTranslations("Forms");
  return (
    <button
      type="submit"
      disabled={submitting}
      aria-busy={submitting || undefined}
      className={buttonStyles({ size: "lg", className: cn("w-full sm:w-auto sm:min-w-44", className) })}
    >
      {submitting ? (
        <>
          <LoaderCircle aria-hidden className="size-4 animate-spin" />
          {t("submitting")}
        </>
      ) : (
        children
      )}
    </button>
  );
}

/** Small notice that the form runs in demonstration mode (Phase 1). */
export function DemoNote() {
  const t = useTranslations("Forms");
  if (!isDemoMode) return null;
  return (
    <p className="flex items-start gap-2 text-xs leading-relaxed text-muted">
      <FlaskConical aria-hidden className="mt-0.5 size-3.5 shrink-0 text-brand-600" />
      {t("demoNote")}
    </p>
  );
}

export function SubmitError({ show, onRetry }: { show: boolean; onRetry?: () => void }) {
  const t = useTranslations("Forms");
  if (!show) return null;
  return (
    <div role="alert" className="rounded-2xl bg-danger-50 p-4 text-sm text-danger-700">
      <p className="font-semibold">{t("errorTitle")}</p>
      <p className="mt-1">{t("errorText")}</p>
      {onRetry ? (
        <button type="button" onClick={onRetry} className="mt-2 font-semibold underline underline-offset-2">
          {t("retry")}
        </button>
      ) : null}
    </div>
  );
}
