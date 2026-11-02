import React, { useState } from 'react';
import { Course, Lesson } from '../types/index.ts';
import { 
  X, Check, Play, Clock, BookOpen, Award, FileText, 
  ChevronDown, ChevronUp, Lock, ArrowRight, ShieldCheck, Download
} from 'lucide-react';

interface CourseDetailsModalProps {
  course: Course | null;
  onClose: () => void;
  onEnroll: (course: Course) => void;
  isEnrolled: boolean;
  onStartLearning: (course: Course) => void;
}

export const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({
  course,
  onClose,
  onEnroll,
  isEnrolled,
  onStartLearning
}) => {
  if (!course) return null;

  const [activeLessonPreview, setActiveLessonPreview] = useState<Lesson | null>(
    course.lessons?.find(l => l.is_preview) || course.lessons?.[0] || null
  );
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    'Module 1: Hordhac & Alifbeetada Jarmalka (Das Alphabet & Aussprache)': true,
    'Module 1: Wakhtiga Tagay (Das Perfekt)': true,
    'Module 1: Ausbildung & German Job Readiness': true,
    'Module 1: Clinical Shift Handover (Die Übergabe)': true
  });

  const toggleModule = (modTitle: string) => {
    setExpandedModules(prev => ({ ...prev, [modTitle]: !prev[modTitle] }));
  };

  // Group lessons by module
  const modulesMap = (course.lessons || []).reduce((acc, lesson) => {
    const mod = lesson.module_title || 'Module 1: Hordhaca Koorsada';
    if (!acc[mod]) acc[mod] = [];
    acc[mod].push(lesson);
    return acc;
  }, {} as Record<string, Lesson[]>);

  const price = course.discount_price ?? course.price;
  const originalPrice = course.discount_price ? course.price : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span>MC ACCADAMY · {course.level} Specialization</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-8 flex-1">
          
          {/* Hero Banner / Course Header */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {course.level} CEFR
              </span>
              <span className="px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 text-slate-700">
                Luuqadda: Jarmal / Soomaali
              </span>
              {course.badge_label && (
                <span className="px-2.5 py-1 rounded text-xs font-bold bg-amber-300 text-slate-900">
                  {course.badge_label}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {course.title}
            </h1>
            <p className="text-base font-semibold text-emerald-800">
              {course.title_somali}
            </p>

            <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
              {course.description_somali}
            </p>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-medium text-slate-600 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>{course.total_hours} Saacadood oo Casharro ah</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>{course.total_lessons} Cashar oo dhammaystiran</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Shahaado rasmi ah markaad dhameyso</span>
              </div>
            </div>
          </div>

          {/* Video Preview Player (Free Lesson Demo) */}
          {activeLessonPreview && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-md">
              <div className="p-3 bg-slate-950 text-white flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px]">
                    FREE PREVIEW
                  </span>
                  <span className="font-semibold truncate max-w-md">
                    {activeLessonPreview.title_somali}
                  </span>
                </div>
                <span className="text-slate-400 font-mono text-[11px]">{activeLessonPreview.duration}</span>
              </div>

              <div className="aspect-video bg-black flex items-center justify-center">
                <video
                  controls
                  className="w-full h-full"
                  src={activeLessonPreview.video_url || 'https://www.w3schools.com/html/mov_bbb.mp4'}
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              {activeLessonPreview.notes_somali && (
                <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-700">
                  <p className="font-bold text-slate-900 mb-1">Xogta Casharka (Lesson Highlights):</p>
                  <p>{activeLessonPreview.notes_somali}</p>
                </div>
              )}
            </div>
          )}

          {/* Learning Outcomes */}
          <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-100">
            <h3 className="text-sm font-extrabold text-emerald-950 mb-3 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-700" />
              <span>Maxaad Ku Baran Doontaa Koorsadan? (What You'll Learn)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-emerald-900">
              {course.learning_outcomes.map((outcome, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                    ✓
                  </div>
                  <span>{outcome}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Syllabus / Curriculum Modules */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Manhajka & Casharrada Koorsada (Curriculum)
              </h3>
              <span className="text-xs text-slate-500">
                {course.lessons?.length || 0} Cashar oo diyaar ah
              </span>
            </div>

            <div className="space-y-3">
              {Object.keys(modulesMap).length > 0 ? (
                Object.entries(modulesMap).map(([modTitle, lessons], idx) => {
                  const isExpanded = expandedModules[modTitle] ?? true;
                  return (
                    <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                      <button
                        onClick={() => toggleModule(modTitle)}
                        className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left transition-colors"
                      >
                        <span className="text-xs sm:text-sm font-bold text-slate-800">
                          {modTitle}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>{lessons.length} Cashar</span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="divide-y divide-slate-100 px-4">
                          {lessons.map(lesson => (
                            <div key={lesson.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-2.5 min-w-0">
                                {lesson.is_preview ? (
                                  <button
                                    onClick={() => setActiveLessonPreview(lesson)}
                                    className="p-1 rounded-full bg-emerald-100 text-emerald-800 hover:bg-emerald-200 shrink-0"
                                    title="Daawo Casharkan Tusaalaha ah"
                                  >
                                    <Play className="w-3 h-3 fill-current" />
                                  </button>
                                ) : (
                                  <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                )}
                                <div className="truncate">
                                  <span className="font-semibold text-slate-800">
                                    {lesson.title_somali}
                                  </span>
                                  <span className="text-slate-400 ml-1.5 text-[11px] hidden sm:inline">
                                    ({lesson.title})
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                {lesson.is_preview && (
                                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                    Bilaash (Free)
                                  </span>
                                )}
                                <span className="text-slate-400 font-mono text-[11px]">
                                  {lesson.duration}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-500 text-center">
                  Casharrada koorsadan waxaa lagu bixinayaa hab toos ah (interactive).
                </div>
              )}
            </div>
          </div>

          {/* Instructor Bio */}
          {course.instructor && (
            <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <img
                src={course.instructor.avatar_url || '/assets/aistudio/05F8C6A4-5FFB-4D4A-B2E5-11DF7B585E48_8e6b0422.jpeg'}
                alt={course.instructor.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-emerald-600 shrink-0"
              />
              <div className="space-y-1 text-center sm:text-left">
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Macallinka Koorsada (Instructor)</p>
                <h4 className="text-base font-extrabold text-slate-900">{course.instructor.name}</h4>
                <p className="text-xs text-slate-600 font-medium">{course.instructor.title}</p>
                <p className="text-xs text-slate-500 leading-relaxed pt-1">{course.instructor.bio_somali}</p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Sticky Footer Action Bar */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 shadow-lg">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 tabular-nums">${price}</span>
              {originalPrice && (
                <span className="text-sm text-slate-400 line-through tabular-nums">${originalPrice}</span>
              )}
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Helitaan Joogto ah (Lifetime Access)
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Waxaa la aqbalaa EVC Plus, ZAAD, Sahal, eDahab & Visa/Mastercard
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {isEnrolled ? (
              <button
                onClick={() => { onClose(); onStartLearning(course); }}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Fur Casharrada (Continue Learning)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => { onClose(); onEnroll(course); }}
                className="w-full sm:w-auto px-7 py-3 bg-[#0a2f24] hover:bg-[#0d3b2e] active:scale-98 text-white font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Ku Biir Koorsada (Enroll Now)</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
