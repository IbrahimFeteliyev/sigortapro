"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CircleAlert, LoaderCircle, RotateCcw } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { FormProvider, useForm, useWatch, type FieldErrors, type Resolver } from "react-hook-form";
import { ProductIcon } from "@/components/insurance/ProductIcon";
import { buttonStyles } from "@/components/ui/button";
import { buildApplicationPayload, submitApplication } from "@/lib/api/applications";
import { cn } from "@/lib/utils";
import {
  applicationSchema,
  CASCO_COVERAGE,
  contactFields,
  detailFields,
  emptyApplication,
  type ApplicationData,
  type ApplicationFormValues,
  type CascoCoverage,
} from "@/lib/validation/application";
import { isInsuranceSlug, type InsuranceSlug } from "@/types/insurance";
import { FormOutcome } from "./FormOutcome";
import { useApplicationSummary, type FieldName, type FormProduct } from "./form-utils";
import { StepContact, StepDetails, StepReview, StepType } from "./steps";

const STEPS = ["type", "details", "contact", "review"] as const;
const LAST_STEP = STEPS.length - 1;

type Status = "idle" | "submitting" | "error" | "demo" | "submitted";

const resolver = zodResolver(applicationSchema) as unknown as Resolver<
  ApplicationFormValues,
  unknown,
  ApplicationData
>;

const isCascoCoverage = (value: string): value is CascoCoverage =>
  (CASCO_COVERAGE as readonly string[]).includes(value);

const stepVariants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 28 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction * -28 }),
};

/** Reads `?type=…&plan=…` so product pages can deep-link into the form. */
function SearchParamsSync({
  onPreselect,
}: {
  onPreselect: (type: InsuranceSlug, plan: string | null) => void;
}) {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const plan = searchParams.get("plan");

  useEffect(() => {
    if (type && isInsuranceSlug(type)) {
      const safePlan = plan && /^[a-z0-9-]{1,40}$/.test(plan) ? plan : null;
      onPreselect(type, safePlan);
    }
  }, [type, plan, onPreselect]);

  return null;
}

