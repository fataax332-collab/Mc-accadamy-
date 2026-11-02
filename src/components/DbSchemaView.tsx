import React, { useState } from 'react';
import { Database, Copy, Check, Download, ExternalLink, ShieldCheck, Terminal, Layers } from 'lucide-react';

export const DbSchemaView: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'sql' | 'tables' | 'env' | 'guide'>('sql');

  const fullSql = `-- ============================================================================
-- MC ACCADAMY - Complete Supabase PostgreSQL Schema & Migration Script
-- Platform: German to Somali Online Course Marketplace (A1 to B2)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES / USERS
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
  avatar_url TEXT,
  learning_goal VARCHAR(255) DEFAULT 'Goethe-Zertifikat B1 & Ausbildung in Germany',
  country VARCHAR(100) DEFAULT 'Somalia',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. INSTRUCTORS
CREATE TABLE IF NOT EXISTS public.instructors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  bio TEXT NOT NULL,
  bio_somali TEXT NOT NULL,
  qualification VARCHAR(255) DEFAULT 'Goethe-Zertifikat C2 / Uni Heidelberg',
  location VARCHAR(100) DEFAULT 'Berlin / Mogadishu',
  avatar_url TEXT,
  rating NUMERIC(3,2) DEFAULT 4.95,
  total_students INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. COURSES (A1, A2, B1, B2, Medical)
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  title_somali VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  level VARCHAR(50) NOT NULL,
  language_from VARCHAR(50) DEFAULT 'German',
  language_to VARCHAR(50) DEFAULT 'Somali',
  short_description TEXT NOT NULL,
  short_description_somali TEXT NOT NULL,
  description TEXT NOT NULL,
  description_somali TEXT NOT NULL,
  learning_outcomes JSONB DEFAULT '[]'::jsonb,
  price NUMERIC(10,2) NOT NULL DEFAULT 49.00,
  discount_price NUMERIC(10,2),
  thumbnail_url TEXT,
  instructor_id UUID REFERENCES public.instructors(id) ON DELETE SET NULL,
  featured BOOLEAN DEFAULT false,
  total_hours NUMERIC(4,1) DEFAULT 24.0,
  total_lessons INT DEFAULT 32,
  badge_label VARCHAR(100),
  certificate_included BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. LESSONS
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  module_title VARCHAR(255) NOT NULL,
  module_order INT DEFAULT 1,
  title VARCHAR(255) NOT NULL,
  title_somali VARCHAR(255) NOT NULL,
  order_index INT NOT NULL,
  video_url TEXT,
  duration VARCHAR(20) DEFAULT '18:45',
  is_preview BOOLEAN DEFAULT false,
  notes_somali TEXT,
  notes_german TEXT,
  vocabulary JSONB DEFAULT '[]'::jsonb,
  resources JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_course_lesson UNIQUE (course_id, order_index)
);

-- 5. COUPONS
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(20) NOT NULL,
  discount_value NUMERIC(10,2) NOT NULL,
  min_order_amount NUMERIC(10,2) DEFAULT 0.00,
  max_uses INT DEFAULT 500,
  current_uses INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(64) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE RESTRICT,
  amount NUMERIC(10,2) NOT NULL,
  original_amount NUMERIC(10,2) NOT NULL,
  discount_amount NUMERIC(10,2) DEFAULT 0.00,
  coupon_code VARCHAR(50),
  currency VARCHAR(10) DEFAULT 'USD',
  status VARCHAR(20) DEFAULT 'pending',
  payment_method VARCHAR(50) NOT NULL,
  payment_gateway VARCHAR(50) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  transaction_ref VARCHAR(100),
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PAYMENTS (Gateway Auditing)
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  gateway VARCHAR(50) NOT NULL,
  gateway_ref VARCHAR(100),
  amount NUMERIC(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  status VARCHAR(50) NOT NULL,
  payment_channel VARCHAR(50),
  raw_response JSONB DEFAULT '{}'::jsonb,
  signature_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ENROLLMENTS (Automatic Access)
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  progress_percentage INT DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  certificate_id VARCHAR(64),
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_enrollment UNIQUE (user_id, course_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tables = [
    { name: 'profiles', count: 'users & auth', desc: 'Ardayda, Macallimiinta, iyo Maamulka (Students, Instructors, Admins)' },
    { name: 'instructors', count: '2 specialists', desc: 'Ustadh Mohamed Omar (Goethe C2) & Dr. Deqa Abdi (Pflege)' },
    { name: 'courses', count: '6 courses', desc: 'A1, A2, B1, B2, Caafimaadka & Goethe Exam Masterclass' },
    { name: 'lessons', count: '30+ video lessons', desc: 'Casharrada, qoraalka Soomaaliga, Eray-bixinta, iyo PDF guides' },
    { name: 'orders', count: 'order tracking', desc: 'Diiwaanka dalabyada, rasiidhada, iyo qiimaha SOS & USD' },
    { name: 'payments', count: 'gateway logs', desc: 'Sifalo Pay (EVC, ZAAD, Sahal) iyo Stripe transactions & webhook logs' },
    { name: 'enrollments', count: 'course access', desc: 'Xaqiijinta tooska ah ee koorsada markay lacagtu guuleysato' },
    { name: 'coupons', count: 'promo codes', desc: 'JARMAL50, SOMALIA20, BISMILLAH, AUSBILDUNG' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>Supabase PostgreSQL Architecture</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Dhismaha Xogta Supabase Database (Schema & SQL)
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              SQL Migration buuxa oo ka kooban 8 tables, foreign keys, row level security (RLS), triggers, iyo automated course access.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
              <span>{copied ? 'Waa la guuriyay (Copied)!' : 'Guuri SQL (Copy)'}</span>
            </button>

            <a
              href="/api/database/schema.sql"
              download="mc_accadamy_schema.sql"
              className="px-5 py-2.5 bg-[#0a2f24] hover:bg-[#0d3b2e] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Degso .SQL File</span>
            </a>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'sql'
                ? 'bg-[#0a2f24] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Qoraalka SQL (Full Script)
          </button>

          <button
            onClick={() => setActiveTab('tables')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'tables'
                ? 'bg-[#0a2f24] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Jadwallada (8 Tables Overview)
          </button>

          <button
            onClick={() => setActiveTab('env')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'env'
                ? 'bg-[#0a2f24] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Environment Variables (.env)
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'guide'
                ? 'bg-[#0a2f24] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Sida Loogu Xiro Supabase (Deployment Guide)
          </button>
        </div>

        {/* Tab 1: SQL Code Viewer */}
        {activeTab === 'sql' && (
          <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
            <div className="px-6 py-3 border-b border-slate-800 bg-slate-900 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono">/supabase/schema.sql (PostgreSQL 15+)</span>
              <button
                onClick={handleCopy}
                className="hover:text-white flex items-center gap-1 text-slate-300 font-semibold"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy SQL'}</span>
              </button>
            </div>
            <pre className="p-6 font-mono text-xs text-emerald-300 overflow-x-auto max-h-[500px] leading-relaxed">
              <code>{fullSql}</code>
            </pre>
          </div>
        )}

        {/* Tab 2: 8 Tables Overview */}
        {activeTab === 'tables' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tables.map(t => (
              <div key={t.name} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-emerald-800">{t.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {t.count}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Environment Variables */}
        {activeTab === 'env' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Furayaasha Qasabka ah (.env.example)</h3>
              <p className="text-xs text-slate-500 mt-1">
                Ku dar furayaashan faylkaaga .env si aad ugu xirto Supabase dhab ah iyo Sifalo Pay:
              </p>
            </div>

            <pre className="p-4 bg-slate-900 text-slate-200 rounded-2xl font-mono text-xs overflow-x-auto leading-loose">
{`# SUPABASE POSTGRESQL & AUTH
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# SIFALO PAY (SOMALI MOBILE MONEY: EVC PLUS, ZAAD, SAHAL, EDAHAB)
SIFALO_API_KEY="your_sifalo_api_key"
SIFALO_MERCHANT_ID="your_merchant_id"
SIFALO_WEBHOOK_SECRET="your_webhook_secret"
SIFALO_ENVIRONMENT="sandbox" # or "production"

