export interface QuizOption {
  id: string;
  text: string;
  textSomali?: string;
}

export interface QuizQuestion {
  id: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'Medical / Healthcare' | 'Goethe Exam Prep';
  moduleIndex: number;
  questionSomali: string;
  questionGerman?: string;
  contextHint?: string;
  options: QuizOption[];
  correctOptionId: string;
  explanationSomali: string;
  explanationGerman: string;
  grammarTopic: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // --- GERMAN A1 QUIZ QUESTIONS ---
  {
    id: 'q-a1-1',
    level: 'A1',
    moduleIndex: 1,
    questionSomali: 'Waa maxay qodobka saxda ah (Artikel) ee magaca "Tisch" (Miis)?',
    questionGerman: 'Welcher Artikel gehört zu "Tisch"?',
    contextHint: 'Magacyada lab (Maskulin) ee af-jarmalka waxay qaataan qodob gaar ah.',
    options: [
      { id: 'opt-1', text: 'der Tisch', textSomali: 'Qodobka Lab (Maskulin)' },
      { id: 'opt-2', text: 'die Tisch', textSomali: 'Qodobka Dheddig (Feminin)' },
      { id: 'opt-3', text: 'das Tisch', textSomali: 'Qodobka Dhex-dhexaad (Neutral)' },
      { id: 'opt-4', text: 'den Tisch', textSomali: 'Qodobka Akkusativ' }
    ],
    correctOptionId: 'opt-1',
    explanationSomali: 'Magaca "Tisch" (miis) waa magac lab (Maskulin), sidaa darteed wuxuu mar kasta qaataa qodobka "der" (der Tisch).',
    explanationGerman: '"Tisch" ist maskulin und verlangt im Nominativ den bestimmten Artikel "der".',
    grammarTopic: 'Bestimmte Artikel (der, die, das)'
  },
  {
    id: 'q-a1-2',
    level: 'A1',
    moduleIndex: 1,
    questionSomali: 'Xarafka gaarka ah ee Jarmalka "ß" (Eszett) dhawaaq ahaan maxuu u dhigmaa?',
    questionGerman: 'Wie wird der Buchstabe "ß" (scharfes S) ausgesprochen?',
    contextHint: 'Erayo ay ka mid yihiin "Straße" ama "heißen" ayaa xarafkan leh.',
    options: [
      { id: 'opt-1', text: 'Dhawaaq sida "B" oo kale ah', textSomali: 'Sida xarafka B' },
      { id: 'opt-2', text: 'Dhawaaq "ss" labanlaaban ah oo fiiqan', textSomali: 'Doppel-S oo fiiqan' },
      { id: 'opt-3', text: 'Dhawaaq "sh" ama "ch" ah', textSomali: 'Sida sh' },
      { id: 'opt-4', text: 'Dhawaaq aamusan oo aan la akhrin', textSomali: 'Aamusan' }
    ],
    correctOptionId: 'opt-2',
    explanationSomali: 'Xarafka "ß" waxaa loo yaqaannaa Eszett ama scharfes S, waxaana loo dhawaaqaa sida "ss" labanlaaban oo fiiqan (tusaale: Straße = Strasse).',
    explanationGerman: 'Das "ß" entspricht einem stimmlosen, scharfen Doppel-S.',
    grammarTopic: 'Aussprache & Alphabet'
  },
  {
    id: 'q-a1-3',
    level: 'A1',
    moduleIndex: 2,
    questionSomali: 'Haddii qof Jarmal ah ku weydiiyo "Woher kommen Sie?", sidee baa loogu jawaabaa?',
    questionGerman: 'Wie antworten Sie auf die Frage "Woher kommen Sie?"',
    contextHint: 'Wadahadalka rasmiga ah ee isbarashada iyo safaaradda.',
    options: [
      { id: 'opt-1', text: 'Ich heiße Yahye.', textSomali: 'Magacaygu waa Yahye' },
      { id: 'opt-2', text: 'Ich komme aus Somalia.', textSomali: 'Waxaan ka imid Soomaaliya' },
      { id: 'opt-3', text: 'Ich wohne in Berlin.', textSomali: 'Waxaan deggenhay Berlin' },
      { id: 'opt-4', text: 'Mir geht es gut, danke.', textSomali: 'Waan fiicanahay, mahadsanid' }
    ],
    correctOptionId: 'opt-2',
    explanationSomali: '"Woher kommen Sie?" waxay ka dhigan tahay "Xaggee ka timid?". Jawaabta saxda ahi waa "Ich komme aus..." oo lagu daro magaca dalkaaga (Ich komme aus Somalia).',
    explanationGerman: '"Woher" fragt nach der Herkunft, daher antwortet man mit der Präposition "aus": "Ich komme aus...".',
    grammarTopic: 'Sich vorstellen & Herkunft'
  },
  {
    id: 'q-a1-4',
    level: 'A1',
    moduleIndex: 2,
    questionSomali: 'Sharciga Dahabiga ah ee weedhaha tooska ah ee Jarmalka: Booskee buu ficilku fariistaa?',
    questionGerman: 'An welcher Position steht das konjugierte Verb im einfachen Hauptsatz?',
    contextHint: 'Xusuuso sharciga Verbposition 2 ee Module 1.',
    options: [
      { id: 'opt-1', text: 'Booska 1-aad (Position 1)', textSomali: 'Bilaabowga weedha' },
      { id: 'opt-2', text: 'Booska 2-aad (Position 2)', textSomali: 'Booska labaad mar kasta' },
      { id: 'opt-3', text: 'Booska 3-aad (Position 3)', textSomali: 'Booska saddexaad' },
      { id: 'opt-4', text: 'Dhammaadka weedha (Am Ende)', textSomali: 'Ugu dambeysa' }
    ],
    correctOptionId: 'opt-2',
    explanationSomali: 'Weedhaha tooska ah ee Jarmalka (Hauptsatz), ficilka falka sameynaya wuxuu mar kasta fariistaa booska labaad (Position 2), tusaale: "Ich lerne Deutsch" ama "Heute lerne ich Deutsch".',
    explanationGerman: 'Im deutschen Aussagesatz steht das finite Verb immer an Position 2.',
    grammarTopic: 'Satzbau & Verbposition'
  },
  {
    id: 'q-a1-5',
    level: 'A1',
    moduleIndex: 3,
    questionSomali: 'Lambarka Jarmalka "fünfundzwanzig" waa immisa?',
    questionGerman: 'Welche Zahl bedeutet "fünfundzwanzig"?',
    contextHint: 'Af-jarmalka lambarrada ka weyn 20 waxaa marka hore la dhahaa kan dambe (5 iyo 20).',
    options: [
      { id: 'opt-1', text: '52', textSomali: 'Konton iyo labo' },
      { id: 'opt-2', text: '25', textSomali: 'Labaatan iyo shan' },
      { id: 'opt-3', text: '15', textSomali: 'Shan iyo toban' },
      { id: 'opt-4', text: '50', textSomali: 'Konton' }
    ],
    correctOptionId: 'opt-2',
    explanationSomali: 'Jarmalku marka hore wuxuu dhahaa "fünf" (shan), kaddib "und" (iyo), kaddib "zwanzig" (labaatan) = fünfundzwanzig (25).',
    explanationGerman: 'Im Deutschen werden die Einer vor den Zehnern genannt: fünf-und-zwanzig = 25.',
    grammarTopic: 'Zahlen & Mengenangaben'
  },

