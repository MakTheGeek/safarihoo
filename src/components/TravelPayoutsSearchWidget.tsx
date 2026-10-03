import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

export const TravelPayoutsSearchWidget: React.FC = () => {
  const frContainerRef = useRef<HTMLDivElement>(null);
  const enContainerRef = useRef<HTMLDivElement>(null);

  const frInitializedRef = useRef(false);
  const enInitializedRef = useRef(false);

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

    script.onload = () => {
      window.dispatchEvent(new Event('resize'));
      setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
      setTimeout(() => window.dispatchEvent(new Event('resize')), 150);
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
    }, 600);

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
      className="w-full my-2 sm:my-3 relative z-20 select-none"
    >
      {/* French Widget Container */}
      <div 
        ref={frContainerRef} 
        id="safarihoo-flight-widget-container-fr"
        className={isFr ? 'w-full relative opacity-100 z-10 transition-opacity duration-150' : 'w-full absolute -left-[9999px] top-0 opacity-0 pointer-events-none -z-10'}
      />

      {/* English Widget Container */}
      <div 
        ref={enContainerRef} 
        id="safarihoo-flight-widget-container-en"
        className={!isFr ? 'w-full relative opacity-100 z-10 transition-opacity duration-150' : 'w-full absolute -left-[9999px] top-0 opacity-0 pointer-events-none -z-10'}
      />
    </div>
  );
};
