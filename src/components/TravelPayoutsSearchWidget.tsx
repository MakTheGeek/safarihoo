import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Plane, Calendar, Users, Search, ArrowRightLeft, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const TravelPayoutsSearchWidget: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const lastLocaleRef = useRef<string | null>(null);
  const { language } = useLanguage();
  const locale = language === 'FR' ? 'fr' : 'en';

  const t = {
    badge: language === 'FR' ? 'Comparateur de vols en direct • 700+ compagnies' : 'Live Flight Search Engine • 700+ Airlines',
    roundTrip: language === 'FR' ? 'Aller-retour' : 'Round trip',
    oneWay: language === 'FR' ? 'Aller simple' : 'One way',
    originLabel: language === 'FR' ? 'Départ' : 'From',
    originPlaceholder: language === 'FR' ? 'Paris (PAR)' : 'New York (NYC)',
    destLabel: language === 'FR' ? 'Destination' : 'To',
    destPlaceholder: language === 'FR' ? 'Tokyo, Londres, Bali...' : 'Tokyo, London, Bali...',
    datesLabel: language === 'FR' ? 'Dates' : 'Dates',
    datesPlaceholder: language === 'FR' ? 'Départ — Retour' : 'Depart — Return',
    passengersLabel: language === 'FR' ? 'Voyageurs' : 'Passengers',
    passengersPlaceholder: language === 'FR' ? '1 adulte, Éco' : '1 adult, Economy',
    searchBtn: language === 'FR' ? 'Rechercher des vols' : 'Search Flights',
    connecting: language === 'FR' ? 'Chargement instantané...' : 'Loading flight engine...',
  };

  // Immediate fallback or direct search click if user interacts before widget iframe finishes loading
  const handleImmediateSearch = useCallback(() => {
    // Try to trigger the real widget's search button if already injected
    if (containerRef.current) {
      const realBtn = containerRef.current.querySelector('button[type="submit"], input[type="submit"], .mew-search-button, button') as HTMLElement | null;
      if (realBtn) {
        realBtn.click();
        return;
      }
    }
    // Direct affiliate fallback so the user is never stuck
    const fallbackUrl = `https://www.aviasales.com/search?marker=569298&locale=${locale}`;
    window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
  }, [locale]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // If the widget is already loaded for this exact locale, preserve it without re-downloading
    if (lastLocaleRef.current === locale && container.children.length > 1) {
      setIsLoaded(true);
      window.dispatchEvent(new Event('resize'));
      return;
    }

    lastLocaleRef.current = locale;
    setIsLoaded(false);
    container.innerHTML = '';

    // Fast MutationObserver to detect widget DOM injection with zero latency
    const observer = new MutationObserver(() => {
      // Check if tpemd injected any DOM element beyond the script itself
      const hasContent = Array.from(container.children).some(
        (child) => child.tagName !== 'SCRIPT' && (child.innerHTML.trim() !== '' || child.tagName === 'IFRAME')
      );
      if (hasContent) {
        setIsLoaded(true);
        window.dispatchEvent(new Event('resize'));
      }
    });

    observer.observe(container, { childList: true, subtree: true });

    // Inject widget script
    const script = document.createElement('script');
    script.src = `https://tpemd.com/content?currency=usd&trs=429016&shmarker=569298&show_hotels=false&powered_by=false&locale=${locale}&searchUrl=www.aviasales.com%2Fsearch&primary_override=%2332a8dd&color_button=&color_icons=%230D0D0Eff&dark=%23262626&light=%23FFFFFFFf&secondary=%23FFFFFFFf&special=%23C4C4C4&color_focused=%2332a8dd&border_radius=0&no_labels=true&plain=true&promo_id=7879&campaign_id=100`;
    script.async = true;
    script.charset = 'utf-8';

    script.onload = () => {
      setIsLoaded(true);
      window.dispatchEvent(new Event('resize'));
      setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
      setTimeout(() => window.dispatchEvent(new Event('resize')), 150);
      setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
    };

    script.onerror = () => {
      setIsLoaded(true);
    };

    container.appendChild(script);

    // Fast fallback timer so skeleton doesn't hang if third-party script is slow
    const fallbackTimer = setTimeout(() => {
      setIsLoaded(true);
      window.dispatchEvent(new Event('resize'));
    }, 750);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [locale]);

  return (
    <div 
      id="travelpayouts-search-container" 
      className="w-full my-3 sm:my-4 relative z-20 select-none overflow-visible min-h-[76px] sm:min-h-[82px]"
    >
      {/* High-Fidelity Instant Skeleton / Placeholder (Visible immediately on page load, no blank delay) */}
      <div 
        onClick={handleImmediateSearch}
        className={`w-full transition-opacity duration-300 ${
          isLoaded 
            ? 'opacity-0 pointer-events-none absolute inset-0' 
            : 'opacity-100 relative'
        }`}
        role="status"
        aria-label={t.badge}
      >
        <div className="w-full rounded-2xl bg-zinc-900/90 border border-white/15 p-3 sm:p-4 backdrop-blur-xl shadow-2xl transition-all duration-300 cursor-pointer group">
          {/* Top Live Badge */}
          <div className="flex items-center justify-between gap-2 mb-2.5 px-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#32a8dd] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#32a8dd]" />
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-white/80 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#32a8dd]" />
                {t.badge}
              </span>
            </div>
            <span className="text-[10px] text-white/50 hidden sm:inline-block font-mono">
              {t.connecting}
            </span>
          </div>

          {/* Simulated Input Fields Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
            {/* Origin & Destination Pair */}
            <div className="md:col-span-5 grid grid-cols-2 gap-1.5 bg-black/40 border border-white/10 rounded-xl p-1 relative">
              <div className="flex items-center gap-2 px-3 py-2">
                <Plane className="w-4 h-4 text-[#32a8dd] flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-[9px] uppercase tracking-wider text-white/40 font-bold">{t.originLabel}</div>
                  <div className="text-xs sm:text-sm font-semibold text-white truncate">{t.originPlaceholder}</div>
                </div>
              </div>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-zinc-800 border border-white/20 flex items-center justify-center text-white/60 z-10 hidden sm:flex">
                <ArrowRightLeft className="w-3 h-3" />
              </div>
              <div className="flex items-center gap-2 px-3 py-2 border-l border-white/10">
                <Plane className="w-4 h-4 text-emerald-400 rotate-90 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-[9px] uppercase tracking-wider text-white/40 font-bold">{t.destLabel}</div>
                  <div className="text-xs sm:text-sm font-medium text-white/70 truncate">{t.destPlaceholder}</div>
                </div>
              </div>
            </div>

            {/* Dates Field */}
            <div className="md:col-span-3 flex items-center gap-2.5 px-3 py-2 bg-black/40 border border-white/10 rounded-xl">
              <Calendar className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-[9px] uppercase tracking-wider text-white/40 font-bold">{t.datesLabel}</div>
                <div className="text-xs sm:text-sm font-medium text-white/70 truncate">{t.datesPlaceholder}</div>
              </div>
            </div>

            {/* Passengers Field */}
            <div className="md:col-span-2 flex items-center gap-2 px-3 py-2 bg-black/40 border border-white/10 rounded-xl">
              <Users className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-[9px] uppercase tracking-wider text-white/40 font-bold">{t.passengersLabel}</div>
                <div className="text-xs sm:text-sm font-medium text-white/70 truncate">{t.passengersPlaceholder}</div>
              </div>
            </div>

            {/* Instant Search CTA Button */}
            <div className="md:col-span-2">
              <button
                type="button"
                className="w-full h-full min-h-[46px] rounded-xl bg-gradient-to-r from-[#32a8dd] to-blue-600 hover:from-[#2995c7] hover:to-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 group-hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                <Search className="w-4 h-4" />
                <span>{t.searchBtn}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Real Injected Travelpayouts / Aviasales Widget Container */}
      <div 
        ref={containerRef} 
        className={`w-full transition-opacity duration-300 ${
          isLoaded 
            ? 'opacity-100 relative' 
            : 'opacity-0 absolute inset-0 pointer-events-none'
        }`} 
      />
    </div>
  );
};
