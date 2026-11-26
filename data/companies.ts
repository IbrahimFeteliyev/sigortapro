/**
 * Insurance companies shown on the site, with their original logos
 * (downloaded from each company's official website, see README).
 *
 * No phone numbers, WhatsApp numbers or other contact details are published —
 * all customer communication goes through SığortaPro. No partnership or
 * certification is claimed.
 */
export interface InsuranceCompany {
  id: string;
  name: string;
  /** Path under /public. */
  logo: string;
  /** Intrinsic logo size (keeps the aspect ratio stable, no layout shift). */
  logoWidth: number;
  logoHeight: number;
}

export const companies: InsuranceCompany[] = [
  {
    id: "ateshgah",
    name: "Atəşgah Sığorta",
    logo: "/images/companies/ateshgah.png",
    logoWidth: 479,
    logoHeight: 109,
  },
  {
    id: "pasha",
    name: "PAŞA Sığorta",
    logo: "/images/companies/pasha.svg",
    logoWidth: 83,
    logoHeight: 32,
  },
  {
    id: "meqa",
    name: "Meqa Sığorta",
    logo: "/images/companies/mega.svg",
    logoWidth: 405,
    logoHeight: 131,
  },
  {
    id: "qala",
    name: "Qala Sığorta",
    logo: "/images/companies/qala.svg",
    logoWidth: 102,
    logoHeight: 44,
  },
  {
    id: "xalq",
    name: "Xalq Sığorta",
    logo: "/images/companies/xalq.svg",
    logoWidth: 212,
    logoHeight: 40,
  },
  {
    id: "azsenaye",
    name: "Azərbaycan Sənaye Sığorta",
    logo: "/images/companies/azsenaye.svg",
    logoWidth: 252,
    logoHeight: 46,
  },
];
