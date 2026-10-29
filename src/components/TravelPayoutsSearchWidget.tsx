import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Plane, Calendar, MapPin, Search } from 'lucide-react';

export const TravelPayoutsSearchWidget: React.FC = () => {
  const { language } = useLanguage();
  const isFr = language === 'FR';

  const enContainerRef = useRef<HTMLDivElement>(null);
  const frContainerRef = useRef<HTMLDivElement>(null);

  const [isEnLoaded, setIsEnLoaded] = useState(false);
  const [isFrLoaded, setIsFrLoaded] = useState(false);

  const enInitializedRef = useRef(false);
  const frInitializedRef = useRef(false);

  // Initialize a language widget without destroying the other
  const initWidget = useCallback((targetLocale: 'en' | 'fr') => {
    if (targetLocale === 'en') {
      if (enInitializedRef.current || !enContainerRef.current) return;
      enInitializedRef.current = true;

      const container = enContainerRef.current;
      container.innerHTML = '';

      const widgetDiv = document.createElement('div');
      widgetDiv.className = 'safarihoo-flight-widget';
      widgetDiv.style.width = '100%';
      widgetDiv.style.minHeight = '140px';

      const script = document.createElement('script');
      script.src = 'https://tpemd.com/content?currency=usd&trs=429016&shmarker=569298&show_hotels=false&powered_by=false&locale=en&searchUrl=www.aviasales.com%2Fsearch&primary_override=%2332a8dd&color_button=&color_icons=%230D0D0Eff&dark=%23262626&light=%23FFFFFFFf&secondary=%23FFFFFFFf&special=%23C4C4C4&color_focused=%2332a8dd&border_radius=0&no_labels=true&plain=true&promo_id=7879&campaign_id=100';
      script.async = true;
      script.charset = 'utf-8';
      script.setAttribute('fetchpriority', 'high');

      script.onload = () => {
        setIsEnLoaded(true);
        window.dispatchEvent(new Event('resize'));
        setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
        setTimeout(() => window.dispatchEvent(new Event('resize')), 150);
        setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
      };

      script.onerror = () => {
        setIsEnLoaded(true);
      };

      widgetDiv.appendChild(script);
      container.appendChild(widgetDiv);

      setTimeout(() => {
        setIsEnLoaded(true);
        window.dispatchEvent(new Event('resize'));
      }, 1500);
    } else {
      if (frInitializedRef.current || !frContainerRef.current) return;
      frInitializedRef.current = true;

      const container = frContainerRef.current;
      container.innerHTML = '';

      const widgetDiv = document.createElement('div');
      widgetDiv.className = 'safarihoo-flight-widget';
      widgetDiv.style.width = '100%';
      widgetDiv.style.minHeight = '140px';

      const script = document.createElement('script');
      script.src = 'https://tpemd.com/content?currency=usd&trs=429016&shmarker=569298&show_hotels=false&powered_by=false&locale=fr&searchUrl=www.aviasales.com%2Fsearch&primary_override=%2332a8dd&color_button=&color_icons=%230D0D0Eff&dark=%23262626&light=%23FFFFFFFf&secondary=%23FFFFFFFf&special=%23C4C4C4&color_focused=%2332a8dd&border_radius=0&no_labels=true&plain=true&promo_id=7879&campaign_id=100';
      script.async = true;
      script.charset = 'utf-8';
      script.setAttribute('fetchpriority', 'high');

      script.onload = () => {
        setIsFrLoaded(true);
        window.dispatchEvent(new Event('resize'));
        setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
        setTimeout(() => window.dispatchEvent(new Event('resize')), 150);
        setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
      };

      script.onerror = () => {
        setIsFrLoaded(true);
      };

      widgetDiv.appendChild(script);
      container.appendChild(widgetDiv);

      setTimeout(() => {
        setIsFrLoaded(true);
        window.dispatchEvent(new Event('resize'));
      }, 1500);
    }
  }, []);

  // Initialize active language immediately on mount
  useEffect(() => {
    if (isFr) {
      initWidget('fr');
    } else {
      initWidget('en');
    }
  }, [isFr, initWidget]);

  // Pre-warm the alternate language after a brief delay so switching is instant (0ms latency)
  useEffect(() => {
    const prewarmTimer = setTimeout(() => {
      if (!isFr && !frInitializedRef.current) {
        initWidget('fr');
      } else if (isFr && !enInitializedRef.current) {
        initWidget('en');
      }
    }, 1200);

    return () => clearTimeout(prewarmTimer);
  }, [isFr, initWidget]);

  // Broadcast resize event when switching languages to force layout sync
  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
    const t1 = setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
    const t2 = setTimeout(() => window.dispatchEvent(new Event('resize')), 200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isFr]);

  const activeLoaded = isFr ? isFrLoaded : isEnLoaded;

  return (
    <div 
      id="travelpayouts-search-container" 
      className="w-full my-2 sm:my-3 relative z-20 select-none min-h-[140px]"
    >
      {/* Modern Shimmer Skeleton displayed only while the active widget initializes */}
      {!activeLoaded && (
        <div className="w-full bg-[#18181b]/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-6 w-24 bg-white/10 rounded-full" />
              <div className="h-6 w-28 bg-white/10 rounded-full" />
            </div>
            <div className="flex items-center gap-2 text-xs text-[#32a8dd]">
              <div className="w-3.5 h-3.5 border-2 border-[#32a8dd] border-t-transparent rounded-full animate-spin" />
              <span>{isFr ? 'Chargement des vols en direct...' : 'Loading live flights...'}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="h-12 bg-white/5 rounded-xl border border-white/5 flex items-center px-4 gap-3">
              <MapPin className="w-4 h-4 text-white/30" />
              <div className="h-3 w-28 bg-white/10 rounded" />
            </div>
            <div className="h-12 bg-white/5 rounded-xl border border-white/5 flex items-center px-4 gap-3">
              <Plane className="w-4 h-4 text-white/30" />
              <div className="h-3 w-28 bg-white/10 rounded" />
            </div>
            <div className="h-12 bg-white/5 rounded-xl border border-white/5 flex items-center px-4 gap-3">
              <Calendar className="w-4 h-4 text-white/30" />
              <div className="h-3 w-24 bg-white/10 rounded" />
            </div>
            <div className="h-12 bg-[#32a8dd]/30 rounded-xl flex items-center justify-center gap-2">
              <Search className="w-4 h-4 text-[#32a8dd]" />
              <div className="h-3 w-16 bg-[#32a8dd]/40 rounded" />
            </div>
          </div>
        </div>
      )}

      {/* English Flight Widget Container - Kept alive in DOM */}
      <div 
        ref={enContainerRef} 
        id="safarihoo-flight-widget-en"
        className={`w-full transition-opacity duration-150 ${
          !isFr 
            ? 'relative z-10 opacity-100 block' 
            : 'absolute top-0 left-0 w-full opacity-0 pointer-events-none -z-10 invisible h-0 overflow-hidden'
        }`}
      />

      {/* French Flight Widget Container - Kept alive in DOM */}
      <div 
        ref={frContainerRef} 
        id="safarihoo-flight-widget-fr"
        className={`w-full transition-opacity duration-150 ${
          isFr 
            ? 'relative z-10 opacity-100 block' 
            : 'absolute top-0 left-0 w-full opacity-0 pointer-events-none -z-10 invisible h-0 overflow-hidden'
        }`}
      />
    </div>
  );
};
