/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Course, Order, Enrollment, Coupon, Instructor, UserProfile } from './types/index.ts';
import { INITIAL_COURSES, INITIAL_INSTRUCTORS, INITIAL_COUPONS } from './data/courses.ts';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { CourseCatalog } from './components/CourseCatalog.tsx';
import { CourseCard } from './components/CourseCard.tsx';
import { CourseDetailsModal } from './components/CourseDetailsModal.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { StudentDashboard } from './components/StudentDashboard.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { DbSchemaView } from './components/DbSchemaView.tsx';
import { ReceiptModal } from './components/ReceiptModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { Footer } from './components/Footer.tsx';

export default function App() {
  // Navigation & View State
  const [currentView, setCurrentView] = useState<'home' | 'courses' | 'dashboard' | 'admin' | 'db-schema'>('home');

  // Authentication State (Default demo student for frictionless evaluation)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>({
    id: 'usr-student-1',
    email: 'yahye.hassan@example.com',
    full_name: 'Yahye Hassan Cali',
    phone: '+252615489201',
    role: 'student',
    learning_goal: 'Goethe-Zertifikat B1 & Ausbildung in Germany',
    country: 'Somalia',
    created_at: new Date().toISOString()
  });

  // App Data State
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [instructors, setInstructors] = useState<Instructor[]>(INITIAL_INSTRUCTORS);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([
    {
      id: 'enr-init-1',
      user_id: 'usr-student-1',
      course_id: INITIAL_COURSES[0].id,
      course: INITIAL_COURSES[0],
      progress_percentage: 33,
      completed_lessons: ['les-a1-01', 'les-a1-02'],
      completed: false,
      enrolled_at: new Date().toISOString(),
      last_accessed_at: new Date().toISOString()
    }
  ]);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ord-init-1',
      order_number: 'ORD-MC-84920',
      user_id: 'usr-student-1',
      course_id: INITIAL_COURSES[0].id,
      course_title: INITIAL_COURSES[0].title,
      amount: 29.00,
      original_amount: 49.00,
      discount_amount: 20.00,
      coupon_code: 'JARMAL50',
      currency: 'USD',
      status: 'completed',
      payment_method: 'evc_plus',
      payment_gateway: 'sifalo_pay',
      customer_phone: '+252615489201',
      customer_email: 'yahye.hassan@example.com',
      customer_name: 'Yahye Hassan Cali',
      transaction_ref: 'TXN-SIFALO-9284102',
      receipt_url: '/receipts/ORD-MC-84920',
      created_at: new Date().toISOString()
    }
  ]);

  // Modals State
  const [selectedCourseForDetails, setSelectedCourseForDetails] = useState<Course | null>(null);
  const [selectedCourseForCheckout, setSelectedCourseForCheckout] = useState<Course | null>(null);
  const [selectedOrderForReceipt, setSelectedOrderForReceipt] = useState<Order | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedLearningCourseId, setSelectedLearningCourseId] = useState<string | undefined>(undefined);

  // Fetch live courses & enrollments from backend
  const fetchData = async () => {
    try {
      const coursesRes = await fetch('/api/courses');
      if (coursesRes.ok) {
        const data = await coursesRes.json();
        if (data.courses?.length) setCourses(data.courses);
      }

      if (currentUser) {
        const enrollRes = await fetch(`/api/enrollments?user_id=${currentUser.id}`);
        if (enrollRes.ok) {
          const data = await enrollRes.json();
          if (data.enrollments) setEnrollments(data.enrollments);
        }

        const ordersRes = await fetch(`/api/orders?user_id=${currentUser.id}`);
        if (ordersRes.ok) {
          const data = await ordersRes.json();
          if (data.orders) setOrders(data.orders);
        }
      }

      const couponsRes = await fetch('/api/coupons');
      if (couponsRes.ok) {
        const data = await couponsRes.json();
        if (data.coupons) setCoupons(data.coupons);
      }
    } catch {
      // Graceful fallback to initial state
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  // Handle Switch User Persona (Student / Admin)
  const handleSwitchUser = (role: 'student' | 'admin') => {
    if (role === 'student') {
      setCurrentUser({
        id: 'usr-student-1',
        email: 'yahye.hassan@example.com',
        full_name: 'Yahye Hassan Cali',
        phone: '+252615489201',
        role: 'student',
        learning_goal: 'Goethe-Zertifikat B1 & Ausbildung in Germany',
        country: 'Somalia',
        created_at: new Date().toISOString()
      });
    } else {
      setCurrentUser({
        id: 'usr-admin-1',
        email: 'admin@mcaccadamy.com',
        full_name: 'Ustadh Mohamed Omar',
        phone: '+4917612345678',
        role: 'admin',
        learning_goal: 'German Studies Lead',
        country: 'Germany',
        created_at: new Date().toISOString()
      });
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('home');
  };

  // Enrolled course ids
  const enrolledCourseIds = enrollments.map(e => e.course_id);

  // Payment Success Handler
  const handlePaymentSuccess = (order: Order) => {
    setSelectedCourseForCheckout(null);
    setSelectedOrderForReceipt(order);
    fetchData();
    setCurrentView('dashboard');
  };

  const handleStartLearning = (course: Course) => {
    setSelectedLearningCourseId(course.id);
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Strict 3-zone Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onSwitchUser={handleSwitchUser}
        enrolledCount={enrollments.length}
      />

      {/* Main View Router */}
      <main className="flex-1">
        
        {/* VIEW 1: HOME PAGE */}
        {currentView === 'home' && (
          <>
            <Hero
              onExploreCourses={() => setCurrentView('courses')}
              onPreviewLesson={() => setSelectedCourseForDetails(courses[0])}
            />

            {/* Featured Course Marketplace Section */}
            <div className="py-12 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                  <div>
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                      Koorsooyinka Ugu Caansan
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Heerarka Af-Jarmalka (A1, A2, B1, B2 & Caafimaad)
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                      Xullo koorsada ku habboon heerkaaga iyo qorshahaaga dalka Jarmalka.
                    </p>
                  </div>

                  <button
                    onClick={() => setCurrentView('courses')}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                  >
                    <span>Eeg dhammaan koorsooyinka</span>
                    <span>→</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {courses.slice(0, 3).map(course => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      isEnrolled={enrolledCourseIds.includes(course.id)}
                      onSelect={(c) => setSelectedCourseForDetails(c)}
                      onEnroll={(c) => setSelectedCourseForCheckout(c)}
                      onContinueLearning={(c) => handleStartLearning(c)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Trust and Why MC Accadamy Section */}
            <section className="py-14 bg-slate-50 border-t border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    Faa'iidooyinka MC ACCADAMY
                  </span>
                  <h2 className="text-2xl font-black text-slate-900">
                    Maxay Kumanaan Arday Soomaaliyeed Noo Doorteen?
                  </h2>
                  <p className="text-xs text-slate-500">
                    Koorso kasta waxaa loogu talagalay in qofka Soomaaliga ahi si dabiici ah ugu fahmo luuqadda adag ee Jarmalka.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      🇩🇪
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">Goethe-Zertifikat Pass Rate</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      98% ardaydayada waxay ku guuleysteen imtixaanka safaaradda Jarmalka ee A1, A2, iyo B1 markii ugu horeysay.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                      💳
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">Lacag-Bixinta Sifalo Pay & Cards</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Si toos ah ugu bixi EVC Plus, ZAAD, SAHAL, eDahab, ama Visa & Mastercard adigoon wax dhib ah marin.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                      🏥
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">Ausbildung & Nursing Support</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Diyaarinta CV-ga Jarmalka (Lebenslauf), warqadda codsiga shaqada, iyo eray-bixinta kalkaalisada iyo dhakhaatiirta.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* VIEW 2: COURSES MARKETPLACE */}
        {currentView === 'courses' && (
          <CourseCatalog
            courses={courses}
            enrolledCourseIds={enrolledCourseIds}
            onSelectCourse={(c) => setSelectedCourseForDetails(c)}
            onEnrollCourse={(c) => setSelectedCourseForCheckout(c)}
            onContinueLearning={(c) => handleStartLearning(c)}
          />
        )}

        {/* VIEW 3: STUDENT DASHBOARD & PLAYER */}
        {currentView === 'dashboard' && (
          <StudentDashboard
            currentUser={currentUser || {
              id: 'usr-student-1',
              email: 'student@mcaccadamy.com',
              full_name: 'Yahye Hassan Cali',
              phone: '+252615489201',
              role: 'student',
              learning_goal: 'Goethe-Zertifikat B1 & Ausbildung in Germany',
              created_at: new Date().toISOString()
            }}
            enrollments={enrollments}
            orders={orders}
            allCourses={courses}
            onRefreshData={fetchData}
            onViewReceipt={(o) => setSelectedOrderForReceipt(o)}
            onExploreMore={() => setCurrentView('courses')}
            onEnrollCourse={(c) => setSelectedCourseForCheckout(c)}
            onSelectCourse={(c) => setSelectedCourseForDetails(c)}
            onUpdateLearningGoal={(newGoal) => {
              setCurrentUser(prev => prev ? { ...prev, learning_goal: newGoal } : null);
            }}
            initialSelectedCourseId={selectedLearningCourseId}
          />
        )}

        {/* VIEW 4: ADMIN DASHBOARD */}
        {currentView === 'admin' && (
          <AdminDashboard
            courses={courses}
            orders={orders}
            coupons={coupons}
            instructors={instructors}
            onRefreshData={fetchData}
            onOpenDbSchema={() => setCurrentView('db-schema')}
          />
        )}

        {/* VIEW 5: SUPABASE DATABASE SCHEMA */}
        {currentView === 'db-schema' && (
          <DbSchemaView />
        )}

      </main>

      {/* Course Details Modal */}
      <CourseDetailsModal
        course={selectedCourseForDetails}
        onClose={() => setSelectedCourseForDetails(null)}
        onEnroll={(c) => {
          setSelectedCourseForDetails(null);
          setSelectedCourseForCheckout(c);
        }}
        isEnrolled={Boolean(selectedCourseForDetails && enrolledCourseIds.includes(selectedCourseForDetails.id))}
        onStartLearning={(c) => {
          setSelectedCourseForDetails(null);
          handleStartLearning(c);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        course={selectedCourseForCheckout}
        currentUser={currentUser}
        onClose={() => setSelectedCourseForCheckout(null)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Official Receipt Modal */}
      <ReceiptModal
        order={selectedOrderForReceipt}
        onClose={() => setSelectedOrderForReceipt(null)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          fetchData();
        }}
      />

      {/* Footer */}
      <Footer onNavigate={setCurrentView} />

    </div>
  );
}
