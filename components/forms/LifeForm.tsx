"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, m } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { formatAzn } from "@/lib/format";
import { useEffect, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import {
  lifeAgeGroups,
  lifeCategories,
  lifeCategoryAmounts,
  lifePrice,
  lifeTermYears,
  type LifeAgeGroupId,
  type LifeCategoryId,
  type LifeCoverageAmount,
} from "@/data/life-tariffs";
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
  ageGroup: "",
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
  const locale = useLocale();
  const app = useApplication("life", "life");
  const [showErrors, setShowErrors] = useState(false);
  const [documents, setDocuments] = useState(0);
  const methods = useForm<LifeValues>({
    resolver: zodResolver(lifeSchema),
    defaultValues: defaults,
    mode: "onTouched",
  });
  const [category, ageGroup, amount] = useWatch({
    control: methods.control,
    name: ["category", "ageGroup", "amount"],
  });

  const amounts = category ? lifeCategoryAmounts[category as LifeCategoryId] : NO_AMOUNTS;
  // Drop an amount the newly chosen category doesn't offer.
  useEffect(() => {
    if (amount && category && !amounts.map(String).includes(amount)) methods.setValue("amount", "");
  }, [amount, category, amounts, methods]);

  const ready = Boolean(category && ageGroup && amount);
  const price = ready
    ? lifePrice(category as LifeCategoryId, ageGroup as LifeAgeGroupId, Number(amount) as LifeCoverageAmount)
    : null;
  const money = (value: number) => formatAzn(value, locale);
  const ageLabel = (id: string) => {
    const group = lifeAgeGroups.find((g) => g.id === id);
    return group ? tl("ageGroupValue", { min: group.min, max: group.max }) : id;
  };

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
    const selectedPrice = lifePrice(
      v.category as LifeCategoryId,
      v.ageGroup as LifeAgeGroupId,
      Number(v.amount) as LifeCoverageAmount,
    );
    void app.submit(
      {
        ...v,
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
        { label: tl("ageGroup"), value: ageLabel(v.ageGroup) },
        { label: tl("amount"), value: money(Number(v.amount)) },
        { label: tl("price"), value: selectedPrice ? money(selectedPrice.amount) : tl("priceUnavailable") },
        { label: tl("term"), value: tl("termValue", { years: Number(v.term) }) },
        { label: t("firstName"), value: v.firstName },
        { label: t("lastName"), value: v.lastName },
        { label: tl("age"), value: v.age },
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
          <SelectInput
            name="ageGroup"
            label={tl("ageGroup")}
            options={lifeAgeGroups.map((g) => ({ value: g.id, label: ageLabel(g.id) }))}
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
        <div aria-live="polite" className="rounded-2xl bg-brand-950 px-5 py-4 text-white">
          <p className="text-xs font-medium text-brand-200">{tl("price")}</p>
          <AnimatePresence mode="wait" initial={false}>
            <m.p
              key={!ready ? "empty" : price ? price.amount : "unavailable"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="mt-0.5 text-lg font-semibold"
            >
              {!ready ? tl("priceSelect") : price ? money(price.amount) : tl("priceUnavailable")}
            </m.p>
          </AnimatePresence>
          {ready && !price ? (
            <p className="mt-1 text-xs leading-relaxed text-brand-100">{tl("priceUnavailableNote")}</p>
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
          <TextInput
            name="age"
            label={tl("age")}
            placeholder={tl("agePlaceholder")}
            inputMode="numeric"
            format={(value) => formatDigits(value, 2)}
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
