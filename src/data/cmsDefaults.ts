import everestImg from '../assets/images/attraction_everest_escape_1795099729350.jpg';
import annapurnaImg from '../assets/images/attraction_annapurna_trail_1795099729233.jpg';
import pokharaImg from '../assets/images/attraction_pokhara_retreat_1795099729185.jpg';
import kathmanduImg from '../assets/images/attraction_kathmandu_soul_1795099729143.jpg';
import himalayanImg from '../assets/images/attraction_himalayan_escape_1795099729427.jpg';
import madeForYouImg from '../assets/images/attraction_made_for_you_1795099729307.jpg';
import {
  CmsContentGroup,
  SiteAttractionItem,
  SiteDestinationItem,
  SiteReviewItem,
} from '../types';

export { madeForYouImg };

export interface EditableContentDescriptor {
  key: string;
  group: CmsContentGroup;
  label: string;
  defaultEn: string;
  defaultFr: string;
}

export const EDITABLE_CONTENT_FIELDS: EditableContentDescriptor[] = [
  // Flights Hero
  {
    key: 'hero.badge',
    group: 'hero',
    label: 'Flights Top Badge',
    defaultEn: 'PREMIUM TRAVEL WEBSITE',
    defaultFr: 'SITE DE VOYAGE PREMIUM',
  },
  {
    key: 'hero.title.line1',
    group: 'hero',
    label: 'Flights Title Line 1',
    defaultEn: 'Explore the World',
    defaultFr: 'Explorez le Monde',
  },
  {
    key: 'hero.title.line2',
    group: 'hero',
    label: 'Flights Title Line 2',
    defaultEn: 'With Confidence',
    defaultFr: 'En Toute Sérénité',
  },
  {
    key: 'hero.subtitle',
    group: 'hero',
    label: 'Flights Subtitle',
    defaultEn:
      'Seamless global travel planning, personalized experiences, and trusted booking — all in one place.',
    defaultFr:
      'Planification de voyages simplifiée, expériences sur mesure et réservations fiables — tout au même endroit.',
  },
  {
    key: 'hero.btn.start',
    group: 'hero',
    label: 'Primary CTA Button',
    defaultEn: 'Start Your Journey',
    defaultFr: 'Commencer Votre Voyage',
  },
  {
    key: 'hero.btn.destinations',
    group: 'hero',
    label: 'Secondary CTA Button',
    defaultEn: 'View Destinations',
    defaultFr: 'Voir les Destinations',
  },

  // Hotels & Attractions Hero
  {
    key: 'hotels.badge',
    group: 'hotels',
    label: 'Hotels & Attractions Badge',
    defaultEn: 'LUXURY HOTELS & ATTRACTIONS',
    defaultFr: 'HÔTELS DE LUXE & ATTRACTIONS',
  },
  {
    key: 'hotels.title.line1',
    group: 'hotels',
    label: 'Hotels Title Line 1',
    defaultEn: 'Ultimate Luxury That',
    defaultFr: 'Le Luxe Absolu Pour',
  },
  {
    key: 'hotels.title.line2',
    group: 'hotels',
    label: 'Hotels Title Line 2',
    defaultEn: 'Provide You Real Comfort',
    defaultFr: 'Un Confort Inégalé',
  },
  {
    key: 'hotels.subtitle',
    group: 'hotels',
    label: 'Hotels Subtitle',
    defaultEn:
      'Discover handpicked luxury hotels, boutique resorts, and iconic attractions tailored for your ultimate journey.',
    defaultFr:
      'Découvrez des hôtels d’exception, des complexes hôteliers et des attractions emblématiques adaptés à votre séjour.',
  },

  // Attractions Editorial Section
  {
    key: 'attractions.kicker',
    group: 'attractions',
    label: 'Attractions Kicker Label',
    defaultEn: 'YOUR JOURNEY',
    defaultFr: 'VOTRE VOYAGE',
  },
  {
    key: 'attractions.about.badge',
    group: 'attractions',
    label: 'About Section Tag',
    defaultEn: 'ABOUT NEPAL',
    defaultFr: 'À PROPOS DU NÉPAL',
  },
  {
    key: 'attractions.about.text',
    group: 'attractions',
    label: 'About Editorial Paragraph',
    defaultEn:
      "Nepal is more than a destination — it's a journey. From Himalayan peaks to ancient cities, every experience brings you closer to its nature, culture and people.",
    defaultFr:
      'Le Népal est plus qu’une destination — c’est un voyage. Des sommets himalayens aux cités anciennes, chaque expérience vous rapproche de sa nature, de sa culture et de ses habitants.',
  },

  // Cars Hero
  {
    key: 'cars.badge',
    group: 'cars',
    label: 'Cars Badge',
    defaultEn: 'PREMIUM CAR RENTAL',
    defaultFr: 'LOCATION DE VOITURE PREMIUM',
  },
  {
    key: 'cars.title.line1',
    group: 'cars',
    label: 'Cars Title Line 1',
    defaultEn: 'Find Your Perfect Car',
    defaultFr: 'Trouvez Votre Voiture Idéale',
  },
  {
    key: 'cars.title.line2',
    group: 'cars',
    label: 'Cars Title Line 2',
    defaultEn: 'Drive Your Dreams',
    defaultFr: 'Conduisez Vos Rêves',
  },
  {
    key: 'cars.subtitle',
    group: 'cars',
    label: 'Cars Subtitle',
    defaultEn:
      'Compare top rental car deals worldwide. Flexible cancellation, clean vehicles, and 24/7 dedicated support.',
    defaultFr:
      'Comparez les meilleures offres de location dans le monde entier. Annulation flexible, véhicules impeccables et assistance 24/7.',
  },

  // AirHelp Hero
  {
    key: 'airhelp.badge',
    group: 'airhelp',
    label: 'AirHelp Badge',
    defaultEn: 'FLIGHT COMPENSATION & ASSISTANCE',
    defaultFr: 'INDEMNISATION & ASSISTANCE VOL',
  },
  {
    key: 'airhelp.title.line1',
    group: 'airhelp',
    label: 'AirHelp Title Line 1',
    defaultEn: 'Flight Delayed or Cancelled?',
    defaultFr: 'Vol Retardé ou Annulé ?',
  },
  {
    key: 'airhelp.title.line2',
    group: 'airhelp',
    label: 'AirHelp Title Line 2',
    defaultEn: 'Claim Up To $700 Compensation',
    defaultFr: "Réclamez Jusqu'à 700 $ d'Indemnisation",
  },
  {
    key: 'airhelp.subtitle',
    group: 'airhelp',
    label: 'AirHelp Subtitle',
    defaultEn:
      'Check your eligibility in less than 2 minutes. We enforce your passenger rights with airlines worldwide.',
    defaultFr:
      'Vérifiez votre éligibilité en moins de 2 minutes. Nous faisons valoir vos droits auprès des compagnies aériennes.',
  },

  // Best Destinations Section Copy
  {
    key: 'dest.title',
    group: 'destinations',
    label: 'Best Destinations Heading',
    defaultEn: 'BEST DESTINATIONS',
    defaultFr: 'MEILLEURES DESTINATIONS',
  },
  {
    key: 'dest.subtitle',
    group: 'destinations',
    label: 'Best Destinations Subtitle',
    defaultEn:
      'Explore our top-rated global journeys, curated for extraordinary discoveries across New York, Paris, Egypt, Tokyo, and beyond.',
    defaultFr:
      'Explorez nos itinéraires les plus prisés à travers New York, Paris, l’Égypte, Tokyo et bien d’autres horizons.',
  },
  {
    key: 'dest.card1.title1',
    group: 'destinations',
    label: 'Left Showcase Card Title Line 1',
    defaultEn: 'Explore Your',
    defaultFr: 'Explorez Votre',
  },
  {
    key: 'dest.card1.title2',
    group: 'destinations',
    label: 'Left Showcase Card Title Line 2',
    defaultEn: 'Favorite Journey',
    defaultFr: 'Prochain Voyage',
  },
  {
    key: 'dest.card1.sub',
    group: 'destinations',
    label: 'Left Showcase Card Subtitle',
    defaultEn: "Let's Make Our Life Better",
    defaultFr: 'Sublimez vos aventures au quotidien',
  },
  {
    key: 'dest.card1.go',
    group: 'destinations',
    label: 'Left Showcase Card Pill CTA',
    defaultEn: 'Go',
    defaultFr: 'Partir',
  },
  {
    key: 'dest.card1.image',
    group: 'destinations',
    label: 'Left Showcase Card Background Image URL',
    defaultEn:
      'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=1000&q=85',
    defaultFr:
      'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=1000&q=85',
  },
  {
    key: 'dest.card2.discover',
    group: 'destinations',
    label: 'Center Card Title',
    defaultEn: 'Discover',
    defaultFr: 'Découvrir',
  },
  {
    key: 'dest.card2.scroll',
    group: 'destinations',
    label: 'Center Card Hint',
    defaultEn: 'Scroll & explore all places',
    defaultFr: 'Faites défiler et explorez',
  },
  {
    key: 'dest.card2.top',
    group: 'destinations',
    label: 'Center Card Subheading',
    defaultEn: 'Top Destinations',
    defaultFr: 'Top Destinations',
  },
  {
    key: 'dest.card3.book',
    group: 'destinations',
    label: 'Right Detail Card Book Link Text',
    defaultEn: 'Book Trip',
    defaultFr: 'Réserver',
  },
  {
    key: 'dest.card3.total',
    group: 'destinations',
    label: 'Right Detail Card Price Label',
    defaultEn: 'Total Price',
    defaultFr: 'Prix Total',
  },

  // Reviews Section Copy
  {
    key: 'reviews.title',
    group: 'reviews',
    label: 'Reviews Section Heading',
    defaultEn: 'What Our Travelers Say',
    defaultFr: 'Ce Que Disent Nos Voyageurs',
  },
  {
    key: 'reviews.subtitle',
    group: 'reviews',
    label: 'Reviews Section Subtitle',
    defaultEn:
      'Explore genuine experiences from over 10 million adventurers, families, and frequent flyers saving on airfares, hotels, and journeys worldwide.',
    defaultFr:
      'Découvrez les retours d’expérience de plus de 10 millions de globe-trotters, familles et professionnels qui économisent sur leurs séjours et leurs vols avec Safarihoo.',
  },
  {
    key: 'reviews.ratingPill',
    group: 'reviews',
    label: 'Reviews Rating Summary Badge',
    defaultEn: '4.9/5 Average Rating • Over 120,000 Verified Reviews',
    defaultFr: 'Note globale 4.9/5 • Plus de 120 000 avis vérifiés',
  },
  {
    key: 'reviews.btnWriteReview',
    group: 'reviews',
    label: 'Write a Review Button Label',
    defaultEn: 'Write a Review',
    defaultFr: 'Donner mon avis',
  },

  // Trust Badges
  {
    key: 'trust.price.title',
    group: 'trust',
    label: 'Trust Badge 1 Title',
    defaultEn: 'Best Price Guarantee',
    defaultFr: 'Garantie Meilleur Prix',
  },
  {
    key: 'trust.price.desc',
    group: 'trust',
    label: 'Trust Badge 1 Description',
    defaultEn: 'We match the best prices',
    defaultFr: 'Nous garantissons les meilleurs tarifs',
  },
  {
    key: 'trust.support.title',
    group: 'trust',
    label: 'Trust Badge 2 Title',
    defaultEn: '24/7 Travel Support',
    defaultFr: 'Support Voyage 24/7',
  },
  {
    key: 'trust.support.desc',
    group: 'trust',
    label: 'Trust Badge 2 Description',
    defaultEn: 'Always here when you need us',
    defaultFr: 'Toujours là pour vous accompagner',
  },
  {
    key: 'trust.secure.title',
    group: 'trust',
    label: 'Trust Badge 3 Title',
    defaultEn: 'Secure Booking',
    defaultFr: 'Réservation Sécurisée',
  },
  {
    key: 'trust.secure.desc',
    group: 'trust',
    label: 'Trust Badge 3 Description',
    defaultEn: 'Your data is 100% protected',
    defaultFr: 'Vos données sont protégées à 100%',
  },
  {
    key: 'trust.millions.title',
    group: 'trust',
    label: 'Trust Badge 4 Title',
    defaultEn: 'Trusted by Millions',
    defaultFr: 'Plébiscité par des Millions',
  },
  {
    key: 'trust.millions.desc',
    group: 'trust',
    label: 'Trust Badge 4 Description',
    defaultEn: '10M+ happy travelers worldwide',
    defaultFr: '+10M de voyageurs satisfaits dans le monde',
  },

  // About Us Page
  {
    key: 'about.title',
    group: 'about',
    label: 'About Page Headline',
    defaultEn: 'Empowering Global Travelers with Intelligent Exploration',
    defaultFr: 'Une exploration intelligente au service des voyageurs du monde entier',
  },
  {
    key: 'about.subtitle',
    group: 'about',
    label: 'About Page Intro Paragraph',
    defaultEn:
      'Safarihoo is a next-generation travel meta-search engine built to connect wanderlust seekers with millions of flights, hand-picked hotels, flexible car rentals, and hassle-free flight compensation across the globe.',
    defaultFr:
      "Safarihoo est un métamoteur de recherche de voyages nouvelle génération conçu pour connecter les passionnés d'aventure à des millions de vols, d'hôtels d'exception, de locations de voitures flexibles et d'indemnisations de vol simples à travers le globe.",
  },
  {
    key: 'about.missionTitle',
    group: 'about',
    label: 'Mission Card Title',
    defaultEn: 'Our Mission',
    defaultFr: 'Notre Mission',
  },
  {
    key: 'about.missionDesc',
    group: 'about',
    label: 'Mission Card Description',
    defaultEn:
      'To eliminate the friction of modern travel planning. We aggregate verified fares from premier travel suppliers and airlines into one ultra-fast, transparent, and user-friendly experience — with zero hidden booking fees.',
    defaultFr:
      "Éliminer les frictions de la planification de voyage moderne. Nous agrégeons les tarifs vérifiés des compagnies et voyagistes majeurs au sein d'une expérience ultra-rapide, transparente et intuitive — sans aucun frais de réservation caché.",
  },
  {
    key: 'about.visionTitle',
    group: 'about',
    label: 'Vision Card Title',
    defaultEn: 'Our Global Vision',
    defaultFr: 'Notre Vision Globale',
  },
  {
    key: 'about.visionDesc',
    group: 'about',
    label: 'Vision Card Description',
    defaultEn:
      'We envision a world where every traveler has instant access to fair, transparent journey planning, backed by passenger rights protection and AI-assisted destination insights.',
    defaultFr:
      "Nous bâtissons un univers où chaque voyageur accède instantanément à une planification équitable et transparente, appuyée par la défense des droits des passagers et des recommandations fiables.",
  },
  {
    key: 'about.ctaTitle',
    group: 'about',
    label: 'About Page CTA Title',
    defaultEn: 'Ready to Start Your Next Adventure?',
    defaultFr: 'Prêt à vivre votre prochaine aventure ?',
  },
  {
    key: 'about.ctaSubtitle',
    group: 'about',
    label: 'About Page CTA Subtitle',
    defaultEn:
      'Compare cheap flights, find luxury hotel bargains, or book rental cars with the best price guarantee today.',
    defaultFr:
      'Comparez les vols pas chers, dénichez des hôtels de luxe ou louez une voiture au meilleur tarif garanti dès maintenant.',
  },

  // FAQ Page
  {
    key: 'faq.title',
    group: 'faq',
    label: 'FAQ Page Title',
    defaultEn: 'Frequently Asked Questions',
    defaultFr: 'Foire Aux Questions',
  },
  {
    key: 'faq.subtitle',
    group: 'faq',
    label: 'FAQ Page Subtitle',
    defaultEn:
      'Find answers to common questions about searching, booking, passenger compensation rights, and managing your journeys on Safarihoo.',
    defaultFr:
      'Trouvez des réponses claires à vos questions sur la recherche de vols, les réservations d’hôtels, la location de véhicules et l’indemnisation de vol AirHelp sur Safarihoo.',
  },
  {
    key: 'faq.stillQuestions',
    group: 'faq',
    label: 'FAQ Support Box Title',
    defaultEn: 'Still have questions?',
    defaultFr: 'Vous avez encore des questions ?',
  },
  {
    key: 'faq.supportDesc',
    group: 'faq',
    label: 'FAQ Support Box Description',
    defaultEn:
      'Our global support team is available 24 hours a day, 7 days a week to help with your reservations and travel inquiries.',
    defaultFr:
      'Notre équipe d’assistance internationale est disponible 24h/24 et 7j/7 pour vous orienter dans vos réservations et vos voyages.',
  },

  // Contact & Footer
  {
    key: 'contact.email',
    group: 'contact',
    label: 'Public Support Email',
    defaultEn: 'support@safarihoo.com',
    defaultFr: 'support@safarihoo.com',
  },
  {
    key: 'contact.phone',
    group: 'contact',
    label: 'Public Support Phone',
    defaultEn: '+242 05 675 6629',
    defaultFr: '+242 05 675 6629',
  },
  {
    key: 'footer.company',
    group: 'footer',
    label: 'Footer Column 1 Heading',
    defaultEn: 'Company',
    defaultFr: 'Entreprise',
  },
  {
    key: 'footer.services',
    group: 'footer',
    label: 'Footer Column 2 Heading',
    defaultEn: 'Services',
    defaultFr: 'Services',
  },
  {
    key: 'footer.resources',
    group: 'footer',
    label: 'Footer Column 3 Heading',
    defaultEn: 'Resources',
    defaultFr: 'Ressources',
  },
  {
    key: 'footer.legal',
    group: 'footer',
    label: 'Footer Column 4 Heading',
    defaultEn: 'Legal',
    defaultFr: 'Légal',
  },
  {
    key: 'footer.rights',
    group: 'footer',
    label: 'Footer Copyright Text',
    defaultEn: 'All rights reserved.',
    defaultFr: 'Tous droits réservés.',
  },
];

