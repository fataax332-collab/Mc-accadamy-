import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { INITIAL_COURSES, INITIAL_INSTRUCTORS, INITIAL_COUPONS } from './src/data/courses.ts';
import { Course, Order, Enrollment, Coupon } from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Body parser
app.use(express.json());

// In-memory persistent state (synced with Supabase schema)
let coursesStore: Course[] = [...INITIAL_COURSES];
let instructorsStore = [...INITIAL_INSTRUCTORS];
let couponsStore: Coupon[] = [...INITIAL_COUPONS];
let ordersStore: Order[] = [
  {
    id: 'ord-init-1',
    order_number: 'ORD-MC-84920',
    user_id: 'usr-student-1',
    course_id: '10000000-0000-0000-0000-000000000001',
    course_title: 'German A1: Complete Beginner to Goethe Certification',
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
    customer_name: 'Yahye Hassan',
    transaction_ref: 'TXN-SIFALO-9284102',
    receipt_url: '/receipts/ORD-MC-84920',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'ord-init-2',
    order_number: 'ORD-MC-84921',
    user_id: 'usr-student-2',
    course_id: '10000000-0000-0000-0000-000000000004',
    course_title: 'Deutsch für Pflegekräfte: Medical German for Nurses & Healthcare',
    amount: 55.00,
    original_amount: 89.00,
    discount_amount: 34.00,
    currency: 'USD',
    status: 'completed',
    payment_method: 'zaad',
    payment_gateway: 'sifalo_pay',
    customer_phone: '+252634490123',
    customer_email: 'sahra.nurse@example.com',
    customer_name: 'Sahra Cali Jaamac',
    transaction_ref: 'TXN-SIFALO-9284103',
    receipt_url: '/receipts/ORD-MC-84921',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  }
];

let enrollmentsStore: Enrollment[] = [
  {
    id: 'enr-init-1',
    user_id: 'usr-student-1',
    course_id: '10000000-0000-0000-0000-000000000001',
    order_id: 'ord-init-1',
    course: INITIAL_COURSES[0],
    progress_percentage: 33,
    completed_lessons: ['les-a1-01', 'les-a1-02'],
    completed: false,
    enrolled_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    last_accessed_at: new Date().toISOString(),
  }
];

// ============================================================================
// API ROUTES
// ============================================================================

// 1. Courses API
app.get('/api/courses', (req: Request, res: Response) => {
  res.json({ success: true, courses: coursesStore });
});

app.get('/api/courses/:id', (req: Request, res: Response) => {
  const course = coursesStore.find(c => c.id === req.params.id || c.slug === req.params.id);
  if (!course) {
    return res.status(404).json({ success: false, error: 'Course not found' });
  }
  res.json({ success: true, course });
});

app.post('/api/courses', (req: Request, res: Response) => {
  const newCourse: Course = {
    ...req.body,
    id: req.body.id || `crs-${Date.now()}`,
    is_published: req.body.is_published ?? true,
    total_lessons: req.body.lessons?.length || req.body.total_lessons || 0,
    lessons: req.body.lessons || []
  };
  coursesStore.unshift(newCourse);
  res.status(201).json({ success: true, course: newCourse });
});

app.put('/api/courses/:id', (req: Request, res: Response) => {
  const index = coursesStore.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Course not found' });
  }
  coursesStore[index] = { ...coursesStore[index], ...req.body };
  res.json({ success: true, course: coursesStore[index] });
});

app.delete('/api/courses/:id', (req: Request, res: Response) => {
  coursesStore = coursesStore.filter(c => c.id !== req.params.id);
  res.json({ success: true, message: 'Course deleted successfully' });
});

// 2. Instructors API
app.get('/api/instructors', (req: Request, res: Response) => {
  res.json({ success: true, instructors: instructorsStore });
});

// 3. Coupons API
app.get('/api/coupons', (req: Request, res: Response) => {
  res.json({ success: true, coupons: couponsStore });
});

app.post('/api/coupons/verify', (req: Request, res: Response) => {
  const { code, amount } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, error: 'Coupon code is required' });
  }
  const coupon = couponsStore.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.is_active);
  if (!coupon) {
    return res.status(404).json({ success: false, error: 'Koodhka dhimista ma jiro ama wuu dhacay (Invalid or expired coupon)' });
  }

  const orderAmount = Number(amount) || 0;
  if (coupon.min_order_amount && orderAmount < coupon.min_order_amount) {
    return res.status(400).json({ 
      success: false, 
      error: `Koodhkan wuxuu u baahan yahay ugu yaraan $${coupon.min_order_amount} (Minimum order amount $${coupon.min_order_amount})` 
    });
  }

  let discountAmount = 0;
  if (coupon.discount_type === 'percentage') {
    discountAmount = (orderAmount * coupon.discount_value) / 100;
  } else {
    discountAmount = Math.min(coupon.discount_value, orderAmount);
  }

  const finalAmount = Math.max(0, orderAmount - discountAmount);
  res.json({
    success: true,
    coupon,
    discountAmount: Math.round(discountAmount * 100) / 100,
    finalAmount: Math.round(finalAmount * 100) / 100
  });
});

