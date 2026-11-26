"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ShieldCheck, Sparkles } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { formatAzn } from "@/lib/format";
import { useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { photos } from "@/data/images";
import { propertyRegionTariffs, propertyTypes } from "@/data/property-tariffs";
import { formatAmount, formatName, formatPhone, unformatAmount } from "@/lib/input-format";
import { cn } from "@/lib/utils";
import { normalizeAzPhone } from "@/lib/validation/fields";
import {
  propertyCascoSchema,
  propertyStandardSchema,
  type PropertyCascoValues,
  type PropertyStandardValues,
} from "@/lib/validation/schemas";
import { FormOutcome } from "./FormOutcome";
import {
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

export type PropertyOption = "standard" | "casco";

/** Option picker (two photo cards) + the matching application form. */
export function PropertyApplication({
  productName,
  initialOption = null,
}: {
  productName: string;
  initialOption?: PropertyOption | null;
}) {
  const t = useTranslations("Forms.property");
  const locale = useLocale();
  const [option, setOption] = useState<PropertyOption | null>(initialOption);

  const cards = [
    { id: "standard" as const, image: photos.propertyStandard, badge: t("standardBadge"), icon: ShieldCheck },
    { id: "casco" as const, image: photos.propertyCasco, badge: t("cascoBadge"), icon: Sparkles },
  ];

  return (
    <div>
      <div role="radiogroup" aria-label={t("optionsLegend")} className="grid gap-3 sm:grid-cols-2">
        {cards.map(({ id, image, badge, icon: Icon }) => {
          const selected = option === id;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setOption(id)}
              className={cn(
                // Phones: compact row with a square thumbnail. sm+: large photo card.
                "group relative flex overflow-hidden rounded-2xl bg-white text-left ring-1 transition-[box-shadow,transform] duration-200 sm:block",
                selected
                  ? "shadow-card-hover ring-2 ring-ink"
                  : "ring-line-strong hover:-translate-y-0.5 hover:shadow-card",
              )}
            >
              <span className="relative block w-28 shrink-0 overflow-hidden sm:aspect-[16/9] sm:w-auto">
                <Image
                  src={image.src}
                  alt={image.alt[locale]}
                  fill
                  sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 112px"
                  loading="eager"
                  fetchPriority="high"
                  placeholder="blur"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <span className="absolute top-2.5 left-2.5 hidden items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[0.6875rem] font-semibold text-ink shadow-xs sm:inline-flex">
                  <Icon aria-hidden className="size-3.5 text-brand-600" />
                  {badge}
                </span>
                {selected ? (
                  <span className="absolute top-2.5 right-2.5 grid size-7 place-items-center rounded-full bg-ink text-white">
                    <Check aria-hidden className="size-4" strokeWidth={3} />
                  </span>
                ) : null}
              </span>
              <span className="block min-w-0 flex-1 p-3.5">
                <span className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-surface px-2 py-0.5 text-[0.6875rem] font-semibold text-ink sm:hidden">
                  <Icon aria-hidden className="size-3 text-brand-600" />
                  {badge}
                </span>
                <span className="block font-semibold text-ink">{t(`${id}Title`)}</span>
                <span className="mt-1 block text-sm leading-snug text-muted">{t(`${id}Description`)}</span>
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {option ? (
          <m.div
            key={option}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 border-t border-line pt-6"
          >
            {option === "standard" ? (
              <StandardForm productName={productName} />
            ) : (
              <PropertyCascoForm productName={productName} />
            )}
          </m.div>
        ) : (
          <p className="mt-5 text-center text-sm text-muted">{t("chooseOption")}</p>
        )}
      </AnimatePresence>
    </div>
  );
}

function useRegionOptions() {
  const locale = useLocale();
  return {
    regions: propertyRegionTariffs.map((r) => ({ value: r.id, label: r.name[locale] })),
    types: propertyTypes.map((p) => ({ value: p.id, label: p.name[locale] })),
    regionName: (id: string) => propertyRegionTariffs.find((r) => r.id === id)?.name[locale] ?? id,
    typeName: (id: string) => propertyTypes.find((p) => p.id === id)?.name[locale] ?? id,
  };
}

/* -------------------------------------------------------------------------- */
/*  Standard property insurance (fixed tariff by region)                       */
/* -------------------------------------------------------------------------- */

const standardDefaults: PropertyStandardValues = {
  region: "",
  address: "",
  propertyType: "",
  fullName: "",
  phone: "",
  consent: false,
};

function StandardForm({ productName }: { productName: string }) {
  const t = useTranslations("Forms");
  const tp = useTranslations("Forms.property");
  const locale = useLocale();
  const options = useRegionOptions();
  const app = useApplication("property", "property-standard");
  const [showErrors, setShowErrors] = useState(false);
  const methods = useForm<PropertyStandardValues>({
    resolver: zodResolver(propertyStandardSchema),
    defaultValues: standardDefaults,
    mode: "onTouched",
  });
  const regionId = useWatch({ control: methods.control, name: "region" });
  const tariff = propertyRegionTariffs.find((r) => r.id === regionId) ?? null;
  const money = (amount: number) => formatAzn(amount, locale);

  if (app.status === "demo" || app.status === "submitted") {
    return (
      <FormOutcome
        status={app.status}
        reference={app.reference}
        productName={`${productName} — ${tp("standardTitle")}`}
        rows={app.summary}
        onRestart={() => {
          methods.reset(standardDefaults);
          app.reset();
        }}
      />
    );
  }

  const onValid = (v: PropertyStandardValues) => {
    const selected = propertyRegionTariffs.find((r) => r.id === v.region);
    void app.submit(
      {
        ...v,
        phone: normalizeAzPhone(v.phone),
        tariff: selected ? { coverage: selected.coverage, price: selected.price } : null,
      },
      [
        { label: tp("region"), value: options.regionName(v.region) },
        ...(selected
          ? [
              { label: tp("coverageAmount"), value: money(selected.coverage.amount) },
              { label: tp("price"), value: money(selected.price.amount) },
            ]
          : []),
        { label: tp("address"), value: v.address },
        { label: tp("propertyType"), value: options.typeName(v.propertyType) },
        { label: t("fullName"), value: v.fullName },
        { label: t("phone"), value: v.phone },
      ],
    );
  };

  return (
    <FormProvider {...methods}>
      <form
        noValidate
        onSubmit={methods.handleSubmit(onValid, () => setShowErrors(true))}
        className="space-y-4"
      >
        <ErrorNotice show={showErrors} />
        <SelectInput name="region" label={tp("region")} options={options.regions} required />

        {/* Live tariff for the selected region */}
        <div className="grid grid-cols-2 gap-3" aria-live="polite">
          {[
            { label: tp("coverageAmount"), value: tariff ? money(tariff.coverage.amount) : null },
            { label: tp("price"), value: tariff ? money(tariff.price.amount) : null },
          ].map((item, index) => (
            <div
              key={item.label}
              className={cn(
                "rounded-2xl px-4 py-3.5",
                index === 1 ? "bg-brand-950 text-white" : "bg-surface text-ink",
              )}
            >
              <p className={cn("text-xs font-medium", index === 1 ? "text-brand-200" : "text-muted")}>
                {item.label}
              </p>
              <AnimatePresence mode="wait" initial={false}>
                <m.p
                  key={item.value ?? "empty"}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="mt-0.5 text-xl font-semibold tabular-nums"
                >
                  {item.value ?? "—"}
                </m.p>
              </AnimatePresence>
            </div>
          ))}
        </div>
        {!tariff ? <p className="-mt-1 text-xs text-muted">{tp("selectRegionHint")}</p> : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            name="address"
            label={tp("address")}
            placeholder={tp("addressPlaceholder")}
            autoComplete="street-address"
            maxLength={200}
            required
            className="sm:col-span-2"
          />
          <SelectInput name="propertyType" label={tp("propertyType")} options={options.types} required />
          <TextInput
            name="fullName"
            label={t("fullName")}
            placeholder={t("fullNamePlaceholder")}
            autoComplete="name"
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

/* -------------------------------------------------------------------------- */
/*  Property CASCO (value-based, individual offer — no premium calculated)     */
/* -------------------------------------------------------------------------- */

const cascoDefaults: PropertyCascoValues = {
  propertyType: "",
  region: "",
  address: "",
  marketValue: "",
  fullName: "",
  phone: "",
  consent: false,
};

function PropertyCascoForm({ productName }: { productName: string }) {
  const t = useTranslations("Forms");
  const tp = useTranslations("Forms.property");
  const options = useRegionOptions();
  const app = useApplication("property", "property-casco");
  const [showErrors, setShowErrors] = useState(false);
  const methods = useForm<PropertyCascoValues>({
    resolver: zodResolver(propertyCascoSchema),
    defaultValues: cascoDefaults,
    mode: "onTouched",
  });

  if (app.status === "demo" || app.status === "submitted") {
    return (
      <FormOutcome
        status={app.status}
        reference={app.reference}
        productName={`${productName} — ${tp("cascoTitle")}`}
        rows={app.summary}
        onRestart={() => {
          methods.reset(cascoDefaults);
          app.reset();
        }}
      />
    );
  }

  const onValid = (v: PropertyCascoValues) =>
    void app.submit({ ...v, marketValue: unformatAmount(v.marketValue), phone: normalizeAzPhone(v.phone) }, [
      { label: tp("propertyType"), value: options.typeName(v.propertyType) },
      { label: tp("region"), value: options.regionName(v.region) },
      { label: tp("address"), value: v.address },
      { label: tp("marketValue"), value: `${v.marketValue} AZN` },
      { label: t("fullName"), value: v.fullName },
      { label: t("phone"), value: v.phone },
    ]);

  return (
    <FormProvider {...methods}>
      <form
        noValidate
        onSubmit={methods.handleSubmit(onValid, () => setShowErrors(true))}
        className="space-y-4"
      >
        <ErrorNotice show={showErrors} />
        <p className="rounded-2xl bg-surface px-4 py-3 text-sm leading-relaxed text-ink-soft">
          {tp("cascoNote")}
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectInput name="propertyType" label={tp("propertyType")} options={options.types} required />
          <SelectInput name="region" label={tp("region")} options={options.regions} required />
          <TextInput
            name="address"
            label={tp("address")}
            placeholder={tp("addressPlaceholder")}
            autoComplete="street-address"
            maxLength={200}
            required
            className="sm:col-span-2"
          />
          <TextInput
            name="marketValue"
            label={tp("marketValue")}
            placeholder={tp("marketValuePlaceholder")}
            inputMode="numeric"
            format={formatAmount}
            required
            className="sm:col-span-2"
          />
          <TextInput
            name="fullName"
            label={t("fullName")}
            placeholder={t("fullNamePlaceholder")}
            autoComplete="name"
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
          />
        </div>
        <ConsentInput />
        <RequiredHint />
        <SubmitError show={app.status === "error"} onRetry={app.retry} />
        <SubmitButton submitting={app.status === "submitting"} className="sm:w-full">
          {tp("getQuote")}
        </SubmitButton>
        <DemoNote />
      </form>
    </FormProvider>
  );
}
