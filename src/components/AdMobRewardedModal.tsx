import React, { useState, useEffect } from 'react';
import { X, Play, Award, CheckCircle, ShieldAlert } from 'lucide-react';
import { AdMobConfig } from '../types';

interface AdMobRewardedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardEarned: (credits: number) => void;
  config: AdMobConfig;
}

export const AdMobRewardedModal: React.FC<AdMobRewardedModalProps> = ({
  isOpen,
  onClose,
  onRewardEarned,
  config,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(15);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [claimStatus, setClaimStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSecondsRemaining(15);
      setIsCompleted(false);
      setIsPlaying(true);
      setClaimStatus(null);
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClaimReward = async () => {
    try {
      const res = await fetch('/api/admob/claim-reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'usr_demo' }),
      });
      const data = await res.json();
      if (data.success) {
        setClaimStatus(`+${config.rewardCreditAmount} Credits Added!`);
        onRewardEarned(config.rewardCreditAmount);
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err) {
      onRewardEarned(config.rewardCreditAmount);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-blue-500/40 bg-slate-950 shadow-2xl">
        {/* Ad Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-900 to-indigo-950 border-b border-blue-500/30">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded">
              Ad
            </span>
            <span className="text-xs font-semibold text-white">Google AdMob Rewarded Video</span>
          </div>
          <div className="flex items-center gap-2">
            {!isCompleted ? (
              <span className="text-xs font-mono bg-black/40 text-blue-200 px-2 py-0.5 rounded-full border border-blue-400/30">
                Reward in {secondsRemaining}s
              </span>
            ) : (
              <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Ready!
              </span>
            )}
            <button
              onClick={() => {
                if (isCompleted || confirm('Closing early will forfeit your bonus credits. Close anyway?')) {
                  onClose();
                }
              }}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Ad Video Content Simulator */}
        <div className="relative aspect-[9/16] max-h-[380px] w-full bg-slate-900 flex flex-col items-center justify-between p-6 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-slate-900 to-indigo-950" />
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-400 via-transparent to-transparent animate-pulse" />

          {/* Top Sponsor Info */}
          <div className="relative z-10 text-center">
            <span className="text-[10px] uppercase tracking-wider text-sky-400 font-semibold">Sponsored Partner</span>
            <h3 className="text-lg font-bold text-white mt-1">Deepak Star Cloud Studio</h3>
            <p className="text-xs text-slate-300 mt-1">Next Generation AI 3D Video Rendering</p>
          </div>

          {/* Center Graphic */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center shadow-lg shadow-blue-500/30 border border-white/20">
              <Award className="w-10 h-10 text-white animate-bounce" />
            </div>
            <p className="text-sm font-semibold text-white mt-4">
              Watch 15 seconds to receive <span className="text-amber-400">+{config.rewardCreditAmount} AI Video Credits</span>
            </p>
            {/* Progress bar */}
            <div className="w-48 h-2 bg-slate-800 rounded-full mt-3 overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-amber-400 transition-all duration-1000 ease-linear"
                style={{ width: `${((15 - secondsRemaining) / 15) * 100}%` }}
              />
            </div>
          </div>

          {/* Bottom Call to Action */}
          <div className="relative z-10 w-full text-center">
            {isCompleted ? (
              <button
                onClick={handleClaimReward}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                <Award className="w-5 h-5 text-amber-300" />
                <span>{claimStatus || `Claim +${config.rewardCreditAmount} Credits Now`}</span>
              </button>
            ) : (
              <div className="py-2.5 px-4 bg-slate-800/80 rounded-xl border border-slate-700 text-slate-400 text-xs flex items-center justify-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Video must finish playing to earn reward</span>
              </div>
            )}
            <p className="text-[9px] text-slate-500 font-mono mt-2 truncate">
              Ad Unit ID: {config.testMode ? 'ca-app-pub-3940256099942544/5224354917' : config.rewardedUnitId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
