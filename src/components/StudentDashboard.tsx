import React, { useState, useEffect } from 'react';
import { Enrollment, Course, Lesson, Order, UserProfile, LessonResource } from '../types/index.ts';
import confetti from 'canvas-confetti';
import { 
  Play, CheckCircle2, Circle, Clock, BookOpen, Award, 
  Download, FileText, Check, ChevronRight, ArrowLeft, 
  Sparkles, ExternalLink, RefreshCw, Volume2, HelpCircle,
  Compass, Target, Lock, Eye, BookMarked, ShieldCheck,
  TrendingUp, Star, Filter, Edit3, GraduationCap, XCircle,
  RotateCcw, Lightbulb, CheckCheck, AlertCircle
} from 'lucide-react';
import { PdfReaderModal } from './PdfReaderModal.tsx';
import { QUIZ_QUESTIONS, QuizQuestion } from '../data/quizQuestions.ts';

interface StudentDashboardProps {
  currentUser: UserProfile;
  enrollments: Enrollment[];
  orders: Order[];
  allCourses?: Course[];
  onRefreshData: () => void;
  onViewReceipt: (order: Order) => void;
  onExploreMore: () => void;
  onEnrollCourse?: (course: Course) => void;
  onSelectCourse?: (course: Course) => void;
  onUpdateLearningGoal?: (newGoal: string) => void;
  initialSelectedCourseId?: string;
}