  // --- GERMAN A2 QUIZ QUESTIONS ---
  {
    id: 'q-a2-1',
    level: 'A2',
    moduleIndex: 1,
    questionSomali: 'Dooro weedha saxda ah ee xilligii tagay (Perfekt) ee ficilka "kaufen":',
    questionGerman: 'Welcher Satz im Perfekt ist grammatikalisch korrekt?',
    contextHint: 'Perfekt-ka ficilka kaufen wuxuu qaataa haben iyo Partizip II (gekauft).',
    options: [
      { id: 'opt-1', text: 'Ich bin ein Auto gekauft.', textSomali: 'Qaldan: bin ma qaato' },
      { id: 'opt-2', text: 'Ich habe ein neues Buch gekauft.', textSomali: 'Sax: habe + Partizip II' },
      { id: 'opt-3', text: 'Ich kaufe gestern ein Buch.', textSomali: 'Qaldan: xilliga hadda' },
      { id: 'opt-4', text: 'Ich habe ein Buch kaufen.', textSomali: 'Qaldan: falka oo aan isbeddelin' }
    ],
    correctOptionId: 'opt-2',
    explanationSomali: 'Ficilka "kaufen" xilligiisa tagay (Perfekt) wuxuu qaataa falka caawiyaha ah ee "haben" iyo qaabka "gekauft" oo u wareega dhammaadka weedha: "Ich habe ein neues Buch gekauft".',
    explanationGerman: 'Das Perfekt von "kaufen" wird mit dem Hilfsverb "haben" und dem Partizip II "gekauft" gebildet.',
    grammarTopic: 'Perfekt mit haben/sein'
  },
  {
    id: 'q-a2-2',
    level: 'A2',
    moduleIndex: 2,
    questionSomali: 'Kaddib horyaalka (Präposition) "mit", kiiskee naxweed baa qasab ah in la isticmaalo?',
    questionGerman: 'Welchen Kasus verlangt die Präposition "mit"?',
    contextHint: 'Horyaallada qaarkood mar kasta waxay wataan kiis gaar ah.',
    options: [
      { id: 'opt-1', text: 'Nominativ', textSomali: 'Kiiska asalka ah ee mawduuca' },
      { id: 'opt-2', text: 'Akkusativ', textSomali: 'Kiiska shayga tooska ah' },
      { id: 'opt-3', text: 'Dativ', textSomali: 'Kiiska shayga dadban (mit + Dativ)' },
      { id: 'opt-4', text: 'Genitiv', textSomali: 'Kiiska lahaanshaha' }
    ],
    correctOptionId: 'opt-3',
    explanationSomali: 'Horyaalka "mit" (la / wax ku socdaalida) wuxuu MAR KASTA qaataa kiiska Dativ (tusaale: mit dem Bus, mit der Familie, mit den Freunden).',
    explanationGerman: 'Die Präposition "mit" verlangt ausnahmslos den Dativ.',
    grammarTopic: 'Präpositionen mit Dativ'
  },
  {
    id: 'q-a2-3',
    level: 'A2',
    moduleIndex: 3,
    questionSomali: 'Weedhaha sababta ee isticmaala "weil" (maxaa yeelay), xaggee ayuu ficilku galaa?',
    questionGerman: 'Wohin wandert das konjugierte Verb in einem "weil"-Nebensatz?',
    contextHint: 'Nebensatz (weedh dhiman) wuxuu leeyahay qaab-dhismeed gaar ah.',
    options: [
      { id: 'opt-1', text: 'Booska koowaad (Position 1)', textSomali: 'Hore' },
      { id: 'opt-2', text: 'Booska labaad (Position 2)', textSomali: 'Dhexda' },
      { id: 'opt-3', text: 'Dhammaadka weedha (Ganz ans Ende)', textSomali: 'Ugu dambeysa weedha' },
      { id: 'opt-4', text: 'Ficilku meel kasta wuu fariisan karaa', textSomali: 'Xoriyad' }
    ],
    correctOptionId: 'opt-3',
    explanationSomali: 'Xiriiriyaha "weil" wuxuu abuuraa weedh dhiman (Nebensatz), taas oo ku qasbaysa ficilka inuu fariisto gebi ahaanba dhammaadka weedha (tusaale: "...weil ich Deutsch lerne").',
    explanationGerman: 'Konjunktionen wie "weil" leiten einen Nebensatz ein, in dem das finite Verb am Satzende steht.',
    grammarTopic: 'Kausalsätze mit "weil"'
  },

