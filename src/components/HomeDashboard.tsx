import React, { useState } from 'react';
import { 
  Search, Sparkles, Film, Image as ImageIcon, Video, Music, 
  Crown, Play, Award, Zap, Heart, Cake, Gift, Flame, ChevronRight, Sliders, Layers 
} from 'lucide-react';
import { Template, EditorProject } from '../types';

interface HomeDashboardProps {
  templates: Template[];
  userCredits: number;
  userPlan: string;
  onOpenAiCreator: (initialMode?: 'text' | 'image' | 'animation') => void;
  onOpenEditor: (project?: EditorProject) => void;
  onOpenTemplates: (category?: string) => void;
  onOpenProjects: () => void;
  onOpenPremium: () => void;
  onWatchAd: () => void;
  onSelectTemplate: (template: Template) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  templates,
  userCredits,
  userPlan,
  onOpenAiCreator,
  onOpenEditor,
  onOpenTemplates,
  onOpenProjects,
  onOpenPremium,
  onWatchAd,
  onSelectTemplate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // 12 3D Feature Cards
  const FEATURE_CARDS = [
    {
      id: 'ai_video',
      title: 'AI Video Creator',
      subtitle: 'Text to Cinematic 3D',
      icon: Sparkles,
      color: 'from-blue-600 to-indigo-600',
      action: () => onOpenAiCreator('text'),
      badge: 'HOT',
    },
    {
      id: 'photo_to_video',
      title: 'Photo to Video',
      subtitle: 'Animate Still Photos',
      icon: ImageIcon,
      color: 'from-sky-500 to-blue-600',
      action: () => onOpenAiCreator('image'),
      badge: '3D',
    },
    {
      id: 'text_to_video',
      title: 'Text to Video',
      subtitle: 'Scripts into Visuals',
      icon: Film,
      color: 'from-indigo-600 to-violet-700',
      action: () => onOpenAiCreator('text'),
    },
    {
      id: 'ai_photo_editor',
      title: 'AI Photo Editor',
      subtitle: 'Enhance & Retouch',
      icon: Sliders,
      color: 'from-cyan-500 to-blue-600',
      action: () => onOpenEditor(),
    },
    {
      id: 'reels_maker',
      title: 'Reels Maker',
      subtitle: '9:16 Viral Videos',
      icon: Video,
      color: 'from-fuchsia-600 to-pink-600',
      action: () => onOpenTemplates('Trending Reels'),
      badge: 'TREND',
    },
    {
      id: 'status_maker',
      title: 'WhatsApp Status',
      subtitle: '30s HD Clips',
      icon: Zap,
      color: 'from-emerald-500 to-teal-600',
      action: () => onOpenTemplates('Attitude'),
    },
    {
      id: 'birthday_maker',
      title: 'Birthday Video Maker',
      subtitle: 'Name & Cake 3D',
      icon: Cake,
      color: 'from-amber-500 to-orange-600',
      action: () => onOpenTemplates('Birthday'),
      badge: 'POPULAR',
    },
    {
      id: 'wedding_maker',
      title: 'Wedding Video Maker',
      subtitle: 'Royal Shaadi Reels',
      icon: Heart,
      color: 'from-rose-500 to-pink-600',
      action: () => onOpenTemplates('Wedding'),
    },
    {
      id: 'festival_maker',
      title: 'Festival Video Maker',
      subtitle: 'Diwali, Holi & Eid',
      icon: Gift,
      color: 'from-yellow-500 to-amber-600',
      action: () => onOpenTemplates('Festival'),
    },
    {
      id: 'templates',
      title: 'Video Templates',
      subtitle: '100+ Ready Layouts',
      icon: Layers,
      color: 'from-blue-700 to-sky-700',
      action: () => onOpenTemplates(),
    },
    {
      id: 'music_effects',
      title: 'Music & Effects',
      subtitle: 'BGM & Soundtracks',
      icon: Music,
      color: 'from-purple-600 to-indigo-600',
      action: () => onOpenEditor(),
    },
    {
      id: 'my_projects',
      title: 'My Projects',
      subtitle: 'Saved Drafts & HD',
      icon: Film,
      color: 'from-slate-700 to-slate-900',
      action: () => onOpenProjects(),
    },
  ];

