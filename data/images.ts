import type { StaticImageData } from "next/image";
import aboutTeam from "@/public/images/about/team.jpg";
import applySigning from "@/public/images/apply/signing.jpg";
import carDriving from "@/public/images/car-insurance/driving.jpg";
import carHero from "@/public/images/car-insurance/hero.jpg";
import cascoDamage from "@/public/images/casco/damage.jpg";
import cascoFire from "@/public/images/casco/fire.jpg";
import cascoHero from "@/public/images/casco/hero.jpg";
import cascoNatural from "@/public/images/casco/natural.jpg";
import cascoOther from "@/public/images/casco/other.jpg";
import cascoRoad from "@/public/images/casco/road.jpg";
import cascoTheft from "@/public/images/casco/theft.jpg";
import companiesHandshake from "@/public/images/companies/handshake.jpg";
import homeHero from "@/public/images/home/hero.jpg";
import lifeFamily from "@/public/images/life/family.jpg";
import lifeHealth from "@/public/images/life/health.jpg";
import lifeHero from "@/public/images/life/hero.jpg";
import propertyCasco from "@/public/images/property/casco.jpg";
import propertyFire from "@/public/images/property/fire.jpg";
import propertyHero from "@/public/images/property/hero.jpg";
import propertyInterior from "@/public/images/property/interior.jpg";
import propertyNatural from "@/public/images/property/natural.jpg";
import propertyOther from "@/public/images/property/other.jpg";
import propertyStandard from "@/public/images/property/standard.jpg";
import propertyTheft from "@/public/images/property/theft.jpg";
import propertyWater from "@/public/images/property/water.jpg";
import travelAirport from "@/public/images/travel/airport.jpg";
import travelCancellation from "@/public/images/travel/cancellation.jpg";
import travelDestination from "@/public/images/travel/destination.jpg";
import travelHero from "@/public/images/travel/hero.jpg";
import travelLuggage from "@/public/images/travel/luggage.jpg";
import travelMedical from "@/public/images/travel/medical.jpg";
import travelSupport from "@/public/images/travel/support.jpg";
import type { LocalizedText } from "@/types/insurance";

/*
 * Every photo is CC0 / public domain (sources in public/images/credits.json).
 * Static imports give next/image the intrinsic size (no layout shift) and an
 * automatic blur placeholder.
 */

export interface Photo {
  src: StaticImageData;
  alt: LocalizedText;
}

const l = (az: string, en: string, ru: string): LocalizedText => ({ az, en, ru });

