import React, { createContext, useContext, useState, useEffect } from 'react';

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
    'nav.hotels': 'Hotels',
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

    // Hotels Hero
    'hotels.badge': 'LUXURY HOTELS & RESORTS',
    'hotels.title.line1': 'Ultimate Luxury That',
    'hotels.title.line2': 'Provide You Real Comfort',
    'hotels.subtitle': 'Discover handpicked luxury hotels, boutique resorts, and world-class stays tailored for your ultimate relaxation.',

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

    // Footer
    'footer.company': 'Company',
    'footer.about': 'About us',
    'footer.careers': 'Careers',
    'footer.faqs': 'FAQs',
    'footer.contact': 'Contact',
    'footer.services': 'Services',
    'footer.flights': 'Flights',
    'footer.hotels': 'Hotels',
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
    'nav.hotels': 'Hôtels',
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

    // Hotels Hero
    'hotels.badge': 'HÔTELS & RÉSIDENCES DE LUXE',
    'hotels.title.line1': 'Le Luxe Absolu Pour',
    'hotels.title.line2': 'Un Confort Inégalé',
    'hotels.subtitle': 'Découvrez des hôtels d’exception, des complexes hôteliers et des séjours de prestige adaptés à votre détente.',

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

    // Footer
    'footer.company': 'Entreprise',
    'footer.about': 'À propos',
    'footer.careers': 'Carrières',
    'footer.faqs': 'FAQ',
    'footer.contact': 'Contact',
    'footer.services': 'Services',
    'footer.flights': 'Vols',
    'footer.hotels': 'Hôtels',
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
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('safarihoo_lang');
    return (saved === 'FR' || saved === 'EN') ? (saved as Language) : 'EN';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('safarihoo_lang', lang);
    } catch {
      // Ignore storage errors
    }
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['EN']?.[key] || key;
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