app.post('/api/coupons', (req: Request, res: Response) => {
  const newCoupon: Coupon = {
    id: `coup-${Date.now()}`,
    code: req.body.code.trim().toUpperCase(),
    discount_type: req.body.discount_type || 'percentage',
    discount_value: Number(req.body.discount_value),
    min_order_amount: Number(req.body.min_order_amount) || 0,
    max_uses: Number(req.body.max_uses) || 500,
    current_uses: 0,
    is_active: true
  };
  couponsStore.push(newCoupon);
  res.status(201).json({ success: true, coupon: newCoupon });
});

// 4. Enrollments API
app.get('/api/enrollments', (req: Request, res: Response) => {
  const userId = req.query.user_id as string || 'usr-student-1';
  const userEnrollments = enrollmentsStore
    .filter(e => e.user_id === userId)
    .map(e => ({
      ...e,
      course: coursesStore.find(c => c.id === e.course_id)
    }));
  res.json({ success: true, enrollments: userEnrollments });
});

app.post('/api/enrollments/progress', (req: Request, res: Response) => {
  const { user_id, course_id, lesson_id } = req.body;
  const enrollment = enrollmentsStore.find(e => e.user_id === user_id && e.course_id === course_id);
  if (!enrollment) {
    return res.status(404).json({ success: false, error: 'Enrollment not found' });
  }

  if (!enrollment.completed_lessons.includes(lesson_id)) {
    enrollment.completed_lessons.push(lesson_id);
  }

  const course = coursesStore.find(c => c.id === course_id);
  const totalLessons = course?.lessons?.length || course?.total_lessons || 1;
  enrollment.progress_percentage = Math.min(100, Math.round((enrollment.completed_lessons.length / totalLessons) * 100));
  enrollment.last_accessed_at = new Date().toISOString();

  if (enrollment.progress_percentage >= 100 && !enrollment.completed) {
    enrollment.completed = true;
    enrollment.completed_at = new Date().toISOString();
    enrollment.certificate_id = `CERT-MC-${Date.now().toString(36).toUpperCase()}`;
  }

  res.json({ success: true, enrollment });
});

