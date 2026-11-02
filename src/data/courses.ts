import { Course, Instructor, Coupon } from '../types/index.ts';

export const INITIAL_INSTRUCTORS: Instructor[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Ustadh Mohamed Omar',
    title: 'Head of German Studies & Goethe Examiner Prep',
    bio: 'Specialist in German as a foreign language (DaF) with over 9 years teaching Somali students in Heidelberg and Berlin. Helped 1,800+ students pass Goethe A1-B2 with 98% pass rate.',
    bio_somali: 'Khabiir ku takhasusay baridda Af-Jarmalka (DaF) oo in ka badan 9 sano wax ka dhigayay magaalooyinka Heidelberg iyo Berlin. Wuxuu ka caawiyay 1,800+ arday inay ku guuleystaan imtixaanka Goethe A1-B2.',
    qualification: 'Goethe-Zertifikat C2 / Uni Heidelberg M.A.',
    location: 'Berlin, Germany',
    avatar_url: '/assets/aistudio/05F8C6A4-5FFB-4D4A-B2E5-11DF7B585E48_8e6b0422.jpeg',
    rating: 4.98,
    total_students: 2450
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'Dr. Deqa Abdi',
    title: 'Medical German & Nursing Integration Lead',
    bio: 'Medical doctor and certified German healthcare communication trainer in Munich. Leads specialized clinical terminology and Fachsprachenprüfung (FSP) preparation for Somali nurses and doctors.',
    bio_somali: 'Dhakhtarad iyo tababare caafimaad oo ku nool Munich. Waxay horkacdaa koorsada gaarka ah ee kalkaaliyeyaasha iyo dhakhaatiirta Soomaaliyeed ee u diyaargaroobaya shaqada Isbitaallada Jarmalka.',
    qualification: 'Approbation / LMU Munich Medical Faculty',
    location: 'Munich, Germany',
    avatar_url: '/assets/aistudio/05F8C6A4-5FFB-4D4A-B2E5-11DF7B585E48_8e6b0422.jpeg',
    rating: 4.95,
    total_students: 980
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'c1',
    code: 'JARMAL50',
    discount_type: 'percentage',
    discount_value: 50,
    min_order_amount: 20,
    max_uses: 1000,
    current_uses: 42,
    is_active: true
  },
  {
    id: 'c2',
    code: 'SOMALIA20',
    discount_type: 'fixed',
    discount_value: 20,
    min_order_amount: 30,
    max_uses: 500,
    current_uses: 18,
    is_active: true
  },
  {
    id: 'c3',
    code: 'BISMILLAH',
    discount_type: 'percentage',
    discount_value: 30,
    min_order_amount: 15,
    max_uses: 500,
    current_uses: 89,
    is_active: true
  },
  {
    id: 'c4',
    code: 'AUSBILDUNG',
    discount_type: 'fixed',
    discount_value: 15,
    min_order_amount: 25,
    max_uses: 200,
    current_uses: 12,
    is_active: true
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: '10000000-0000-0000-0000-000000000001',
    title: 'German A1: Complete Beginner to Goethe Certification',
    title_somali: 'Af-Jarmalka A1: Bilow ilaa Shahaadada Goethe-Zertifikat',
    slug: 'german-a1-somali-beginner',
    level: 'A1',
    language_from: 'German',
    language_to: 'Somali',
    short_description: 'Master basic German pronunciation, articles (der/die/das), everyday dialogues, and pass Goethe A1 with top score.',
    short_description_somali: 'Baro aasaaska af-jarmalka, alifbeetada, dhismaha weedhaha, iyo sida loogu baaso imtixaanka Goethe A1 si fudud adigoo af-soomaali ku baranaya.',
    description: 'Koorsadan A1 waa aasaaska ugu muhiimsan ee qof kasta oo raba inuu barto luuqadda Jarmalka ama u socdaala dalka Jarmalka. Waxaad ku baranaysaa naxwaha aasaasiga ah, sida loo hadlo maalin kasta, fahamka dhawaaqa Jarmalka, iyo farsamooyinka lagu baaso imtixaanka safaaradda.',
    description_somali: 'Casharrada waxaa lagu bixinayaa af-soomaali cad oo la fahmi karo iyadoo la adeegsanayo tusaalayaal nololeed. Waxaad heli doontaa qoraallo kooban, laylisyo, iyo imtixaanno tusaale ah oo u eg kuwa dhabta ah ee Goethe-Zertifikat A1.',
    learning_outcomes: [
      'Alifbeetada iyo dhawaaqa saxda ah ee xarfaha gaarka ah (ä, ö, ü, ß)',
      'Adeegsiga saxda ah ee qodobada (der, die, das) iyo kala duwanaanshahooda',
      'Wadahadalka maalinlaha ah: Isbarashada, dalbashada cuntada, iyo wax iibsiga',
      'Dhismaha weedhaha naxwaha iyo isticmaalka ficillada aasaasiga ah (sein, haben)',
      'Xeeladaha iyo farsamooyinka lagu gudbo 4-ta qaybood ee imtixaanka Goethe A1'
    ],
    price: 49.00,
    discount_price: 29.00,
    thumbnail_url: '/assets/aistudio/05F8C6A4-5FFB-4D4A-B2E5-11DF7B585E48_8e6b0422.jpeg',
    instructor_id: '00000000-0000-0000-0000-000000000001',
    instructor: INITIAL_INSTRUCTORS[0],
    featured: true,
    total_hours: 28.5,
    total_lessons: 36,
    badge_label: 'Ugu Caansan (Best Seller)',
    certificate_included: true,
    is_published: true,
    lessons: [
      {
        id: 'les-a1-01',
        course_id: '10000000-0000-0000-0000-000000000001',
        module_title: 'Module 1: Hordhac & Alifbeetada Jarmalka (Das Alphabet & Aussprache)',
        module_order: 1,
        title: 'Lesson 1: German Alphabet & Special Letters (ä, ö, ü, ß)',
        title_somali: 'Casharka 1: Alifbeetada Jarmalka & Xarfaha Gaarka Ah',
        order_index: 1,
        video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        duration: '18:40',
        is_preview: true,
        notes_somali: 'Casharkan waxaan ku baranaynaa 26-ka xaraf ee alifbeetada Jarmalka iyo 4-ta xaraf ee gaarka ah: Ä (A-Umlaut), Ö (O-Umlaut), Ü (U-Umlaut), iyo ß (Eszett). Baro sida carabka loo dhigo si aad ugu dhawaaqdo sida dadka u dhashay.',
        notes_german: 'In dieser Lektion lernen wir das deutsche Alphabet und die Umlaute kennen: A, B, C... sowie Ä, Ö, Ü und das Eszett (ß). Die korrekte Aussprache ist der Schlüssel zum Erfolg.',
        vocabulary: [
          { german: 'Guten Tag', somali: 'Galab wanaagsan / Maalin wanaagsan', example_german: 'Guten Tag, wie geht es Ihnen?', example_somali: 'Maalin wanaagsan, sidee tahay?' },
          { german: 'Auf Wiedersehen', somali: 'Nabadgelyo / Kulanti dambe', example_german: 'Auf Wiedersehen, bis morgen!', example_somali: 'Nabadgelyo, ilaa berri!' },
          { german: 'Danke schön', somali: 'Mahadsanid badan', example_german: 'Danke schön für Ihre Hilfe.', example_somali: 'Waad ku mahadsan tahay caawintaada.' },
          { german: 'Bitte', somali: 'Adaa mudan / Fadlan', example_german: 'Ein Glas Wasser, bitte.', example_somali: 'Galaas biyo ah, fadlan.' }
        ],
        resources: [
          { id: 'res-1', title: 'German Alphabet & Phonetics Cheat Sheet (PDF)', type: 'pdf', size: '1.2 MB', download_url: '#' },
          { id: 'res-2', title: 'Audio Pronunciation Exercises (MP3)', type: 'audio', size: '4.8 MB', download_url: '#' }
        ]
      },
      {
        id: 'les-a1-02',
        course_id: '10000000-0000-0000-0000-000000000001',
        module_title: 'Module 1: Hordhac & Alifbeetada Jarmalka (Das Alphabet & Aussprache)',
        module_order: 1,
        title: 'Lesson 2: Greetings, Introductions & Numbers 1-100',
        title_somali: 'Casharka 2: Salaanta, Isbarashada & Tirada 1 ilaa 100',
        order_index: 2,
        video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        duration: '22:15',
        is_preview: true,
        notes_somali: 'Baro sida aad isku bari lahayd qof Jarmal ah: Magacaaga (Ich heiße...), da\'daada (Ich bin ... Jahre alt), wadanka aad ka timid (Ich komme aus Somalia), iyo halka aad deggan tahay (Ich wohne in Berlin).',
        notes_german: 'Sich vorstellen: Name, Herkunft, Wohnort und Zahlen von 1 bis 100.',
        vocabulary: [
          { german: 'Ich heiße...', somali: 'Magacaygu waa...', example_german: 'Ich heiße Yahye.', example_somali: 'Magacaygu waa Yahye.' },
          { german: 'Woher kommen Sie?', somali: 'Xaggee ka timid? (Si xushmad leh)', example_german: 'Woher kommen Sie? - Ich komme aus Somalia.', example_somali: 'Xaggee ka timid? - Waxaan ka imid Soomaaliya.' },
          { german: 'Freut mich', somali: 'Waan ku faraxsanahay barashadaada', example_german: 'Sehr erfreut, Herr Omar.', example_somali: 'Aad baan ugu faraxsanahay barashadaada, Mudane Cumar.' }
        ],
        resources: [
          { id: 'res-3', title: 'Introduction Dialogue Templates (PDF)', type: 'pdf', size: '850 KB', download_url: '#' }
        ]
      },
      {
        id: 'les-a1-03',
        course_id: '10000000-0000-0000-0000-000000000001',
        module_title: 'Module 2: Magacyada & Qodobada (der, die, das)',
        module_order: 2,
        title: 'Lesson 3: Gender of Nouns & Definite Articles',
        title_somali: 'Casharka 3: Jinsiga Magacyada & Qodobada der, die, das',
        order_index: 3,
        video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        duration: '26:50',
        is_preview: false,
        notes_somali: 'Af-Jarmalka magac kasta wuxuu leeyahay jinsi: Lab (Maskulin - der), Dheddig (Feminin - die), ama Dhex-dhexaad (Neutral - das). Casharkan waxaan ku baranaynaa xeelado fudud oo aad ku garan karto qodobka saxda ah.',
        notes_german: 'Die bestimmten Artikel im Deutschen: der Mann, die Frau, das Kind.',
        vocabulary: [
          { german: 'der Mann', somali: 'Ninka (Lab)', example_german: 'Der Mann lernt Deutsch.', example_somali: 'Ninku wuxuu baranayaa Jarmal.' },
          { german: 'die Frau', somali: 'Haweeneyda (Dheddig)', example_german: 'Die Frau ist Lehrerin.', example_somali: 'Haweeneydu waa macallimad.' },
          { german: 'das Kind', somali: 'Ilmaha (Dhex-dhexaad)', example_german: 'Das Kind spielt.', example_somali: 'Ilmahu wuu ciyaarayaa.' }
        ]
      },
      {
        id: 'les-a1-04',
        course_id: '10000000-0000-0000-0000-000000000001',
        module_title: 'Module 2: Magacyada & Qodobada (der, die, das)',
        module_order: 2,
        title: 'Lesson 4: Indefinite Articles & Negation (ein, eine, kein, keine)',
        title_somali: 'Casharka 4: Qodobada aan cayimnayn & Diidmada',
        order_index: 4,
        video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        duration: '24:10',
        is_preview: false,
        notes_somali: 'Adeegsiga ein/eine iyo sida wax loo diido iyadoo la isticmaalayo kein/keine (magacyada) ama nicht (ficillada iyo tilmaamayaasha).',
        notes_german: 'Unbestimmte Artikel und Negation mit kein/nicht.',
        vocabulary: [
          { german: 'ein Buch', somali: 'Buug', example_german: 'Ich habe ein Buch.', example_somali: 'Waxaan haystaa buug.' },
          { german: 'keine Zeit', somali: 'Waqti la\'aan', example_german: 'Ich habe heute keine Zeit.', example_somali: 'Maanta waqti ma haysto.' }
        ]
      },
      {
        id: 'les-a1-05',
        course_id: '10000000-0000-0000-0000-000000000001',
        module_title: 'Module 3: Naxwaha Ficillada & Weedhaha',
        module_order: 3,
        title: 'Lesson 5: Essential Verbs sein & haben and Conjugation Rules',
        title_somali: 'Casharka 5: Ficillada sein & haben iyo Rogrogidda Ficillada',
        order_index: 5,
        video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        duration: '25:30',
        is_preview: false,
        notes_somali: 'Ficillada ugu muhiimsan luuqadda Jarmalka: sein (ahaansho) iyo haben (lahaansho). Baro sida loo rogrogo ficillada joogtada ah (ich lerne, du lernst, er/sie lernt...).',
        notes_german: 'Konjugation der Hilfsverben sein und haben im Präsens.',
        vocabulary: [
          { german: 'Ich bin müde', somali: 'Waan daallanahay', example_german: 'Ich bin sehr müde.', example_somali: 'Aad baan u daallanahay.' },
          { german: 'Wir haben Hunger', somali: 'Gaajo baa na haysa', example_german: 'Wir haben Hunger und Durst.', example_somali: 'Gaajo iyo harrad baa na haya.' }
        ]
      },
      {
        id: 'les-a1-06',
        course_id: '10000000-0000-0000-0000-000000000001',
        module_title: 'Module 4: Imtixaanka Goethe A1 Exam Masterclass',
        module_order: 4,
        title: 'Lesson 6: Goethe A1 Exam Structure & Speaking Simulation (Sprechen)',
        title_somali: 'Casharka 6: Qaab-dhismeedka Imtixaanka Goethe A1 & Tababarka Hadalka',
        order_index: 6,
        video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        duration: '35:00',
        is_preview: false,
        notes_somali: 'Sharraxaad qoto-dheer oo ku saabsan 4-ta qaybood ee imtixaanka Goethe A1: Hören (Dhageysi), Lesen (Akhris), Schreiben (Qoraal), iyo Sprechen (Hadalka). Waxaan si toos ah u sameynaynaa tababarka wareysiga safaaradda.',
        notes_german: 'Vorbereitung auf die Goethe-Zertifikat A1 Prüfung: Hören, Lesen, Schreiben und Sprechen.',
        vocabulary: [
          { german: 'Können Sie das wiederholen?', somali: 'Miyaad ku celin kartaa fadlan?', example_german: 'Entschuldigung, können Sie das bitte wiederholen?', example_somali: 'Iga raalli ahow, miyaad ku celin kartaa fadlan?' },
          { german: 'Buchstabieren Sie bitte', somali: 'Fadlan higgaadi magacaaga', example_german: 'Buchstabieren Sie bitte Ihren Nachnamen.', example_somali: 'Fadlan higgaadi magacaaga dambe.' }
        ],
        resources: [
          { id: 'res-4', title: 'Official Goethe A1 Sample Exam Paper with Solutions (PDF)', type: 'pdf', size: '3.4 MB', download_url: '#' },
          { id: 'res-5', title: 'A1 Speaking Cards & Flashcards (PDF)', type: 'worksheet', size: '1.9 MB', download_url: '#' }
        ]
      }
    ]
  },
  {
    id: '10000000-0000-0000-0000-000000000002',
    title: 'German A2: Elementary Conversations & Real-Life Situations',
    title_somali: 'Af-Jarmalka A2: Naxwaha Qoto-dheer & Wadahadalka Dhexe',
    slug: 'german-a2-somali-elementary',
    level: 'A2',
    language_from: 'German',
    language_to: 'Somali',
    short_description: 'Take your German beyond basics. Master past tense (Perfekt), modal verbs, and practical dialogues for living in Germany.',
    short_description_somali: 'Kor u qaad fahamkaaga Jarmalka. Baro wakhtiga tagay (Perfekt & Präteritum), xaaladaha Dativ iyo Akkusativ, iyo wadahadallada rasmiga ah.',
    description: 'Koorsadani waxay kugu hagaysaa nolosha dhabta ah ee Jarmalka: sida guri looga raadsado, sida xafiisyada loola hadlo, iyo sharraxaadda xaaladaha shaqada adigoo af-soomaali faahfaahsan ku helaya casharrada.',
    description_somali: 'Waxaa loogu talagalay ardayda soo dhammaystay A1 ee raba inay u gudbaan heerka labaad si kalsooni leh.',
    learning_outcomes: [
      'Adeegsiga wakhtiyada tagay (Perfekt oo leh haben/sein)',
      'Fahamka buuxa ee prepositions-ka Dativ iyo Akkusativ',
      'Qorista emails rasmi ah oo ku socda xafiisyada dowladda (Bürgeramt)',
      'Diyaarinta imtixaanka Goethe/telc A2 oo leh imtixaanno tusaale ah'
    ],
    price: 59.00,
    discount_price: 35.00,
    thumbnail_url: '/assets/aistudio/05F8C6A4-5FFB-4D4A-B2E5-11DF7B585E48_8e6b0422.jpeg',
    instructor_id: '00000000-0000-0000-0000-000000000001',
    instructor: INITIAL_INSTRUCTORS[0],
    featured: true,
    total_hours: 32.0,
    total_lessons: 42,
    badge_label: 'Heerka Dhexe',
    certificate_included: true,
    is_published: true,
    lessons: [
      {
        id: 'les-a2-01',
        course_id: '10000000-0000-0000-0000-000000000002',
        module_title: 'Module 1: Wakhtiga Tagay (Das Perfekt)',
        module_order: 1,
        title: 'Lesson 1: The German Past Tense with Haben & Sein',
        title_somali: 'Casharka 1: Wakhtiga Tagay ee Perfekt oo leh Haben & Sein',
        order_index: 1,
        video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        duration: '21:10',
        is_preview: true,
        notes_somali: 'Casharkan waxaad ku baranaysaa sida loo sheego wax horey u dhacay adigoo adeegsanaya Perfekt (z.B. Ich habe gelernt / Ich bin gefahren).',
        notes_german: 'Das Perfekt mit regelmäßigen und unregelmäßigen Verben.',
        vocabulary: [
          { german: 'Ich habe gearbeitet', somali: 'Waan shaqeeyay', example_german: 'Gestern habe ich 8 Stunden gearbeitet.', example_somali: 'Shalay waxaan shaqeeyay 8 saacadood.' }
        ]
      }
    ]
  },
  {
    id: '10000000-0000-0000-0000-000000000003',
    title: 'German B1: Independence, Citizenship & Ausbildung Prep',
    title_somali: 'Af-Jarmalka B1: Heerka Madax-bannaanida & Diyaarinta Ausbildung',
    slug: 'german-b1-somali-intermediate',
    level: 'B1',
    language_from: 'German',
    language_to: 'Somali',
    short_description: 'The golden certificate for working in Germany, starting an Ausbildung, or applying for residency & citizenship.',
    short_description_somali: 'Heerka ugu muhiimsan ee lagu helo fursadaha shaqo, Ausbildung, iyo deganaanshaha/dhalashada Jarmalka. Qoraalka CV-ga iyo waraaqaha codsiga.',
    description: 'Koorsada B1 waa albaabka mustaqbalkaaga Jarmalka. Waxay si toos ah kugu diyaarinaysaa shuruudaha Ausbildung-ka, wareysiyada shaqada, iyo imtixaanka 4-ta qaybood ee Goethe B1.',
    description_somali: 'Koorso dhammaystiran oo ku siinaysa awoodda aad fikirkaaga ugu dhiibato si madax-bannaan, aad u fahamto wararka Jarmalka, una qorto warqadda codsiga shaqada (Bewerbungsschreiben).',
    learning_outcomes: [
      'Naxwaha sare: Konjunktiv II, Passiv, iyo Nebensätze (weil, dass, obwohl)',
      'Qorista Lebenslauf (CV) casri ah iyo Anschreiben (Motivation Letter)',
      'U diyaar-garowga wareysiga Ausbildung-ka ee loo-shaqeeyayaasha Jarmalka',
      'Xeeladaha lagu gudbo imtixaanka Goethe/telc B1 oo 100% la hubo'
    ],
    price: 79.00,
    discount_price: 49.00,
    thumbnail_url: '/assets/aistudio/05F8C6A4-5FFB-4D4A-B2E5-11DF7B585E48_8e6b0422.jpeg',
    instructor_id: '00000000-0000-0000-0000-000000000001',
    instructor: INITIAL_INSTRUCTORS[0],
    featured: true,
    total_hours: 40.0,
    total_lessons: 48,
    badge_label: 'Muhiim u ah Ausbildung',
    certificate_included: true,
    is_published: true,
    lessons: [
      {
        id: 'les-b1-01',
        course_id: '10000000-0000-0000-0000-000000000003',
        module_title: 'Module 1: Ausbildung & German Job Readiness',
        module_order: 1,
        title: 'Lesson 1: Crafting your German CV (Lebenslauf) and Cover Letter',
        title_somali: 'Casharka 1: Sida loo qoro CV-ga Jarmalka (Lebenslauf) & Warqadda Codsiga',
        order_index: 1,
        video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        duration: '28:45',
        is_preview: true,
        notes_somali: 'Sida shirkadaha Jarmalka u doonayaan CV-ga: sawirka xirfadeed, khibradda, waxbarashada, iyo qaabka loo diro codsiga Ausbildung-ka.',
        notes_german: 'Bewerbungsunterlagen: Anschreiben, Lebenslauf und Zeugnisse.',
        vocabulary: [
          { german: 'die Bewerbung', somali: 'Codsiga shaqada', example_german: 'Ich sende meine Bewerbung per E-Mail.', example_somali: 'Waxaan codsigayga shaqada ku dirayaa email.' }
        ]
      }
    ]
  },
  {
    id: '10000000-0000-0000-0000-000000000004',
    title: 'Deutsch für Pflegekräfte: Medical German for Nurses & Healthcare',
    title_somali: 'Af-Jarmalka Kalkaaliyeyaasha Caafimaadka & Dhakhaatiirta',
    slug: 'german-medical-healthcare-somali',
    level: 'Medical / Healthcare',
    language_from: 'German',
    language_to: 'Somali',
    short_description: 'Specialized clinical terminology, hospital documentation (Pflegebericht), and patient communication in German hospitals.',
    short_description_somali: 'Eray-bixinta caafimaadka, dukumiintiyada bukaanka, iyo xiriirka dhakhaatiirta ee isbitaallada Jarmalka. Ku habboon kalkaaliyeyaasha.',
    description: 'Waxaa bixinaysa Dr. Deqa Abdi. Koorso gaar ah oo loogu talagalay shaqaalaha caafimaadka Soomaaliyeed ee raba inay ka shaqeeyaan isbitaallada iyo xarumaha daryeelka Jarmalka.',
    description_somali: 'Baro eray-bixinta caafimaadka, sida loo qoro warbixinta maalinlaha ah ee daryeelka (Pflegedokumentation), iyo sida loola hadlo bukaanka da\'da ah ama xaaladaha degdegga ah.',
    learning_outcomes: [
      'Eray bixinta xubnaha jirka, cudurrada, qalabka, iyo dawooyinka',
      'Qorista warbixinta wareejinta shaqada (Übergabe & Dokumentation)',
      'Wadahadalka bukaanka iyo xaaladaha degdegga ah',
      'Diyaarinta imtixaanka luuqadda caafimaadka ee shatiga (Fachsprachenprüfung)'
    ],
    price: 89.00,
    discount_price: 55.00,
    thumbnail_url: '/assets/aistudio/05F8C6A4-5FFB-4D4A-B2E5-11DF7B585E48_8e6b0422.jpeg',
    instructor_id: '00000000-0000-0000-0000-000000000002',
    instructor: INITIAL_INSTRUCTORS[1],
    featured: true,
    total_hours: 30.0,
    total_lessons: 38,
    badge_label: 'Caafimaadka & Shaqada',
    certificate_included: true,
    is_published: true,
    lessons: [
      {
        id: 'les-med-01',
        course_id: '10000000-0000-0000-0000-000000000004',
        module_title: 'Module 1: Clinical Shift Handover (Die Übergabe)',
        module_order: 1,
        title: 'Lesson 1: Hospital Routine & Patient Vital Signs Communication',
        title_somali: 'Casharka 1: Hawlaha Isbitaalka & Wadahadalka Calaamadaha Muhiimka ah',
        order_index: 1,
        video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        duration: '27:15',
        is_preview: true,
        notes_somali: 'Sida loo cabbiro cadaadiska dhiigga (Blutdruck), garaaca wadnaha (Puls), iyo sonkorta (Blutzucker), loona sharraxo dhakhtarka mas\'uulka ah.',
        notes_german: 'Vitalzeichen messen und dokumentieren: Blutdruck, Puls, Temperatur.',
        vocabulary: [
          { german: 'der Blutdruck', somali: 'Cadaadiska dhiigga', example_german: 'Der Blutdruck des Patienten ist normal.', example_somali: 'Cadaadiska dhiigga ee bukaanku waa caadi.' }
        ]
      }
    ]
  },
  {
    id: '10000000-0000-0000-0000-000000000005',
    title: 'German B2: Advanced Professional Fluency & Career Mastery',
    title_somali: 'Af-Jarmalka B2: Luuqadda Shaqada & Xirfadda Sare',
    slug: 'german-b2-somali-advanced',
    level: 'B2',
    language_from: 'German',
    language_to: 'Somali',
    short_description: 'Professional fluency, academic vocabulary, high-level business meetings, and passing the Goethe/telc B2 exam.',
    short_description_somali: 'Heerka ugu sarreeya ee shaqooyinka aqoonta leh iyo jaamacadaha Jarmalka. Qorista warbixinnada iyo doodaha adag.',
    description: 'Koorsadani waxay diiradda saartaa xirfadda luuqadeed ee looga baahan yahay shirkadaha caalamiga ah, jaamacadaha, iyo jagooyinka maamulka ee Jarmalka.',
    description_somali: 'Waxaa lagu baranayaa weedhaha adag (Nomen-Verb-Verbindungen), hababka doodaha rasmiga ah, iyo laylisyo xoog leh oo Goethe B2 ah.',
    learning_outcomes: [
      'Adeegsiga Nomen-Verb-Verbindungen iyo Partizipialattribute',
      'Falanqaynta maqaallada dhaqaalaha iyo siyaasadda Jarmalka',
      'Hogaaminta shirarka shaqada iyo gorgortanka mashaariicda',
      'Ku baasidda imtixaanka adag ee Goethe B2 ama telc B2'
    ],
    price: 99.00,
    discount_price: 65.00,
    thumbnail_url: '/assets/aistudio/05F8C6A4-5FFB-4D4A-B2E5-11DF7B585E48_8e6b0422.jpeg',
    instructor_id: '00000000-0000-0000-0000-000000000001',
    instructor: INITIAL_INSTRUCTORS[0],
    featured: false,
    total_hours: 45.0,
    total_lessons: 50,
    badge_label: 'Xirfadda Sare',
    certificate_included: true,
    is_published: true,
    lessons: []
  },
  {
    id: '10000000-0000-0000-0000-000000000006',
    title: 'Goethe-Zertifikat A1-B2 Exam Masterclass: Speaking & Audio Drills',
    title_somali: 'Xeeladaha Imtixaanka Goethe A1-B2: Hadalka & Dhageysiga',
    slug: 'goethe-exam-masterclass-somali',
    level: 'Goethe Exam Prep',
    language_from: 'German',
    language_to: 'Somali',
    short_description: 'Proven strategies, real exam simulations, audio listening drills, and speaking confidence training for embassy visa interviews.',
    short_description_somali: 'Tababar gaar ah oo ku saabsan sida loo gudbo imtixaanka safaaradda iyo Goethe-Institut. Su\'aalaha soo noqnoqda iyo xeeladaha dhibcaha buuxa.',
    description: 'Diyaarinta imtixaanka kaliya looma baahna luuqad guud; waxaa loo baahan yahay xeelad iyo fahamka habka imtixaanka loo saxo. Koorsadani waxay kugu tababaraysaa dhibcaha ugu badan sida lagu helo.',
    description_somali: 'Waxaad baranaysaa sida looga fogaado khaladaadka caadiga ah ee ardayda Soomaaliyeed ku dhacaan qaybta Hören (dhageysiga) iyo Sprechen (hadalka).',
    learning_outcomes: [
      'Fahamka xeeladaha dhageysiga degdegga ah (Hören tricks)',
      'Qaaciidooyinka qorista warqadda (Brief/E-Mail schreiben) oo helaya 100%',
      'Wareysiga fool-ka-foolka ah ee imtixaanka (Mündliche Prüfung)',
      '15 imtixaan oo tusaale ah oo leh xallintooda oo buuxda'
    ],
    price: 55.00,
    discount_price: 35.00,
    thumbnail_url: '/assets/aistudio/05F8C6A4-5FFB-4D4A-B2E5-11DF7B585E48_8e6b0422.jpeg',
    instructor_id: '00000000-0000-0000-0000-000000000001',
    instructor: INITIAL_INSTRUCTORS[0],
    featured: false,
    total_hours: 22.0,
    total_lessons: 28,
    badge_label: 'Diyaarinta Imtixaanka',
    certificate_included: true,
    is_published: true,
    lessons: []
  }
];
