import everestImg from '../assets/images/attraction_everest_escape_1795099729350.jpg';
import annapurnaImg from '../assets/images/attraction_annapurna_trail_1795099729233.jpg';
import pokharaImg from '../assets/images/attraction_pokhara_retreat_1795099729185.jpg';
import kathmanduImg from '../assets/images/attraction_kathmandu_soul_1795099729143.jpg';
import himalayanImg from '../assets/images/attraction_himalayan_escape_1795099729427.jpg';
import madeForYouImg from '../assets/images/attraction_made_for_you_1795099729307.jpg';
import { CmsContentGroup, SiteAttractionItem } from '../types';

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
