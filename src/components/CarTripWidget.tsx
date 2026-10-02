import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export const CarTripWidget: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastLocaleRef = useRef<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const localeParam = language === 'FR' ? 'fr' : 'en';

    // If already loaded for this locale, keep it
    if (lastLocaleRef.current === localeParam && container.children.length > 0) {
      setIsLoaded(true);
      window.dispatchEvent(new Event('resize'));
      return;
    }

    lastLocaleRef.current = localeParam;
    setIsLoaded(false);
    container.innerHTML = '';

    // Create wrapper for the car widget
    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'safarihoo-car-widget';
    widgetDiv.style.width = '100%';
    widgetDiv.style.minHeight = '180px';

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://tpemd.com/content?trs=429016&shmarker=569298&locale=${localeParam}&powered_by=true&border_radius=2&plain=true&show_logo=true&color_background=%23FFFFFFFf&color_button=%230921CDff&promo_id=4362&campaign_id=143`;
    script.charset = 'utf-8';

    script.onload = () => {
      setIsLoaded(true);
      window.dispatchEvent(new Event('resize'));
      setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
      setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
      setTimeout(() => window.dispatchEvent(new Event('resize')), 800);
    };

    script.onerror = () => {
      setIsLoaded(true);
    };

    widgetDiv.appendChild(script);
    container.appendChild(widgetDiv);

    // Backup timer in case onload is consumed
    const fallbackTimer = setTimeout(() => {
      setIsLoaded(true);
      window.dispatchEvent(new Event('resize'));
    }, 1500);

    return () => {
      clearTimeout(fallbackTimer);
    };
  }, [language]);

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 my-4 relative z-20">
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

      {/* Shimmer skeleton while widget initializes */}
      {!isLoaded && (
        <div className="w-full min-h-[180px] rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md p-6 flex flex-col justify-center animate-pulse mb-2">
          <div className="flex flex-col md:flex-row gap-4 w-full items-center justify-between">
            <div className="h-12 w-full md:w-1/3 bg-white/10 rounded-xl" />
            <div className="h-12 w-full md:w-1/3 bg-white/10 rounded-xl" />
            <div className="h-12 w-full md:w-1/4 bg-blue-500/20 rounded-xl" />
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-white/40">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            Loading rental car deals worldwide...
          </div>
        </div>
      )}

      <div
        id="safarihoo-car-widget-container"
        ref={containerRef}
        className={`w-full min-h-[180px] rounded-2xl overflow-visible transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-90'
        }`}
      />
    </div>
  );
};
