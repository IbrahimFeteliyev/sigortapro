"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { MAX_TRAVELERS, travelDestinations } from "@/data/form-options";
import { daysBetweenInclusive } from "@/lib/date";
import { formatName, formatPhone } from "@/lib/input-format";
import { cn } from "@/lib/utils";
import { normalizeAzPhone } from "@/lib/validation/fields";
import { travelSchema, type TravelValues } from "@/lib/validation/schemas";
import { FormOutcome } from "./FormOutcome";
import {
  ConsentInput,
  DateInput,
  DemoNote,
  ErrorNotice,
  RequiredHint,
  SelectInput,
  StepperInput,
  SubmitButton,
  SubmitError,
  TextInput,
  useToday,
} from "./kit";
import { useApplication } from "./use-application";

const defaults: TravelValues = {
  destination: "",
  startDate: "",
  endDate: "",
  travelers: 1,
  fullName: "",
  phone: "",
  email: "",
  consent: false,
};

/** az dates as dd.mm.yyyy — browsers ship incomplete Intl data for `az`. */
const displayDate = (iso: string) => iso.split("-").reverse().join(".");

export function TravelForm({ productName }: { productName: string }) {
  const t = useTranslations("Forms");
  const tt = useTranslations("Forms.travel");
  const locale = useLocale();
  const app = useApplication("travel", "travel");
  const today = useToday();
  const [showErrors, setShowErrors] = useState(false);
  const methods = useForm<TravelValues>({
    resolver: zodResolver(travelSchema),
    defaultValues: defaults,
    mode: "onTouched",
  });
  const [startDate, endDate] = useWatch({ control: methods.control, name: ["startDate", "endDate"] });
  const days = daysBetweenInclusive(startDate, endDate);

  if (app.status === "demo" || app.status === "submitted") {
    return (
      <FormOutcome
        status={app.status}
        reference={app.reference}
        productName={productName}
        rows={app.summary}
        onRestart={() => {
          methods.reset(defaults);
          app.reset();
        }}
      />
    );
  }

  const onValid = (v: TravelValues) => {
    const duration = daysBetweenInclusive(v.startDate, v.endDate) ?? 0;
    void app.submit({ ...v, durationDays: duration, phone: normalizeAzPhone(v.phone) }, [
      {
        label: tt("destination"),
        value: travelDestinations.find((d) => d.id === v.destination)?.name[locale] ?? v.destination,
      },
      { label: tt("startDate"), value: displayDate(v.startDate) },
      { label: tt("endDate"), value: displayDate(v.endDate) },
      { label: tt("duration"), value: tt("durationValue", { count: duration }) },
      { label: tt("travelers"), value: String(v.travelers) },
      { label: t("fullName"), value: v.fullName },
      { label: t("phone"), value: v.phone },
      ...(v.email ? [{ label: t("email"), value: v.email }] : []),
    ]);
  };

  return (
    <FormProvider {...methods}>
      <form
        noValidate
        onSubmit={methods.handleSubmit(onValid, () => setShowErrors(true))}
        className="space-y-4"
      >
        <ErrorNotice show={showErrors} />
        <SelectInput
          name="destination"
          label={tt("destination")}
          options={travelDestinations.map((d) => ({ value: d.id, label: d.name[locale] }))}
          required
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <DateInput name="startDate" label={tt("startDate")} min={today} required />
          <DateInput name="endDate" label={tt("endDate")} min={startDate || today} required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-ink">{tt("duration")}</p>
            <div className="mt-2 flex h-13 items-center gap-3 rounded-2xl bg-surface px-4">
              <CalendarDays aria-hidden className="size-5 text-brand-600" />
              <AnimatePresence mode="wait" initial={false}>
                <m.span
                  key={days ?? "empty"}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.16 }}
                  aria-live="polite"
                  className={cn("font-semibold", days ? "text-ink" : "text-muted")}
                >
                  {days ? tt("durationValue", { count: days }) : tt("durationEmpty")}
                </m.span>
              </AnimatePresence>
            </div>
            <p className="mt-2 text-xs text-muted">{tt("durationHint")}</p>
          </div>
          <StepperInput name="travelers" label={tt("travelers")} min={1} max={MAX_TRAVELERS} />
        </div>
        <div className="grid gap-4 border-t border-line pt-4 sm:grid-cols-2">
          <TextInput
            name="fullName"
            label={t("fullName")}
            placeholder={t("fullNamePlaceholder")}
            autoComplete="name"
            format={formatName}
            required
            className="sm:col-span-2"
          />
          <TextInput
            name="phone"
            type="tel"
            label={t("phone")}
            placeholder={t("phonePlaceholder")}
            inputMode="tel"
            autoComplete="tel"
            format={formatPhone}
            required
          />
          <TextInput
            name="email"
            type="email"
            label={t("email")}
            placeholder={t("emailPlaceholder")}
            inputMode="email"
            autoComplete="email"
            maxLength={120}
          />
        </div>
        <ConsentInput />
        <RequiredHint />
        <SubmitError show={app.status === "error"} onRetry={app.retry} />
        <SubmitButton submitting={app.status === "submitting"} className="sm:w-full">
          {t("submit")}
        </SubmitButton>
        <DemoNote />
      </form>
    </FormProvider>
  );
}
