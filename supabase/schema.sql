-- ============================================================================
-- MC ACCADAMY - Complete Supabase PostgreSQL Schema & Migration Script
-- Platform: German to Somali Online Course Marketplace (A1 to B2)
-- Includes: Tables, Foreign Keys, Indexes, Functions, Triggers, RLS Policies & Seed Data
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean existing enum or tables if re-running
DO $$ BEGIN
  CREATE TYPE user_role_enum AS ENUM ('student', 'instructor', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE course_level_enum AS ENUM ('A1', 'A2', 'B1', 'B2', 'Medical / Healthcare', 'Goethe Exam Prep');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE order_status_enum AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_gateway_enum AS ENUM ('sifalo_pay', 'stripe');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_method_enum AS ENUM ('evc_plus', 'zaad', 'sahal', 'edahab', 'premier_wallet', 'visa_mastercard', 'stripe');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 2. TABLES DEFINITIONS
-- ============================================================================

-- A. USERS & PROFILES TABLE
-- Extends Supabase auth.users or acts standalone with UUID references
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  role user_role_enum DEFAULT 'student'::user_role_enum NOT NULL,
  avatar_url TEXT,
  learning_goal VARCHAR(255) DEFAULT 'Goethe-Zertifikat B1 & Ausbildung in Germany',
  country VARCHAR(100) DEFAULT 'Somalia',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- B. INSTRUCTORS TABLE
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
  rating NUMERIC(3,2) DEFAULT 4.95 CHECK (rating >= 1.0 AND rating <= 5.0),
  total_students INT DEFAULT 0 CHECK (total_students >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- C. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  title_somali VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  level course_level_enum NOT NULL,
  language_from VARCHAR(50) DEFAULT 'German' NOT NULL,
  language_to VARCHAR(50) DEFAULT 'Somali' NOT NULL,
  short_description TEXT NOT NULL,
  short_description_somali TEXT NOT NULL,
  description TEXT NOT NULL,
  description_somali TEXT NOT NULL,
  learning_outcomes JSONB DEFAULT '[]'::jsonb NOT NULL,
  price NUMERIC(10,2) DEFAULT 49.00 NOT NULL CHECK (price >= 0),
  discount_price NUMERIC(10,2) CHECK (discount_price IS NULL OR (discount_price >= 0 AND discount_price <= price)),
  thumbnail_url TEXT,
  instructor_id UUID REFERENCES public.instructors(id) ON DELETE SET NULL,
  featured BOOLEAN DEFAULT false NOT NULL,
  total_hours NUMERIC(4,1) DEFAULT 24.0 NOT NULL CHECK (total_hours > 0),
  total_lessons INT DEFAULT 32 NOT NULL CHECK (total_lessons >= 0),
  badge_label VARCHAR(100),
  certificate_included BOOLEAN DEFAULT true NOT NULL,
  is_published BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- D. LESSONS TABLE
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  module_title VARCHAR(255) NOT NULL,
  module_order INT DEFAULT 1 NOT NULL,
  title VARCHAR(255) NOT NULL,
  title_somali VARCHAR(255) NOT NULL,
  order_index INT NOT NULL,
  video_url TEXT,
  duration VARCHAR(20) DEFAULT '18:45' NOT NULL,
  is_preview BOOLEAN DEFAULT false NOT NULL,
  notes_somali TEXT,
  notes_german TEXT,
  vocabulary JSONB DEFAULT '[]'::jsonb,
  resources JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT uq_course_lesson_order UNIQUE (course_id, order_index)
);

-- E. COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(20) DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')) NOT NULL,
  discount_value NUMERIC(10,2) NOT NULL CHECK (discount_value > 0),
  min_order_amount NUMERIC(10,2) DEFAULT 0.00 NOT NULL CHECK (min_order_amount >= 0),
  max_uses INT DEFAULT 500 NOT NULL CHECK (max_uses > 0),
  current_uses INT DEFAULT 0 NOT NULL CHECK (current_uses >= 0),
  is_active BOOLEAN DEFAULT true NOT NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- F. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(64) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE RESTRICT,
  amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
  original_amount NUMERIC(10,2) NOT NULL CHECK (original_amount >= 0),
  discount_amount NUMERIC(10,2) DEFAULT 0.00 NOT NULL CHECK (discount_amount >= 0),
  coupon_code VARCHAR(50),
  currency VARCHAR(10) DEFAULT 'USD' NOT NULL,
  status order_status_enum DEFAULT 'pending'::order_status_enum NOT NULL,
  payment_method payment_method_enum NOT NULL,
  payment_gateway payment_gateway_enum NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  transaction_ref VARCHAR(100),
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- G. PAYMENTS TABLE (Gateway Audit & Verification Log)
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  gateway payment_gateway_enum NOT NULL,
  gateway_ref VARCHAR(100),
  amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
  currency VARCHAR(10) DEFAULT 'USD' NOT NULL,
  status VARCHAR(50) NOT NULL,
  payment_channel payment_method_enum,
  raw_response JSONB DEFAULT '{}'::jsonb,
  signature_verified BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- H. ENROLLMENTS TABLE (Automated Course Access)
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  progress_percentage INT DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100) NOT NULL,
  completed BOOLEAN DEFAULT false NOT NULL,
  completed_at TIMESTAMPTZ,
  certificate_id VARCHAR(64),
  enrolled_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_accessed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT uq_user_course_enrollment UNIQUE (user_id, course_id)
);

