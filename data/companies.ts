/**
 * Insurance companies shown on the site.
 *
 * Only names are published. No phone numbers, WhatsApp numbers or other
 * contact details — all customer communication goes through SığortaPro.
 * No partnership or certification is claimed.
 *
 * `logo` stays empty until an authorised logo file is provided by the company;
 * the UI then renders it at a uniform size instead of the monogram.
 */
export interface InsuranceCompany {
  id: string;
  name: string;
  /** Short monogram used while no authorised logo is available. */
  monogram: string;
  /** Path under /public, e.g. "/images/companies/pasha.svg" — authorised assets only. */
  logo: string | null;
}

export const companies: InsuranceCompany[] = [
  { id: "ateshgah", name: "Atəşgah Sığorta", monogram: "AS", logo: null },
  { id: "pasha", name: "PAŞA Sığorta", monogram: "PS", logo: null },
  { id: "mega", name: "MEGA Sığorta", monogram: "MS", logo: null },
  { id: "qala", name: "Qala Sığorta", monogram: "QS", logo: null },
  { id: "xalq", name: "Xalq Sığorta", monogram: "XS", logo: null },
  { id: "azsenaye", name: "Azərbaycan Sənaye Sığorta", monogram: "ASS", logo: null },
];
