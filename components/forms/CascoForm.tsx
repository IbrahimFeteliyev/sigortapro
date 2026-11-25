"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { formatAmount, formatDigits, formatName, formatPhone, unformatAmount } from "@/lib/input-format";
import { normalizeAzPhone } from "@/lib/validation/fields";
import { cascoSchema, type CascoValues } from "@/lib/validation/schemas";
import { FormOutcome } from "./FormOutcome";
import {
  ConsentInput,
  DemoNote,
  ErrorNotice,
  RequiredHint,
  SubmitButton,
  SubmitError,
  TextInput,
} from "./kit";
import { useApplication } from "./use-application";

const defaults: CascoValues = {
  brand: "",
  model: "",
  year: "",
  marketValue: "",
  firstName: "",
  lastName: "",
  phone: "",
  consent: false,
};

export function CascoForm({ productName }: { productName: string }) {
  const t = useTranslations("Forms");
  const tc = useTranslations("Forms.casco");
  const app = useApplication("casco", "casco");
  const [showErrors, setShowErrors] = useState(false);
  const methods = useForm<CascoValues>({
    resolver: zodResolver(cascoSchema),
    defaultValues: defaults,
    mode: "onTouched",
  });

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

  const onValid = (v: CascoValues) =>
    void app.submit(
      {
        ...v,
        marketValue: unformatAmount(v.marketValue),
        year: Number(v.year),
        phone: normalizeAzPhone(v.phone),
      },
      [
        { label: tc("brand"), value: v.brand },
        { label: tc("model"), value: v.model },
        { label: tc("year"), value: v.year },
        { label: tc("marketValue"), value: `${v.marketValue} AZN` },
        { label: t("firstName"), value: v.firstName },
        { label: t("lastName"), value: v.lastName },
        { label: t("phone"), value: v.phone },
      ],
    );

  return (
    <FormProvider {...methods}>
      <form
        noValidate
        onSubmit={methods.handleSubmit(onValid, () => setShowErrors(true))}
        className="space-y-4"
      >
        <ErrorNotice show={showErrors} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            name="brand"
            label={tc("brand")}
            placeholder={tc("brandPlaceholder")}
            maxLength={40}
            required
          />
          <TextInput
            name="model"
            label={tc("model")}
            placeholder={tc("modelPlaceholder")}
            maxLength={40}
            required
          />
          <TextInput
            name="year"
            label={tc("year")}
            placeholder={tc("yearPlaceholder")}
            inputMode="numeric"
            format={(v) => formatDigits(v, 4)}
            required
          />
          <TextInput
            name="marketValue"
            label={tc("marketValue")}
            placeholder={tc("marketValuePlaceholder")}
            inputMode="numeric"
            format={formatAmount}
            required
          />
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
            name="phone"
            type="tel"
            label={t("phone")}
            placeholder={t("phonePlaceholder")}
            inputMode="tel"
            autoComplete="tel"
            format={formatPhone}
            required
            className="sm:col-span-2"
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
