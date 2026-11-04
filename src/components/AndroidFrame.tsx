import React from 'react';
import { 
  Home, Layers, PlusCircle, Film, User, Wifi, BatteryCharging, 
  Signal, Smartphone, Monitor, ShieldCheck, Sparkles 
} from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  activeTab: 'home' | 'templates' | 'creator' | 'editor' | 'projects' | 'profile';
  onTabChange: (tab: 'home' | 'templates' | 'creator' | 'projects' | 'profile') => void;
  isDeviceMode: boolean;
  onToggleDeviceMode: () => void;
  onAdminClick: () => void;
  userCredits: number;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  activeTab,
  onTabChange,
  isDeviceMode,
  onToggleDeviceMode,
  onAdminClick,
  userCredits,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-start text-slate-100">
      {/* Top Universal AI Studio Control Bar */}
      <div className="w-full bg-slate-900/90 border-b border-blue-500/20 px-4 py-2 flex items-center justify-between text-xs z-40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-white tracking-wide">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="font-heading">DEEPAK STAR APP</span>
          </div>
          <span className="text-slate-500">|</span>
          <span className="text-[11px] text-sky-300 hidden sm:inline">Owner: Deepak Patel</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Viewport switch: Mobile Device Frame vs Wide App */}
          <button
            onClick={onToggleDeviceMode}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
            title="Toggle Android Device Frame vs Fullscreen Web View"
          >
            {isDeviceMode ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Wide View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Phone Frame</span>
              </>
            )}
          </button>

          {/* Admin Panel Quick Switch */}
          <button
            onClick={onAdminClick}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>Admin Console</span>
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className={`w-full flex justify-center items-center ${isDeviceMode ? 'py-4 sm:py-8' : ''}`}>
        {isDeviceMode ? (
          /* Realistic 3D Android Smartphone Shell */
          <div className="relative w-[385px] sm:w-[410px] h-[830px] rounded-[48px] bg-slate-900 border-[8px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(37,99,235,0.35)] flex flex-col overflow-hidden ring-1 ring-blue-500/30">
            {/* Top Speaker Grill & Camera Punch hole */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-950 rounded-full z-40 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
            </div>

            {/* Android Status Bar */}
            <div className="w-full px-7 pt-2.5 pb-1 flex items-center justify-between text-[11px] font-semibold text-slate-200 z-30 select-none bg-slate-950">
              <span>9:41</span>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>

            {/* Android Screen Body */}
            <div className="flex-1 w-full overflow-hidden relative flex flex-col bg-slate-950">
              {children}
            </div>

            {/* Android Fixed Bottom Navigation Bar */}
            <div className="w-full bg-slate-950/95 border-t border-slate-800/80 px-2 py-1.5 grid grid-cols-5 items-center z-30 backdrop-blur-md">
              <button
                onClick={() => onTabChange('home')}
                className={`flex flex-col items-center py-1 transition-colors ${
                  activeTab === 'home' ? 'text-blue-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="text-[10px] font-medium mt-0.5">Home</span>
              </button>

              <button
                onClick={() => onTabChange('templates')}
                className={`flex flex-col items-center py-1 transition-colors ${
                  activeTab === 'templates' ? 'text-blue-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-5 h-5" />
                <span className="text-[10px] font-medium mt-0.5">Templates</span>
              </button>

              {/* Center Floating Create AI Button */}
              <button
                onClick={() => onTabChange('creator')}
                className="flex flex-col items-center py-0.5 -mt-3 group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/40 border-2 border-slate-950 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 text-amber-200" />
                </div>
                <span className="text-[10px] font-bold text-sky-400 mt-0.5">Create</span>
              </button>

              <button
                onClick={() => onTabChange('projects')}
                className={`flex flex-col items-center py-1 transition-colors ${
                  activeTab === 'projects' ? 'text-blue-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Film className="w-5 h-5" />
                <span className="text-[10px] font-medium mt-0.5">Projects</span>
              </button>

              <button
                onClick={() => onTabChange('profile')}
                className={`flex flex-col items-center py-1 transition-colors ${
                  activeTab === 'profile' ? 'text-blue-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="text-[10px] font-medium mt-0.5">Profile</span>
              </button>
            </div>

            {/* Android Navigation Gesture Bar */}
            <div className="w-full bg-slate-950 py-1 flex justify-center">
              <div className="w-28 h-1 bg-slate-700 rounded-full" />
            </div>
          </div>
        ) : (
          /* Wide Responsive Viewport Layout */
          <div className="w-full max-w-4xl min-h-[850px] bg-slate-950 rounded-2xl border border-blue-500/20 shadow-2xl flex flex-col overflow-hidden my-4">
            <div className="flex-1 w-full flex flex-col relative">{children}</div>

            {/* Bottom Nav Bar for Wide Layout */}
            <div className="w-full bg-slate-950 border-t border-slate-800 px-6 py-2.5 flex items-center justify-around z-30">
              <button
                onClick={() => onTabChange('home')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === 'home' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home Dashboard</span>
              </button>

              <button
                onClick={() => onTabChange('templates')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === 'templates' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Video Templates</span>
              </button>

              <button
                onClick={() => onTabChange('creator')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-lg shadow-blue-500/30 hover:brightness-110"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>AI Video Creator</span>
              </button>

              <button
                onClick={() => onTabChange('projects')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === 'projects' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Film className="w-4 h-4" />
                <span>My Projects</span>
              </button>

              <button
                onClick={() => onTabChange('profile')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === 'profile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-4 h-4" />
                <span>User Account</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
