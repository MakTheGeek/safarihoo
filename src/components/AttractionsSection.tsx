import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Route,
  X,
  Check,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

import everestImg from '../assets/images/attraction_everest_escape_1795099729350.jpg';
import annapurnaImg from '../assets/images/attraction_annapurna_trail_1795099729233.jpg';
import pokharaImg from '../assets/images/attraction_pokhara_retreat_1795099729185.jpg';
import kathmanduImg from '../assets/images/attraction_kathmandu_soul_1795099729143.jpg';
import himalayanImg from '../assets/images/attraction_himalayan_escape_1795099729427.jpg';
import madeForYouImg from '../assets/images/attraction_made_for_you_1795099729307.jpg';

interface AttractionTour {
  id: string;
  title: string;
  titleFr: string;
  price: number;
  description: string;
  descriptionFr: string;
  tag: string;
  tagFr: string;
  duration: string;
  durationFr: string;
  category: 'Adventure' | 'Culture' | 'Wellness';
  location: string;
  image: string;
  highlights: string[];
  highlightsFr: string[];
}

const ATTRACTION_TOURS: AttractionTour[] = [
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
    image: everestImg,
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
    image: annapurnaImg,
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
    image: pokharaImg,
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
    image: kathmanduImg,
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
    image: himalayanImg,
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
  },
];

interface AttractionsSectionProps {
  onFocusHotelSearch?: () => void;
}

