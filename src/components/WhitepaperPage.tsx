import React from 'react';
import { FileText, Cpu, Network, Lock, BarChart3, Download } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const WhitepaperPage: React.FC = () => {
  const { language } = useLanguage();
  const isFr = language === 'FR';

  const t = {
    badge: isFr ? 'Livre Blanc Technique Safarihoo • Version 2.4' : 'Safarihoo Technical Whitepaper • Version 2.4',
    title: isFr
      ? 'Méta-Recherche Nouvelle Génération & Agrégation Algorithmique de Voyage'
      : 'Next-Generation Meta-Search & Algorithmic Travel Aggregation',
    subtitle: isFr
      ? 'Analyse architecturale du moteur d’indexation distribué des tarifs de Safarihoo, synchronisation du cache GDS en temps réel et automatisation des droits des passagers.'
      : "An architectural breakdown of Safarihoo's distributed fare indexing engine, real-time GDS cache synchronization, and passenger rights automation.",
    sec1Title: isFr ? '1. Résumé Exécutif' : '1. Executive Summary',
    sec1P1: isFr
      ? 'L’industrie contemporaine du voyage demeure fragmentée entre des centaines de systèmes de distribution mondiaux historiques (GDS : Amadeus, Sabre, Travelport), d’API NDC de transporteurs low-cost, d’agrégateurs hôteliers régionaux et de loueurs de véhicules.'
      : 'The contemporary travel industry remains fragmented across hundreds of legacy Global Distribution Systems (Amadeus, Sabre, Travelport), low-cost carrier NDC (New Distribution Capability) APIs, regional hotel aggregators, and car fleet operators.',
    sec1P2: isFr
      ? 'Safarihoo introduit un pipeline d’agrégation multiniveau unifié qui parallélise les requêtes sur plus de 500 compagnies aériennes, plus de 2 000 000 d’hébergements et les principales flottes de location avec un temps de réponse client inférieur à 500 ms, un regroupement intelligent des tarifs et un routage intégré des demandes d’indemnisation passagers.'
      : 'Safarihoo introduces a unified multi-tiered aggregation pipeline that parallelizes queries across 500+ airlines, 2,000,000+ accommodation listings, and major car rental fleets with sub-500ms client delivery, intelligent fare clustering, and built-in passenger rights indemnity claim routing.',
    arch1Title: isFr ? 'Mise en Cache Périphérique' : 'Distributed Edge Caching',
    arch1Desc: isFr
      ? 'Nœuds périphériques multirégionaux conservant les requêtes d’itinéraires et disponibilités avec invalidation instantanée par websockets.'
      : 'Multi-region edge nodes store hot flight route queries and seat availability states with live invalidation websockets.',
    arch2Title: isFr ? 'Courbes Tarifaires Prédictives' : 'Predictive Price Curves',
    arch2Desc: isFr
      ? 'Modèles statistiques de régression analysant les horizons de réservation saisonniers, les taux de remplissage et les fluctuations.'
      : 'Statistical regression models analyzing seasonal booking horizons, load factors, and fare price fluctuations.',
    arch3Title: isFr ? 'Intermédiation Zéro Donnée' : 'Zero-Data Intermediation',
    arch3Desc: isFr
      ? 'Transferts tokenisés de bout en bout vers les plateformes de réservation officielles sans stockage de carte bancaire sur nos relais.'
      : 'Direct end-to-end tokenized handoffs to verified booking engines with no credit card storage on intermediary hops.',
    sec2Title: isFr ? 'Moteur d’Itinéraires Multimodaux' : 'Multi-Modal Routing Engine',
    sec2Desc: isFr
      ? 'L’algorithme matriciel de Safarihoo résout la connectivité des graphes sur des modes de transport combinés (Vol + Train + Transferts) pour créer des itinéraires hybrides jusqu’à 35% moins chers que les allers-retours classiques.'
      : 'Safarihoo’s routing matrix algorithm solves graph connectivity across mixed transit modes (Flight + Rail + Airport Transfers) to unlock hybrid itineraries up to 35% cheaper than traditional single-carrier roundtrips.',
    sec2Pipeline: isFr
      ? 'SaisieRequête → GéoRésolution → RécupérationParallèle [Vols, Hôtels, Voitures] → DéduplicationTarifs → NormalisationTaxes → FluxUIInstantané'
      : 'QueryInput → GeoResolver → AsyncParallelFetch [Airlines, Hotels, Cars] → FareDeduplicator → TaxNormalizer → InstantUIStream',
    sec3Title: isFr ? 'Droits des Passagers & Intégration AirHelp' : 'Passenger Rights & AirHelp Integration',
    sec3Desc: isFr
      ? 'Grâce à l’analyse des règles réglementaires CE 261/2004, UK 261 et de la Convention de Montréal, la plateforme confronte la télémétrie des vols aux données radars en temps réel d’Eurocontrol et de la FAA, permettant aux passagers d’obtenir jusqu’à 600 € d’indemnisation automatique.'
      : 'By parsing European Union EC 261/2004, UK 261, and Montreal Convention regulatory rules, the platform actively checks flight disruption telemetry against real-time Eurocontrol / FAA radar databases, enabling passengers to claim up to €600 compensation automatically upon cancellations or delays.',
    downloadTitle: isFr ? 'Télécharger le Document d’Architecture Complet (PDF)' : 'Download the Full PDF Architecture Document',
    downloadDesc: isFr
      ? 'Accédez au dossier technique complet de 28 pages détaillant les benchmarks système, les schémas d’API et les protocoles de chiffrement.'
      : 'Access the complete 28-page technical specification including system benchmarks, API schemas, and data encryption protocols.',
    downloadBtn: isFr ? 'Enregistrer / Imprimer le Livre Blanc' : 'Save / Print Whitepaper',
  };

  return (
    <div id="whitepaper-page-view" className="w-full flex-grow py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header Badge */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-[#498bf7] text-xs font-semibold tracking-wider uppercase mb-4">
          <FileText className="w-3.5 h-3.5" />
          <span>{t.badge}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
          {t.title}
        </h1>
        <p className="text-sm sm:text-base text-white/70 mt-4 leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* Executive Summary */}
      <div className="bg-zinc-950/90 border border-white/15 rounded-3xl p-8 md:p-10 mb-12 shadow-2xl backdrop-blur-md">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <Cpu className="w-6 h-6 text-[#498bf7]" />
          <span>{t.sec1Title}</span>
        </h2>
        <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-4">
          {t.sec1P1}
        </p>
        <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
          {t.sec1P2}
        </p>
      </div>

      {/* Architecture Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-[#498bf7] flex items-center justify-center mb-4">
            <Network className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">{t.arch1Title}</h3>
          <p className="text-xs text-white/60 leading-relaxed">
            {t.arch1Desc}
          </p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">{t.arch2Title}</h3>
          <p className="text-xs text-white/60 leading-relaxed">
            {t.arch2Desc}
          </p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">{t.arch3Title}</h3>
          <p className="text-xs text-white/60 leading-relaxed">
            {t.arch3Desc}
          </p>
        </div>
      </div>

      {/* Core Architectural Pillars */}
      <div className="space-y-8 mb-14">
        <div className="bg-zinc-950/80 border border-white/10 rounded-3xl p-8">
          <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-[#1b64f2] text-white text-xs flex items-center justify-center font-bold">2</span>
            <span>{t.sec2Title}</span>
          </h2>
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-3">
            {t.sec2Desc}
          </p>
          <div className="p-4 rounded-xl bg-black/50 border border-white/5 font-mono text-xs text-white/80 space-y-1">
            <p className="text-[#498bf7]">// {isFr ? 'Aperçu du pipeline algorithmique' : 'Algorithmic pipeline overview'}</p>
            <p>{t.sec2Pipeline}</p>
          </div>
        </div>

        <div className="bg-zinc-950/80 border border-white/10 rounded-3xl p-8">
          <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-[#1b64f2] text-white text-xs flex items-center justify-center font-bold">3</span>
            <span>{t.sec3Title}</span>
          </h2>
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
            {t.sec3Desc}
          </p>
        </div>
      </div>

      {/* Whitepaper Download Box */}
      <div className="bg-gradient-to-r from-blue-900/30 via-zinc-900 to-purple-900/30 border border-white/15 rounded-3xl p-8 text-center shadow-xl">
        <h3 className="text-xl font-bold text-white mb-2">{t.downloadTitle}</h3>
        <p className="text-xs sm:text-sm text-white/60 max-w-lg mx-auto mb-6">
          {t.downloadDesc}
        </p>
        <button
          type="button"
          onClick={() => {
            window.print();
          }}
          className="px-6 py-3 rounded-full bg-white text-zinc-950 font-semibold text-xs hover:bg-white/90 transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
        >
          <Download className="w-4 h-4 text-zinc-950" />
          <span>{t.downloadBtn}</span>
        </button>
      </div>
    </div>
  );
};
