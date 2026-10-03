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

    let isSubscribed = true;
    container.innerHTML = '';

    const observer = new MutationObserver(() => {
      const hasContent = Array.from(container.children).some(
        (child) => child.tagName !== 'SCRIPT'
      );
      if (hasContent && isSubscribed) {
        window.dispatchEvent(new Event('resize'));
        observer.disconnect();
      }
    });

    observer.observe(container, { childList: true, subtree: true });

    // Official TravelPayouts / Aviasales 7879 script (unmodified)
    const script = document.createElement('script');
    script.src = `https://tpemd.com/content?currency=usd&trs=429016&shmarker=569298&show_hotels=false&powered_by=false&locale=${locale}&searchUrl=www.aviasales.com%2Fsearch&primary_override=%2332a8dd&color_button=&color_icons=%230D0D0Eff&dark=%23262626&light=%23FFFFFFFf&secondary=%23FFFFFFFf&special=%23C4C4C4&color_focused=%2332a8dd&border_radius=0&no_labels=true&plain=true&promo_id=7879&campaign_id=100`;
    script.async = true;
    script.charset = 'utf-8';
    script.setAttribute('fetchpriority', 'high');

    script.onload = () => {
      if (isSubscribed) {
        window.dispatchEvent(new Event('resize'));
        setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
      }
    };

    container.appendChild(script);

    return () => {
      isSubscribed = false;
      observer.disconnect();
    };
  }, [locale]);

  return (
    <div 
      id="travelpayouts-search-container" 
      className="w-full my-2 sm:my-3 relative z-20 select-none"
    >
      <div 
        ref={containerRef} 
        className="w-full relative z-10"
      />
    </div>
  );
};