-- I. LESSON PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT true NOT NULL,
  watch_duration_seconds INT DEFAULT 0 CHECK (watch_duration_seconds >= 0) NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT uq_user_lesson_progress UNIQUE (user_id, lesson_id)
);

-- ============================================================================
-- 3. INDEXES FOR HIGH QUERY PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_courses_level ON public.courses(level);
CREATE INDEX IF NOT EXISTS idx_courses_published_featured ON public.courses(is_published, featured);
CREATE INDEX IF NOT EXISTS idx_lessons_course ON public.lessons(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON public.enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON public.enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_course ON public.lesson_progress(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);

-- ============================================================================
-- 4. TRIGGERS & FUNCTIONS
-- ============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_courses_updated_at ON public.courses;
CREATE TRIGGER trigger_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_orders_updated_at ON public.orders;
CREATE TRIGGER trigger_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Automatic enrollment function when an order is completed
CREATE OR REPLACE FUNCTION public.handle_completed_order_enrollment()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS DISTINCT FROM 'completed') THEN
    INSERT INTO public.enrollments (user_id, course_id, order_id, progress_percentage, enrolled_at, last_accessed_at)
    VALUES (NEW.user_id, NEW.course_id, NEW.id, 0, NOW(), NOW())
    ON CONFLICT (user_id, course_id) DO UPDATE
    SET order_id = NEW.id, last_accessed_at = NOW();

    -- Increment coupon usage if used
    IF NEW.coupon_code IS NOT NULL THEN
      UPDATE public.coupons
      SET current_uses = current_uses + 1
      WHERE code = NEW.coupon_code;
    END IF;

    -- Increment instructor student count
    UPDATE public.instructors
    SET total_students = total_students + 1
    WHERE id = (SELECT instructor_id FROM public.courses WHERE id = NEW.course_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_order_completed_enrollment ON public.orders;
CREATE TRIGGER trigger_order_completed_enrollment
  AFTER UPDATE OF status ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_completed_order_enrollment();

-- Helper function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id OR auth.uid() IS NULL);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin());

-- INSTRUCTORS POLICIES
CREATE POLICY "Instructors are viewable by everyone"
  ON public.instructors FOR SELECT USING (true);

CREATE POLICY "Admins can manage instructors"
  ON public.instructors FOR ALL USING (public.is_admin());

-- COURSES POLICIES
CREATE POLICY "Published courses are viewable by everyone"
  ON public.courses FOR SELECT USING (is_published = true OR public.is_admin());

