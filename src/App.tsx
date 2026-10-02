import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroHeading } from './components/HeroHeading';
import { BookingCard } from './components/BookingCard';
import { BestDestinations } from './components/BestDestinations';
import { PartnersMarquee } from './components/PartnersMarquee';
import { ReviewsSection } from './components/ReviewsSection';
import { TrustBadges } from './components/TrustBadges';
import { Footer } from './components/Footer';
import { HotelHeroPage } from './components/HotelHeroPage';
import { CarHeroPage } from './components/CarHeroPage';
import { AirHelpHeroPage } from './components/AirHelpHeroPage';
import { ContactPage } from './components/ContactPage';
import { AboutPage } from './components/AboutPage';
import { CareersPage } from './components/CareersPage';
import { FaqPage } from './components/FaqPage';
import { WhitepaperPage } from './components/WhitepaperPage';
import { PrivacyPage } from './components/PrivacyPage';
import { SecurityPage } from './components/SecurityPage';
import { TermsPage } from './components/TermsPage';
import { AcceptancePolicyPage } from './components/AcceptancePolicyPage';
import { AirHelpModal } from './components/AirHelpModal';
import { ContactModal } from './components/ContactModal';
import { NewsletterModal } from './components/NewsletterModal';
import { CookiesModal } from './components/CookiesModal';
import { TravelAssistantChat } from './components/TravelAssistantChat';
import { NavItem } from './types';