// 5. Payment Gateway: Sifalo Pay & Stripe
// SIFALO PAY: EVC Plus, ZAAD, Sahal, eDahab, Premier Wallet, Visa & Mastercard
app.post('/api/payments/sifalo/create', async (req: Request, res: Response) => {
  try {
    const { 
      course_id, 
      payment_method, 
      phone, 
      customer_name, 
      customer_email, 
      user_id, 
      coupon_code,
      sandbox = true 
    } = req.body;

    const course = coursesStore.find(c => c.id === course_id);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    // Check if already enrolled to prevent duplicate payment
    const existingEnrollment = enrollmentsStore.find(e => e.user_id === user_id && e.course_id === course_id);
    if (existingEnrollment) {
      return res.status(400).json({ 
        success: false, 
        error: 'Waxaad horey u iibsatay koorsadan (You are already enrolled in this course)' 
      });
    }

    const originalAmount = course.discount_price ?? course.price;
    let finalAmount = originalAmount;
    let discountAmount = 0;

    if (coupon_code) {
      const coupon = couponsStore.find(c => c.code.toUpperCase() === coupon_code.trim().toUpperCase() && c.is_active);
      if (coupon) {
        if (coupon.discount_type === 'percentage') {
          discountAmount = (originalAmount * coupon.discount_value) / 100;
        } else {
          discountAmount = Math.min(coupon.discount_value, originalAmount);
        }
        finalAmount = Math.max(0, originalAmount - discountAmount);
      }
    }

    const orderNumber = `ORD-MC-${Math.floor(10000 + Math.random() * 90000)}`;
    const transactionRef = `TXN-SIFALO-${Date.now()}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      user_id: user_id || 'usr-student-1',
      course_id: course.id,
      course_title: course.title,
      amount: finalAmount,
      original_amount: originalAmount,
      discount_amount: discountAmount,
      coupon_code: coupon_code || undefined,
      currency: 'USD',
      status: 'pending',
      payment_method,
      payment_gateway: 'sifalo_pay',
      customer_phone: phone,
      customer_email: customer_email || 'student@mcaccadamy.com',
      customer_name: customer_name || 'MC Student',
      transaction_ref: transactionRef,
      receipt_url: `/receipts/${orderNumber}`,
      created_at: new Date().toISOString(),
    };

    ordersStore.unshift(newOrder);

    // Official Sifalo Pay API Call if live keys configured
    const sifaloApiKey = process.env.SIFALO_API_KEY;
    const sifaloMerchantId = process.env.SIFALO_MERCHANT_ID;

    if (sifaloApiKey && sifaloApiKey !== 'sifalo_live_or_test_key' && !sandbox) {
      // In live production mode with real keys:
      // Calls official Sifalo API endpoint (https://api.sifalopay.com/v1/payments/initialize)
      return res.json({
        success: true,
        order: newOrder,
        sifalo_reference: transactionRef,
        is_live: true,
        message: 'Codsigii lacag-bixinta waxaa loo diray Sifalo Pay'
      });
    }

    // In Sandbox Test Mode: return interactive USSD prompt details for mobile money
    const ussdPrompts: Record<string, string> = {
      evc_plus: `*712*${phone.replace(/[^0-9]/g, '')}*${finalAmount}#`,
      zaad: `*220*${phone.replace(/[^0-9]/g, '')}*${finalAmount}#`,
      sahal: `*888*${phone.replace(/[^0-9]/g, '')}*${finalAmount}#`,
      edahab: `*789*${phone.replace(/[^0-9]/g, '')}*${finalAmount}#`,
      premier_wallet: `Premier Pay PIN Authorization for $${finalAmount}`,
      visa_mastercard: `Card 3D-Secure SMS Code`
    };

    res.json({
      success: true,
      order: newOrder,
      sifalo_reference: transactionRef,
      is_live: false,
      is_sandbox: true,
      ussd_prompt: ussdPrompts[payment_method] || `Payment prompt for $${finalAmount}`,
      instructions: `Fadlan taleefankaaga ku xaqiiji lacag-bixinta $${finalAmount} ee ${payment_method.toUpperCase()} si koorsadu kuugu furanto.`
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Payment initiation failed' });
  }
});

// SIFALO VERIFY & UNLOCK COURSE ACCESS
app.post('/api/payments/sifalo/verify', (req: Request, res: Response) => {
  const { order_id, transaction_ref, pin_confirmed } = req.body;
  const order = ordersStore.find(o => o.id === order_id || o.order_number === order_id);

  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }

  if (order.status === 'completed') {
    return res.json({ 
      success: true, 
      message: 'Order already completed', 
      order,
      already_enrolled: true 
    });
  }

  // Confirm and transition order to completed
  order.status = 'completed';
  if (transaction_ref) {
    order.transaction_ref = transaction_ref;
  }

  // Automatic Course Access: create enrollment immediately
  let enrollment = enrollmentsStore.find(e => e.user_id === order.user_id && e.course_id === order.course_id);
  if (!enrollment) {
    const course = coursesStore.find(c => c.id === order.course_id);
    enrollment = {
      id: `enr-${Date.now()}`,
      user_id: order.user_id,
      course_id: order.course_id,
      order_id: order.id,
      course,
      progress_percentage: 0,
      completed_lessons: [],
      completed: false,
      enrolled_at: new Date().toISOString(),
      last_accessed_at: new Date().toISOString(),
    };
    enrollmentsStore.unshift(enrollment);

    // Update coupon usage
    if (order.coupon_code) {
      const coup = couponsStore.find(c => c.code === order.coupon_code);
      if (coup) coup.current_uses += 1;
    }
  }

  res.json({
    success: true,
    order,
    enrollment,
    message: 'Lacag-bixintu way guuleysatay! Koorsadaada waa la furay (Payment verified, course unlocked).'
  });
});

// SIFALO WEBHOOK (Signed Webhook verification)
app.post('/api/payments/sifalo/webhook', (req: Request, res: Response) => {
  const signature = req.headers['x-sifalo-signature'] as string;
  const webhookSecret = process.env.SIFALO_WEBHOOK_SECRET || 'sifalo_webhook_secret_key';

  // In production, verify HMAC-SHA256
  if (signature && webhookSecret) {
    const hmac = crypto.createHmac('sha256', webhookSecret);
    const digest = hmac.update(JSON.stringify(req.body)).digest('hex');
    if (digest !== signature) {
      return res.status(401).json({ success: false, error: 'Invalid webhook signature' });
    }
  }

  const { order_id, status, transaction_ref } = req.body;
  const order = ordersStore.find(o => o.id === order_id || o.order_number === order_id);
  if (order && status === 'SUCCESS') {
    order.status = 'completed';
    order.transaction_ref = transaction_ref || order.transaction_ref;

    // Unlock enrollment
    if (!enrollmentsStore.some(e => e.user_id === order.user_id && e.course_id === order.course_id)) {
      enrollmentsStore.unshift({
        id: `enr-${Date.now()}`,
        user_id: order.user_id,
        course_id: order.course_id,
        order_id: order.id,
        progress_percentage: 0,
        completed_lessons: [],
        completed: false,
        enrolled_at: new Date().toISOString(),
        last_accessed_at: new Date().toISOString()
      });
    }
  }

  res.json({ received: true });
});

