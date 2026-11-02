import React from 'react';
import { Course } from '../types/index.ts';
import { Star, Clock, BookOpen, Award, ArrowRight, Check } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  isEnrolled: boolean;
  onSelect: (course: Course) => void;
  onEnroll: (course: Course) => void;
  onContinueLearning?: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isEnrolled,
  onSelect,
  onEnroll,
  onContinueLearning
}) => {
  const levelColors: Record<string, { bg: string; text: string; border: string }> = {
    A1: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
    A2: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
    B1: { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200' },
    B2: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
    'Medical / Healthcare': { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200' },
    'Goethe Exam Prep': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  };

  const currentLevel = levelColors[course.level] || levelColors.A1;
  const price = course.discount_price ?? course.price;
  const originalPrice = course.discount_price ? course.price : null;
  const sosPrice = Math.round(price * 650).toLocaleString(); // Approximate Somali Shilling rate for reference

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-600/50 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Thumbnail Header with Editorial Badge */}
      <div className="relative aspect-16/10 bg-slate-900 overflow-hidden cursor-pointer" onClick={() => onSelect(course)}>
        <img
          src={course.thumbnail_url || '/assets/aistudio/05F8C6A4-5FFB-4D4A-B2E5-11DF7B585E48_8e6b0422.jpeg'}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
          referrerPolicy="no-referrer"
        />

        {/* Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

        {/* CEFR Level Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${currentLevel.bg} ${currentLevel.text} ${currentLevel.border} shadow-xs`}>
            {course.level}
          </span>
        </div>

        {/* Badge Label (e.g., Best Seller / Ausbildung) */}
        {course.badge_label && (
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-400 text-slate-900 shadow-xs">
              {course.badge_label}
            </span>
          </div>
        )}

        {/* Duration & Lessons Overlay */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-white text-xs font-medium">
          <span className="flex items-center gap-1 bg-black/50 backdrop-blur-xs px-2 py-1 rounded">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>{course.total_hours} Saacadood</span>
          </span>
          <span className="flex items-center gap-1 bg-black/50 backdrop-blur-xs px-2 py-1 rounded">
            <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
            <span>{course.total_lessons} Cashar</span>
          </span>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed clean metadata (Zero-Pill discipline) */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span className="font-medium text-emerald-800">Af-Jarmal ilaa Soomaali</span>
            <span aria-hidden="true">·</span>
            <span>Goethe-Institut Certified</span>
          </div>

          {/* Titles */}
          <h3 
            onClick={() => onSelect(course)}
            className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-1 cursor-pointer"
          >
            {course.title}
          </h3>

          <p className="text-xs font-semibold text-emerald-700 mt-0.5 line-clamp-1">
            {course.title_somali}
          </p>

          <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
            {course.short_description_somali}
          </p>

          {/* Instructor & Rating */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px] font-bold">
                {course.instructor?.name.charAt(0) || 'M'}
              </div>
              <span className="text-xs font-medium text-slate-700 truncate max-w-[140px]">
                {course.instructor?.name || 'Ustadh Mohamed Omar'}
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>4.95</span>
            </div>
          </div>
        </div>

        {/* Pricing & Action */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-slate-900 tabular-nums">
                ${price}
              </span>
              {originalPrice && (
                <span className="text-xs text-slate-400 line-through tabular-nums">
                  ${originalPrice}
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 font-medium tabular-nums">
              ~ {sosPrice} SOS (Sifalo Pay)
            </p>
          </div>

          <div>
            {isEnrolled ? (
              <button
                onClick={() => onContinueLearning?.(course)}
                className="px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Fur Casharka</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onSelect(course)}
                  className="px-2.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Faahfaahin
                </button>
                <button
                  onClick={() => onEnroll(course)}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-[#0a2f24] hover:bg-[#0d3b2e] active:scale-98 rounded-lg transition-all shadow-xs flex items-center gap-1"
                >
                  <span>Ku Biir</span>
                  <ArrowRight className="w-3 h-3 text-amber-400" />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
