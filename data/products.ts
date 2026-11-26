import type { LocalizedText, ProductRecord } from "@/types/insurance";

/**
 * Phase 1 mock content store.
 *
 * Product texts are descriptive and non-binding; actual terms are defined by
 * the insurance contract. Prices live in dedicated tariff files
 * (`data/property-tariffs.ts`, `data/life-tariffs.ts`) and coverage cards in
 * `data/coverage.ts`. When the Spring Boot API arrives, these records move to
 * the backend and `lib/api/products.ts` swaps its data source.
 */

const l = (az: string, en: string, ru: string): LocalizedText => ({ az, en, ru });

export const products: ProductRecord[] = [
  /* ---------------------------------------------------------------------- */
  /*  Compulsory motor insurance                                            */
  /* ---------------------------------------------------------------------- */
  {
    slug: "car-insurance",
    heroImage: "carHero",
    cardImage: "carDriving",
    isMandatory: true,
    name: l("İcbari avtomobil sığortası", "Compulsory motor insurance", "Обязательное автострахование"),
    shortName: l("İcbari sığorta", "Compulsory motor", "Обязательное авто"),
    tagline: l(
      "Qanunla tələb olunan qoruma — onlayn və rahat",
      "The cover the law requires — online and hassle-free",
      "Обязательная по закону защита — онлайн и без лишних хлопот",
    ),
    shortDescription: l(
      "Nəqliyyat vasitəsi sahiblərinin üçüncü şəxslər qarşısında mülki məsuliyyətini qoruyan məcburi sığorta.",
      "Mandatory third-party liability cover that protects vehicle owners against claims for harm caused to others.",
      "Обязательное страхование гражданской ответственности владельцев транспортных средств перед третьими лицами.",
    ),
    description: [
      l(
        "İcbari avtomobil sığortası Azərbaycanda hər bir nəqliyyat vasitəsi sahibi üçün qanunla tələb olunan sığorta növüdür. Bu sığorta yol-nəqliyyat hadisəsi zamanı üçüncü şəxslərin həyatına, sağlamlığına və ya əmlakına vurulan zərərə görə mülki məsuliyyətinizi əhatə edir.",
        "Compulsory motor insurance is required by law for every vehicle owner in Azerbaijan. It covers your civil liability for harm caused to the life, health or property of third parties in a road traffic accident.",
        "Обязательное автострахование требуется по закону от каждого владельца транспортного средства в Азербайджане. Оно покрывает вашу гражданскую ответственность за вред, причинённый жизни, здоровью или имуществу третьих лиц в результате ДТП.",
      ),
      l(
        "SığortaPro ilə onlayn avtomobil sığortası üçün müraciət etmək sadədir: nəqliyyat vasitəsi barədə əsas məlumatları qeyd edirsiniz, mütəxəssisimiz isə sizinlə əlaqə saxlayaraq növbəti addımları izah edir.",
        "Applying online with SığortaPro is simple: share a few details about your vehicle, and our specialist will contact you to explain the next steps.",
        "Подать онлайн-заявку через SığortaPro просто: укажите основные данные об автомобиле, и наш специалист свяжется с вами, чтобы рассказать о дальнейших шагах.",
      ),
      l(
        "Qeyd: icbari sığorta yalnız üçüncü şəxslərə dəyən zərəri əhatə edir. Öz avtomobilinizi də qorumaq istəyirsinizsə, KASKO sığortasına nəzər salın.",
        "Please note: compulsory insurance covers damage to third parties only. To protect your own car as well, take a look at CASCO insurance.",
        "Обратите внимание: обязательная страховка покрывает только ущерб третьим лицам. Чтобы защитить и собственный автомобиль, рассмотрите КАСКО.",
      ),
    ],
    highlights: [
      l("Qanunla məcburi", "Required by law", "Обязательна по закону"),
      l("Üçüncü şəxslərə dəyən zərər", "Third-party damage", "Ущерб третьим лицам"),
      l("Onlayn müraciət", "Online application", "Онлайн-заявка"),
    ],
    benefits: [
      {
        title: l("Sadə onlayn müraciət", "Simple online application", "Простая онлайн-заявка"),
        description: l(
          "Bir neçə dəqiqəyə doldurula bilən aydın forma.",
          "A clear form you can complete in a few minutes.",
          "Понятная форма, которую можно заполнить за несколько минут.",
        ),
      },
      {
        title: l("Peşəkar məsləhət", "Expert guidance", "Профессиональная консультация"),
        description: l(
          "Mütəxəssisimiz suallarınızı cavablandırır və prosesi addım-addım izah edir.",
          "Our specialist answers your questions and walks you through each step.",
          "Наш специалист ответит на вопросы и объяснит процесс шаг за шагом.",
        ),
      },
      {
        title: l("Rahat ünsiyyət", "Convenient communication", "Удобная связь"),
        description: l(
          "Zəng, WhatsApp və ya onlayn forma — sizə uyğun olan kanalı seçin.",
          "Call, WhatsApp or the online form — choose what suits you.",
          "Звонок, WhatsApp или онлайн-форма — выбирайте удобный канал.",
        ),
      },
      {
        title: l("Vaxta qənaət", "Save time", "Экономия времени"),
        description: l(
          "Növbə gözləmədən, istənilən yerdən müraciət edin.",
          "Apply from anywhere, with no queues.",
          "Подавайте заявку из любого места, без очередей.",
        ),
      },
    ],
    faqs: [
      {
        question: l(
          "İcbari avtomobil sığortası nəyi əhatə edir?",
          "What does compulsory motor insurance cover?",
          "Что покрывает обязательное автострахование?",
        ),
        answer: l(
          "Bu sığorta sizin məsuliyyət daşıdığınız yol-nəqliyyat hadisəsində üçüncü şəxslərin həyatına, sağlamlığına və əmlakına dəyən zərəri qanunvericiliklə müəyyən edilmiş limitlər daxilində əhatə edir. Öz avtomobilinizə dəyən zərər isə bu sığortaya daxil deyil.",
          "It covers harm to the life, health and property of third parties in an accident you are responsible for, within the limits set by legislation. Damage to your own car is not included.",
          "Оно покрывает вред жизни, здоровью и имуществу третьих лиц в ДТП, за которое вы несёте ответственность, в пределах установленных законом лимитов. Ущерб вашему собственному автомобилю не покрывается.",
        ),
      },
      {
        question: l(
          "Sığortanın qiyməti necə müəyyən edilir?",
          "How is the price determined?",
          "Как определяется стоимость?",
        ),
        answer: l(
          "İcbari sığorta haqqı qanunvericiliklə müəyyən edilmiş qaydada, nəqliyyat vasitəsinin növü və texniki göstəriciləri (məsələn, mühərrikin həcmi) nəzərə alınmaqla hesablanır. Dəqiq məbləği öyrənmək üçün müraciət edin.",
          "The premium is calculated according to rules set by legislation, taking into account the vehicle type and technical characteristics such as engine capacity. Apply to find out the exact amount.",
          "Страховой взнос рассчитывается в порядке, установленном законодательством, с учётом типа транспортного средства и его технических характеристик, например объёма двигателя. Оставьте заявку, чтобы узнать точную сумму.",
        ),
      },
      {
        question: l(
          "Müraciət üçün hansı məlumatlar lazımdır?",
          "What information do I need to apply?",
          "Какие данные нужны для заявки?",
        ),
        answer: l(
          "Adətən nəqliyyat vasitəsinin qeydiyyat nişanı, markası və modeli, buraxılış ili və texniki göstəriciləri, həmçinin əlaqə məlumatlarınız kifayət edir. Əlavə sənəd lazım olarsa, mütəxəssisimiz bu barədə məlumat verəcək.",
          "Usually the vehicle's registration number, make and model, year of manufacture and technical details, plus your contact information. If anything else is needed, our specialist will let you know.",
          "Как правило, достаточно госномера, марки и модели автомобиля, года выпуска и технических характеристик, а также ваших контактных данных. Если потребуется что-то ещё, специалист сообщит вам.",
        ),
      },
      {
        question: l(
          "İcbari sığorta ilə KASKO arasında fərq nədir?",
          "What is the difference between compulsory insurance and CASCO?",
          "Чем обязательное страхование отличается от КАСКО?",
        ),
        answer: l(
          "İcbari sığorta qanunla məcburidir və üçüncü şəxslərə dəyən zərəri əhatə edir. KASKO isə könüllüdür və sizin öz avtomobilinizi qəza, oğurluq və digər risklərdən qoruyur.",
          "Compulsory insurance is required by law and covers damage to third parties. CASCO is voluntary and protects your own vehicle against accidents, theft and other risks.",
          "Обязательное страхование требуется по закону и покрывает ущерб третьим лицам. КАСКО — добровольное и защищает ваш собственный автомобиль от аварий, угона и других рисков.",
        ),
      },
    ],
    related: ["casco", "travel", "property"],
    seo: {
      title: l(
        "İcbari avtomobil sığortası — onlayn müraciət",
        "Compulsory Motor Insurance in Azerbaijan — Apply Online",
        "Обязательное автострахование в Азербайджане — онлайн-заявка",
      ),
      description: l(
        "İcbari avtomobil sığortası üçün onlayn müraciət edin. Üçüncü şəxslər qarşısında mülki məsuliyyətinizi SığortaPro ilə sadə və şəffaf şəkildə qoruyun.",
        "Apply online for compulsory motor insurance in Azerbaijan. Cover your third-party liability with SığortaPro — simple, clear and convenient.",
        "Онлайн-заявка на обязательное автострахование в Азербайджане. Защитите гражданскую ответственность с SığortaPro — просто, понятно и удобно.",
      ),
      keywords: [
        l("icbari avtomobil sığortası", "compulsory motor insurance", "обязательное автострахование"),
        l(
          "onlayn avtomobil sığortası",
          "online car insurance Azerbaijan",
          "автостраховка онлайн Азербайджан",
        ),
        l("icbari sığorta", "third-party liability insurance", "страхование гражданской ответственности"),
      ],
    },
  },

  /* ---------------------------------------------------------------------- */
  /*  CASCO                                                                 */
  /* ---------------------------------------------------------------------- */
  {
    slug: "casco",
    heroImage: "cascoHero",
    cardImage: "cascoHero",
    isMandatory: false,
    name: l("KASKO sığortası", "CASCO insurance", "Страхование КАСКО"),
    shortName: l("KASKO", "CASCO", "КАСКО"),
    tagline: l(
      "Avtomobiliniz üçün geniş və çevik qoruma",
      "Comprehensive, flexible protection for your car",
      "Широкая и гибкая защита вашего автомобиля",
    ),
    shortDescription: l(
      "Öz avtomobilinizi qəza, oğurluq, yanğın və təbii fəlakətlərdən qoruyan könüllü sığorta.",
      "Voluntary cover that protects your own car against accidents, theft, fire and natural disasters.",
      "Добровольное страхование, защищающее ваш автомобиль от аварий, угона, пожара и стихийных бедствий.",
    ),
    description: [
      l(
        "KASKO könüllü avtomobil sığortasıdır və birbaşa sizin nəqliyyat vasitənizi qoruyur. İcbari sığortadan fərqli olaraq, KASKO hadisədə kimin təqsirli olmasından asılı olmayaraq, müqavilədə nəzərdə tutulmuş risklər üzrə öz avtomobilinizə dəyən zərəri əhatə edə bilər.",
        "CASCO is a voluntary motor insurance that protects your own vehicle. Unlike compulsory insurance, CASCO can cover damage to your car under the risks listed in your contract, regardless of who caused the incident.",
        "КАСКО — добровольное автострахование, которое защищает ваш собственный автомобиль. В отличие от обязательного страхования, КАСКО может покрывать ущерб вашему автомобилю по рискам, указанным в договоре, независимо от того, кто виновен в происшествии.",
      ),
      l(
        "Əhatə dairəsi, azadolma məbləği (franşiza) və digər şərtlər seçdiyiniz sığorta proqramından asılıdır. SığortaPro mütəxəssisi ehtiyaclarınızı dinləyərək sizə uyğun variantı seçməyə kömək edir.",
        "The scope of cover, the deductible and other conditions depend on the programme you choose. A SığortaPro specialist will listen to your needs and help you find the right option.",
        "Объём покрытия, франшиза и другие условия зависят от выбранной программы. Специалист SığortaPro выслушает ваши пожелания и поможет подобрать подходящий вариант.",
      ),
    ],
    highlights: [
      l("Könüllü sığorta", "Voluntary cover", "Добровольное страхование"),
      l("Öz avtomobilinizin qorunması", "Protects your own car", "Защита вашего автомобиля"),
      l("Çevik şərtlər", "Flexible terms", "Гибкие условия"),
    ],
    benefits: [
      {
        title: l("Fərdi yanaşma", "Personal approach", "Индивидуальный подход"),
        description: l(
          "Avtomobilinizə və sürücülük vərdişlərinizə uyğun proqram seçimi.",
          "A programme matched to your car and the way you drive.",
          "Программа, подобранная под ваш автомобиль и стиль вождения.",
        ),
      },
      {
        title: l("Aydın şərtlər", "Clear terms", "Понятные условия"),
        description: l(
          "Əhatə dairəsi və istisnalar barədə sadə dildə izahat.",
          "Plain-language explanations of what is and isn't covered.",
          "Простое объяснение того, что покрывается, а что — нет.",
        ),
      },
      {
        title: l("Hər addımda dəstək", "Support at every step", "Поддержка на каждом этапе"),
        description: l(
          "Müraciətdən polisin rəsmiləşdirilməsinə qədər suallarınızı cavablandırırıq.",
          "We answer your questions from application through to your policy.",
          "Отвечаем на ваши вопросы — от заявки до оформления полиса.",
        ),
      },
      {
        title: l("Onlayn müraciət", "Online application", "Онлайн-заявка"),
        description: l(
          "Məlumatlarınızı onlayn qeyd edin, təklifi rahat şəkildə alın.",
          "Share your details online and receive an offer at your convenience.",
          "Укажите данные онлайн и получите предложение в удобное время.",
        ),
      },
    ],
    faqs: [
      {
        question: l("KASKO məcburidirmi?", "Is CASCO mandatory?", "КАСКО обязательно?"),
        answer: l(
          "Xeyr, KASKO könüllü sığortadır. Lakin avtomobil kreditlə alınıbsa, bank KASKO tələb edə bilər.",
          "No, CASCO is voluntary. However, if your car was bought on credit, the bank may require it.",
          "Нет, КАСКО — добровольное страхование. Однако если автомобиль куплен в кредит, банк может его потребовать.",
        ),
      },
      {
        question: l(
          "KASKO-nun qiyməti nədən asılıdır?",
          "What affects the price of CASCO?",
          "От чего зависит стоимость КАСКО?",
        ),
        answer: l(
          "Qiymət adətən avtomobilin dəyərindən, markası və modelindən, buraxılış ilindən, seçilmiş risklərdən və azadolma məbləğindən asılıdır. Dəqiq təklif üçün müraciət edin.",
          "The price usually depends on the car's value, make and model, year of manufacture, the risks you choose and the deductible. Apply for an exact offer.",
          "Обычно стоимость зависит от цены, марки и модели автомобиля, года выпуска, выбранных рисков и размера франшизы. Оставьте заявку, чтобы получить точное предложение.",
        ),
      },
      {
        question: l("Azadolma məbləği (franşiza) nədir?", "What is a deductible?", "Что такое франшиза?"),
        answer: l(
          "Azadolma — zərərin sığortaçı tərəfindən ödənilməyən və sizin üzərinizdə qalan hissəsidir. Daha yüksək azadolma adətən sığorta haqqını azaldır.",
          "A deductible is the part of a loss that you cover yourself and the insurer does not pay. A higher deductible usually lowers the premium.",
          "Франшиза — это часть ущерба, которую вы покрываете самостоятельно и которую страховщик не возмещает. Более высокая франшиза обычно снижает стоимость полиса.",
        ),
      },
      {
        question: l(
          "KASKO icbari sığortanı əvəz edirmi?",
          "Does CASCO replace compulsory insurance?",
          "Заменяет ли КАСКО обязательное страхование?",
        ),
        answer: l(
          "Xeyr. KASKO sizin avtomobilinizi qoruyur, icbari sığorta isə üçüncü şəxslər qarşısında məsuliyyətinizi əhatə edir. İcbari sığorta qanunla hər halda tələb olunur.",
          "No. CASCO protects your own car, while compulsory insurance covers your liability to third parties. Compulsory insurance is required by law in any case.",
          "Нет. КАСКО защищает ваш автомобиль, а обязательное страхование покрывает ответственность перед третьими лицами. Обязательная страховка требуется по закону в любом случае.",
        ),
      },
    ],
    related: ["car-insurance", "property", "travel"],
    seo: {
      title: l(
        "KASKO sığortası — avtomobiliniz üçün geniş qoruma",
        "CASCO Car Insurance in Azerbaijan — Comprehensive Cover",
        "Страхование КАСКО в Азербайджане — защита вашего автомобиля",
      ),
      description: l(
        "KASKO sığortası ilə avtomobilinizi qəza, oğurluq, yanğın və təbii fəlakətlərdən qoruyun. Sizə uyğun proqramı seçin və onlayn müraciət edin.",
        "Protect your car against accidents, theft, fire and natural disasters with CASCO insurance. Choose the programme that suits you and apply online.",
        "Защитите автомобиль от аварий, угона, пожара и стихийных бедствий с КАСКО. Выберите подходящую программу и оставьте онлайн-заявку.",
      ),
      keywords: [
        l("KASKO sığortası", "CASCO insurance", "КАСКО"),
        l("KASKO qiymətləri", "CASCO price Azerbaijan", "КАСКО цена Баку"),
        l("avtomobil sığortası", "car insurance Baku", "страхование автомобиля"),
      ],
    },
  },

  /* ---------------------------------------------------------------------- */
  /*  Travel                                                                */
  /* ---------------------------------------------------------------------- */
  {
    slug: "travel",
    heroImage: "travelHero",
    cardImage: "travelDestination",
    isMandatory: false,
    name: l("Səyahət sığortası", "Travel insurance", "Страхование путешественников"),
    shortName: l("Səyahət", "Travel", "Путешествия"),
    tagline: l(
      "Dünyanın istənilən yerində arxayın səyahət",
      "Travel with confidence, wherever you go",
      "Путешествуйте спокойно, куда бы вы ни отправились",
    ),
    shortDescription: l(
      "Xaricə səfər zamanı gözlənilməz tibbi xərclərə və digər risklərə qarşı qoruma.",
      "Protection against unexpected medical expenses and other risks while travelling abroad.",
      "Защита от непредвиденных медицинских расходов и других рисков во время поездок за границу.",
    ),
    description: [
      l(
        "Səyahət sığortası xaricə səfər zamanı qəfil xəstəlik və ya bədbəxt hadisə ilə bağlı tibbi xərcləri əhatə etmək üçün nəzərdə tutulub. Seçilmiş proqramdan asılı olaraq, sığorta baqajın itməsi və ya səfərin ləğvi kimi riskləri də əhatə edə bilər.",
        "Travel insurance is designed to cover medical expenses from sudden illness or accidents while you are abroad. Depending on the programme, it can also cover risks such as lost luggage or trip cancellation.",
        "Страхование путешественников покрывает медицинские расходы при внезапной болезни или несчастном случае за границей. В зависимости от программы оно также может включать такие риски, как потеря багажа или отмена поездки.",
      ),
      l(
        "Bir çox ölkələr, o cümlədən Şengen zonası ölkələri, viza üçün müraciət zamanı tibbi səyahət sığortası tələb edir. SığortaPro ilə səyahət tarixlərinizi və istiqamətinizi qeyd edin — mütəxəssisimiz uyğun variantı təklif edəcək.",
        "Many countries, including those in the Schengen Area, require travel medical insurance when you apply for a visa. Tell us your destination and travel dates, and our specialist will suggest a suitable option.",
        "Многие страны, в том числе страны Шенгенской зоны, требуют медицинскую страховку при оформлении визы. Укажите страну и даты поездки — наш специалист предложит подходящий вариант.",
      ),
    ],
    highlights: [
      l("Tibbi xərclər", "Medical expenses", "Медицинские расходы"),
      l("Səfər müddətinə uyğun", "Matched to your trip length", "С учётом длительности поездки"),
      l("Bir və ya bir neçə səyahətçi", "One or more travellers", "Один или несколько путешественников"),
    ],
    benefits: [
      {
        title: l("Səfərinizə uyğun", "Tailored to your trip", "С учётом вашей поездки"),
        description: l(
          "Ölkə, müddət və səyahətçi sayına görə uyğun proqram.",
          "A programme matched to the destination, length and number of travellers.",
          "Программа подбирается по стране, длительности и числу путешественников.",
        ),
      },
      {
        title: l("Ailə üçün rahat", "Family-friendly", "Удобно для семьи"),
        description: l(
          "Bütün ailə üzvlərini bir müraciətdə qeyd edin.",
          "Include every family member in one application.",
          "Укажите всех членов семьи в одной заявке.",
        ),
      },
      {
        title: l("Tez və sadə", "Quick and simple", "Быстро и просто"),
        description: l(
          "Səyahət məlumatlarını bir neçə addımda daxil edin.",
          "Enter your trip details in just a few steps.",
          "Введите данные о поездке за несколько шагов.",
        ),
      },
      {
        title: l("Aydın şərtlər", "Clear conditions", "Понятные условия"),
        description: l(
          "Nəyin əhatə olunduğunu səfərdən əvvəl bilin.",
          "Know what's covered before you go.",
          "Знайте, что покрывается, ещё до поездки.",
        ),
      },
    ],
    faqs: [
      {
        question: l(
          "Şengen vizası üçün səyahət sığortası lazımdırmı?",
          "Do I need travel insurance for a Schengen visa?",
          "Нужна ли страховка для шенгенской визы?",
        ),
        answer: l(
          "Bəli. Şengen vizası üçün müraciət edərkən adətən ən azı 30 000 avro məbləğində tibbi xərcləri əhatə edən səyahət sığortası tələb olunur. Dəqiq tələbləri müvafiq konsulluqdan dəqiqləşdirməyiniz tövsiyə olunur.",
          "Yes. Schengen visa applications usually require travel medical insurance covering at least €30,000. We recommend confirming the exact requirements with the relevant consulate.",
          "Да. Для шенгенской визы, как правило, требуется медицинская страховка с покрытием не менее 30 000 евро. Точные требования рекомендуем уточнить в соответствующем консульстве.",
        ),
      },
      {
        question: l(
          "Sığortanın qiyməti nədən asılıdır?",
          "What affects the price?",
          "От чего зависит стоимость?",
        ),
        answer: l(
          "Qiymət səfərin müddətindən, istiqamətdən, səyahətçilərin sayından və yaşından, həmçinin seçilmiş təminat məbləğindən asılıdır.",
          "The price depends on trip length, destination, the number and age of travellers, and the selected coverage amount.",
          "Стоимость зависит от длительности поездки, страны назначения, количества и возраста путешественников, а также выбранной страховой суммы.",
        ),
      },
      {
        question: l(
          "Sığortanı nə vaxt rəsmiləşdirmək lazımdır?",
          "When should I arrange travel insurance?",
          "Когда лучше оформлять страховку?",
        ),
        answer: l(
          "Sığortanı səfərdən əvvəl, ideal halda bilet və otel sifarişindən dərhal sonra rəsmiləşdirmək tövsiyə olunur — xüsusilə də viza üçün tələb olunursa.",
          "It's best to arrange it before your trip — ideally right after booking tickets and accommodation, especially if it's needed for a visa.",
          "Лучше оформить её до поездки — в идеале сразу после бронирования билетов и жилья, особенно если она нужна для визы.",
        ),
      },
      {
        question: l(
          "Bütün ailəni bir müraciətdə sığortalamaq olarmı?",
          "Can I insure my whole family in one application?",
          "Можно ли застраховать всю семью в одной заявке?",
        ),
        answer: l(
          "Bəli. Müraciətdə səyahətçilərin sayını qeyd edin — mütəxəssisimiz bütün ailə üçün uyğun variantları təklif edəcək.",
          "Yes. Indicate the number of travellers in your application, and our specialist will suggest suitable options for the whole family.",
          "Да. Укажите количество путешественников в заявке, и наш специалист предложит подходящие варианты для всей семьи.",
        ),
      },
    ],
    related: ["life", "property", "casco"],
    seo: {
      title: l(
        "Səyahət sığortası — xaricə səfər üçün onlayn sığorta",
        "Travel Insurance for Trips Abroad — Apply Online",
        "Страхование путешественников — туристическая страховка онлайн",
      ),
      description: l(
        "Səyahət sığortası ilə xaricdə gözlənilməz tibbi xərclərə qarşı qorunun. Şengen vizası və digər səfərlər üçün SığortaPro-da onlayn müraciət edin.",
        "Stay protected against unexpected medical costs abroad. Apply online for travel insurance for Schengen visas and other trips with SığortaPro.",
        "Защитите себя от непредвиденных медицинских расходов за границей. Онлайн-заявка на туристическую страховку для шенгенской визы и других поездок.",
      ),
      keywords: [
        l("səyahət sığortası", "travel insurance Azerbaijan", "страхование путешественников"),
        l("şengen sığortası", "Schengen travel insurance", "страховка для шенгенской визы"),
        l("tibbi səyahət sığortası", "travel medical insurance", "туристическая страховка"),
      ],
    },
  },

  /* ---------------------------------------------------------------------- */
  /*  Property                                                              */
  /* ---------------------------------------------------------------------- */
  {
    slug: "property",
    heroImage: "propertyHero",
    cardImage: "propertyCasco",
    isMandatory: false,
    name: l("Əmlak sığortası", "Property insurance", "Страхование имущества"),
    shortName: l("Əmlak", "Property", "Имущество"),
    tagline: l(
      "Eviniz və əmlakınız etibarlı qoruma altında",
      "Your home and belongings, reliably protected",
      "Ваш дом и имущество под надёжной защитой",
    ),
    shortDescription: l(
      "Region üzrə sabit qiymətli standart paket və ya əmlakın dəyərinə əsaslanan Əmlakın KASKO sığortası.",
      "A fixed-price standard package by region, or Property CASCO based on your property’s actual value.",
      "Стандартный пакет с фиксированной ценой по региону или КАСКО имущества с учётом его реальной стоимости.",
    ),
    description: [
      l(
        "Əmlak sığortası mənzilinizi, fərdi evinizi və ya kommersiya obyektinizi gözlənilməz hadisələrin maliyyə nəticələrindən qorumağa kömək edir. Sığorta həm binanın konstruksiyasını, həm də təmiri və daxili əşyaları əhatə edə bilər.",
        "Property insurance helps protect your apartment, house or commercial premises from the financial consequences of unexpected events. It can cover the structure of the building as well as interior finishes and belongings.",
        "Страхование имущества помогает защитить квартиру, частный дом или коммерческое помещение от финансовых последствий непредвиденных событий. Страховка может покрывать как конструктив здания, так и внутреннюю отделку и вещи.",
      ),
      l(
        "İki seçim mövcuddur: standart əmlak sığortası region üzrə sabit təminat məbləği və sabit qiymətlə təqdim olunur, Əmlakın KASKO sığortası isə əmlakın faktiki dəyərinə və polis şərtlərinə əsasən fərdi qaydada hesablanır.",
        "There are two options: standard property insurance comes with a fixed sum insured and a fixed price per region, while Property CASCO is priced individually based on the property’s actual value and the policy conditions.",
        "Доступны два варианта: стандартное страхование имущества с фиксированной страховой суммой и ценой по региону и КАСКО имущества, стоимость которого рассчитывается индивидуально с учётом реальной стоимости объекта и условий полиса.",
      ),
    ],
    highlights: [
      l("Region üzrə sabit qiymət", "Fixed price by region", "Фиксированная цена по региону"),
      l("Mənzil və fərdi ev", "Apartments and houses", "Квартиры и дома"),
      l("Dəyərə əsaslanan KASKO", "Value-based CASCO", "КАСКО по стоимости"),
    ],
    benefits: [
      {
        title: l("Fərdi qiymətləndirmə", "Individual assessment", "Индивидуальная оценка"),
        description: l(
          "Əmlakınızın növü və dəyərinə uyğun təklif.",
          "An offer based on your property type and value.",
          "Предложение с учётом типа и стоимости вашего имущества.",
        ),
      },
      {
        title: l("İki aydın seçim", "Two clear options", "Два понятных варианта"),
        description: l(
          "Standart paket və ya əmlakın dəyərinə əsaslanan KASKO.",
          "A standard package or value-based CASCO.",
          "Стандартный пакет или КАСКО по стоимости имущества.",
        ),
      },
      {
        title: l("Uzunmüddətli rahatlıq", "Long-term peace of mind", "Долгосрочное спокойствие"),
        description: l(
          "Evinizlə bağlı gözlənilməz xərclərə qarşı maliyyə dayağı.",
          "Financial support against unexpected home-related costs.",
          "Финансовая поддержка при непредвиденных расходах, связанных с домом.",
        ),
      },
      {
        title: l("Sadə müraciət", "Easy application", "Простая заявка"),
        description: l(
          "Ünvan və əsas məlumatları qeyd etmək kifayətdir.",
          "Just share the address and a few key details.",
          "Достаточно указать адрес и основные данные.",
        ),
      },
    ],
    faqs: [
      {
        question: l(
          "Kirayədə yaşadığım mənzili sığortalaya bilərəmmi?",
          "Can I insure a rented apartment?",
          "Можно ли застраховать арендованную квартиру?",
        ),
        answer: l(
          "Bəli. Kirayəçi olaraq öz əşyalarınızı və qonşular qarşısında məsuliyyətinizi sığortalaya bilərsiniz. Binanın özünün sığortası isə adətən mülkiyyətçi tərəfindən rəsmiləşdirilir.",
          "Yes. As a tenant you can insure your own belongings and your liability to neighbours. Insurance for the building itself is usually arranged by the owner.",
          "Да. Как арендатор вы можете застраховать свои вещи и ответственность перед соседями. Страхование самого объекта обычно оформляет собственник.",
        ),
      },
      {
        question: l(
          "Əmlakın dəyəri necə müəyyən edilir?",
          "How is the property value determined?",
          "Как определяется стоимость имущества?",
        ),
        answer: l(
          "Müraciətdə təxmini dəyəri qeyd edirsiniz. Dəqiq sığorta məbləği isə əmlakın növü, vəziyyəti və bazar dəyəri nəzərə alınmaqla razılaşdırılır.",
          "You provide an estimated value in your application. The final sum insured is agreed based on the property type, condition and market value.",
          "В заявке вы указываете ориентировочную стоимость. Окончательная страховая сумма согласовывается с учётом типа, состояния и рыночной стоимости объекта.",
        ),
      },
      {
        question: l(
          "Standart sığorta ilə Əmlakın KASKO sığortası arasında fərq nədir?",
          "What is the difference between standard insurance and Property CASCO?",
          "Чем стандартное страхование отличается от КАСКО имущества?",
        ),
        answer: l(
          "Standart sığortada təminat məbləği və qiymət region üzrə sabitdir. Əmlakın KASKO sığortasında isə təminat əmlakın faktiki dəyərinə və polis şərtlərinə əsaslanır, qiymət fərdi qaydada hesablanır.",
          "With standard insurance, the sum insured and price are fixed by region. With Property CASCO, cover is based on the property’s actual value and the policy conditions, and the price is calculated individually.",
          "В стандартном страховании страховая сумма и цена фиксированы по региону. В КАСКО имущества покрытие зависит от реальной стоимости объекта и условий полиса, а цена рассчитывается индивидуально.",
        ),
      },
      {
        question: l(
          "Kommersiya obyektlərini də sığortalamaq olarmı?",
          "Can commercial properties be insured too?",
          "Можно ли застраховать коммерческую недвижимость?",
        ),
        answer: l(
          "Bəli, ofis, mağaza, anbar və digər kommersiya obyektləri üçün də müraciət edə bilərsiniz.",
          "Yes, you can also apply for offices, shops, warehouses and other commercial premises.",
          "Да, вы можете подать заявку и для офисов, магазинов, складов и других коммерческих объектов.",
        ),
      },
    ],
    related: ["life", "casco", "car-insurance"],
    seo: {
      title: l(
        "Əmlak sığortası — mənzil və ev sığortası",
        "Property Insurance — Home and Apartment Cover",
        "Страхование имущества — страховка квартиры и дома",
      ),
      description: l(
        "Mənzilinizi, evinizi və ya kommersiya obyektinizi yanğın, su basması, təbii fəlakət və oğurluqdan qoruyun. Əmlak sığortası üçün onlayn müraciət edin.",
        "Protect your apartment, house or commercial property against fire, water damage, natural disasters and theft. Apply online for property insurance.",
        "Защитите квартиру, дом или коммерческий объект от пожара, затопления, стихийных бедствий и кражи. Онлайн-заявка на страхование имущества.",
      ),
      keywords: [
        l("əmlak sığortası", "property insurance Azerbaijan", "страхование имущества"),
        l("mənzil sığortası", "apartment insurance", "страхование квартиры"),
        l("ev sığortası", "home insurance Baku", "страхование дома"),
      ],
    },
  },

  /* ---------------------------------------------------------------------- */
  /*  Life                                                                  */
  /* ---------------------------------------------------------------------- */
  {
    slug: "life",
    heroImage: "lifeHero",
    cardImage: "lifeFamily",
    isMandatory: false,
    name: l("Güvənli həyat sığortası", "Secure life insurance", "Надёжное страхование жизни"),
    shortName: l("Həyat", "Life", "Жизнь"),
    tagline: l(
      "Yaxınlarınızın gələcəyi üçün etibarlı dayaq",
      "Dependable support for your loved ones' future",
      "Надёжная опора для будущего ваших близких",
    ),
    shortDescription: l(
      "Gözlənilməz hallarda ailənizə maliyyə dəstəyi təmin etməyə yönəlmiş uzunmüddətli qoruma.",
      "Long-term protection designed to provide financial support for your family when the unexpected happens.",
      "Долгосрочная защита, которая помогает обеспечить финансовую поддержку семьи в непредвиденных обстоятельствах.",
    ),
    description: [
      l(
        "Həyat sığortası sizin və ailənizin maliyyə sabitliyini qorumağa yönəlmiş uzunmüddətli həlldir. Müqavilədə nəzərdə tutulmuş sığorta hadisəsi baş verdikdə, sığorta ödənişi yaxınlarınıza çətin anlarda dəstək ola bilər.",
        "Life insurance is a long-term solution that helps protect your family's financial stability. If an insured event defined in the contract occurs, the insurance payment can support your loved ones through difficult times.",
        "Страхование жизни — долгосрочное решение, которое помогает защитить финансовую стабильность вашей семьи. При наступлении страхового случая, предусмотренного договором, страховая выплата может поддержать ваших близких в трудный момент.",
      ),
      l(
        "Qiymət yaş qrupunuzdan, seçdiyiniz təminat məbləğindən və sığorta kateqoriyasından asılıdır: sağalmaz xəstəliklərdən sığorta, istənilən səbəbdən ölüm və ya hər ikisi birlikdə. SığortaPro mütəxəssisi variantları aydın şəkildə izah edərək düzgün qərar verməyinizə kömək edir.",
        "The price depends on your age group, the coverage amount and the insurance category: critical illness cover, death from any cause, or both combined. A SığortaPro specialist will clearly explain the options so you can make the right decision.",
        "Стоимость зависит от возрастной группы, страховой суммы и категории страхования: от неизлечимых заболеваний, смерти по любой причине или обоих рисков вместе. Специалист SığortaPro понятно объяснит варианты, чтобы вы могли принять верное решение.",
      ),
    ],
    highlights: [
      l("Ailə üçün maliyyə dayağı", "Financial support for family", "Финансовая опора семьи"),
      l("3 sığorta kateqoriyası", "3 insurance categories", "3 категории страхования"),
      l("5 000 – 50 000 AZN təminat", "AZN 5,000–50,000 cover", "Покрытие 5 000 – 50 000 AZN"),
    ],
    benefits: [
      {
        title: l("Ailənizin rifahı", "Your family's wellbeing", "Благополучие семьи"),
        description: l(
          "Yaxınlarınız üçün maliyyə dayağı yaradın.",
          "Build a financial safety net for your loved ones.",
          "Создайте финансовую подушку для близких.",
        ),
      },
      {
        title: l("Fərdi plan", "Personal plan", "Индивидуальный план"),
        description: l(
          "Müddət və məbləğ ehtiyaclarınıza uyğun seçilir.",
          "Term and amount matched to your needs.",
          "Срок и сумма подбираются под ваши потребности.",
        ),
      },
      {
        title: l("Şəffaf izahat", "Transparent explanations", "Прозрачные объяснения"),
        description: l(
          "Şərtlər və istisnalar barədə aydın məlumat.",
          "Clear information about terms and exclusions.",
          "Понятная информация об условиях и исключениях.",
        ),
      },
      {
        title: l("Konfidensiallıq", "Confidentiality", "Конфиденциальность"),
        description: l(
          "Şəxsi məlumatlarınıza həssas yanaşma.",
          "Careful handling of your personal information.",
          "Бережное отношение к вашим персональным данным.",
        ),
      },
    ],
    faqs: [
      {
        question: l(
          "Həyat sığortasını kim rəsmiləşdirə bilər?",
          "Who can take out life insurance?",
          "Кто может оформить страхование жизни?",
        ),
        answer: l(
          "Tarif cədvəli 0–65 yaş aralığını əhatə edir. Dəqiq tələblər seçilmiş proqramdan asılıdır.",
          "The tariff table covers ages 0 to 65. Exact requirements depend on the chosen programme.",
          "Тарифная таблица охватывает возраст от 0 до 65 лет. Точные требования зависят от выбранной программы.",
        ),
      },
      {
        question: l(
          "Sığorta müddətini necə seçim?",
          "How do I choose the term?",
          "Как выбрать срок страхования?",
        ),
        answer: l(
          "Müddəti maliyyə öhdəliklərinizə və planlarınıza görə seçmək məqsədəuyğundur — məsələn, kredit müddəti və ya uşaqların təhsil illəri. Mütəxəssisimiz bu barədə məsləhət verəcək.",
          "It's best to align the term with your financial commitments and plans — for example, a loan term or your children's school years. Our specialist can advise you.",
          "Срок разумно выбирать с учётом финансовых обязательств и планов — например, срока кредита или лет обучения детей. Наш специалист проконсультирует вас.",
        ),
      },
      {
        question: l("Faydalanan şəxs kimdir?", "Who is a beneficiary?", "Кто такой выгодоприобретатель?"),
        answer: l(
          "Faydalanan şəxs sığorta hadisəsi baş verdikdə ödənişi alacaq şəxsdir. Onu müqavilə bağlanarkən siz özünüz təyin edirsiniz.",
          "A beneficiary is the person who receives the payment if an insured event occurs. You name them when the contract is signed.",
          "Выгодоприобретатель — это человек, который получит выплату при наступлении страхового случая. Вы назначаете его при заключении договора.",
        ),
      },
      {
        question: l(
          "Tibbi müayinə tələb olunurmu?",
          "Is a medical examination required?",
          "Нужно ли медицинское обследование?",
        ),
        answer: l(
          "Bu, yaşınızdan, sığorta məbləğindən və proqramdan asılıdır. Bəzi hallarda sağlamlıq anketi kifayət edir.",
          "It depends on your age, the sum insured and the programme. In some cases a health questionnaire is enough.",
          "Это зависит от возраста, страховой суммы и программы. В некоторых случаях достаточно анкеты о здоровье.",
        ),
      },
    ],
    related: ["property", "travel", "casco"],
    seo: {
      title: l(
        "Həyat sığortası — ailəniz üçün etibarlı qoruma",
        "Life Insurance — Dependable Protection for Your Family",
        "Страхование жизни — надёжная защита для вашей семьи",
      ),
      description: l(
        "Güvənli həyat sığortası ilə yaxınlarınızın maliyyə gələcəyini qoruyun. Sizə uyğun müddət və proqramı seçin, onlayn müraciət edin.",
        "Protect your loved ones' financial future with life insurance. Choose the term and programme that suit you and apply online.",
        "Защитите финансовое будущее близких со страхованием жизни. Выберите подходящий срок и программу и оставьте онлайн-заявку.",
      ),
      keywords: [
        l("həyat sığortası", "life insurance Azerbaijan", "страхование жизни"),
        l("güvənli həyat sığortası", "term life insurance", "рисковое страхование жизни"),
        l("yığım həyat sığortası", "savings life insurance", "накопительное страхование жизни"),
      ],
    },
  },
];
