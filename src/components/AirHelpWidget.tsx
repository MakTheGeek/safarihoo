import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export const AirHelpWidget: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastLocaleRef = useRef<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { language } = useLanguage();
  const isFr = language === 'FR';

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const localeParam = isFr ? 'fr' : 'en';

    if (lastLocaleRef.current === localeParam && container.children.length > 0) {
      setIsLoaded(true);
      window.dispatchEvent(new Event('resize'));
      return;
    }

    lastLocaleRef.current = localeParam;
    setIsLoaded(false);
    container.innerHTML = '';

    // Create wrapper for the AirHelp widget
    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'safarihoo-airhelp-widget';
    widgetDiv.style.width = '100%';
    widgetDiv.style.minHeight = '180px';

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://tpemd.com/content?trs=429016&shmarker=569298&lang=${localeParam}&powered_by=true&campaign_id=120&promo_id=8679`;
    script.charset = 'utf-8';

    script.onload = () => {
      setIsLoaded(true);
      window.dispatchEvent(new Event('resize'));
      setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
      setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
    };

    script.onerror = () => {
      setIsLoaded(true);
    };

    widgetDiv.appendChild(script);
    container.appendChild(widgetDiv);

    const fallbackTimer = setTimeout(() => {
      setIsLoaded(true);
      window.dispatchEvent(new Event('resize'));
    }, 1000);

    return () => {
      clearTimeout(fallbackTimer);
    };
  }, [language, isFr]);

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 my-3 relative z-20">
      <style>{`
        .safarihoo-airhelp-widget,
        #safarihoo-airhelp-widget-container,
        #safarihoo-airhelp-widget-container > div {
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
        #safarihoo-airhelp-widget-container iframe {
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

      {/* Discreet loading spinner while widget initializes */}
      {!isLoaded && (
        <div className="w-full py-5 flex items-center justify-center gap-2 text-xs text-white/50">
          <div className="w-4 h-4 border-2 border-[#32a8dd] border-t-transparent rounded-full animate-spin" />
          <span>{isFr ? 'Chargement du vérificateur d’indemnisation AirHelp...' : 'Loading flight compensation checker...'}</span>
        </div>
      )}

      <div
        id="safarihoo-airhelp-widget-container"
        ref={containerRef}
        className="w-full min-h-[180px] rounded-2xl overflow-visible"
      />
    </div>
  );
};
