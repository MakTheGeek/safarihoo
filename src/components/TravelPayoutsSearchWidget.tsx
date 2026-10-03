import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export const TravelPayoutsSearchWidget: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { language } = useLanguage();
  const isFr = language === 'FR';
  const locale = isFr ? 'fr' : 'en';

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isSubscribed = true;
    setIsLoaded(false);
    container.innerHTML = '';

    const observer = new MutationObserver(() => {
      const hasContent = Array.from(container.children).some(
        (child) => child.tagName !== 'SCRIPT'
      );
      if (hasContent && isSubscribed) {
        setIsLoaded(true);
        window.dispatchEvent(new Event('resize'));
        observer.disconnect();
      }
    });

    observer.observe(container, { childList: true, subtree: true });

    // Official TravelPayouts / Aviasales 7879 script (completely unmodified)
    const script = document.createElement('script');
    script.src = `https://tpemd.com/content?currency=usd&trs=429016&shmarker=569298&show_hotels=false&powered_by=false&locale=${locale}&searchUrl=www.aviasales.com%2Fsearch&primary_override=%2332a8dd&color_button=&color_icons=%230D0D0Eff&dark=%23262626&light=%23FFFFFFFf&secondary=%23FFFFFFFf&special=%23C4C4C4&color_focused=%2332a8dd&border_radius=0&no_labels=true&plain=true&promo_id=7879&campaign_id=100`;
    script.async = true;
    script.charset = 'utf-8';
    script.setAttribute('fetchpriority', 'high');

    script.onload = () => {
      if (isSubscribed) {
        setIsLoaded(true);
        window.dispatchEvent(new Event('resize'));
        setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
      }
    };

    script.onerror = () => {
      if (isSubscribed) {
        setIsLoaded(true);
      }
    };

    container.appendChild(script);

    // Fast fallback
    const fallbackTimer = setTimeout(() => {
      if (isSubscribed) {
        setIsLoaded(true);
        window.dispatchEvent(new Event('resize'));
      }
    }, 350);

    return () => {
      isSubscribed = false;
      clearTimeout(fallbackTimer);
      observer.disconnect();
    };
  }, [locale]);

  return (
    <div 
      id="travelpayouts-search-container" 
      className="w-full my-2 sm:my-3 relative z-20 select-none overflow-hidden min-h-[64px] sm:min-h-[72px]"
    >
      {/* Subtle sleek skeleton placeholder while script attaches, avoiding any jarring layout shift */}
      {!isLoaded && (
        <div className="absolute inset-0 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm animate-pulse pointer-events-none z-0" />
      )}

      {/* Official TravelPayouts container */}
      <div 
        ref={containerRef} 
        className="w-full relative opacity-100 z-10 transition-opacity duration-150"
      />
    </div>
  );
};
