import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

export const CarTripWidget: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const isFr = language === 'FR';
  const locale = isFr ? 'fr' : 'en';

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (typeof window !== 'undefined') {
        delete (window as any).CASCOON_GLOBAL;
        delete (window as any).TP_POWERED_BY;
        document.querySelector('#cascoon-style-css')?.remove();
      }
    } catch {
      // Ignore
    }

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
      window.dispatchEvent(new Event('resize'));
      setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
      setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
    };

    widgetDiv.appendChild(script);
    container.appendChild(widgetDiv);

    const fallbackTimer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 1200);

    return () => clearTimeout(fallbackTimer);
  }, [locale]);

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

      {/* Widget Container without any jarring loading text */}
      <div 
        key={`car-widget-${locale}`}
        ref={containerRef} 
        id="safarihoo-car-widget-container" 
        className="w-full relative z-10 min-h-[180px]"
      />
    </div>
  );
};
