"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, m } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { formatAzn } from "@/lib/format";
import { useEffect, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import {
  ageGroupForAge,
  lifeCategories,
  lifeCategoryAmounts,
  lifePrice,
  lifeTermYears,
  type LifeCategoryId,
  type LifeCoverageAmount,
} from "@/data/life-tariffs";
import type { Locale } from "@/i18n/routing";
import { formatDigits, formatName, formatPhone } from "@/lib/input-format";
import { normalizeAzPhone } from "@/lib/validation/fields";
import { lifeSchema, type LifeValues } from "@/lib/validation/schemas";
import { DocumentUpload } from "./DocumentUpload";
import { FormOutcome } from "./FormOutcome";
import {
  ChoiceGroup,
  ConsentInput,
  DemoNote,
  ErrorNotice,
  RequiredHint,
  SelectInput,
  SubmitButton,
  SubmitError,
  TextInput,
} from "./kit";
import { useApplication } from "./use-application";

const NO_AMOUNTS: readonly LifeCoverageAmount[] = [];

const defaults: LifeValues = {
  category: "",
  amount: "",
  term: "",
  firstName: "",
  lastName: "",
  age: "",
  phone: "",
  email: "",
  consent: false,
};

export function LifeForm({ productName }: { productName: string }) {
  const t = useTranslations("Forms");
  const tl = useTranslations("Forms.life");
  const locale = useLocale() as Locale;
  const app = useApplication("life", "life");
  const [showErrors, setShowErrors] = useState(false);
  const [documents, setDocuments] = useState(0);
  const methods = useForm<LifeValues>({
    resolver: zodResolver(lifeSchema),
    defaultValues: defaults,
    mode: "onTouched",
  });
  const [category, age, amount] = useWatch({
    control: methods.control,
    name: ["category", "age", "amount"],
  });
  // The age band is derived from the typed age — never asked twice.
  const ageGroup = /^\d{1,3}$/.test(age) ? ageGroupForAge(Number(age)) : null;

  const amounts = category ? lifeCategoryAmounts[category as LifeCategoryId] : NO_AMOUNTS;
  // Drop an amount the newly chosen category doesn't offer.
  useEffect(() => {
    if (amount && category && !amounts.map(String).includes(amount)) methods.setValue("amount", "");
  }, [amount, category, amounts, methods]);

  const ready = Boolean(category && ageGroup && amount);
  const price =
    ready && ageGroup
      ? lifePrice(category as LifeCategoryId, ageGroup.id, Number(amount) as LifeCoverageAmount)
      : null;
  const money = (value: number) => formatAzn(value, locale);
  const ageLabel = (group: { min: number; max: number }) =>
    tl("ageGroupValue", { min: group.min, max: group.max });

  if (app.status === "demo" || app.status === "submitted") {
    return (
      <FormOutcome
        status={app.status}
        reference={app.reference}
        productName={productName}
        rows={app.summary}
        onRestart={() => {
          methods.reset(defaults);
          setDocuments(0);
          app.reset();
        }}
      />
    );
  }

  const onValid = (v: LifeValues) => {
    const group = ageGroupForAge(Number(v.age));
    const selectedPrice = group
      ? lifePrice(v.category as LifeCategoryId, group.id, Number(v.amount) as LifeCoverageAmount)
      : null;
    void app.submit(
      {
        ...v,
        ageGroup: group?.id ?? null,
        amount: Number(v.amount),
        term: Number(v.term),
        age: Number(v.age),
        phone: normalizeAzPhone(v.phone),
        price: selectedPrice,
        // Documents are intentionally NOT included — they never leave the browser.
        documentsAttachedLocally: documents,
      },
      [
        {
          label: tl("category"),
          value: lifeCategories.find((c) => c.id === v.category)?.name[locale] ?? v.category,
        },
        { label: tl("age"), value: v.age },
        ...(group ? [{ label: tl("ageGroup"), value: ageLabel(group) }] : []),
        { label: tl("amount"), value: money(Number(v.amount)) },
        { label: tl("price"), value: selectedPrice ? money(selectedPrice.amount) : tl("priceUnavailable") },
        { label: tl("term"), value: tl("termValue", { years: Number(v.term) }) },
        { label: t("firstName"), value: v.firstName },
        { label: t("lastName"), value: v.lastName },
        { label: t("phone"), value: v.phone },
        ...(v.email ? [{ label: t("email"), value: v.email }] : []),
        { label: tl("documents"), value: tl("documentsValue", { count: documents }) },
      ],
    );
  };

  return (
    <FormProvider {...methods}>
      <form
        noValidate
        onSubmit={methods.handleSubmit(onValid, () => setShowErrors(true))}
        className="space-y-5"
      >
        <ErrorNotice show={showErrors} />

        <ChoiceGroup
          name="category"
          legend={tl("category")}
          columns={1}
          options={lifeCategories.map((c) => ({
            value: c.id,
            title: c.name[locale],
            description: c.description[locale],
          }))}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            name="age"
            label={tl("age")}
            placeholder={tl("agePlaceholder")}
            inputMode="numeric"
            format={(value) => formatDigits(value, 2)}
            hint={ageGroup ? tl("ageGroupHint", { group: ageLabel(ageGroup) }) : undefined}
            required
          />
          <SelectInput
            name="amount"
            label={tl("amount")}
            options={amounts.map((value) => ({ value: String(value), label: money(value) }))}
            hint={!category ? tl("amountHint") : undefined}
            required
          />
        </div>

        {/* Price from verified tariff data — never estimated */}
        <div aria-live="polite" className="rounded-2xl bg-surface px-5 py-4">
          <p className="text-sm text-muted">{tl("price")}</p>
          <AnimatePresence mode="wait" initial={false}>
            <m.p
              key={!ready ? "empty" : price ? price.amount : "unavailable"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className={
                price
                  ? "mt-0.5 text-2xl font-semibold tracking-tight text-ink"
                  : "mt-0.5 text-base font-medium text-ink"
              }
            >
              {!ready ? tl("priceSelect") : price ? money(price.amount) : tl("priceUnavailable")}
            </m.p>
          </AnimatePresence>
          {ready && !price ? (
            <p className="mt-1 text-sm leading-relaxed text-muted">{tl("priceUnavailableNote")}</p>
          ) : null}
        </div>

        <div className="grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
          <TextInput
            name="firstName"
            label={t("firstName")}
            autoComplete="given-name"
            format={formatName}
            required
          />
          <TextInput
            name="lastName"
            label={t("lastName")}
            autoComplete="family-name"
            format={formatName}
            required
          />
          <SelectInput
            name="term"
            label={tl("term")}
            options={lifeTermYears.map((years) => ({
              value: String(years),
              label: tl("termValue", { years }),
            }))}
            required
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

        <DocumentUpload onCountChange={setDocuments} />

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
