import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export const CarTripWidget: React.FC = () => {
  const frContainerRef = useRef<HTMLDivElement>(null);
  const enContainerRef = useRef<HTMLDivElement>(null);

  const frInitializedRef = useRef(false);
  const enInitializedRef = useRef(false);

  const [frLoaded, setFrLoaded] = useState(false);
  const [enLoaded, setEnLoaded] = useState(false);

  const { language } = useLanguage();
  const isFr = language === 'FR';

  const initWidget = (container: HTMLDivElement, locale: 'fr' | 'en', onDone: () => void) => {
    container.innerHTML = '';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'safarihoo-car-widget';
    widgetDiv.style.width = '100%';
    widgetDiv.style.minHeight = '180px';

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://tpemd.com/content?trs=429016&shmarker=569298&locale=${locale}&powered_by=true&border_radius=2&plain=true&show_logo=true&color_background=%23FFFFFFFf&color_button=%230921CDff&promo_id=4362&campaign_id=143`;
    script.charset = 'utf-8';
    script.setAttribute('fetchpriority', 'high');

    script.onload = () => {
      onDone();
      window.dispatchEvent(new Event('resize'));
      setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
      setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
    };

    script.onerror = () => onDone();

    widgetDiv.appendChild(script);
    container.appendChild(widgetDiv);

    setTimeout(() => {
      onDone();
      window.dispatchEvent(new Event('resize'));
    }, 1200);
  };

  useEffect(() => {
    // 1. Initialize active locale first
    if (isFr) {
      if (frContainerRef.current && !frInitializedRef.current) {
        frInitializedRef.current = true;
        initWidget(frContainerRef.current, 'fr', () => setFrLoaded(true));
      }
    } else {
      if (enContainerRef.current && !enInitializedRef.current) {
        enInitializedRef.current = true;
        initWidget(enContainerRef.current, 'en', () => setEnLoaded(true));
      }
    }

    // 2. Warm up alternate locale in background after initial paint
    const warmTimer = setTimeout(() => {
      if (isFr) {
        if (enContainerRef.current && !enInitializedRef.current) {
          enInitializedRef.current = true;
          initWidget(enContainerRef.current, 'en', () => setEnLoaded(true));
        }
      } else {
        if (frContainerRef.current && !frInitializedRef.current) {
          frInitializedRef.current = true;
          initWidget(frContainerRef.current, 'fr', () => setFrLoaded(true));
        }
      }
    }, 400);

    return () => clearTimeout(warmTimer);
  }, []);

  // When language switches, trigger layout recalculations
  useEffect(() => {
    if (isFr) {
      if (frContainerRef.current && !frInitializedRef.current) {
        frInitializedRef.current = true;
        initWidget(frContainerRef.current, 'fr', () => setFrLoaded(true));
      }
    } else {
      if (enContainerRef.current && !enInitializedRef.current) {
        enInitializedRef.current = true;
        initWidget(enContainerRef.current, 'en', () => setEnLoaded(true));
      }
    }

    window.dispatchEvent(new Event('resize'));
    const t1 = setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
    return () => clearTimeout(t1);
  }, [isFr]);

  const activeLoaded = isFr ? frLoaded : enLoaded;

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 my-3 relative z-20">
      <style>{`
        .safarihoo-car-widget,
        #safarihoo-car-widget-container,
        #safarihoo-car-widget-container > div {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
          margin: 0 auto !important;
          width: 100% !important;
          max-width: 100% !important;
          min-height: 180px;
          display: block !important;
        }

        .safarihoo-car-widget iframe,
        #safarihoo-car-widget-container iframe {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          width: 100% !important;
          min-width: 100% !important;
          min-height: 200px !important;
          height: auto !important;
          display: block !important;
          margin: 0 auto !important;
        }
      `}</style>

      {/* Discreet loading spinner while active widget initializes */}
      {!activeLoaded && (
        <div className="w-full py-5 flex items-center justify-center gap-2 text-xs text-white/50">
          <div className="w-4 h-4 border-2 border-[#32a8dd] border-t-transparent rounded-full animate-spin" />
          <span>{isFr ? 'Chargement des meilleures offres de location de voitures...' : 'Loading best car rental deals...'}</span>
        </div>
      )}

      {/* French Widget Container */}
      <div 
        ref={frContainerRef} 
        id="safarihoo-car-widget-container-fr" 
        className={isFr ? 'w-full relative opacity-100 z-10 transition-opacity duration-150' : 'w-full absolute -left-[9999px] top-0 opacity-0 pointer-events-none -z-10'}
      />

      {/* English Widget Container */}
      <div 
        ref={enContainerRef} 
        id="safarihoo-car-widget-container-en" 
        className={!isFr ? 'w-full relative opacity-100 z-10 transition-opacity duration-150' : 'w-full absolute -left-[9999px] top-0 opacity-0 pointer-events-none -z-10'}
      />
    </div>
  );
};
