import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCms } from './CmsContext';

export type Language = 'EN' | 'FR';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const translations: Record<Language, Record<string, string>> = {
  EN: {
    // Header
    'nav.flights': 'Flights',
    'nav.hotels': 'Hotels & Attractions',
    'nav.cars': 'Cars',
    'nav.airhelp': 'AirHelp',
    'nav.contact': 'Contact',
    'header.lang': 'Language',

    // Hero Main (Flights)
    'hero.badge': 'PREMIUM TRAVEL WEBSITE',
    'hero.title.line1': 'Explore the World',
    'hero.title.line2': 'With Confidence',
    'hero.subtitle': 'Seamless global travel planning, personalized experiences, and trusted booking — all in one place.',
    'hero.btn.start': 'Start Your Journey',
    'hero.btn.destinations': 'View Destinations',

    // Hotels & Attractions Hero
    'hotels.badge': 'LUXURY HOTELS & ATTRACTIONS',
    'hotels.title.line1': 'Ultimate Luxury That',
    'hotels.title.line2': 'Provide You Real Comfort',
    'hotels.subtitle': 'Discover handpicked luxury hotels, boutique resorts, and iconic attractions tailored for your ultimate journey.',

    // Attractions Editorial
    'attractions.kicker': 'YOUR JOURNEY',
    'attractions.about.badge': 'ABOUT NEPAL',
    'attractions.about.text':
      "Nepal is more than a destination — it's a journey. From Himalayan peaks to ancient cities, every experience brings you closer to its nature, culture and people.",

    // Cars Hero
    'cars.badge': 'PREMIUM CAR RENTAL',
    'cars.title.line1': 'Find Your Perfect Car',
    'cars.title.line2': 'Drive Your Dreams',
    'cars.subtitle': 'Compare top rental car deals worldwide. Flexible cancellation, clean vehicles, and 24/7 dedicated support.',

    // AirHelp Hero
    'airhelp.badge': 'FLIGHT COMPENSATION & ASSISTANCE',
    'airhelp.title.line1': 'Flight Delayed or Cancelled?',
    'airhelp.title.line2': 'Claim Up To $700 Compensation',
    'airhelp.subtitle': 'Check your eligibility in less than 2 minutes. We enforce your passenger rights with airlines worldwide.',

    // Trust Badges
    'trust.price.title': 'Best Price Guarantee',
    'trust.price.desc': 'We match the best prices',
    'trust.support.title': '24/7 Travel Support',
    'trust.support.desc': 'Always here when you need us',
    'trust.secure.title': 'Secure Booking',
    'trust.secure.desc': 'Your data is 100% protected',
    'trust.millions.title': 'Trusted by Millions',
    'trust.millions.desc': '10M+ happy travelers worldwide',

    // Best Destinations Section
    'dest.title': 'BEST DESTINATIONS',
    'dest.subtitle': 'Explore our top-rated global journeys, curated for extraordinary discoveries across New York, Paris, Egypt, Tokyo, and beyond.',
    'dest.cat.all': 'All',
    'dest.cat.cities': 'Cities',
    'dest.cat.historic': 'Historic',
    'dest.cat.beach': 'Beach',
    'dest.cat.wonders': 'Wonders',
    'dest.card1.title1': 'Explore Your',
    'dest.card1.title2': 'Favorite Journey',
    'dest.card1.sub': "Let's Make Our Life Better",
    'dest.card1.go': 'Go',
    'dest.card1.image':
      'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=1000&q=85',
    'dest.card2.discover': 'Discover',
    'dest.card2.scroll': 'Scroll & explore all places',
    'dest.card2.top': 'Top Destinations',
    'dest.card2.places': 'Places',
    'dest.card3.distance': 'Distance',
    'dest.card3.temp': 'Temp',
    'dest.card3.rating': 'Rating',
    'dest.card3.desc': 'Description',
    'dest.card3.book': 'Book Trip',
    'dest.card3.total': 'Total Price',

    // Reviews Section
    'reviews.title': 'What Our Travelers Say',
    'reviews.subtitle':
      'Explore genuine experiences from over 10 million adventurers, families, and frequent flyers saving on airfares, hotels, and journeys worldwide.',
    'reviews.ratingPill': '4.9/5 Average Rating • Over 120,000 Verified Reviews',
    'reviews.btnWriteReview': 'Write a Review',

    // About Page
    'about.title': 'Empowering Global Travelers with Intelligent Exploration',
    'about.subtitle':
      'Safarihoo is a next-generation travel meta-search engine built to connect wanderlust seekers with millions of flights, hand-picked hotels, flexible car rentals, and hassle-free flight compensation across the globe.',
    'about.missionTitle': 'Our Mission',
    'about.missionDesc':
      'To eliminate the friction of modern travel planning. We aggregate verified fares from premier travel suppliers and airlines into one ultra-fast, transparent, and user-friendly experience — with zero hidden booking fees.',
    'about.visionTitle': 'Our Global Vision',
    'about.visionDesc':
      'We envision a world where every traveler has instant access to fair, transparent journey planning, backed by passenger rights protection and AI-assisted destination insights.',
    'about.ctaTitle': 'Ready to Start Your Next Adventure?',
    'about.ctaSubtitle':
      'Compare cheap flights, find luxury hotel bargains, or book rental cars with the best price guarantee today.',

    // FAQ Page
    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle':
      'Find answers to common questions about searching, booking, passenger compensation rights, and managing your journeys on Safarihoo.',
    'faq.stillQuestions': 'Still have questions?',
    'faq.supportDesc':
      'Our global support team is available 24 hours a day, 7 days a week to help with your reservations and travel inquiries.',

    // Contact
    'contact.email': 'support@safarihoo.com',
    'contact.phone': '+242 05 675 6629',

    // Footer
    'footer.company': 'Company',
    'footer.about': 'About us',
    'footer.careers': 'Careers',
    'footer.faqs': 'FAQs',
    'footer.contact': 'Contact',
    'footer.services': 'Services',
    'footer.flights': 'Flights',
    'footer.hotels': 'Hotels & Attractions',
    'footer.cars': 'Cars',
    'footer.airhelp': 'AirHelp',
    'footer.resources': 'Resources',
    'footer.blog': 'Blog',
    'footer.newsletter': 'Newsletter',
    'footer.media': 'Media',
    'footer.whitepaper': 'Whitepaper',
    'footer.legal': 'Legal',
    'footer.privacy': 'Privacy',
    'footer.security': 'Security',
    'footer.terms': 'Terms of use',
    'footer.acceptance': 'Acceptance policy',
    'footer.cookies': 'Cookies',
    'footer.rights': 'All rights reserved.',

    // Modals & Common
    'modal.close': 'Close',
    'modal.submit': 'Submit',
    'modal.subscribe': 'Subscribe',
  },
  FR: {
    // Header
    'nav.flights': 'Vols',
    'nav.hotels': 'Hôtels & Attractions',
    'nav.cars': 'Voitures',
    'nav.airhelp': 'AirHelp',
    'nav.contact': 'Contact',
    'header.lang': 'Langue',

    // Hero Main (Flights)
    'hero.badge': 'SITE DE VOYAGE PREMIUM',
    'hero.title.line1': 'Explorez le Monde',
    'hero.title.line2': 'En Toute Sérénité',
    'hero.subtitle': 'Planification de voyages simplifiée, expériences sur mesure et réservations fiables — tout au même endroit.',
    'hero.btn.start': 'Commencer Votre Voyage',
    'hero.btn.destinations': 'Voir les Destinations',

    // Hotels & Attractions Hero
    'hotels.badge': 'HÔTELS DE LUXE & ATTRACTIONS',
    'hotels.title.line1': 'Le Luxe Absolu Pour',
    'hotels.title.line2': 'Un Confort Inégalé',
    'hotels.subtitle': 'Découvrez des hôtels d’exception, des complexes hôteliers et des attractions emblématiques adaptés à votre séjour.',

    // Attractions Editorial
    'attractions.kicker': 'VOTRE VOYAGE',
    'attractions.about.badge': 'À PROPOS DU NÉPAL',
    'attractions.about.text':
      'Le Népal est plus qu’une destination — c’est un voyage. Des sommets himalayens aux cités anciennes, chaque expérience vous rapproche de sa nature, de sa culture et de ses habitants.',

    // Cars Hero
    'cars.badge': 'LOCATION DE VOITURE PREMIUM',
    'cars.title.line1': 'Trouvez Votre Voiture Idéale',
    'cars.title.line2': 'Conduisez Vos Rêves',
    'cars.subtitle': 'Comparez les meilleures offres de location dans le monde entier. Annulation flexible, véhicules impeccables et assistance 24/7.',

    // AirHelp Hero
    'airhelp.badge': 'INDEMNISATION & ASSISTANCE VOL',
    'airhelp.title.line1': 'Vol Retardé ou Annulé ?',
    'airhelp.title.line2': "Réclamez Jusqu'à 700 $ d'Indemnisation",
    'airhelp.subtitle': 'Vérifiez votre éligibilité en moins de 2 minutes. Nous faisons valoir vos droits auprès des compagnies aériennes.',

    // Trust Badges
    'trust.price.title': 'Garantie Meilleur Prix',
    'trust.price.desc': 'Nous garantissons les meilleurs tarifs',
    'trust.support.title': 'Support Voyage 24/7',
    'trust.support.desc': 'Toujours là pour vous accompagner',
    'trust.secure.title': 'Réservation Sécurisée',
    'trust.secure.desc': 'Vos données sont protégées à 100%',
    'trust.millions.title': 'Plébiscité par des Millions',
    'trust.millions.desc': '+10M de voyageurs satisfaits dans le monde',

    // Best Destinations Section
    'dest.title': 'MEILLEURES DESTINATIONS',
    'dest.subtitle': 'Explorez nos itinéraires les plus prisés à travers New York, Paris, l’Égypte, Tokyo et bien d’autres horizons.',
    'dest.cat.all': 'Tous',
    'dest.cat.cities': 'Villes',
    'dest.cat.historic': 'Historique',
    'dest.cat.beach': 'Plages',
    'dest.cat.wonders': 'Merveilles',
    'dest.card1.title1': 'Explorez Votre',
    'dest.card1.title2': 'Prochain Voyage',
    'dest.card1.sub': 'Sublimez vos aventures au quotidien',
    'dest.card1.go': 'Partir',
    'dest.card1.image':
      'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=1000&q=85',
    'dest.card2.discover': 'Découvrir',
    'dest.card2.scroll': 'Faites défiler et explorez',
    'dest.card2.top': 'Top Destinations',
    'dest.card2.places': 'Lieux',
    'dest.card3.distance': 'Distance',
    'dest.card3.temp': 'Temp.',
    'dest.card3.rating': 'Note',
    'dest.card3.desc': 'Description',
    'dest.card3.book': 'Réserver',
    'dest.card3.total': 'Prix Total',

    // Reviews Section
    'reviews.title': 'Ce Que Disent Nos Voyageurs',
    'reviews.subtitle':
      'Découvrez les retours d’expérience de plus de 10 millions de globe-trotters, familles et professionnels qui économisent sur leurs séjours et leurs vols avec Safarihoo.',
    'reviews.ratingPill': 'Note globale 4.9/5 • Plus de 120 000 avis vérifiés',
    'reviews.btnWriteReview': 'Donner mon avis',

    // About Page
    'about.title': 'Une exploration intelligente au service des voyageurs du monde entier',
    'about.subtitle':
      "Safarihoo est un métamoteur de recherche de voyages nouvelle génération conçu pour connecter les passionnés d'aventure à des millions de vols, d'hôtels d'exception, de locations de voitures flexibles et d'indemnisations de vol simples à travers le globe.",
    'about.missionTitle': 'Notre Mission',
    'about.missionDesc':
      "Éliminer les frictions de la planification de voyage moderne. Nous agrégeons les tarifs vérifiés des compagnies et voyagistes majeurs au sein d'une expérience ultra-rapide, transparente et intuitive — sans aucun frais de réservation caché.",
    'about.visionTitle': 'Notre Vision Globale',
    'about.visionDesc':
      "Nous bâtissons un univers où chaque voyageur accède instantanément à une planification équitable et transparente, appuyée par la défense des droits des passagers et des recommandations fiables.",
    'about.ctaTitle': 'Prêt à vivre votre prochaine aventure ?',
    'about.ctaSubtitle':
      "Comparez les vols pas chers, dénichez des hôtels de luxe ou louez une voiture au meilleur tarif garanti dès maintenant.",

    // FAQ Page
    'faq.title': 'Foire Aux Questions',
    'faq.subtitle':
      'Trouvez des réponses claires à vos questions sur la recherche de vols, les réservations d’hôtels, la location de véhicules et l’indemnisation de vol AirHelp sur Safarihoo.',
    'faq.stillQuestions': 'Vous avez encore des questions ?',
    'faq.supportDesc':
      'Notre équipe d’assistance internationale est disponible 24h/24 et 7j/7 pour vous orienter dans vos réservations et vos voyages.',

    // Contact
    'contact.email': 'support@safarihoo.com',
    'contact.phone': '+242 05 675 6629',

    // Footer
    'footer.company': 'Entreprise',
    'footer.about': 'À propos',
    'footer.careers': 'Carrières',
    'footer.faqs': 'FAQ',
    'footer.contact': 'Contact',
    'footer.services': 'Services',
    'footer.flights': 'Vols',
    'footer.hotels': 'Hôtels & Attractions',
    'footer.cars': 'Voitures',
    'footer.airhelp': 'AirHelp',
    'footer.resources': 'Ressources',
    'footer.blog': 'Blog',
    'footer.newsletter': 'Newsletter',
    'footer.media': 'Médias',
    'footer.whitepaper': 'Livre Blanc',
    'footer.legal': 'Légal',
    'footer.privacy': 'Confidentialité',
    'footer.security': 'Sécurité',
    'footer.terms': "Conditions d'utilisation",
    'footer.acceptance': "Politique d'acceptation",
    'footer.cookies': 'Cookies',
    'footer.rights': 'Tous droits réservés.',

    // Modals & Common
    'modal.close': 'Fermer',
    'modal.submit': 'Envoyer',
    'modal.subscribe': "S'abonner",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getContentText } = useCms();
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('safarihoo_lang');
      if (saved === 'FR' || saved === 'EN') return saved as Language;
    } catch {
      // Ignore storage errors
    }
    return 'EN';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('safarihoo_lang', lang);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = lang.toLowerCase();
      }
    } catch {
      // Ignore storage errors
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language.toLowerCase();
    }
  }, [language]);

  // Synchronize across tabs or external updates
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'safarihoo_lang' && (e.newValue === 'FR' || e.newValue === 'EN')) {
        setLanguageState(e.newValue as Language);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const t = (key: string): string => {
    const fallback = translations[language]?.[key] || translations['EN']?.[key] || key;
    return getContentText(key, language, fallback);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
