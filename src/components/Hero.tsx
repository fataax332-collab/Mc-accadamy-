import React, { useState } from 'react';
import { Play, CheckCircle, Star, Users, Award, Clock, ArrowRight, X } from 'lucide-react';

interface HeroProps {
  onExploreCourses: () => void;
  onPreviewLesson: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreCourses, onPreviewLesson }) => {
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-[#07241b] text-white">
      {/* Background subtle radial texture */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-16 lg:pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Text Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Editorial Kicker */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>MC ACCADAMY · Xarunta Koowaad ee Af-Jarmalka</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-balance text-white">
              Unlock your potential with our expert-led German courses
            </h1>

            {/* Somali Subheading */}
            <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal max-w-2xl">
              Baro Af-Jarmalka laga bilaabo heerka bilowga <span className="text-amber-300 font-semibold">A1 ilaa B2</span> adigoo ku baranaya afkaaga hooyo ee Soomaaliga. U diyaargarow shahaadada rasmiga ah ee <span className="text-white font-medium">Goethe-Zertifikat</span>, fursadaha shaqo, iyo barnaamijyada <span className="text-white font-medium">Ausbildung</span> ee dalka Jarmalka.
            </p>

            {/* Trust bullet features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-emerald-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Macallimiin heysta shahaadada Goethe C2</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Lacag-bixinta Sifalo Pay (EVC, ZAAD, Sahal)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Daawo casharrada wakhti kasta (Offline/Online)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Shahaado rasmi ah markaad dhameyso</span>
              </div>
            </div>

            {/* CTAs matching screenshot */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreCourses}
                className="px-6 py-3.5 text-sm font-bold text-slate-900 bg-white hover:bg-slate-100 active:scale-98 rounded-lg shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <span>Ready to get started?</span>
                <ArrowRight className="w-4 h-4 text-emerald-800" />
              </button>

              <button
                onClick={() => setVideoModalOpen(true)}
                className="px-5 py-3.5 text-sm font-semibold text-white hover:text-emerald-200 bg-emerald-900/60 hover:bg-emerald-900/90 border border-emerald-700/50 rounded-lg transition-all flex items-center gap-3 whitespace-nowrap"
              >
                <div className="w-7 h-7 rounded-full bg-white text-slate-900 flex items-center justify-center pl-0.5">
                  <Play className="w-3.5 h-3.5 fill-current" />
                </div>
                <span>Watch Video (Daawo Tusaale)</span>
              </button>
            </div>
          </div>

          {/* Right Visual Collage (5 cols) matching screenshot layout */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Badge: Lifetime access */}
              <div className="absolute -top-4 right-6 sm:right-12 z-20 bg-amber-200 text-slate-900 px-4 py-2 rounded-md shadow-lg border border-amber-300 flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-slate-900 flex items-center justify-center">
                  <Clock className="w-2.5 h-2.5 text-amber-200" />
                </div>
                <span className="text-xs font-bold tracking-tight">Lifetime access</span>
              </div>

              {/* Editorial Frame with attached image */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-600/40 shadow-2xl bg-slate-900">
                <img
                  src="/assets/aistudio/05F8C6A4-5FFB-4D4A-B2E5-11DF7B585E48_8e6b0422.jpeg"
                  alt="MC ACCADAMY Somali student learning German"
                  className="w-full h-80 sm:h-96 object-cover object-center transform hover:scale-102 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Scrim overlay for crisp readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#07241b] via-transparent to-transparent opacity-70" />

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="p-3 bg-white/95 backdrop-blur-md rounded-xl text-slate-900 shadow-lg flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">Goethe-Zertifikat A1–B2</p>
                      <p className="text-[11px] text-emerald-800 font-medium">98% Pass Rate for Embassy Visas</p>
                    </div>
                    <div className="px-2 py-1 bg-emerald-100 text-emerald-900 text-[11px] font-bold rounded">
                      Goethe Prep
                    </div>
                  </div>
                </div>
              </div>

              {/* White Stat card matching screenshot */}
              <div className="mt-4 sm:absolute sm:-bottom-6 sm:-left-6 z-20 bg-white text-slate-900 p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Over 2,500+</p>
                  <p className="text-sm font-extrabold text-slate-900">Arday Soomaaliyeed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dark Lower Stats Row matching screenshot */}
      <div className="border-t border-emerald-900/60 bg-[#051a13] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center sm:text-left divide-y sm:divide-y-0 sm:divide-x divide-emerald-900/40">
            
            <div className="pt-2 sm:pt-0 sm:pr-4">
              <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-400 mb-1">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <span className="text-white text-xs font-bold ml-1">4.95</span>
              </div>
              <p className="text-[11px] text-emerald-300 font-medium">4.4k Review Ratings</p>
            </div>

            <div className="pt-2 sm:pt-0 sm:px-4">
              <p className="text-xl sm:text-2xl font-black text-white tabular-nums">200 +</p>
              <p className="text-[11px] text-emerald-300">Casharro Muuqaal Ah (Video Lessons)</p>
            </div>

            <div className="pt-2 sm:pt-0 sm:px-4">
              <p className="text-xl sm:text-2xl font-black text-white tabular-nums">24/7</p>
              <p className="text-[11px] text-emerald-300">Study Anywhere (Gurigaaga)</p>
            </div>

            <div className="pt-2 sm:pt-0 sm:px-4">
              <p className="text-xl sm:text-2xl font-black text-white tabular-nums">3,500+</p>
              <p className="text-[11px] text-emerald-300">Arday Diyaarsan (Graduated)</p>
            </div>

            <div className="pt-2 sm:pt-0 sm:pl-4 col-span-2 sm:col-span-1">
              <p className="text-xl sm:text-2xl font-black text-amber-400 tabular-nums">100%</p>
              <p className="text-[11px] text-emerald-300">Damaanad-qaadka Fahamka</p>
            </div>

          </div>
        </div>
      </div>

      {/* Free Video Preview Modal */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className="text-sm font-bold text-white">
                  Cashar Tusaale ah: Alifbeetada & Dhawaaqa Jarmalka (A1 Sample)
                </h3>
              </div>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video bg-black flex items-center justify-center relative">
              <video
                controls
                autoPlay
                className="w-full h-full"
                src="https://www.w3schools.com/html/mov_bbb.mp4"
              >
                Your browser does not support video playback.
              </video>
            </div>

            <div className="p-4 bg-slate-950 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
              <div>
                <p className="font-semibold text-white">Baro Af-Jarmalka si fudud oo xirfad leh</p>
                <p className="text-slate-400">Ustadh Mohamed Omar · MC ACCADAMY Berlin</p>
              </div>
              <button
                onClick={() => { setVideoModalOpen(false); onExploreCourses(); }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors"
              >
                Is-diiwaangeli Hadda
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
