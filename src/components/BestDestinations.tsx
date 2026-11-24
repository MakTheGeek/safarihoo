import React, { useState, useRef, useMemo, useEffect } from 'react';
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
  MoreHorizontal,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCms } from '../context/CmsContext';

export const BestDestinations: React.FC = () => {
  const { language, t } = useLanguage();
  const { destinations } = useCms();
  const isFr = language === 'FR';

  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedDetailPlace, setSelectedDetailPlace] = useState<string>('newyork');
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

  const localizedDestinations = useMemo(
    () =>
      destinations.map((d) => ({
        ...d,
        displayTitle: isFr ? d.titleFr || d.title : d.title,
        displayTag: isFr ? d.tagFr || d.tag : d.tag,
        displayDescription: isFr ? d.descriptionFr || d.description : d.description,
      })),
    [destinations, isFr]
  );

  // Ensure selectedDetailPlace points to an active destination
  useEffect(() => {
    if (
      localizedDestinations.length > 0 &&
      !localizedDestinations.some((d) => d.id === selectedDetailPlace)
    ) {
      setSelectedDetailPlace(localizedDestinations[0].id);
      setActiveThumbnailIndex(0);
    }
  }, [localizedDestinations, selectedDetailPlace]);

  const filteredDestinations = useMemo(() => {
    if (activeCategory === 'All') return localizedDestinations;
    return localizedDestinations.filter((d) => d.categories.includes(activeCategory as never));
  }, [activeCategory, localizedDestinations]);

  const currentDetail =
    localizedDestinations.find((d) => d.id === selectedDetailPlace) || localizedDestinations[0];

  const handleSelectPlace = (id: string) => {
    setSelectedDetailPlace(id);
    setActiveThumbnailIndex(0);
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 240;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleBookDestination = () => {
    if (currentDetail?.bookingUrl && currentDetail.bookingUrl.trim()) {
      const href = currentDetail.bookingUrl.trim();
      if (href.startsWith('https://') || href.startsWith('http://')) {
        const anchor = document.createElement('a');
        anchor.href = href;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        anchor.click();
        return;
      }
      if (href.startsWith('#')) {
        window.location.hash = href;
        return;
      }
    }
    const widget = document.getElementById('main-booking-widget');
    if (widget) widget.scrollIntoView({ behavior: 'smooth' });
  };

  const card1Image = t('dest.card1.image');

  if (!currentDetail) return null;

  return (
    <section
      id="best-destinations-section"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 select-none"
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight uppercase">
          {t('dest.title')}
        </h2>
        <p className="text-white/80 text-sm sm:text-base mt-3 max-w-xl mx-auto font-normal leading-relaxed">
          {t('dest.subtitle')}
        </p>
      </div>

      {/* 3-Card Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-center justify-center max-w-6xl mx-auto pt-6">
        {/* CARD 1 (LEFT): Immersive Full-Bleed Portrait Card */}
        <div
          id="card-explore-journey"
          className="relative h-[580px] sm:h-[620px] rounded-[38px] overflow-hidden border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.9)] group transition-transform duration-500 hover:scale-[1.01]"
        >
          <img
            src={card1Image}
            alt="Explore Safarihoo Destinations"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40" />

          <div className="absolute inset-x-0 top-16 px-6 text-center z-10 flex flex-col items-center">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
              {t('dest.card1.title1')}
              <br />
              {t('dest.card1.title2')}
            </h3>
            <p className="text-white/80 text-xs sm:text-sm font-medium mt-2 tracking-wide drop-shadow">
              {t('dest.card1.sub')}
            </p>
          </div>

          <div className="absolute bottom-8 inset-x-0 flex justify-center z-10">
            <button
              type="button"
              onClick={() => {
                const keys = localizedDestinations.map((d) => d.id);
                if (keys.length === 0) return;
                const currentIdx = keys.indexOf(selectedDetailPlace);
                const nextId = keys[(currentIdx + 1) % keys.length];
                handleSelectPlace(nextId);
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

        {/* CARD 2 (CENTER): Discovery Mobile Layout with Scrollable Carousel */}
        <div
          id="card-discover-app"
          className="relative h-[580px] sm:h-[620px] rounded-[38px] overflow-hidden bg-white text-zinc-900 border border-white/20 shadow-[0_30px_70px_rgba(0,0,0,0.95)] p-5 flex flex-col justify-between lg:-translate-y-9 md:-translate-y-6 z-20 transition-transform duration-500 hover:lg:-translate-y-11"
        >
          <div className="flex flex-col flex-grow min-h-0">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xl font-extrabold text-zinc-950 tracking-tight leading-none">
                  {t('dest.card2.discover')}
                </h3>
                <span className="text-[10px] text-zinc-400 font-medium">
                  {t('dest.card2.scroll')}
                </span>
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

            <div
              ref={carouselRef}
              onWheel={(e) => {
                if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) && e.deltaY !== 0 && carouselRef.current) {
                  carouselRef.current.scrollLeft += e.deltaY * 0.8;
                }
              }}
              className="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory py-1 px-0.5 cursor-grab active:cursor-grabbing [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex-shrink-0"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {filteredDestinations.map((dest) => {
                const isSelected = currentDetail.id === dest.id;
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

                    {dest.displayTag && (
                      <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {dest.displayTag}
                      </div>
                    )}

                    <div className="absolute bottom-2 inset-x-2 bg-white/95 backdrop-blur-md rounded-xl p-2 flex items-center justify-between shadow-sm">
                      <div className="min-w-0 pr-1">
                        <h4 className="text-[11px] font-bold text-zinc-900 truncate leading-tight">
                          {dest.name}
                        </h4>
                        <p className="text-[9px] text-zinc-500 truncate leading-tight">
                          {dest.country}
                        </p>
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

            <div className="mt-3 pt-2 border-t border-zinc-100 flex-grow min-h-0 flex flex-col justify-end">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-zinc-900">{t('dest.card2.top')}</h4>
                <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-medium">
                  <span>
                    {localizedDestinations.length} {t('dest.card2.places')}
                  </span>
                  <MoreHorizontal className="w-3.5 h-3.5 text-zinc-400" />
                </div>
              </div>

              <div
                ref={topDestScrollRef}
                className="grid grid-cols-2 gap-2 overflow-y-auto max-h-24 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pr-0.5"
              >
                {localizedDestinations.slice(0, 4).map((item) => {
                  const isSelected = currentDetail.id === item.id;
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
                        src={item.thumbnails[0] || item.mainImage}
                        alt={item.name}
                        className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                        loading="lazy"
                      />
                      <div className="min-w-0 flex-grow">
                        <div
                          className={`text-[10px] font-bold truncate ${
                            isSelected ? 'text-white' : 'text-zinc-900'
                          }`}
                        >
                          {item.name}
                        </div>
                        <div
                          className={`text-[8px] truncate ${
                            isSelected ? 'text-zinc-300' : 'text-zinc-500'
                          }`}
                        >
                          {item.price}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-around pt-2.5 border-t border-zinc-100 mt-2">
            <button
              type="button"
              className="w-7 h-7 rounded-full bg-zinc-950 text-white flex items-center justify-center shadow-sm"
            >
              <Home className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                const keys = localizedDestinations.map((d) => d.id);
                if (keys.length === 0) return;
                const nextId = keys[(keys.indexOf(currentDetail.id) + 1) % keys.length];
                handleSelectPlace(nextId);
              }}
              className="text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
              title="Next destination"
            >
              <Compass className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsDetailLiked(!isDetailLiked)}
              className="text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
              title="Favorite"
            >
              <Heart className={`w-4 h-4 ${isDetailLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button
              type="button"
              className="text-zinc-400 hover:text-zinc-700 transition-colors"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CARD 3 (RIGHT): Destination Details Card */}
        <div
          id="card-destination-detail"
          className="relative h-[580px] sm:h-[620px] rounded-[38px] overflow-hidden bg-white text-zinc-900 border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col justify-between"
        >
          <div className="relative h-64 w-full rounded-b-[36px] overflow-hidden">
            <img
              src={currentDetail.thumbnails[activeThumbnailIndex] || currentDetail.mainImage}
              alt={currentDetail.displayTitle}
              className="w-full h-full object-cover transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

            <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
              <button
                type="button"
                onClick={() => {
                  const keys = localizedDestinations.map((d) => d.id);
                  if (keys.length === 0) return;
                  const currentIndex = keys.indexOf(currentDetail.id);
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
                    const keys = localizedDestinations.map((d) => d.id);
                    if (keys.length === 0) return;
                    const currentIndex = keys.indexOf(currentDetail.id);
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
                  <Heart
                    className={`w-4 h-4 ${
                      isDetailLiked ? 'fill-red-500 text-red-500' : 'text-zinc-900'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="absolute bottom-4 left-5 z-10 text-white max-w-[65%]">
              <h3 className="text-xl font-extrabold tracking-tight drop-shadow-md leading-tight">
                {currentDetail.displayTitle}
              </h3>
              <div className="flex items-center gap-1 text-xs text-white/90 font-medium mt-0.5 drop-shadow">
                <MapPin className="w-3 h-3 text-white flex-shrink-0" />
                <span className="truncate">{currentDetail.location}</span>
              </div>
            </div>

            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 z-20">
              {currentDetail.thumbnails.slice(0, 4).map((thumb, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveThumbnailIndex(idx)}
                  className={`w-9 h-11 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shadow-md ${
                    activeThumbnailIndex === idx
                      ? 'border-white scale-110'
                      : 'border-white/50 opacity-80 hover:opacity-100'
                  }`}
                  title={`View photo ${idx + 1}`}
                >
                  <img src={thumb} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 flex flex-col justify-between flex-grow">
            <div className="grid grid-cols-3 gap-2 text-center my-1">
              <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
                <span className="text-[10px] font-medium text-zinc-400 block">
                  {t('dest.card3.distance')}
                </span>
                <span className="text-xs font-bold text-blue-600">{currentDetail.distance}</span>
              </div>
              <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
                <span className="text-[10px] font-medium text-zinc-400 block">
                  {t('dest.card3.temp')}
                </span>
                <span className="text-xs font-bold text-teal-600">{currentDetail.temp}</span>
              </div>
              <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
                <span className="text-[10px] font-medium text-zinc-400 block">
                  {t('dest.card3.rating')}
                </span>
                <span className="text-xs font-bold text-amber-500">{currentDetail.rating}</span>
              </div>
            </div>

            <div className="my-2 text-left">
              <h4 className="text-xs font-bold text-zinc-950 mb-1">{t('dest.card3.desc')}</h4>
              <p className="text-[11px] text-zinc-600 leading-relaxed line-clamp-3">
                {currentDetail.displayDescription}{' '}
                <span
                  onClick={handleBookDestination}
                  className="text-blue-600 font-semibold cursor-pointer hover:underline"
                >
                  {t('dest.card3.book')}
                </span>
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
              <div>
                <span className="text-[10px] font-medium text-zinc-400 block">
                  {t('dest.card3.total')}
                </span>
                <span className="text-xl font-black text-zinc-950">{currentDetail.price}</span>
              </div>

              <button
                type="button"
                onClick={handleBookDestination}
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
