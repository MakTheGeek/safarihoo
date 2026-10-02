import React from 'react';
import { Globe, Compass, ShieldCheck, Zap, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { SafarihooLogo } from './SafarihooLogo';
import { useLanguage } from '../context/LanguageContext';

interface AboutPageProps {
  onStartJourney?: () => void;
  onNavigateFlights?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateFlights }) => {
  const { language } = useLanguage();
  const isFr = language === 'FR';

  const t = {
    title: isFr
      ? 'Une exploration intelligente au service des voyageurs du monde entier'
      : 'Empowering Global Travelers with Intelligent Exploration',
    subtitle: isFr
      ? "Safarihoo est un métamoteur de recherche de voyages nouvelle génération conçu pour connecter les passionnés d'aventure à des millions de vols, d'hôtels d'exception, de locations de voitures flexibles et d'indemnisations de vol simples à travers le globe."
      : 'Safarihoo is a next-generation travel meta-search engine built to connect wanderlust seekers with millions of flights, hand-picked hotels, flexible car rentals, and hassle-free flight compensation across the globe.',
    stat1: isFr ? 'Compagnies comparées' : 'Airlines Compared',
    stat2: isFr ? 'Hôtels & Complexes' : 'Hotels & Resorts',
    stat3: isFr ? 'Pays couverts' : 'Countries Covered',
    stat4: isFr ? 'Indemnité max AirHelp' : 'AirHelp Max Claim',
    missionTitle: isFr ? 'Notre Mission' : 'Our Mission',
    missionDesc: isFr
      ? "Éliminer les frictions de la planification de voyage moderne. Nous agrégeons les tarifs vérifiés des compagnies et voyagistes majeurs au sein d'une expérience ultra-rapide, transparente et intuitive — sans aucun frais de réservation caché."
      : 'To eliminate the friction of modern travel planning. We aggregate verified fares from premier travel suppliers and airlines into one ultra-fast, transparent, and user-friendly experience — with zero hidden booking fees.',
    missionCheck1: isFr ? 'Tarifs en temps réel avec prise en charge multidevise' : 'Real-time live pricing with multi-currency support',
    missionCheck2: isFr ? 'Redirection directe vers les voyagistes et compagnies officiels' : 'Direct routing to trusted official providers & airlines',
    missionCheck3: isFr ? 'Algorithme de comparaison indépendant et impartial' : 'Independent unbiased comparison algorithm',
    visionTitle: isFr ? 'Notre Vision Globale' : 'Our Global Vision',
    visionDesc: isFr
      ? "Nous bâtissons un univers où chaque voyageur accède instantanément à une planification équitable et transparente, appuyée par la défense des droits des passagers et des recommandations fiables."
      : 'We envision a world where every traveler has instant access to fair, transparent journey planning, backed by passenger rights protection and AI-assisted destination insights.',
    visionCheck1: isFr ? "Partenariat d'indemnisation de vol direct avec AirHelp" : 'Seamless flight compensation partnerships with AirHelp',
    visionCheck2: isFr ? 'Itinéraires multimodaux complets (Avion, Train, Route)' : 'Comprehensive multi-modal itineraries (Air, Rail, Road)',
    visionCheck3: isFr ? 'Sélections et guides de voyage inspirés par la communauté' : 'Community-driven destination curations & insights',
    valuesHeading: isFr ? 'Pourquoi les voyageurs choisissent Safarihoo' : 'Why Travelers Choose Safarihoo',
    val1Title: isFr ? 'Moteur de recherche ultra-rapide' : 'Ultra-Fast Search Engine',
    val1Desc: isFr
      ? 'Scannez des centaines de sources de réservation en quelques secondes grâce à nos connexions API en temps réel.'
      : 'Scan hundreds of booking sources in seconds with our optimized caching and real-time API integrations.',
    val2Title: isFr ? '100% de transparence tarifaire' : '100% Price Transparency',
    val2Desc: isFr
      ? 'Aucun frais caché ni surcoût. Le tarif affiché sur Safarihoo est le prix authentique du partenaire vérifié.'
      : 'No hidden fees, no markup. The fare you see on Safarihoo is the authentic price charged by the partner provider.',
    val3Title: isFr ? 'Assistance de bout en bout' : 'End-to-End Assistance',
    val3Desc: isFr
      ? "De la recherche des meilleures offres à l'indemnisation en cas de perturbation de vol, nous vous accompagnons partout."
      : 'From discovering deals to flight delay compensation and 24/7 travel support, we are with you at every step.',
    ctaTitle: isFr ? 'Prêt à vivre votre prochaine aventure ?' : 'Ready to Start Your Next Adventure?',
    ctaSubtitle: isFr
      ? "Comparez les vols pas chers, dénichez des hôtels de luxe ou louez une voiture au meilleur tarif garanti dès maintenant."
      : 'Compare cheap flights, find luxury hotel bargains, or book rental cars with the best price guarantee today.',
    ctaButton: isFr ? 'Rechercher des vols & hôtels' : 'Search Flights & Hotels',
  };

  return (
    <div id="about-page-view" className="w-full flex-grow py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Hero Intro */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center justify-center mb-6">
          <SafarihooLogo className="h-10 sm:h-12 w-auto" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
          {t.title}
        </h1>
        <p className="text-base sm:text-lg text-white/70 mt-4 leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16">
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 text-center backdrop-blur-md">
          <div className="text-3xl sm:text-4xl font-extrabold text-white">500+</div>
          <div className="text-xs sm:text-sm text-white/60 mt-1 font-medium">{t.stat1}</div>
        </div>
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 text-center backdrop-blur-md">
          <div className="text-3xl sm:text-4xl font-extrabold text-white">2M+</div>
          <div className="text-xs sm:text-sm text-white/60 mt-1 font-medium">{t.stat2}</div>
        </div>
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 text-center backdrop-blur-md">
          <div className="text-3xl sm:text-4xl font-extrabold text-white">190+</div>
          <div className="text-xs sm:text-sm text-white/60 mt-1 font-medium">{t.stat3}</div>
        </div>
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 text-center backdrop-blur-md">
          <div className="text-3xl sm:text-4xl font-extrabold text-[#498bf7]">€600</div>
          <div className="text-xs sm:text-sm text-white/60 mt-1 font-medium">{t.stat4}</div>
        </div>
      </div>

      {/* Mission & Vision Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="bg-zinc-950/80 border border-white/15 rounded-3xl p-8 shadow-xl relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-[#498bf7] flex items-center justify-center mb-6">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">{t.missionTitle}</h2>
          <p className="text-sm sm:text-base text-white/70 leading-relaxed mb-4">
            {t.missionDesc}
          </p>
          <ul className="space-y-2.5 text-xs sm:text-sm text-white/80">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{t.missionCheck1}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{t.missionCheck2}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{t.missionCheck3}</span>
            </li>
          </ul>
        </div>

        <div className="bg-zinc-950/80 border border-white/15 rounded-3xl p-8 shadow-xl relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-6">
            <Globe className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">{t.visionTitle}</h2>
          <p className="text-sm sm:text-base text-white/70 leading-relaxed mb-4">
            {t.visionDesc}
          </p>
          <ul className="space-y-2.5 text-xs sm:text-sm text-white/80">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span>{t.visionCheck1}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span>{t.visionCheck2}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span>{t.visionCheck3}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="mb-16">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-8">
          {t.valuesHeading}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.06] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{t.val1Title}</h3>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              {t.val1Desc}
            </p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.06] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{t.val2Title}</h3>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              {t.val2Desc}
            </p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.06] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{t.val3Title}</h3>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              {t.val3Desc}
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-gradient-to-r from-blue-900/40 via-purple-900/30 to-blue-900/40 border border-white/20 rounded-3xl p-8 sm:p-12 text-center shadow-2xl">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
          {t.ctaTitle}
        </h2>
        <p className="text-sm sm:text-base text-white/70 max-w-xl mx-auto mb-6">
          {t.ctaSubtitle}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={onNavigateFlights}
            className="px-8 py-3.5 rounded-full bg-[#1b64f2] hover:bg-[#1654cc] text-white font-semibold text-sm transition-all shadow-lg active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <span>{t.ctaButton}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
