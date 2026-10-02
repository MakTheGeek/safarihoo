import React, { useEffect, useRef, useState } from 'react';

export const AirHelpWidget: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || initializedRef.current) return;

    initializedRef.current = true;

    // Create wrapper for the AirHelp widget
    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'safarihoo-airhelp-widget';
    widgetDiv.style.width = '100%';
    widgetDiv.style.minHeight = '180px';

    const script = document.createElement('script');
    script.async = true;
    script.src =
      'https://tpemd.com/content?trs=429016&shmarker=569298&lang=en&powered_by=true&campaign_id=120&promo_id=8679';
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
    }, 1200);

    return () => {
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 my-4 relative z-20">
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
            Loading flight compensation checker...
          </div>
        </div>
      )}

      <div
        id="safarihoo-airhelp-widget-container"
        ref={containerRef}
        className={`w-full min-h-[180px] rounded-2xl overflow-visible transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-90'
        }`}
      />
    </div>
  );
};