CREATE POLICY "Admins can manage courses"
  ON public.courses FOR ALL USING (public.is_admin());

-- LESSONS POLICIES
CREATE POLICY "Public preview lessons viewable by everyone"
  ON public.lessons FOR SELECT USING (
    is_preview = true 
    OR EXISTS (
      SELECT 1 FROM public.enrollments 
      WHERE enrollments.course_id = lessons.course_id 
        AND enrollments.user_id = auth.uid()
    )
    OR public.is_admin()
  );

CREATE POLICY "Admins can manage lessons"
  ON public.lessons FOR ALL USING (public.is_admin());

-- COUPONS POLICIES
CREATE POLICY "Active coupons viewable by authenticated or anon for checkout verification"
  ON public.coupons FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage coupons"
  ON public.coupons FOR ALL USING (public.is_admin());

-- ORDERS POLICIES
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can create their own order"
  ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NOT NULL);

CREATE POLICY "Admins and Webhooks can update orders"
  ON public.orders FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

-- PAYMENTS POLICIES
CREATE POLICY "Users can view payments for their orders"
  ON public.payments FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = payments.order_id 
        AND (orders.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "Backend service can log payments"
  ON public.payments FOR INSERT WITH CHECK (true);

-- ENROLLMENTS POLICIES
CREATE POLICY "Users can view their own enrollments"
  ON public.enrollments FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can update their enrollment progress"
  ON public.enrollments FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

-- LESSON PROGRESS POLICIES
CREATE POLICY "Users can view their own lesson progress"
  ON public.lesson_progress FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert their own lesson progress"
  ON public.lesson_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lesson progress"
  ON public.lesson_progress FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- 6. SEED DATA (MC ACCADAMY - GERMAN TO SOMALI COURSES & INSTRUCTORS)
-- ============================================================================

-- Insert Instructors
INSERT INTO public.instructors (id, name, title, bio, bio_somali, qualification, location, avatar_url, rating, total_students)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'Ustadh Mohamed Omar',
    'Head of German Studies & Goethe Examiner Prep',
    'Specialist in German as a foreign language (DaF) with over 9 years teaching Somali students in Heidelberg and Berlin. Helped 1,800+ students pass Goethe A1-B2 with 98% pass rate.',
    'Khabiir ku takhasusay baridda Af-Jarmalka (DaF) oo in ka badan 9 sano wax ka dhigayay magaalooyinka Heidelberg iyo Berlin. Wuxuu ka caawiyay 1,800+ arday inay ku guuleystaan imtixaanka Goethe A1-B2.',
    'Goethe-Zertifikat C2 / Uni Heidelberg M.A.',
    'Berlin, Germany',
    '/assets/aistudio/05F8C6A4-5FFB-4D4A-B2E5-11DF7B585E48_8e6b0422.jpeg',
    4.98,
    2450
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'Dr. Deqa Abdi',
    'Medical German & Nursing Integration Lead',
    'Medical doctor and certified German healthcare communication trainer in Munich. Leads specialized clinical terminology and Fachsprachenprüfung (FSP) preparation for Somali nurses and doctors.',
    'Dhakhtarad iyo tababare caafimaad oo ku nool Munich. Waxay horkacdaa koorsada gaarka ah ee kalkaaliyeyaasha iyo dhakhaatiirta Soomaaliyeed ee u diyaargaroobaya shaqada Isbitaallada Jarmalka.',
    'Approbation / LMU Munich Medical Faculty',
    'Munich, Germany',
    '/assets/aistudio/05F8C6A4-5FFB-4D4A-B2E5-11DF7B585E48_8e6b0422.jpeg',
    4.95,
    980
  )
ON CONFLICT (id) DO NOTHING;