export const DEFAULT_ATTRACTION_TOURS: SiteAttractionItem[] = [
  {
    id: 'everest-escape',
    title: 'Everest Escape',
    titleFr: 'Évasion Everest',
    price: 980,
    description:
      'Trek through majestic Himalayan passes, glacial valleys, sherpa villages and breathtaking 8,000m summits.',
    descriptionFr:
      'Explorez des cols himalayens majestueux, des vallées glaciaires, des villages sherpas et des sommets de 8 000 m.',
    tag: 'high altitude',
    tagFr: 'haute altitude',
    duration: '7 days',
    durationFr: '7 jours',
    category: 'Adventure',
    location: 'Khumbu Region, Nepal',
    imageUrl: everestImg,
    bookingUrl: 'https://www.trip.com/things-to-do/list/?keyword=Everest%20Escape%20Nepal',
    highlights: [
      'Scenic mountain flight to Lukla & Namche Bazaar',
      'Sunrise panorama at Kala Patthar & Tengboche Monastery',
      'Certified high-altitude mountain guide & lodges included',
    ],
    highlightsFr: [
      'Vol panoramique vers Lukla et Namche Bazaar',
      'Lever de soleil sur le Kala Patthar et monastère de Tengboche',
      'Guide certifié haute montagne et hébergements inclus',
    ],
    active: true,
    order: 0,
  },
  {
    id: 'annapurna-trail',
    title: 'Annapurna Trail',
    titleFr: 'Sentier Annapurna',
    price: 750,
    description:
      "Follow iconic mountain trails through peaceful villages, terraced ridges and views of Nepal's most spectacular landscapes.",
    descriptionFr:
      'Suivez des sentiers légendaires entre villages paisibles, rizières en terrasses et panoramas spectaculaires.',
    tag: 'popular',
    tagFr: 'populaire',
    duration: '6 days',
    durationFr: '6 jours',
    category: 'Adventure',
    location: 'Annapurna Sanctuary, Nepal',
    imageUrl: annapurnaImg,
    bookingUrl: 'https://www.trip.com/things-to-do/list/?keyword=Annapurna%20Trail%20Nepal',
    highlights: [
      'Poon Hill golden dawn ridge above the Annapurna massif',
      'Traditional Gurung heritage villages & mountain teahouses',
      'Private ground transfers & ACAP conservation permits',
    ],
    highlightsFr: [
      'Aube dorée sur Poon Hill face au massif des Annapurnas',
      'Villages traditionnels Gurung et auberges de montagne',
      'Transferts privés et permis de conservation inclus',
    ],
    active: true,
    order: 1,
  },
  {
    id: 'pokhara-retreat',
    title: 'Pokhara Retreat',
    titleFr: 'Retraite à Pokhara',
    price: 840,
    description:
      'Slow down beside the peace of a lake, surrounded by green hills, distant peaks and the quiet beauty of Nepal.',
    descriptionFr:
      'Ralentissez au bord d’un lac paisible, entouré de collines verdoyantes, de sommets lointains et de sérénité.',
    tag: 'relax',
    tagFr: 'détente',
    duration: '4 days',
    durationFr: '4 jours',
    category: 'Wellness',
    location: 'Phewa Lake, Pokhara',
    imageUrl: pokharaImg,
    bookingUrl: 'https://www.trip.com/things-to-do/list/?keyword=Pokhara%20Retreat%20Nepal',
    highlights: [
      'Private wooden boat crossing on tranquil Phewa Lake',
      'World Peace Pagoda sunrise & lakeside wellness spa',
      'Boutique lakefront resort stay with breakfast',
    ],
    highlightsFr: [
      'Traversée privée en barque traditionnelle sur le lac Phewa',
      'Lever du soleil à la Pagode de la Paix et spa bien-être',
      'Séjour en hôtel-boutique au bord du lac avec petit-déjeuner',
    ],
    active: true,
    order: 2,
  },
  {
    id: 'kathmandu-soul',
    title: 'Kathmandu Soul',
    titleFr: 'Âme de Katmandou',
    price: 450,
    description:
      'Pass through ancient temples, hidden courtyards and sacred shrines filled with history and spirit of Nepal.',
    descriptionFr:
      'Parcourez temples anciens, cours cachées et sanctuaires sacrés imprégnés d’histoire et de spiritualité.',
    tag: 'cultural',
    tagFr: 'culturel',
    duration: '3 days',
    durationFr: '3 jours',
    category: 'Culture',
    location: 'Kathmandu Valley, Nepal',
    imageUrl: kathmanduImg,
    bookingUrl: 'https://www.trip.com/things-to-do/list/?keyword=Kathmandu%20Soul%20Nepal',
    highlights: [
      'UNESCO heritage walk: Swayambhunath, Boudhanath & Patan',
      'Private artisan courtyard tour & Newari culinary tasting',
      'Boutique heritage hotel in historic Kathmandu',
    ],
    highlightsFr: [
      'Visite UNESCO : Swayambhunath, Boudhanath et Patan',
      'Atelier d’artisans privatif et dégustation culinaire Newari',
      'Hôtel de charme historique au cœur de Katmandou',
    ],
    active: true,
    order: 3,
  },
  {
    id: 'himalayan-escape',
    title: 'Himalayan Escape',
    titleFr: 'Escapade Himalayenne',
    price: 850,
    description:
      'Venture above the clouds to alpine ridges, glowing sunrises, ancient trails and unforgettable mountain horizons.',
    descriptionFr:
      'Prenez de la hauteur au-dessus des nuages entre crêtes alpines, levers de soleil dorés et horizons infinis.',
    tag: 'adventure',
    tagFr: 'aventure',
    duration: '5 days',
    durationFr: '5 jours',
    category: 'Adventure',
    location: 'Langtang & Nagarkot, Nepal',
    imageUrl: himalayanImg,
    bookingUrl: 'https://www.trip.com/things-to-do/list/?keyword=Himalayan%20Escape%20Nepal',
    highlights: [
      'Golden hour ridge expedition above the cloud line',
      'Panoramic helicopter flyover option & luxury mountain lodge',
      'All-inclusive meals, permits & concierge support',
    ],
    highlightsFr: [
      'Expédition en altitude au-dessus de la mer de nuages',
      'Option survol panoramique et lodge de montagne haut de gamme',
      'Repas, permis et conciergerie inclus',
    ],
    active: true,
    order: 4,
  },
];

