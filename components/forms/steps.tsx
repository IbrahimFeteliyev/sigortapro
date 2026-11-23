"use client";

import { CalendarDays, Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useSyncExternalStore, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { ProductIcon } from "@/components/insurance/ProductIcon";
import { Select } from "@/components/ui/Select";
import { Link } from "@/i18n/navigation";
import { daysBetweenInclusive, todayISO } from "@/lib/date";
import { cn } from "@/lib/utils";
import {
  CASCO_COVERAGE,
  LIFE_TERMS,
  MAX_TRAVELERS,
  PROPERTY_COVERAGE,
  PROPERTY_TYPES,
  VEHICLE_TYPES,
  type ApplicationFormValues,
} from "@/lib/validation/application";
import { ChoiceCard, ChoiceChip, controlClass, describedBy, Field, FieldGroup, Stepper } from "./fields";
import { useFieldErrors, type FieldName, type FormProduct, type SummarySection } from "./form-utils";

/* -------------------------------------------------------------------------- */
/*  Generic connected fields                                                  */
/* -------------------------------------------------------------------------- */

type InputProps = Omit<ComponentPropsWithoutRef<"input">, "name" | "id">;

function TextField({
  name,
  label,
  required,
  hint,
  className,
  ...inputProps
}: InputProps & { name: FieldName; label: string; required?: boolean; hint?: ReactNode }) {
  const t = useTranslations("ApplyForm");
  const { register } = useFormContext<ApplicationFormValues>();
  const error = useFieldErrors()(name);
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
      <input
        id={id}
        type="text"
        {...inputProps}
        {...register(name)}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, { hint, error })}
        className={controlClass(Boolean(error))}
      />
    </Field>
  );
}

function SelectField({
  name,
  label,
  options,
  required,
}: {
  name: FieldName;
  label: string;
  options: { value: string; label: string }[];
  required?: boolean;
}) {
  const t = useTranslations("ApplyForm");
  const { control } = useFormContext<ApplicationFormValues>();
  const error = useFieldErrors()(name);
  const id = `field-${name}`;

  return (
    <Field id={id} label={label} required={required} optionalLabel={t("optional")} error={error}>
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
            aria-describedby={describedBy(id, { error })}
          />
        )}
      />
    </Field>
  );
}

/* -------------------------------------------------------------------------- */
/*  Step 1 — insurance type                                                   */
/* -------------------------------------------------------------------------- */

export function StepType({ products }: { products: FormProduct[] }) {
  const t = useTranslations("ApplyForm");
  const { register } = useFormContext<ApplicationFormValues>();
  const error = useFieldErrors()("insuranceType");

  return (
    <FieldGroup id="field-insuranceType" legend={t("fields.insuranceType")} required error={error}>
      <div className="grid gap-3 sm:grid-cols-2">
        {products.map((product) => (
          <ChoiceCard
            key={product.slug}
            value={product.slug}
            {...register("insuranceType")}
            title={product.name}
            description={product.shortDescription}
            icon={<ProductIcon slug={product.slug} className="size-5" />}
          />
        ))}
      </div>
    </FieldGroup>
  );
}

/* -------------------------------------------------------------------------- */
/*  Step 2 — product-specific details                                         */
/* -------------------------------------------------------------------------- */

const noopSubscribe = () => () => {};

function useToday() {
  // Empty on the server (no `min` attribute in static HTML), today's date on the client.
  return useSyncExternalStore(noopSubscribe, todayISO, () => "");
}

function CarFields() {
  const t = useTranslations("ApplyForm");
  return (
    <div className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          name="registrationNumber"
          label={t("fields.registrationNumber")}
          placeholder={t("fields.registrationNumberPlaceholder")}
          autoComplete="off"
          autoCapitalize="characters"
          maxLength={12}
          required
        />
        <TextField
          name="year"
          label={t("fields.year")}
          placeholder={t("fields.yearPlaceholder")}
          inputMode="numeric"
          maxLength={4}
          required
        />
        <TextField
          name="brandModel"
          label={t("fields.brandModel")}
          placeholder={t("fields.brandModelPlaceholder")}
          className="sm:col-span-2"
          required
        />
      </div>
      <div className="border-t border-line pt-7">
        <p className="text-base font-semibold text-ink">{t("fields.technicalDetails")}</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <SelectField
            name="vehicleType"
            label={t("fields.vehicleType")}
            options={VEHICLE_TYPES.map((value) => ({ value, label: t(`options.vehicleType.${value}`) }))}
            required
          />
          <TextField
            name="engineVolume"
            label={t("fields.engineVolume")}
            placeholder={t("fields.engineVolumePlaceholder")}
            inputMode="numeric"
            maxLength={5}
          />
        </div>
      </div>
    </div>
  );
}