-- Insert Courses
INSERT INTO public.courses (
  id, title, title_somali, slug, level, language_from, language_to,
  short_description, short_description_somali, description, description_somali,
  learning_outcomes, price, discount_price, thumbnail_url, instructor_id,
  featured, total_hours, total_lessons, badge_label, certificate_included
)
VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    'German A1: Complete Beginner to Goethe Certification',
    'Af-Jarmalka A1: Bilow ilaa Shahaadada Goethe-Zertifikat',
    'german-a1-somali-beginner',
    'A1',
    'German',
    'Somali',
    'Master basic German pronunciation, grammar, daily conversations, and pass the Goethe A1 exam with confidence.',
    'Baro aasaaska af-jarmalka, alifbeetada, dhismaha weedhaha, iyo sida loogu baaso imtixaanka Goethe A1 si fudud adigoo af-soomaali ku baranaya.',
    'Comprehensive German A1 masterclass designed specifically for Somali speakers. Covers all core grammar concepts: articles (der, die, das), regular and irregular verbs, numbers, ordering food, asking directions, family, and past tense basics.',
    'Koorsadan A1 waa aasaaska ugu muhiimsan ee qof kasta oo raba inuu barto luuqadda Jarmalka ama u socdaala dalka Jarmalka. Waxaad ku baranaysaa naxwaha aasaasiga ah, sida loo hadlo maalin kasta, iyo farsamooyinka lagu baaso imtixaanka safaaradda.',
    '["Fahamka iyo akhriska alifbeetada iyo dhawaaqa saxda ah ee Jarmalka", "Adeegsiga qodobada muhiimka ah (der, die, das) iyo weedhaha naxwaha saxda ah", "Wadahadalka maalinlaha ah: isbarasho, wax iibsasho, iyo ballamo", "U diyaar-garowga iyo ku guuleysiga imtixaanka Goethe-Zertifikat A1"]'::jsonb,
    49.00,
    29.00,
    '/assets/aistudio/05F8C6A4-5FFB-4D4A-B2E5-11DF7B585E48_8e6b0422.jpeg',
    '00000000-0000-0000-0000-000000000001',
    true,
    28.5,
    36,
    'Ugu caansan (Most Popular)',
    true
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'German A2: Elementary Conversations & Real-Life Situations',
    'Af-Jarmalka A2: Naxwaha Qoto-dheer & Wadahadalka Dhexe',
    'german-a2-somali-elementary',
    'A2',
    'German',
    'Somali',
    'Take your German to the next level. Learn past tense (Perfekt), modal verbs, dative vs accusative cases, and everyday German culture.',
    'Kor u qaad fahamkaaga Jarmalka. Baro wakhtiga tagay (Perfekt & Präteritum), xaaladaha Dativ iyo Akkusativ, iyo wadahadallada rasmiga ah.',
    'Designed for students who finished A1. Focuses heavily on spoken fluency, listening comprehension drills, handling doctor visits, banking, apartment hunting (Wohnungssuche), and passing the Goethe A2 exam.',
    'Koorsadani waxay kugu hagaysaa nolosha dhabta ah ee Jarmalka: sida guri looga raadsado, sida xafiisyada loola hadlo, iyo sharraxaadda xaaladaha shaqada adigoo af-soomaali faahfaahsan ku helaya casharrada.',
    '["Fahamka qotada dheer ee xaaladaha Dativ iyo Akkusativ prepositions", "Adeegsiga wakhtiyada tagay (Perfekt & Präteritum)", "Sida loo qoro emails iyo waraaqo rasmi ah", "Diyaarinta buuxda ee imtixaanka Goethe/telc A2"]'::jsonb,
    59.00,
    35.00,
    '/assets/aistudio/05F8C6A4-5FFB-4D4A-B2E5-11DF7B585E48_8e6b0422.jpeg',
    '00000000-0000-0000-0000-000000000001',
    true,
    32.0,
    42,
    'Heerka Dhexe',
    true
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    'German B1: Independence, Citizenship & Ausbildung Prep',
    'Af-Jarmalka B1: Heerka Madax-bannaanida & Diyaarinta Ausbildung',
    'german-b1-somali-intermediate',
    'B1',
    'German',
    'Somali',
    'The critical milestone for working in Germany, starting an Ausbildung, or applying for residency & citizenship.',
    'Heerka ugu muhiimsan ee lagu helo fursadaha shaqo, Ausbildung, iyo deganaanshaha/dhalashada Jarmalka. Qoraalka CV-ga iyo waraaqaha codsiga.',
    'Master advanced clauses, Konjunktiv II, passive voice, and write German CVs (Lebenslauf) and motivation letters (Anschreiben). Over 40 hours of intensive German-Somali lectures and 10 full mock Goethe B1 exam tests.',
    'Koorsada B1 waa albaabka mustaqbalkaaga Jarmalka. Waxay si toos ah kugu diyaarinaysaa shuruudaha Ausbildung-ka, wareysiyada shaqada, iyo imtixaanka 4-ta qaybood ee Goethe B1.',
    '["Konjunktiv II iyo Passiv - naxwaha heerka sare", "Qorista Anschreiben (Motivation Letter) & Lebenslauf (CV) sax ah", "Falanqaynta mowduucyada casriga ah iyo doodaha", "Xeeladaha lagu gudbo 4-ta qaybood ee imtixaanka Goethe B1"]'::jsonb,
    79.00,
    49.00,
    '/assets/aistudio/05F8C6A4-5FFB-4D4A-B2E5-11DF7B585E48_8e6b0422.jpeg',
    '00000000-0000-0000-0000-000000000001',
    true,
    40.0,
    48,
    'Muhiim u ah Ausbildung',
    true
  ),
  (
    '10000000-0000-0000-0000-000000000004',
    'Deutsch für Pflegekräfte: Medical German for Nurses & Healthcare',
    'Af-Jarmalka Kalkaaliyeyaasha Caafimaadka & Dhakhaatiirta',
    'german-medical-healthcare-somali',
    'Medical / Healthcare',
    'German',
    'Somali',
    'Specialized medical vocabulary, patient documentation (Pflegedokumentation), and clinical shift handover dialogues.',
    'Eray-bixinta caafimaadka, dukumiintiyada bukaanka, iyo xiriirka dhakhaatiirta ee isbitaallada Jarmalka. Ku habboon kalkaaliyeyaasha.',
    'Taught by Dr. Deqa Abdi. Focuses on clinical terminology, interacting with elderly and acute care patients, understanding German hospital hierarchies, and passing the professional healthcare language test.',
    'Waxaa bixinaysa Dr. Deqa Abdi. Koorso gaar ah oo loogu talagalay shaqaalaha caafimaadka Soomaaliyeed ee raba inay ka shaqeeyaan isbitaallada iyo xarumaha daryeelka Jarmalka.',
    '["Eray bixinta xubnaha jirka, cudurrada, iyo dawooyinka", "Qorista warbixinta caafimaadka (Pflegebericht & Übergabe)", "Wadahadalka bukaanka iyo xaaladaha degdegga ah", "Diyaarinta imtixaanka luuqadda caafimaadka"]'::jsonb,
    89.00,
    55.00,
    '/assets/aistudio/05F8C6A4-5FFB-4D4A-B2E5-11DF7B585E48_8e6b0422.jpeg',
    '00000000-0000-0000-0000-000000000002',
    true,
    30.0,
    38,
    'Caafimaadka & Shaqada',
    true
  )
ON CONFLICT (id) DO NOTHING;

-- Insert Sample Coupons
INSERT INTO public.coupons (code, discount_type, discount_value, min_order_amount, max_uses, current_uses, is_active)
VALUES
  ('JARMAL50', 'percentage', 50.00, 20.00, 1000, 42, true),
  ('SOMALIA20', 'fixed', 20.00, 30.00, 500, 18, true),
  ('BISMILLAH', 'percentage', 30.00, 15.00, 500, 89, true),
  ('AUSBILDUNG', 'fixed', 15.00, 25.00, 200, 12, true)
ON CONFLICT (code) DO NOTHING;
