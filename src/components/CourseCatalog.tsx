import React, { useState } from 'react';
import { Course, CourseLevel } from '../types/index.ts';
import { CourseCard } from './CourseCard.tsx';
import { Search, Filter, Sparkles, BookOpen, GraduationCap, CheckCircle2 } from 'lucide-react';

interface CourseCatalogProps {
  courses: Course[];
  enrolledCourseIds: string[];
  onSelectCourse: (course: Course) => void;
  onEnrollCourse: (course: Course) => void;
  onContinueLearning: (course: Course) => void;
}

export const CourseCatalog: React.FC<CourseCatalogProps> = ({
  courses,
  enrolledCourseIds,
  onSelectCourse,
  onEnrollCourse,
  onContinueLearning
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  const levels = [
    { id: 'all', label: 'Dhammaan Koorsooyinka (All)' },
    { id: 'A1', label: 'A1 Bilow (Beginner)' },
    { id: 'A2', label: 'A2 Heerka Dhexe (Elementary)' },
    { id: 'B1', label: 'B1 Madax-bannaan & Ausbildung' },
    { id: 'B2', label: 'B2 Xirfad Sare (Advanced)' },
    { id: 'Medical / Healthcare', label: 'Dhakhaatiirta & Kalkaaliyeyaasha (Pflege)' },
    { id: 'Goethe Exam Prep', label: 'Goethe Exam Prep' },
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.title_somali.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description_somali.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;

    return matchesSearch && matchesLevel;
  });

  return (
    <section className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span>Suuqa Koorsooyinka Jarmalka</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Koorsooyinka Af-Jarmalka (A1 ilaa B2)
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Dooro heerka aad joogto ama waxaad u baahan tahay. Koorso kasta waxaa ku jira sharraxaad Af-Soomaali ah, su\'aalo imtixaan, iyo shahaado rasmi ah.
            </p>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Wadarta: <span className="font-bold text-slate-900">{filteredCourses.length}</span> koorso ayaa la helay
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Raadi koorso (tusaale: A1, Naxwaha, Ausbildung, Kalkaaliye)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none transition-colors"
              />
            </div>

            {/* Quick Reset */}
            {(searchQuery || selectedLevel !== 'all') && (
              <button
                onClick={() => { setSearchQuery(''); setSelectedLevel('all'); }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap"
              >
                Nadiifi shaandhada (Reset)
              </button>
            )}
          </div>

          {/* Interactive Filter Tabs (Zero-Pill discipline: Segmented controls with active states) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {levels.map(level => {
              const active = selectedLevel === level.id;
              return (
                <button
                  key={level.id}
                  onClick={() => setSelectedLevel(level.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-all ${
                    active
                      ? 'bg-[#0a2f24] text-white shadow-xs font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {level.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                isEnrolled={enrolledCourseIds.includes(course.id)}
                onSelect={onSelectCourse}
                onEnroll={onEnrollCourse}
                onContinueLearning={onContinueLearning}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 p-8">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">Koorso lama helin</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Wax koorso ah oo waafaqsan raadintaada ma jiro. Fadlan hubi higgaadda ama dib u deji shaandhada.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedLevel('all'); }}
              className="mt-4 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors"
            >
              Muuji dhammaan koorsooyinka
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
