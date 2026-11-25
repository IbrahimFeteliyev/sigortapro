import type { LocalizedText, Money } from "@/types/insurance";

/**
 * Configuration for the application forms: option lists, document formats
 * and add-ons. Labels are localized here; validation rules read the same
 * values so the UI and the schema never disagree.
 */

const l = (az: string, en: string, ru: string): LocalizedText => ({ az, en, ru });

export interface Option<T extends string = string> {
  id: T;
  name: LocalizedText;
}

/* -------------------------------------------------------------------------- */
/*  Compulsory motor insurance                                                */
/* -------------------------------------------------------------------------- */

export const vehicleTypes = [
  { id: "car", name: l("Minik avtomobili", "Passenger car", "Легковой автомобиль") },
  { id: "truck", name: l("Yük avtomobili", "Truck", "Грузовой автомобиль") },
  { id: "bus", name: l("Avtobus", "Bus", "Автобус") },
  { id: "minibus", name: l("Mikroavtobus", "Minibus", "Микроавтобус") },
  { id: "motorcycle", name: l("Motosiklet", "Motorcycle", "Мотоцикл") },
  { id: "trailer", name: l("Qoşqu / yarımqoşqu", "Trailer / semi-trailer", "Прицеп / полуприцеп") },
  { id: "special", name: l("Xüsusi texnika", "Special machinery", "Спецтехника") },
] as const satisfies readonly Option[];

export const engineCapacities = [
  { id: "upto-1500", name: l("1500 sm³-dək", "Up to 1,500 cm³", "До 1500 см³") },
  { id: "1501-2000", name: l("1501 – 2000 sm³", "1,501 – 2,000 cm³", "1501 – 2000 см³") },
  { id: "2001-2500", name: l("2001 – 2500 sm³", "2,001 – 2,500 cm³", "2001 – 2500 см³") },
  { id: "2501-3000", name: l("2501 – 3000 sm³", "2,501 – 3,000 cm³", "2501 – 3000 см³") },
  { id: "3001-3500", name: l("3001 – 3500 sm³", "3,001 – 3,500 cm³", "3001 – 3500 см³") },
  { id: "over-3500", name: l("3500 sm³-dən çox", "Over 3,500 cm³", "Более 3500 см³") },
  { id: "electric", name: l("Elektrik mühərriki", "Electric motor", "Электродвигатель") },
] as const satisfies readonly Option[];

export const personTypes = [
  { id: "individual", name: l("Fiziki şəxs", "Individual", "Физическое лицо") },
  { id: "legal", name: l("Hüquqi şəxs", "Legal entity", "Юридическое лицо") },
] as const satisfies readonly Option[];

/**
 * Identity-card series and the length of the number that follows each one.
 * Different document types deliberately have different limits.
 */
export const idCardSeries = [
  { id: "AZE", digits: 8, name: l("AZE (köhnə nümunə)", "AZE (old format)", "AZE (старый образец)") },
  { id: "AA", digits: 7, name: l("AA (yeni nümunə)", "AA (new format)", "AA (новый образец)") },
] as const;

export type IdCardSeries = (typeof idCardSeries)[number]["id"];

/**
 * Patterns for vehicle documents (letters + digits, separators ignored).
 * Adjust here if the business confirms different formats.
 */
export const documentFormats = {
  /** 10-AA-100 → 2 digits, 2 letters, 3 digits. */
  plate: { pattern: /^\d{2}[A-Z]{2}\d{3}$/, maxChars: 7, example: "10-AA-100" },
  /** Personal identification number (FİN). */
  fin: { pattern: /^[A-Z0-9]{7}$/, maxChars: 7, example: "5ABC1D2" },
  /** Tax ID of a legal entity (VÖEN). */
  voen: { pattern: /^\d{10}$/, maxChars: 10, example: "1234567891" },
  /** Vehicle registration certificate: 2 letters + 6 digits. */
  registrationCertificate: { pattern: /^[A-Z]{2}\d{6}$/, maxChars: 8, example: "AA 123456" },
  /** Driving licence: 2 letters + 6 digits. */
  drivingLicence: { pattern: /^[A-Z]{2}\d{6}$/, maxChars: 8, example: "AB 123456" },
} as const;

/** Optional add-ons. `price: null` = not confirmed → no total is calculated. */
export const carAddons = [
  {
    id: "avto-plus",
    name: "AVTO+",
    description: l(
      "İcbari sığortaya əlavə könüllü təminat. Şərtlər sığortaçı tərəfindən təsdiqləndikdən sonra dəqiqləşdiriləcək.",
      "A voluntary add-on to compulsory insurance. Terms will be specified once confirmed by the insurer.",
      "Добровольное дополнение к обязательному страхованию. Условия уточняются после подтверждения страховщиком.",
    ),
    price: null as Money | null,
  },
  {
    id: "avto-extra",
    name: "AVTO EXTRA",
    description: l(
      "Genişləndirilmiş əlavə təminat paketi. Şərtlər sığortaçı tərəfindən təsdiqləndikdən sonra dəqiqləşdiriləcək.",
      "An extended add-on package. Terms will be specified once confirmed by the insurer.",
      "Расширенный дополнительный пакет. Условия уточняются после подтверждения страховщиком.",
    ),
    price: null as Money | null,
  },
] as const;

export type CarAddonId = (typeof carAddons)[number]["id"];

/* -------------------------------------------------------------------------- */
/*  Travel                                                                    */
/* -------------------------------------------------------------------------- */

export const travelDestinations = [
  { id: "schengen", name: l("Şengen zonası", "Schengen Area", "Шенгенская зона") },
  {
    id: "europe-other",
    name: l("Avropa (Şengendən kənar)", "Europe (non-Schengen)", "Европа (вне Шенгена)"),
  },
  { id: "turkey", name: l("Türkiyə", "Türkiye", "Турция") },
  { id: "georgia", name: l("Gürcüstan", "Georgia", "Грузия") },
  { id: "cis", name: l("MDB ölkələri", "CIS countries", "Страны СНГ") },
  { id: "middle-east", name: l("Yaxın Şərq", "Middle East", "Ближний Восток") },
  { id: "asia", name: l("Asiya", "Asia", "Азия") },
  { id: "americas", name: l("Amerika", "Americas", "Америка") },
  { id: "worldwide", name: l("Bütün dünya", "Worldwide", "Весь мир") },
] as const satisfies readonly Option[];

export const MAX_TRAVELERS = 10;
export const MAX_TRIP_DAYS = 365;
/** How far ahead a trip may start. */
export const MAX_BOOKING_DAYS = 730;

/* -------------------------------------------------------------------------- */
/*  Identity document upload (life insurance) — local demo only               */
/* -------------------------------------------------------------------------- */

export const documentUpload = {
  accept: ["image/jpeg", "image/png", "application/pdf"],
  extensions: [".jpg", ".jpeg", ".png", ".pdf"],
  maxBytes: 5 * 1024 * 1024,
  maxFiles: 2,
} as const;
