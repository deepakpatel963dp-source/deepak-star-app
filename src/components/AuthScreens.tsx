import React, { useState, useEffect } from 'react';
import { Mail, Lock, User as UserIcon, Phone, ArrowRight, ShieldCheck, Check, Sparkles, RefreshCw } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthScreensProps {
  onSuccess: (user: UserProfile) => void;
  onSkip?: () => void;
}

export const AuthScreens: React.FC<AuthScreensProps> = ({ onSuccess, onSkip }) => {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // OTP Countdown
  useEffect(() => {
    if (!showOtpModal || otpTimer <= 0) return;
    const interval = setInterval(() => {
      setOtpTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [showOtpModal, otpTimer]);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please fill in email and password');
      return;
    }
    // Launch OTP Verification flow
    setShowOtpModal(true);
    setOtpTimer(30);
  };

  const handleGoogleLogin = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onSuccess({
        id: `usr_${Date.now()}`,
        name: 'Google User',
        email: 'user.google@deepakstar.com',
        role: 'user',
        plan: 'free',
        credits: 20,
        status: 'active',
        createdAt: new Date().toISOString(),
      });
    }, 1000);
  };

  const handleOtpChange = (idx: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const updated = [...otpCode];
    updated[idx] = val;
    setOtpCode(updated);

    // Auto focus next input
    if (val && idx < 5) {
      const nextInput = document.getElementById(`otp-${idx + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setShowOtpModal(false);
      onSuccess({
        id: `usr_${Date.now()}`,
        name: name || (tab === 'login' ? 'Rohit Sharma' : 'New Creator'),
        email: email || 'creator@deepakstar.com',
        phone: phone || '+91 98765 43210',
        role: 'user',
        plan: 'free',
        credits: 25, // Bonus signup credits!
        status: 'active',
        createdAt: new Date().toISOString(),
      });
    }, 1200);
  };

  const handleAutoFillOtp = () => {
    setOtpCode(['7', '2', '9', '4', '1', '8']);
  };

  return (
    <div className="flex flex-col justify-between h-full w-full bg-slate-950 text-white p-6 overflow-y-auto">
      {/* Top Brand Info */}
      <div className="text-center pt-2">
        <div className="w-16 h-16 mx-auto mb-3">
          <img
            src="/src/assets/images/deepak_star_logo_1793799676824.jpg"
            alt="Logo"
            className="w-full h-full object-contain rounded-2xl shadow-lg border border-blue-500/30"
          />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-white via-sky-200 to-blue-400 bg-clip-text text-transparent">
          DEEPAK STAR APP
        </h1>
        <p className="text-[11px] text-blue-300">Sign in to access AI Studio & Cloud Saves</p>
      </div>

      {/* Auth Card */}
      <div className="my-auto py-4">
        {/* Tab switch */}
        <div className="flex p-1 bg-slate-900 rounded-xl border border-slate-800 mb-5">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              tab === 'login' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setTab('signup')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              tab === 'signup' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleAuthSubmit} className="space-y-3.5">
          {tab === 'signup' && (
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Deepak Patel"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {tab === 'signup' && (
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Mobile Number (India)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-300">Password</label>
              {tab === 'login' && (
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-[10px] text-sky-400 hover:text-sky-300"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all text-xs flex items-center justify-center gap-2 mt-4"
          >
            <span>{tab === 'login' ? 'Login with OTP Security' : 'Register & Get 25 Free Credits'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <span className="relative px-3 bg-slate-950 text-[10px] uppercase font-semibold text-slate-500">
            or continue with
          </span>
        </div>

        {/* Google One-Tap Login */}
        <button
          onClick={handleGoogleLogin}
          disabled={isVerifying}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.5 1.9 7.9l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>
      </div>

      {/* Guest / Skip Option */}
      <div className="text-center pt-2">
        <button
          onClick={onSkip}
          className="text-xs text-slate-400 hover:text-white underline underline-offset-4"
        >
          Explore as Guest (5 Free Credits)
        </button>
      </div>

      {/* 6-Digit OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-blue-500/40 p-5 shadow-2xl">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Firebase 2-Step OTP Verification</h3>
              <p className="text-xs text-slate-300 mt-1">
                Enter the 6-digit verification code sent to <span className="text-sky-400">{email || 'your email'}</span>
              </p>
            </div>

            {/* 6 Digit Input Boxes */}
            <div className="flex items-center justify-center gap-2 my-5">
              {otpCode.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="w-10 h-12 text-center text-lg font-bold bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              ))}
            </div>

            {/* Auto Fill helper for demo testing */}
            <div className="text-center mb-4">
              <button
                type="button"
                onClick={handleAutoFillOtp}
                className="text-[11px] text-sky-400 hover:underline flex items-center gap-1 mx-auto"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Auto-fill test code (729418)</span>
              </button>
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={isVerifying || otpCode.some((c) => !c)}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Verify & Proceed</span>
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
              <span>{otpTimer > 0 ? `Resend code in ${otpTimer}s` : 'Did not receive code?'}</span>
              {otpTimer <= 0 && (
                <button
                  onClick={() => setOtpTimer(30)}
                  className="text-sky-400 font-semibold hover:underline"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl">
            <h3 className="text-base font-bold text-white">Reset Password</h3>
            <p className="text-xs text-slate-400 mt-1">
              Enter your email address to receive password reset instructions.
            </p>
            {forgotSubmitted ? (
              <div className="my-4 p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300">
                Password reset link has been dispatched to {forgotEmail}. Please check your inbox.
              </div>
            ) : (
              <div className="my-4 space-y-3">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>
            )}
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotSubmitted(false);
                }}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
              {!forgotSubmitted && (
                <button
                  onClick={() => setForgotSubmitted(true)}
                  className="px-4 py-1.5 bg-blue-600 text-white font-bold rounded-lg text-xs shadow"
                >
                  Send Reset Link
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
