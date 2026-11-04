import React, { useState } from 'react';
import { X, Check, Crown, Zap, ShieldCheck, QrCode, ArrowRight, Sparkles } from 'lucide-react';
import { PLANS } from '../data/initialData';
import { SubscriptionPlan } from '../types';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newPlan: 'free' | 'starter' | 'pro' | 'premium', addedCredits: number) => void;
  currentPlan: string;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentPlan,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('pro');
  const [checkoutStep, setCheckoutStep] = useState<'select' | 'payment' | 'success'>('select');
  const [selectedUpiMethod, setSelectedUpiMethod] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('gpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionData, setTransactionData] = useState<any>(null);

  if (!isOpen) return null;

  const currentPlanObj = PLANS.find((p) => p.id === selectedPlanId) || PLANS[2];
  const price = billingCycle === 'yearly' ? currentPlanObj.price * 10 : currentPlanObj.price;

  const handleStartPayment = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlanId,
          billingCycle,
          userId: 'usr_demo',
        }),
      });
      const order = await res.json();
      setTransactionData(order);
      setCheckoutStep('payment');
    } catch (err) {
      console.error(err);
      setCheckoutStep('payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyPayment = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: transactionData?.orderId || `ord_${Date.now()}`,
          paymentId: `pay_${Date.now()}_upi`,
          signature: 'sig_verified_mock_991823',
          planId: selectedPlanId,
          method: `UPI (${selectedUpiMethod.toUpperCase()})`,
          userId: 'usr_demo',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCheckoutStep('success');
        onSuccess(data.newPlan, currentPlanObj.credits);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-blue-500/30 shadow-2xl overflow-hidden my-6">
        {/* Header glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-blue-600/30 blur-3xl pointer-events-none" />

        {/* Modal Top Bar */}
        <div className="relative flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 shadow-md">
              <Crown className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                DEEPAK STAR VIP MEMBERSHIP
              </h2>
              <p className="text-xs text-blue-300/80">Supercharge your AI Video Creation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {checkoutStep === 'select' && (
            <div>
              {/* Billing Cycle Switcher */}
              <div className="flex items-center justify-center mb-6">
                <div className="inline-flex p-1 bg-slate-950 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      billingCycle === 'monthly'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Monthly Billing
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                      billingCycle === 'yearly'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>Yearly (Save 20%)</span>
                    <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.2 rounded">
                      2 Mo Free
                    </span>
                  </button>
                </div>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PLANS.filter((p) => p.id !== 'free').map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
                  const displayPrice = billingCycle === 'yearly' ? plan.price * 10 : plan.price;

                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`relative cursor-pointer rounded-2xl p-5 transition-all border ${
                        isSelected
                          ? 'bg-gradient-to-b from-blue-900/40 to-slate-900 border-blue-400 shadow-xl shadow-blue-500/10 scale-[1.02]'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {plan.id === 'pro' && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-sky-400 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md">
                          MOST POPULAR
                        </div>
                      )}
                      {plan.id === 'premium' && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-300 text-slate-950 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md">
                          BEST VALUE
                        </div>
                      )}

                      <h3 className="text-base font-bold text-white mt-1">{plan.name}</h3>
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-2xl font-extrabold text-white">₹{displayPrice}</span>
                        <span className="text-xs text-slate-400">/{billingCycle === 'yearly' ? 'yr' : 'mo'}</span>
                      </div>

                      <div className="my-4 pt-3 border-t border-slate-800/80">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-300 mb-3">
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          <span>{plan.credits} AI Video Credits</span>
                        </div>
                        <ul className="space-y-2">
                          {plan.features.map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                              <Check className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-all ${
                          isSelected
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {isSelected ? 'Selected Plan' : 'Choose Plan'}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Secure guarantee badge */}
              <div className="mt-6 flex items-center justify-between p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Secure Payments via UPI, Cards & Google Play Billing</span>
                </div>
                <button
                  onClick={handleStartPayment}
                  disabled={isProcessing}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 shrink-0"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {checkoutStep === 'payment' && (
            <div className="max-w-md mx-auto">
              <div className="text-center mb-6">
                <span className="text-xs text-blue-400 uppercase tracking-wider font-semibold">Payment Gateway</span>
                <h3 className="text-xl font-bold text-white mt-1">Pay ₹{price} for {currentPlanObj.name}</h3>
                <p className="text-xs text-slate-400 mt-1">Merchant: Deepak Patel (DEEPAK STAR APP)</p>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <label
                  onClick={() => setSelectedUpiMethod('gpay')}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedUpiMethod === 'gpay'
                      ? 'bg-blue-950/40 border-blue-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-blue-400 text-xs">
                      GPay
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Google Pay UPI</p>
                      <p className="text-xs text-slate-400">Instant UPI payment on mobile</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="upi"
                    checked={selectedUpiMethod === 'gpay'}
                    onChange={() => setSelectedUpiMethod('gpay')}
                    className="accent-blue-500"
                  />
                </label>

                <label
                  onClick={() => setSelectedUpiMethod('phonepe')}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedUpiMethod === 'phonepe'
                      ? 'bg-blue-950/40 border-blue-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-900/60 flex items-center justify-center font-bold text-purple-300 text-xs">
                      Pe
                    </div>
                    <div>
                      <p className="text-sm font-semibold">PhonePe UPI</p>
                      <p className="text-xs text-slate-400">Scan or direct app redirect</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="upi"
                    checked={selectedUpiMethod === 'phonepe'}
                    onChange={() => setSelectedUpiMethod('phonepe')}
                    className="accent-blue-500"
                  />
                </label>

                <label
                  onClick={() => setSelectedUpiMethod('paytm')}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedUpiMethod === 'paytm'
                      ? 'bg-blue-950/40 border-blue-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-sky-900/60 flex items-center justify-center font-bold text-sky-300 text-xs">
                      Paytm
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Paytm UPI / Wallet</p>
                      <p className="text-xs text-slate-400">Fast 1-tap UPI verification</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="upi"
                    checked={selectedUpiMethod === 'paytm'}
                    onChange={() => setSelectedUpiMethod('paytm')}
                    className="accent-blue-500"
                  />
                </label>

                <label
                  onClick={() => setSelectedUpiMethod('qr')}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedUpiMethod === 'qr'
                      ? 'bg-blue-950/40 border-blue-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-900/60 flex items-center justify-center font-bold text-amber-300 text-xs">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Dynamic UPI QR Code</p>
                      <p className="text-xs text-slate-400">Scan with any Indian banking app</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="upi"
                    checked={selectedUpiMethod === 'qr'}
                    onChange={() => setSelectedUpiMethod('qr')}
                    className="accent-blue-500"
                  />
                </label>
              </div>

              {selectedUpiMethod === 'qr' && (
                <div className="my-4 p-4 bg-white rounded-2xl flex flex-col items-center justify-center shadow-inner">
                  <div className="w-40 h-40 bg-slate-100 rounded-xl border-4 border-slate-900 flex items-center justify-center p-2 relative">
                    <div className="grid grid-cols-6 gap-1 w-full h-full opacity-80">
                      {Array.from({ length: 36 }).map((_, i) => (
                        <div
                          key={i}
                          className={`rounded-xs ${
                            (i % 2 === 0 && i % 3 === 0) || i < 6 || i > 30 ? 'bg-black' : 'bg-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-blue-600 text-white font-bold text-[9px] px-2 py-0.5 rounded shadow">
                        DEEPAK STAR
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 font-bold mt-2">deepakstar@upi</p>
                  <p className="text-[10px] text-slate-500">Scan & Pay ₹{price}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={() => setCheckoutStep('select')}
                  className="px-4 py-3 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleVerifyPayment}
                  disabled={isProcessing}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <span>Verifying with Server...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Complete ₹{price} Payment</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {checkoutStep === 'success' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4 animate-bounce">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Payment Verified Successfully!</h3>
              <p className="text-sm text-slate-300 mt-2">
                Your <span className="text-sky-400 font-semibold">{currentPlanObj.name}</span> is now active.
              </p>
              <div className="mt-4 p-4 bg-slate-950 rounded-xl border border-slate-800 inline-block text-left text-xs space-y-1">
                <p className="text-slate-400">
                  Transaction ID: <span className="text-white font-mono">txn_{Date.now().toString().slice(-6)}</span>
                </p>
                <p className="text-slate-400">
                  Credits Credited: <span className="text-amber-400 font-bold">+{currentPlanObj.credits} AI Credits</span>
                </p>
                <p className="text-slate-400">
                  Receipt: <span className="text-blue-400 underline cursor-pointer">Download Invoice (GST)</span>
                </p>
              </div>
              <div className="mt-6">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg"
                >
                  Start Creating AI Videos
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
