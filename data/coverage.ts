import type { PhotoKey } from "@/data/images";
import type { InsuranceSlug, LocalizedText } from "@/types/insurance";

/**
 * Potential coverage categories shown as visual cards.
 *
 * These are ILLUSTRATIVE until the confirmed policy conditions are provided:
 * the UI always shows them with a "may include / per contract" note and never
 * as a contractual guarantee. Edit or replace freely; `confirmed` flips the
 * note off once the business has verified a list.
 */

export interface CoverageRecord {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  image?: PhotoKey;
  /** Icon key rendered by `CoverageIcon` when no photo is used. */
  icon?:
    "users" | "building" | "badge" | "ribbon" | "brain" | "heart" | "kidney" | "paralysis" | "transplant";
}

export interface CoverageGroup {
  /** `false` → shown as "potential coverage" with a disclaimer. */
  confirmed: boolean;
  items: CoverageRecord[];
}

const l = (az: string, en: string, ru: string): LocalizedText => ({ az, en, ru });

export const coverage: Record<InsuranceSlug, CoverageGroup> = {
  /* Statutory third-party liability — what the law-defined cover is about. */
  "car-insurance": {
    confirmed: false,
    items: [
      {
        id: "third-party-health",
        icon: "users",
        title: l(
          "Üçüncü şəxslərin həyatı və sağlamlığı",
          "Third parties’ life and health",
          "Жизнь и здоровье третьих лиц",
        ),
        description: l(
          "Yol-nəqliyyat hadisəsində digər şəxslərə vurulan zərər — qanunvericilikdə nəzərdə tutulmuş limitlər daxilində.",
          "Harm caused to other people in a road accident, within the limits set by legislation.",
          "Вред, причинённый другим людям в ДТП, — в пределах лимитов, установленных законодательством.",
        ),
      },
      {
        id: "third-party-property",
        icon: "building",
        title: l("Üçüncü şəxslərin əmlakı", "Third-party property", "Имущество третьих лиц"),
        description: l(
          "Digər avtomobillərə, binalara və ya başqa əmlaka dəyən zərər — qanunvericiliklə müəyyən olunmuş limitlər çərçivəsində.",
          "Damage to other vehicles, buildings or property, within the statutory limits.",
          "Ущерб другим автомобилям, зданиям или имуществу — в пределах установленных законом лимитов.",
        ),
      },
      {
        id: "legal-compliance",
        icon: "badge",
        title: l("Qanuni tələbə uyğunluq", "Legal compliance", "Соответствие закону"),
        description: l(
          "Qüvvədə olan polis nəqliyyat vasitəsini qanunvericiliyin tələblərinə uyğun idarə etməyə imkan verir.",
          "A valid policy lets you drive in line with legal requirements.",
          "Действующий полис позволяет управлять автомобилем в соответствии с требованиями закона.",
        ),
      },
    ],
  },

  casco: {
    confirmed: false,
    items: [
      {
        id: "road-accidents",
        image: "cascoRoad",
        title: l("Yol-nəqliyyat hadisələri", "Road traffic accidents", "Дорожно-транспортные происшествия"),
        description: l(
          "Toqquşma, aşma və digər yol hadisələri nəticəsində avtomobilə dəyən zərər.",
          "Damage to your car from collisions, rollovers and other road incidents.",
          "Ущерб автомобилю от столкновений, опрокидывания и других дорожных происшествий.",
        ),
      },
      {
        id: "vehicle-damage",
        image: "cascoDamage",
        title: l("Avtomobilin zədələnməsi", "Vehicle damage", "Повреждение автомобиля"),
        description: l(
          "Kuzov, şüşə və digər hissələrin zədələnməsi ilə bağlı təmir xərcləri.",
          "Repair costs for damage to the body, glass and other parts.",
          "Расходы на ремонт кузова, стёкол и других частей автомобиля.",
        ),
      },
      {
        id: "fire",
        image: "cascoFire",
        title: l("Yanğın", "Fire", "Пожар"),
        description: l(
          "Yanğın və ya partlayış nəticəsində avtomobilə dəyən zərər.",
          "Damage to the car caused by fire or explosion.",
          "Ущерб автомобилю в результате пожара или взрыва.",
        ),
      },
      {
        id: "natural-disasters",
        image: "cascoNatural",
        title: l("Təbii fəlakətlər", "Natural disasters", "Стихийные бедствия"),
        description: l(
          "Sel, dolu, güclü külək və digər təbii hadisələrin vurduğu zərər.",
          "Damage from floods, hail, strong winds and other natural events.",
          "Ущерб от наводнения, града, сильного ветра и других природных явлений.",
        ),
      },
      {
        id: "theft",
        image: "cascoTheft",
        title: l("Oğurluq", "Theft", "Угон"),
        description: l(
          "Avtomobilin oğurlanması və ya oğurlanmasına cəhd zamanı dəyən zərər.",
          "Theft of the car or damage from an attempted theft.",
          "Угон автомобиля или ущерб при попытке угона.",
        ),
      },
      {
        id: "other",
        image: "cascoOther",
        title: l("Digər gözlənilməz hadisələr", "Other unexpected events", "Другие непредвиденные события"),
        description: l(
          "Müqavilədə nəzərdə tutulmuş digər gözlənilməz hallar.",
          "Other unforeseen events defined in the contract.",
          "Другие непредвиденные случаи, предусмотренные договором.",
        ),
      },
    ],
  },

  travel: {
    confirmed: false,
    items: [
      {
        id: "medical",
        image: "travelMedical",
        title: l("Tibbi yardım", "Medical assistance", "Медицинская помощь"),
        description: l(
          "Səfər zamanı qəfil xəstəlik və ya bədbəxt hadisə ilə bağlı müalicə xərcləri.",
          "Treatment costs for sudden illness or an accident during your trip.",
          "Расходы на лечение при внезапной болезни или несчастном случае в поездке.",
        ),
      },
      {
        id: "cancellation",
        image: "travelCancellation",
        title: l("Səyahətin ləğvi", "Trip cancellation", "Отмена поездки"),
        description: l(
          "Üzrlü səbəbdən səfərin ləğvi ilə bağlı xərclər.",
          "Costs of cancelling your trip for a valid reason.",
          "Расходы, связанные с отменой поездки по уважительной причине.",
        ),
      },
      {
        id: "luggage",
        image: "travelLuggage",
        title: l(
          "Baqajın itməsi və ya zədələnməsi",
          "Lost or damaged luggage",
          "Потеря или повреждение багажа",
        ),
        description: l(
          "Səfər zamanı baqajın itməsi, gecikməsi və ya zədələnməsi.",
          "Luggage that is lost, delayed or damaged on your trip.",
          "Потеря, задержка или повреждение багажа во время поездки.",
        ),
      },
      {
        id: "support",
        image: "travelSupport",
        title: l("Dəstək xidmətləri", "Assistance services", "Сервисная поддержка"),
        description: l(
          "Səfər zamanı yaranan suallar və çətin hallarda yardım.",
          "Help with questions and difficult situations while you travel.",
          "Помощь с вопросами и в сложных ситуациях во время поездки.",
        ),
      },
    ],
  },

  /* Voluntary Property CASCO — NOT the standard (fixed-price) package. */
  property: {
    confirmed: false,
    items: [
      {
        id: "fire-explosion",
        image: "propertyFire",
        title: l("Yanğın və partlayış", "Fire and explosion", "Пожар и взрыв"),
        description: l(
          "Yanğın, ildırım vurması və ya partlayış nəticəsində dəyən zərər.",
          "Damage caused by fire, lightning or explosion.",
          "Ущерб от пожара, удара молнии или взрыва.",
        ),
      },
      {
        id: "water",
        image: "propertyWater",
        title: l("Su basması", "Water damage", "Затопление"),
        description: l(
          "Su, kanalizasiya və istilik sistemlərindən sızma nəticəsində dəyən zərər.",
          "Damage from leaks in water, sewage and heating systems.",
          "Ущерб от протечек систем водоснабжения, канализации и отопления.",
        ),
      },
      {
        id: "natural",
        image: "propertyNatural",
        title: l("Təbii fəlakətlər", "Natural disasters", "Стихийные бедствия"),
        description: l(
          "Zəlzələ, sel, güclü külək və digər təbii hadisələr.",
          "Earthquakes, floods, storms and other natural events.",
          "Землетрясение, наводнение, сильный ветер и другие природные явления.",
        ),
      },
      {
        id: "theft",
        image: "propertyTheft",
        title: l(
          "Oğurluq və qanunsuz müdaxilə",
          "Theft and unlawful entry",
          "Кража и незаконное проникновение",
        ),
        description: l(
          "Oğurluq, soyğunçuluq və üçüncü şəxslərin qanunsuz hərəkətləri.",
          "Burglary, robbery and unlawful acts of third parties.",
          "Кража, грабёж и противоправные действия третьих лиц.",
        ),
      },
      {
        id: "other",
        image: "propertyOther",
        title: l("Digər gözlənilməz hadisələr", "Other unexpected events", "Другие непредвиденные события"),
        description: l(
          "Müqavilədə nəzərdə tutulmuş digər gözlənilməz hallar.",
          "Other unforeseen events defined in the contract.",
          "Другие непредвиденные случаи, предусмотренные договором.",
        ),
      },
    ],
  },

  /* Critical-illness list (respectful icons, no medical imagery). */
  life: {
    confirmed: false,
    items: [
      {
        id: "cancer",
        icon: "ribbon",
        title: l("Xərçəng xəstəliyi", "Cancer", "Онкологическое заболевание"),
        description: l(
          "Bədxassəli şiş diaqnozu — müqavilə şərtlərinə uyğun olaraq.",
          "A diagnosis of a malignant tumour, according to the contract terms.",
          "Диагноз злокачественной опухоли — согласно условиям договора.",
        ),
      },
      {
        id: "stroke",
        icon: "brain",
        title: l("İnsult", "Stroke", "Инсульт"),
        description: l(
          "Beyin qan dövranının kəskin pozulması.",
          "An acute disruption of blood flow to the brain.",
          "Острое нарушение мозгового кровообращения.",
        ),
      },
      {
        id: "heart-attack",
        icon: "heart",
        title: l("Miokard infarktı", "Heart attack", "Инфаркт миокарда"),
        description: l(
          "Ürək əzələsinin qan təchizatının kəskin pozulması.",
          "An acute interruption of the blood supply to the heart muscle.",
          "Острое нарушение кровоснабжения сердечной мышцы.",
        ),
      },
      {
        id: "kidney-failure",
        icon: "kidney",
        title: l("Böyrək çatışmazlığı", "Kidney failure", "Почечная недостаточность"),
        description: l(
          "Hər iki böyrəyin funksiyasının xroniki və geri dönməz itirilməsi.",
          "Chronic, irreversible loss of function of both kidneys.",
          "Хроническая необратимая потеря функции обеих почек.",
        ),
      },
      {
        id: "paralysis",
        icon: "paralysis",
        title: l("İflic", "Paralysis", "Паралич"),
        description: l(
          "Ətrafların funksiyasının tam və daimi itirilməsi.",
          "Complete and permanent loss of use of limbs.",
          "Полная и постоянная утрата функции конечностей.",
        ),
      },
      {
        id: "organ-transplant",
        icon: "transplant",
        title: l("Orqan transplantasiyası", "Organ transplant", "Трансплантация органов"),
        description: l(
          "Həyati vacib orqanın transplantasiyasına ehtiyac.",
          "The need for a transplant of a vital organ.",
          "Необходимость пересадки жизненно важного органа.",
        ),
      },
    ],
  },
};
