import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export const TravelPayoutsSearchWidget: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { language } = useLanguage();
  const locale = language === 'FR' ? 'fr' : 'en';

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isMounted = true;
    setIsLoaded(false);
    container.innerHTML = '';

    // Fast MutationObserver to detect widget DOM injection
    const observer = new MutationObserver(() => {
      const hasContent = Array.from(container.children).some(
        (child) => child.tagName !== 'SCRIPT' && (child.innerHTML.trim() !== '' || child.tagName === 'IFRAME')
      );
      if (hasContent && isMounted) {
        setIsLoaded(true);
        window.dispatchEvent(new Event('resize'));
        observer.disconnect();
      }
    });

    observer.observe(container, { childList: true, subtree: true });

    // Inject Travelpayouts script with current locale
    const script = document.createElement('script');
    script.src = `https://tpemd.com/content?currency=usd&trs=429016&shmarker=569298&show_hotels=false&powered_by=false&locale=${locale}&searchUrl=www.aviasales.com%2Fsearch&primary_override=%2332a8dd&color_button=&color_icons=%230D0D0Eff&dark=%23262626&light=%23FFFFFFFf&secondary=%23FFFFFFFf&special=%23C4C4C4&color_focused=%2332a8dd&border_radius=0&no_labels=true&plain=true&promo_id=7879&campaign_id=100`;
    script.async = true;
    script.charset = 'utf-8';
    script.setAttribute('fetchpriority', 'high');

    script.onload = () => {
      if (isMounted) {
        setIsLoaded(true);
        window.dispatchEvent(new Event('resize'));
        setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
        setTimeout(() => window.dispatchEvent(new Event('resize')), 200);
      }
    };

    script.onerror = () => {
      if (isMounted) setIsLoaded(true);
    };

    container.appendChild(script);

    const fallbackTimer = setTimeout(() => {
      if (isMounted) {
        setIsLoaded(true);
        window.dispatchEvent(new Event('resize'));
      }
    }, 1500);

    return () => {
      isMounted = false;
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [locale]);

  return (
    <div 
      id="travelpayouts-search-container" 
      className="w-full my-2 sm:my-3 relative z-20 select-none overflow-visible min-h-[68px] sm:min-h-[76px]"
    >
      <div 
        ref={containerRef} 
        className="w-full relative z-10 transition-opacity duration-200"
      />

      {!isLoaded && (
        <div className="w-full py-4 flex items-center justify-center gap-2 text-white/50 text-xs">
          <div className="w-4 h-4 border-2 border-[#32a8dd] border-t-transparent rounded-full animate-spin" />
          <span>{locale === 'fr' ? 'Chargement du comparateur de vols...' : 'Loading flight search engine...'}</span>
        </div>
      )}
    </div>
  );
};
