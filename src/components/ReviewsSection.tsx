import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Star,
  Quote,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  Plus,
  X,
  Send,
  Plane,
  Hotel,
  Car,
  ShieldCheck,
  Camera,
  Upload,
  Trash2,
  User,
  Link as LinkIcon,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCms } from '../context/CmsContext';
import { ReviewCategory, SiteReviewItem } from '../types';

export const ReviewsSection: React.FC = () => {
  const { language, t: cmsT } = useLanguage();
  const { reviews } = useCms();
  const isFr = language === 'FR';

  const [activeCategory, setActiveCategory] = useState<'all' | ReviewCategory>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [headline, setHeadline] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Profile photo state
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [avatarUrlInput, setAvatarUrlInput] = useState<string>('');
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const [avatarError, setAvatarError] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [customReview, setCustomReview] = useState<{
    name: string;
    role: string;
    headline: string;
    text: string;
    rating: number;
    avatar: string;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('safarihoo_custom_review');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && typeof parsed.name === 'string' && typeof parsed.text === 'string') {
          return {
            name: parsed.name,
            role: typeof parsed.role === 'string' ? parsed.role : '',
            headline: typeof parsed.headline === 'string' ? parsed.headline : '',
            text: parsed.text,
            rating: Math.max(1, Math.min(5, Math.round(Number(parsed.rating) || 5))),
            avatar: typeof parsed.avatar === 'string' && parsed.avatar ? parsed.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          };
        }
      }
    } catch {
      // ignore
    }
    return null;
  });

  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleResetModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isModalOpen]);

  const copy = {
    title: cmsT('reviews.title'),
    subtitle: cmsT('reviews.subtitle'),
    ratingPill: cmsT('reviews.ratingPill'),
    btnWriteReview: cmsT('reviews.btnWriteReview'),
    filterAll: isFr ? 'Tous les avis' : 'All Reviews',
    filterFlights: isFr ? 'Vols & Billets' : 'Flights',
    filterHotels: isFr ? 'Hôtels & Résidences' : 'Hotels',
    filterCars: isFr ? 'Location de Voiture' : 'Car Rentals',
    filterAirhelp: isFr ? 'AirHelp & Droits' : 'AirHelp Claims',
    modalBadge: isFr ? 'Votre avis' : 'Your review',
    modalTitle: isFr ? 'Partagez Votre Expérience' : 'Share Your Travel Experience',
    modalSubtitle: isFr
      ? 'Votre avis aide des milliers d’autres voyageurs à préparer leur prochain périple.'
      : 'Your feedback empowers millions of fellow explorers to plan smarter trips.',
    yourRating: isFr ? 'Votre note :' : 'Your Rating:',
    photoLabel: isFr ? 'Votre photo de profil (optionnel)' : 'Your Profile Photo (Optional)',
    photoUploadBtn: isFr ? 'Choisir une photo' : 'Choose photo',
    photoChangeBtn: isFr ? 'Changer' : 'Change',
    photoRemoveBtn: isFr ? 'Supprimer' : 'Remove',
    photoHint: isFr
      ? 'PNG, JPG ou WEBP (max 5 Mo) ou glissez-déposez ici'
      : 'PNG, JPG or WEBP (max 5MB) or drag & drop here',
    photoUrlToggle: isFr ? 'ou utiliser une URL d’image web' : 'or use web image URL',
    photoUrlHide: isFr ? 'Revenir à l’import de fichier' : 'Back to file upload',
    photoUrlPlaceholder: isFr
      ? 'https://exemple.com/ma-photo.jpg'
      : 'https://example.com/my-photo.jpg',
    nameLabel: isFr ? 'Nom & Prénom' : 'Full Name',
    namePlaceholder: isFr ? 'ex. Thomas Bernard' : 'e.g. Thomas Bernard',
    roleLabel: isFr ? 'Ville ou profession (optionnel)' : 'City or Role (Optional)',
    rolePlaceholder: isFr ? 'ex. Paris, France' : 'e.g. London, UK',
    headlineLabel: isFr ? 'Titre de votre avis' : 'Review Title',
    headlinePlaceholder: isFr ? 'ex. Très impressionné !' : 'e.g. Very impressed!',
    textLabel: isFr ? 'Votre commentaire' : 'Your Review',
    textPlaceholder: isFr
      ? 'Racontez votre expérience de réservation, les économies réalisées ou la qualité de service...'
      : 'Describe your booking journey, savings unlocked, or overall travel experience...',
    btnSubmit: isFr ? 'Publier mon avis' : 'Submit Review',
    successTitle: isFr ? 'Merci pour votre avis !' : 'Thank you for your review!',
    successDesc: isFr
      ? 'Votre témoignage a bien été publié et s’affiche dès à présent sur le site.'
      : 'Your review has been successfully published and is now displayed on the site.',
    closeBtn: isFr ? 'Fermer' : 'Close',
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setAvatarError(
        isFr
          ? 'Veuillez choisir un fichier image (JPG, PNG, WEBP).'
          : 'Please choose an image file (JPG, PNG, WEBP).'
      );
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError(
        isFr
          ? 'L’image dépasse 5 Mo. Veuillez choisir un fichier plus léger.'
          : 'Image exceeds 5MB limit. Please choose a smaller file.'
      );
      return;
    }
    setAvatarError('');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarPreview(reader.result);
      }
    };
    reader.onerror = () => {
      setAvatarError(isFr ? 'Erreur lors du chargement de l’image.' : 'Error loading image.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview('');
    setAvatarUrlInput('');
    setAvatarError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !reviewText.trim()) return;

    const finalAvatar =
      avatarPreview.trim() ||
      avatarUrlInput.trim() ||
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';

    const newReview = {
      name: authorName.trim(),
      role: authorRole.trim() || (isFr ? 'Voyageur Safarihoo' : 'Safarihoo Traveler'),
      headline:
        headline.trim() ||
        (rating === 5
          ? isFr
            ? 'Expérience exceptionnelle !'
            : 'Exceptional experience!'
          : isFr
          ? 'Très bon service'
          : 'Great service'),
      text: reviewText.trim(),
      rating,
      avatar: finalAvatar,
    };

    setCustomReview(newReview);
    try {
      localStorage.setItem('safarihoo_custom_review', JSON.stringify(newReview));
    } catch {
      // quota or private mode
    }
    setSubmitted(true);
  };

  const handleResetModal = () => {
    setIsModalOpen(false);
    setSubmitted(false);
    setAuthorName('');
    setAuthorRole('');
    setHeadline('');
    setReviewText('');
    setRating(5);
    setAvatarPreview('');
    setAvatarUrlInput('');
    setShowUrlInput(false);
    setAvatarError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const visibleReviews = useMemo(() => {
    const base =
      activeCategory === 'all' ? reviews : reviews.filter((r) => r.category === activeCategory);
    return base.length > 0 ? base : reviews;
  }, [reviews, activeCategory]);

  const renderReviewCard = (review: SiteReviewItem, index: number) => {
    const isFirstWithVisitorOverride = index === 0 && activeCategory === 'all' && customReview;

    const name = isFirstWithVisitorOverride ? customReview.name : review.name;
    const role = isFirstWithVisitorOverride
      ? customReview.role
      : isFr
      ? review.roleFr || review.role
      : review.role;
    const cardHeadline = isFirstWithVisitorOverride
      ? customReview.headline
      : isFr
      ? review.headlineFr || review.headline
      : review.headline;
    const text = isFirstWithVisitorOverride
      ? customReview.text
      : isFr
      ? review.textFr || review.text
      : review.text;
    const rawStars = isFirstWithVisitorOverride ? customReview.rating : review.rating;
    const starCount = Math.max(1, Math.min(5, Math.round(Number(rawStars) || 5)));
    const avatar = isFirstWithVisitorOverride ? customReview.avatar : review.avatar;

    switch (review.cardStyle) {
      case 'avatar-top-stars':
        return (
          <div
            key={review.id}
            className="relative bg-white rounded-3xl p-5 pt-9 sm:p-6 sm:pt-10 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-zinc-100 hover:shadow-[0_18px_35px_rgba(0,0,0,0.1)] transition-all duration-300 text-center flex flex-col justify-between"
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-md bg-zinc-200">
              <img src={avatar} alt={name} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div>
              <div className="flex items-center justify-center gap-0.5 text-amber-400 mb-1.5">
                {[...Array(starCount)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              {cardHeadline && (
                <h3 className="text-sm sm:text-base font-extrabold text-zinc-900 mb-1.5">
                  {cardHeadline}
                </h3>
              )}
              <p className="text-xs sm:text-[13px] text-zinc-600 leading-relaxed mb-4">{text}</p>
            </div>
            <div className="pt-2 border-t border-zinc-100 relative mt-auto">
              <div className="text-xs font-bold text-zinc-900">{name}</div>
              <div className="text-[10px] text-zinc-400">{role}</div>
              <div className="absolute -bottom-1 right-1 w-6 h-6 rounded-md bg-zinc-900 text-white flex items-center justify-center shadow-sm">
                <Quote className="w-2.5 h-2.5 fill-white rotate-180" />
              </div>
            </div>
          </div>
        );

      case 'headline-stars':
        return (
          <div
            key={review.id}
            className="relative bg-white rounded-3xl p-5 pt-9 sm:p-6 sm:pt-10 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-zinc-100 text-center hover:shadow-[0_18px_35px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col justify-between"
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-md bg-zinc-200">
              <img src={avatar} alt={name} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div>
              {cardHeadline && (
                <h3 className="text-sm sm:text-base font-extrabold text-zinc-900 mb-1">
                  {cardHeadline}
                </h3>
              )}
              <div className="flex items-center justify-center gap-0.5 text-amber-400 mb-2">
                {[...Array(starCount)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-[13px] text-zinc-600 leading-relaxed mb-4">{text}</p>
            </div>
            <div className="pt-2 border-t border-zinc-100 mt-auto">
              <div className="text-xs font-bold text-zinc-900">{name}</div>
              <div className="text-[10px] text-zinc-400">{role}</div>
            </div>
          </div>
        );

      case 'quote-bottom-avatar':
        return (
          <div
            key={review.id}
            className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-zinc-100 hover:shadow-[0_18px_35px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <Quote className="w-4 h-4 text-zinc-400 mb-2" />
              {cardHeadline && (
                <h3 className="text-sm font-extrabold text-zinc-900 mb-1">{cardHeadline}</h3>
              )}
              <p className="text-xs sm:text-[13px] text-zinc-600 leading-relaxed mb-5">{text}</p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-zinc-100 mt-auto">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-zinc-100 shadow-sm flex-shrink-0">
                <img src={avatar} alt={name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold text-zinc-900 truncate">{name}</div>
                <div className="text-[11px] text-zinc-400 truncate">{role}</div>
              </div>
            </div>
          </div>
        );

      case 'cursive-signature':
        return (
          <div
            key={review.id}
            className="relative mt-3 sm:mt-0 bg-white rounded-3xl p-5 pt-8 sm:p-6 sm:pt-9 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-zinc-100 text-center hover:shadow-[0_18px_35px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col justify-between"
          >
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full border-2 border-white overflow-hidden shadow-md bg-zinc-200">
              <img src={avatar} alt={name} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div>
              <div className="flex items-center justify-center gap-0.5 text-amber-400 mb-1.5">
                {[...Array(starCount)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-[13px] text-zinc-600 leading-relaxed mb-3">{text}</p>
            </div>
            <div className="pt-2 border-t border-zinc-100 mt-auto">
              <div
                className="text-base sm:text-lg text-zinc-800 italic font-serif tracking-wide"
                style={{ fontFamily: "'Brush Script MT', 'Caveat', cursive, Georgia, serif" }}
              >
                {name}
              </div>
              <div className="text-[10px] text-zinc-400">{role}</div>
            </div>
          </div>
        );

      case 'headline-avatars':
        return (
          <div
            key={review.id}
            className="relative bg-white rounded-3xl p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-zinc-100 text-center hover:shadow-[0_18px_35px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {cardHeadline && (
                <h3 className="text-sm sm:text-base font-extrabold text-zinc-900 mb-1.5">
                  {cardHeadline}
                </h3>
              )}
              <p className="text-xs sm:text-[13px] text-zinc-600 leading-relaxed mb-3">{text}</p>
              <div className="text-[11px] font-semibold text-zinc-500">{name}</div>
            </div>
            <div className="flex items-center justify-center -space-x-2 pt-3 border-t border-zinc-100 mt-auto">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80"
                  alt="Traveler 1"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-md z-10">
                <img src={avatar} alt={name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80"
                  alt="Traveler 3"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        );

      case 'quote-top':
      default:
        return (
          <div
            key={review.id}
            className="relative bg-white rounded-3xl p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-zinc-100 hover:shadow-[0_18px_35px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col justify-between"
          >
            <div className="absolute -top-3.5 left-6 w-8 h-8 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-md">
              <Quote className="w-3.5 h-3.5 fill-white" />
            </div>

            <div className="pt-2">
              {isFirstWithVisitorOverride && (
                <div className="flex items-center justify-between gap-1 mb-2">
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[10px] font-bold text-blue-600">
                    <Sparkles className="w-3 h-3 text-blue-600" />
                    <span>{isFr ? 'Avis récent' : 'Latest review'}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(starCount)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              )}

              {cardHeadline && (
                <h3 className="text-sm font-extrabold text-zinc-900 mb-1.5">{cardHeadline}</h3>
              )}

              <p className="text-xs sm:text-[13px] text-zinc-600 leading-relaxed mb-4">{text}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-zinc-100 mt-auto">
              <div className="min-w-0 pr-2">
                <div className="text-xs sm:text-sm font-bold text-zinc-900 truncate">{name}</div>
                <div className="text-[11px] text-zinc-400 truncate">{role}</div>
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                <img src={avatar} alt={name} className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <section
      id="reviews-section"
      className="w-full py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10"
    >
      <div className="w-full">
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight uppercase">
            {copy.title}
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 mt-3 leading-relaxed max-w-2xl mx-auto font-normal">
            {copy.subtitle}
          </p>

          {/* Rating badge & Trust indicator */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 backdrop-blur-md border border-white/10 shadow-sm text-xs font-semibold text-zinc-200">
              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span>{copy.ratingPill}</span>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-md cursor-pointer hover:shadow-lg active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{copy.btnWriteReview}</span>
            </button>
          </div>

          {/* Categories Tab Bar */}
          <div className="flex items-center justify-center flex-wrap gap-2 mt-6">
            {[
              { id: 'all', label: copy.filterAll },
              { id: 'flights', label: copy.filterFlights, icon: Plane },
              { id: 'hotels', label: copy.filterHotels, icon: Hotel },
              { id: 'cars', label: copy.filterCars, icon: Car },
              { id: 'airhelp', label: copy.filterAirhelp, icon: ShieldCheck },
            ].map((cat) => {
              const isActive = activeCategory === cat.id;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id as 'all' | ReviewCategory)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white text-zinc-950 shadow-md font-bold'
                      : 'text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {Icon && <Icon className="w-3 h-3" />}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Review Grid */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-stretch pt-6">
            {visibleReviews.map((review, index) => renderReviewCard(review, index))}
          </div>
        </div>
      </div>

      {/* Write a Review Modal */}
      {isModalOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              if (e.target === e.currentTarget) handleResetModal();
            }}
          >
            <div
              className="relative w-full max-w-lg bg-zinc-950 text-white border border-white/20 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] my-auto overflow-hidden animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between p-5 sm:p-6 pb-4 border-b border-white/10 flex-shrink-0 bg-zinc-950/95">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-[#498bf7] text-[10px] font-bold tracking-wider uppercase mb-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{copy.modalBadge}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white">{copy.modalTitle}</h3>
                  <p className="text-xs text-white/60 mt-0.5">{copy.modalSubtitle}</p>
                </div>

                <button
                  type="button"
                  onClick={handleResetModal}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer flex-shrink-0 ml-3"
                  aria-label={copy.closeBtn}
                  title={copy.closeBtn}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {submitted ? (
                <div className="overflow-y-auto p-6 sm:p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-white">{copy.successTitle}</h3>
                  <p className="text-xs sm:text-sm text-white/70 max-w-sm mx-auto leading-relaxed">
                    {copy.successDesc}
                  </p>

                  {customReview && (
                    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.05] border border-white/10 max-w-sm mx-auto text-left mt-3">
                      <div className="w-11 h-11 rounded-full overflow-hidden border border-white/20 bg-zinc-800 flex-shrink-0">
                        <img
                          src={customReview.avatar}
                          alt={customReview.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-bold text-white truncate">
                            {customReview.name}
                          </div>
                          <div className="flex items-center gap-0.5 text-amber-400">
                            {[...Array(customReview.rating)].map((_, i) => (
                              <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>
                        <div className="text-[11px] text-zinc-400 truncate">
                          {customReview.role}
                        </div>
                        <p className="text-[11px] text-zinc-300 italic truncate mt-0.5">
                          "{customReview.text}"
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleResetModal}
                      className="px-6 py-2.5 rounded-full bg-[#1b64f2] hover:bg-[#1654cc] text-white text-xs font-semibold transition-all shadow-md cursor-pointer"
                    >
                      {copy.closeBtn}
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="overflow-y-auto p-5 sm:p-6 space-y-4 overscroll-contain flex-1"
                >
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1.5">
                      {copy.yourRating}
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 rounded hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= rating ? 'text-amber-400 fill-amber-400' : 'text-white/20'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-amber-400 ml-2">{rating} / 5</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-white/80">
                        {copy.photoLabel}
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowUrlInput(!showUrlInput)}
                        className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <LinkIcon className="w-3 h-3" />
                        <span>{showUrlInput ? copy.photoUrlHide : copy.photoUrlToggle}</span>
                      </button>
                    </div>

                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) processFile(file);
                      }}
                      className={`p-3 rounded-2xl border transition-all ${
                        isDragging
                          ? 'bg-blue-500/10 border-blue-500'
                          : 'bg-white/[0.04] border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 bg-zinc-800 flex items-center justify-center flex-shrink-0 cursor-pointer shadow-inner group hover:border-blue-400 transition-all"
                          title={copy.photoUploadBtn}
                        >
                          {avatarPreview ? (
                            <img
                              src={avatarPreview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                              onError={() => {
                                setAvatarError(
                                  isFr ? 'Impossible de charger l’image.' : 'Could not load image.'
                                );
                                setAvatarPreview('');
                              }}
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-white/40 group-hover:text-blue-400 transition-colors">
                              <User className="w-6 h-6" />
                            </div>
                          )}

                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                            <Camera className="w-4 h-4" />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) processFile(file);
                            }}
                            className="hidden"
                          />

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors cursor-pointer shadow-sm active:scale-95"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>{avatarPreview ? copy.photoChangeBtn : copy.photoUploadBtn}</span>
                            </button>

                            {avatarPreview && (
                              <button
                                type="button"
                                onClick={handleRemoveAvatar}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-red-500/20 text-white/80 hover:text-red-400 border border-white/10 text-xs transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>{copy.photoRemoveBtn}</span>
                              </button>
                            )}
                          </div>

                          <p className="text-[11px] text-white/50 mt-1.5 leading-snug">
                            {copy.photoHint}
                          </p>

                          {avatarError && (
                            <p className="text-[11px] text-red-400 mt-1 font-medium">
                              {avatarError}
                            </p>
                          )}
                        </div>
                      </div>

                      {showUrlInput && (
                        <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
                          <input
                            type="url"
                            placeholder={copy.photoUrlPlaceholder}
                            value={avatarUrlInput}
                            onChange={(e) => {
                              const val = e.target.value;
                              setAvatarUrlInput(val);
                              if (
                                val.trim().startsWith('http://') ||
                                val.trim().startsWith('https://')
                              ) {
                                setAvatarPreview(val.trim());
                                setAvatarError('');
                              }
                            }}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#1b64f2]"
                          />
                          {avatarUrlInput && (
                            <button
                              type="button"
                              onClick={() => {
                                setAvatarUrlInput('');
                                setAvatarPreview('');
                              }}
                              className="text-xs text-zinc-400 hover:text-white px-2 py-1 cursor-pointer"
                            >
                              {isFr ? 'Effacer' : 'Clear'}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-white/80 mb-1">
                        {copy.nameLabel} *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={copy.namePlaceholder}
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#1b64f2]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/80 mb-1">
                        {copy.roleLabel}
                      </label>
                      <input
                        type="text"
                        placeholder={copy.rolePlaceholder}
                        value={authorRole}
                        onChange={(e) => setAuthorRole(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#1b64f2]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      {copy.headlineLabel}
                    </label>
                    <input
                      type="text"
                      placeholder={copy.headlinePlaceholder}
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#1b64f2]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      {copy.textLabel} *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder={copy.textPlaceholder}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#1b64f2] resize-none"
                    />
                  </div>

                  <div className="pt-3 pb-2 flex items-center gap-3 border-t border-white/10 mt-2">
                    <button
                      type="button"
                      onClick={handleResetModal}
                      className="w-1/3 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white/80 hover:text-white font-semibold text-xs transition-all flex items-center justify-center cursor-pointer"
                    >
                      {copy.closeBtn}
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 py-3 rounded-full bg-[#1b64f2] hover:bg-[#1654cc] text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{copy.btnSubmit}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>,
          document.body
        )}
    </section>
  );
};