export default function App() {
  const [activeNav, setActiveNav] = useState<NavItem>('Flights');
  const [showAirHelpModal, setShowAirHelpModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [showCookiesModal, setShowCookiesModal] = useState(false);

  const handleNavSelect = (item: NavItem) => {
    setActiveNav(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Multi-stage resize dispatch to force instant recalculation of external iframes
    window.dispatchEvent(new Event('resize'));
    setTimeout(() => window.dispatchEvent(new Event('resize')), 20);
    setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
    setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
    setTimeout(() => window.dispatchEvent(new Event('resize')), 600);
  };

  const handleStartJourney = () => {
    const bookingWidget = document.getElementById('main-booking-widget');
    if (bookingWidget) {
      bookingWidget.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewDestinations = () => {
    const bestDestinationsSection = document.getElementById('best-destinations-section');
    if (bestDestinationsSection) {
      bestDestinationsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      id="safarihoo-app"
      className="min-h-screen w-full bg-black text-white flex flex-col justify-between relative overflow-x-hidden"
    >
      {/* Top Header Section */}
      <Header
        activeNav={activeNav}
        onSelectNav={handleNavSelect}
        onOpenAirHelp={() => setShowAirHelpModal(true)}
        onOpenContact={() => setShowContactModal(true)}
      />

      {/* Main Page Content - Pre-mounted in DOM to guarantee instant zero-latency page loading */}
      <div className={activeNav === 'Hotels' ? 'w-full block' : 'hidden'}>
        <HotelHeroPage
          onStartJourney={handleStartJourney}
          onViewDestinations={handleViewDestinations}
        />
      </div>

      <div className={activeNav === 'Cars' ? 'w-full block' : 'hidden'}>
        <CarHeroPage
          onStartJourney={handleStartJourney}
          onViewDestinations={handleViewDestinations}
        />
      </div>

      <div className={activeNav === 'AirHelp' ? 'w-full block' : 'hidden'}>
        <AirHelpHeroPage
          onStartJourney={handleStartJourney}
          onViewDestinations={handleViewDestinations}
        />
      </div>

      <div className={activeNav === 'Contact' ? 'w-full block' : 'hidden'}>
        <ContactPage />
      </div>

      <div className={activeNav === 'About' ? 'w-full block' : 'hidden'}>
        <AboutPage
          onStartJourney={handleStartJourney}
          onNavigateFlights={() => handleNavSelect('Flights')}
        />
      </div>

      <div className={activeNav === 'Careers' ? 'w-full block' : 'hidden'}>
        <CareersPage />
      </div>

      <div className={activeNav === 'FAQs' ? 'w-full block' : 'hidden'}>
        <FaqPage onOpenContact={() => handleNavSelect('Contact')} />
      </div>

      <div className={activeNav === 'Whitepaper' ? 'w-full block' : 'hidden'}>
        <WhitepaperPage />
      </div>

      <div className={activeNav === 'Privacy' ? 'w-full block' : 'hidden'}>
        <PrivacyPage />
      </div>

      <div className={activeNav === 'Security' ? 'w-full block' : 'hidden'}>
        <SecurityPage />
      </div>

      <div className={activeNav === 'Terms' ? 'w-full block' : 'hidden'}>
        <TermsPage />
      </div>

      <div className={activeNav === 'Acceptance' ? 'w-full block' : 'hidden'}>
        <AcceptancePolicyPage />
      </div>

      {/* Default Flights / Home Page View */}
      <div className={activeNav === 'Flights' ? 'w-full flex flex-col items-center relative' : 'hidden'}>
        {/* Cinematic Video Background for Flights Homepage */}
        <div className="absolute inset-0 w-full h-[760px] md:h-[860px] lg:h-[920px] overflow-hidden pointer-events-none z-0 bg-neutral-950">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="https://res.cloudinary.com/opy809y1/video/upload/so_0,q_auto,f_auto,w_1280/v1787504639/kling_20260824_Image_to_Video_Create_a_p_213_0.jpg"
            className="w-full h-full object-cover object-center opacity-85 scale-[1.02] filter brightness-105 contrast-100"
            aria-hidden="true"
          >
            <source
              src="https://res.cloudinary.com/opy809y1/video/upload/q_auto,w_1280/v1787504639/kling_20260824_Image_to_Video_Create_a_p_213_0.webm"
              type="video/webm"
            />
            <source
              src="https://res.cloudinary.com/opy809y1/video/upload/q_auto,w_1280/v1787504639/kling_20260824_Image_to_Video_Create_a_p_213_0.mp4"
              type="video/mp4"
            />
            <source
              src="https://res.cloudinary.com/opy809y1/video/upload/v1787504639/kling_20260824_Image_to_Video_Create_a_p_213_0.mp4"
              type="video/mp4"
            />
          </video>
          {/* Subtle smooth gradient fade at the bottom to blend with the page while keeping the video bright and vivid */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
        </div>

        <div id="flights-page-view" className="w-full flex flex-col items-center relative z-10">
          <main className="w-full flex flex-col items-center justify-center flex-grow">
            {/* Main Title & CTA Section */}
            <HeroHeading
              onStartJourney={handleStartJourney}
              onViewDestinations={handleViewDestinations}
            />

            {/* Search Widget in Hero */}
            <BookingCard />
          </main>

          {/* Best Destinations Showcase Section (Reference Layout) */}
          <BestDestinations />

          {/* Official Partners Marquee Ticker (Aviasales, Trip.com, GetrentalCar, AirHelp, Booking.com) */}
          <PartnersMarquee
            onOpenAirHelp={() => setShowAirHelpModal(true)}
            onSelectService={(service) => handleNavSelect(service as NavItem)}
          />

          {/* Reviews Showcase Section (Inspired by User Reference Image) */}
          <ReviewsSection />

          {/* Trust & Features Row */}
          <section className="w-full relative z-10">
            <TrustBadges />
          </section>
        </div>
      </div>

      {/* Main Footer Section */}
      <Footer
        onOpenAirHelp={() => setShowAirHelpModal(true)}
        onOpenContact={() => setShowContactModal(true)}
        onSelectService={(service) => {
          handleNavSelect(service as NavItem);
        }}
        onSelectPage={(page) => {
          handleNavSelect(page);
        }}
        onOpenNewsletter={() => setShowNewsletterModal(true)}
        onOpenCookies={() => setShowCookiesModal(true)}
      />

      {/* Modals for Functional Navigation */}
      <AirHelpModal
        isOpen={showAirHelpModal}
        onClose={() => setShowAirHelpModal(false)}
      />

      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />

      <NewsletterModal
        isOpen={showNewsletterModal}
        onClose={() => setShowNewsletterModal(false)}
      />

      <CookiesModal
        isOpen={showCookiesModal}
        onClose={() => setShowCookiesModal(false)}
      />

      {/* AI Travel Assistant Chatbot */}
      <TravelAssistantChat
        onNavigateToTab={(tab) => handleNavSelect(tab)}
      />
    </div>
  );
}

