import React, { useState } from 'react';
import { 
  X, Play, Pause, Volume2, CheckCircle2, ChevronRight, ChevronLeft, 
  FileText, Download, Award, BookOpen, MessageSquare, HelpCircle, 
  Sparkles, Check, ArrowRight, RotateCcw 
} from 'lucide-react';
import { Course, Lesson, Enrollment, VocabularyItem } from '../types';

interface CoursePlayerProps {
  course: Course;
  enrollment?: Enrollment;
  onClose: () => void;
  onUpdateProgress: (lessonId: string, completed: boolean) => Promise<void>;
  initialLessonId?: string;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({
  course,
  enrollment,
  onClose,
  onUpdateProgress,
  initialLessonId
}) => {
  const lessons = course.lessons || [];
  const defaultLesson = lessons.find(l => l.id === initialLessonId) || lessons[0];
  
  const [currentLesson, setCurrentLesson] = useState<Lesson>(defaultLesson);
  const [activeTab, setActiveTab] = useState<'notes' | 'vocab' | 'resources' | 'qa'>('notes');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [revealedVocab, setRevealedVocab] = useState<Record<number, boolean>>({});
  const [isUpdating, setIsUpdating] = useState(false);

  const completedList = enrollment?.completed_lessons || [];
  const isCurrentLessonCompleted = completedList.includes(currentLesson.id);

  // Next / Previous lesson
  const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < lessons.length - 1;

  const handleToggleCompleted = async () => {
    setIsUpdating(true);
    try {
      await onUpdateProgress(currentLesson.id, !isCurrentLessonCompleted);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCompleteAndNext = async () => {
    setIsUpdating(true);
    try {
      if (!isCurrentLessonCompleted) {
        await onUpdateProgress(currentLesson.id, true);
      }
      if (hasNext) {
        setCurrentLesson(lessons[currentIndex + 1]);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleVocab = (index: number) => {
    setRevealedVocab(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col overflow-hidden animate-fadeIn">
      
      {/* Top Bar */}
      <div className="h-14 px-4 sm:px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
              {course.title_somali}
            </h2>
            <p className="text-[11px] text-emerald-400 line-clamp-1">
              {currentLesson.module_title} · Casharka {currentIndex + 1} ee {lessons.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress meter */}
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="text-slate-400">Horumarka:</span>
            <span className="font-bold text-emerald-400 tabular-nums">
              {enrollment?.progress_percentage || 0}%
            </span>
            <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${enrollment?.progress_percentage || 0}%` }}
              />
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Workspace (Split: Video + Sidebar) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Column: Video Player & Lesson Content */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          
          {/* Responsive Video Container */}
          <div className="relative aspect-video w-full bg-black shrink-0 max-h-[55vh]">
            <video
              key={currentLesson.id}
              src={currentLesson.video_url}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          </div>

          {/* Player controls & action bar */}
          <div className="p-4 sm:p-6 bg-slate-900/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                {currentLesson.title}
              </span>
              <h1 className="text-lg sm:text-xl font-extrabold text-white">
                {currentLesson.title_somali}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleCompleted}
                disabled={isUpdating}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isCurrentLessonCompleted
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 ${isCurrentLessonCompleted ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{isCurrentLessonCompleted ? 'Waa Dhamaystiray' : 'Calaamadee inuu Dhamaaday'}</span>
              </button>

              {hasNext && (
                <button
                  onClick={handleCompleteAndNext}
                  disabled={isUpdating}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow"
                >
                  <span>Casharka Xiga</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Lesson tabs navigation */}
          <div className="flex items-center gap-1 px-6 border-b border-slate-800 bg-slate-900/40 text-xs">
            <button
              onClick={() => setActiveTab('notes')}
              className={`py-3 px-4 font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'notes'
                  ? 'border-emerald-400 text-white'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Qoraalka & Naxwaha (Notes)</span>
            </button>

            <button
              onClick={() => setActiveTab('vocab')}
              className={`py-3 px-4 font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'vocab'
                  ? 'border-emerald-400 text-white'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Erayada & Layliga (Flashcards)</span>
            </button>

            <button
              onClick={() => setActiveTab('resources')}
              className={`py-3 px-4 font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'resources'
                  ? 'border-emerald-400 text-white'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Agabka & Waraaqaha (PDFs)</span>
            </button>

            <button
              onClick={() => setActiveTab('qa')}
              className={`py-3 px-4 font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'qa'
                  ? 'border-emerald-400 text-white'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Su'aalo & Jawaabo (Q&A)</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 space-y-6 text-sm flex-1">
            
            {/* TAB 1: Notes & Grammar */}
            {activeTab === 'notes' && (
              <div className="space-y-6 max-w-3xl">
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <h3 className="font-bold text-emerald-400 text-sm flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Sharaxaadda Af-Soomaaliga:</span>
                  </h3>
                  <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                    {currentLesson.notes_somali || 'Casharkaan wuxuu ku barayaa xeerarka naxwaha iyo dhismaha jumladaha Jarmalka.'}
                  </p>
                </div>

                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <h3 className="font-bold text-amber-400 text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Deutsche Grammatikregeln:</span>
                  </h3>
                  <p className="text-slate-300 leading-relaxed text-xs sm:text-sm font-mono">
                    {currentLesson.notes_german || 'Wichtige Grammatikregeln und typische Beispielsätze.'}
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: Vocabulary & Interactive Flashcards */}
            {activeTab === 'vocab' && (
              <div className="space-y-4 max-w-3xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">
                    Erayada Furaha ah ee Casharkan ({currentLesson.vocabulary?.length || 4} Eray)
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Guji kaarka si aad u aragto macnaha Soomaaliga
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(currentLesson.vocabulary || [
                    { german: 'Guten Morgen', somali: 'Subax wanaagsan', example_german: 'Guten Morgen, wie geht es Ihnen?', example_somali: 'Subax wanaagsan, sidee tahay?' },
                    { german: 'Ich heiße...', somali: 'Waxaa la i yiraahdaa...', example_german: 'Ich heiße Mohamed.', example_somali: 'Magacaygu waa Maxamed.' },
                    { german: 'Vielen Dank', somali: 'Aad baad u mahadsan tahay', example_german: 'Vielen Dank für Ihre Hilfe.', example_somali: 'Aad baad ugu mahadsan tahay caawintaada.' },
                    { german: 'Tschüss', somali: 'Nabadgelyo (Dadka aad is taqaanaan)', example_german: 'Tschüss, bis bald!', example_somali: 'Nabadgelyo, kulanti dhow!' },
                  ]).map((item: VocabularyItem, idx: number) => {
                    const isFlipped = revealedVocab[idx];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleVocab(idx)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer text-left space-y-2 ${
                          isFlipped
                            ? 'bg-emerald-950/40 border-emerald-500/40'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-400 font-mono">GERMAN</span>
                          <span className="text-[10px] text-slate-500">{isFlipped ? 'Somali muuqata' : 'Guji si aad u furto'}</span>
                        </div>
                        <p className="text-base font-extrabold text-white">{item.german}</p>
                        <p className="text-xs text-slate-400 italic">"{item.example_german}"</p>

                        {isFlipped ? (
                          <div className="pt-2 border-t border-emerald-900/60 space-y-1 animate-fadeIn">
                            <span className="text-[10px] font-bold text-emerald-400 uppercase">AF-SOOMAALI</span>
                            <p className="text-sm font-bold text-emerald-300">{item.somali}</p>
                            <p className="text-xs text-slate-300">{item.example_somali}</p>
                          </div>
                        ) : (
                          <div className="pt-2 border-t border-slate-800">
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <span>Fiiri macnaha...</span>
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: Downloadable Resources */}
            {activeTab === 'resources' && (
              <div className="space-y-4 max-w-2xl">
                <h3 className="text-sm font-bold text-white">Waraaqaha & Casharrada PDF-ka ah</h3>
                <div className="space-y-2.5">
                  <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-950 text-red-400 flex items-center justify-center font-bold text-xs">
                        PDF
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Shaxda Naxwaha & Ficillada {course.level}</h4>
                        <p className="text-[11px] text-slate-400">1.8 MB · German-Somali Cheat Sheet</p>
                      </div>
                    </div>
                    <button
                      onClick={() => alert('Waraaqda PDF-ka ah ee shaxda naxwaha waa la soo dejinayaa.')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>

                  <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-xs">
                        AUDIO
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Dhawaaqa & Dhagaysiga Goethe Modellsatz</h4>
                        <p className="text-[11px] text-slate-400">8.4 MB · MP3 Listening Practice</p>
                      </div>
                    </div>
                    <button
                      onClick={() => alert('Faylka MP3-ga ee dhagaysiga waa la soo dejinayaa.')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Q&A Discussion */}
            {activeTab === 'qa' && (
              <div className="space-y-4 max-w-2xl">
                <h3 className="text-sm font-bold text-white">Waydii Macallinka Su'aalahaaga</h3>
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <textarea
                    rows={3}
                    placeholder="Halkan ku qor su'aashaada ku saabsan casharkan..."
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => alert('Su\'aashaadii si toos ah ayaa loogu diray Ustadh Mohamed.')}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg"
                    >
                      Dir Su'aasha
                    </button>
                  </div>
                </div>

                {/* Sample answered Q&A */}
                <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Cali Warsame</span>
                    <span className="text-[10px] text-slate-500">2 maalmood ka hor</span>
                  </div>
                  <p className="text-slate-300">
                    Sideen ku kala saari karaa "den" iyo "dem" markaan jumlad dhisayo?
                  </p>
                  <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-800/40 space-y-1">
                    <p className="font-bold text-emerald-400">Jawaabta Ustadh Mohamed:</p>
                    <p className="text-slate-300 text-[11px]">
                      "Den" waxaa la isticmaalaa Akkusativ (ficilku si toos ah ugu dhaco magac lab ah). "Dem" waxaa la isticmaalaa Dativ (e.g. mit dem Bus, bei dem Arzt).
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Right Column: Curriculum Drawer / Lessons List */}
        <div className="w-full lg:w-80 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Casharrada Koorsada ({lessons.length})
            </h3>
            <span className="text-[11px] text-emerald-400 font-bold">
              {completedList.length}/{lessons.length} Dhammaystiran
            </span>
          </div>

          <div className="overflow-y-auto divide-y divide-slate-800 flex-1">
            {lessons.map((lesson, idx) => {
              const isSelected = lesson.id === currentLesson.id;
              const isDone = completedList.includes(lesson.id);

              return (
                <button
                  key={lesson.id}
                  onClick={() => setCurrentLesson(lesson)}
                  className={`w-full p-3.5 text-left transition-colors flex items-start gap-3 ${
                    isSelected
                      ? 'bg-emerald-950/40 border-l-4 border-emerald-400'
                      : 'hover:bg-slate-800/60'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isDone ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-400 flex items-center justify-center">
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold line-clamp-1 ${isSelected ? 'text-emerald-300' : 'text-slate-200'}`}>
                      {lesson.title_somali}
                    </p>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                      {lesson.title}
                    </p>
                    <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                      {lesson.duration}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
