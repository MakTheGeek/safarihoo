import React from 'react';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeroHeadingProps {
  title?: React.ReactNode;
  subtitle?: string;
  badgeText?: string;
  showActions?: boolean;
  onStartJourney?: () => void;
  onViewDestinations?: () => void;
}

export const HeroHeading: React.FC<HeroHeadingProps> = ({
  title,
  subtitle,
  badgeText,
  showActions = true,
  onStartJourney,
  onViewDestinations,
}) => {
  const { language, t } = useLanguage();

  const finalBadge = badgeText || t('hero.badge');
  const finalTitle = title || (
    <>
      {t('hero.title.line1')}<br />
      {t('hero.title.line2')}
    </>
  );
  const finalSubtitle = subtitle || t('hero.subtitle');

  return (
    <div id="hero-heading-section" className="text-center max-w-4xl mx-auto px-4 pt-6 pb-8 md:pt-10 md:pb-10 flex flex-col items-center select-none">
      {/* AI Planner Pill Tag */}
      <div 
        id="ai-planner-pill"
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md mb-6 hover:border-white/40 transition-colors cursor-default"
      >
        <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
        <span className="text-xs font-semibold tracking-wider text-white uppercase">
          {finalBadge}
        </span>
      </div>

      {/* Main Headline */}
      <h1 
        id="hero-title"
        className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-extrabold text-white tracking-tight leading-[1.1] mb-5 drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]"
      >
        {finalTitle}
      </h1>

      {/* Subtitle */}
      <p 
        id="hero-subtitle"
        className="text-base sm:text-lg md:text-xl text-white font-medium max-w-2xl mx-auto leading-relaxed mb-8 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
      >
        {finalSubtitle}
      </p>

      {/* Action Buttons */}
      {showActions && (
        <div id="hero-cta-buttons" className="flex flex-wrap items-center justify-center gap-4">
          {/* Primary Action Button */}
          <button
            id="btn-start-journey"
            onClick={onStartJourney}
            className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-white hover:bg-white/90 active:scale-[0.98] text-black font-semibold text-sm md:text-base shadow-lg shadow-white/10 transition-all cursor-pointer"
          >
            <span>{t('hero.btn.start')}</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>

          {/* Secondary Action Button */}
          <button
            id="btn-view-destinations"
            onClick={onViewDestinations}
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full border border-white/30 hover:border-white/60 bg-white/[0.04] hover:bg-white/[0.08] active:scale-[0.98] text-white font-medium text-sm md:text-base backdrop-blur-sm transition-all cursor-pointer"
          >
            <Compass className="w-4 h-4 text-white" />
            <span>{t('hero.btn.destinations')}</span>
            <ArrowRight className="w-4 h-4 opacity-70" />
          </button>
        </div>
      )}
    </div>
  );
};