  // Filter templates by search
  const filteredTemplates = templates.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto pb-20">
      {/* Top Bar with Brand & Credits */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-slate-950/90 backdrop-blur-md border-b border-blue-500/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl overflow-hidden border border-blue-400/40 shadow-sm">
            <img
              src="/src/assets/images/deepak_star_logo_1793799676824.jpg"
              alt="Deepak Star"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="text-xs font-black tracking-tight bg-gradient-to-r from-white via-sky-200 to-blue-400 bg-clip-text text-transparent">
              DEEPAK STAR
            </span>
            <p className="text-[9px] text-blue-300/80 -mt-0.5">Create • Edit • Share</p>
          </div>
        </div>

        {/* Credit chip & Watch ad trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={onWatchAd}
            className="px-2.5 py-1 bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/40 text-amber-300 rounded-full text-[11px] font-bold flex items-center gap-1 hover:brightness-110 transition-all shadow-sm"
          >
            <Award className="w-3.5 h-3.5 fill-current" />
            <span>+5 Credits</span>
          </button>
          <div className="bg-blue-950/80 border border-blue-500/30 px-2.5 py-1 rounded-full text-xs font-bold text-sky-300 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 fill-current text-amber-400" />
            <span>{userCredits}</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates (e.g. Birthday, Wedding, Shaadi)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
          />
        </div>

        {/* Premium VIP Membership Banner */}
        <div
          onClick={onOpenPremium}
          className="relative rounded-3xl p-5 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-blue-400/30 shadow-2xl overflow-hidden cursor-pointer group hover:border-blue-300 transition-all"
        >
          {/* Subtle background glow */}
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
          <div className="flex items-center justify-between relative z-10">
            <div className="space-y-1.5 max-w-[70%]">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px]">
                <Crown className="w-3 h-3 fill-current" />
                <span>DEEPAK STAR VIP</span>
              </div>
              <h2 className="text-base font-extrabold text-white leading-tight">
                Get Unlimited 4K AI Videos & Zero Ads
              </h2>
              <p className="text-[11px] text-blue-200/80">
                Unlock 500+ credits, VIP Bollywood templates & instant priority.
              </p>
              <div className="pt-1 flex items-center gap-2">
                <span className="text-xs font-bold text-amber-300">Starts at ₹49/mo</span>
                <span className="text-[10px] text-slate-400">· Cancel anytime</span>
              </div>
            </div>

            <div className="flex flex-col items-center shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:rotate-6 transition-transform">
                <Crown className="w-8 h-8 fill-current" />
              </div>
              <span className="text-[10px] font-bold text-sky-300 mt-1 flex items-center">
                Upgrade <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>

        {/* 12 3D Feature Cards Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-400" />
              Video Creation Tools
            </h2>
            <span className="text-[11px] text-slate-400 font-medium">12 Tools Available</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
            {FEATURE_CARDS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="relative flex flex-col items-center text-center p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-400/50 hover:bg-slate-850 hover:-translate-y-1 transition-all duration-200 group shadow-md"
                >
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-1 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-[8px] px-1.5 py-0.2 rounded-full shadow">
                      {item.badge}
                    </span>
                  )}
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform mb-2`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-white leading-snug line-clamp-1">
                    {item.title}
                  </span>
                  <span className="text-[9px] text-slate-400 mt-0.5 line-clamp-1">
                    {item.subtitle}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured 3D Video Templates Carousel */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-white">Featured 3D Templates</h2>
              <p className="text-[10px] text-slate-400">Ready to customize with your photos</p>
            </div>
            <button
              onClick={() => onOpenTemplates()}
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
            {filteredTemplates.map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => onSelectTemplate(tpl)}
                className="relative w-36 shrink-0 rounded-2xl overflow-hidden border border-blue-500/20 bg-slate-900 shadow-lg cursor-pointer group hover:border-blue-400 transition-all"
              >
                <div className="relative aspect-[9/14] w-full overflow-hidden">
                  <img
                    src={tpl.previewUrl}
                    alt={tpl.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  {tpl.isPremium && (
                    <div className="absolute top-2 right-2 bg-amber-400 text-slate-950 p-1 rounded-md shadow">
                      <Crown className="w-3 h-3 fill-current" />
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 right-2">
                    <span className="text-[9px] font-semibold text-sky-300 uppercase tracking-wider block">
                      {tpl.category}
                    </span>
                    <h3 className="text-xs font-bold text-white leading-tight line-clamp-1">
                      {tpl.title}
                    </h3>
                    <p className="text-[8px] text-slate-400 mt-0.5">{tpl.duration}s · {tpl.views.toLocaleString()} uses</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Viral Reels Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              Trending Status & Reels
            </h2>
            <span className="text-[10px] text-slate-400">Updated Hourly</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {filteredTemplates.slice(0, 4).map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => onSelectTemplate(tpl)}
                className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 cursor-pointer transition-all flex items-center gap-3"
              >
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-blue-400/20">
                  <img src={tpl.previewUrl} alt={tpl.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white fill-current opacity-80" />
                  </div>
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-xs font-bold text-white truncate">{tpl.title}</h3>
                  <p className="text-[10px] text-sky-400 mt-0.5">{tpl.category}</p>
                  <p className="text-[9px] text-slate-500 truncate">{tpl.musicName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
