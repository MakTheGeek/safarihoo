import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';

export const AirHelpWidget: React.FC = () => {
  const { language } = useLanguage();
  const isFr = language === 'FR';

  const enContainerRef = useRef<HTMLDivElement>(null);
  const frContainerRef = useRef<HTMLDivElement>(null);

  const [isEnLoaded, setIsEnLoaded] = useState(false);
  const [isFrLoaded, setIsFrLoaded] = useState(false);

  const enInitializedRef = useRef(false);
  const frInitializedRef = useRef(false);

  const initWidget = useCallback((targetLocale: 'en' | 'fr') => {
    if (targetLocale === 'en') {
      if (enInitializedRef.current || !enContainerRef.current) return;
      enInitializedRef.current = true;

      const container = enContainerRef.current;
      container.innerHTML = '';

      const widgetDiv = document.createElement('div');
      widgetDiv.className = 'safarihoo-airhelp-widget';
      widgetDiv.style.width = '100%';
      widgetDiv.style.minHeight = '180px';

      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://tpemd.com/content?trs=429016&shmarker=569298&lang=en&powered_by=true&campaign_id=120&promo_id=8679';
      script.charset = 'utf-8';
      script.setAttribute('fetchpriority', 'high');

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
      widgetDiv.className = 'safarihoo-airhelp-widget';
      widgetDiv.style.width = '100%';
      widgetDiv.style.minHeight = '180px';

      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://tpemd.com/content?trs=429016&shmarker=569298&lang=fr&powered_by=true&campaign_id=120&promo_id=8679';
      script.charset = 'utf-8';
      script.setAttribute('fetchpriority', 'high');

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
      initWidget('en');
    }
  }, [isFr, initWidget]);

  // Pre-warm the other language after active one starts
  useEffect(() => {
    const prewarmTimer = setTimeout(() => {
      if (!isFr && !frInitializedRef.current) {
        initWidget('fr');
      } else if (isFr && !enInitializedRef.current) {
        initWidget('en');
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
        .safarihoo-airhelp-widget,
        #safarihoo-airhelp-widget-en,
        #safarihoo-airhelp-widget-fr,
        #safarihoo-airhelp-widget-en > div,
        #safarihoo-airhelp-widget-fr > div {
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

        .safarihoo-airhelp-widget iframe,
        #safarihoo-airhelp-widget-en iframe,
        #safarihoo-airhelp-widget-fr iframe {
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
          <span>{isFr ? 'Chargement du module de compensation AirHelp...' : 'Loading AirHelp passenger compensation engine...'}</span>
        </div>
      )}

      {/* English AirHelp Widget */}
      <div 
        ref={enContainerRef} 
        id="safarihoo-airhelp-widget-en" 
        className={`w-full transition-opacity duration-150 ${
          !isFr 
            ? 'relative z-10 opacity-100 block min-h-[180px]' 
            : 'absolute top-0 left-0 w-full opacity-0 pointer-events-none -z-10 invisible h-0 overflow-hidden'
        }`}
      />

      {/* French AirHelp Widget */}
      <div 
        ref={frContainerRef} 
        id="safarihoo-airhelp-widget-fr" 
        className={`w-full transition-opacity duration-150 ${
          isFr 
            ? 'relative z-10 opacity-100 block min-h-[180px]' 
            : 'absolute top-0 left-0 w-full opacity-0 pointer-events-none -z-10 invisible h-0 overflow-hidden'
        }`}
      />
    </div>
  );
};