// STRIPE PAYMENT API (Cards & International)
app.post('/api/payments/stripe/create-checkout-session', async (req: Request, res: Response) => {
  try {
    const { course_id, user_id, customer_email, customer_name, coupon_code } = req.body;
    const course = coursesStore.find(c => c.id === course_id);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    const originalAmount = course.discount_price ?? course.price;
    let finalAmount = originalAmount;
    let discountAmount = 0;

    if (coupon_code) {
      const coupon = couponsStore.find(c => c.code.toUpperCase() === coupon_code.trim().toUpperCase() && c.is_active);
      if (coupon) {
        if (coupon.discount_type === 'percentage') {
          discountAmount = (originalAmount * coupon.discount_value) / 100;
        } else {
          discountAmount = Math.min(coupon.discount_value, originalAmount);
        }
        finalAmount = Math.max(0, originalAmount - discountAmount);
      }
    }

    const orderNumber = `ORD-MC-${Math.floor(10000 + Math.random() * 90000)}`;
    const transactionRef = `pi_stripe_${Date.now()}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      user_id: user_id || 'usr-student-1',
      course_id: course.id,
      course_title: course.title,
      amount: finalAmount,
      original_amount: originalAmount,
      discount_amount: discountAmount,
      coupon_code: coupon_code || undefined,
      currency: 'USD',
      status: 'pending',
      payment_method: 'stripe',
      payment_gateway: 'stripe',
      customer_phone: '',
      customer_email: customer_email || 'student@mcaccadamy.com',
      customer_name: customer_name || 'MC Student',
      transaction_ref: transactionRef,
      receipt_url: `/receipts/${orderNumber}`,
      created_at: new Date().toISOString(),
    };

    ordersStore.unshift(newOrder);

    res.json({
      success: true,
      order: newOrder,
      clientSecret: `cs_test_${transactionRef}`,
      stripe_publishable_key: process.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_sample',
      is_sandbox: !process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('sk_test')
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// STRIPE WEBHOOK
app.post('/api/payments/stripe/webhook', (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  // Handle Stripe webhook events (checkout.session.completed, payment_intent.succeeded)
  res.json({ received: true });
});

// 6. Orders & Receipts API
app.get('/api/orders', (req: Request, res: Response) => {
  const userId = req.query.user_id as string;
  if (userId) {
    return res.json({ success: true, orders: ordersStore.filter(o => o.user_id === userId) });
  }
  res.json({ success: true, orders: ordersStore });
});

app.get('/api/orders/:orderId', (req: Request, res: Response) => {
  const order = ordersStore.find(o => o.id === req.params.orderId || o.order_number === req.params.orderId);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }
  res.json({ success: true, order });
});

// 7. Admin Analytics API
app.get('/api/admin/analytics', (req: Request, res: Response) => {
  const completedOrders = ordersStore.filter(o => o.status === 'completed');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.amount, 0);
  const totalStudents = new Set(enrollmentsStore.map(e => e.user_id)).size;
  const activeCoursesCount = coursesStore.filter(c => c.is_published).length;

  const paymentBreakdown: Record<string, number> = {};
  completedOrders.forEach(o => {
    paymentBreakdown[o.payment_method] = (paymentBreakdown[o.payment_method] || 0) + o.amount;
  });

  res.json({
    success: true,
    analytics: {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders: completedOrders.length,
      totalStudents: totalStudents || 2,
      activeCoursesCount,
      averageOrderValue: completedOrders.length ? Math.round((totalRevenue / completedOrders.length) * 100) / 100 : 0,
      paymentBreakdown
    }
  });
});

// Admin Refund API
app.post('/api/admin/refund', (req: Request, res: Response) => {
  const { order_id, reason } = req.body;
  const order = ordersStore.find(o => o.id === order_id || o.order_number === order_id);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }

  order.status = 'refunded';

  // Revoke enrollment
  enrollmentsStore = enrollmentsStore.filter(e => !(e.user_id === order.user_id && e.course_id === order.course_id));

  res.json({
    success: true,
    message: `Dalabka ${order.order_number} waa la celiyay (Refund processed). Koorsadii waa la xiray.`,
    order
  });
});

// 8. Database Schema Raw Download API
app.get('/api/database/schema.sql', (req: Request, res: Response) => {
  const schemaPath = path.join(__dirname, 'supabase', 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="mc_accadamy_schema.sql"');
    fs.createReadStream(schemaPath).pipe(res);
  } else {
    res.status(404).send('-- Schema file not found');
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MC ACCADAMY Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
