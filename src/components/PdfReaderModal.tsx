import React, { useState } from 'react';
import { 
  X, BookOpen, Download, Printer, ZoomIn, ZoomOut, Maximize2, 
  Minimize2, ChevronLeft, ChevronRight, Search, Lock, ShieldCheck, 
  FileText, CheckCircle, Bookmark, Sparkles, Check
} from 'lucide-react';
import { Course, LessonResource } from '../types/index.ts';

interface PdfReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: LessonResource | { id: string; title: string; size?: string; download_url?: string } | null;
  course: Course | null;
  isEnrolled: boolean;
  onUnlockCourse?: () => void;
}

interface BookletPage {
  pageNumber: number;
  chapterTitle: string;
  chapterSomali: string;
  badge?: string;
  content: {
    heading: string;
    subheading?: string;
    sections: {
      title: string;
      title_somali?: string;
      text_german?: string;
      text_somali?: string;
      tableData?: { col1: string; col2: string; col3?: string }[];
      bulletPoints?: string[];
      callout?: { type: 'tip' | 'warning' | 'exam'; title: string; text: string };
    }[];
  };
}

export const PdfReaderModal: React.FC<PdfReaderModalProps> = ({
  isOpen,
  onClose,
  resource,
  course,
  isEnrolled,
  onUnlockCourse
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [bookmarkedPages, setBookmarkedPages] = useState<number[]>([]);
  const [copiedNotification, setCopiedNotification] = useState(false);

  if (!isOpen || !resource) return null;

  // Rich study booklet content tailored to the course level
  const getBookletPages = (): BookletPage[] => {
    const level = course?.level || 'A1';

    return [
      {
        pageNumber: 1,
        chapterTitle: 'Cover & Course Curriculum Guide',
        chapterSomali: 'Bogga Hore & Tilmaamaha Koorsada',
        badge: 'MC ACCADAMY OFFICIAL',
        content: {
          heading: course?.title || 'German Language Study Workbook',
          subheading: course?.title_somali || 'Buugga Barashada Af-Jarmalka iyo Naxwaha A1-B2',
          sections: [
            {
              title: 'Hordhaca & Xeerarka Barashada (Introduction)',
              title_somali: 'Sida ugu waxtarka badan ee buuggan loogu faa\'iidaysto',
              text_somali: 'Ku soo dhawoow buugga rasmiga ah ee MC ACCADAMY. Buuggan waxaa si gaar ah loogu habeeyay ardayda ku hadasha af-soomaaliga ee u diyaargaroobaya imtixaanka Goethe-Zertifikat, fiisada safaaradda Jarmalka, ama tababarka shaqada ee Ausbildung. Cashar kasta waxaad ka helaysaa sharaxaad faahfaahsan, tusaalayaal af-jarmal iyo af-soomaali ah, iyo laylisyo lagugu tijaabinayo fahamkaaga.',
              callout: {
                type: 'tip',
                title: 'Talo Muhiim Ah (Wichtiger Tipp)',
                text: 'Ha xafidin erayada iyagoo gooni gooni ah; mar kasta ku celceli weedh dhamaystiran adigoo adeegsanaya qodobka saxda ah (der, die, das).'
              }
            },
            {
              title: 'Macluumaadka Koorsada (Course Metadata)',
              bulletPoints: [
                `Heerka Waxbarashada: ${level} (CEFR European Standard)`,
                `Macallinka Bixinaya: ${course?.instructor?.name || 'Macallin Cabdiraxmaan Cali'} (${course?.instructor?.qualification || 'Goethe-Institut Certified'})`,
                'Luuqadaha: Af-Jarmal (Deutsch) lagu sharxay Af-Soomaali cad',
                'Xuquuqda Daabacaadda: © 2026 MC ACCADAMY. Waxaa loo oggol yahay ardayda diiwaangashan oo keliya.'
              ]
            }
          ]
        }
      },
      {
        pageNumber: 2,
        chapterTitle: 'Qaybta 1: Naxwaha Aasaasiga ah (Grammatik & Satzbau)',
        chapterSomali: 'Dhismaha Weedhaha & Qawaaniinta Naxwaha',
        badge: 'GRAMMATIK',
        content: {
          heading: 'Qodobada Magacyada: Der, Die, Das & Dhismaha Weedha',
          subheading: 'Die bestimmten Artikel und der einfache Satzbau',
          sections: [
            {
              title: 'Qodobada Jinsiga Magacyada (Genus im Deutschen)',
              text_german: 'Im Deutschen gibt es drei grammatikalische Geschlechter: Maskulin (der), Feminin (die) und Neutral (das).',
              text_somali: 'Af-Jarmalka magac kasta wuxuu leeyahay jinsi naxweed oo qasab ah in la barto. Haddii aad qodobka khaladdo, macnaha weedhu wuu isbeddeli karaa.',
              tableData: [
                { col1: 'der (Lab / Maskulin)', col2: 'der Mann (ninka), der Tisch (miiska), der Apfel (tufaaxa)', col3: 'Magacyada lab iyo bilaha sanadka badankood' },
                { col1: 'die (Dheddig / Feminin)', col2: 'die Frau (haweeneyda), die Schule (dugsiga), die Tasche (boorsada)', col3: 'Magacyada ku dhammaada -ung, -heit, -keit, -in' },
                { col1: 'das (Dhex-dhexaad / Neutral)', col2: 'das Kind (ilmaha), das Auto (baabuurka), das Buch (buugga)', col3: 'Magacyada ku dhammaada -chen, -lein, -ment' }
              ]
            },
            {
              title: 'Sharciga Dahabiga ah ee Ficilka (Verbposition 2)',
              text_somali: 'Weedhaha tooska ah ee Jarmalka, ficilku wuxuu mar kasta fariistaa booska labaad (Position 2), halka mawduuca (Subject) uu fariisto booska 1-aad ama 3-aad.',
              callout: {
                type: 'exam',
                title: 'Goethe Exam Focus: Dhismaha Weedha',
                text: 'Tusaale: "Ich lerne heute Deutsch" (Position 2 = lerne) AMA "Heute lerne ich Deutsch" (Position 2 = lerne). Waligaa ficilka ha u dhaqaajin booska 3-aad weedh fudud dhexdeeda!'
              }
            }
          ]
        }
      },
      {
        pageNumber: 3,
        chapterTitle: 'Qaybta 2: Wadahadallada Maalinlaha ah (Alltagsdialoge)',
        chapterSomali: 'Wadahadalka Isbarashada, Dukaan-Adeegashada & Safaaradda',
        badge: 'SPRECHEN',
        content: {
          heading: 'Wadahadallada Muhiimka ah ee Goethe Sprechen Teil 1 & 2',
          subheading: 'Wichtige Redemittel für den Alltag und die mündliche Prüfung',
          sections: [
            {
              title: 'Isbarashada Rasmiga ah (Sich vorstellen)',
              tableData: [
                { col1: 'Jarmal (Deutsch)', col2: 'Af-Soomaali (Somali)', col3: 'Isticmaalka & Xaaladda' },
                { col1: 'Mein Name ist Yahye Hassan.', col2: 'Magacaygu waa Yahye Xasan.', col3: 'Magaca buuxa' },
                { col1: 'Ich komme aus Somalia und lebe in Berlin.', col2: 'Waxaan ka imid Soomaaliya, waxaana degganahay Berlin.', col3: 'Waddanka & Magaalada' },
                { col1: 'Ich lerne seit drei Monaten Deutsch.', col2: 'Muddo 3 bilood ah ayaan baranayay Jarmalka.', col3: 'Muddada barashada' },
                { col1: 'Ich möchte eine Ausbildung machen.', col2: 'Waxaan rabaa inaan sameeyo Ausbildung (Tababar shaqo).', col3: 'Ujeeddada barashada' },
                { col1: 'Von Beruf bin ich Krankenpfleger.', col2: 'Xirfaddaydu waa kalkaaliye caafimaad.', col3: 'Shaqada / Xirfadda' }
              ]
            },
            {
              title: 'Weydiimaha Xushmadda leh (Höfliche Bitten & Fragen)',
              bulletPoints: [
                'Könnten Sie das bitte wiederholen? (Fadlan ma ii soo celin kartaa intaas?)',
                'Wie bitte? Ich habe das nicht ganz verstanden. (Sidee? Waxaas si buuxda uma fahmin.)',
                'Was kostet dieses Ticket nach Frankfurt? (Immisa ayuu ku kacayaa tigidhkan Frankfurt loo socdo?)',
                'Darf ich Ihnen eine Frage stellen? (Ma ku weydiin karaa hal su\'aal?)'
              ]
            }
          ]
        }
      },
      {
        pageNumber: 4,
        chapterTitle: 'Qaybta 3: Eraybixinta Muhiimka ah (Wortschatzliste)',
        chapterSomali: 'Liiska Erayada Ugu Badan ee Imtixaanka & Shaqada',
        badge: 'WORTSCHATZ',
        content: {
          heading: 'Eraybixinta Heerka Sare & Tusaalooyinkooda Nololeed',
          subheading: 'A1-B2 Wortschatz mit Beispielsätzen auf Deutsch und Somali',
          sections: [
            {
              title: 'Erayada Xiriirka & Shaqaalaynta (Beruf & Ausbildung)',
              tableData: [
                { col1: 'das Vorstellungsgespräch', col2: 'Wareysiga shaqo gelitaanka (Job interview)', col3: 'Morgen habe ich ein Vorstellungsgespräch.' },
                { col1: 'der Lebenslauf', col2: 'CV-ga qofka / Taariikh nololeedka shaqada', col3: 'Ich habe meinen Lebenslauf aktualisiert.' },
                { col1: 'das Anschreiben', col2: 'Warqadda codsiga shaqada (Cover letter)', col3: 'Das Anschreiben muss professionell sein.' },
                { col1: 'die Krankenversicherung', col2: 'Caymiska caafimaadka (Health insurance)', col3: 'In Deutschland ist die Versicherung Pflicht.' },
                { col1: 'der Arbeitsvertrag', col2: 'Heshiiska shaqada (Employment contract)', col3: 'Ich unterschreibe den Vertrag heute.' }
              ]
            },
            {
              title: 'Laylis: Geli Erayga Saxda ah (Übungsaufgabe)',
              bulletPoints: [
                '1. Ich habe gestern meine Prüfung mit 95 Punkten _________ (bestanden / verloren).',
                '2. Der Auszubildende arbeitet _________ Tage in der Woche im Krankenhaus (drei / rot).',
                '3. Können Sie mir bitte Ihren Ausweis _________? (zeigen / schlafen).'
              ],
              callout: {
                type: 'tip',
                title: 'Jawaabaha Saxda ah (Lösungen)',
                text: '1. bestanden (ku baasay) | 2. drei (saddex) | 3. zeigen (tusi)'
              }
            }
          ]
        }
      },
      {
        pageNumber: 5,
        chapterTitle: 'Qaybta 4: Tusaalaha Imtixaanka Goethe (Modelltest)',
        chapterSomali: 'Xeeladaha Qorista & Akhriska ee Goethe-Zertifikat',
        badge: 'PRÜFUNGSTRAINING',
        content: {
          heading: 'Goethe-Zertifikat: Qaybta Qoraalka (Schreiben Teil 1 & 2)',
          subheading: 'Sida loo qoro emayl rasmi ah oo aad ku hesho 100% dhibcaha',
          sections: [
            {
              title: 'Foomka Emaylka Rasmiga ah (Musterbrief)',
              text_somali: 'Imtixaanka Goethe, waxaa ku soo baxaya hawl ah inaad warqad ama emayl u qorto xafiis, macallin, ama shirkad. Raac hab-dhismeedkan saxda ah:',
              text_german: 'Sehr geehrte Damen und Herren,\n\nich schreibe Ihnen, weil ich mich für den Deutschkurs anmelden möchte. Ich heiße Yahye und lebe in Berlin. Könnten Sie mir bitte Informationen zu den Kurszeiten und Kosten zusenden?\n\nIch bedanke mich im Voraus für Ihre Unterstützung.\n\nMit freundlichen Grüßen,\nYahye Hassan Cali',
              callout: {
                type: 'exam',
                title: 'Qodobbada Dhibcaha lagu siiyo:',
                text: '1. Salaanta rasmiga ah (Sehr geehrte Damen und Herren / Sehr geehrter Herr...) | 2. Sababta aad u qorayso (Ich schreibe Ihnen, weil...) | 3. Su\'aalaha la codsaday | 4. Sagootinta rasmiga ah (Mit freundlichen Grüßen).'
              }
            }
          ]
        }
      },
      {
        pageNumber: 6,
        chapterTitle: 'Qaybta 5: Ausbildung & Mustaqbalka Jarmalka',
        chapterSomali: 'Talooyinka Helitaanka Tababarka Shaqada & Fiisada',
        badge: 'KARRIERE IN DEUTSCHLAND',
        content: {
          heading: 'Hagaha Ausbildung-ka ee Dhallinyarada Soomaaliyeed',
          subheading: 'Schritte zur erfolgreichen Bewerbung für eine Ausbildung in Deutschland',
          sections: [
            {
              title: '5-ta Tallaabo ee ugu Muhiimsan:',
              bulletPoints: [
                'Heerka Luuqadda: Gaar ugu yaraan shahaadada Goethe B1 ama B2 si codsigaaga loo tixgeliyo.',
                'Turjumaadda Shahaadada Dugsiga Sare: U turjun af-jarmal oo ka hel xaqiijin (Anerkennung).',
                'Diyaarinta CV-ga Qaabka Europass/Jarmalka (Tabellarischer Lebenslauf) oo leh sawir rasmi ah.',
                'Codsiga Shirkadaha: Isticmaal bogagga sida Azubiyo, Ausbildung.de, iyo Agentur für Arbeit.',
                'Wareysiga Safaaradda: Diyaari jawaabaha sababta aad u dooratay shaqadan gaarka ah.'
              ],
              callout: {
                type: 'warning',
                title: 'Xusuusin Muhiim Ah',
                text: 'MC ACCADAMY waxay ardayda dhammeysata koorsada ka caawisaa dib-u-eegista CV-ga iyo diyaarinta wareysiga safaaradda lacag la\'aan.'
              }
            }
          ]
        }
      }
    ];
  };

  const pages = getBookletPages();
  const totalPages = pages.length;
  const activePageData = pages[currentPage - 1] || pages[0];

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  const toggleBookmark = (pageNo: number) => {
    setBookmarkedPages(prev => 
      prev.includes(pageNo) ? prev.filter(p => p !== pageNo) : [...prev, pageNo]
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareOrCopy = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-2 sm:p-4 overflow-hidden animate-fadeIn">
      <div 
        className={`bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col transition-all duration-200 overflow-hidden ${
          isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-5xl h-[92vh]'
        }`}
      >
        {/* HEADER TOOLBAR */}
        <div className="bg-[#07241b] border-b border-emerald-900/60 px-4 py-3 flex items-center justify-between gap-4 text-white shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-700/50 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded">
                  PDF Study Material
                </span>
                <span className="text-xs font-semibold text-emerald-300 truncate hidden sm:inline">
                  {course?.title || 'German Course Material'}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-extrabold text-white truncate">
                {resource.title}
              </h2>
            </div>
          </div>

          {/* Action controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Zoom Controls */}
            {isEnrolled && (
              <div className="hidden md:flex items-center bg-black/30 rounded-xl px-1.5 py-1 border border-white/10 text-xs">
                <button
                  onClick={() => setZoomLevel(z => Math.max(z - 15, 75))}
                  className="p-1 hover:text-emerald-300 text-slate-300 transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="px-1.5 font-mono text-[11px] text-slate-300">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel(z => Math.min(z + 15, 140))}
                  className="p-1 hover:text-emerald-300 text-slate-300 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Print button */}
            {isEnrolled && (
              <button
                onClick={handlePrint}
                className="hidden sm:inline-flex p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                title="Print Booklet"
              >
                <Printer className="w-4 h-4" />
              </button>
            )}

            {/* Bookmark button */}
            {isEnrolled && (
              <button
                onClick={() => toggleBookmark(currentPage)}
                className={`p-2 rounded-xl transition-colors ${
                  bookmarkedPages.includes(currentPage)
                    ? 'text-amber-400 bg-amber-400/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
                title="Bookmark Page"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            )}

            {/* Fullscreen toggle */}
            <button
              onClick={() => setIsFullscreen(f => !f)}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white hover:bg-red-500/20 rounded-xl transition-colors"
              title="Close Reader"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PAYWALL ACCESS GATE IF NOT ENROLLED */}
        {!isEnrolled ? (
          <div className="flex-1 bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="max-w-md space-y-5 bg-slate-800/80 border border-slate-700 p-8 rounded-3xl shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
                <Lock className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded">
                  Qoraalkan Waa Xiran Yahay (Locked Resource)
                </span>
                <h3 className="text-xl font-bold text-white">
                  PDF-kan waxaa la furaa lacag-bixinta kadib
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Buugga naxwaha, laylisyada, iyo agabka rasmiga ah ee koorsada <strong className="text-emerald-400">"{course?.title}"</strong> waxaa si buuxda loogu furaa ardayda xaqiijiyay iibsashada koorsada.
                </p>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-700/60 text-left space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Waxyaabaha aad helayso marka aad iibsato:</span>
                </div>
                <ul className="space-y-1 pl-6 list-disc text-slate-400 text-[11px]">
                  <li>Helitaanka buugga oo dhan oo daabacan ama PDF ahaan loo akhriyo</li>
                  <li>Tusaalayaasha imtixaanka Goethe-Zertifikat oo dhamaystiran</li>
                  <li>Dhammaan casharrada muuqaallada ah ee koorsada</li>
                  <li>Shahaadada rasmiga ah marka aad dhammaystirto koorsada</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {onUnlockCourse && (
                  <button
                    onClick={() => {
                      onClose();
                      onUnlockCourse();
                    }}
                    className="flex-1 py-3 px-5 bg-gradient-to-r from-emerald-600 to-[#0a2f24] hover:from-emerald-500 hover:to-[#0d3b2e] text-white font-bold text-xs rounded-xl shadow-lg transition-all"
                  >
                    Iibso Koorsada Hadda (${course?.discount_price || course?.price || 29})
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="py-3 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
                >
                  Dib u noqo
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ENROLLED VIEW: UNLOCKED DOCUMENT VIEWER */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-950">
            
            {/* SIDEBAR: Table of Contents & Bookmarks */}
            <div className="hidden md:flex w-64 bg-slate-900/90 border-r border-slate-800 flex-col shrink-0 text-slate-300">
              <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  Tusmada Buugga (Contents)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{pages.length} Pages</span>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {pages.map((p) => {
                  const isActive = currentPage === p.pageNumber;
                  const isBookmarked = bookmarkedPages.includes(p.pageNumber);

                  return (
                    <button
                      key={p.pageNumber}
                      onClick={() => setCurrentPage(p.pageNumber)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 ${
                        isActive
                          ? 'bg-emerald-600 text-white font-bold shadow-xs'
                          : 'hover:bg-slate-800/80 text-slate-300'
                      }`}
                    >
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        p.{p.pageNumber}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs">{p.chapterSomali}</p>
                        <p className={`text-[10px] truncate ${isActive ? 'text-emerald-100' : 'text-slate-500'}`}>
                          {p.chapterTitle}
                        </p>
                      </div>
                      {isBookmarked && (
                        <Bookmark className="w-3 h-3 text-amber-400 fill-current shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Watermark notice */}
              <div className="p-3 bg-slate-900 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                <div className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle className="w-3 h-3" />
                  <span>Lacagta la xaqiijiyay</span>
                </div>
                <span className="font-mono text-slate-500">MC-A1B2</span>
              </div>
            </div>

            {/* MAIN PDF PAGE VIEW */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-950/80">
              <div 
                className="bg-white text-slate-900 rounded-xl shadow-2xl p-6 sm:p-12 w-full max-w-3xl transition-transform duration-150 origin-top flex flex-col justify-between min-h-[750px]"
                style={{ transform: `scale(${zoomLevel / 100})` }}
              >
                {/* PDF Page Header */}
                <div className="border-b border-slate-200 pb-4 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[#0a2f24] tracking-tight">MC ACCADAMY</span>
                    <span>·</span>
                    <span className="font-medium text-slate-600">{course?.level} Student Workbook</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                      {activePageData.badge || 'VERIFIED MATERIAL'}
                    </span>
                    <span className="font-mono text-slate-400">Bogga {currentPage} / {totalPages}</span>
                  </div>
                </div>

                {/* PDF Page Content */}
                <div className="py-6 space-y-6 flex-1">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                      {activePageData.chapterSomali}
                    </span>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                      {activePageData.content.heading}
                    </h1>
                    {activePageData.content.subheading && (
                      <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
                        {activePageData.content.subheading}
                      </p>
                    )}
                  </div>

                  {/* Sections */}
                  {activePageData.content.sections.map((sec, idx) => (
                    <div key={idx} className="space-y-3 pt-2">
                      <h2 className="text-sm sm:text-base font-bold text-slate-900 border-l-4 border-emerald-700 pl-3">
                        {sec.title}
                      </h2>

                      {sec.text_somali && (
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                          {sec.text_somali}
                        </p>
                      )}

                      {sec.text_german && (
                        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 font-mono text-xs sm:text-sm text-slate-800 whitespace-pre-line">
                          {sec.text_german}
                        </div>
                      )}

                      {/* Table if present */}
                      {sec.tableData && (
                        <div className="overflow-x-auto rounded-xl border border-slate-200">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-100 text-slate-700 font-bold">
                              <tr>
                                <th className="p-2.5">Qodobka / Erayga</th>
                                <th className="p-2.5">Macnaha & Tusaalaha</th>
                                {sec.tableData[0]?.col3 && <th className="p-2.5">Xeerka / Faahfaahinta</th>}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {sec.tableData.map((row, rIdx) => (
                                <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                  <td className="p-2.5 font-bold text-emerald-950 font-mono">{row.col1}</td>
                                  <td className="p-2.5 text-slate-800">{row.col2}</td>
                                  {row.col3 && <td className="p-2.5 text-slate-500 text-[11px]">{row.col3}</td>}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Bullet points if present */}
                      {sec.bulletPoints && (
                        <ul className="space-y-1.5 pl-4 list-disc text-xs sm:text-sm text-slate-700">
                          {sec.bulletPoints.map((bp, bIdx) => (
                            <li key={bIdx} className="leading-relaxed">{bp}</li>
                          ))}
                        </ul>
                      )}

                      {/* Callout box */}
                      {sec.callout && (
                        <div className={`p-4 rounded-xl text-xs sm:text-sm space-y-1 border ${
                          sec.callout.type === 'tip'
                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                            : sec.callout.type === 'exam'
                            ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                            : 'bg-red-50/80 border-red-200 text-red-950'
                        }`}>
                          <p className="font-bold flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                            <span>{sec.callout.title}</span>
                          </p>
                          <p className="text-xs leading-relaxed">{sec.callout.text}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* PDF Page Footer with Official Seal & Verification Note */}
                <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Lahaanshaha Qoraalka: MC ACCADAMY · Xubin rasmi ah</span>
                  </div>
                  <div className="text-right">
                    <span>Bogga {currentPage} ee {totalPages} · Qoraal la xaqiijiyay</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* BOTTOM PAGINATION BAR */}
        {isEnrolled && (
          <div className="bg-[#07241b] border-t border-emerald-900/60 px-4 py-2.5 flex items-center justify-between text-white shrink-0 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                className="px-3 py-1.5 bg-emerald-800/80 hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-800/80 text-white rounded-lg flex items-center gap-1 font-semibold transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Kii Hore (Prev)</span>
              </button>
              
              <div className="flex items-center gap-1 font-mono text-slate-300">
                <span>Bogga</span>
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= 1 && val <= totalPages) setCurrentPage(val);
                  }}
                  className="w-12 bg-black/40 border border-white/20 rounded text-center text-white py-0.5 px-1 font-bold"
                />
                <span>/ {totalPages}</span>
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className="px-3 py-1.5 bg-emerald-800/80 hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-800/80 text-white rounded-lg flex items-center gap-1 font-semibold transition-colors"
              >
                <span className="hidden sm:inline">Kee Xiga (Next)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={resource.download_url || '#'}
                download
                onClick={(e) => {
                  // If dummy url, prevent broken link and notify user
                  if (!resource.download_url || resource.download_url === '#') {
                    e.preventDefault();
                    window.print();
                  }
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-1.5 font-bold transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Degso PDF</span>
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
