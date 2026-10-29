import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

export const TravelPayoutsSearchWidget: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const isFr = language === 'FR';
  const locale = isFr ? 'fr' : 'en';

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Reset TravelPayouts singletons so language changes take effect immediately
    try {
      if (typeof window !== 'undefined') {
        delete (window as any).CASCOON_GLOBAL;
        delete (window as any).TP_POWERED_BY;
        document.querySelector('#cascoon-style-css')?.remove();
      }
    } catch {
      // Ignore cleanup errors
    }

    // Clean container content without flash of loading text
    container.innerHTML = '';

    // Create wrapper for the widget
    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'safarihoo-flight-widget';
    widgetDiv.style.width = '100%';
    widgetDiv.style.minHeight = '140px';

    // Official TravelPayouts / Aviasales 7879 script with active locale
    const script = document.createElement('script');
    script.src = `https://tpemd.com/content?currency=usd&trs=429016&shmarker=569298&show_hotels=false&powered_by=false&locale=${locale}&searchUrl=www.aviasales.com%2Fsearch&primary_override=%2332a8dd&color_button=&color_icons=%230D0D0Eff&dark=%23262626&light=%23FFFFFFFf&secondary=%23FFFFFFFf&special=%23C4C4C4&color_focused=%2332a8dd&border_radius=0&no_labels=true&plain=true&promo_id=7879&campaign_id=100`;
    script.async = true;
    script.charset = 'utf-8';
    script.setAttribute('fetchpriority', 'high');

    script.onload = () => {
      window.dispatchEvent(new Event('resize'));
      setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
      setTimeout(() => window.dispatchEvent(new Event('resize')), 150);
      setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
    };

    widgetDiv.appendChild(script);
    container.appendChild(widgetDiv);

    const fallbackTimer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 1000);

    return () => {
      clearTimeout(fallbackTimer);
    };
  }, [locale]);

  return (
    <div 
      id="travelpayouts-search-container" 
      className="w-full my-2 sm:my-3 relative z-20 select-none min-h-[140px]"
    >
      {/* Clean widget container without any unsightly 'Loading flight...' banner */}
      <div 
        key={`flight-widget-${locale}`}
        ref={containerRef} 
        id="safarihoo-flight-widget-container"
        className="w-full relative z-10 min-h-[140px]"
      />
    </div>
  );
};