  // --- GERMAN B1 QUIZ QUESTIONS ---
  {
    id: 'q-b1-1',
    level: 'B1',
    moduleIndex: 1,
    questionSomali: 'Waa maxay micnaha saxda ah ee dukumeentiga "der Lebenslauf"?',
    questionGerman: 'Was bedeutet das Wort "Lebenslauf" im Bewerbungsprozess?',
    contextHint: 'Shuruudaha ugu muhiimsan ee dalabka shaqada iyo Ausbildung-ka.',
    options: [
      { id: 'opt-1', text: 'Warqadda dhiirrigelinta (Motivationsschreiben)', textSomali: 'Warqad codsi' },
      { id: 'opt-2', text: 'CV-ga qofka / Taariikh nololeedka waxbarashada & shaqada', textSomali: 'Curriculum Vitae (CV)' },
      { id: 'opt-3', text: 'Heshiiska shaqada ee rasmiga ah (Arbeitsvertrag)', textSomali: 'Heshiis shaqo' },
      { id: 'opt-4', text: 'Shahaadada caafimaadka (Gesundheitszeugnis)', textSomali: 'Warqad caafimaad' }
    ],
    correctOptionId: 'opt-2',
    explanationSomali: '"Der Lebenslauf" waa CV-ga qofka (Curriculum Vitae) oo lagu qoro shax qaabaysan (tabellarischer Lebenslauf) oo ka kooban waxbarashadiisa, waayo-aragnimadiisa shaqo, iyo aqoonta luuqadaha.',
    explanationGerman: 'Ein "Lebenslauf" ist der tabellarische Überblick über die persönliche und berufliche Laufbahn.',
    grammarTopic: 'Bewerbung & Berufswelt'
  },
  {
    id: 'q-b1-2',
    level: 'B1',
    moduleIndex: 2,
    questionSomali: 'Dooro qaabka ugu xushmadda badan ee weydiinta (Konjunktiv II):',
    questionGerman: 'Welcher Satz drückt eine besonders höfliche Bitte im Konjunktiv II aus?',
    contextHint: 'Konjunktiv II waxaa loo adeegsadaa xushmadda sare iyo codsiyada rasmiga ah.',
    options: [
      { id: 'opt-1', text: 'Hilf mir sofort!', textSomali: 'I caawi hadda! (Amar qalafsan)' },
      { id: 'opt-2', text: 'Könnten Sie mir bitte helfen?', textSomali: 'Fadlan ma ii gargaari kartaa? (Aad u xushmad badan)' },
      { id: 'opt-3', text: 'Du musst mir helfen.', textSomali: 'Waa inaad i caawisaa' },
      { id: 'opt-4', text: 'Kannst du mir helfen?', textSomali: 'Caadi laakiin saaxiibtinimo' }
    ],
    correctOptionId: 'opt-2',
    explanationSomali: '"Könnten Sie mir bitte helfen?" waxay adeegsataa falka caawiyaha ee "könnten" (Konjunktiv II), waana habka ugu xushmadda badan ee xafiisyada iyo shaqada looga codsado caawimaad.',
    explanationGerman: '"Könnten Sie..." ist die höflichste Form der Bitte im Konjunktiv II.',
    grammarTopic: 'Höfliche Bitten mit Konjunktiv II'
  },