const PRESET_GOALS = [
  'Goethe-Zertifikat B1 & Ausbildung in Germany',
  'Nursing & Healthcare in Germany (Pflegekräfte)',
  'Goethe A1 Family Reunification Visa (Ehegattennachzug)',
  'University Study & Academic Degree (B2)',
  'Fast Daily Conversation & Speaking Fluency'
];

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  enrollments,
  orders,
  allCourses = [],
  onRefreshData,
  onViewReceipt,
  onExploreMore,
  onEnrollCourse,
  onSelectCourse,
  onUpdateLearningGoal,
  initialSelectedCourseId
}) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'player' | 'library' | 'quiz' | 'orders'>('courses');
  const [activeEnrollment, setActiveEnrollment] = useState<Enrollment | null>(
    enrollments.find(e => e.course_id === initialSelectedCourseId) || enrollments[0] || null
  );
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [activeLessonTab, setActiveLessonTab] = useState<'notes' | 'vocab' | 'resources'>('notes');
  const [revealedVocab, setRevealedVocab] = useState<Record<number, boolean>>({});
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);

  // Goal & Customizer State
  const [currentGoal, setCurrentGoal] = useState<string>(
    currentUser.learning_goal || 'Goethe-Zertifikat B1 & Ausbildung in Germany'
  );
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(currentGoal);

  // PDF Reader Modal State
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [activePdfResource, setActivePdfResource] = useState<{ id: string; title: string; download_url?: string } | null>(null);
  const [activePdfCourse, setActivePdfCourse] = useState<Course | null>(null);
  const [isPdfEnrolled, setIsPdfEnrolled] = useState<boolean>(true);

  // Sync active course & lesson
  useEffect(() => {
    if (activeEnrollment?.course?.lessons?.length) {
      const completed = activeEnrollment.completed_lessons || [];
      const nextUnfinished = activeEnrollment.course.lessons.find(l => !completed.includes(l.id));
      setCurrentLesson(nextUnfinished || activeEnrollment.course.lessons[0]);
    }
  }, [activeEnrollment]);

  // When initialSelectedCourseId changes, select it and open player
  useEffect(() => {
    if (initialSelectedCourseId) {
      const match = enrollments.find(e => e.course_id === initialSelectedCourseId);
      if (match) {
        setActiveEnrollment(match);
        setActiveTab('player');
      }
    }
  }, [initialSelectedCourseId, enrollments]);

  // Handle Mark Lesson Complete
  const handleMarkComplete = async (lessonId: string) => {
    if (!activeEnrollment) return;
    setIsUpdatingProgress(true);

    try {
      const res = await fetch('/api/enrollments/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUser.id,
          course_id: activeEnrollment.course_id,
          lesson_id: lessonId
        })
      });

      const data = await res.json();
      if (data.success) {
        setActiveEnrollment(prev => prev ? {
          ...prev,
          progress_percentage: data.enrollment.progress_percentage,
          completed_lessons: data.enrollment.completed_lessons,
          completed: data.enrollment.completed,
          certificate_id: data.enrollment.certificate_id
        } : null);

        onRefreshData();

        // If completed 100%, trigger celebration!
        if (data.enrollment.completed) {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 }
          });
          setCertificateModalOpen(true);
        } else {
          // Advance to next lesson
          const lessons = activeEnrollment.course?.lessons || [];
          const currentIndex = lessons.findIndex(l => l.id === lessonId);
          if (currentIndex !== -1 && currentIndex + 1 < lessons.length) {
            setCurrentLesson(lessons[currentIndex + 1]);
          }
        }
      }
    } catch (err) {
      console.error('Failed to update progress', err);
    } finally {
      setIsUpdatingProgress(false);
    }
  };

  const handleSaveGoal = () => {
    setCurrentGoal(tempGoal);
    setIsEditingGoal(false);
    if (onUpdateLearningGoal) {
      onUpdateLearningGoal(tempGoal);
    }
  };

  // Open PDF Reader in unlocked mode for enrolled course
  const handleOpenPdfReaderForEnrolled = (course?: Course, resourceTitle?: string) => {
    if (!course) return;
    setActivePdfCourse(course);
    setActivePdfResource({
      id: `pdf-${course.id}`,
      title: resourceTitle || `Buugga & Laylisyada Rasmiga ah: ${course.title_somali}`,
      download_url: '#'
    });
    setIsPdfEnrolled(true);
    setPdfModalOpen(true);
  };

  // Open PDF Reader in locked mode for non-enrolled course (paywall demonstration)
  const handleOpenPdfReaderLocked = (course?: Course) => {
    if (!course) return;
    setActivePdfCourse(course);
    setActivePdfResource({
      id: `pdf-${course.id}`,
      title: `Buugga Naxwaha & Laylisyada: ${course.title_somali}`,
      download_url: '#'
    });
    setIsPdfEnrolled(false);
    setPdfModalOpen(true);
  };

  // Quiz State & Handlers
  const [selectedQuizCourseId, setSelectedQuizCourseId] = useState<string>(
    activeEnrollment?.course_id || enrollments[0]?.course_id || ''
  );
  const [currentQuizQuestionIndex, setCurrentQuizQuestionIndex] = useState<number>(0);
  const [selectedQuizOptionId, setSelectedQuizOptionId] = useState<string | null>(null);
  const [isQuizAnswerSubmitted, setIsQuizAnswerSubmitted] = useState<boolean>(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);

  // Sync selected quiz course with active enrollment if unset
  useEffect(() => {
    if (!selectedQuizCourseId && (activeEnrollment?.course_id || enrollments[0]?.course_id)) {
      setSelectedQuizCourseId(activeEnrollment?.course_id || enrollments[0]?.course_id);
    }
  }, [activeEnrollment, enrollments, selectedQuizCourseId]);

  const activeQuizEnrollment = enrollments.find(e => e.course_id === selectedQuizCourseId) || activeEnrollment || enrollments[0];
  const activeQuizCourse = activeQuizEnrollment?.course;
  const quizCourseLevel = activeQuizCourse?.level || 'A1';

  // Get matching questions for this course level
  const activeQuizQuestions = React.useMemo(() => {
    const matched = QUIZ_QUESTIONS.filter(q => q.level === quizCourseLevel);
    return matched.length > 0 ? matched : QUIZ_QUESTIONS.filter(q => q.level === 'A1');
  }, [quizCourseLevel]);

  const currentQuizQuestion = activeQuizQuestions[currentQuizQuestionIndex] || activeQuizQuestions[0];

  // Calculate quiz score
  const quizScore = React.useMemo(() => {
    let score = 0;
    activeQuizQuestions.forEach(q => {
      if (quizAnswers[q.id] === q.correctOptionId) {
        score += 1;
      }
    });
    return score;
  }, [activeQuizQuestions, quizAnswers]);

  const handleSelectQuizOption = (optionId: string) => {
    if (isQuizAnswerSubmitted) return;
    setSelectedQuizOptionId(optionId);
  };

  const handleSubmitQuizAnswer = () => {
    if (!selectedQuizOptionId || !currentQuizQuestion) return;
    setQuizAnswers(prev => ({
      ...prev,
      [currentQuizQuestion.id]: selectedQuizOptionId
    }));
    setIsQuizAnswerSubmitted(true);
  };

  const handleNextQuizQuestion = () => {
    if (currentQuizQuestionIndex + 1 < activeQuizQuestions.length) {
      const nextIndex = currentQuizQuestionIndex + 1;
      setCurrentQuizQuestionIndex(nextIndex);
      const nextQ = activeQuizQuestions[nextIndex];
      setSelectedQuizOptionId(quizAnswers[nextQ?.id] || null);
      setIsQuizAnswerSubmitted(!!quizAnswers[nextQ?.id]);
    } else {
      setIsQuizCompleted(true);
      // Calculate final score including current question if not yet recorded
      const finalScore = quizScore + (selectedQuizOptionId === currentQuizQuestion.correctOptionId && !quizAnswers[currentQuizQuestion.id] ? 1 : 0);
      const percent = Math.round((finalScore / activeQuizQuestions.length) * 100);
      if (percent >= 60) {
        confetti({
          particleCount: 110,
          spread: 75,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuizQuestionIndex(0);
    setSelectedQuizOptionId(null);
    setIsQuizAnswerSubmitted(false);
    setQuizAnswers({});
    setIsQuizCompleted(false);
  };

  const handleSwitchQuizCourse = (courseId: string) => {
    setSelectedQuizCourseId(courseId);
    setCurrentQuizQuestionIndex(0);
    setSelectedQuizOptionId(null);
    setIsQuizAnswerSubmitted(false);
    setQuizAnswers({});
    setIsQuizCompleted(false);
  };

  // Algorithmic Recommendations Calculation
  const calculateRecommendations = () => {
    if (!allCourses || allCourses.length === 0) return [];

    const enrolledIds = new Set(enrollments.map(e => e.course_id));
    const activeLevel = enrollments[0]?.course?.level;
    const activeProgress = enrollments[0]?.progress_percentage || 0;
    const goalLower = currentGoal.toLowerCase();

    return allCourses
      .filter(c => !enrolledIds.has(c.id))
      .map(course => {
        let matchScore = 75;
        let matchTag = 'Ku Habboon Heerkaaga';
        let matchReason = 'Koorso kugu caawinaysa kobcinta fahamkaaga iyo ku hadalka af-jarmalka.';

        // 1. Next step sequencing
        if (activeLevel === 'A1' && course.level === 'A2') {
          matchScore = 98;
          matchTag = 'Tallaabada Xigta ee A1 (Next Step)';
          matchReason = `Maadaama aad bilaawday A1 (${activeProgress}% dhameystiran), A2 waa tallaabada dabiiciga ah ee ku xigta si aad u hesho hadal xor ah.`;
        } else if (activeLevel === 'A2' && course.level === 'B1') {
          matchScore = 97;
          matchTag = 'Tallaabada Xigta ee A2';
          matchReason = 'Heerka B1 wuxuu kuu furayaa fursadaha shaqada iyo deganaanshaha Jarmalka.';
        }

        // 2. Goal-based matching
        if ((goalLower.includes('ausbildung') || goalLower.includes('shaqo') || goalLower.includes('work')) && course.level === 'B1') {
          matchScore = Math.max(matchScore, 99);
          matchTag = '🎯 Bartilmaameedka Ausbildung';
          matchReason = 'Dalka Jarmalka shuruudaha tababarka Ausbildung inta badan waxay u baahan yihiin ugu yaraan heerka B1.';
        }

        if ((goalLower.includes('nursing') || goalLower.includes('pflege') || goalLower.includes('caafimaad') || goalLower.includes('healthcare')) && course.level === 'Medical / Healthcare') {
          matchScore = 100;
          matchTag = '🏥 Bartilmaameedka Caafimaadka & Daryeelka';
          matchReason = 'Si toos ah ugu habboon hadafkaaga daryeelka bukaanka iyo shaqada isbitaallada Jarmalka (Pflegekräfte).';
        }

        if ((goalLower.includes('goethe') || goalLower.includes('zertifikat') || goalLower.includes('visa') || goalLower.includes('imtixaan')) && course.level === 'Goethe Exam Prep') {
          matchScore = Math.max(matchScore, 96);
          matchTag = '🏆 Xeeladaha Imtixaanka Goethe';
          matchReason = 'Diyaarinta 4-ta qaybood ee imtixaanka Goethe si aad u hesho dhibco sare oo shahaado buuxda ah.';
        }

        if ((goalLower.includes('university') || goalLower.includes('jaamacad') || goalLower.includes('academic')) && course.level === 'B2') {
          matchScore = Math.max(matchScore, 95);
          matchTag = '🎓 Heerka Waxbarashada Jaamacadda';
          matchReason = 'Heerka B2 waa shuruudda guud ee lagu galo koorsooyinka sare iyo jaamacadaha Jarmalka.';
        }

        if (goalLower.includes('visa') && course.level === 'A1') {
          matchScore = Math.max(matchScore, 99);
          matchTag = '💍 Shuruudda Fiisada Safaaradda';
          matchReason = 'Koorsadan A1 waa shuruudda ugu muhiimsan ee fiisada isu-tagga qoyska (Familienzusammenführung).';
        }

        return {
          course,
          matchScore,
          matchTag,
          matchReason
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  };

  const recommendations = calculateRecommendations();
  const userOrders = orders.filter(o => o.user_id === currentUser.id);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* STUDENT WELCOME & LEARNING GOAL BANNER */}
        <div className="bg-gradient-to-r from-[#07241b] via-[#0a2f24] to-[#0d3b2e] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          {/* Subtle background ornamentation */}
          <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-300">
                <Award className="w-4 h-4" />
                <span>MC ACCADAMY · Student Learning Center</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Kusoo dhawaow, {currentUser.full_name}!
              </h1>
              
              {/* Dynamic Goal Badge & Editor */}
              <div className="pt-1 flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15 text-xs">
                  <Target className="w-3.5 h-3.5 text-amber-300" />
                  <span className="text-emerald-200 font-medium">Hadafkaaga:</span>
                  <span className="font-bold text-white">{currentGoal}</span>
                </div>

                <button
                  onClick={() => {
                    setTempGoal(currentGoal);
                    setIsEditingGoal(!isEditingGoal);
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-amber-200 bg-black/20 hover:bg-black/30 px-2.5 py-1.5 rounded-xl transition-colors border border-white/10"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Beddel Hadafka (Change Goal)</span>
                </button>
              </div>

              {/* Goal Selection Dropdown Panel */}
              {isEditingGoal && (
                <div className="mt-3 p-4 bg-slate-900/95 backdrop-blur-lg rounded-2xl border border-emerald-500/30 shadow-2xl max-w-lg space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-emerald-400" />
                      Dooro Hadafkaaga Weyn ee Af-Jarmalka
                    </span>
                    <button 
                      onClick={() => setIsEditingGoal(false)}
                      className="text-slate-400 hover:text-white text-xs font-semibold"
                    >
                      Ka laabo
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5">
                    {PRESET_GOALS.map((g) => (
                      <button
                        key={g}
                        onClick={() => {
                          setTempGoal(g);
                        }}
                        className={`text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between ${
                          tempGoal === g
                            ? 'bg-emerald-600 text-white font-bold'
                            : 'bg-white/5 hover:bg-white/10 text-slate-200'
                        }`}
                      >
                        <span className="truncate">{g}</span>
                        {tempGoal === g && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    ))}
                  </div>

                  {/* Custom goal input */}
                  <div className="pt-1 flex gap-2">
                    <input
                      type="text"
                      value={tempGoal}
                      onChange={(e) => setTempGoal(e.target.value)}
                      placeholder="Geli hadaf kuu gaar ah..."
                      className="flex-1 bg-black/40 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400"
                    />
                    <button
                      onClick={handleSaveGoal}
                      className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors"
                    >
                      Keydi Hadafka
                    </button>
                  </div>
                </div>
              )}

              <p className="text-xs text-emerald-100 max-w-xl">
                Baro Jarmalka heerka A1 ilaa B2 adigoo ku baranaya af-soomaali, akhri buugaagta PDF ee lacagta laga bixiyay, kuna baas imtixaanka Goethe.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 text-center">
                <span className="block text-2xl font-black text-amber-300 tabular-nums">
                  {enrollments.length}
                </span>
                <span className="text-[11px] text-emerald-200 font-medium">Koorsooyinkaaga</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 text-center">
                <span className="block text-2xl font-black text-white tabular-nums">
                  {enrollments.filter(e => e.completed).length}
                </span>
                <span className="text-[11px] text-emerald-200 font-medium">Shahaadooyinka</span>
              </div>
            </div>
          </div>
        </div>

        {/* DASHBOARD NAVIGATION TABS */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'courses'
                  ? 'bg-[#0a2f24] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Koorsooyinkayga ({enrollments.length})
            </button>

            {activeEnrollment && (
              <button
                onClick={() => setActiveTab('player')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'player'
                    ? 'bg-[#0a2f24] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Play className="w-3.5 h-3.5 text-amber-400 fill-current" />
                <span>Daawashada Casharka</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('library')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'library'
                  ? 'bg-[#0a2f24] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>Buugaagta PDF-ka (Unlocked Library)</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'quiz'
                  ? 'bg-[#0a2f24] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <span>Imtixaanka Kooban (Quiz)</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'orders'
                  ? 'bg-[#0a2f24] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Diiwaanka Iibsashada ({userOrders.length})
            </button>
          </div>

          <button
            onClick={onExploreMore}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950"
          >
            <span>Koorsooyin kale ka raadi</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* TAB 1: ENROLLED COURSES + RECOMMENDED FOR YOU */}
        {activeTab === 'courses' && (
          <div className="space-y-10">
            
            {/* 1A. ENROLLED ACTIVE COURSES */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Koorsooyinkaaga Firfircoon (My Enrolled Courses)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Koorsooyinka aad bixisay lacagtooda oo aad haysato ogolaansho buuxa
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  {enrollments.length} Koorso oo furan
                </span>
              </div>

              {enrollments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrollments.map(enr => {
                    const course = enr.course;
                    if (!course) return null;
                    const totalLessons = course.lessons?.length || course.total_lessons || 1;
                    const completedCount = enr.completed_lessons?.length || 0;

                    return (
                      <div
                        key={enr.id}
                        className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                      >
                        <div>
                          {/* Course Thumbnail */}
                          <div className="relative aspect-16/9 bg-slate-900 overflow-hidden">
                            <img
                              src={course.thumbnail_url || '/assets/aistudio/05F8C6A4-5FFB-4D4A-B2E5-11DF7B585E48_8e6b0422.jpeg'}
                              alt={course.title}
                              className="w-full h-full object-cover opacity-85"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-3 left-3">
                              <span className="px-2.5 py-1 text-xs font-bold bg-white/95 text-slate-900 rounded-md shadow-xs">
                                {course.level}
                              </span>
                            </div>
                            {enr.completed && (
                              <div className="absolute top-3 right-3">
                                <span className="px-2.5 py-1 text-xs font-extrabold bg-amber-400 text-slate-950 rounded-md shadow-xs flex items-center gap-1">
                                  <Award className="w-3.5 h-3.5" />
                                  <span>Dhameystiran</span>
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Details */}
                          <div className="p-5 space-y-3">
                            <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                              {course.title}
                            </h3>
                            <p className="text-xs font-medium text-emerald-800 line-clamp-1">
                              {course.title_somali}
                            </p>

                            {/* Progress Bar */}
                            <div className="space-y-1.5 pt-2">
                              <div className="flex justify-between text-xs font-semibold text-slate-600">
                                <span>Heerka Daawashada (Progress)</span>
                                <span className="tabular-nums font-bold text-emerald-700">
                                  {enr.progress_percentage}%
                                </span>
                              </div>
                              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                                  style={{ width: `${enr.progress_percentage}%` }}
                                />
                              </div>
                              <p className="text-[11px] text-slate-400">
                                {completedCount} ka mid ah {totalLessons} cashar ayaa la dhameeyay
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Card Actions: Watch Video + Read PDF */}
                        <div className="p-5 pt-0 space-y-2">
                          <button
                            onClick={() => {
                              setActiveEnrollment(enr);
                              setActiveTab('player');
                            }}
                            className="w-full py-2.5 bg-[#0a2f24] hover:bg-[#0d3b2e] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
                          >
                            <Play className="w-3.5 h-3.5 text-amber-400 fill-current" />
                            <span>
                              {enr.progress_percentage > 0 ? 'Sii wad Daawashada' : 'Bilow Casharka 1'}
                            </span>
                          </button>

                          <button
                            onClick={() => handleOpenPdfReaderForEnrolled(course)}
                            className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-emerald-200"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Aqri Buugga PDF (Workbook Unlocked)</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center space-y-4">
                  <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="text-base font-bold text-slate-800">Weli wax koorso ah kuma lihid</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Koorsooyinka Af-Jarmalka ee A1, A2, B1 ama Kalkaaliyeyaasha Caafimaadka midkood dooro si aad waxbarashadaada u bilowdo.
                  </p>
                  <button
                    onClick={onExploreMore}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    Iibso Koorsadaadii Ugu Horeysay
                  </button>
                </div>
              )}
            </div>

            {/* 1B. RECOMMENDED FOR YOU (ALGORITHMIC SUGGESTIONS) */}
            <div className="bg-gradient-to-br from-emerald-50/70 via-white to-slate-50 p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-emerald-600 text-white">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                      Koorsooyinka Laguu Soo Jeediyay (Recommended for You)
                    </h2>
                  </div>
                  <p className="text-xs text-slate-600">
                    Waxaa loo habeeyay iyadoo la eegayo heerkaaga waxbarasho iyo hadafkaaga: <strong className="text-emerald-900">"{currentGoal}"</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-200">
                    {recommendations.length} Koorso oo laguu doortay
                  </span>
                </div>
              </div>

              {/* Recommendation Cards Grid */}
              {recommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map(({ course, matchScore, matchTag, matchReason }) => {
                    const price = course.discount_price ?? course.price;

                    return (
                      <div
                        key={course.id}
                        className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                      >
                        <div>
                          {/* Course Thumbnail & Recommendation Badge */}
                          <div className="relative aspect-16/9 bg-slate-900 overflow-hidden">
                            <img
                              src={course.thumbnail_url || '/assets/aistudio/05F8C6A4-5FFB-4D4A-B2E5-11DF7B585E48_8e6b0422.jpeg'}
                              alt={course.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                              referrerPolicy="no-referrer"
                            />
                            
                            {/* Match score chip */}
                            <div className="absolute top-3 left-3 flex flex-col gap-1">
                              <span className="px-2.5 py-1 text-xs font-black bg-emerald-600 text-white rounded-lg shadow-sm flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                <span>{matchScore}% Match</span>
                              </span>
                            </div>

                            <div className="absolute top-3 right-3">
                              <span className="px-2 py-1 text-[11px] font-bold bg-white/95 text-slate-900 rounded-md shadow-xs">
                                {course.level}
                              </span>
                            </div>
                          </div>

                          {/* Body */}
                          <div className="p-5 space-y-3">
                            <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide bg-amber-50 text-amber-900 border border-amber-200">
                              {matchTag}
                            </div>

                            <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                              {course.title}
                            </h3>
                            <p className="text-xs text-emerald-800 font-semibold line-clamp-1">
                              {course.title_somali}
                            </p>

                            {/* Why recommended callout */}
                            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-600 leading-relaxed">
                              <strong className="text-slate-800 block mb-0.5">Sababta Laguu Soo Jeediyay:</strong>
                              {matchReason}
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-2 pt-1">
                              <span className="text-xl font-extrabold text-[#0a2f24] tabular-nums">
                                ${price}
                              </span>
                              {course.discount_price && (
                                <span className="text-xs text-slate-400 line-through tabular-nums">
                                  ${course.price}
                                </span>
                              )}
                              <span className="text-[11px] text-emerald-700 font-bold ml-auto">
                                Helitaanka Buugga PDF
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Card Actions */}
                        <div className="p-5 pt-0 space-y-2">
                          <button
                            onClick={() => onEnrollCourse ? onEnrollCourse(course) : onExploreMore()}
                            className="w-full py-2.5 bg-gradient-to-r from-emerald-700 to-[#0a2f24] hover:from-emerald-600 hover:to-[#0d3b2e] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                          >
                            <span>Iibso Hadda (Enroll Now) · ${price}</span>
                          </button>

                          <div className="grid grid-cols-2 gap-2">
                            {onSelectCourse && (
                              <button
                                onClick={() => onSelectCourse(course)}
                                className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-xl transition-colors"
                              >
                                Eeg Manhajka
                              </button>
                            )}

                            {/* PDF Preview / Locked demo */}
                            <button
                              onClick={() => handleOpenPdfReaderLocked(course)}
                              className="py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-bold rounded-xl transition-colors border border-amber-200 flex items-center justify-center gap-1"
                              title="Waxa la furaa lacag-bixinta kadib"
                            >
                              <Lock className="w-3 h-3 text-amber-700" />
                              <span>Tusaale PDF</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <p className="font-bold text-slate-800 text-sm">
                    Hambalyo! Dhammaan koorsooyinka manhajka waad diiwaangashatay.
                  </p>
                  <p className="text-xs text-slate-500">
                    Sii wad casharradaada si aad u qaadato shahaadooyinka Goethe A1 ilaa B2.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: INTERACTIVE LESSON PLAYER & IN-APP PDF RESOURCES */}
        {activeTab === 'player' && activeEnrollment && activeEnrollment.course && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 8 cols: Video Player + Notes & Vocabulary */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Back to courses button */}
              <button
                onClick={() => setActiveTab('courses')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Ku noqo Koorsooyinkayga</span>
              </button>

              {/* Video Player Box */}
              <div className="bg-black rounded-3xl overflow-hidden shadow-2xl relative">
                <video
                  key={currentLesson?.id}
                  controls
                  className="w-full aspect-16/9 bg-black"
                  src={currentLesson?.video_url || 'https://www.w3schools.com/html/mov_bbb.mp4'}
                  poster={activeEnrollment.course.thumbnail_url}
                  ref={(el) => {
                    if (el) el.playbackRate = playbackSpeed;
                  }}
                >
                  Birif-kaagu ma taageerayo muuqaalka.
                </video>

                {/* Top Video Overlay Info */}
                <div className="p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent absolute top-0 left-0 right-0 text-white flex items-center justify-between pointer-events-none">
                  <div>
                    <span className="text-[11px] text-amber-300 font-mono uppercase tracking-wider">
                      {activeEnrollment.course.level} · Casharka {currentLesson?.order_index || 1}
                    </span>
                    <h3 className="text-sm font-bold truncate max-w-md">
                      {currentLesson?.title_somali || currentLesson?.title}
                    </h3>
                  </div>

                  {/* Playback speed buttons */}
                  <div className="pointer-events-auto flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-xl border border-white/20 text-xs">
                    {[0.75, 1, 1.25, 1.5].map(speed => (
                      <button
                        key={speed}
                        onClick={() => setPlaybackSpeed(speed)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors ${
                          playbackSpeed === speed ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Lesson Controls & Completion CTA */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    {currentLesson?.title}
                  </h2>
                  <p className="text-xs font-semibold text-emerald-800">
                    {currentLesson?.title_somali}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Read PDF Button */}
                  <button
                    onClick={() => handleOpenPdfReaderForEnrolled(activeEnrollment.course)}
                    className="px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Aqri Buugga PDF</span>
                  </button>

                  {/* Complete Button */}
                  {currentLesson && (
                    <button
                      onClick={() => handleMarkComplete(currentLesson.id)}
                      disabled={isUpdatingProgress}
                      className={`px-4 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 transition-all ${
                        activeEnrollment.completed_lessons?.includes(currentLesson.id)
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-[#0a2f24] hover:bg-[#0d3b2e] text-white shadow-xs'
                      }`}
                    >
                      {activeEnrollment.completed_lessons?.includes(currentLesson.id) ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-700" />
                          <span>Waa la dhameeyay</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{isUpdatingProgress ? 'Waa la keydinayaa...' : 'U calaamadee Dhammaystiran'}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Lesson Tabs: Somali Notes, Vocab Flashcards, Resources */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="flex border-b border-slate-100">
                  <button
                    onClick={() => setActiveLessonTab('notes')}
                    className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors ${
                      activeLessonTab === 'notes'
                        ? 'border-emerald-600 text-emerald-950 bg-emerald-50/40'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Sharaxaadda Af-Soomaaliga
                  </button>
                  <button
                    onClick={() => setActiveLessonTab('vocab')}
                    className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors ${
                      activeLessonTab === 'vocab'
                        ? 'border-emerald-600 text-emerald-950 bg-emerald-50/40'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Eraybixinta & Weedhaha ({currentLesson?.vocabulary?.length || 0})
                  </button>
                  <button
                    onClick={() => setActiveLessonTab('resources')}
                    className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors ${
                      activeLessonTab === 'resources'
                        ? 'border-emerald-600 text-emerald-950 bg-emerald-50/40'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Buugaagta & PDF-yada Unlocked
                  </button>
                </div>

                <div className="p-6">
                  {/* Tab A: Notes */}
                  {activeLessonTab === 'notes' && (
                    <div className="space-y-4 text-xs leading-relaxed text-slate-700">
                      <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 text-slate-900 space-y-2">
                        <p className="font-bold text-emerald-950 flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-emerald-700" />
                          <span>Tilmaamaha Muhiimka ah ee Casharkan:</span>
                        </p>
                        <p>{currentLesson?.notes_somali}</p>
                      </div>

                      {currentLesson?.notes_german && (
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                          <p className="font-bold text-slate-800">Deutsche Grammatik-Hinweise:</p>
                          <p className="font-mono text-slate-600">{currentLesson?.notes_german}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab B: Vocabulary Flashcards */}
                  {activeLessonTab === 'vocab' && (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-500">
                        Guji kaadhka si aad u aragto macnaha af-soomaaliga iyo tusaalaha:
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {(currentLesson?.vocabulary || []).map((item, idx) => {
                          const isRevealed = revealedVocab[idx];

                          return (
                            <div
                              key={idx}
                              onClick={() => setRevealedVocab(prev => ({ ...prev, [idx]: !prev[idx] }))}
                              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                isRevealed
                                  ? 'bg-emerald-50 border-emerald-300'
                                  : 'bg-white hover:bg-slate-50 border-slate-200'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-sm text-slate-900 font-mono">
                                  {item.german}
                                </span>
                                <span className="text-[10px] text-emerald-700 font-semibold">
                                  {isRevealed ? 'Qari' : 'Muuji Macnaha'}
                                </span>
                              </div>

                              {isRevealed && (
                                <div className="mt-2 pt-2 border-t border-emerald-200/80 space-y-1 text-xs animate-fadeIn">
                                  <p className="font-semibold text-emerald-950">{item.somali}</p>
                                  <p className="text-[11px] text-slate-600 italic">
                                    "{item.example_german}"
                                  </p>
                                  <p className="text-[11px] text-slate-500">
                                    ({item.example_somali})
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Tab C: Unlocked Resources & In-App PDF Reader */}
                  {activeLessonTab === 'resources' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-500">
                          Agabyada buugaagta PDF ee koorsadan oo aad toos ugu akhrisan karto internetka ama aad soo degsan karto:
                        </p>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Lacagta la bixiyay · Unlocked
                        </span>
                      </div>

                      <div className="space-y-3">
                        {/* Course Official Study Booklet */}
                        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
                              <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">
                                Buugga Naxwaha & Laylisyada: {activeEnrollment.course.title_somali}
                              </p>
                              <p className="text-[11px] text-emerald-800">
                                Official MC ACCADAMY Study Booklet · 6 Pages · German & Somali
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleOpenPdfReaderForEnrolled(activeEnrollment.course)}
                              className="px-3.5 py-1.5 bg-[#0a2f24] hover:bg-[#0d3b2e] text-white font-bold rounded-lg flex items-center gap-1.5 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5 text-amber-300" />
                              <span>Aqri Hadda (Read PDF)</span>
                            </button>
                            <button
                              onClick={() => window.print()}
                              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-lg border border-slate-200 transition-colors flex items-center gap-1"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Degso</span>
                            </button>
                          </div>
                        </div>

                        {/* Lesson specific resources */}
                        {(currentLesson?.resources || []).map(res => (
                          <div
                            key={res.id}
                            className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-emerald-700" />
                              <div>
                                <p className="font-semibold text-slate-900">{res.title}</p>
                                <p className="text-[10px] text-slate-400">{res.size}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenPdfReaderForEnrolled(activeEnrollment.course, res.title)}
                                className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5 text-emerald-700" />
                                <span>Aqri (Read)</span>
                              </button>
                              <a
                                href={res.download_url}
                                download
                                className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                              >
                                <Download className="w-3.5 h-3.5 text-emerald-700" />
                                <span>Degso</span>
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>

            {/* Right 4 cols: Course Curriculum Sidebar */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                  Manhajka Koorsada
                </span>
                <h3 className="text-sm font-extrabold text-slate-900 mt-0.5">
                  {activeEnrollment.course.title}
                </h3>
                
                {/* Progress Mini Bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Dhammaystirka</span>
                    <span className="text-emerald-700">{activeEnrollment.progress_percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{ width: `${activeEnrollment.progress_percentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Certificate Banner if 100% */}
              {activeEnrollment.progress_percentage >= 100 && (
                <button
                  onClick={() => setCertificateModalOpen(true)}
                  className="w-full p-3 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl text-left flex items-center justify-between text-xs transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="font-bold text-slate-900">Shahaadadii waa diyaar!</p>
                      <p className="text-[11px] text-amber-900">Guji si aad u soo degsato</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-amber-700" />
                </button>
              )}

              {/* Lesson Items */}
              <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto space-y-1 pr-1">
                {(activeEnrollment.course.lessons || []).map((lesson) => {
                  const isCurrent = currentLesson?.id === lesson.id;
                  const isCompleted = activeEnrollment.completed_lessons?.includes(lesson.id);

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setCurrentLesson(lesson)}
                      className={`w-full p-2.5 rounded-xl text-left transition-all flex items-start gap-2.5 text-xs ${
                        isCurrent
                          ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-200'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="pt-0.5">
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="truncate">{lesson.title_somali}</p>
                        <span className="text-[10px] text-slate-400 font-mono">{lesson.duration}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: UNLOCKED PDF WORKBOOK LIBRARY */}
        {activeTab === 'library' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <BookMarked className="w-5 h-5 text-emerald-700" />
                  <span>Maktabadda Buugaagta PDF (Course Workbook Library)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Dhammaan buugaagta, naxwaha, iyo laylisyada Jarmalka ee koorsooyinka aad bixisay lacagtooda. Waxaad toos ugu akhrisan kartaa gudaha website-ka ama waad daabacan kartaa.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Xuquuqda ardayga waa la xaqiijiyay</span>
              </div>
            </div>

            {enrollments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrollments.map(enr => {
                  const course = enr.course;
                  if (!course) return null;

                  return (
                    <div
                      key={enr.id}
                      className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 text-[11px] font-bold bg-emerald-100 text-emerald-900 rounded-md">
                            {course.level} Workbook
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            6 Pages · PDF
                          </span>
                        </div>

                        <div>
                          <h4 className="font-extrabold text-slate-900 text-sm">
                            Buugga Naxwaha & Laylisyada: {course.title_somali}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                            Sharaxaad kooban oo ku saabsan naxwaha, xeeladaha hadalka, iyo laylisyada rasmiga ah ee CEFR {course.level}.
                          </p>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-1">
                          <div className="flex items-center justify-between">
                            <span>Status:</span>
                            <span className="font-bold text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Furan (Unlocked)
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Koorso:</span>
                            <span className="font-medium text-slate-900 truncate max-w-[160px]">{course.title}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        <button
                          onClick={() => handleOpenPdfReaderForEnrolled(course)}
                          className="w-full py-2.5 bg-[#0a2f24] hover:bg-[#0d3b2e] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
                        >
                          <BookOpen className="w-4 h-4 text-amber-300" />
                          <span>Aqri Buugga PDF (Open Reader)</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveEnrollment(enr);
                            setActiveTab('player');
                          }}
                          className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
                        >
                          Eeg Casharrada Muuqaalka
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-200 text-center space-y-3">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-800 text-sm">Weli buug PDF ah kuma lihid</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Marka aad iibsato mid ka mid ah koorsooyinka Jarmalka, buugaagta PDF si toos ah ayaa loogu furi doonaa halkan.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: INTERACTIVE KNOWLEDGE QUIZ */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            
            {/* Quiz Header Card */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-amber-500/15 text-amber-700">
                    <GraduationCap className="w-5 h-5" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Imtixaanka Fahamka & Naxwaha · MC ACCADAMY
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Layliga Fahamka & Xaqiijinta Aqoonta (Knowledge Quiz)
                </h2>
                <p className="text-xs text-slate-600 max-w-xl">
                  Su'aalahan waxaa loogu talagalay in lagu cabbiro fahamkaaga naxwaha, eraybixinta, iyo dhismaha weedhaha Jarmalka iyadoo la raacayo manhajka rasmiga ah ee CEFR (Goethe-Zertifikat).
                </p>
              </div>

              {/* Course Selector & Progress Info */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 shrink-0 min-w-[280px]">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Koorsada la baarayo:</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                    {quizCourseLevel}
                  </span>
                </div>

                {enrollments.length > 1 ? (
                  <select
                    value={selectedQuizCourseId}
                    onChange={(e) => handleSwitchQuizCourse(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
                  >
                    {enrollments.map(enr => (
                      <option key={enr.course_id} value={enr.course_id}>
                        {enr.course?.title_somali || enr.course?.title} ({enr.course?.level})
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xs font-extrabold text-slate-900 truncate">
                    {activeQuizCourse?.title_somali || 'Af-Jarmalka A1'}
                  </p>
                )}

                {/* Course learning progress */}
                <div className="space-y-1 pt-1 border-t border-slate-200/80">
                  <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                    <span>Heerka Daawashadaada:</span>
                    <span className="font-bold text-emerald-700 tabular-nums">
                      {activeQuizEnrollment?.progress_percentage || 0}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                      style={{ width: `${activeQuizEnrollment?.progress_percentage || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* QUIZ ACTIVE VIEW OR RESULT VIEW */}
            {enrollments.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center space-y-4">
                <GraduationCap className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">
                  Weli wax koorso ah ma lihid
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Si aad layliyada iyo imtixaanka kooban u gasho, fadlan marka hore ku biir mid ka mid ah koorsooyinka Jarmalka ee A1, A2 ama B1.
                </p>
                <button
                  onClick={onExploreMore}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Iibso Koorsadaadii Ugu Horeysay
                </button>
              </div>
            ) : !isQuizCompleted ? (
              /* ACTIVE QUESTION CARD */
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                {/* Question progress header */}
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">
                      Su'aasha {currentQuizQuestionIndex + 1} ee {activeQuizQuestions.length}
                    </span>
                    <span>·</span>
                    <span className="font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200 text-[11px]">
                      {currentQuizQuestion?.grammarTopic}
                    </span>
                  </div>

                  <span className="font-mono text-slate-400 text-[11px]">
                    Heerka: {quizCourseLevel}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1 bg-slate-100">
                  <div
                    className="h-full bg-emerald-600 transition-all duration-300"
                    style={{
                      width: `${((currentQuizQuestionIndex + 1) / activeQuizQuestions.length) * 100}%`
                    }}
                  />
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  {/* The Question Text */}
                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                      {currentQuizQuestion?.questionSomali}
                    </h3>
                    {currentQuizQuestion?.questionGerman && (
                      <p className="text-xs sm:text-sm font-semibold text-slate-500 font-mono">
                        {currentQuizQuestion?.questionGerman}
                      </p>
                    )}
                  </div>

                  {/* Context Hint */}
                  {currentQuizQuestion?.contextHint && (
                    <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-950">
                      <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold block text-amber-900">Tilmaan (Tipp):</strong>
                        <span>{currentQuizQuestion.contextHint}</span>
                      </div>
                    </div>
                  )}

                  {/* Options List */}
                  <div className="space-y-3">
                    {currentQuizQuestion?.options.map((option, idx) => {
                      const letter = String.fromCharCode(65 + idx); // A, B, C, D
                      const isSelected = selectedQuizOptionId === option.id;
                      const isCorrect = option.id === currentQuizQuestion.correctOptionId;
                      const isWrong = isSelected && !isCorrect;

                      let buttonStyle = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800';

                      if (isQuizAnswerSubmitted) {
                        if (isCorrect) {
                          buttonStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20';
                        } else if (isWrong) {
                          buttonStyle = 'bg-red-50 border-red-400 text-red-950 ring-2 ring-red-400/20';
                        } else {
                          buttonStyle = 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60';
                        }
                      } else if (isSelected) {
                        buttonStyle = 'bg-emerald-50/80 border-emerald-600 text-emerald-950 ring-2 ring-emerald-600/20 font-bold';
                      }

                      return (
                        <button
                          key={option.id}
                          disabled={isQuizAnswerSubmitted}
                          onClick={() => handleSelectQuizOption(option.id)}
                          className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-4 ${buttonStyle}`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                              isQuizAnswerSubmitted && isCorrect
                                ? 'bg-emerald-600 text-white'
                                : isQuizAnswerSubmitted && isWrong
                                ? 'bg-red-500 text-white'
                                : isSelected
                                ? 'bg-emerald-700 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {letter}
                            </span>
                            <div className="min-w-0">
                              <p className="font-bold text-sm tracking-tight truncate">{option.text}</p>
                              {option.textSomali && (
                                <p className="text-xs text-slate-500 mt-0.5">{option.textSomali}</p>
                              )}
                            </div>
                          </div>

                          <div className="shrink-0">
                            {isQuizAnswerSubmitted && isCorrect && (
                              <span className="flex items-center gap-1 text-xs font-bold text-emerald-700">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span className="hidden sm:inline">Sax</span>
                              </span>
                            )}
                            {isQuizAnswerSubmitted && isWrong && (
                              <span className="flex items-center gap-1 text-xs font-bold text-red-600">
                                <XCircle className="w-4 h-4 text-red-500" />
                                <span className="hidden sm:inline">Qalad</span>
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Immediate Explanation Callout (after submission) */}
                  {isQuizAnswerSubmitted && (
                    <div className={`p-5 rounded-2xl border space-y-2.5 animate-fadeIn ${
                      selectedQuizOptionId === currentQuizQuestion.correctOptionId
                        ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                        : 'bg-red-50/90 border-red-300 text-red-950'
                    }`}>
                      <div className="flex items-center gap-2 font-bold text-sm">
                        {selectedQuizOptionId === currentQuizQuestion.correctOptionId ? (
                          <>
                            <CheckCheck className="w-5 h-5 text-emerald-700" />
                            <span>Jawaabtu Waa Sax! (Ausgezeichnet)</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <span>Jawaabtu Ma Saxna (Falsch)</span>
                          </>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm leading-relaxed">
                        {currentQuizQuestion.explanationSomali}
                      </p>

                      {currentQuizQuestion.explanationGerman && (
                        <div className="p-3 bg-white/70 rounded-xl border border-black/5 font-mono text-xs text-slate-700">
                          <strong>Hinweis: </strong>
                          {currentQuizQuestion.explanationGerman}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions Footer */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <span className="text-xs text-slate-400">
                      {isQuizAnswerSubmitted ? 'Guji badhanka hoose si aad u sii wadato' : 'Dooro hal jawaab kaddibna xaqiiji'}
                    </span>

                    {!isQuizAnswerSubmitted ? (
                      <button
                        disabled={!selectedQuizOptionId}
                        onClick={handleSubmitQuizAnswer}
                        className="px-6 py-2.5 bg-[#0a2f24] hover:bg-[#0d3b2e] disabled:opacity-40 disabled:hover:bg-[#0a2f24] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
                      >
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Xaqiiji Jawaabta (Submit)</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuizQuestion}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
                      >
                        <span>
                          {currentQuizQuestionIndex + 1 < activeQuizQuestions.length
                            ? "Su'aasha Xigta (Next)"
                            : 'Eeg Natiijada (View Results)'}
                        </span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* QUIZ COMPLETION / RESULTS SCREEN */
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-10 text-center space-y-8 animate-fadeIn">
                <div className="max-w-md mx-auto space-y-4">
                  {/* Trophy or Status Icon */}
                  <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-lg ${
                    quizScore / activeQuizQuestions.length >= 0.6
                      ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 text-white'
                      : 'bg-gradient-to-br from-amber-400 to-amber-600 text-white'
                  }`}>
                    {quizScore / activeQuizQuestions.length >= 0.6 ? (
                      <Award className="w-10 h-10" />
                    ) : (
                      <RotateCcw className="w-10 h-10" />
                    )}
                  </div>

                  {/* Score badge */}
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      Natiijada Imtixaanka · {quizCourseLevel}
                    </span>
                    <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 tabular-nums">
                      {quizScore} / {activeQuizQuestions.length} Sax
                    </h3>
                    <p className="text-sm font-bold text-emerald-800 mt-1">
                      {Math.round((quizScore / activeQuizQuestions.length) * 100)}% Dhibcahaaga Guud
                    </p>
                  </div>

                  {/* CEFR Goethe Status Feedback */}
                  <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                    quizScore / activeQuizQuestions.length >= 0.8
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : quizScore / activeQuizQuestions.length >= 0.6
                      ? 'bg-blue-50 border-blue-200 text-blue-950'
                      : 'bg-amber-50 border-amber-200 text-amber-950'
                  }`}>
                    <p className="font-extrabold text-sm mb-1">
                      {quizScore / activeQuizQuestions.length >= 0.8
                        ? '🏆 Heer Sare! (Ausgezeichnet)'
                        : quizScore / activeQuizQuestions.length >= 0.6
                        ? '✅ Waad Baastay! (Bestanden)'
                        : '📚 Ku Celceli (Nochmal üben)'}
                    </p>
                    <p>
                      {quizScore / activeQuizQuestions.length >= 0.6
                        ? 'Waxaad si guul leh u gudubtay xadka ugu yar ee imtixaanka rasmiga ah ee Goethe-Institut (60%). Aqoontaada naxwaha iyo eraybixinta heerkan waa mid aad u wanaagsan.'
                        : 'Dhibcahaagu waxay ka hooseeyaan 60%. Waxaa lagugula talinayaa inaad dib u daawato casharrada naxwaha iyo buugga PDF-ka kaddibna aad imtixaanka mar kale ku celiso.'}
                    </p>
                  </div>
                </div>

                {/* Review of Questions List */}
                <div className="text-left border-t border-slate-100 pt-6 space-y-4 max-w-3xl mx-auto">
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-700" />
                    <span>Dib-u-eegista Su'aalaha (Question Review)</span>
                  </h4>

                  <div className="space-y-3">
                    {activeQuizQuestions.map((q, qIdx) => {
                      const userChoice = quizAnswers[q.id];
                      const isCorrect = userChoice === q.correctOptionId;
                      const correctOpt = q.options.find(o => o.id === q.correctOptionId);
                      const userOpt = q.options.find(o => o.id === userChoice);

                      return (
                        <div
                          key={q.id}
                          className={`p-4 rounded-2xl border text-xs space-y-2 ${
                            isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-red-50/50 border-red-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <span className="font-bold text-slate-900">
                              {qIdx + 1}. {q.questionSomali}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold shrink-0 ${
                              isCorrect ? 'bg-emerald-200 text-emerald-900' : 'bg-red-200 text-red-900'
                            }`}>
                              {isCorrect ? 'Sax' : 'Qalad'}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                            <div>
                              <span className="text-slate-500">Doorashadaadii: </span>
                              <strong className={isCorrect ? 'text-emerald-900' : 'text-red-900'}>
                                {userOpt ? userOpt.text : 'Lama dooran'}
                              </strong>
                            </div>
                            {!isCorrect && (
                              <div>
                                <span className="text-slate-500">Jawaabta Saxda ah: </span>
                                <strong className="text-emerald-800">
                                  {correctOpt?.text}
                                </strong>
                              </div>
                            )}
                          </div>

                          <p className="text-[11px] text-slate-600 bg-white/80 p-2.5 rounded-xl border border-black/5 leading-relaxed">
                            {q.explanationSomali}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Result CTAs */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleRetakeQuiz}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Dib u Bilow Layligan (Retake Quiz)</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('player')}
                    className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 text-amber-300 fill-current" />
                    <span>Ku noqo Casharrada Muuqaalka</span>
                  </button>

                  {activeQuizCourse && (
                    <button
                      onClick={() => handleOpenPdfReaderForEnrolled(activeQuizCourse)}
                      className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center gap-2"
                    >
                      <BookOpen className="w-4 h-4 text-emerald-700" />
                      <span>Aqri Buugga PDF</span>
                    </button>
                  )}
                </div>

              </div>
            )}

          </div>
        )}

        {/* TAB 5: PURCHASE HISTORY & RECEIPTS */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Taariikhda Lacag-Bixinta & Rasiidhada (Purchase History)
              </h3>
              <p className="text-xs text-slate-500">
                Dhammaan koorsooyinka aad ku iibsatay Sifalo Pay (EVC Plus, ZAAD, Sahal) ama Stripe.
              </p>
            </div>

            {userOrders.length > 0 ? (
              <div className="divide-y divide-slate-100 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                    <tr>
                      <th className="px-6 py-3">Order Number</th>
                      <th className="px-6 py-3">Koorsada</th>
                      <th className="px-6 py-3">Lacagta</th>
                      <th className="px-6 py-3">Gateway / Method</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Taariikhda</th>
                      <th className="px-6 py-3 text-right">Rasiidka</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {userOrders.map(order => (
                      <tr key={order.id} className="hover:bg-slate-50/80">
                        <td className="px-6 py-4 font-mono font-bold text-slate-900">{order.order_number}</td>
                        <td className="px-6 py-4 font-medium max-w-xs truncate">{order.course_title}</td>
                        <td className="px-6 py-4 font-bold tabular-nums">${order.amount}</td>
                        <td className="px-6 py-4">
                          <span className="font-semibold uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {order.payment_method.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                            order.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {order.status === 'completed' ? 'Guuleystay' : order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => onViewReceipt(order)}
                            className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors"
                          >
                            Eeg Rasiidka
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">
                Weli ma jiraan wax dalab ah oo la diiwaangeliyay.
              </div>
            )}
          </div>
        )}

      </div>

      {/* PDF READER MODAL */}
      <PdfReaderModal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        resource={activePdfResource}
        course={activePdfCourse}
        isEnrolled={isPdfEnrolled}
        onUnlockCourse={() => {
          if (activePdfCourse && onEnrollCourse) {
            onEnrollCourse(activePdfCourse);
          }
        }}
      />

      {/* CERTIFICATE MODAL */}
      {certificateModalOpen && activeEnrollment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full text-center space-y-6 shadow-2xl border-4 border-amber-300 relative animate-fadeIn">
            {/* Header */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Official Certificate of Completion
              </span>
              <h2 className="text-3xl font-black text-slate-900 mt-2 font-serif">
                MC ACCADAMY
              </h2>
              <p className="text-xs text-slate-500">
                Goethe-Zertifikat Curriculum Language Proficiency
              </p>
            </div>

            {/* Certificate Body */}
            <div className="space-y-4 py-4 border-y border-amber-200/60 max-w-xl mx-auto">
              <p className="text-xs text-slate-600">Waxaa si sharaf leh loogu guddoonsiiyay:</p>
              <h3 className="text-2xl font-black text-emerald-900 uppercase tracking-wide">
                {currentUser.full_name}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ka dib markii uu/ay si buuxda oo heer sare ah u dhameeyay/dhameysay dhammaan casharrada, laylisyada, iyo imtixaanka koorsada:
              </p>
              <h4 className="text-base font-bold text-slate-900">
                {activeEnrollment.course?.title}
              </h4>
            </div>

            {/* Signatures & Seal */}
            <div className="flex items-center justify-between max-w-md mx-auto pt-2 text-xs">
              <div className="text-center">
                <p className="font-serif italic font-bold text-slate-800 text-sm">Ustadh Mohamed Omar</p>
                <div className="w-24 h-0.5 bg-slate-300 mx-auto my-1" />
                <p className="text-[10px] text-slate-500">Lead German Instructor</p>
              </div>

              <div className="w-14 h-14 rounded-full border-2 border-amber-400 bg-amber-50 flex items-center justify-center text-amber-700 font-black text-xs shadow-inner">
                SEAL
              </div>

              <div className="text-center">
                <p className="font-mono font-bold text-slate-800 text-sm">
                  {activeEnrollment.certificate_id || 'CERT-MC-98421'}
                </p>
                <div className="w-24 h-0.5 bg-slate-300 mx-auto my-1" />
                <p className="text-[10px] text-slate-500">Verification ID</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Daabaco / Degso PDF (Print)</span>
              </button>
              <button
                onClick={() => setCertificateModalOpen(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
              >
                Xir (Close)
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
