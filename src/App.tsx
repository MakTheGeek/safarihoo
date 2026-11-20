import React, { useState, useEffect, useRef, Suspense, lazy, Component, ErrorInfo } from 'react';
import { ExternalLink } from 'lucide-react';
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
import { NavItem } from './types';
import { useLanguage } from './context/LanguageContext';
import { useCms } from './context/CmsContext';
import { SafarihooChatbot } from './components/SafarihooChatbot';

// Code-split secondary views, admin console, modals, and chat assistant
const AdminPanel = lazy(() => import('./components/AdminPanel').then(m => ({ default: m.AdminPanel })));
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

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class AppErrorBoundary extends Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, errorMessage: '' };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error?.message || 'Unexpected error' };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Safarihoo ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#090D16] text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#111827] border border-slate-800 rounded-xl p-6 text-center space-y-4">
            <h2 className="text-lg font-bold">Une erreur s’est produite</h2>
            <p className="text-xs text-slate-400 break-words">{this.state.errorMessage}</p>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, errorMessage: '' });
                window.location.hash = '';
              }}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white cursor-pointer"
            >
              Revenir à l’accueil
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function getInitialNav(): NavItem {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.toLowerCase();
    const search = new URLSearchParams(window.location.search);
    if (hash === '#admin' || search.get('admin') === '1') {
      return 'Admin';
    }
  }
  return 'Flights';
}

