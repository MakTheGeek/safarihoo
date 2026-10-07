import React, { useEffect, useRef, useState } from 'react';
import { PlaneTakeoff, PlaneLanding, ArrowLeftRight, Calendar, Users, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const TravelPayoutsSearchWidget: React.FC = () => {
  const frContainerRef = useRef<HTMLDivElement>(null);
  const enContainerRef = useRef<HTMLDivElement>(null);

  const frInitializedRef = useRef(false);
  const enInitializedRef = useRef(false);

  const [isWidgetLoaded, setIsWidgetLoaded] = useState(false);

  const { language } = useLanguage();
  const isFr = language === 'FR';

  const initWidget = (container: HTMLDivElement, locale: 'fr' | 'en') => {
    container.innerHTML = '';

    // Official TravelPayouts / Aviasales 7879 script
    const script = document.createElement('script');
    script.src = `https://tpemd.com/content?currency=usd&trs=429016&shmarker=569298&show_hotels=false&powered_by=false&locale=${locale}&searchUrl=www.aviasales.com%2Fsearch&primary_override=%2332a8dd&color_button=&color_icons=%230D0D0Eff&dark=%23262626&light=%23FFFFFFFf&secondary=%23FFFFFFFf&special=%23C4C4C4&color_focused=%2332a8dd&border_radius=0&no_labels=true&plain=true&promo_id=7879&campaign_id=100`;
    script.async = true;
    script.charset = 'utf-8';
    script.setAttribute('fetchpriority', 'high');

    // Observer to detect when TravelPayouts custom element tp-cascoon is injected into the DOM
    const observer = new MutationObserver(() => {
      const cascoon = container.querySelector('tp-cascoon');
      if (cascoon) {
        setIsWidgetLoaded(true);
        window.dispatchEvent(new Event('resize'));
        observer.disconnect();
      }
    });
    observer.observe(container, { childList: true, subtree: true });

    script.onload = () => {
      setIsWidgetLoaded(true);
      window.dispatchEvent(new Event('resize'));
      setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
      setTimeout(() => window.dispatchEvent(new Event('resize')), 150);
      setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
    };

    container.appendChild(script);
  };

  // Mount active locale immediately, then warm up the alternate locale in background
  useEffect(() => {
    if (isFr) {
      if (frContainerRef.current && !frInitializedRef.current) {
        frInitializedRef.current = true;
        initWidget(frContainerRef.current, 'fr');
      }
    } else {
      if (enContainerRef.current && !enInitializedRef.current) {
        enInitializedRef.current = true;
        initWidget(enContainerRef.current, 'en');
      }
    }

    // Warm up the other locale in the background so language switching is instantaneous (0ms)
    const warmTimer = setTimeout(() => {
      if (isFr) {
        if (enContainerRef.current && !enInitializedRef.current) {
          enInitializedRef.current = true;
          initWidget(enContainerRef.current, 'en');
        }
      } else {
        if (frContainerRef.current && !frInitializedRef.current) {
          frInitializedRef.current = true;
          initWidget(frContainerRef.current, 'fr');
        }
      }
    }, 500);

    return () => clearTimeout(warmTimer);
  }, []);

  // When language switches, ensure target container is ready and trigger layout recalculation
  useEffect(() => {
    if (isFr) {
      if (frContainerRef.current && !frInitializedRef.current) {
        frInitializedRef.current = true;
        initWidget(frContainerRef.current, 'fr');
      }
    } else {
      if (enContainerRef.current && !enInitializedRef.current) {
        enInitializedRef.current = true;
        initWidget(enContainerRef.current, 'en');
      }
    }

    window.dispatchEvent(new Event('resize'));
    const t1 = setTimeout(() => window.dispatchEvent(new Event('resize')), 30);
    const t2 = setTimeout(() => window.dispatchEvent(new Event('resize')), 120);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isFr]);

  return (
    <div 
      id="travelpayouts-search-container" 
      className="w-full my-2 sm:my-3 relative z-20 select-none min-h-[220px] md:min-h-[68px]"
    >
      {/* Instant Fixed Visual Shell (Pre-rendered at 0ms, eliminates blank loading delays and layout shifts) */}
      {!isWidgetLoaded && (
        <div 
          className="w-full bg-[#262626] border border-white/10 rounded-2xl md:rounded-xl shadow-2xl p-2.5 sm:p-3 flex flex-col md:flex-row items-center gap-2 relative overflow-hidden transition-opacity duration-300 animate-in fade-in"
          aria-hidden={isWidgetLoaded}
        >
          {/* Subtle ambient shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent animate-pulse pointer-events-none" />

          {/* Departure Field */}
          <div className="flex-1 w-full bg-[#1a1a1c] border border-white/5 rounded-lg px-3 py-2.5 flex items-center gap-2.5">
            <PlaneTakeoff className="w-4 h-4 text-[#32a8dd] shrink-0" />
            <div className="flex flex-col text-left overflow-hidden">
              <span className="text-[10px] uppercase font-semibold text-white/50 tracking-wider">
                {isFr ? 'Départ' : 'From'}
              </span>
              <span className="text-xs sm:text-sm font-medium text-white truncate">
                {isFr ? 'Paris, Tous les aéroports' : 'Paris, All airports'}
              </span>
            </div>
          </div>

          {/* Swap Button */}
          <div className="hidden md:flex items-center justify-center p-1.5 rounded-full bg-white/5 text-white/40 shrink-0">
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </div>

          {/* Destination Field */}
          <div className="flex-1 w-full bg-[#1a1a1c] border border-white/5 rounded-lg px-3 py-2.5 flex items-center gap-2.5">
            <PlaneLanding className="w-4 h-4 text-[#32a8dd] shrink-0" />
            <div className="flex flex-col text-left overflow-hidden">
              <span className="text-[10px] uppercase font-semibold text-white/50 tracking-wider">
                {isFr ? 'Destination' : 'To'}
              </span>
              <span className="text-xs sm:text-sm font-medium text-white/60 truncate">
                {isFr ? 'Où souhaitez-vous aller ?' : 'Where are you going?'}
              </span>
            </div>
          </div>

          {/* Dates Field */}
          <div className="w-full md:w-44 bg-[#1a1a1c] border border-white/5 rounded-lg px-3 py-2.5 flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-[#32a8dd] shrink-0" />
            <div className="flex flex-col text-left overflow-hidden">
              <span className="text-[10px] uppercase font-semibold text-white/50 tracking-wider">
                {isFr ? 'Dates' : 'Dates'}
              </span>
              <span className="text-xs sm:text-sm font-medium text-white/60 truncate">
                {isFr ? 'Aller — Retour' : 'Depart — Return'}
              </span>
            </div>
          </div>

          {/* Passengers Field */}
          <div className="w-full md:w-36 bg-[#1a1a1c] border border-white/5 rounded-lg px-3 py-2.5 flex items-center gap-2.5">
            <Users className="w-4 h-4 text-[#32a8dd] shrink-0" />
            <div className="flex flex-col text-left overflow-hidden">
              <span className="text-[10px] uppercase font-semibold text-white/50 tracking-wider">
                {isFr ? 'Passagers' : 'Passengers'}
              </span>
              <span className="text-xs sm:text-sm font-medium text-white truncate">
                {isFr ? '1 passager' : '1 passenger'}
              </span>
            </div>
          </div>

          {/* Search Button */}
          <a
            href={`https://www.aviasales.com/search?trs=429016&shmarker=569298&locale=${isFr ? 'fr' : 'en'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto bg-[#32a8dd] hover:bg-[#2897c7] text-white font-semibold px-5 py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-[#32a8dd]/20 transition-all shrink-0 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-bold whitespace-nowrap">
              {isFr ? 'Rechercher' : 'Search'}
            </span>
          </a>
        </div>
      )}

      {/* Live Official TravelPayouts Search Widget (French) */}
      <div 
        ref={frContainerRef} 
        id="safarihoo-flight-widget-container-fr"
        className={
          isFr 
            ? `w-full relative z-10 transition-opacity duration-300 ${isWidgetLoaded ? 'opacity-100' : 'opacity-0 absolute top-0 left-0'}` 
            : 'w-full absolute -left-[9999px] top-0 opacity-0 pointer-events-none -z-10'
        }
      />

      {/* Live Official TravelPayouts Search Widget (English) */}
      <div 
        ref={enContainerRef} 
        id="safarihoo-flight-widget-container-en"
        className={
          !isFr 
            ? `w-full relative z-10 transition-opacity duration-300 ${isWidgetLoaded ? 'opacity-100' : 'opacity-0 absolute top-0 left-0'}` 
            : 'w-full absolute -left-[9999px] top-0 opacity-0 pointer-events-none -z-10'
        }
      />
    </div>
  );
};