# STRIPE GATEWAY (CARDS & INTERNATIONAL)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
VITE_STRIPE_PUBLISHABLE_KEY="pk_test_..."`}
            </pre>
          </div>
        )}

        {/* Tab 4: Step-by-Step Deployment Guide */}
        {activeTab === 'guide' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 text-xs text-slate-700 leading-relaxed">
            <h3 className="text-base font-bold text-slate-900">
              Sida Supabase loogu xiro 3 Tallaabo (Step-by-Step Setup)
            </h3>

            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">1</span>
                <div>
                  <h4 className="font-bold text-slate-900">Fur Mashruuc Cusub oo Supabase ah</h4>
                  <p>Gal supabase.com oo guji "New Project". Dooro magaca <span className="font-mono font-semibold">mc-accadamy</span> iyo goobta ugu dhow (tusaale: Frankfurt / EU).</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">2</span>
                <div>
                  <h4 className="font-bold text-slate-900">Ku shub SQL Script-ka (Run SQL Editor)</h4>
                  <p>Supabase dashboard-ka bidix kaga dhufo <strong>SQL Editor</strong>, ku dhaji qoraalka SQL ee kor ku xusan, kadibna guji <strong>Run</strong>. Dhammaan 8-da jadwal, RLS, iyo casharrada tusaalaha ah ayaa si toos ah u abuurmaya.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">3</span>
                <div>
                  <h4 className="font-bold text-slate-900">Ku dar Project URL & Anon Key</h4>
                  <p>Ka soo qaad Settings &gt; API furayaasha <span className="font-mono">URL</span> iyo <span className="font-mono">anon key</span>, kuna qor .env.</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
