import React, { useState, Suspense, lazy } from 'react';
import { Header } from './components/Header';
import { HeroHeading } from './components/HeroHeading';
import { BookingCard } from './components/BookingCard';
import { BestDestinations } from './components/BestDestinations';
import { PartnersMarquee } from './components/PartnersMarquee';
import { ReviewsSection } from './components/ReviewsSection';
import { TrustBadges } from './components/TrustBadges';
import { Footer } from './components/Footer';
import { NavItem } from './types';

// Code-split secondary views, modals, and chat assistant for instant initial page loading
const HotelHeroPage = lazy(() => import('./components/HotelHeroPage').then(m => ({ default: m.HotelHeroPage })));
const CarHeroPage = lazy(() => import('./components/CarHeroPage').then(m => ({ default: m.CarHeroPage })));
const AirHelpHeroPage = lazy(() => import('./components/AirHelpHeroPage').then(m => ({ default: m.AirHelpHeroPage })));
const ContactPage = lazy(() => import('./components/ContactPage').then(m => ({ default: m.ContactPage })));
const AboutPage = lazy(() => import('./components/AboutPage').then(m => ({ default: m.AboutPage })));
const CareersPage = lazy(() => import('./components/CareersPage').then(m => ({ default: m.CareersPage })));
const FaqPage = lazy(() => import('./components/FaqPage').then(m => ({ default: m.FaqPage })));
const WhitepaperPage = lazy(() => import('./components/WhitepaperPage').then(m => ({ default: m.WhitepaperPage })));
const PrivacyPage = lazy(() => import('./components/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const SecurityPage = lazy(() => import('./components/SecurityPage').then(m => ({ default: m.SecurityPage })));
const TermsPage = lazy(() => import('./components/TermsPage').then(m => ({ default: m.TermsPage })));
const AcceptancePolicyPage = lazy(() => import('./components/AcceptancePolicyPage').then(m => ({ default: m.AcceptancePolicyPage })));

const AirHelpModal = lazy(() => import('./components/AirHelpModal').then(m => ({ default: m.AirHelpModal })));
const ContactModal = lazy(() => import('./components/ContactModal').then(m => ({ default: m.ContactModal })));
const NewsletterModal = lazy(() => import('./components/NewsletterModal').then(m => ({ default: m.NewsletterModal })));
const CookiesModal = lazy(() => import('./components/CookiesModal').then(m => ({ default: m.CookiesModal })));
const TravelAssistantChat = lazy(() => import('./components/TravelAssistantChat').then(m => ({ default: m.TravelAssistantChat })));

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

      {/* Main Page Content */}
      <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>}>
        <div className={activeNav === 'Hotels' ? 'w-full block' : 'hidden'}>
          {activeNav === 'Hotels' && (
            <HotelHeroPage
              onStartJourney={handleStartJourney}
              onViewDestinations={handleViewDestinations}
            />
          )}
        </div>

        <div className={activeNav === 'Cars' ? 'w-full block' : 'hidden'}>
          {activeNav === 'Cars' && (
            <CarHeroPage
              onStartJourney={handleStartJourney}
              onViewDestinations={handleViewDestinations}
            />
          )}
        </div>

        <div className={activeNav === 'AirHelp' ? 'w-full block' : 'hidden'}>
          {activeNav === 'AirHelp' && (
            <AirHelpHeroPage
              onStartJourney={handleStartJourney}
              onViewDestinations={handleViewDestinations}
            />
          )}
        </div>

        <div className={activeNav === 'Contact' ? 'w-full block' : 'hidden'}>
          {activeNav === 'Contact' && <ContactPage />}
        </div>

        <div className={activeNav === 'About' ? 'w-full block' : 'hidden'}>
          {activeNav === 'About' && (
            <AboutPage
              onStartJourney={handleStartJourney}
              onNavigateFlights={() => handleNavSelect('Flights')}
            />
          )}
        </div>

        <div className={activeNav === 'Careers' ? 'w-full block' : 'hidden'}>
          {activeNav === 'Careers' && <CareersPage />}
        </div>

        <div className={activeNav === 'FAQs' ? 'w-full block' : 'hidden'}>
          {activeNav === 'FAQs' && <FaqPage onOpenContact={() => handleNavSelect('Contact')} />}
        </div>

        <div className={activeNav === 'Whitepaper' ? 'w-full block' : 'hidden'}>
          {activeNav === 'Whitepaper' && <WhitepaperPage />}
        </div>

        <div className={activeNav === 'Privacy' ? 'w-full block' : 'hidden'}>
          {activeNav === 'Privacy' && <PrivacyPage />}
        </div>

        <div className={activeNav === 'Security' ? 'w-full block' : 'hidden'}>
          {activeNav === 'Security' && <SecurityPage />}
        </div>

        <div className={activeNav === 'Terms' ? 'w-full block' : 'hidden'}>
          {activeNav === 'Terms' && <TermsPage />}
        </div>

        <div className={activeNav === 'Acceptance' ? 'w-full block' : 'hidden'}>
          {activeNav === 'Acceptance' && <AcceptancePolicyPage />}
        </div>
      </Suspense>

      {/* Default Flights / Home Page View */}
      <div className={activeNav === 'Flights' ? 'w-full flex flex-col items-center relative' : 'hidden'}>
        {/* Cinematic Video Background for Flights Homepage */}
        <div className="absolute inset-0 w-full h-[760px] md:h-[860px] lg:h-[920px] overflow-hidden pointer-events-none z-0 bg-neutral-950">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
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
          </video>
          {/* Subtle smooth gradient fade at the bottom to blend with the page */}
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

          {/* Best Destinations Showcase Section */}
          <BestDestinations />

          {/* Official Partners Marquee Ticker */}
          <PartnersMarquee
            onOpenAirHelp={() => setShowAirHelpModal(true)}
            onSelectService={(service) => handleNavSelect(service as NavItem)}
          />

          {/* Reviews Showcase Section */}
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

      {/* Modals loaded lazily on demand */}
      <Suspense fallback={null}>
        {showAirHelpModal && (
          <AirHelpModal
            isOpen={showAirHelpModal}
            onClose={() => setShowAirHelpModal(false)}
          />
        )}

        {showContactModal && (
          <ContactModal
            isOpen={showContactModal}
            onClose={() => setShowContactModal(false)}
          />
        )}

        {showNewsletterModal && (
          <NewsletterModal
            isOpen={showNewsletterModal}
            onClose={() => setShowNewsletterModal(false)}
          />
        )}

        {showCookiesModal && (
          <CookiesModal
            isOpen={showCookiesModal}
            onClose={() => setShowCookiesModal(false)}
          />
        )}

        {/* AI Travel Assistant Chatbot loaded lazily */}
        <TravelAssistantChat
          onNavigateToTab={(tab) => handleNavSelect(tab)}
        />
      </Suspense>
    </div>
  );
}