export const AttractionsSection: React.FC<AttractionsSectionProps> = ({
  onFocusHotelSearch,
}) => {
  const { language } = useLanguage();
  const isFr = language === 'FR';

  // Center default is Pokhara Retreat (index 2) matching the reference screenshot
  const [activeIndex, setActiveIndex] = useState<number>(2);
  const [allInclusive, setAllInclusive] = useState<boolean>(true);
  const [selectedTour, setSelectedTour] = useState<AttractionTour | null>(null);
  const [showAllToursModal, setShowAllToursModal] = useState<boolean>(false);
  const [showTailorModal, setShowTailorModal] = useState<boolean>(false);
  const [tailorSubmitted, setTailorSubmitted] = useState<boolean>(false);
  const [tailorEmail, setTailorEmail] = useState<string>('');
  const [tailorNotes, setTailorNotes] = useState<string>('');
  const [modalFilter, setModalFilter] = useState<'All' | 'Adventure' | 'Culture' | 'Wellness'>('All');
  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  const touchStartXRef = React.useRef<number | null>(null);
  const total = ATTRACTION_TOURS.length;

  useEffect(() => {
    const checkViewport = () => {
      setIsMobileViewport(window.innerWidth < 768);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartXRef.current;
    const diffX = endX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (Math.abs(diffX) > 40) {
      if (diffX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  // Compute circular signed offset (-2, -1, 0, +1, +2)
  const getRelativeOffset = (index: number) => {
    let diff = index - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedTour(null);
        setShowAllToursModal(false);
        setShowTailorModal(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const filteredModalTours =
    modalFilter === 'All'
      ? ATTRACTION_TOURS
      : ATTRACTION_TOURS.filter((tour) => tour.category === modalFilter);

  const handleTailorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tailorEmail.trim()) return;
    setTailorSubmitted(true);
  };

  const renderDots = (filled: number, totalDots = 10) => (
    <div className="flex items-center gap-1.5" aria-hidden="true">
      {Array.from({ length: totalDots }).map((_, i) => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full transition-colors ${
            i < filled ? 'bg-[#1d7afc]' : 'bg-[#d8dee6]'
          }`}
        />
      ))}
    </div>
  );

  return (
    <section
      id="attractions-section"
      aria-label={isFr ? 'Attractions & Circuits Populaires' : 'Popular Attractions & Tours'}
      className="w-full bg-white text-[#0b1220] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative z-20 select-none overflow-x-clip"
    >
      <div className="max-w-[1180px] mx-auto">
        {/* Top Tag + Mixed Serif/Sans Display Headline */}
        <div className="text-center flex flex-col items-center mb-10 sm:mb-14">
          <span className="inline-block px-5 py-1.5 rounded-full bg-[#f4f5f7] text-[#475569] text-[10px] sm:text-[11px] font-semibold tracking-[0.16em] uppercase mb-5">
            {isFr ? 'VOTRE VOYAGE' : 'YOUR JOURNEY'}
          </span>

          <h2 className="text-3xl sm:text-5xl md:text-[54px] font-semibold text-[#0b1220] tracking-tight leading-[1.08] max-w-2xl text-balance">
            {isFr ? (
              <>
                Découvrez{' '}
                <span className="font-['Playfair_Display'] italic font-semibold">
                  Nos Plus
                </span>
                <br />
                <span className="font-['Playfair_Display'] italic font-semibold">
                  Populaires
                </span>{' '}
                Attractions
              </>
            ) : (
              <>
                Discover{' '}
                <span className="font-['Playfair_Display'] italic font-semibold">
                  Our Most
                </span>
                <br />
                <span className="font-['Playfair_Display'] italic font-semibold">
                  Popular
                </span>{' '}
                Tours
              </>
            )}
          </h2>
        </div>

        {/* Responsive 5-Card Fanned Depth Carousel (Desktop + Mobile Touch Swipe) */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="flex items-center justify-center relative h-[410px] sm:h-[440px] lg:h-[470px] w-full touch-pan-y"
        >
          {ATTRACTION_TOURS.map((tour, idx) => {
            const offset = getRelativeOffset(idx);
            const absOffset = Math.abs(offset);
            const isCenter = offset === 0;

            const stepX = isMobileViewport ? 115 : 205;
            const translateX = offset * stepX;
            const scale = isCenter
              ? 1
              : absOffset === 1
              ? isMobileViewport
                ? 0.85
                : 0.87
              : isMobileViewport
              ? 0.72
              : 0.74;
            const zIndex = isCenter ? 30 : absOffset === 1 ? 20 : 10;
            const opacity = isCenter
              ? 1
              : absOffset === 1
              ? isMobileViewport
                ? 0.88
                : 0.96
              : isMobileViewport
              ? 0.45
              : 0.9;

            const displayTitle = isFr ? tour.titleFr : tour.title;
            const displayDesc = isFr ? tour.descriptionFr : tour.description;
            const displayTag = isFr ? tour.tagFr : tour.tag;
            const displayDuration = isFr ? tour.durationFr : tour.duration;
            const computedPrice = allInclusive ? tour.price : Math.round(tour.price * 0.82);

            return (
              <article
                key={tour.id}
                onClick={() => {
                  if (isCenter) {
                    setSelectedTour(tour);
                  } else {
                    setActiveIndex(idx);
                  }
                }}
                style={{
                  transform: `translateX(${translateX}px) scale(${scale})`,
                  zIndex,
                  opacity,
                }}
                className={`absolute w-[250px] sm:w-[290px] lg:w-[310px] h-[380px] sm:h-[420px] lg:h-[445px] rounded-[24px] overflow-hidden cursor-pointer transition-all duration-300 ease-out shadow-[0_20px_50px_rgba(11,18,32,0.18)] group bg-slate-900 ${
                  isCenter ? 'ring-1 ring-black/5' : 'hover:brightness-105'
                }`}
              >
                <img
                  src={tour.image}
                  alt={displayTitle}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />

                {/* Smooth dark scrim at bottom for WCAG AA contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/45 to-black/10" />

                {/* Card Content Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex flex-col justify-end">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-white font-semibold text-base sm:text-lg leading-tight truncate">
                      {displayTitle}
                    </h3>
                    <span className="px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-xs font-semibold tabular-nums shrink-0 border border-white/10">
                      ${computedPrice}
                    </span>
                  </div>

                  <p className="text-white/80 text-[11px] sm:text-xs leading-relaxed mt-1.5 sm:mt-2 line-clamp-3">
                    {displayDesc}
                  </p>

                  {/* Two metadata chips matching reference image */}
                  <div className="flex items-center gap-2 mt-3 mb-3 sm:mt-3.5 sm:mb-3.5">
                    <span className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-white/95 text-[10px] font-medium">
                      {displayTag}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-white/95 text-[10px] font-medium">
                      {displayDuration}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTour(tour);
                    }}
                    className="w-full py-2 sm:py-2.5 rounded-full bg-white hover:bg-neutral-100 text-[#0b1220] font-semibold text-xs sm:text-sm text-center transition-colors shadow-sm cursor-pointer"
                  >
                    {isFr ? 'Explorer' : 'Explore'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Carousel Navigation Bar matching reference screenshot */}
        <div className="relative z-40 flex items-center justify-center gap-6 sm:gap-8 mt-6 sm:mt-10">
          <button
            type="button"
            onClick={handlePrev}
            aria-label={isFr ? 'Circuit précédent' : 'Previous tour'}
            className="w-11 h-11 rounded-full border border-[#cbd5e1] text-[#475569] hover:border-[#0b1220] hover:bg-[#0b1220] hover:text-white active:scale-95 flex items-center justify-center transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setShowAllToursModal(true)}
            className="text-xs sm:text-sm font-medium text-[#0b1220] hover:text-[#1d7afc] transition-colors whitespace-nowrap shrink-0 cursor-pointer py-2 px-1"
          >
            {isFr ? 'Voir Plus de Circuits' : 'View More Tours'}
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label={isFr ? 'Circuit suivant' : 'Next tour'}
            className="w-11 h-11 rounded-full border border-[#0b1220] text-[#0b1220] hover:bg-[#0b1220] hover:text-white active:scale-95 flex items-center justify-center transition-all cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Lower Editorial & Bento Section */}
        <div className="mt-20 sm:mt-28">
          {/* Split Header Row */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10 sm:mb-12">
            <div>
              <span className="inline-block px-5 py-1.5 rounded-full bg-[#f4f5f7] text-[#475569] text-[10px] sm:text-[11px] font-semibold tracking-[0.16em] uppercase">
                {isFr ? 'À PROPOS DU NÉPAL' : 'ABOUT NEPAL'}
              </span>
            </div>

            <p className="text-base sm:text-lg text-[#0b1220] font-normal leading-relaxed max-w-lg">
              {isFr
                ? 'Le Népal est plus qu’une destination — c’est un voyage. Des sommets himalayens aux cités anciennes, chaque expérience vous rapproche de sa nature, de sa culture et de ses habitants.'
                : 'Nepal is more than a destination — it’s a journey. From Himalayan peaks to ancient cities, every experience brings you closer to its nature, culture and people.'}
            </p>
          </div>

          {/* 3-Column Bento Grid matching reference image */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
            {/* Card 1: Midnight Navy Dark Card */}
            <div className="bg-[#050a18] text-white rounded-[24px] p-6 sm:p-7 flex flex-col justify-between min-h-[290px]">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <Route className="w-6 h-6 text-white/90" strokeWidth={1.75} />

                  <button
                    type="button"
                    onClick={() => setAllInclusive((prev) => !prev)}
                    className="flex items-center gap-2.5 cursor-pointer group"
                    aria-pressed={allInclusive}
                  >
                    <span className="text-xs text-white/75 group-hover:text-white transition-colors">
                      {isFr ? 'tout compris' : 'all-inclusive'}
                    </span>
                    <span
                      className={`w-10 h-5 rounded-full p-0.5 transition-colors flex items-center ${
                        allInclusive ? 'bg-[#1d7afc] justify-end' : 'bg-white/20 justify-start'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-white shadow-sm block" />
                    </span>
                  </button>
                </div>

                <p className="text-sm sm:text-[15px] leading-relaxed text-white/85">
                  {isFr ? (
                    <>
                      Des voyages personnalisés : explorez à votre propre rythme, découvrez des
                      lieux secrets et vivez le Népal hors des sentiers battus —{' '}
                      <strong className="text-white font-semibold">
                        authentique, personnel et inoubliable.
                      </strong>
                    </>
                  ) : (
                    <>
                      Journeys made personal: travel at your own pace, discover hidden places and
                      experience Nepal beyond the usual routes —{' '}
                      <strong className="text-white font-semibold">
                        authentic, personal and unforgettable.
                      </strong>
                    </>
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setTailorSubmitted(false);
                  setShowTailorModal(true);
                }}
                className="mt-7 w-full py-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs sm:text-sm font-medium text-center transition-colors cursor-pointer"
              >
                {isFr ? 'Sur Mesure' : 'Tailor-Made'}
              </button>
            </div>

            {/* Card 2: Photographic Center Card with Frosted Pill */}
            <div className="rounded-[24px] overflow-hidden relative min-h-[290px] bg-slate-900 group">
              <img
                src={madeForYouImg}
                alt={isFr ? 'Voyage conçu pour vous' : 'Made for You'}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/20" />
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-[82%] py-2.5 px-5 rounded-full bg-white/25 backdrop-blur-md border border-white/30 text-center text-white text-xs sm:text-sm font-medium shadow-sm">
                {isFr ? 'Conçu pour Vous' : 'Made for You'}
              </div>
            </div>

            {/* Card 3: Light Gray Metrics & Dot Rating Card */}
            <div className="bg-[#f4f5f7] text-[#0b1220] rounded-[24px] p-6 sm:p-7 flex flex-col justify-between min-h-[290px]">
              <div>
                <div className="text-3xl sm:text-4xl font-semibold tracking-tight tabular-nums leading-none">
                  50+
                </div>
                <div className="text-xs font-medium text-slate-600 mt-1.5">
                  {isFr ? 'Expériences Uniques' : 'Unique Experiences'}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mt-3.5">
                  {isFr
                    ? 'Des parcours soigneusement sélectionnés pour révéler la vraie beauté, la culture et l’âme du Népal.'
                    : 'Carefully selected journeys designed to reveal the real beauty, culture and spirit of Nepal.'}
                </p>
              </div>

              <div className="space-y-3 mt-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-[#0b1220] w-20 shrink-0">
                    {isFr ? 'Aventure' : 'Adventure'}
                  </span>
                  {renderDots(9)}
                  <span className="text-xs font-medium text-slate-600 tabular-nums w-6 text-right">
                    45
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-[#0b1220] w-20 shrink-0">
                    {isFr ? 'Culture' : 'Culture'}
                  </span>
                  {renderDots(7)}
                  <span className="text-xs font-medium text-slate-600 tabular-nums w-6 text-right">
                    35
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-[#0b1220] w-20 shrink-0">
                    {isFr ? 'Bien-être' : 'Wellness'}
                  </span>
                  {renderDots(6)}
                  <span className="text-xs font-medium text-slate-600 tabular-nums w-6 text-right">
                    20
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom 4-Column KPI Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-14 sm:mt-16 text-center">
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#0b1220] tracking-tight tabular-nums">
                8,000+ m
              </div>
              <div className="text-xs text-slate-500 mt-1.5">
                {isFr ? 'Plus Hauts Sommets Himalayens' : 'Highest Himalayan Peaks'}
              </div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#0b1220] tracking-tight tabular-nums">
                100+
              </div>
              <div className="text-xs text-slate-500 mt-1.5">
                {isFr ? 'Expériences Uniques' : 'Unique Experiences'}
              </div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#0b1220] tracking-tight tabular-nums">
                50+
              </div>
              <div className="text-xs text-slate-500 mt-1.5">
                {isFr ? 'Circuits Sélectionnés' : 'Curated Journeys'}
              </div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#0b1220] tracking-tight">
                {isFr ? '4 Saisons' : '4 Seasons'}
              </div>
              <div className="text-xs text-slate-500 mt-1.5">
                {isFr ? 'À Explorer Toute l’Année' : 'Worth Exploring'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal 1: Explore Single Attraction / Tour Details */}
      {selectedTour && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={() => setSelectedTour(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-xl bg-white text-[#0b1220] rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-56 sm:h-64">
              <img
                src={selectedTour.image}
                alt={isFr ? selectedTour.titleFr : selectedTour.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <button
                type="button"
                onClick={() => setSelectedTour(null)}
                aria-label={isFr ? 'Fermer' : 'Close'}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white hover:bg-black/75 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between text-white">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-white/80 mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{selectedTour.location}</span>
                  </div>
                  <h3 className="text-2xl font-bold">
                    {isFr ? selectedTour.titleFr : selectedTour.title}
                  </h3>
                </div>
                <span className="px-3.5 py-1.5 rounded-full bg-white text-[#0b1220] text-sm font-bold tabular-nums">
                  ${allInclusive ? selectedTour.price : Math.round(selectedTour.price * 0.82)}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3 text-xs text-slate-600 mb-3">
                <span className="inline-flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#1d7afc]" />
                  {isFr ? selectedTour.durationFr : selectedTour.duration}
                </span>
                <span aria-hidden="true">·</span>
                <span className="capitalize">
                  {isFr ? selectedTour.tagFr : selectedTour.tag}
                </span>
                <span aria-hidden="true">·</span>
                <span>{allInclusive ? (isFr ? 'Tout compris' : 'All-inclusive') : (isFr ? 'Formule flexible' : 'Flexible plan')}</span>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-5">
                {isFr ? selectedTour.descriptionFr : selectedTour.description}
              </p>

              <div className="space-y-2.5 mb-6">
                {(isFr ? selectedTour.highlightsFr : selectedTour.highlights).map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#0b1220]">
                    <span className="w-5 h-5 rounded-full bg-blue-50 text-[#1d7afc] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`https://www.trip.com/things-to-do/list/?keyword=${encodeURIComponent(selectedTour.title + ' Nepal')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-[#050a18] hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-colors"
                >
                  <span>{isFr ? 'Réserver cette attraction' : 'Book This Experience'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                {onFocusHotelSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTour(null);
                      onFocusHotelSearch();
                    }}
                    className="py-3 px-5 rounded-full border border-slate-200 hover:border-slate-400 text-[#0b1220] text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                  >
                    {isFr ? 'Trouver un Hôtel' : 'Find Nearby Hotel'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: View More Tours Catalog */}
      {showAllToursModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={() => setShowAllToursModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-4xl max-h-[85vh] bg-white text-[#0b1220] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold">
                  {isFr ? 'Toutes nos Attractions & Circuits' : 'All Curated Tours & Attractions'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isFr
                    ? 'Sélectionnez une expérience pour explorer l’itinéraire complet'
                    : 'Choose any experience to inspect full highlights and availability'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAllToursModal(false)}
                aria-label={isFr ? 'Fermer' : 'Close'}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 pt-4 flex items-center gap-2 flex-wrap">
              {(['All', 'Adventure', 'Culture', 'Wellness'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setModalFilter(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    modalFilter === cat
                      ? 'bg-[#050a18] text-white'
                      : 'bg-[#f4f5f7] text-slate-600 hover:text-[#0b1220]'
                  }`}
                >
                  {isFr
                    ? cat === 'All'
                      ? 'Tous'
                      : cat === 'Adventure'
                      ? 'Aventure'
                      : cat === 'Culture'
                      ? 'Culture'
                      : 'Bien-être'
                    : cat}
                </button>
              ))}
            </div>

            <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredModalTours.map((tour) => (
                <div
                  key={tour.id}
                  onClick={() => {
                    setShowAllToursModal(false);
                    setSelectedTour(tour);
                  }}
                  className="rounded-2xl overflow-hidden border border-slate-200 hover:shadow-lg transition-all cursor-pointer flex flex-col"
                >
                  <div className="h-44 relative">
                    <img
                      src={tour.image}
                      alt={isFr ? tour.titleFr : tour.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 text-white text-xs font-semibold tabular-nums">
                      ${allInclusive ? tour.price : Math.round(tour.price * 0.82)}
                    </span>
                  </div>
                  <div className="p-4 flex flex-col flex-grow justify-between">
                    <div>
                      <h4 className="font-semibold text-sm text-[#0b1220]">
                        {isFr ? tour.titleFr : tour.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {isFr ? tour.descriptionFr : tour.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-100">
                      <span>{isFr ? tour.durationFr : tour.duration}</span>
                      <span className="text-[#1d7afc] font-semibold">
                        {isFr ? 'Explorer →' : 'Explore →'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Tailor-Made Concierge Request */}
      {showTailorModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={() => setShowTailorModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-md bg-white text-[#0b1220] rounded-3xl p-6 sm:p-7 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1d7afc]">
                <Sparkles className="w-4 h-4" />
                <span>{isFr ? 'Circuit Sur Mesure' : 'Tailor-Made Journey'}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowTailorModal(false)}
                aria-label={isFr ? 'Fermer' : 'Close'}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {tailorSubmitted ? (
              <div className="py-6 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-[#1d7afc] flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold mb-1">
                  {isFr ? 'Demande enregistrée !' : 'Custom Request Received'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mb-5">
                  {isFr
                    ? `Notre équipe conciergerie vous répondra à ${tailorEmail} sous 24h avec un programme sur mesure.`
                    : `Our travel specialists will reach out to ${tailorEmail} within 24 hours with a personalized itinerary.`}
                </p>
                <button
                  type="button"
                  onClick={() => setShowTailorModal(false)}
                  className="px-6 py-2.5 rounded-full bg-[#050a18] text-white text-xs font-semibold cursor-pointer"
                >
                  {isFr ? 'Fermer' : 'Done'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleTailorSubmit} className="space-y-4">
                <h3 className="text-xl font-bold">
                  {isFr ? 'Créez votre itinéraire idéal' : 'Design Your Personal Journey'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isFr
                    ? 'Indiquez vos dates souhaitées, vos centres d’intérêt (trek, culture, hôtels de charme) et recevez une proposition complète.'
                    : 'Share your preferred dates and interests (trekking, heritage, lakeside stays) for a bespoke Safarihoo plan.'}
                </p>

                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    {isFr ? 'Adresse e-mail' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    required
                    value={tailorEmail}
                    onChange={(e) => setTailorEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#1d7afc] focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    {isFr ? 'Préférences de séjour' : 'Journey Preferences'}
                  </label>
                  <textarea
                    rows={3}
                    value={tailorNotes}
                    onChange={(e) => setTailorNotes(e.target.value)}
                    placeholder={
                      isFr
                        ? 'Ex : 6 jours entre Pokhara et Katmandou, formule tout compris...'
                        : 'e.g. 6 days across Pokhara & Kathmandu, all-inclusive stays...'
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#1d7afc] focus:outline-none text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#050a18] hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  {isFr ? 'Recevoir mon programme sur mesure' : 'Request Tailor-Made Plan'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
