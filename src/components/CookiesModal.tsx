import React, { useState, useEffect } from 'react';
import { Cookie, X, Check, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CookiesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CookiesModal: React.FC<CookiesModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const isFr = language === 'FR';

  const [cookieSettings, setCookieSettings] = useState({
    necessary: true, // always true
    analytics: true,
    functional: true,
    advertising: false,
  });
  const [saved, setSaved] = useState(false);

  const t = {
    title: isFr ? 'Gestion des Cookies & Préférences' : 'Cookie Policy & Preferences',
    subtitle: isFr ? 'Gérez vos préférences de stockage de données' : 'Manage your data storage preferences',
    description: isFr
      ? 'Nous utilisons des cookies pour assurer le bon fonctionnement de notre comparateur, mémoriser votre devise/langue et analyser le trafic pour vous proposer les meilleurs prix de billets d’avion et d’hôtels.'
      : 'We use cookies and similar technologies to ensure our search engine functions smoothly, remember your preferences, and analyze traffic to bring you the best flight & hotel deals.',
    cat1Title: isFr ? 'Strictement Nécessaires' : 'Strictly Necessary',
    cat1Badge: isFr ? 'Toujours Actif' : 'Always Active',
    cat1Desc: isFr
      ? 'Indispensables au fonctionnement sécurisé du comparateur et à la redirection vers les compagnies partenaires.'
      : 'Essential for site security, navigation, and handoffs to airline partners.',
    cat2Title: isFr ? 'Analytique & Performance' : 'Analytics & Performance',
    cat2Desc: isFr
      ? 'Nous aident à mesurer les temps de réponse de recherche et à optimiser nos services.'
      : 'Helps us measure search speed, airport routes, and optimize service quality.',
    cat3Title: isFr ? 'Fonctionnels & Préférences' : 'Functional & Preferences',
    cat3Desc: isFr
      ? 'Mémorisent vos recherches récentes, devise, langue et critères de filtres.'
      : 'Remembers your recent flight queries, preferred currency, and display settings.',
    cat4Title: isFr ? 'Offres Ciblées & Partenaires' : 'Targeted Offers & Partners',
    cat4Desc: isFr
      ? 'Permettent à nos partenaires voyagistes vérifiés de vous proposer des promotions saisonnières.'
      : 'Allows verified travel partners to show relevant flight and hotel promotions.',
    saveBtn: isFr ? 'Enregistrer mes Choix' : 'Save Custom Settings',
    acceptAllBtn: isFr ? 'Tout Accepter' : 'Accept All Cookies',
    rejectBtn: isFr ? 'Refuser & Fermer' : 'Decline All & Close',
    savedTitle: isFr ? 'Préférences Enregistrées' : 'Preferences Saved',
    savedDesc: isFr
      ? 'Vos choix en matière de cookies ont été enregistrés avec succès.'
      : 'Your cookie choices have been recorded and applied.',
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem('safarihoo_cookie_consent');
      if (stored) {
        setCookieSettings(JSON.parse(stored));
      }
    } catch {
      // fallback
    }
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSavePreferences = () => {
    try {
      localStorage.setItem('safarihoo_cookie_consent', JSON.stringify(cookieSettings));
    } catch {
      // ignore
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  const handleRejectAll = () => {
    const minimal = {
      necessary: true,
      analytics: false,
      functional: false,
      advertising: false,
    };
    setCookieSettings(minimal);
    try {
      localStorage.setItem('safarihoo_cookie_consent', JSON.stringify(minimal));
    } catch {
      // ignore
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  const handleAcceptAll = () => {
    const allEnabled = {
      necessary: true,
      analytics: true,
      functional: true,
      advertising: true,
    };
    setCookieSettings(allEnabled);
    try {
      localStorage.setItem('safarihoo_cookie_consent', JSON.stringify(allEnabled));
    } catch {
      // ignore
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-modal-title"
    >
      <div 
        className="relative w-full max-w-lg max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-3rem)] bg-zinc-950 border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative flex items-start justify-between gap-3 p-4 sm:p-6 border-b border-white/10 flex-shrink-0 bg-zinc-950/80 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
              <Cookie className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 id="cookie-modal-title" className="text-base sm:text-lg font-extrabold text-white leading-tight truncate">
                {t.title}
              </h2>
              <p className="text-[11px] sm:text-xs text-white/50 truncate">
                {t.subtitle}
              </p>
            </div>
          </div>

          {/* Close Button - prominent, always accessible */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la fenêtre des cookies"
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer flex-shrink-0 border border-white/10"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain flex-1 space-y-4">
          {saved ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">{t.savedTitle}</h3>
              <p className="text-xs sm:text-sm text-white/70 max-w-sm mx-auto">
                {t.savedDesc}
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs text-white/70 leading-relaxed">
                {t.description}
              </p>

              {/* Cookie Categories */}
              <div className="space-y-2.5">
                {/* Category 1: Necessary */}
                <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-white">{t.cat1Title}</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-[9px] text-emerald-300 font-semibold uppercase">
                        {t.cat1Badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/50 mt-1 leading-normal">
                      {t.cat1Desc}
                    </p>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Category 2: Performance & Analytics */}
                <label className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/[0.07] transition-colors">
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-white block">{t.cat2Title}</span>
                    <p className="text-[11px] text-white/50 mt-1 leading-normal">
                      {t.cat2Desc}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={cookieSettings.analytics}
                    onChange={(e) => setCookieSettings({ ...cookieSettings, analytics: e.target.checked })}
                    className="w-5 h-5 rounded accent-[#1b64f2] cursor-pointer flex-shrink-0"
                  />
                </label>

                {/* Category 3: Functional */}
                <label className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/[0.07] transition-colors">
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-white block">{t.cat3Title}</span>
                    <p className="text-[11px] text-white/50 mt-1 leading-normal">
                      {t.cat3Desc}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={cookieSettings.functional}
                    onChange={(e) => setCookieSettings({ ...cookieSettings, functional: e.target.checked })}
                    className="w-5 h-5 rounded accent-[#1b64f2] cursor-pointer flex-shrink-0"
                  />
                </label>

                {/* Category 4: Advertising */}
                <label className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/[0.07] transition-colors">
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-white block">{t.cat4Title}</span>
                    <p className="text-[11px] text-white/50 mt-1 leading-normal">
                      {t.cat4Desc}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={cookieSettings.advertising}
                    onChange={(e) => setCookieSettings({ ...cookieSettings, advertising: e.target.checked })}
                    className="w-5 h-5 rounded accent-[#1b64f2] cursor-pointer flex-shrink-0"
                  />
                </label>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer / Actions */}
        {!saved && (
          <div className="p-3.5 sm:p-5 border-t border-white/10 bg-zinc-950/90 backdrop-blur-sm flex-shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 z-10">
            <button
              type="button"
              onClick={handleRejectAll}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl sm:rounded-full bg-white/5 hover:bg-white/10 active:bg-white/20 text-white/80 hover:text-white text-xs font-semibold transition-colors cursor-pointer text-center border border-white/10"
            >
              {t.rejectBtn}
            </button>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <button
                type="button"
                onClick={handleSavePreferences}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl sm:rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white text-xs font-semibold transition-colors cursor-pointer text-center"
              >
                {t.saveBtn}
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl sm:rounded-full bg-[#1b64f2] hover:bg-[#1654cc] active:bg-[#1349b3] text-white text-xs font-bold transition-all shadow-md cursor-pointer text-center"
              >
                {t.acceptAllBtn}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