export const DEFAULT_DESTINATIONS: SiteDestinationItem[] = [
  {
    id: 'newyork',
    title: 'Manhattan Skyline',
    titleFr: 'Panorama de Manhattan',
    name: 'Manhattan',
    location: 'New York, USA',
    country: 'USA',
    categories: ['Cities'],
    mainImage:
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
    thumbnails: [
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?auto=format&fit=crop&w=300&q=80',
    ],
    distance: '1,200Km',
    temp: '24° C',
    rating: '4.8',
    price: '$1,180',
    tag: 'Trending',
    tagFr: 'Tendance',
    description:
      'Immerse yourself in the bustling epicenter of culture, Broadway theaters, Central Park, and the unforgettable glittering skyline of Manhattan.',
    descriptionFr:
      'Plongez au cœur de la culture, des théâtres de Broadway, de Central Park et de la célèbre silhouette scintillante de Manhattan.',
    bookingUrl: '',
    active: true,
    order: 0,
  },
  {
    id: 'paris',
    title: 'Eiffel & Seine',
    titleFr: 'Tour Eiffel & Seine',
    name: 'Paris',
    location: 'Paris, France',
    country: 'France',
    categories: ['Cities', 'Historic'],
    mainImage:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    thumbnails: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b?auto=format&fit=crop&w=300&q=80',
    ],
    distance: '3,620Km',
    temp: '22° C',
    rating: '4.9',
    price: '$1,450',
    tag: 'Popular',
    tagFr: 'Populaire',
    description:
      'Experience the magic of the City of Light with iconic panoramic vistas, world-renowned architecture, haute cuisine, and scenic strolls along the Seine.',
    descriptionFr:
      'Vivez la magie de la Ville Lumière avec ses vues panoramiques, son architecture mondialement réputée et ses balades romantiques le long de la Seine.',
    bookingUrl: '',
    active: true,
    order: 1,
  },
  {
    id: 'egypt',
    title: 'Great Pyramids',
    titleFr: 'Grandes Pyramides',
    name: 'Giza Pyramids',
    location: 'Giza, Egypt',
    country: 'Egypt',
    categories: ['Historic', 'Wonders'],
    mainImage:
      'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80',
    thumbnails: [
      'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=300&q=80',
    ],
    distance: '5,840Km',
    temp: '28° C',
    rating: '4.9',
    price: '$1,270',
    tag: 'Top Wonder',
    tagFr: 'Merveille',
    description:
      'The iconic Giza Plateau features the Great Pyramid of Khufu, the enigmatic Sphinx, and thousands of years of ancient world history along the majestic Nile.',
    descriptionFr:
      "Le plateau mythique de Gizeh abrite la Grande Pyramide de Khéops, l'énigmatique Sphinx et des millénaires d'histoire le long du Nil.",
    bookingUrl: '',
    active: true,
    order: 2,
  },
  {
    id: 'rome',
    title: 'Colosseum & Forum',
    titleFr: 'Colisée & Forum',
    name: 'Rome',
    location: 'Rome, Italy',
    country: 'Italy',
    categories: ['Cities', 'Historic'],
    mainImage:
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
    thumbnails: [
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=300&q=80',
    ],
    distance: '4,100Km',
    temp: '26° C',
    rating: '4.9',
    price: '$1,340',
    tag: 'Heritage',
    tagFr: 'Patrimoine',
    description:
      'Step inside timeless antiquity exploring the Colosseum, the Pantheon, Vatican art treasures, and picturesque cobblestone piazzas.',
    descriptionFr:
      "Voyagez au cœur de l'antiquité en explorant le Colisée, le Panthéon, les trésors du Vatican et les magnifiques ruelles pavées.",
    bookingUrl: '',
    active: true,
    order: 3,
  },
  {
    id: 'tokyo',
    title: 'Shibuya & Shinjuku',
    titleFr: 'Shibuya & Shinjuku',
    name: 'Tokyo',
    location: 'Tokyo, Japan',
    country: 'Japan',
    categories: ['Cities', 'Wonders'],
    mainImage:
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    thumbnails: [
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=300&q=80',
    ],
    distance: '9,700Km',
    temp: '21° C',
    rating: '4.9',
    price: '$1,620',
    tag: 'Modern',
    tagFr: 'Futuriste',
    description:
      'A harmonious blend of cutting-edge technology and serene ancient shrines, offering neon-lit nightscapes, world-class culinary art, and vibrant pop culture.',
    descriptionFr:
      "Une métropole fascinante où néons éblouissants, sanctuaires ancestraux, haute gastronomie et culture pop s'harmonisent à la perfection.",
    bookingUrl: '',
    active: true,
    order: 4,
  },
  {
    id: 'santorini',
    title: 'Oia White Caldera',
    titleFr: 'Oia & Caldeira',
    name: 'Santorini',
    location: 'Santorini, Greece',
    country: 'Greece',
    categories: ['Beach', 'Wonders'],
    mainImage:
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
    thumbnails: [
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80',
    ],
    distance: '4,800Km',
    temp: '25° C',
    rating: '4.9',
    price: '$1,520',
    tag: 'Romance',
    tagFr: 'Romance',
    description:
      'Iconic whitewashed cliffside villas, cobalt-blue domes, volcanic Aegean beaches, and world-renowned golden sunset vistas over the caldera.',
    descriptionFr:
      'Villas blanches à flanc de falaise, dômes bleus emblématiques, plages volcaniques et couchers de soleil légendaires sur la mer Égée.',
    bookingUrl: '',
    active: true,
    order: 5,
  },
  {
    id: 'bali',
    title: 'Ubud & Seminyak',
    titleFr: 'Ubud & Seminyak',
    name: 'Bali',
    location: 'Bali, Indonesia',
    country: 'Indonesia',
    categories: ['Beach', 'Wonders'],
    mainImage:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    thumbnails: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=300&q=80',
    ],
    distance: '11,200Km',
    temp: '29° C',
    rating: '4.9',
    price: '$980',
    tag: 'Tropical',
    tagFr: 'Paradis',
    description:
      'Lush tropical rice terraces, spiritual water temples, serene surf retreats, and rejuvenating holistic wellness villas in paradise.',
    descriptionFr:
      "Rizières en terrasses luxuriantes, temples sacrés au bord de l'eau, spots de surf mondiaux et villas de bien-être ressourçantes.",
    bookingUrl: '',
    active: true,
    order: 6,
  },
  {
    id: 'dubai',
    title: 'Burj Khalifa & Desert',
    titleFr: 'Burj Khalifa & Désert',
    name: 'Dubai',
    location: 'Dubai, UAE',
    country: 'UAE',
    categories: ['Cities', 'Wonders'],
    mainImage:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    thumbnails: [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=300&q=80',
    ],
    distance: '6,200Km',
    temp: '32° C',
    rating: '4.8',
    price: '$1,390',
    tag: 'Luxury',
    tagFr: 'Luxe',
    description:
      'Futuristic architectural wonders, luxurious shopping marinas, private desert safaris, and crystal warm waters along the Arabian Gulf.',
    descriptionFr:
      'Merveilles architecturales futuristes, marinas de shopping prestigieuses, safaris dans les dunes dorées et eaux chaudes du golfe Persique.',
    bookingUrl: '',
    active: true,
    order: 7,
  },
];