  // --- MEDICAL / HEALTHCARE QUIZ QUESTIONS ---
  {
    id: 'q-med-1',
    level: 'Medical / Healthcare',
    moduleIndex: 1,
    questionSomali: 'Kalkaalisadu markay tiraahdo "Ich messe jetzt Ihren Blutdruck", maxay u jeeddaa?',
    questionGerman: 'Was bedeutet die pflegerische Aussage "Ich messe jetzt Ihren Blutdruck"?',
    contextHint: 'Eraybixinta caafimaadka iyo daryeelka bukaanka ee Jarmalka.',
    options: [
      { id: 'opt-1', text: 'Waxaan cabbirayaa heerkulkaaga', textSomali: 'Heerkulka' },
      { id: 'opt-2', text: 'Waxaan cabbirayaa cadaadiska dhiiggaaga', textSomali: 'Dhiigkarka / Cadaadiska dhiigga' },
      { id: 'opt-3', text: 'Waxaan kuu keenayaa daawadaada', textSomali: 'Daawo' },
      { id: 'opt-4', text: 'Waxaan kugu xirayaa faleebada', textSomali: 'Faleebo' }
    ],
    correctOptionId: 'opt-2',
    explanationSomali: '"Der Blutdruck" waa cadaadiska dhiigga (blood pressure), "messen" waa cabbirid. Weedhu waxay ka dhigan tahay "Waxaan hadda cabbirayaa cadaadiska dhiiggaaga".',
    explanationGerman: '"Blutdruck messen" bedeutet die Erfassung der kardiovaskulären Vitalwerte des Patienten.',
    grammarTopic: 'Medizinische Fachsprache'
  },
  {
    id: 'q-med-2',
    level: 'Medical / Healthcare',
    moduleIndex: 2,
    questionSomali: 'Bukaanku haddii uu yiraahdo "Mir ist schwindelig", maxaa haya?',
    questionGerman: 'Was bedeutet das Symptom "Mir ist schwindelig"?',
    contextHint: 'Cabashooyinka ugu caansan ee bukaannada isbitaallada.',
    options: [
      { id: 'opt-1', text: 'Madaxa ayaa wareeraya / dawakhaad ayaa haysa', textSomali: 'Dawakhaad / Schwindel' },
      { id: 'opt-2', text: 'Gacanta ayaa jaban', textSomali: 'Jabniin' },
      { id: 'opt-3', text: 'Calooshayda ayaa gubanaysa', textSomali: 'Calool xanuun' },
      { id: 'opt-4', text: 'Hurdada ayaa iga go\'an', textSomali: 'Hurdo la\'aan' }
    ],
    correctOptionId: 'opt-1',
    explanationSomali: '"Schwindelig" micneheedu waa dawakhaad ama madax-wareer. Bukaanku wuxuu dareemayaa in wax walba wareegayaan.',
    explanationGerman: '"Schwindelig" beschreibt das Gefühl von Gleichgewichtsstörung und Schwindelgefühl.',
    grammarTopic: 'Symptome & Schmerzbeschreibung'
  },

