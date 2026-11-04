import React, { useEffect } from 'react';
import { Crown, Sparkles, ChevronRight } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2800);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      onClick={onFinish}
      className="relative flex flex-col items-center justify-between h-full w-full bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white p-8 cursor-pointer select-none overflow-hidden"
    >
      {/* 3D ambient lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-blue-600/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-sky-400/20 rounded-full blur-[90px] pointer-events-none" />

      {/* Top spacing */}
      <div className="pt-8" />

      {/* Center 3D Logo Lockup */}
      <div className="flex flex-col items-center text-center z-10 animate-fade-in">
        {/* Emblem */}
        <div className="relative w-36 h-36 mb-6">
          <img
            src="/src/assets/images/deepak_star_logo_1793799676824.jpg"
            alt="DEEPAK STAR APP"
            className="w-full h-full object-contain rounded-3xl shadow-2xl shadow-blue-500/40 border border-blue-400/40 transform hover:scale-105 transition-transform"
          />
        </div>

        {/* Brand Name */}
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-sky-200 to-blue-400 bg-clip-text text-transparent drop-shadow-md">
          DEEPAK STAR APP
        </h1>

        {/* Tagline */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs uppercase tracking-widest text-sky-400 font-bold">
            Create • Edit • Share
          </span>
        </div>

        {/* Royal Crown Badge */}
        <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/40 border border-blue-400/30 text-xs text-blue-200">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span>Professional AI Video Creator</span>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="flex flex-col items-center gap-3 z-10">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span>Owner:</span>
          <span className="text-white font-semibold">Deepak Patel</span>
        </div>
        <p className="text-[10px] text-slate-500 tracking-wider">TAP ANYWHERE TO START</p>
      </div>
    </div>
  );
};
