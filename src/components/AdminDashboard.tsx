import React, { useState } from 'react';
import { Course, Order, Coupon, Instructor, CourseLevel } from '../types/index.ts';
import { 
  Plus, Edit2, Trash2, Shield, DollarSign, Users, ShoppingBag, 
  TrendingUp, Search, RefreshCw, CheckCircle2, AlertTriangle, 
  Database, Tag, ExternalLink, X, ArrowUpRight, Copy, Check
} from 'lucide-react';

interface AdminDashboardProps {
  courses: Course[];
  orders: Order[];
  coupons: Coupon[];
  instructors: Instructor[];
  onRefreshData: () => void;
  onOpenDbSchema: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  courses,
  orders,
  coupons,
  instructors,
  onRefreshData,
  onOpenDbSchema
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'orders' | 'coupons'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<string>('all');

  // Course Modal Form State
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseTitleSomali, setCourseTitleSomali] = useState('');
  const [courseLevel, setCourseLevel] = useState<CourseLevel>('A1');
  const [coursePrice, setCoursePrice] = useState(49);
  const [courseDiscountPrice, setCourseDiscountPrice] = useState<number | undefined>(29);
  const [courseHours, setCourseHours] = useState(25);
  const [courseDescSomali, setCourseDescSomali] = useState('');
  const [courseInstructorId, setCourseInstructorId] = useState(instructors[0]?.id || '');
  const [courseBadge, setCourseBadge] = useState('');

  // Coupon Modal Form State
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponValue, setNewCouponValue] = useState(25);

  // Refund confirmation
  const [refundingOrderId, setRefundingOrderId] = useState<string | null>(null);
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);
  const [refundSuccessMsg, setRefundSuccessMsg] = useState('');

  // Analytics calculation
  const completedOrders = orders.filter(o => o.status === 'completed');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.amount, 0);
  const totalStudents = new Set(orders.map(o => o.user_id)).size || 4;

  const paymentBreakdown: Record<string, number> = {};
  completedOrders.forEach(o => {
    paymentBreakdown[o.payment_method] = (paymentBreakdown[o.payment_method] || 0) + o.amount;
  });

  // Open Course Edit
  const handleOpenEditCourse = (course: Course) => {
    setEditingCourse(course);
    setCourseTitle(course.title);
    setCourseTitleSomali(course.title_somali);
    setCourseLevel(course.level);
    setCoursePrice(course.price);
    setCourseDiscountPrice(course.discount_price);
    setCourseHours(course.total_hours);
    setCourseDescSomali(course.description_somali);
    setCourseInstructorId(course.instructor_id);
    setCourseBadge(course.badge_label || '');
    setIsCourseModalOpen(true);
  };

  const handleOpenAddCourse = () => {
    setEditingCourse(null);
    setCourseTitle('');
    setCourseTitleSomali('');
    setCourseLevel('A1');
    setCoursePrice(49);
    setCourseDiscountPrice(29);
    setCourseHours(24);
    setCourseDescSomali('');
    setCourseInstructorId(instructors[0]?.id || '');
    setCourseBadge('');
    setIsCourseModalOpen(true);
  };

  // Save Course
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const coursePayload = {
      title: courseTitle,
      title_somali: courseTitleSomali,
      slug: courseTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      level: courseLevel,
      language_from: 'German',
      language_to: 'Somali',
      short_description: courseTitle,
      short_description_somali: courseTitleSomali,
      description: courseDescSomali,
      description_somali: courseDescSomali,
      learning_outcomes: ['Fahamka naxwaha', 'Wadahadalka dhabta ah', 'Diyaarinta imtixaanka Goethe'],
      price: Number(coursePrice),
      discount_price: courseDiscountPrice ? Number(courseDiscountPrice) : undefined,
      thumbnail_url: '/assets/aistudio/05F8C6A4-5FFB-4D4A-B2E5-11DF7B585E48_8e6b0422.jpeg',
      instructor_id: courseInstructorId,
      featured: true,
      total_hours: Number(courseHours),
      total_lessons: 30,
      badge_label: courseBadge || undefined,
      certificate_included: true,
      is_published: true
    };

    try {
      if (editingCourse) {
        await fetch(`/api/courses/${editingCourse.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(coursePayload)
        });
      } else {
        await fetch('/api/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(coursePayload)
        });
      }
      setIsCourseModalOpen(false);
      onRefreshData();
    } catch (err) {
      console.error('Failed to save course', err);
    }
  };

  // Delete Course
  const handleDeleteCourse = async (id: string) => {
    if (!window.confirm('Ma hubtaa inaad tirtirto koorsadan? (Are you sure you want to delete this course?)')) return;
    try {
      await fetch(`/api/courses/${id}`, { method: 'DELETE' });
      onRefreshData();
    } catch (err) {
      console.error('Failed to delete course', err);
    }
  };

  // Save New Coupon
  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    try {
      await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newCouponCode.trim().toUpperCase(),
          discount_type: newCouponType,
          discount_value: Number(newCouponValue),
          min_order_amount: 15,
          max_uses: 500
        })
      });
      setIsCouponModalOpen(false);
      setNewCouponCode('');
      onRefreshData();
    } catch (err) {
      console.error('Failed to add coupon', err);
    }
  };

  // Process Refund
  const handleProcessRefund = async (orderId: string) => {
    setIsProcessingRefund(true);
    setRefundSuccessMsg('');

    try {
      const res = await fetch('/api/admin/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, reason: 'Codsi macmiil (Customer requested)' })
      });
      const data = await res.json();
      if (data.success) {
        setRefundSuccessMsg(data.message);
        setRefundingOrderId(null);
        onRefreshData();
      }
    } catch {
      alert('Failed to process refund');
    } finally {
      setIsProcessingRefund(false);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer_phone.includes(searchTerm) ||
      (o.transaction_ref && o.transaction_ref.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = selectedOrderStatus === 'all' || o.status === selectedOrderStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>Xafiiska Maamulka · MC ACCADAMY Control Center</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-1">
              Dashboard-ka Maamulka Koorsooyinka & Lacag-Bixinta
            </h1>
            <p className="text-xs text-slate-500">
              Maamul koorsooyinka, dhimista, dalabyada Sifalo Pay & Stripe, iyo ardayda.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenDbSchema}
              className="px-3.5 py-2 text-xs font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Supabase SQL</span>
            </button>

            <button
              onClick={handleOpenAddCourse}
              className="px-4 py-2 text-xs font-bold bg-[#0a2f24] hover:bg-[#0d3b2e] text-white rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Koorso Cusub Ku Dar</span>
            </button>
          </div>
        </div>

        {refundSuccessMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>{refundSuccessMsg}</span>
            </div>
            <button onClick={() => setRefundSuccessMsg('')} className="text-slate-400 hover:text-slate-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 4-KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2 font-medium">
              <span>Wadarta Dakhliga (Revenue)</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-slate-900 tabular-nums">${totalRevenue}</p>
            <p className="text-[11px] text-emerald-700 font-semibold mt-1">Sifalo Pay + Stripe Active</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2 font-medium">
              <span>Dalabyada Guuleystay (Orders)</span>
              <ShoppingBag className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-black text-slate-900 tabular-nums">{completedOrders.length}</p>
            <p className="text-[11px] text-slate-500 mt-1">{orders.length} Guud ahaan dalabyada</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2 font-medium">
              <span>Ardayda Is-diiwaangelisay</span>
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-2xl font-black text-slate-900 tabular-nums">{totalStudents}</p>
            <p className="text-[11px] text-slate-500 mt-1">Somalia & Diaspora</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2 font-medium">
              <span>Koorsooyinka Diyaarka ah</span>
              <TrendingUp className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 tabular-nums">{courses.length}</p>
            <p className="text-[11px] text-slate-500 mt-1">A1 ilaa B2 + Medical German</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'overview'
                ? 'bg-[#0a2f24] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Guudmar & Dakhliga (Overview)
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'courses'
                ? 'bg-[#0a2f24] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Maamulka Koorsooyinka ({courses.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'orders'
                ? 'bg-[#0a2f24] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Dalabyada & Lacagaha ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'coupons'
                ? 'bg-[#0a2f24] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Koodhadhka Dhimista ({coupons.length})
          </button>
        </div>

        {/* TAB 1: OVERVIEW & PAYMENT GATEWAY BREAKDOWN */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Payment Method Breakdown */}
            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Dakhliga loo kala qaaday Habka Lacag-Bixinta
              </h3>
              <p className="text-xs text-slate-500">
                Sifalo Pay (Somali Mobile Money) vs Stripe Card Transactions
              </p>

              <div className="space-y-3 pt-2">
                {Object.entries({
                  evc_plus: 'EVC Plus (Hormuud)',
                  zaad: 'ZAAD Service (Telesom)',
                  sahal: 'SAHAL (Golis)',
                  edahab: 'eDahab (Somtel)',
                  visa_mastercard: 'Visa / Mastercard',
                  stripe: 'Stripe International'
                }).map(([methodKey, label]) => {
                  const amount = paymentBreakdown[methodKey] || 0;
                  const percentage = totalRevenue > 0 ? Math.round((amount / totalRevenue) * 100) : 0;
                  return (
                    <div key={methodKey} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-700">{label}</span>
                        <span className="font-bold text-slate-900 tabular-nums">
                          ${amount} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions & Gateway Status */}
            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Xaaladda Albaabbada Lacag-Bixinta (Gateway Status)
              </h3>

              <div className="space-y-3">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-emerald-950">Sifalo Pay API Integration</p>
                    <p className="text-emerald-800">
                      EVC Plus, ZAAD, Sahal, eDahab & Cards ready.
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-emerald-200 text-emerald-900 font-bold rounded">
                    Active
                  </span>
                </div>

                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-indigo-950">Stripe Payment Gateway</p>
                    <p className="text-indigo-800">International cards, Apple Pay & Google Pay.</p>
                  </div>
                  <span className="px-2 py-1 bg-indigo-200 text-indigo-900 font-bold rounded">
                    Active
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">Supabase PostgreSQL Schema</p>
                    <p className="text-slate-500">8 Tables, RLS Policies, Indexes, and Triggers.</p>
                  </div>
                  <button
                    onClick={onOpenDbSchema}
                    className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 font-semibold rounded"
                  >
                    Eeg SQL
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: COURSE MANAGEMENT */}
        {activeTab === 'courses' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Maamulka Koorsooyinka (Courses)</h3>
                <p className="text-xs text-slate-500">Wax ka beddel qiimaha, heerka, sharraxaadda, ama ku dar koorso cusub.</p>
              </div>
              <button
                onClick={handleOpenAddCourse}
                className="px-3.5 py-1.5 bg-[#0a2f24] hover:bg-[#0d3b2e] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>Koorso Cusub</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="px-5 py-3">Koorsada</th>
                    <th className="px-5 py-3">Heerka</th>
                    <th className="px-5 py-3">Qiimaha</th>
                    <th className="px-5 py-3">Dhimista</th>
                    <th className="px-5 py-3">Saacadaha</th>
                    <th className="px-5 py-3">Casharrada</th>
                    <th className="px-5 py-3 text-right">Hawlaha (Actions)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {courses.map(course => (
                    <tr key={course.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-semibold text-slate-900 max-w-xs truncate">
                        {course.title_somali}
                        <span className="block text-[11px] text-slate-400 font-normal">{course.title}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="px-2 py-0.5 rounded font-bold text-emerald-800 bg-emerald-50 border border-emerald-200">
                          {course.level}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-bold tabular-nums">${course.price}</td>
                      <td className="px-5 py-3 font-bold text-emerald-700 tabular-nums">
                        {course.discount_price ? `$${course.discount_price}` : '-'}
                      </td>
                      <td className="px-5 py-3 font-mono">{course.total_hours}h</td>
                      <td className="px-5 py-3 font-mono">{course.lessons?.length || course.total_lessons}</td>
                      <td className="px-5 py-3 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditCourse(course)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                          title="Beddel"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                          title="Tirtir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS & REFUND MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Dhammaan Dalabyada & Dhaqdhaqaaqa (Transactions)</h3>
                <p className="text-xs text-slate-500">Kala shaandhee xaaladda dalabka ama soo celi lacagta (refund).</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Raadi dalab, magac, ama taleefan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />

                <select
                  value={selectedOrderStatus}
                  onChange={(e) => setSelectedOrderStatus(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-medium"
                >
                  <option value="all">Dhammaan Xaaladaha</option>
                  <option value="completed">Guuleystay (Completed)</option>
                  <option value="pending">Pending</option>
                  <option value="refunded">La Celiyay (Refunded)</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="px-5 py-3">Order Number</th>
                    <th className="px-5 py-3">Ardayga</th>
                    <th className="px-5 py-3">Taleefanka</th>
                    <th className="px-5 py-3">Koorsada</th>
                    <th className="px-5 py-3">Lacagta</th>
                    <th className="px-5 py-3">Gateway & Ref</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Hawlaha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-mono font-bold text-slate-900">{order.order_number}</td>
                      <td className="px-5 py-3 font-semibold text-slate-900">{order.customer_name}</td>
                      <td className="px-5 py-3 font-mono text-slate-600">{order.customer_phone}</td>
                      <td className="px-5 py-3 max-w-xs truncate">{order.course_title}</td>
                      <td className="px-5 py-3 font-bold tabular-nums">${order.amount}</td>
                      <td className="px-5 py-3">
                        <span className="font-bold uppercase text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          {order.payment_method.replace('_', ' ')}
                        </span>
                        <span className="block font-mono text-[10px] text-slate-400 mt-0.5 truncate max-w-[120px]">
                          {order.transaction_ref}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          order.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'refunded'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        {order.status === 'completed' && (
                          <button
                            onClick={() => handleProcessRefund(order.id)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-red-700 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
                          >
                            Refund (Soo celi)
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: COUPONS */}
        {activeTab === 'coupons' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Koodhadhka Dhimista (Discounts & Promo Codes)</h3>
                <p className="text-xs text-slate-500">Samee koodh dhimis ah oo ardaydu adeegsan karaan xilliga checkout-ka.</p>
              </div>
              <button
                onClick={() => setIsCouponModalOpen(true)}
                className="px-3.5 py-1.5 bg-[#0a2f24] hover:bg-[#0d3b2e] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>Koodh Cusub Ku Dar</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="px-5 py-3">Code</th>
                    <th className="px-5 py-3">Nooca</th>
                    <th className="px-5 py-3">Qiimaha Dhimista</th>
                    <th className="px-5 py-3">Ugu Yaraan Dalabka</th>
                    <th className="px-5 py-3">Inta La Isticmaalay</th>
                    <th className="px-5 py-3">Xaaladda</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {coupons.map(coupon => (
                    <tr key={coupon.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-mono font-bold text-emerald-800 text-sm">{coupon.code}</td>
                      <td className="px-5 py-3 capitalize">{coupon.discount_type}</td>
                      <td className="px-5 py-3 font-bold tabular-nums">
                        {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `$${coupon.discount_value}`}
                      </td>
                      <td className="px-5 py-3 tabular-nums">${coupon.min_order_amount}</td>
                      <td className="px-5 py-3 font-mono">{coupon.current_uses} / {coupon.max_uses}</td>
                      <td className="px-5 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Course Edit/Add Modal */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingCourse ? 'Wax Ka Beddel Koorsada' : 'Koorso Cusub Ku Dar'}
              </h3>
              <button onClick={() => setIsCourseModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Cinwaanka Jarmalka (English / German Title)</label>
                <input
                  type="text"
                  required
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="German A1: Complete Beginner to Goethe Certification"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Cinwaanka Af-Soomaaliga (Somali Title)</label>
                <input
                  type="text"
                  required
                  value={courseTitleSomali}
                  onChange={(e) => setCourseTitleSomali(e.target.value)}
                  placeholder="Af-Jarmalka A1: Bilow ilaa Shahaadada Goethe"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Heerka (Level)</label>
                  <select
                    value={courseLevel}
                    onChange={(e) => setCourseLevel(e.target.value as CourseLevel)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-bold"
                  >
                    <option value="A1">A1 Beginner</option>
                    <option value="A2">A2 Elementary</option>
                    <option value="B1">B1 Intermediate</option>
                    <option value="B2">B2 Upper</option>
                    <option value="Medical / Healthcare">Medical / Healthcare</option>
                    <option value="Goethe Exam Prep">Goethe Exam Prep</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Saacadaha (Hours)</label>
                  <input
                    type="number"
                    value={courseHours}
                    onChange={(e) => setCourseHours(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Qiimaha Asalka ah ($)</label>
                  <input
                    type="number"
                    required
                    value={coursePrice}
                    onChange={(e) => setCoursePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Qiimaha Dhimista ($)</label>
                  <input
                    type="number"
                    value={courseDiscountPrice || ''}
                    onChange={(e) => setCourseDiscountPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="29"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Calaamadda Gaarka ah (Badge Label)</label>
                <input
                  type="text"
                  value={courseBadge}
                  onChange={(e) => setCourseBadge(e.target.value)}
                  placeholder="Ugu Caansan (Best Seller)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sharraxaadda Af-Soomaaliga (Description)</label>
                <textarea
                  rows={3}
                  value={courseDescSomali}
                  onChange={(e) => setCourseDescSomali(e.target.value)}
                  placeholder="Koorsadan waxaad ku baranaysaa..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Ka Noqo
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0a2f24] hover:bg-[#0d3b2e] text-white font-bold rounded-xl shadow-xs"
                >
                  Keydi Koorsada
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Samee Koodh Dhimis ah</h3>
              <button onClick={() => setIsCouponModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Koodhka (Coupon Code)</label>
                <input
                  type="text"
                  required
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  placeholder="JARMAL50"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-mono uppercase font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nooca Dhimista</label>
                <select
                  value={newCouponType}
                  onChange={(e) => setNewCouponType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                >
                  <option value="percentage">Boqolkiiba (Percentage %)</option>
                  <option value="fixed">Qiimo Go'an (Fixed Amount $)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Qiimaha Dhimista</label>
                <input
                  type="number"
                  required
                  value={newCouponValue}
                  onChange={(e) => setNewCouponValue(Number(e.target.value))}
                  placeholder="50"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Ka Noqo
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0a2f24] hover:bg-[#0d3b2e] text-white font-bold rounded-xl shadow-xs"
                >
                  Samee Koodhka
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
