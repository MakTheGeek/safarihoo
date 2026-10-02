import React from 'react';
import { HeroHeading } from './HeroHeading';
import { AirHelpWidget } from './AirHelpWidget';
import { TrustBadges } from './TrustBadges';
import { useLanguage } from '../context/LanguageContext';

interface AirHelpHeroPageProps {
  onStartJourney?: () => void;
  onViewDestinations?: () => void;
}

export const AirHelpHeroPage: React.FC<AirHelpHeroPageProps> = ({
  onStartJourney,
  onViewDestinations,
}) => {
  const { t } = useLanguage();

  return (
    <div id="airhelp-page-view" className="w-full flex flex-col items-center relative">
      {/* Cinematic Video Background for AirHelp */}
      <div className="absolute inset-0 w-full h-[760px] md:h-[860px] lg:h-[920px] overflow-hidden pointer-events-none z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="https://res.cloudinary.com/opy809y1/video/upload/so_0,q_auto,f_auto,w_1280/v1787691909/AirHelp.video.jpg"
          className="w-full h-full object-cover object-center opacity-85 scale-[1.02] filter brightness-105 contrast-100"
          aria-hidden="true"
        >
          <source
            src="https://res.cloudinary.com/opy809y1/video/upload/q_auto,w_1280/v1787691909/AirHelp.video.webm"
            type="video/webm"
          />
          <source
            src="https://res.cloudinary.com/opy809y1/video/upload/q_auto,w_1280/v1787691909/AirHelp.video.mp4"
            type="video/mp4"
          />
          <source
            src="https://res.cloudinary.com/opy809y1/video/upload/v1787691909/AirHelp.video.mp4"
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
          {/* Main Title Section for AirHelp */}
          <HeroHeading
            badgeText={t('airhelp.badge')}
            title={
              <>
                {t('airhelp.title.line1')}<br />
                {t('airhelp.title.line2')}
              </>
            }
            subtitle={t('airhelp.subtitle')}
            showActions={false}
            onStartJourney={onStartJourney}
            onViewDestinations={onViewDestinations}
          />

          {/* AirHelp Claim Widget */}
          <AirHelpWidget />
        </main>

        {/* Trust & Features Row */}
        <section className="w-full relative z-10 mt-6">
          <TrustBadges />
        </section>
      </div>
    </div>
  );
};

