import React, { useState } from 'react';
import { Sparkles, Film, Wand2, ArrowRight, Check } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'AI 3D Video Creation',
      tagline: 'Text to Video in Seconds',
      description: 'Turn your imagination into cinematic 1080p and 4K videos using advanced Gemini AI generation.',
      image: '/src/assets/images/ai_video_hero_banner_1793799678125.jpg',
      badge: 'AI Powered',
    },
    {
      title: 'Studio Video Editor',
      tagline: 'Trim • Crop • Music • Filters',
      description: 'Professional timeline editor with multi-clip merging, dynamic text animations, and 3D effects.',
      image: '/src/assets/images/reels_template_showcase_1793799678901.jpg',
      badge: 'Full Studio',
    },
    {
      title: 'Viral Templates & Status',
      tagline: 'Birthday • Wedding • Festival Reels',
      description: 'Hundreds of trending Indian festival and celebration video templates ready for 1-click export.',
      image: '/src/assets/images/deepak_star_logo_1793799676824.jpg',
      badge: 'Trending',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const slide = slides[currentSlide];

  return (
    <div className="flex flex-col justify-between h-full w-full bg-slate-950 text-white p-6 overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs font-bold text-sky-400">DEEPAK STAR APP</span>
        <button
          onClick={onComplete}
          className="text-xs text-slate-400 hover:text-white transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Slide Visual Card */}
      <div className="my-auto space-y-6">
        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-blue-500/30 shadow-2xl shadow-blue-500/20 bg-slate-900 group">
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          <div className="absolute top-3 left-3 bg-blue-600/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md">
            {slide.badge}
          </div>
        </div>

        {/* Text Info */}
        <div className="text-center space-y-2">
          <p className="text-xs uppercase font-bold text-sky-400 tracking-wider">
            {slide.tagline}
          </p>
          <h2 className="text-2xl font-extrabold text-white">{slide.title}</h2>
          <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
            {slide.description}
          </p>
        </div>
      </div>

      {/* Slide Indicators & Navigation Button */}
      <div className="space-y-4 pb-2">
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentSlide === i ? 'w-6 bg-blue-500' : 'w-2 bg-slate-700'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 hover:from-blue-500 hover:to-sky-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 text-sm"
        >
          <span>{currentSlide === slides.length - 1 ? 'Get Started' : 'Continue'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
