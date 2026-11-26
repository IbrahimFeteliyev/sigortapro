"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Building2, UserRound } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { formatAzn } from "@/lib/format";
import { useCallback, useRef, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { buttonStyles } from "@/components/ui/button";
import {
  carAddons,
  documentFormats,
  engineCapacities,
  idCardSeries,
  personTypes,
  vehicleTypes,
} from "@/data/form-options";
import { formatDigits, formatFin, formatPhone, formatPlate, formatSeriesNumber } from "@/lib/input-format";
import { cn } from "@/lib/utils";
import { normalizeAzPhone } from "@/lib/validation/fields";
import { carInsuranceSchema, carInsuranceSteps, type CarInsuranceValues } from "@/lib/validation/schemas";
import { FormOutcome } from "./FormOutcome";
import {
  CheckboxInput,
  ChoiceGroup,
  ConsentInput,
  DemoNote,
  ErrorNotice,
  RequiredHint,
  SelectInput,
  SubmitError,
  TextInput,
} from "./kit";
import { useApplication, type SummaryRow } from "./use-application";

const defaults: CarInsuranceValues = {
  vehicleType: "",
  engineCapacity: "",
  year: "",
  personType: "individual",
  phone: "",
  email: "",
  fin: "",
  idSeries: "AA",
  idNumber: "",
  voen: "",
  plate: "",
  registrationCertificate: "",
  drivingLicence: "",
  taxi: false,
  addons: [],
  consent: false,
};

const LAST = carInsuranceSteps.length - 1;

export function CarInsuranceForm({ productName }: { productName: string }) {
  const t = useTranslations("Forms");
  const tc = useTranslations("Forms.car");
  const locale = useLocale();
  const app = useApplication("car-insurance", "car-insurance");
  const methods = useForm<CarInsuranceValues>({
    resolver: zodResolver(carInsuranceSchema),
    defaultValues: defaults,
    mode: "onTouched",
  });
  const { control, trigger, setValue, getValues, handleSubmit, reset } = methods;
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showErrors, setShowErrors] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const focusNext = useRef(false);

  const [personType, idSeries, selectedAddons] = useWatch({
    control,
    name: ["personType", "idSeries", "addons"],
  });
  const series = idCardSeries.find((s) => s.id === idSeries) ?? idCardSeries[1];
  const isLegal = personType === "legal";

  const headingRef = useCallback((node: HTMLHeadingElement | null) => {
    if (node && focusNext.current) {
      focusNext.current = false;
      node.focus({ preventScroll: true });
    }
  }, []);

  const goTo = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setShowErrors(false);
    focusNext.current = true;
    setStep(next);
    const top = rootRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 80) rootRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  };

  const goNext = async () => {
    const fields = [...carInsuranceSteps[step]];
    const valid = await trigger(fields, { shouldFocus: true });
    if (!valid) {
      for (const name of fields) setValue(name, getValues(name) as never, { shouldTouch: true });
      setShowErrors(true);
      return;
    }
    goTo(step + 1);
  };

  const loc = <T extends { id: string; name: Record<string, string> }>(list: readonly T[]) =>
    list.map((item) => ({ value: item.id, label: item.name[locale] }));

  /* Add-on total — only when every selected add-on has a verified price. */
  const chosen = carAddons.filter((addon) => (selectedAddons ?? []).includes(addon.id));
  const allPriced = chosen.every((addon) => addon.price !== null);
  const total = chosen.reduce((sum, addon) => sum + (addon.price?.amount ?? 0), 0);
  const totalLabel =
    chosen.length === 0 ? tc("totalNone") : allPriced ? formatAzn(total, locale) : tc("totalUnavailable");

  const onValid = (values: CarInsuranceValues) => {
    const label = (list: readonly { id: string; name: Record<string, string> }[], id: string) =>
      list.find((item) => item.id === id)?.name[locale] ?? id;
    const rows: SummaryRow[] = [
      { label: tc("vehicleType"), value: label(vehicleTypes, values.vehicleType) },
      { label: tc("engineCapacity"), value: label(engineCapacities, values.engineCapacity) },
      { label: tc("year"), value: values.year },
      { label: tc("personType"), value: label(personTypes, values.personType) },
      { label: t("phone"), value: values.phone },
      ...(values.email ? [{ label: t("email"), value: values.email }] : []),
      ...(isLegal
        ? [{ label: tc("voen"), value: values.voen, sensitive: true }]
        : [
            { label: tc("fin"), value: values.fin, sensitive: true },
            { label: tc("idDocument"), value: `${values.idSeries} ${values.idNumber}`, sensitive: true },
            { label: tc("drivingLicence"), value: values.drivingLicence, sensitive: true },
          ]),
      { label: tc("plate"), value: values.plate },
      { label: tc("registrationCertificate"), value: values.registrationCertificate, sensitive: true },
      { label: tc("taxi"), value: values.taxi ? t("yes") : t("no") },
      { label: tc("addonsTitle"), value: chosen.map((a) => a.name).join(", ") || t("none") },
    ];
    const data = {
      ...values,
      phone: normalizeAzPhone(values.phone),
      ...(isLegal ? { fin: "", idSeries: "", idNumber: "", drivingLicence: "" } : { voen: "" }),
    };
    void app.submit(data, rows);
  };

  if (app.status === "demo" || app.status === "submitted") {
    return (
      <FormOutcome
        status={app.status}
        reference={app.reference}
        productName={productName}
        rows={app.summary}
        onRestart={() => {
          reset(defaults);
          setStep(0);
          app.reset();
        }}
      />
    );
  }

  const stepLabels = [tc("stepVehicle"), tc("stepOwner"), tc("stepAddons")];

  return (
    <FormProvider {...methods}>
      <div ref={rootRef} className="scroll-mt-28">
        {/* Progress */}
        <ol className="grid grid-cols-3 gap-2">
          {stepLabels.map((label, index) => (
            <li key={label} aria-current={index === step ? "step" : undefined}>
              <span className="block h-1.5 overflow-hidden rounded-full bg-line">
                <m.span
                  className="block h-full rounded-full bg-brand-900"
                  initial={false}
                  animate={{ width: index <= step ? "100%" : "0%" }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                />
              </span>
              <span
                className={cn(
                  "mt-2 block text-xs leading-tight font-medium sm:text-[0.8125rem]",
                  index === step ? "text-ink" : "text-muted",
                )}
              >
                {label}
              </span>
            </li>
          ))}
        </ol>
        <p aria-live="polite" className="sr-only">
          {t("progress", { current: step + 1, total: stepLabels.length })}
        </p>

        <form
          noValidate
          className="mt-6"
          onSubmit={(event) => {
            if (step < LAST) {
              event.preventDefault();
              void goNext();
            } else {
              void handleSubmit(onValid, () => setShowErrors(true))(event);
            }
          }}
        >
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <m.div
              key={step}
              custom={direction}
              initial={{ opacity: 0, x: direction * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -24 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-5"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 ref={headingRef} tabIndex={-1} className="text-lg font-semibold text-ink outline-none">
                  {stepLabels[step]}
                </h3>
                <span className="text-xs font-medium text-muted">
                  {t("progress", { current: step + 1, total: stepLabels.length })}
                </span>
              </div>
              <ErrorNotice show={showErrors} />

              {step === 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <SelectInput
                    name="vehicleType"
                    label={tc("vehicleType")}
                    options={loc(vehicleTypes)}
                    required
                    className="sm:col-span-2"
                  />
                  <SelectInput
                    name="engineCapacity"
                    label={tc("engineCapacity")}
                    options={loc(engineCapacities)}
                    required
                  />
                  <TextInput
                    name="year"
                    label={tc("year")}
                    placeholder={tc("yearPlaceholder")}
                    inputMode="numeric"
                    autoComplete="off"
                    format={(v) => formatDigits(v, 4)}
                    required
                  />
                </div>
              ) : null}

              {step === 1 ? (
                <div className="space-y-4">
                  <ChoiceGroup
                    name="personType"
                    legend={tc("personType")}
                    options={personTypes.map((p) => ({
                      value: p.id,
                      title: p.name[locale],
                      icon:
                        p.id === "legal" ? (
                          <Building2 aria-hidden className="size-5" />
                        ) : (
                          <UserRound aria-hidden className="size-5" />
                        ),
                    }))}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
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
                    {isLegal ? (
                      <TextInput
                        name="voen"
                        label={tc("voen")}
                        hint={tc("voenHint")}
                        inputMode="numeric"
                        autoComplete="off"
                        format={(v) => formatDigits(v, documentFormats.voen.maxChars)}
                        required
                        className="sm:col-span-2"
                      />
                    ) : (
                      <>
                        <TextInput
                          name="fin"
                          label={tc("fin")}
                          hint={tc("finHint")}
                          autoComplete="off"
                          autoCapitalize="characters"
                          spellCheck={false}
                          format={formatFin}
                          required
                        />
                        <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-3">
                          <SelectInput
                            name="idSeries"
                            label={tc("idSeries")}
                            options={idCardSeries.map((s) => ({ value: s.id, label: s.id }))}
                            required
                          />
                          <TextInput
                            name="idNumber"
                            label={tc("idNumber")}
                            hint={tc("idNumberHint", { digits: series.digits })}
                            inputMode="numeric"
                            autoComplete="off"
                            format={(v) => formatDigits(v, series.digits)}
                            required
                          />
                        </div>
                      </>
                    )}
                    <TextInput
                      name="plate"
                      label={tc("plate")}
                      hint={tc("plateHint", { example: documentFormats.plate.example })}
                      autoComplete="off"
                      autoCapitalize="characters"
                      spellCheck={false}
                      format={formatPlate}
                      required
                    />
                    <TextInput
                      name="registrationCertificate"
                      label={tc("registrationCertificate")}
                      hint={tc("documentHint", { example: documentFormats.registrationCertificate.example })}
                      autoComplete="off"
                      autoCapitalize="characters"
                      spellCheck={false}
                      format={(v) => formatSeriesNumber(v, 2, 6)}
                      required
                    />
                    {!isLegal ? (
                      <TextInput
                        name="drivingLicence"
                        label={tc("drivingLicence")}
                        hint={tc("documentHint", { example: documentFormats.drivingLicence.example })}
                        autoComplete="off"
                        autoCapitalize="characters"
                        spellCheck={false}
                        format={(v) => formatSeriesNumber(v, 2, 6)}
                        required
                        className="sm:col-span-2"
                      />
                    ) : null}
                  </div>
                  <CheckboxInput name="taxi" label={tc("taxi")} description={tc("taxiHint")} />
                  <RequiredHint />
                </div>
              ) : null}

              {step === 2 ? (
                <div className="space-y-4">
                  <p className="text-sm leading-relaxed text-muted">{tc("addonsDescription")}</p>
                  <div className="space-y-3">
                    {carAddons.map((addon) => (
                      <CheckboxInput
                        key={addon.id}
                        name="addons"
                        value={addon.id}
                        label={addon.name}
                        description={addon.description[locale]}
                        aside={
                          addon.price ? (
                            formatAzn(addon.price.amount, locale)
                          ) : (
                            <span className="font-medium text-muted">{tc("priceUnconfirmed")}</span>
                          )
                        }
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-2xl bg-surface px-5 py-4 text-ink">
                    <span className="text-sm font-medium text-muted">{tc("total")}</span>
                    <AnimatePresence mode="wait" initial={false}>
                      <m.span
                        key={totalLabel}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        aria-live="polite"
                        className="text-right text-base font-semibold"
                      >
                        {totalLabel}
                      </m.span>
                    </AnimatePresence>
                  </div>
                  <p className="text-xs leading-relaxed text-muted">{tc("basePremiumNote")}</p>
                  <ConsentInput />
                </div>
              ) : null}
            </m.div>
          </AnimatePresence>

          <SubmitError show={app.status === "error"} onRetry={app.retry} />

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => goTo(step - 1)}
                className={buttonStyles({ variant: "ghost", size: "lg", className: "px-4" })}
              >
                <ArrowLeft aria-hidden className="size-4" />
                {t("back")}
              </button>
            ) : (
              <span className="hidden sm:block" />
            )}
            {step < LAST ? (
              <button
                type="submit"
                className={buttonStyles({ size: "lg", className: "w-full sm:w-auto sm:min-w-40" })}
              >
                {t("next")}
                <ArrowRight aria-hidden className="size-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={app.status === "submitting"}
                className={buttonStyles({ size: "lg", className: "w-full sm:w-auto sm:min-w-40" })}
              >
                {app.status === "submitting" ? t("submitting") : t("submit")}
              </button>
            )}
          </div>
          <div className="mt-4">
            <DemoNote />
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