export default function App() {
  const { language } = useLanguage();
  const { links } = useCms();
  const [activeNav, setActiveNav] = useState<NavItem>(getInitialNav);
  const [hasVisitedHotels, setHasVisitedHotels] = useState(false);
  const [hasVisitedCars, setHasVisitedCars] = useState(false);
  const [hasVisitedAirHelp, setHasVisitedAirHelp] = useState(false);
  const [showAirHelpModal, setShowAirHelpModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [showCookiesModal, setShowCookiesModal] = useState(false);
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  const customBarLinks = links.filter((l) => l.active && l.placement === 'custom_bar');
  const isAdminView = activeNav === 'Admin';

  // Sync #admin URL hash cleanly
  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash.toLowerCase() === '#admin') {
        setActiveNav('Admin');
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Manage Flights hero video playback based on activeNav
  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;

    if (activeNav === 'Flights') {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          const onInteract = () => {
            if (heroVideoRef.current) {
              heroVideoRef.current.play().catch(() => {});
            }
            window.removeEventListener('click', onInteract);
            window.removeEventListener('touchstart', onInteract);
            window.removeEventListener('scroll', onInteract);
          };
          window.addEventListener('click', onInteract, { once: true, passive: true });
          window.addEventListener('touchstart', onInteract, { once: true, passive: true });
          window.addEventListener('scroll', onInteract, { once: true, passive: true });
        });
      }
    } else {
      video.pause();
    }
  }, [activeNav]);

  // Background idle warm-up of secondary widgets after 3.5s so Flights gets 100% of initial bandwidth
  useEffect(() => {
    const idleTimer = setTimeout(() => {
      setHasVisitedHotels(true);
      setHasVisitedCars(true);
      setHasVisitedAirHelp(true);
    }, 3500);
    return () => clearTimeout(idleTimer);
  }, []);

  const handleNavSelect = (item: NavItem) => {
    setActiveNav(item);
    if (typeof window !== 'undefined') {
      if (item === 'Admin') {
        if (window.location.hash.toLowerCase() !== '#admin') {
          window.history.replaceState(null, '', '#admin');
        }
      } else if (window.location.hash.toLowerCase() === '#admin') {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
    if (item === 'Hotels') setHasVisitedHotels(true);
    if (item === 'Cars') setHasVisitedCars(true);
    if (item === 'AirHelp') setHasVisitedAirHelp(true);
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
    <AppErrorBoundary>
      <div
        id="safarihoo-app"
        className="min-h-screen w-full bg-black text-white flex flex-col justify-between relative overflow-x-hidden"
      >
        {isAdminView ? (
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center bg-[#090D16]">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <AdminPanel onExitAdmin={() => handleNavSelect('Flights')} />
          </Suspense>
        ) : (
          <>
            {/* Top Header Section */}
            <Header
              activeNav={activeNav}
              onSelectNav={handleNavSelect}
              onOpenAirHelp={() => setShowAirHelpModal(true)}
              onOpenContact={() => setShowContactModal(true)}
            />

            {/* Core Services */}
            <div className={activeNav === 'Hotels' ? 'w-full block' : 'hidden'}>
              {(hasVisitedHotels || activeNav === 'Hotels') && (
                <HotelHeroPage
                  isActive={activeNav === 'Hotels'}
                  onStartJourney={handleStartJourney}
                  onViewDestinations={handleViewDestinations}
                />
              )}
            </div>

            <div className={activeNav === 'Cars' ? 'w-full block' : 'hidden'}>
              {(hasVisitedCars || activeNav === 'Cars') && (
                <CarHeroPage
                  isActive={activeNav === 'Cars'}
                  onStartJourney={handleStartJourney}
                  onViewDestinations={handleViewDestinations}
                />
              )}
            </div>

            <div className={activeNav === 'AirHelp' ? 'w-full block' : 'hidden'}>
              {(hasVisitedAirHelp || activeNav === 'AirHelp') && (
                <AirHelpHeroPage
                  isActive={activeNav === 'AirHelp'}
                  onStartJourney={handleStartJourney}
                  onViewDestinations={handleViewDestinations}
                />
              )}
            </div>

            {/* Secondary Pages */}
            <Suspense
              fallback={
                <div className="min-h-[50vh] flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              }
            >
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
                {activeNav === 'FAQs' && (
                  <FaqPage onOpenContact={() => handleNavSelect('Contact')} />
                )}
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
            <div
              className={
                activeNav === 'Flights' ? 'w-full flex flex-col items-center relative' : 'hidden'
              }
            >
              <div className="absolute inset-0 w-full h-[760px] md:h-[860px] lg:h-[920px] overflow-hidden pointer-events-none z-0 bg-neutral-950">
                <video
                  ref={heroVideoRef}
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
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
              </div>

              <div id="flights-page-view" className="w-full flex flex-col items-center relative z-10">
                <main className="w-full flex flex-col items-center justify-center flex-grow">
                  <HeroHeading
                    onStartJourney={handleStartJourney}
                    onViewDestinations={handleViewDestinations}
                  />
                  <BookingCard />
                </main>

                <BestDestinations />

                <PartnersMarquee
                  onOpenAirHelp={() => setShowAirHelpModal(true)}
                  onSelectService={(service) => handleNavSelect(service as NavItem)}
                />

                <ReviewsSection />

                <section className="w-full relative z-10">
                  <TrustBadges />
                </section>
              </div>
            </div>

            {/* Optional Custom Quick Links Bar (only displayed if admin publishes custom_bar links) */}
            {customBarLinks.length > 0 && (
              <div className="w-full bg-zinc-950 border-t border-white/10 py-3 px-4">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-4 text-xs">
                  {customBarLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target={link.openInNewTab ? '_blank' : undefined}
                      rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-1.5 text-white/80 hover:text-white transition-colors"
                    >
                      <span>{language === 'FR' ? link.labelFr : link.labelEn}</span>
                      {link.openInNewTab && <ExternalLink className="w-3 h-3 text-white/40" />}
                    </a>
                  ))}
                </div>
              </div>
            )}

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

            {/* Modals */}
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
            </Suspense>

            {/* 24/7 Virtual AI Assistant Safarihoo */}
            <SafarihooChatbot
              onNavigate={handleNavSelect}
              onStartJourney={handleStartJourney}
            />
          </>
        )}
      </div>
    </AppErrorBoundary>
  );
}
