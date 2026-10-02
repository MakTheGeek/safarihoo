import React, { useState, useEffect } from 'react';
import { X, Mail, Send, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewsletterModal: React.FC<NewsletterModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [preferences, setPreferences] = useState({
    flightDeals: true,
    hotelPromos: true,
    airhelpTips: false,
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const isFr = language === 'FR';

  const t = {
    title: isFr ? 'Offres Exclusives & Alertes Prix' : 'Secret Flight Deals & Price Drops',
    subtitle: isFr
      ? 'Recevez nos billets d’avion à prix cassés, réductions d’hôtels et bons plans avant tout le monde.'
      : 'Get VIP flight discounts, secret hotel coupons, and mistake fares sent directly to your inbox.',
    nameLabel: isFr ? 'Prénom (optionnel)' : 'First Name (optional)',
    namePlaceholder: isFr ? 'Ex: Sophie' : 'e.g. Alex',
    emailLabel: isFr ? 'Adresse e-mail' : 'Email Address',
    emailPlaceholder: isFr ? 'vous@exemple.com' : 'you@example.com',
    prefHeader: isFr ? 'Je souhaite recevoir en priorité :' : 'I want deals for:',
    prefFlights: isFr ? 'Vols & Billets' : 'Cheap Flights',
    prefHotels: isFr ? 'Hôtels & Séjours' : 'Hotel Discounts',
    prefAirhelp: isFr ? 'Droits des passagers' : 'AirHelp Tips',
    noSpam: isFr
      ? 'Zéro spam. Désabonnement en 1 clic à tout moment. Consultez notre Politique de Confidentialité.'
      : 'No spam ever. 1-click unsubscribe at any time. Read our Privacy Policy.',
    submitBtn: isFr ? 'S’abonner aux Bons Plans' : 'Subscribe to Deals',
    successTitle: isFr ? 'Vous êtes sur la liste VIP !' : 'You’re on the VIP List!',
    successDesc: (mail: string) =>
      isFr
        ? `Votre adresse ${mail} a bien été enregistrée. Vous recevrez désormais nos ventes flash de billets d'avion, codes promo secrets d'hôtels et guides de voyage exclusifs.`
        : `We’ve registered ${mail}. You’ll now receive handpicked flight flash sales, secret hotel promo codes, and exclusive travel guides.`,
    closeBtn: isFr ? 'Fermer & Explorer les Offres' : 'Close & Explore Deals',
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      // Save locally
      const existing = JSON.parse(localStorage.getItem('safarihoo_subscribers') || '[]');
      existing.push({ email, name, preferences, date: new Date().toISOString() });
      localStorage.setItem('safarihoo_subscribers', JSON.stringify(existing));
    } catch {
      // fallback
    }
    setSubmitted(true);
  };

  const handleReset = () => {
    setEmail('');
    setName('');
    setSubmitted(false);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative w-full max-w-lg max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-3rem)] bg-zinc-950 border border-white/20 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl overflow-y-auto overscroll-contain text-white my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow background accent */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#1b64f2]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
          title="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">{t.successTitle}</h3>
            <p className="text-xs sm:text-sm text-white/70 max-w-sm mx-auto leading-relaxed">
              {t.successDesc(email)}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#1b64f2] hover:bg-[#1654cc] text-white text-xs font-semibold transition-all shadow-md cursor-pointer"
              >
                {t.closeBtn}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center mb-5 pr-8 pl-8 sm:pr-0 sm:pl-0">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-[#1b64f2]/20 text-[#498bf7] mb-2.5">
                <Mail className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                {t.title}
              </h2>
              <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-xs mx-auto">
                {t.subtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  {t.nameLabel}
                </label>
                <input
                  type="text"
                  placeholder={t.namePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#1b64f2] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  {t.emailLabel} <span className="text-[#498bf7]">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder={t.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#1b64f2] transition-all"
                />
              </div>

              {/* Preferences Checkboxes */}
              <div className="pt-1 pb-1">
                <span className="block text-[11px] font-semibold text-white/70 mb-1.5 uppercase tracking-wider">
                  {t.prefHeader}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.04] border border-white/10 cursor-pointer hover:bg-white/[0.08]">
                    <input
                      type="checkbox"
                      checked={preferences.flightDeals}
                      onChange={(e) => setPreferences({ ...preferences, flightDeals: e.target.checked })}
                      className="rounded accent-[#1b64f2]"
                    />
                    <span className="text-white/80 text-[11px]">{t.prefFlights}</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.04] border border-white/10 cursor-pointer hover:bg-white/[0.08]">
                    <input
                      type="checkbox"
                      checked={preferences.hotelPromos}
                      onChange={(e) => setPreferences({ ...preferences, hotelPromos: e.target.checked })}
                      className="rounded accent-[#1b64f2]"
                    />
                    <span className="text-white/80 text-[11px]">{t.prefHotels}</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.04] border border-white/10 cursor-pointer hover:bg-white/[0.08]">
                    <input
                      type="checkbox"
                      checked={preferences.airhelpTips}
                      onChange={(e) => setPreferences({ ...preferences, airhelpTips: e.target.checked })}
                      className="rounded accent-[#1b64f2]"
                    />
                    <span className="text-white/80 text-[11px]">{t.prefAirhelp}</span>
                  </label>
                </div>
              </div>

              <div className="text-[10px] text-white/50 leading-relaxed text-center">
                {t.noSpam}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="sm:hidden w-full py-2.5 rounded-xl bg-white/10 text-white/80 text-xs font-semibold"
                >
                  Fermer
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl sm:rounded-full bg-[#1b64f2] hover:bg-[#1654cc] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.99]"
                >
                  <span>{t.submitBtn}</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
