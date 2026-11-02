import React from 'react';
import { ShieldCheck, Mail, Phone, MapPin, Award } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'home' | 'courses' | 'dashboard' | 'admin' | 'db-schema') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#051a13] text-slate-300 border-t border-emerald-950/60 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-sm">
                MC
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                MC ACCADAMY
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Xarunta ugu weyn ee Af-Jarmalka lagu barto afkaaga hooyo ee Soomaaliga. Waxaan kugu diyaarinaynaa imtixaanka safaaradda ee Goethe-Zertifikat A1-B2, fursadaha Ausbildung-ka, iyo shaqooyinka daryeelka caafimaadka ee Jarmalka.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-1.5 font-medium">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Berlin, Germany · Mogadishu, Somalia</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>contact@mcaccadamy.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>+252 61 548 9201 / +49 176 12345678</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Koorsooyinka
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('courses')} className="hover:text-white transition-colors">
                  German A1 (Bilow)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('courses')} className="hover:text-white transition-colors">
                  German A2 (Heerka Dhexe)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('courses')} className="hover:text-white transition-colors">
                  German B1 & Ausbildung
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('courses')} className="hover:text-white transition-colors">
                  German B2 (Xirfad Sare)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('courses')} className="hover:text-white transition-colors">
                  Deutsch für Pflegekräfte
                </button>
              </li>
            </ul>
          </div>

          {/* Ardayda */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Ardayda & Adeegyada
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">
                  Koorsooyinkayga (Portal)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">
                  Shahaadooyinka (Certificates)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">
                  Diiwaanka Rasiidhada
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('db-schema')} className="hover:text-white transition-colors">
                  Supabase Database SQL
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-white transition-colors">
                  Xafiiska Maamulka (Admin)
                </button>
              </li>
            </ul>
          </div>

          {/* Payment Gateways */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Hababka Lacag-Bixinta
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Waxaan si rasmi ah u aqbalnaa lacagaha taleefannada gacanta ee Soomaaliya iyo kaadhadhka caalamiga ah:
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="px-2 py-1 rounded bg-slate-800 text-[10px] font-bold text-white">EVC Plus</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-[10px] font-bold text-white">ZAAD</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-[10px] font-bold text-white">SAHAL</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-[10px] font-bold text-white">eDahab</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-[10px] font-bold text-white">Premier Pay</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-[10px] font-bold text-white">Visa</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-[10px] font-bold text-white">Mastercard</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-[10px] font-bold text-white">Stripe</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-emerald-950/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MC ACCADAMY. Xuquuqda oo dhan way dhowran tahay.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Shuruudaha & Xeerarka</span>
            <span>·</span>
            <span>Ilaalinta Xogta (Privacy Policy)</span>
            <span>·</span>
            <span>Goethe Exam Prep Certified</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