export function ApplicationForm({ products }: { products: FormProduct[] }) {
  const t = useTranslations("ApplyForm");
  const locale = useLocale();

  const methods = useForm<ApplicationFormValues, unknown, ApplicationData>({
    resolver,
    defaultValues: emptyApplication,
    mode: "onTouched",
    reValidateMode: "onChange",
  });
  const { setValue, clearErrors, trigger, getValues, reset, handleSubmit, control } = methods;

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [status, setStatus] = useState<Status>("idle");
  const [reference, setReference] = useState<string | null>(null);
  const [tariffId, setTariffId] = useState<string | null>(null);
  const [showErrorNotice, setShowErrorNotice] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const focusOnMount = useRef(false);

  // Moves focus to a newly shown step heading (for keyboard and screen readers).
  const headingRef = useCallback((node: HTMLHeadingElement | null) => {
    if (node && focusOnMount.current) {
      focusOnMount.current = false;
      node.focus({ preventScroll: true });
    }
  }, []);

  const insuranceType = useWatch({ control, name: "insuranceType" });
  // The summary is only shown on the review step and the outcome screen, both
  // reached through a state change, so a non-reactive read is enough here and
  // avoids re-rendering the whole form on every keystroke.
  const needsSummary = step === LAST_STEP || status === "demo" || status === "submitted";
  const summary = useApplicationSummary(needsSummary ? getValues() : emptyApplication, products);
  const selectedProduct = products.find((product) => product.slug === insuranceType);

  const scrollToTop = () => {
    const node = containerRef.current;
    if (!node || node.getBoundingClientRect().top >= 0) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.scrollIntoView({ block: "start", behavior: reduceMotion ? "auto" : "smooth" });
  };

  const goTo = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setShowErrorNotice(false);
    focusOnMount.current = true;
    setStep(next);
    scrollToTop();
  };

  const fieldsFor = (index: number): FieldName[] => {
    if (index === 0) return ["insuranceType"];
    if (index === 1) {
      const type = getValues("insuranceType");
      return type ? detailFields[type] : [];
    }
    if (index === 2) return contactFields;
    return [];
  };

  const goNext = async () => {
    const fields = fieldsFor(step);
    const valid = await trigger(fields, { shouldFocus: true });
    if (!valid) {
      // Mark the step's fields as touched so "onTouched" mode re-validates them
      // on change. Errors then clear while the user types — not on blur, where
      // the collapsing message would shift the Continue button mid-click.
      for (const name of fields) {
        setValue(name, getValues(name) as never, { shouldTouch: true });
      }
      setShowErrorNotice(true);
      return;
    }
    goTo(step + 1);
  };

  const handlePreselect = useCallback(
    (type: InsuranceSlug, plan: string | null) => {
      setValue("insuranceType", type, { shouldDirty: true });
      clearErrors("insuranceType");
      setTariffId(plan);
      if (type === "casco" && plan && isCascoCoverage(plan)) setValue("cascoCoverage", plan);
      setDirection(1);
      setStep((current) => (current === 0 ? 1 : current));
    },
    [setValue, clearErrors],
  );

  const onValid = async (data: ApplicationData) => {
    setStatus("submitting");
    try {
      const result = await submitApplication(buildApplicationPayload(data, locale, tariffId));
      setReference(result.status === "submitted" ? result.reference : null);
      focusOnMount.current = true;
      setStatus(result.status);
      scrollToTop();
    } catch {
      setStatus("error");
    }
  };

  // Should not happen after step-by-step validation, but route back if it does.
  const onInvalid = (invalid: FieldErrors<ApplicationFormValues>) => {
    setStatus("idle");
    const errorNames = Object.keys(invalid) as FieldName[];
    const firstStep = [0, 1, 2].find((index) => fieldsFor(index).some((name) => errorNames.includes(name)));
    if (firstStep !== undefined) {
      goTo(firstStep);
      setShowErrorNotice(true);
    }
  };

  const restart = () => {
    reset(emptyApplication);
    setTariffId(null);
    setReference(null);
    setStatus("idle");
    setDirection(-1);
    focusOnMount.current = true;
    setStep(0);
    scrollToTop();
  };

  const titles = [t("typeTitle"), t("detailsTitle"), t("contactTitle"), t("reviewTitle")];
  const descriptions = [
    t("typeDescription"),
    t("detailsDescription"),
    t("contactDescription"),
    t("reviewDescription"),
  ];
  const submitting = status === "submitting";

  return (
    <div
      ref={containerRef}
      className="scroll-mt-24 rounded-[2rem] bg-white p-5 shadow-card ring-1 ring-line sm:p-8 lg:p-10"
    >
      {status === "demo" || status === "submitted" ? (
        <FormOutcome
          status={status}
          reference={reference}
          sections={summary}
          onRestart={restart}
          headingRef={headingRef}
        />
      ) : (
        <FormProvider {...methods}>
          <Suspense fallback={null}>
            <SearchParamsSync onPreselect={handlePreselect} />
          </Suspense>

          {/* Progress */}
          <ol className="grid grid-cols-4 gap-2 sm:gap-3">
            {STEPS.map((key, index) => (
              <li key={key} aria-current={index === step ? "step" : undefined}>
                <span
                  className={cn(
                    "block h-1.5 rounded-full transition-colors duration-300",
                    index <= step ? "bg-brand-600" : "bg-line",
                  )}
                />
                <span
                  className={cn(
                    "mt-2.5 block text-xs leading-tight font-medium sm:text-sm",
                    index === step ? "text-ink" : "text-muted",
                  )}
                >
                  {t(`steps.${key}`)}
                </span>
              </li>
            ))}
          </ol>
          <p aria-live="polite" className="mt-6 text-sm font-medium text-muted">
            {t("progress", { current: step + 1, total: STEPS.length })}
          </p>

          <form
            noValidate
            onSubmit={(event) => {
              if (step < LAST_STEP) {
                event.preventDefault();
                void goNext();
              } else {
                void handleSubmit(onValid, onInvalid)(event);
              }
            }}
          >
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <m.div
                key={step}
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                <header className="mt-2 mb-8">
                  <h2
                    ref={headingRef}
                    tabIndex={-1}
                    className="text-2xl leading-tight font-semibold text-ink outline-none sm:text-[1.75rem]"
                  >
                    {titles[step]}
                  </h2>
                  <p className="mt-2 text-muted">{descriptions[step]}</p>

                  {step === 1 && selectedProduct ? (
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 py-1.5 pr-4 pl-1.5 text-sm font-semibold text-brand-800">
                        <span className="grid size-7 place-items-center rounded-full bg-white text-brand-700">
                          <ProductIcon slug={selectedProduct.slug} className="size-4" />
                        </span>
                        {selectedProduct.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => goTo(0)}
                        className="text-sm font-semibold text-brand-700 underline-offset-2 hover:underline"
                      >
                        {t("change")}
                      </button>
                    </div>
                  ) : null}

                  {step === 1 || step === 2 ? (
                    <p className="mt-4 text-xs text-muted">{t("requiredHint")}</p>
                  ) : null}
                </header>

                {showErrorNotice && Object.keys(methods.formState.errors).length > 0 ? (
                  <div
                    role="alert"
                    className="mb-6 flex items-center gap-2.5 rounded-2xl bg-danger-50 px-4 py-3 text-sm font-medium text-danger-700"
                  >
                    <CircleAlert aria-hidden className="size-4 shrink-0" />
                    {t("fixErrors")}
                  </div>
                ) : null}

                {step === 0 ? <StepType products={products} /> : null}
                {step === 1 ? <StepDetails /> : null}
                {step === 2 ? <StepContact /> : null}
                {step === 3 ? <StepReview sections={summary} onEdit={goTo} /> : null}
              </m.div>
            </AnimatePresence>

            {status === "error" ? (
              <div role="alert" className="mt-8 rounded-2xl bg-danger-50 p-5">
                <p className="font-semibold text-danger-700">{t("error.title")}</p>
                <p className="mt-1 text-sm text-danger-700">{t("error.text")}</p>
                <button
                  type="submit"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-danger-700 underline-offset-2 hover:underline"
                >
                  <RotateCcw aria-hidden className="size-4" />
                  {t("error.retry")}
                </button>
              </div>
            ) : null}

            <div className="mt-10 flex items-center justify-between gap-3 border-t border-line pt-6">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => goTo(step - 1)}
                  disabled={submitting}
                  className={buttonStyles({ variant: "ghost", size: "lg", className: "px-4" })}
                >
                  <ArrowLeft aria-hidden className="size-4" />
                  {t("back")}
                </button>
              ) : (
                <span />
              )}
              <button
                type="submit"
                disabled={submitting}
                aria-busy={submitting || undefined}
                className={buttonStyles({ size: "lg", className: "min-w-40" })}
              >
                {submitting ? (
                  <>
                    <LoaderCircle aria-hidden className="size-4 animate-spin" />
                    {t("submitting")}
                  </>
                ) : step === LAST_STEP ? (
                  t("submit")
                ) : (
                  <>
                    {t("next")}
                    <ArrowRight aria-hidden className="size-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </FormProvider>
      )}
    </div>
  );
}