function CascoFields() {
  const t = useTranslations("ApplyForm");
  const { register } = useFormContext<ApplicationFormValues>();
  const coverageError = useFieldErrors()("cascoCoverage");

  return (
    <div className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          name="brandModel"
          label={t("fields.brandModel")}
          placeholder={t("fields.brandModelPlaceholder")}
          className="sm:col-span-2"
          required
        />
        <TextField
          name="year"
          label={t("fields.year")}
          placeholder={t("fields.yearPlaceholder")}
          inputMode="numeric"
          maxLength={4}
          required
        />
        <TextField
          name="vehicleValue"
          label={t("fields.vehicleValue")}
          placeholder={t("fields.vehicleValuePlaceholder")}
          inputMode="decimal"
          maxLength={12}
          required
        />
      </div>
      <FieldGroup id="field-cascoCoverage" legend={t("fields.cascoCoverage")} required error={coverageError}>
        <div className="grid gap-3 sm:grid-cols-2">
          {CASCO_COVERAGE.map((value) => (
            <ChoiceCard
              key={value}
              value={value}
              {...register("cascoCoverage")}
              title={t(`options.cascoCoverage.${value}`)}
              description={t(`options.cascoCoverageHint.${value}`)}
            />
          ))}
        </div>
      </FieldGroup>
    </div>
  );
}

function TravelFields() {
  const t = useTranslations("ApplyForm");
  const { register, control } = useFormContext<ApplicationFormValues>();
  const errors = useFieldErrors();
  const today = useToday();
  const [startDate, endDate] = useWatch<ApplicationFormValues, ["startDate", "endDate"]>({
    name: ["startDate", "endDate"],
  });
  const days = daysBetweenInclusive(startDate, endDate);
  const travelersLabelId = useId();

  const dateField = (name: "startDate" | "endDate", min?: string) => {
    const id = `field-${name}`;
    const error = errors(name);
    return (
      <Field id={id} label={t(`fields.${name}`)} required error={error}>
        <div className="relative">
          <input
            id={id}
            type="date"
            min={min || undefined}
            {...register(name)}
            aria-required
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy(id, { error })}
            className={controlClass(Boolean(error), "pr-4")}
          />
        </div>
      </Field>
    );
  };

  return (
    <div className="space-y-8">
      <TextField
        name="destination"
        label={t("fields.destination")}
        placeholder={t("fields.destinationPlaceholder")}
        autoComplete="country-name"
        required
      />
      <div className="grid gap-5 sm:grid-cols-2">
        {dateField("startDate", today)}
        {dateField("endDate", startDate || today)}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <p id={travelersLabelId} className="text-sm font-semibold text-ink">
            {t("fields.travelers")}
            <span aria-hidden className="ml-0.5 text-danger-600">
              *
            </span>
          </p>
          <div className="mt-2">
            <Controller
              control={control}
              name="travelers"
              render={({ field }) => (
                <Stepper
                  value={field.value}
                  onChange={(value) => field.onChange(Math.min(MAX_TRAVELERS, Math.max(1, value)))}
                  min={1}
                  max={MAX_TRAVELERS}
                  decreaseLabel={t("fields.decrease")}
                  increaseLabel={t("fields.increase")}
                  labelledBy={travelersLabelId}
                />
              )}
            />
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">{t("fields.duration")}</p>
          <div className="mt-2 flex h-13 items-center gap-3 rounded-2xl bg-surface px-4">
            <CalendarDays aria-hidden className="size-5 text-brand-600" />
            <span aria-live="polite" className={cn("font-semibold", days ? "text-ink" : "text-muted")}>
              {days ? t("fields.durationValue", { count: days }) : t("fields.durationEmpty")}
            </span>
          </div>
          <p className="mt-2 text-sm text-muted">{t("fields.durationHint")}</p>
        </div>
      </div>
    </div>
  );
}

function PropertyFields() {
  const t = useTranslations("ApplyForm");
  const { register } = useFormContext<ApplicationFormValues>();
  const coverageError = useFieldErrors()("propertyCoverage");

  return (
    <div className="space-y-8">
      <TextField
        name="propertyAddress"
        label={t("fields.propertyAddress")}
        placeholder={t("fields.propertyAddressPlaceholder")}
        autoComplete="street-address"
        required
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          name="propertyType"
          label={t("fields.propertyType")}
          options={PROPERTY_TYPES.map((value) => ({ value, label: t(`options.propertyType.${value}`) }))}
          required
        />
        <TextField
          name="propertyValue"
          label={t("fields.propertyValue")}
          placeholder={t("fields.propertyValuePlaceholder")}
          inputMode="decimal"
          maxLength={14}
          required
        />
      </div>
      <FieldGroup
        id="field-propertyCoverage"
        legend={t("fields.propertyCoverage")}
        hint={t("fields.propertyCoverageHint")}
        required
        error={coverageError}
      >
        <div className="flex flex-wrap gap-2.5">
          {PROPERTY_COVERAGE.map((value) => (
            <ChoiceChip
              key={value}
              value={value}
              {...register("propertyCoverage")}
              label={t(`options.propertyCoverage.${value}`)}
            />
          ))}
        </div>
      </FieldGroup>
    </div>
  );
}