export const DEFAULT_REVIEWS: SiteReviewItem[] = [
  {
    id: 'james-brown',
    name: 'James Brown',
    role: 'CEO Swing Company • @thejamescup',
    roleFr: 'CEO Swing Company • @thejamescup',
    headline: '',
    headlineFr: '',
    text: 'Safarihoo saved us over $420 on our multi-city flights to Tokyo and Kyoto. The comparison engine is blazing fast, transparent, and completely free of hidden fees.',
    textFr:
      'Safarihoo nous a fait économiser plus de 420 $ sur nos billets multi-destinations vers Tokyo et Kyoto. Le comparateur est ultra-rapide, limpide et sans frais cachés.',
    rating: 5,
    category: 'flights',
    cardStyle: 'quote-top',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    active: true,
    order: 0,
  },
  {
    id: 'hindley-earnshaw',
    name: 'Hindley Earnshaw',
    role: '@Hindley.Ex',
    roleFr: '@Hindley.Ex',
    headline: 'I really appreciate!!',
    headlineFr: 'J’apprécie énormément !!',
    text: 'Finding last-minute family holiday packages used to be a headache. Safarihoo’s smart filters made booking 4 flights and a beachfront villa a breeze.',
    textFr:
      'Trouver des vacances en famille à la dernière minute était un casse-tête. Les filtres intelligents de Safarihoo ont rendu la réservation d’une villa et de 4 vols un vrai jeu d’enfant.',
    rating: 5,
    category: 'flights',
    cardStyle: 'avatar-top-stars',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    active: true,
    order: 1,
  },
  {
    id: 'sarah-jenkins',
    name: 'Sarah Jenkins',
    role: 'Frequent Traveler • @sarahj',
    roleFr: 'Voyageur régulier • @sarahj',
    headline: 'Good Job!',
    headlineFr: 'Excellent travail !',
    text: 'The price forecast indicated fares to Rome would drop mid-week. Waited 48 hours and saved €180 on business class tickets!',
    textFr:
      'L’indicateur de prix prédisait une baisse vers Rome en milieu de semaine. J’ai attendu 48h et économisé 180 € sur des billets classe affaires !',
    rating: 5,
    category: 'flights',
    cardStyle: 'headline-stars',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    active: true,
    order: 2,
  },
  {
    id: 'victoria-watton',
    name: 'Victoria Watton',
    role: 'Fermentum Odio Co.',
    roleFr: 'Fermentum Odio Co.',
    headline: '',
    headlineFr: '',
    text: 'The hotel price tracker alerted me when luxury suites in Santorini dropped by 35%. Completed our reservation securely in under two minutes with breakfast included!',
    textFr:
      'Le suivi des prix d’hôtels m’a alertée dès qu’une suite à Santorin a baissé de 35%. Réservation confirmée en moins de deux minutes avec petit-déjeuner inclus !',
    rating: 5,
    category: 'hotels',
    cardStyle: 'quote-bottom-avatar',
    avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    active: true,
    order: 3,
  },
  {
    id: 'isabelle-leite',
    name: 'Isabelle Leite',
    role: 'Lisbon • Portugal',
    roleFr: 'Lisbonne • Portugal',
    headline: '',
    headlineFr: '',
    text: 'Seamless car rental checkout at Lisbon airport with zero deposit surprises. Clean, trustworthy, and incredibly intuitive UI!',
    textFr:
      'Location de véhicule fluide à l’aéroport de Lisbonne sans aucune surprise sur la caution. Interface claire, rapide et très intuitive !',
    rating: 5,
    category: 'cars',
    cardStyle: 'cursive-signature',
    avatar:
      'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=300&q=80',
    active: true,
    order: 4,
  },
  {
    id: 'william-brewster',
    name: 'William Brewster',
    role: 'AirHelp Claim Verified',
    roleFr: 'Indemnisation AirHelp vérifiée',
    headline: 'I was very impressed!',
    headlineFr: 'J’ai été très impressionné !',
    text: "When our transatlantic flight got cancelled, Safarihoo's integrated AirHelp service secured €600 compensation per passenger with zero stress. Outstanding experience!",
    textFr:
      'Lors de l’annulation de notre vol international, le service AirHelp intégré de Safarihoo a récupéré 600 € d’indemnité par passager sans stress. Remarquable !',
    rating: 5,
    category: 'airhelp',
    cardStyle: 'headline-avatars',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    active: true,
    order: 5,
  },
];