export const photos = {
  homeHero: {
    src: homeHero,
    alt: l(
      "Gün batımında sahildə əl-ələ tutan ailə",
      "A family holding hands on the beach at sunset",
      "Семья держится за руки на пляже на закате",
    ),
  },
  carHero: {
    src: carHero,
    alt: l(
      "Yan güzgüdə görünən açıq yol",
      "An open road reflected in a car's side mirror",
      "Открытая дорога в боковом зеркале автомобиля",
    ),
  },
  carDriving: {
    src: carDriving,
    alt: l(
      "Gün batımında sükan arxasında sürücü",
      "A driver at the wheel at sunset",
      "Водитель за рулём на закате",
    ),
  },
  cascoHero: {
    src: cascoHero,
    alt: l("Əldə tutulan avtomobil açarı", "A hand holding car keys", "Рука с ключами от автомобиля"),
  },
  cascoRoad: {
    src: cascoRoad,
    alt: l(
      "Gecə yolunda hərəkət edən avtomobillərin işıqları",
      "Light trails of traffic at night",
      "Огни машин на ночной дороге",
    ),
  },
  cascoDamage: {
    src: cascoDamage,
    alt: l("Avtomobili təmir edən usta", "A mechanic repairing a car", "Механик ремонтирует автомобиль"),
  },
  cascoFire: { src: cascoFire, alt: l("Yanğın alovu", "Fire flames", "Языки пламени") },
  cascoNatural: {
    src: cascoNatural,
    alt: l("Sel suyunda qalmış avtomobil", "A car caught in flood water", "Автомобиль в паводковой воде"),
  },
  cascoTheft: {
    src: cascoTheft,
    alt: l(
      "Avtomobilin qapısını açmağa cəhd",
      "Someone attempting to break into a car door",
      "Попытка вскрыть дверь автомобиля",
    ),
  },
  cascoOther: {
    src: cascoOther,
    alt: l("Tufanlı səma", "A stormy sky", "Грозовое небо"),
  },
  travelHero: {
    src: travelHero,
    alt: l("Mavi səmada təyyarə qanadı", "An airplane wing in a blue sky", "Крыло самолёта в голубом небе"),
  },
  travelMedical: {
    src: travelMedical,
    alt: l("Planşetlə həkim", "A doctor holding a tablet", "Врач с планшетом"),
  },
  travelCancellation: {
    src: travelCancellation,
    alt: l("Hava limanında uçuş cədvəli", "An airport departure board", "Табло вылетов в аэропорту"),
  },
  travelLuggage: {
    src: travelLuggage,
    alt: l("Üst-üstə qoyulmuş çamadanlar", "A stack of suitcases", "Стопка чемоданов"),
  },
  travelSupport: {
    src: travelSupport,
    alt: l(
      "Telefonla danışan dəstək mütəxəssisi",
      "A support specialist on the phone",
      "Специалист поддержки разговаривает по телефону",
    ),
  },
  travelAirport: {
    src: travelAirport,
    alt: l("İşıqlı hava limanı terminalı", "A bright airport terminal", "Светлый терминал аэропорта"),
  },
  travelDestination: {
    src: travelDestination,
    alt: l(
      "Şəhər mənzərəsini seyr edən turistlər",
      "Tourists looking out over a city",
      "Туристы любуются видом на город",
    ),
  },
  propertyHero: {
    src: propertyHero,
    alt: l(
      "Axşam işıqlandırılmış müasir ev",
      "A modern house lit up at dusk",
      "Современный дом в вечерней подсветке",
    ),
  },
  propertyStandard: {
    src: propertyStandard,
    alt: l("Müasir yaşayış kompleksi", "A modern apartment building", "Современный жилой комплекс"),
  },
  propertyCasco: {
    src: propertyCasco,
    alt: l("Müasir fərdi ev", "A modern private house", "Современный частный дом"),
  },
  propertyInterior: {
    src: propertyInterior,
    alt: l("İşıqlı qonaq otağı", "A bright living room", "Светлая гостиная"),
  },
  propertyFire: { src: propertyFire, alt: l("Yanğın alovu", "Fire flames", "Языки пламени") },
  propertyWater: {
    src: propertyWater,
    alt: l("Krandan axan su", "Water running from a tap", "Вода, текущая из крана"),
  },
  propertyNatural: {
    src: propertyNatural,
    alt: l("Yağışlı pəncərədən görünən ev", "A house seen through a rainy window", "Дом за дождливым окном"),
  },
  propertyTheft: {
    src: propertyTheft,
    alt: l("Qapı kilidinə açar salınır", "A key being inserted into a door lock", "Ключ в дверном замке"),
  },
  propertyOther: {
    src: propertyOther,
    alt: l("Gecə səmasında ildırım", "Lightning in the night sky", "Молния в ночном небе"),
  },
  lifeHero: {
    src: lifeHero,
    alt: l(
      "Uşaqları ilə oynayan valideynlər",
      "Parents playing with their children",
      "Родители играют с детьми",
    ),
  },
  lifeFamily: {
    src: lifeFamily,
    alt: l("Parkda əylənən ailə", "A family having fun in a park", "Семья веселится в парке"),
  },
  lifeHealth: {
    src: lifeHealth,
    alt: l("Həkimlər komandası", "A team of doctors", "Команда врачей"),
  },
  aboutTeam: {
    src: aboutTeam,
    alt: l("Görüş zamanı komanda", "A team in a meeting", "Команда на встрече"),
  },
  companiesHandshake: {
    src: companiesHandshake,
    alt: l("Masa arxasında əl sıxışma", "A handshake across a desk", "Рукопожатие за столом"),
  },
  applySigning: {
    src: applySigning,
    alt: l("Sənədin imzalanması", "Signing a document", "Подписание документа"),
  },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;
