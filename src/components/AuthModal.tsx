import React, { useState } from 'react';
import { UserProfile } from '../types/index.ts';
import { X, Mail, Lock, User, Phone, CheckCircle2, ArrowRight, Shield } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Demo Fast Switch Logins for instant evaluation
  const handleQuickStudentLogin = () => {
    const studentUser: UserProfile = {
      id: 'usr-student-1',
      email: 'yahye.hassan@example.com',
      full_name: 'Yahye Hassan Cali',
      phone: '+252615489201',
      role: 'student',
      learning_goal: 'Goethe-Zertifikat B1 & Ausbildung in Germany',
      country: 'Somalia',
      created_at: new Date().toISOString()
    };
    onLoginSuccess(studentUser);
    onClose();
  };

  const handleQuickAdminLogin = () => {
    const adminUser: UserProfile = {
      id: 'usr-admin-1',
      email: 'admin@mcaccadamy.com',
      full_name: 'Ustadh Mohamed Omar',
      phone: '+4917612345678',
      role: 'admin',
      learning_goal: 'German Studies Lead',
      country: 'Germany',
      created_at: new Date().toISOString()
    };
    onLoginSuccess(adminUser);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'forgot') {
      setForgotSent(true);
      return;
    }

    const user: UserProfile = {
      id: `usr-${Date.now()}`,
      email: email || 'student@mcaccadamy.com',
      full_name: fullName || 'Arday Cusub',
      phone: phone || '+252610000000',
      role: 'student',
      country: 'Somalia',
      created_at: new Date().toISOString()
    };
    onLoginSuccess(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-[#0a2f24] text-white flex items-center justify-center font-bold text-sm mx-auto shadow-xs">
            MC
          </div>
          <h2 className="text-lg font-extrabold text-slate-900">
            {mode === 'login' && 'Soo Gal Akoonkaaga'}
            {mode === 'register' && 'Sameyso Akoon Cusub'}
            {mode === 'forgot' && 'Soo Celi Furahaaga Sirta ah'}
          </h2>
          <p className="text-xs text-slate-500">
            {mode === 'login' && 'Ku baro Af-Jarmalka A1 ilaa B2 afkaaga hooyo'}
            {mode === 'register' && 'Ku biir kumanaan arday Soomaaliyeed ah'}
            {mode === 'forgot' && 'Geli email-kaaga si aan kuugu soo dirno xiriirka furaha'}
          </p>
        </div>

        {/* Demo Fast Switch Buttons */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
            Galitaan Degdeg ah (Quick Demo Logins)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickStudentLogin}
              className="py-2 px-3 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-xs font-semibold text-slate-800 transition-all flex items-center justify-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>Arday (Student)</span>
            </button>
            <button
              type="button"
              onClick={handleQuickAdminLogin}
              className="py-2 px-3 bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-xl text-xs font-semibold text-slate-800 transition-all flex items-center justify-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-purple-600" />
              <span>Admin (Ustadh)</span>
            </button>
          </div>
        </div>

        {/* Form */}
        {forgotSent ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900">Email-ka xaqiijinta waa la diray!</h3>
            <p className="text-xs text-slate-500">
              Fadlan fiiri sanduuqaaga fariimaha ({email}) si aad dib ugu dejiso furahaaga sirta ah.
            </p>
            <button
              type="button"
              onClick={() => { setForgotSent(false); setMode('login'); }}
              className="px-4 py-2 bg-emerald-700 text-white font-bold text-xs rounded-xl"
            >
              Ku noqo Bogga Galitaanka
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Magacaaga oo Buuxa</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Yahye Hassan Cali"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Taleefankaaga</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+252 61 548 9201"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email-kaaga</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">Furaha Sirta ah (Password)</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] text-emerald-700 hover:underline"
                    >
                      Ma ilowday furaha?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-mono"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-[#0a2f24] hover:bg-[#0d3b2e] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 mt-2"
            >
              <span>
                {mode === 'login' && 'Gal Hadda (Log In)'}
                {mode === 'register' && 'Sameyso Akoonka'}
                {mode === 'forgot' && 'Soo Dir Email-ka'}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </form>
        )}

        {/* Toggle Mode */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          {mode === 'login' ? (
            <p>
              Ma lihid akoon weli?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-emerald-800 font-bold hover:underline"
              >
                Is-diiwaangeli halkan
              </button>
            </p>
          ) : (
            <p>
              Horey ma u lahayd akoon?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-emerald-800 font-bold hover:underline"
              >
                Halkan kaga gal
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
