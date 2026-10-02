import React, { useState, useRef, useEffect } from 'react';
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
  Heart,
  Plane,
  Hotel,
  Car,
  ShieldCheck,
  Camera,
  Upload,
  Trash2,
  User,
  Link as LinkIcon
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ReviewsSection: React.FC = () => {
  const { language } = useLanguage();
  const isFr = language === 'FR';

  const [activeCategory, setActiveCategory] = useState<'all' | 'flights' | 'hotels' | 'cars' | 'airhelp'>('all');
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
      if (saved) return JSON.parse(saved);
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

  const t = {
    title: isFr ? 'Ce Que Disent Nos Voyageurs' : 'What Our Travelers Say',
    subtitle: isFr
      ? 'Découvrez les retours d’expérience de plus de 10 millions de globe-trotters, familles et professionnels qui économisent sur leurs séjours et leurs vols avec Safarihoo.'
      : 'Explore genuine experiences from over 10 million adventurers, families, and frequent flyers saving on airfares, hotels, and journeys worldwide.',
    ratingPill: isFr
      ? 'Note globale 4.9/5 • Plus de 120 000 avis vérifiés'
      : '4.9/5 Average Rating • Over 120,000 Verified Reviews',
    filterAll: isFr ? 'Tous les avis' : 'All Reviews',
    filterFlights: isFr ? 'Vols & Billets' : 'Flights',
    filterHotels: isFr ? 'Hôtels & Résidences' : 'Hotels',
    filterCars: isFr ? 'Location de Voiture' : 'Car Rentals',
    filterAirhelp: isFr ? 'AirHelp & Droits' : 'AirHelp Claims',
    btnWriteReview: isFr ? 'Donner mon avis' : 'Write a Review',
    verifiedTraveler: isFr ? 'Voyageur vérifié' : 'Verified Traveler',
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
    photoHint: isFr ? 'PNG, JPG ou WEBP (max 5 Mo) ou glissez-déposez ici' : 'PNG, JPG or WEBP (max 5MB) or drag & drop here',
    photoUrlToggle: isFr ? 'ou utiliser une URL d’image web' : 'or use web image URL',
    photoUrlHide: isFr ? 'Revenir à l’import de fichier' : 'Back to file upload',
    photoUrlPlaceholder: isFr ? 'https://exemple.com/ma-photo.jpg' : 'https://example.com/my-photo.jpg',
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
      setAvatarError(isFr ? 'Veuillez choisir un fichier image (JPG, PNG, WEBP).' : 'Please choose an image file (JPG, PNG, WEBP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError(isFr ? 'L’image dépasse 5 Mo. Veuillez choisir un fichier plus léger.' : 'Image exceeds 5MB limit. Please choose a smaller file.');
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

    const finalAvatar = avatarPreview.trim() || avatarUrlInput.trim() || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';

    const newReview = {
      name: authorName.trim(),
      role: authorRole.trim() || (isFr ? 'Voyageur Safarihoo' : 'Safarihoo Traveler'),
      headline: headline.trim() || (rating === 5 ? (isFr ? 'Expérience exceptionnelle !' : 'Exceptional experience!') : (isFr ? 'Très bon service' : 'Great service')),
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

  const card1Data = customReview
    ? {
        name: customReview.name,
        role: customReview.role,
        headline: customReview.headline,
        text: customReview.text,
        avatar: customReview.avatar,
        isCustom: true,
      }
    : {
        name: 'James Brown',
        role: 'CEO Swing Company • @thejamescup',
        headline: '',
        text: isFr
          ? 'Safarihoo nous a fait économiser plus de 420 $ sur nos billets multi-destinations vers Tokyo et Kyoto. Le comparateur est ultra-rapide, limpide et sans frais cachés.'
          : 'Safarihoo saved us over $420 on our multi-city flights to Tokyo and Kyoto. The comparison engine is blazing fast, transparent, and completely free of hidden fees.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        isCustom: false,
      };

  return (
    <section id="reviews-section" className="w-full py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      <div className="w-full">
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight uppercase">
            {t.title}
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 mt-3 leading-relaxed max-w-2xl mx-auto font-normal">
            {t.subtitle}
          </p>

          {/* Rating badge & Trust indicator */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 backdrop-blur-md border border-white/10 shadow-sm text-xs font-semibold text-zinc-200">
              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span>{t.ratingPill}</span>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-md cursor-pointer hover:shadow-lg active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.btnWriteReview}</span>
            </button>
          </div>

          {/* Categories Tab Bar */}
          <div className="flex items-center justify-center flex-wrap gap-2 mt-6">
            {[
              { id: 'all', label: t.filterAll },
              { id: 'flights', label: t.filterFlights, icon: Plane },
              { id: 'hotels', label: t.filterHotels, icon: Hotel },
              { id: 'cars', label: t.filterCars, icon: Car },
              { id: 'airhelp', label: t.filterAirhelp, icon: ShieldCheck },
            ].map((cat) => {
              const isActive = activeCategory === cat.id;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id as any)}
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

        {/* Centered, Tightly Grouped 6-Review Grid */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-stretch pt-6">
            
            {/* CARD 1: Floating Quote Mark + James Brown (or replaced user review) */}
            <div className="relative bg-white rounded-3xl p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-zinc-100 hover:shadow-[0_18px_35px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col justify-between">
              {/* Floating Large Quote Mark at Top-Left */}
              <div className="absolute -top-3.5 left-6 w-8 h-8 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-md">
                <Quote className="w-3.5 h-3.5 fill-white" />
              </div>

              <div className="pt-2">
                {card1Data.isCustom && (
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[10px] font-bold text-blue-600">
                      <Sparkles className="w-3 h-3 text-blue-600" />
                      <span>{isFr ? 'Avis récent' : 'Latest review'}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(customReview?.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                )}

                {card1Data.headline && (
                  <h3 className="text-sm font-extrabold text-zinc-900 mb-1.5">
                    {card1Data.headline}
                  </h3>
                )}

                <p className="text-xs sm:text-[13px] text-zinc-600 leading-relaxed mb-4">
                  {card1Data.text}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-100 mt-auto">
                <div className="min-w-0 pr-2">
                  <div className="text-xs sm:text-sm font-bold text-zinc-900 truncate">{card1Data.name}</div>
                  <div className="text-[11px] text-zinc-400 truncate">{card1Data.role}</div>
                </div>
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                  <img
                    src={card1Data.avatar}
                    alt={card1Data.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* CARD 2: Hindley Earnshaw (Top Avatar Cutout + 5 Stars + Quote) */}
            <div className="relative bg-white rounded-3xl p-5 pt-9 sm:p-6 sm:pt-10 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-zinc-100 hover:shadow-[0_18px_35px_rgba(0,0,0,0.1)] transition-all duration-300 text-center flex flex-col justify-between">
              {/* Circular Avatar protruding on top border */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-md bg-zinc-200">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                  alt="Hindley Earnshaw"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div>
                {/* 5 Stars */}
                <div className="flex items-center justify-center gap-0.5 text-amber-400 mb-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <h3 className="text-sm sm:text-base font-extrabold text-zinc-900 mb-1.5">
                  {isFr ? 'J’apprécie énormément !!' : 'I really appreciate!!'}
                </h3>

                <p className="text-xs sm:text-[13px] text-zinc-600 leading-relaxed mb-4">
                  {isFr
                    ? 'Trouver des vacances en famille à la dernière minute était un casse-tête. Les filtres intelligents de Safarihoo ont rendu la réservation d’une villa et de 4 vols un vrai jeu d’enfant.'
                    : 'Finding last-minute family holiday packages used to be a headache. Safarihoo’s smart filters made booking 4 flights and a beachfront villa a breeze.'}
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-100 relative mt-auto">
                <div className="text-xs font-bold text-zinc-900">Hindley Earnshaw</div>
                <div className="text-[10px] text-zinc-400">@Hindley.Ex</div>
                {/* Bottom Right Quote Mark */}
                <div className="absolute -bottom-1 right-1 w-6 h-6 rounded-md bg-zinc-900 text-white flex items-center justify-center shadow-sm">
                  <Quote className="w-2.5 h-2.5 fill-white rotate-180" />
                </div>
              </div>
            </div>

            {/* CARD 3: Sarah Jenkins ("Good Job!" + 5 Stars + Top Avatar) */}
            <div className="relative bg-white rounded-3xl p-5 pt-9 sm:p-6 sm:pt-10 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-zinc-100 text-center hover:shadow-[0_18px_35px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col justify-between">
              {/* Overlapping circular avatar on top border */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-md bg-zinc-200">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"
                  alt="Sarah Jenkins"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-zinc-900 mb-1">
                  {isFr ? 'Excellent travail !' : 'Good Job!'}
                </h3>

                {/* 5 Stars */}
                <div className="flex items-center justify-center gap-0.5 text-amber-400 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs sm:text-[13px] text-zinc-600 leading-relaxed mb-4">
                  {isFr
                    ? 'L’indicateur de prix prédisait une baisse vers Rome en milieu de semaine. J’ai attendu 48h et économisé 180 € sur des billets classe affaires !'
                    : 'The price forecast indicated fares to Rome would drop mid-week. Waited 48 hours and saved €180 on business class tickets!'}
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-100 mt-auto">
                <div className="text-xs font-bold text-zinc-900">Sarah Jenkins</div>
                <div className="text-[10px] text-zinc-400">{isFr ? 'Voyageur régulier • @sarahj' : 'Frequent Traveler • @sarahj'}</div>
              </div>
            </div>

            {/* CARD 4: Victoria Watton (Hotel Price Tracker) */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-zinc-100 hover:shadow-[0_18px_35px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col justify-between">
              <div>
                <Quote className="w-4 h-4 text-zinc-400 mb-2" />
                <p className="text-xs sm:text-[13px] text-zinc-600 leading-relaxed mb-5">
                  {isFr
                    ? 'Le suivi des prix d’hôtels m’a alertée dès qu’une suite à Santorin a baissé de 35%. Réservation confirmée en moins de deux minutes avec petit-déjeuner inclus !'
                    : 'The hotel price tracker alerted me when luxury suites in Santorini dropped by 35%. Completed our reservation securely in under two minutes with breakfast included!'}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-zinc-100 mt-auto">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-zinc-100 shadow-sm flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
                    alt="Victoria Watton"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-zinc-900 truncate">Victoria Watton</div>
                  <div className="text-[11px] text-zinc-400 truncate">Fermentum Odio Co.</div>
                </div>
              </div>
            </div>

            {/* CARD 5: Isabelle Leite (Car Rental + Cursive Script Signature) */}
            <div className="relative mt-3 sm:mt-0 bg-white rounded-3xl p-5 pt-8 sm:p-6 sm:pt-9 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-zinc-100 text-center hover:shadow-[0_18px_35px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col justify-between">
              {/* Circular Avatar at top */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full border-2 border-white overflow-hidden shadow-md bg-zinc-200">
                <img
                  src="https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=300&q=80"
                  alt="Isabelle Leite"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div>
                {/* 5 Stars */}
                <div className="flex items-center justify-center gap-0.5 text-amber-400 mb-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs sm:text-[13px] text-zinc-600 leading-relaxed mb-3">
                  {isFr
                    ? 'Location de véhicule fluide à l’aéroport de Lisbonne sans aucune surprise sur la caution. Interface claire, rapide et très intuitive !'
                    : 'Seamless car rental checkout at Lisbon airport with zero deposit surprises. Clean, trustworthy, and incredibly intuitive UI!'}
                </p>
              </div>

              {/* Handwritten Cursive Script Signature */}
              <div className="pt-2 border-t border-zinc-100 mt-auto">
                <div 
                  className="text-base sm:text-lg text-zinc-800 italic font-serif tracking-wide"
                  style={{ fontFamily: "'Brush Script MT', 'Caveat', cursive, Georgia, serif" }}
                >
                  Isabelle Leite
                </div>
                <div className="text-[10px] text-zinc-400">Lisbon • Portugal</div>
              </div>
            </div>

            {/* CARD 6: William Brewster (AirHelp Compensation + Overlapping Avatars) */}
            <div className="relative bg-white rounded-3xl p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-zinc-100 text-center hover:shadow-[0_18px_35px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-zinc-900 mb-1.5">
                  {isFr ? 'J’ai été très impressionné !' : 'I was very impressed!'}
                </h3>
                <p className="text-xs sm:text-[13px] text-zinc-600 leading-relaxed mb-3">
                  {isFr
                    ? 'Lors de l’annulation de notre vol international, le service AirHelp intégré de Safarihoo a récupéré 600 € d’indemnité par passager sans stress. Remarquable !'
                    : 'When our transatlantic flight got cancelled, Safarihoo\'s integrated AirHelp service secured €600 compensation per passenger with zero stress. Outstanding experience!'}
                </p>
                <div className="text-[11px] font-semibold text-zinc-500">William Brewster</div>
              </div>

              {/* Overlapping Triple Avatars below */}
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
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
                    alt="Traveler 2"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
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

          </div>
        </div>

      </div>

      {/* Write a Review Modal rendered via createPortal so it is above all page stacking contexts */}
      {isModalOpen && typeof document !== 'undefined' && createPortal(
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
            {/* Pinned Header Bar with Title and Close Button */}
            <div className="flex items-start justify-between p-5 sm:p-6 pb-4 border-b border-white/10 flex-shrink-0 bg-zinc-950/95">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-[#498bf7] text-[10px] font-bold tracking-wider uppercase mb-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{t.modalBadge}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white">{t.modalTitle}</h3>
                <p className="text-xs text-white/60 mt-0.5">{t.modalSubtitle}</p>
              </div>

              {/* Close Button - Always visible and pinned */}
              <button
                type="button"
                onClick={handleResetModal}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer flex-shrink-0 ml-3"
                aria-label={t.closeBtn}
                title={t.closeBtn}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              <div className="overflow-y-auto p-6 sm:p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-white">{t.successTitle}</h3>
                <p className="text-xs sm:text-sm text-white/70 max-w-sm mx-auto leading-relaxed">
                  {t.successDesc}
                </p>

                {/* Preview of the submitted review card */}
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
                        <div className="text-xs font-bold text-white truncate">{customReview.name}</div>
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {[...Array(customReview.rating)].map((_, i) => (
                            <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                      <div className="text-[11px] text-zinc-400 truncate">{customReview.role}</div>
                      <p className="text-[11px] text-zinc-300 italic truncate mt-0.5">"{customReview.text}"</p>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleResetModal}
                    className="px-6 py-2.5 rounded-full bg-[#1b64f2] hover:bg-[#1654cc] text-white text-xs font-semibold transition-all shadow-md cursor-pointer"
                  >
                    {t.closeBtn}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-4 overscroll-contain flex-1">

                {/* Rating selection */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">{t.yourRating}</label>
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
                            star <= rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-white/20'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-amber-400 ml-2">
                      {rating} / 5
                    </span>
                  </div>
                </div>

                {/* Profile Photo Upload */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-white/80">
                      {t.photoLabel}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <LinkIcon className="w-3 h-3" />
                      <span>{showUrlInput ? t.photoUrlHide : t.photoUrlToggle}</span>
                    </button>
                  </div>

                  <div 
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
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
                      {/* Avatar circular preview */}
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 bg-zinc-800 flex items-center justify-center flex-shrink-0 cursor-pointer shadow-inner group hover:border-blue-400 transition-all"
                        title={t.photoUploadBtn}
                      >
                        {avatarPreview ? (
                          <img
                            src={avatarPreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={() => {
                              setAvatarError(isFr ? 'Impossible de charger l’image.' : 'Could not load image.');
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

                      {/* Action buttons & hint */}
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
                            <span>{avatarPreview ? t.photoChangeBtn : t.photoUploadBtn}</span>
                          </button>

                          {avatarPreview && (
                            <button
                              type="button"
                              onClick={handleRemoveAvatar}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-red-500/20 text-white/80 hover:text-red-400 border border-white/10 text-xs transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>{t.photoRemoveBtn}</span>
                            </button>
                          )}
                        </div>

                        <p className="text-[11px] text-white/50 mt-1.5 leading-snug">
                          {t.photoHint}
                        </p>

                        {avatarError && (
                          <p className="text-[11px] text-red-400 mt-1 font-medium">
                            {avatarError}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* URL input option if toggled */}
                    {showUrlInput && (
                      <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
                        <input
                          type="url"
                          placeholder={t.photoUrlPlaceholder}
                          value={avatarUrlInput}
                          onChange={(e) => {
                            const val = e.target.value;
                            setAvatarUrlInput(val);
                            if (val.trim().startsWith('http://') || val.trim().startsWith('https://')) {
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
                    <label className="block text-xs font-semibold text-white/80 mb-1">{t.nameLabel} *</label>
                    <input
                      type="text"
                      required
                      placeholder={t.namePlaceholder}
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#1b64f2]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">{t.roleLabel}</label>
                    <input
                      type="text"
                      placeholder={t.rolePlaceholder}
                      value={authorRole}
                      onChange={(e) => setAuthorRole(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#1b64f2]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">{t.headlineLabel}</label>
                  <input
                    type="text"
                    placeholder={t.headlinePlaceholder}
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#1b64f2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">{t.textLabel} *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder={t.textPlaceholder}
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
                    {t.closeBtn}
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-3 rounded-full bg-[#1b64f2] hover:bg-[#1654cc] text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{t.btnSubmit}</span>
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