  // --- GOETHE EXAM PREP QUIZ QUESTIONS ---
  {
    id: 'q-exam-1',
    level: 'Goethe Exam Prep',
    moduleIndex: 1,
    questionSomali: 'Imtixaanka Goethe, warqadaha rasmiga ah (Schreiben) salaantee baa loo adeegsadaa qof aan magaciisa la garanayn?',
    questionGerman: 'Welche Anrede verwendet man im formellen Brief, wenn der Empfänger unbekannt ist?',
    contextHint: 'Qaybta Schreiben ee Goethe A1, A2, iyo B1.',
    options: [
      { id: 'opt-1', text: 'Hallo mein Freund,', textSomali: 'Qaldan: Saaxiibtinimo' },
      { id: 'opt-2', text: 'Sehr geehrte Damen und Herren,', textSomali: 'Sax: Salaan rasmi ah oo la isku wada daray' },
      { id: 'opt-3', text: 'Liebe Kollegen,', textSomali: 'Qaldan: Saaxiibo' },
      { id: 'opt-4', text: 'Guten Tag du,', textSomali: 'Qaldan: Aflagaaddo ama khaldan' }
    ],
    correctOptionId: 'opt-2',
    explanationSomali: 'Haddii aanad garanayn qofka ama xafiiska aad u qorayso, salaanta caadiga ah ee dhibcaha buuxa laga helo waa "Sehr geehrte Damen und Herren,".',
    explanationGerman: 'Die korrekte unpersönliche Höflichkeitsanrede im formellen Schriftverkehr lautet "Sehr geehrte Damen und Herren,".',
    grammarTopic: 'Goethe Schreiben Anrede'
  },
  {
    id: 'q-exam-2',
    level: 'Goethe Exam Prep',
    moduleIndex: 2,
    questionSomali: 'Imtixaanka Goethe-Zertifikat A1-B2, boqolkiiba immisa ayaa ah dhibcaha ugu yar ee lagu baaso (Mindestpunktzahl)?',
    questionGerman: 'Wie viel Prozent der Gesamtpunkte benötigt man mindestens zum Bestehen einer Goethe-Prüfung?',
    contextHint: 'Shuruudda rasmiga ah ee Goethe-Institut ee CEFR.',
    options: [
      { id: 'opt-1', text: '50% (50 dhibcood)', textSomali: 'Kuma filna' },
      { id: 'opt-2', text: '60% (60 dhibcood 100-kiiba)', textSomali: 'Heerka rasmiga ah ee Goethe' },
      { id: 'opt-3', text: '75% (75 dhibcood)', textSomali: 'Waa ka sarreeyaa' },
      { id: 'opt-4', text: '90% (90 dhibcood)', textSomali: 'Heer aad u sareeya' }
    ],
    correctOptionId: 'opt-2',
    explanationSomali: 'Goethe-Institut waxay ku baastid u aqoonsan tahay markii ardaygu helo ugu yaraan 60% (60 dhibcood 100-kiiba) qayb kasta oo imtixaanka ka mid ah.',
    explanationGerman: 'Nach den Bestimmungen des Goethe-Instituts gilt eine Modulprüfung mit mindestens 60% der Punkte als bestanden.',
    grammarTopic: 'Prüfungsordnung & Bestehensgrenze'
  }
];
