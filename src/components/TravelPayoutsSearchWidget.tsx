import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export const TravelPayoutsSearchWidget: React.FC = () => {
  const frContainerRef = useRef<HTMLDivElement>(null);
  const enContainerRef = useRef<HTMLDivElement>(null);

  const frInitializedRef = useRef(false);
  const enInitializedRef = useRef(false);

  const [frLoaded, setFrLoaded] = useState(false);
  const [enLoaded, setEnLoaded] = useState(false);

  const { language } = useLanguage();
  const isFr = language === 'FR';
  const activeLocale = isFr ? 'fr' : 'en';

  // Helper to inject widget script
  const loadWidget = (container: HTMLDivElement, locale: 'fr' | 'en', onDone: () => void) => {
    container.innerHTML = '';

    const observer = new MutationObserver(() => {
      const hasContent = Array.from(container.children).some(
        (child) => child.tagName !== 'SCRIPT' && (child.innerHTML.trim() !== '' || child.tagName === 'IFRAME')
      );
      if (hasContent) {
        onDone();
        window.dispatchEvent(new Event('resize'));
        observer.disconnect();
      }
    });

    observer.observe(container, { childList: true, subtree: true });

    const script = document.createElement('script');
    script.src = `https://tpemd.com/content?currency=usd&trs=429016&shmarker=569298&show_hotels=false&powered_by=false&locale=${locale}&searchUrl=www.aviasales.com%2Fsearch&primary_override=%2332a8dd&color_button=&color_icons=%230D0D0Eff&dark=%23262626&light=%23FFFFFFFf&secondary=%23FFFFFFFf&special=%23C4C4C4&color_focused=%2332a8dd&border_radius=0&no_labels=true&plain=true&promo_id=7879&campaign_id=100`;
    script.async = true;
    script.charset = 'utf-8';
    script.setAttribute('fetchpriority', 'high');

    script.onload = () => {
      onDone();
      window.dispatchEvent(new Event('resize'));
      setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
      setTimeout(() => window.dispatchEvent(new Event('resize')), 200);
    };

    script.onerror = () => {
      onDone();
    };

    container.appendChild(script);

    setTimeout(() => {
      onDone();
      window.dispatchEvent(new Event('resize'));
    }, 1200);
  };

  // Immediate init of FR widget (preloaded in index.html)
  useEffect(() => {
    if (frContainerRef.current && !frInitializedRef.current) {
      frInitializedRef.current = true;
      loadWidget(frContainerRef.current, 'fr', () => setFrLoaded(true));
    }
  }, []);

  // Init EN widget on demand when language is switched to EN
  useEffect(() => {
    if (!isFr && enContainerRef.current && !enInitializedRef.current) {
      enInitializedRef.current = true;
      loadWidget(enContainerRef.current, 'en', () => setEnLoaded(true));
    }
  }, [isFr]);

  const currentIsLoaded = isFr ? frLoaded : enLoaded;

  return (
    <div 
      id="travelpayouts-search-container" 
      className="w-full my-2 sm:my-3 relative z-20 select-none overflow-visible min-h-[68px] sm:min-h-[76px]"
    >
      {/* French Widget Container (Preloaded & Kept alive) */}
      <div 
        ref={frContainerRef} 
        className={`w-full relative z-10 transition-opacity duration-200 ${isFr ? 'block' : 'hidden'}`}
      />

      {/* English Widget Container (Kept alive once loaded) */}
      <div 
        ref={enContainerRef} 
        className={`w-full relative z-10 transition-opacity duration-200 ${!isFr ? 'block' : 'hidden'}`}
      />

      {/* Discreet loading spinner while active widget initializes */}
      {!currentIsLoaded && (
        <div className="w-full py-4 flex items-center justify-center gap-2 text-white/50 text-xs">
          <div className="w-4 h-4 border-2 border-[#32a8dd] border-t-transparent rounded-full animate-spin" />
          <span>{isFr ? 'Chargement du comparateur de vols...' : 'Loading flight search engine...'}</span>
        </div>
      )}
    </div>
  );
};