function LifeFields() {
  const t = useTranslations("ApplyForm");
  const { register } = useFormContext<ApplicationFormValues>();
  const termError = useFieldErrors()("lifeTerm");

  return (
    <div className="space-y-8">
      <TextField
        name="age"
        label={t("fields.age")}
        placeholder={t("fields.agePlaceholder")}
        inputMode="numeric"
        maxLength={3}
        className="max-w-xs"
        required
      />
      <FieldGroup id="field-lifeTerm" legend={t("fields.lifeTerm")} required error={termError}>
        <div className="flex flex-wrap gap-2.5">
          {LIFE_TERMS.map((value) => (
            <ChoiceChip
              key={value}
              type="radio"
              value={value}
              {...register("lifeTerm")}
              label={t(`options.lifeTerm.${value}`)}
            />
          ))}
        </div>
      </FieldGroup>
    </div>
  );
}

export function StepDetails() {
  const insuranceType = useWatch<ApplicationFormValues, "insuranceType">({ name: "insuranceType" });

  switch (insuranceType) {
    case "car-insurance":
      return <CarFields />;
    case "casco":
      return <CascoFields />;
    case "travel":
      return <TravelFields />;
    case "property":
      return <PropertyFields />;
    case "life":
      return <LifeFields />;
    default:
      return null;
  }
}

/* -------------------------------------------------------------------------- */
/*  Step 3 — contact                                                          */
/* -------------------------------------------------------------------------- */

export function StepContact() {
  const t = useTranslations("ApplyForm");
  const { register } = useFormContext<ApplicationFormValues>();
  const errors = useFieldErrors();
  const infoError = errors("additionalInfo");
  const consentError = errors("consent");

  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          name="fullName"
          label={t("fields.fullName")}
          placeholder={t("fields.fullNamePlaceholder")}
          autoComplete="name"
          className="sm:col-span-2"
          required
        />
        <TextField
          name="phone"
          type="tel"
          label={t("fields.phone")}
          placeholder={t("fields.phonePlaceholder")}
          hint={t("fields.phoneHint")}
          autoComplete="tel"
          inputMode="tel"
          required
        />
        <TextField
          name="email"
          type="email"
          label={t("fields.email")}
          placeholder={t("fields.emailPlaceholder")}
          autoComplete="email"
          inputMode="email"
        />
      </div>

      <Field
        id="field-additionalInfo"
        label={t("fields.additionalInfo")}
        optionalLabel={t("optional")}
        error={infoError}
      >
        <textarea
          id="field-additionalInfo"
          rows={4}
          maxLength={1000}
          placeholder={t("fields.additionalInfoPlaceholder")}
          {...register("additionalInfo")}
          aria-invalid={infoError ? true : undefined}
          aria-describedby={describedBy("field-additionalInfo", { error: infoError })}
          className={controlClass(Boolean(infoError), "h-auto resize-y py-3.5 leading-relaxed")}
        />
      </Field>

      <div>
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-surface p-4 text-[0.9375rem] leading-relaxed text-ink-soft">
          <input
            type="checkbox"
            {...register("consent")}
            aria-required
            aria-invalid={consentError ? true : undefined}
            aria-describedby={consentError ? "field-consent-error" : undefined}
            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-brand-600"
          />
          <span>
            {t.rich("fields.consent", {
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
        {consentError ? (
          <p id="field-consent-error" className="mt-2 text-sm font-medium text-danger-700">
            {consentError}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Step 4 — review                                                           */
/* -------------------------------------------------------------------------- */

export function StepReview({
  sections,
  onEdit,
}: {
  sections: SummarySection[];
  onEdit: (step: number) => void;
}) {
  const t = useTranslations("ApplyForm");

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <section
          key={section.key}
          aria-labelledby={`review-${section.key}`}
          className="rounded-2xl ring-1 ring-line"
        >
          <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3.5">
            <h3 id={`review-${section.key}`} className="text-base font-semibold text-ink">
              {section.title}
            </h3>
            <button
              type="button"
              onClick={() => onEdit(section.step)}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
            >
              <Pencil aria-hidden className="size-3.5" />
              {t("edit")}
              <span className="sr-only">: {section.title}</span>
            </button>
          </div>
          <dl className="divide-y divide-line">
            {section.rows.map((row) => (
              <div
                key={row.label}
                className="grid gap-1 px-5 py-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-4"
              >
                <dt className="text-sm text-muted">{row.label}</dt>
                <dd className="text-[0.9375rem] font-medium break-words whitespace-pre-line text-ink">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
