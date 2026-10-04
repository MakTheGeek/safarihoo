import React, { useRef, useEffect } from 'react';
import { HeroHeading } from './HeroHeading';
import { HotelTripWidget } from './HotelTripWidget';
import { TrustBadges } from './TrustBadges';
import { useLanguage } from '../context/LanguageContext';

interface HotelHeroPageProps {
  isActive?: boolean;
  onStartJourney?: () => void;
  onViewDestinations?: () => void;
}

export const HotelHeroPage: React.FC<HotelHeroPageProps> = ({
  isActive = true,
  onStartJourney,
  onViewDestinations,
}) => {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          const resumeOnInteraction = () => {
            if (videoRef.current) {
              videoRef.current.play().catch(() => {});
            }
            window.removeEventListener('click', resumeOnInteraction);
            window.removeEventListener('touchstart', resumeOnInteraction);
            window.removeEventListener('scroll', resumeOnInteraction);
          };
          window.addEventListener('click', resumeOnInteraction, { once: true, passive: true });
          window.addEventListener('touchstart', resumeOnInteraction, { once: true, passive: true });
          window.addEventListener('scroll', resumeOnInteraction, { once: true, passive: true });
        });
      }
    } else {
      video.pause();
    }
  }, [isActive]);

  return (
    <div id="hotel-page-view" className="w-full flex flex-col items-center relative">
      {/* Cinematic Video Background for Hotels */}
      <div className="absolute inset-0 w-full h-[760px] md:h-[860px] lg:h-[920px] overflow-hidden pointer-events-none z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="https://res.cloudinary.com/opy809y1/video/upload/so_0,q_auto,f_auto,w_1280/v1787690330/Hotels.Video.jpg"
          className="w-full h-full object-cover object-center opacity-85 scale-[1.02] filter brightness-105 contrast-100"
          aria-hidden="true"
        >
          <source
            src="https://res.cloudinary.com/opy809y1/video/upload/q_auto,w_1280/v1787690330/Hotels.Video.webm"
            type="video/webm"
          />
          <source
            src="https://res.cloudinary.com/opy809y1/video/upload/q_auto,w_1280/v1787690330/Hotels.Video.mp4"
            type="video/mp4"
          />
        </video>
        {/* Subtle smooth gradient fade at the bottom to blend with the page while keeping video vivid */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
      </div>

      <div className="w-full flex flex-col items-center relative z-10">
        {/* Hero Main Content */}
        <main className="w-full flex flex-col items-center justify-center flex-grow">
          {/* Main Title Section without buttons */}
          <HeroHeading
            badgeText={t('hotels.badge')}
            title={
              <>
                {t('hotels.title.line1')}<br />
                {t('hotels.title.line2')}
              </>
            }
            subtitle={t('hotels.subtitle')}
            showActions={false}
            onStartJourney={onStartJourney}
            onViewDestinations={onViewDestinations}
          />

          {/* Third-Party Hotel Search Widget */}
          <HotelTripWidget />
        </main>

        {/* Trust & Features Row */}
        <section className="w-full relative z-10 mt-6">
          <TrustBadges />
        </section>
      </div>
    </div>
  );
};
