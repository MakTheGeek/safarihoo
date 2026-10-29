import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';

export const HotelTripWidget: React.FC = () => {
  const { language } = useLanguage();
  const isFr = language === 'FR';

  const enContainerRef = useRef<HTMLDivElement>(null);
  const frContainerRef = useRef<HTMLDivElement>(null);

  const [isEnLoaded, setIsEnLoaded] = useState(false);
  const [isFrLoaded, setIsFrLoaded] = useState(false);

  const enInitializedRef = useRef(false);
  const frInitializedRef = useRef(false);

  const initWidget = useCallback((targetLang: 'www' | 'fr') => {
    if (targetLang === 'www') {
      if (enInitializedRef.current || !enContainerRef.current) return;
      enInitializedRef.current = true;

      const container = enContainerRef.current;
      container.innerHTML = '';

      const widgetDiv = document.createElement('div');
      widgetDiv.className = 'safarihoo-trip-widget';
      widgetDiv.style.width = '100%';
      widgetDiv.style.minHeight = '180px';

      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://tpemd.com/content?trs=429016&shmarker=569298&lang=www&layout=S10391&powered_by=true&campaign_id=121&promo_id=4038';
      script.charset = 'utf-8';

      script.onload = () => {
        setIsEnLoaded(true);
        window.dispatchEvent(new Event('resize'));
        setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
        setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
      };

      script.onerror = () => setIsEnLoaded(true);

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
      widgetDiv.className = 'safarihoo-trip-widget';
      widgetDiv.style.width = '100%';
      widgetDiv.style.minHeight = '180px';

      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://tpemd.com/content?trs=429016&shmarker=569298&lang=fr&layout=S10391&powered_by=true&campaign_id=121&promo_id=4038';
      script.charset = 'utf-8';

      script.onload = () => {
        setIsFrLoaded(true);
        window.dispatchEvent(new Event('resize'));
        setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
        setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
      };

      script.onerror = () => setIsFrLoaded(true);

      widgetDiv.appendChild(script);
      container.appendChild(widgetDiv);

      setTimeout(() => {
        setIsFrLoaded(true);
        window.dispatchEvent(new Event('resize'));
      }, 1500);
    }
  }, []);

  // Initialize active language
  useEffect(() => {
    if (isFr) {
      initWidget('fr');
    } else {
      initWidget('www');
    }
  }, [isFr, initWidget]);

  // Pre-warm the other language after active one starts
  useEffect(() => {
    const prewarmTimer = setTimeout(() => {
      if (!isFr && !frInitializedRef.current) {
        initWidget('fr');
      } else if (isFr && !enInitializedRef.current) {
        initWidget('www');
      }
    }, 1500);
    return () => clearTimeout(prewarmTimer);
  }, [isFr, initWidget]);

  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
    const t = setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
    return () => clearTimeout(t);
  }, [isFr]);

  const activeLoaded = isFr ? isFrLoaded : isEnLoaded;

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 my-3 relative z-20">
      <style>{`
        .safarihoo-trip-widget,
        #safarihoo-hotel-widget-en,
        #safarihoo-hotel-widget-fr,
        #safarihoo-hotel-widget-en > div,
        #safarihoo-hotel-widget-fr > div {
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

        .safarihoo-trip-widget iframe,
        #safarihoo-hotel-widget-en iframe,
        #safarihoo-hotel-widget-fr iframe {
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
          <span>{isFr ? 'Chargement des meilleures offres d’hôtels...' : 'Loading best hotel deals...'}</span>
        </div>
      )}

      {/* English Hotel Widget */}
      <div
        id="safarihoo-hotel-widget-en"
        ref={enContainerRef}
        className={`w-full min-h-[180px] rounded-2xl overflow-visible transition-opacity duration-150 ${
          !isFr 
            ? 'relative z-10 opacity-100 block' 
            : 'absolute top-0 left-0 w-full opacity-0 pointer-events-none -z-10 invisible h-0 overflow-hidden'
        }`}
      />

      {/* French Hotel Widget */}
      <div
        id="safarihoo-hotel-widget-fr"
        ref={frContainerRef}
        className={`w-full min-h-[180px] rounded-2xl overflow-visible transition-opacity duration-150 ${
          isFr 
            ? 'relative z-10 opacity-100 block' 
            : 'absolute top-0 left-0 w-full opacity-0 pointer-events-none -z-10 invisible h-0 overflow-hidden'
        }`}
      />
    </div>
  );
};
