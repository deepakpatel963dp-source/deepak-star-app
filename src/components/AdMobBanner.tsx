import React, { useState } from 'react';
import { Sparkles, X, ExternalLink } from 'lucide-react';
import { AdMobConfig } from '../types';

interface AdMobBannerProps {
  config: AdMobConfig;
  userPlan: string;
  onAdClick?: () => void;
}

export const AdMobBanner: React.FC<AdMobBannerProps> = ({ config, userPlan, onAdClick }) => {
  const [closed, setClosed] = useState(false);

  // Premium / Pro users have ad-free experience
  if (userPlan === 'pro' || userPlan === 'premium' || !config.bannerEnabled || closed) {
    return null;
  }

  return (
    <div className="w-full bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-t border-blue-500/30 px-3 py-2 shrink-0">
      <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="bg-amber-500/20 text-amber-300 text-[9px] font-bold px-1.5 py-0.5 rounded border border-amber-500/30 shrink-0">
            Ad · Test
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-white truncate">
              Upgrade to Deepak Star VIP 👑
            </p>
            <p className="text-[10px] text-blue-200/70 truncate">
              Unlock 4K Export, 500 Credits & Ad-Free Video Creation
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onAdClick}
            className="px-2.5 py-1 text-[11px] font-medium bg-blue-600 hover:bg-blue-500 text-white rounded shadow-sm transition-colors flex items-center gap-1"
          >
            <span>Learn</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </button>
          <button
            onClick={() => setClosed(true)}
            aria-label="Close ad"
            className="p-1 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <p className="text-[8px] text-slate-500 text-center mt-0.5 font-mono">
        AdMob Unit: {config.testMode ? 'ca-app-pub-3940256099942544/6300978111' : config.bannerUnitId}
      </p>
    </div>
  );
};
