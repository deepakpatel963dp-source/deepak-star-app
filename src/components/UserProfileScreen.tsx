import React, { useState } from 'react';
import { 
  User, Crown, Zap, Award, Film, Download, CreditCard, 
  Settings, HelpCircle, FileText, Shield, LogOut, ChevronRight, X, Check, MessageSquare 
} from 'lucide-react';
import { UserProfile, Transaction, SupportTicket } from '../types';

interface UserProfileScreenProps {
  user: UserProfile;
  transactions: Transaction[];
  onOpenPremium: () => void;
  onWatchAd: () => void;
  onOpenProjects: () => void;
  onLogout: () => void;
  onAdminToggle?: () => void;
}

export const UserProfileScreen: React.FC<UserProfileScreenProps> = ({
  user,
  transactions,
  onOpenPremium,
  onWatchAd,
  onOpenProjects,
  onLogout,
  onAdminToggle,
}) => {
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState<'privacy' | 'terms' | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Support ticket form
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState(false);

  // Settings
  const [defaultQuality, setDefaultQuality] = useState('1080p');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSendTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;
    try {
      await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: ticketSubject,
          message: ticketMessage,
          userId: user.id,
          userName: user.name,
        }),
      });
      setTicketSuccess(true);
      setTimeout(() => {
        setTicketSubject('');
        setTicketMessage('');
        setTicketSuccess(false);
        setShowHelpModal(false);
      }, 1500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto pb-20">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-slate-950/90 backdrop-blur-md border-b border-blue-500/20">
        <h1 className="text-sm font-bold text-white">My Account</h1>
        {onAdminToggle && (
          <button
            onClick={onAdminToggle}
            className="text-[10px] font-bold text-sky-400 bg-blue-950/80 border border-blue-500/30 px-2 py-1 rounded-lg hover:bg-blue-900 transition-colors"
          >
            Switch to Admin Panel ⚙️
          </button>
        )}
      </div>

      <div className="p-4 space-y-5">
        {/* Profile Card */}
        <div className="relative p-5 rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 border border-blue-500/30 shadow-2xl flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 p-0.5 shadow-lg">
              <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center text-white font-extrabold text-xl">
                {user.name.charAt(0)}
              </div>
            </div>
            {user.plan !== 'free' && (
              <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow">
                <Crown className="w-3.5 h-3.5 fill-current" />
              </div>
            )}
          </div>

          <div className="flex-1 overflow-hidden">
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold text-white truncate">{user.name}</h2>
              <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.2 rounded bg-blue-500/20 text-sky-300 border border-blue-400/30">
                {user.plan}
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Deepak Star ID: #{user.id.slice(-6)}</p>
          </div>
        </div>

        {/* Credit & Membership Card */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Available Balance</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-amber-400">{user.credits}</span>
              <span className="text-xs text-slate-400 font-semibold">Credits</span>
            </div>
            <button
              onClick={onWatchAd}
              className="mt-2.5 w-full py-1.5 bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/40 text-amber-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:brightness-110"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Watch Ad (+5)</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Subscription</span>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="text-base font-bold text-white capitalize">{user.plan} Plan</span>
            </div>
            <button
              onClick={onOpenPremium}
              className="mt-2.5 w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
            >
              Upgrade VIP 👑
            </button>
          </div>
        </div>

        {/* Navigation List Items */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 divide-y divide-slate-800/80 overflow-hidden">
          <button
            onClick={onOpenProjects}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-850 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Film className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-semibold text-white">My Projects & Videos</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          <button
            onClick={() => setShowPaymentHistory(true)}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-850 transition-colors"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-white">Payment & Subscription History</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          <button
            onClick={() => setShowSettingsModal(true)}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-850 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-white">App Settings & Export Quality</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          <button
            onClick={() => setShowHelpModal(true)}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-850 transition-colors"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold text-white">Help & Support (24/7 WhatsApp)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          <button
            onClick={() => setShowLegalModal('privacy')}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-850 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-semibold text-white">Privacy Policy</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          <button
            onClick={() => setShowLegalModal('terms')}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-850 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-white">Terms & Conditions</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full py-3 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out of Deepak Star</span>
        </button>

        {/* App Version & Developer Info */}
        <div className="text-center pt-2 text-[10px] text-slate-500 space-y-0.5">
          <p className="font-semibold text-slate-400">DEEPAK STAR APP v2.5.0 (Android Production Build)</p>
          <p>Created & Maintained by Deepak Patel</p>
          <p>© 2026 Deepak Star Inc. All rights reserved.</p>
        </div>
      </div>

      {/* Payment History Modal */}
      {showPaymentHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <h3 className="text-base font-bold text-white">Payment & Billing History</h3>
              <button
                onClick={() => setShowPaymentHistory(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto space-y-2.5 flex-1 pr-1">
              {transactions.length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-6">No previous transactions found.</p>
              ) : (
                transactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-white">{txn.planName}</p>
                      <p className="text-[10px] text-slate-400">{txn.method} · {txn.id}</p>
                      <p className="text-[9px] text-slate-500">{new Date(txn.timestamp).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-emerald-400">₹{txn.amount}</p>
                      <span className="text-[9px] uppercase px-1.5 py-0.5 bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 rounded">
                        {txn.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Help & Support Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-sky-400" />
                Help & Support Center
              </h3>
              <button onClick={() => setShowHelpModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {ticketSuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white">Ticket Submitted!</h4>
                <p className="text-xs text-slate-300">
                  Deepak Patel and team will respond within 2 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendTicket} className="space-y-3">
                <div className="p-3 bg-blue-950/40 rounded-xl border border-blue-500/30 text-xs text-blue-200">
                  <p className="font-semibold">Need urgent help?</p>
                  <p className="text-[10px] text-blue-300 mt-0.5">
                    WhatsApp Support: <span className="font-mono text-white">+91 98765 00000</span>
                  </p>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Issue Subject</label>
                  <input
                    type="text"
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="E.g. Credits not added after UPI payment"
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Message Details</label>
                  <textarea
                    rows={3}
                    required
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Describe your issue or feature request..."
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
                >
                  Submit Support Ticket
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Legal & Privacy Policy Modal */}
      {showLegalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <h3 className="text-base font-bold text-white capitalize">
                {showLegalModal === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
              </h3>
              <button onClick={() => setShowLegalModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto text-xs text-slate-300 space-y-3 pr-2 leading-relaxed">
              <p>
                Welcome to <strong>DEEPAK STAR APP</strong>, owned and operated by Deepak Patel.
              </p>
              {showLegalModal === 'privacy' ? (
                <>
                  <p>
                    <strong>1. Information Collection:</strong> We collect only necessary identifiers such as email address and generation logs to provide AI video generation services and ensure account integrity.
                  </p>
                  <p>
                    <strong>2. Media Storage:</strong> Videos created via AI generation or canvas rendering remain strictly under your ownership. We do not sell user-created content or share private photos.
                  </p>
                  <p>
                    <strong>3. AdMob & Analytics:</strong> We implement Google AdMob with official privacy compliance. Personalized advertising preferences can be managed directly in Android OS settings.
                  </p>
                  <p>
                    <strong>4. Security:</strong> All API tokens and payments are processed via server-side encryption with zero frontend leak of proprietary backend keys.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>1. Acceptance of Terms:</strong> By downloading or using DEEPAK STAR APP, you agree to comply with all applicable copyright and intellectual property standards.
                  </p>
                  <p>
                    <strong>2. Subscriptions & Billing:</strong> Starter, Pro, and Premium VIP tiers provide monthly or annual AI video generation credits. Refunds are handled in accordance with Google Play Billing policies.
                  </p>
                  <p>
                    <strong>3. Content Conduct:</strong> Users are prohibited from generating malicious, illegal, or infringing content using our AI generation tools.
                  </p>
                </>
              )}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-right">
              <button
                onClick={() => setShowLegalModal(null)}
                className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* App Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-base font-bold text-white">App Settings</h3>
              <button onClick={() => setShowSettingsModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Default Export Resolution</label>
                <div className="grid grid-cols-2 gap-2">
                  {['720p', '1080p'].map((q) => (
                    <button
                      key={q}
                      onClick={() => setDefaultQuality(q)}
                      className={`p-2 rounded-lg border font-semibold ${
                        defaultQuality === q
                          ? 'bg-blue-600 border-blue-400 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {q} HD
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span>Push Notifications</span>
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  className="w-4 h-4 accent-blue-500"
                />
              </div>

              <div className="p-3 bg-blue-950/30 rounded-xl border border-blue-500/20 text-[11px] text-blue-300">
                Theme: <strong className="text-white">Premium Blue + White 3D</strong> (System Default)
              </div>
            </div>

            <button
              onClick={() => setShowSettingsModal(false)}
              className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs"
            >
              Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
