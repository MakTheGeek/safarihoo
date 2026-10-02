import React, { useState, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight,
  Heart, 
  ChevronUp, 
  ArrowRight, 
  MapPin, 
  Star, 
  Compass, 
  User, 
  Home, 
  MoreHorizontal
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface DestinationItem {
  id: 'egypt' | 'paris' | 'newyork' | 'rome' | 'tokyo' | 'bali' | 'santorini' | 'dubai';
  title: string;
  name: string;
  location: string;
  country: string;
  categories: string[];
  mainImage: string;
  thumbnails: string[];
  distance: string;
  temp: string;
  rating: string;
  price: string;
  tag?: string;
  description: string;
}

export const BestDestinations: React.FC = () => {
  const { language, t } = useLanguage();
  const isFr = language === 'FR';
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedDetailPlace, setSelectedDetailPlace] = useState<'egypt' | 'paris' | 'newyork' | 'rome' | 'tokyo' | 'bali' | 'santorini' | 'dubai'>('newyork');
  const [isDetailLiked, setIsDetailLiked] = useState(false);
  const [activeThumbnailIndex, setActiveThumbnailIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const topDestScrollRef = useRef<HTMLDivElement>(null);

  const categories = [
    { key: 'All', label: t('dest.cat.all') },
    { key: 'Cities', label: t('dest.cat.cities') },
    { key: 'Historic', label: t('dest.cat.historic') },
    { key: 'Beach', label: t('dest.cat.beach') },
    { key: 'Wonders', label: t('dest.cat.wonders') },
  ];

  const allDestinations: DestinationItem[] = [
    {
      id: 'newyork',
      title: isFr ? 'Panorama de Manhattan' : 'Manhattan Skyline',
      name: 'Manhattan',
      location: 'New York, USA',
      country: 'USA',
      categories: ['Cities'],
      mainImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
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
      tag: isFr ? 'Tendance' : 'Trending',
      description: isFr 
        ? 'Plongez au cœur de la culture, des théâtres de Broadway, de Central Park et de la célèbre silhouette scintillante de Manhattan.'
        : 'Immerse yourself in the bustling epicenter of culture, Broadway theaters, Central Park, and the unforgettable glittering skyline of Manhattan.'
    },
    {
      id: 'paris',
      title: isFr ? 'Tour Eiffel & Seine' : 'Eiffel & Seine',
      name: 'Paris',
      location: 'Paris, France',
      country: 'France',
      categories: ['Cities', 'Historic'],
      mainImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
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
      tag: isFr ? 'Populaire' : 'Popular',
      description: isFr
        ? 'Vivez la magie de la Ville Lumière avec ses vues panoramiques, son architecture mondialement réputée et ses balades romantiques le long de la Seine.'
        : 'Experience the magic of the City of Light with iconic panoramic vistas, world-renowned architecture, haute cuisine, and scenic strolls along the Seine.'
    },
    {
      id: 'egypt',
      title: isFr ? 'Grandes Pyramides' : 'Great Pyramids',
      name: 'Giza Pyramids',
      location: 'Giza, Egypt',
      country: 'Egypt',
      categories: ['Historic', 'Wonders'],
      mainImage: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80',
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
      tag: isFr ? 'Merveille' : 'Top Wonder',
      description: isFr
        ? 'Le plateau mythique de Gizeh abrite la Grande Pyramide de Khéops, l\'énigmatique Sphinx et des millénaires d\'histoire le long du Nil.'
        : 'The iconic Giza Plateau features the Great Pyramid of Khufu, the enigmatic Sphinx, and thousands of years of ancient world history along the majestic Nile.'
    },
    {
      id: 'rome',
      title: isFr ? 'Colisée & Forum' : 'Colosseum & Forum',
      name: 'Rome',
      location: 'Rome, Italy',
      country: 'Italy',
      categories: ['Cities', 'Historic'],
      mainImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
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
      tag: isFr ? 'Patrimoine' : 'Heritage',
      description: isFr
        ? 'Voyagez au cœur de l\'antiquité en explorant le Colisée, le Panthéon, les trésors du Vatican et les magnifiques ruelles pavées.'
        : 'Step inside timeless antiquity exploring the Colosseum, the Pantheon, Vatican art treasures, and picturesque cobblestone piazzas.'
    },
    {
      id: 'tokyo',
      title: isFr ? 'Shibuya & Shinjuku' : 'Shibuya & Shinjuku',
      name: 'Tokyo',
      location: 'Tokyo, Japan',
      country: 'Japan',
      categories: ['Cities', 'Wonders'],
      mainImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
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
      tag: isFr ? 'Futuriste' : 'Modern',
      description: isFr
        ? 'Une métropole fascinante où néons éblouissants, sanctuaires ancestraux, haute gastronomie et culture pop s\'harmonisent à la perfection.'
        : 'A harmonious blend of cutting-edge technology and serene ancient shrines, offering neon-lit nightscapes, world-class culinary art, and vibrant pop culture.'
    },
    {
      id: 'santorini',
      title: isFr ? 'Oia & Caldeira' : 'Oia White Caldera',
      name: 'Santorini',
      location: 'Santorini, Greece',
      country: 'Greece',
      categories: ['Beach', 'Wonders'],
      mainImage: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
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
      tag: isFr ? 'Romance' : 'Romance',
      description: isFr
        ? 'Villas blanches à flanc de falaise, dômes bleus emblématiques, plages volcaniques et couchers de soleil légendaires sur la mer Égée.'
        : 'Iconic whitewashed cliffside villas, cobalt-blue domes, volcanic Aegean beaches, and world-renowned golden sunset vistas over the caldera.'
    },
    {
      id: 'bali',
      title: isFr ? 'Ubud & Seminyak' : 'Ubud & Seminyak',
      name: 'Bali',
      location: 'Bali, Indonesia',
      country: 'Indonesia',
      categories: ['Beach', 'Wonders'],
      mainImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
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
      tag: isFr ? 'Paradis' : 'Tropical',
      description: isFr
        ? 'Rizières en terrasses luxuriantes, temples sacrés au bord de l\'eau, spots de surf mondiaux et villas de bien-être ressourçantes.'
        : 'Lush tropical rice terraces, spiritual water temples, serene surf retreats, and rejuvenating holistic wellness villas in paradise.'
    },
    {
      id: 'dubai',
      title: isFr ? 'Burj Khalifa & Désert' : 'Burj Khalifa & Desert',
      name: 'Dubai',
      location: 'Dubai, UAE',
      country: 'UAE',
      categories: ['Cities', 'Wonders'],
      mainImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
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
      tag: isFr ? 'Luxe' : 'Luxury',
      description: isFr
        ? 'Merveilles architecturales futuristes, marinas de shopping prestigieuses, safaris dans les dunes dorées et eaux chaudes du golfe Persique.'
        : 'Futuristic architectural wonders, luxurious shopping marinas, private desert safaris, and crystal warm waters along the Arabian Gulf.'
    }
  ];

  // Filtered destinations based on category tab
  const filteredDestinations = activeCategory === 'All' 
    ? allDestinations 
    : allDestinations.filter(d => d.categories.includes(activeCategory));

  // Current active destination for Card 3
  const currentDetail = allDestinations.find(d => d.id === selectedDetailPlace) || allDestinations[0];

  const handleSelectPlace = (id: DestinationItem['id']) => {
    setSelectedDetailPlace(id);
    setActiveThumbnailIndex(0);
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 240;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="best-destinations-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 select-none">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight uppercase">
          {t('dest.title')}
        </h2>
        <p className="text-white/80 text-sm sm:text-base mt-3 max-w-xl mx-auto font-normal leading-relaxed">
          {t('dest.subtitle')}
        </p>
      </div>

      {/* 3-Card Showcase Grid matching reference format */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-center justify-center max-w-6xl mx-auto pt-6">
        
        {/* CARD 1 (LEFT): Immersive Full-Bleed Portrait Card (Paris Eiffel Tower) */}
        <div 
          id="card-explore-journey"
          className="relative h-[580px] sm:h-[620px] rounded-[38px] overflow-hidden border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.9)] group transition-transform duration-500 hover:scale-[1.01]"
        >
          {/* Background Image */}
          <img
            src="https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=1000&q=85"
            alt="Paris Eiffel Tower"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40" />

          {/* Top/Center Text Overlay */}
          <div className="absolute inset-x-0 top-16 px-6 text-center z-10 flex flex-col items-center">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
              {t('dest.card1.title1')}<br />{t('dest.card1.title2')}
            </h3>
            <p className="text-white/80 text-xs sm:text-sm font-medium mt-2 tracking-wide drop-shadow">
              {t('dest.card1.sub')}
            </p>
          </div>

          {/* Bottom Capsule Slider Pill */}
          <div className="absolute bottom-8 inset-x-0 flex justify-center z-10">
            <button
              type="button"
              onClick={() => {
                handleSelectPlace('paris');
                const nextPlace: DestinationItem['id'] = selectedDetailPlace === 'paris' ? 'egypt' : 'paris';
                handleSelectPlace(nextPlace);
              }}
              className="w-14 h-24 rounded-full bg-white/25 backdrop-blur-xl border border-white/40 p-1.5 flex flex-col items-center justify-between shadow-2xl hover:bg-white/35 transition-all group/pill cursor-pointer"
              title="Explore journey"
            >
              <ChevronUp className="w-5 h-5 text-white animate-bounce mt-1" />
              <div className="w-11 h-11 rounded-full bg-white text-black font-bold text-xs flex items-center justify-center shadow-md group-hover/pill:scale-105 transition-transform">
                {t('dest.card1.go')}
              </div>
            </button>
          </div>
        </div>

        {/* CARD 2 (CENTER): Discovery Mobile Layout with Fully Scrollable Carousel */}
        <div 
          id="card-discover-app"
          className="relative h-[580px] sm:h-[620px] rounded-[38px] overflow-hidden bg-white text-zinc-900 border border-white/20 shadow-[0_30px_70px_rgba(0,0,0,0.95)] p-5 flex flex-col justify-between lg:-translate-y-9 md:-translate-y-6 z-20 transition-transform duration-500 hover:lg:-translate-y-11"
        >
          {/* App Top Bar */}
          <div className="flex flex-col flex-grow min-h-0">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xl font-extrabold text-zinc-950 tracking-tight leading-none">{t('dest.card2.discover')}</h3>
                <span className="text-[10px] text-zinc-400 font-medium">{t('dest.card2.scroll')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button 
                  type="button"
                  onClick={() => scrollCarousel('left')}
                  className="w-7 h-7 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 flex items-center justify-center transition-colors"
                  title="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  type="button"
                  onClick={() => scrollCarousel('right')}
                  className="w-7 h-7 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 flex items-center justify-center transition-colors"
                  title="Scroll right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-3 text-xs font-semibold text-zinc-400 mb-3.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-1 flex-shrink-0">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setActiveCategory(cat.key)}
                    className={`relative py-1 px-1 whitespace-nowrap transition-colors cursor-pointer ${
                      isActive ? 'text-zinc-950 font-bold' : 'hover:text-zinc-600'
                    }`}
                  >
                    {cat.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-1 right-1 h-0.5 bg-zinc-950 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* MAIN FEATURED SCROLLABLE CAROUSEL - All Elements Move Smoothly on Scroll / Swipe / Drag */}
            <div 
              ref={carouselRef}
              onWheel={(e) => {
                // If user scrolls vertically over this carousel, translate vertical scroll to horizontal scroll
                if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) && e.deltaY !== 0 && carouselRef.current) {
                  carouselRef.current.scrollLeft += e.deltaY * 0.8;
                }
              }}
              className="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory py-1 px-0.5 cursor-grab active:cursor-grabbing [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex-shrink-0"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {filteredDestinations.map((dest) => {
                const isSelected = selectedDetailPlace === dest.id;
                return (
                  <div 
                    key={dest.id}
                    onClick={() => handleSelectPlace(dest.id)}
                    className={`relative w-[185px] sm:w-[195px] h-52 rounded-2xl overflow-hidden cursor-pointer group flex-shrink-0 shadow-md border snap-start transition-all duration-300 ${
                      isSelected 
                        ? 'ring-2 ring-zinc-950 border-transparent scale-[0.99]' 
                        : 'border-zinc-200/90 hover:border-zinc-400 hover:shadow-lg'
                    }`}
                  >
                    <img
                      src={dest.mainImage}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    
                    {/* Badge */}
                    {dest.tag && (
                      <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {dest.tag}
                      </div>
                    )}

                    {/* Floating Info Tag at bottom */}
                    <div className="absolute bottom-2 inset-x-2 bg-white/95 backdrop-blur-md rounded-xl p-2 flex items-center justify-between shadow-sm">
                      <div className="min-w-0 pr-1">
                        <h4 className="text-[11px] font-bold text-zinc-900 truncate leading-tight">{dest.name}</h4>
                        <p className="text-[9px] text-zinc-500 truncate leading-tight">{dest.country}</p>
                      </div>
                      <div className="flex items-center gap-0.5 text-[10px] font-bold text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded flex-shrink-0">
                        <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                        <span>{dest.rating}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Top Destination Sub-Section (Scrollable & Interactive Grid) */}
            <div className="mt-3 pt-2 border-t border-zinc-100 flex-grow min-h-0 flex flex-col justify-end">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-zinc-900">{t('dest.card2.top')}</h4>
                <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-medium">
                  <span>{allDestinations.length} {t('dest.card2.places')}</span>
                  <MoreHorizontal className="w-3.5 h-3.5 text-zinc-400" />
                </div>
              </div>

              <div 
                ref={topDestScrollRef}
                className="grid grid-cols-2 gap-2 overflow-y-auto max-h-24 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pr-0.5"
              >
                {allDestinations.slice(0, 4).map((item) => {
                  const isSelected = selectedDetailPlace === item.id;
                  return (
                    <div 
                      key={item.id}
                      onClick={() => handleSelectPlace(item.id)}
                      className={`flex items-center gap-2 p-1.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-zinc-950 text-white border-zinc-950 shadow-sm' 
                          : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-900 border-zinc-200/70'
                      }`}
                    >
                      <img
                        src={item.thumbnails[0]}
                        alt={item.name}
                        className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                        loading="lazy"
                      />
                      <div className="min-w-0 flex-grow">
                        <div className={`text-[10px] font-bold truncate ${isSelected ? 'text-white' : 'text-zinc-900'}`}>
                          {item.name}
                        </div>
                        <div className={`text-[8px] truncate ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                          {item.price}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom App Navigation Bar */}
          <div className="flex items-center justify-around pt-2.5 border-t border-zinc-100 mt-2">
            <button className="w-7 h-7 rounded-full bg-zinc-950 text-white flex items-center justify-center shadow-sm">
              <Home className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => {
                const keys = allDestinations.map(d => d.id);
                const nextId = keys[(keys.indexOf(selectedDetailPlace) + 1) % keys.length];
                handleSelectPlace(nextId);
              }}
              className="text-zinc-400 hover:text-zinc-700 transition-colors"
              title="Next destination"
            >
              <Compass className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsDetailLiked(!isDetailLiked)}
              className="text-zinc-400 hover:text-red-500 transition-colors"
              title="Favorite"
            >
              <Heart className={`w-4 h-4 ${isDetailLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button className="text-zinc-400 hover:text-zinc-700 transition-colors">
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CARD 3 (RIGHT): Destination Details Card (Dynamically Synced with Selected Place) */}
        <div 
          id="card-destination-detail"
          className="relative h-[580px] sm:h-[620px] rounded-[38px] overflow-hidden bg-white text-zinc-900 border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col justify-between"
        >
          {/* Top Hero Arched Photo Area */}
          <div className="relative h-64 w-full rounded-b-[36px] overflow-hidden">
            <img
              src={currentDetail.thumbnails[activeThumbnailIndex] || currentDetail.mainImage}
              alt={currentDetail.title}
              className="w-full h-full object-cover transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

            {/* Top Back & Heart Controls */}
            <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
              <button 
                type="button"
                onClick={() => {
                  const keys = allDestinations.map(d => d.id);
                  const currentIndex = keys.indexOf(selectedDetailPlace);
                  const prevIndex = (currentIndex - 1 + keys.length) % keys.length;
                  handleSelectPlace(keys[prevIndex]);
                }}
                className="w-8 h-8 rounded-full bg-white/70 backdrop-blur-md text-zinc-900 flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
                title="Previous destination"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5">
                <button 
                  type="button"
                  onClick={() => {
                    const keys = allDestinations.map(d => d.id);
                    const currentIndex = keys.indexOf(selectedDetailPlace);
                    const nextIndex = (currentIndex + 1) % keys.length;
                    handleSelectPlace(keys[nextIndex]);
                  }}
                  className="w-8 h-8 rounded-full bg-white/70 backdrop-blur-md text-zinc-900 flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
                  title="Next destination"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button 
                  type="button"
                  onClick={() => setIsDetailLiked(!isDetailLiked)}
                  className="w-8 h-8 rounded-full bg-white/70 backdrop-blur-md text-zinc-900 flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
                  title="Save destination"
                >
                  <Heart className={`w-4 h-4 ${isDetailLiked ? 'fill-red-500 text-red-500' : 'text-zinc-900'}`} />
                </button>
              </div>
            </div>

            {/* Place Title & Location Pin inside Photo */}
            <div className="absolute bottom-4 left-5 z-10 text-white max-w-[65%]">
              <h3 className="text-xl font-extrabold tracking-tight drop-shadow-md leading-tight">
                {currentDetail.title}
              </h3>
              <div className="flex items-center gap-1 text-xs text-white/90 font-medium mt-0.5 drop-shadow">
                <MapPin className="w-3 h-3 text-white flex-shrink-0" />
                <span className="truncate">{currentDetail.location}</span>
              </div>
            </div>

            {/* Vertical Stack of 4 Rounded Thumbnails on the Right */}
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 z-20">
              {currentDetail.thumbnails.map((thumb, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveThumbnailIndex(idx)}
                  className={`w-9 h-11 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shadow-md ${
                    activeThumbnailIndex === idx ? 'border-white scale-110' : 'border-white/50 opacity-80 hover:opacity-100'
                  }`}
                  title={`View photo ${idx + 1}`}
                >
                  <img src={thumb} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details Content (Distance, Temp, Rating, Description, Price) */}
          <div className="p-5 flex flex-col justify-between flex-grow">
            {/* 3 Metric Pills */}
            <div className="grid grid-cols-3 gap-2 text-center my-1">
              <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
                <span className="text-[10px] font-medium text-zinc-400 block">{t('dest.card3.distance')}</span>
                <span className="text-xs font-bold text-blue-600">{currentDetail.distance}</span>
              </div>
              <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
                <span className="text-[10px] font-medium text-zinc-400 block">{t('dest.card3.temp')}</span>
                <span className="text-xs font-bold text-teal-600">{currentDetail.temp}</span>
              </div>
              <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
                <span className="text-[10px] font-medium text-zinc-400 block">{t('dest.card3.rating')}</span>
                <span className="text-xs font-bold text-amber-500">{currentDetail.rating}</span>
              </div>
            </div>

            {/* Description */}
            <div className="my-2 text-left">
              <h4 className="text-xs font-bold text-zinc-950 mb-1">{t('dest.card3.desc')}</h4>
              <p className="text-[11px] text-zinc-600 leading-relaxed line-clamp-3">
                {currentDetail.description}{' '}
                <span 
                  onClick={() => {
                    const widget = document.getElementById('main-booking-widget');
                    if (widget) widget.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-blue-600 font-semibold cursor-pointer hover:underline"
                >
                  {t('dest.card3.book')}
                </span>
              </p>
            </div>

            {/* Total Price & Book Action */}
            <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
              <div>
                <span className="text-[10px] font-medium text-zinc-400 block">{t('dest.card3.total')}</span>
                <span className="text-xl font-black text-zinc-950">{currentDetail.price}</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  const widget = document.getElementById('main-booking-widget');
                  if (widget) widget.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-12 h-12 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white flex items-center justify-center transition-all shadow-lg active:scale-95 cursor-pointer"
                title={`Book ${currentDetail.name}`}
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
