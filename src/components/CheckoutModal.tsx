import React, { useState } from 'react';
import { Course, PaymentMethod, PaymentGateway, Order, UserProfile } from '../types/index.ts';
import { 
  X, ShieldCheck, CheckCircle2, Phone, Mail, User, 
  CreditCard, Smartphone, Tag, ArrowRight, Loader2, AlertCircle, RefreshCw, Lock
} from 'lucide-react';

interface CheckoutModalProps {
  course: Course | null;
  currentUser: UserProfile | null;
  onClose: () => void;
  onPaymentSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  course,
  currentUser,
  onClose,
  onPaymentSuccess
}) => {
  if (!course) return null;

  // Form State
  const [customerName, setCustomerName] = useState(currentUser?.full_name || 'Yahye Hassan');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '+252615489201');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || 'yahye.hassan@example.com');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [isVerifyingCoupon, setIsVerifyingCoupon] = useState(false);

  // Gateway & Method State
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>('sifalo_pay');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('evc_plus');
  const [sandboxMode, setSandboxMode] = useState(true);

  // Flow State
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [ussdPromptState, setUssdPromptState] = useState<{
    orderId: string;
    transactionRef: string;
    ussdString: string;
    amount: number;
    phone: string;
  } | null>(null);
  const [ussdPin, setUssdPin] = useState('1234');
  const [isConfirmingPin, setIsConfirmingPin] = useState(false);

  // Price calculations
  const originalAmount = course.discount_price ?? course.price;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalAmount = Math.max(0, originalAmount - discountAmount);
  const sosAmount = Math.round(finalAmount * 650).toLocaleString();

  // Coupon handler
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsVerifyingCoupon(true);
    setCouponError('');

    try {
      const res = await fetch('/api/coupons/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim(), amount: originalAmount })
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon({
          code: data.coupon.code,
          discountAmount: data.discountAmount
        });
        setCouponError('');
      } else {
        setCouponError(data.error || 'Koodhka ma shaqeynayo');
        setAppliedCoupon(null);
      }
    } catch {
      setCouponError('Khalad ayaa dhacay intii koodhka la hubinayay');
    } finally {
      setIsVerifyingCoupon(false);
    }
  };

  // Submit Payment Initiation
  const handleInitiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerPhone || customerPhone.length < 8) {
      setErrorMsg('Fadlan geli lambarka taleefanka oo sax ah (Please enter valid phone number)');
      return;
    }

    setIsProcessing(true);

    try {
      if (selectedGateway === 'sifalo_pay') {
        const response = await fetch('/api/payments/sifalo/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            course_id: course.id,
            payment_method: selectedMethod,
            phone: customerPhone,
            customer_name: customerName,
            customer_email: customerEmail,
            user_id: currentUser?.id || 'usr-student-1',
            coupon_code: appliedCoupon?.code,
            sandbox: sandboxMode
          })
        });

        const data = await response.json();
        if (!data.success) {
          setErrorMsg(data.error || 'Payment initiation failed');
          setIsProcessing(false);
          return;
        }

        // Show USSD confirmation modal for mobile money
        if (data.is_sandbox || ['evc_plus', 'zaad', 'sahal', 'edahab'].includes(selectedMethod)) {
          setUssdPromptState({
            orderId: data.order.id,
            transactionRef: data.sifalo_reference,
            ussdString: data.ussd_prompt,
            amount: data.order.amount,
            phone: customerPhone
          });
          setIsProcessing(false);
          return;
        }

        // If live external hosted checkout
        if (data.checkout_url) {
          window.location.href = data.checkout_url;
        }
      } else {
        // Stripe integration
        const res = await fetch('/api/payments/stripe/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            course_id: course.id,
            user_id: currentUser?.id || 'usr-student-1',
            customer_email: customerEmail,
            customer_name: customerName,
            coupon_code: appliedCoupon?.code
          })
        });
        const stripeData = await res.json();
        if (stripeData.success) {
          // In test sandbox: simulate immediate Stripe approval
          handleSimulateStripeApproval(stripeData.order.id, stripeData.order.transaction_ref);
        } else {
          setErrorMsg(stripeData.error || 'Stripe initialization error');
          setIsProcessing(false);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment server connection failed');
      setIsProcessing(false);
    }
  };

  // Confirm USSD PIN & Unlock Course Access
  const handleConfirmUssdPayment = async () => {
    if (!ussdPromptState) return;
    setIsConfirmingPin(true);

    try {
      const res = await fetch('/api/payments/sifalo/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: ussdPromptState.orderId,
          transaction_ref: ussdPromptState.transactionRef,
          pin_confirmed: true
        })
      });

      const data = await res.json();
      if (data.success) {
        onPaymentSuccess(data.order);
      } else {
        setErrorMsg(data.error || 'Payment confirmation failed');
      }
    } catch {
      setErrorMsg('Khalad ayaa dhacay markii lacag-bixinta la xaqiijinayay');
    } finally {
      setIsConfirmingPin(false);
    }
  };

  const handleSimulateStripeApproval = async (orderId: string, txnRef: string) => {
    try {
      const res = await fetch('/api/payments/sifalo/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          transaction_ref: txnRef,
          pin_confirmed: true
        })
      });
      const data = await res.json();
      if (data.success) {
        onPaymentSuccess(data.order);
      }
    } catch {
      setErrorMsg('Stripe approval verification failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const somaliMethods = [
    { id: 'evc_plus', name: 'EVC Plus', provider: 'Hormuud', prefix: '61', color: 'border-emerald-600 bg-emerald-50/40' },
    { id: 'zaad', name: 'ZAAD Service', provider: 'Telesom', prefix: '63', color: 'border-amber-600 bg-amber-50/40' },
    { id: 'sahal', name: 'SAHAL', provider: 'Golis', prefix: '90', color: 'border-blue-600 bg-blue-50/40' },
    { id: 'edahab', name: 'eDahab', provider: 'Somtel', prefix: '65', color: 'border-yellow-600 bg-yellow-50/40' },
    { id: 'premier_wallet', name: 'Premier Wallet', provider: 'Premier Bank', prefix: 'All', color: 'border-purple-600 bg-purple-50/40' },
    { id: 'visa_mastercard', name: 'Visa / Mastercard', provider: 'Sifalo Gateway', prefix: 'Card', color: 'border-indigo-600 bg-indigo-50/40' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#0a2f24] text-white flex items-center justify-center font-bold text-xs">
              MC
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Bogga Lacag-Bixinta Rasmiga ah (Secure Checkout)
              </h3>
              <p className="text-[11px] text-emerald-800 font-medium">Sifalo Pay & Stripe Verified Gateway</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Order Summary Header */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                Koorsada aad iibsanayso:
              </span>
              <h4 className="text-sm font-extrabold text-slate-900">{course.title}</h4>
              <p className="text-xs text-slate-500">{course.title_somali} · {course.level} Level</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xl font-black text-slate-900 tabular-nums">${finalAmount}</span>
              <p className="text-[11px] text-slate-400 tabular-nums">~ {sosAmount} SOS</p>
            </div>
          </div>

          {/* Sandbox Indicator Banner */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Tijaabo & Live Sandbox:</strong> Sifalo Pay & Stripe API diyaar u ah hubinta.
              </span>
            </div>
            <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-bold text-amber-950">
              <input
                type="checkbox"
                checked={sandboxMode}
                onChange={(e) => setSandboxMode(e.target.checked)}
                className="rounded text-emerald-700 focus:ring-emerald-600"
              />
              <span>Sandbox Mode</span>
            </label>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Checkout Form */}
          <form onSubmit={handleInitiatePayment} className="space-y-6">
            
            {/* Student Contact Info */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                1. Xogtaada Ardayga (Student Details)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Magacaaga oo Buuxa (Full Name)
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Yahye Hassan Cali"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email-kaaga (Receipt & Login)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="student@example.com"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Taleefanka Lacag-bixinta (EVC, ZAAD, Sahal Phone)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+252 61 548 9201"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none font-mono"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Tusaale: Hormuud (+25261...), Telesom (+25263...), Golis (+25290...), Somtel (+25265...)
                  </p>
                </div>
              </div>
            </div>

            {/* Gateway Selector Tabs */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                2. Dooro Habka Lacag-Bixinta (Payment Method)
              </h4>

              {/* Gateway switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setSelectedGateway('sifalo_pay')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                    selectedGateway === 'sifalo_pay'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Sifalo Pay (Somalia)</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setSelectedGateway('stripe'); setSelectedMethod('stripe'); }}
                  className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                    selectedGateway === 'stripe'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 text-indigo-700" />
                  <span>Stripe (International Cards)</span>
                </button>
              </div>

              {/* Sifalo Pay Channel Grid */}
              {selectedGateway === 'sifalo_pay' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  {somaliMethods.map(m => {
                    const active = selectedMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedMethod(m.id as PaymentMethod)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          active
                            ? 'border-emerald-700 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-700'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-slate-900">{m.name}</span>
                          {active && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">{m.provider}</p>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs text-slate-600">
                  <p className="font-semibold text-slate-800">Stripe International Card Processing</p>
                  <p>Waxaa la aqbalaa Visa, MasterCard, American Express, Apple Pay, iyo Google Pay adduunka oo dhan.</p>
                  <div className="flex items-center gap-2 text-slate-400 text-xs pt-1">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>256-bit SSL encrypted & PCI-DSS Compliant</span>
                  </div>
                </div>
              )}
            </div>

            {/* Coupon Code Section */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700">
                Ma haysataa Koodhka Dhimista? (Coupon Code)
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Geli JARMAL50 ama SOMALIA20"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none uppercase font-mono"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={isVerifyingCoupon || !couponCode.trim()}
                  className="px-4 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
                >
                  {isVerifyingCoupon ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Codso'}
                </button>
              </div>

              {appliedCoupon && (
                <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Koodhka {appliedCoupon.code} waa sax! Waxaa lagaa jaray ${appliedCoupon.discountAmount}.</span>
                </p>
              )}
              {couponError && (
                <p className="text-xs text-red-600">{couponError}</p>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Qiimaha Koorsada (Original Price):</span>
                <span className="tabular-nums">${originalAmount}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Dhimista Koodhka ({appliedCoupon.code}):</span>
                  <span className="tabular-nums">-${appliedCoupon.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-2 border-t border-slate-200">
                <span>Wadarta Guud ee Lacagta (Total Due):</span>
                <span className="text-base text-emerald-900 tabular-nums">${finalAmount}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 bg-[#0a2f24] hover:bg-[#0d3b2e] active:scale-99 text-white font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Fadlan sug, codsigii baa diraya...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Bixi Hadda ${finalAmount} ({selectedMethod.toUpperCase()})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>

      </div>

      {/* Interactive Sifalo Pay USSD Prompt Simulation Dialog */}
      {ussdPromptState && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-slate-900 rounded-3xl p-6 text-white border border-emerald-500/40 shadow-2xl space-y-5">
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                <Smartphone className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold">Xaqiijinta Lacag-Bixinta Sifalo Pay</h3>
              <p className="text-xs text-slate-300">
                Taleefankaaga <span className="font-mono text-emerald-400">{ussdPromptState.phone}</span> waxaa loo soo diray USSD Push Prompt.
              </p>
            </div>

            {/* USSD Screen Mockup */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs space-y-2">
              <div className="text-slate-400 text-[10px]">USSD PUSH NOTIFICATION:</div>
              <div className="text-emerald-400 font-bold text-sm">
                MC ACCADAMY: Ma hubtaa inaad bixiso ${ussdPromptState.amount} ({selectedMethod.toUpperCase()})?
              </div>
              <div className="text-slate-400 text-[11px]">
                Fadlan geli PIN-kaaga si aad u fasaxdo lacag-bixinta koorsada.
              </div>
            </div>

            {/* PIN Entry */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Geli PIN-ka Taleefanka (Test PIN: 1234):
              </label>
              <input
                type="password"
                maxLength={4}
                value={ussdPin}
                onChange={(e) => setUssdPin(e.target.value)}
                className="w-full text-center tracking-[0.5em] text-lg py-2.5 bg-slate-950 border border-slate-700 rounded-xl focus:border-emerald-500 focus:outline-none font-mono"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setUssdPromptState(null)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-colors"
              >
                Ka Noqo (Cancel)
              </button>
              <button
                type="button"
                disabled={isConfirmingPin || ussdPin.length < 4}
                onClick={handleConfirmUssdPayment}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isConfirmingPin ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Xaqiijinaya...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Xaqiiji PIN ($ {ussdPromptState.amount})</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
