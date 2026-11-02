import React, { useState } from 'react';
import { UserProfile } from '../types/index.ts';
import { BookOpen, User, Shield, LogOut, CheckCircle2, Menu, X, Sparkles, Database } from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'courses' | 'dashboard' | 'admin' | 'db-schema';
  setCurrentView: (view: 'home' | 'courses' | 'dashboard' | 'admin' | 'db-schema') => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onSwitchUser: (role: 'student' | 'admin') => void;
  enrolledCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  currentUser,
  onOpenAuth,
  onLogout,
  onSwitchUser,
  enrolledCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Strict Top Bar Contract: 3 zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); }}
            className="group flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-lg"
          >
            <div className="w-9 h-9 rounded-lg bg-[#0a2f24] flex items-center justify-center text-white shadow-xs group-hover:bg-[#0d3b2e] transition-colors">
              <span className="font-bold text-base tracking-tighter text-amber-400">MC</span>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-800 transition-colors whitespace-nowrap">
                MC ACCADAMY
              </span>
              <span className="block text-[10px] font-medium text-emerald-700 tracking-wider uppercase -mt-1">
                German to Somali A1–B2
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4-5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
          <button
            onClick={() => setCurrentView('home')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentView === 'home' ? 'text-emerald-700 border-b-2 border-emerald-700' : 'hover:text-slate-900'
            }`}
          >
            Bogga Hore
          </button>

          <button
            onClick={() => setCurrentView('courses')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentView === 'courses' ? 'text-emerald-700 border-b-2 border-emerald-700' : 'hover:text-slate-900'
            }`}
          >
            Koorsooyinka A1–B2
          </button>

          <button
            onClick={() => setCurrentView('dashboard')}
            className={`relative whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              currentView === 'dashboard' ? 'text-emerald-700 border-b-2 border-emerald-700' : 'hover:text-slate-900'
            }`}
          >
            <span>Koorsooyinkayga</span>
            {enrolledCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[11px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                {enrolledCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentView('admin')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              currentView === 'admin' ? 'text-emerald-700 border-b-2 border-emerald-700' : 'hover:text-slate-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-slate-500" />
            <span>Maamulka (Admin)</span>
          </button>

          <button
            onClick={() => setCurrentView('db-schema')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 text-xs text-slate-500 ${
              currentView === 'db-schema' ? 'text-emerald-700 font-bold' : 'hover:text-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>Supabase SQL</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-2.5 rounded-full border border-slate-200 hover:border-slate-300 bg-slate-50 transition-all text-xs font-medium text-slate-800"
              >
                <span className="hidden sm:inline-block max-w-[120px] truncate">
                  {currentUser.full_name}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold uppercase">
                  {currentUser.role}
                </span>
                <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                  {currentUser.full_name.charAt(0)}
                </div>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-900">{currentUser.full_name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    <p className="text-[11px] text-emerald-600 font-medium mt-0.5">{currentUser.phone}</p>
                  </div>

                  <div className="px-2 py-1.5 border-b border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">Beddel Qofka (Switch Persona)</p>
                    <button
                      onClick={() => { onSwitchUser('student'); setUserDropdownOpen(false); setCurrentView('dashboard'); }}
                      className="w-full text-left px-2 py-1.5 text-xs rounded-lg hover:bg-slate-100 flex items-center justify-between text-slate-700"
                    >
                      <span className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Arday (Yahye Hassan)</span>
                      </span>
                      {currentUser.role === 'student' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                    <button
                      onClick={() => { onSwitchUser('admin'); setUserDropdownOpen(false); setCurrentView('admin'); }}
                      className="w-full text-left px-2 py-1.5 text-xs rounded-lg hover:bg-slate-100 flex items-center justify-between text-slate-700"
                    >
                      <span className="flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5 text-purple-600" />
                        <span>Admin (Ustadh Mohamed)</span>
                      </span>
                      {currentUser.role === 'admin' && <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />}
                    </button>
                  </div>

                  <div className="pt-1 px-1">
                    <button
                      onClick={() => { onLogout(); setUserDropdownOpen(false); }}
                      className="w-full text-left px-3 py-1.5 text-xs rounded-lg hover:bg-red-50 text-red-600 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Ka Bax (Log Out)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0a2f24] hover:bg-[#0d3b2e] active:scale-98 rounded-lg transition-all shadow-xs whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>Gal / Is-diiwaangeli</span>
            </button>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <button
            onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg ${
              currentView === 'home' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700'
            }`}
          >
            Bogga Hore
          </button>
          <button
            onClick={() => { setCurrentView('courses'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg ${
              currentView === 'courses' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700'
            }`}
          >
            Koorsooyinka A1–B2
          </button>
          <button
            onClick={() => { setCurrentView('dashboard'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg flex items-center justify-between ${
              currentView === 'dashboard' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700'
            }`}
          >
            <span>Koorsooyinkayga</span>
            {enrolledCount > 0 && (
              <span className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-800 rounded-full font-bold">
                {enrolledCount}
              </span>
            )}
          </button>
          <button
            onClick={() => { setCurrentView('admin'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg ${
              currentView === 'admin' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700'
            }`}
          >
            Maamulka (Admin Dashboard)
          </button>
          <button
            onClick={() => { setCurrentView('db-schema'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg ${
              currentView === 'db-schema' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700'
            }`}
          >
            Supabase SQL Schema
          </button>
        </div>
      )}
    </header>
  );
};
