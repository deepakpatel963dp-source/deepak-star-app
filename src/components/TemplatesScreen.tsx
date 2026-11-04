import React, { useState } from 'react';
import { Search, Crown, Play, Filter, ArrowLeft, Sparkles, Film, Music } from 'lucide-react';
import { Template } from '../types';

interface TemplatesScreenProps {
  templates: Template[];
  initialCategory?: string;
  onBack: () => void;
  onSelectTemplate: (template: Template) => void;
}

export const TemplatesScreen: React.FC<TemplatesScreenProps> = ({
  templates,
  initialCategory,
  onBack,
  onSelectTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [searchQuery, setSearchQuery] = useState('');

  const CATEGORIES = [
    'All',
    'Birthday',
    'Wedding',
    'Love',
    'Festival',
    'Attitude',
    'Sad Status',
    'Motivation',
    'Devotional',
    'Trending Reels',
  ];

  const filtered = templates.filter((tpl) => {
    const matchesCat = selectedCategory === 'All' || tpl.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto pb-20">
      {/* Top Header */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-slate-950/90 backdrop-blur-md border-b border-blue-500/20">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            aria-label="Back"
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-bold text-white">Video Templates</h1>
        </div>
        <span className="text-[11px] font-mono text-blue-300">{filtered.length} Templates</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates, music, tags..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Category Horizontal Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid of Templates */}
        <div className="grid grid-cols-2 gap-3.5 pt-1">
          {filtered.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => onSelectTemplate(tpl)}
              className="relative rounded-2xl overflow-hidden border border-blue-500/20 bg-slate-900 shadow-xl cursor-pointer group hover:border-blue-400 transition-all"
            >
              <div className="relative aspect-[9/14] w-full overflow-hidden">
                <img
                  src={tpl.previewUrl}
                  alt={tpl.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {tpl.isPremium && (
                  <div className="absolute top-2.5 right-2.5 bg-amber-400 text-slate-950 font-bold text-[9px] px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                    <Crown className="w-2.5 h-2.5 fill-current" />
                    <span>VIP</span>
                  </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>

                <div className="absolute bottom-2.5 left-2.5 right-2.5 space-y-1">
                  <span className="text-[9px] font-bold text-sky-400 uppercase tracking-wider">
                    {tpl.category}
                  </span>
                  <h3 className="text-xs font-bold text-white leading-tight line-clamp-1">
                    {tpl.title}
                  </h3>
                  <div className="flex items-center justify-between text-[8px] text-slate-400 pt-0.5">
                    <span className="flex items-center gap-1 truncate max-w-[70%]">
                      <Music className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                      <span className="truncate">{tpl.musicName}</span>
                    </span>
                    <span>{tpl.duration}s</span>
                  </div>
                </div>
              </div>

              {/* Quick Launch CTA */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTemplate(tpl);
                }}
                className="w-full py-2 bg-blue-950 hover:bg-blue-900 text-sky-300 font-bold text-[11px] border-t border-slate-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Use This Template</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
