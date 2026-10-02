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

  const initWidget = (container: HTMLDivElement, locale: 'fr' | 'en', onDone: () => void) => {
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

    script.onerror = () => onDone();

    container.appendChild(script);

    setTimeout(() => {
      onDone();
      window.dispatchEvent(new Event('resize'));
    }, 1500);
  };

  useEffect(() => {
    // 1. Initialize active locale first
    if (isFr) {
      if (frContainerRef.current && !frInitializedRef.current) {
        frInitializedRef.current = true;
        initWidget(frContainerRef.current, 'fr', () => setFrLoaded(true));
      }
    } else {
      if (enContainerRef.current && !enInitializedRef.current) {
        enInitializedRef.current = true;
        initWidget(enContainerRef.current, 'en', () => setEnLoaded(true));
      }
    }

    // 2. Warm up alternate locale in background after initial paint
    const warmTimer = setTimeout(() => {
      if (isFr) {
        if (enContainerRef.current && !enInitializedRef.current) {
          enInitializedRef.current = true;
          initWidget(enContainerRef.current, 'en', () => setEnLoaded(true));
        }
      } else {
        if (frContainerRef.current && !frInitializedRef.current) {
          frInitializedRef.current = true;
          initWidget(frContainerRef.current, 'fr', () => setFrLoaded(true));
        }
      }
    }, 350);

    return () => clearTimeout(warmTimer);
  }, []);

  // When user switches language, ensure widget is initialized and resized instantly
  useEffect(() => {
    if (isFr) {
      if (frContainerRef.current && !frInitializedRef.current) {
        frInitializedRef.current = true;
        initWidget(frContainerRef.current, 'fr', () => setFrLoaded(true));
      }
    } else {
      if (enContainerRef.current && !enInitializedRef.current) {
        enInitializedRef.current = true;
        initWidget(enContainerRef.current, 'en', () => setEnLoaded(true));
      }
    }

    window.dispatchEvent(new Event('resize'));
    const t1 = setTimeout(() => window.dispatchEvent(new Event('resize')), 40);
    const t2 = setTimeout(() => window.dispatchEvent(new Event('resize')), 150);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isFr]);

  const activeLoaded = isFr ? frLoaded : enLoaded;

  return (
    <div 
      id="travelpayouts-search-container" 
      className="w-full my-2 sm:my-3 relative z-20 select-none overflow-hidden min-h-[68px] sm:min-h-[76px]"
    >
      {/* French Widget Container */}
      <div 
        ref={frContainerRef} 
        className={isFr ? 'w-full relative opacity-100 z-10 transition-opacity duration-150' : 'w-full absolute -left-[9999px] top-0 opacity-0 pointer-events-none -z-10'}
      />

      {/* English Widget Container */}
      <div 
        ref={enContainerRef} 
        className={!isFr ? 'w-full relative opacity-100 z-10 transition-opacity duration-150' : 'w-full absolute -left-[9999px] top-0 opacity-0 pointer-events-none -z-10'}
      />

      {/* Discreet loading spinner while active widget initializes */}
      {!activeLoaded && (
        <div className="w-full py-4 flex items-center justify-center gap-2 text-white/50 text-xs">
          <div className="w-4 h-4 border-2 border-[#32a8dd] border-t-transparent rounded-full animate-spin" />
          <span>{isFr ? 'Chargement du comparateur de vols...' : 'Loading flight search engine...'}</span>
        </div>
      )}
    </div>
  );
};
