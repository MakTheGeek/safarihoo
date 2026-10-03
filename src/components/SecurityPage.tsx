import React from 'react';
import { ShieldCheck, Lock, KeyRound, Server } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const SecurityPage: React.FC = () => {
  const { language } = useLanguage();
  const isFr = language === 'FR';

  const t = {
    title: isFr ? 'Sécurité de la Plateforme & Protection' : 'Platform Security & Protection',
    subtitle: isFr
      ? 'Nos protocoles de protection multicouches pour garantir des recherches de voyages sûres et chiffrées dans le monde entier.'
      : 'Our proactive multi-layered protocols ensuring safe, encrypted travel discoveries worldwide.',
    badge1Title: isFr ? 'TLS 1.3 / SSL' : 'TLS 1.3 / SSL',
    badge1Desc: isFr ? 'Chiffrement bancaire 256 bits' : '256-bit Bank-Grade Encryption',
    badge2Title: isFr ? 'Conformité PCI-DSS' : 'PCI-DSS Compliant',
    badge2Desc: isFr ? 'Redirections partenaires sécurisées' : 'Direct Partner Handoffs',
    badge3Title: isFr ? 'Protection Edge & DDoS' : 'Edge & DDoS Shield',
    badge3Desc: isFr ? 'Défense périphérique permanente' : 'Continuous Edge Defense',
    sec1Title: isFr ? '1. Sécurité du Transport de Bout en Bout' : '1. End-to-End Transport Security',
    sec1Text: isFr
      ? 'Toutes les communications entre votre navigateur, notre passerelle d’API et les partenaires de réservation vérifiés utilisent le protocole TLS 1.3 avec préchargement HSTS (HTTP Strict Transport Security) strict pour neutraliser toute tentative d’interception.'
      : 'All communications between your browser, our API gateway, and verified booking partners utilize modern TLS 1.3 encryption with strict HTTP Strict Transport Security (HSTS) preloading to neutralize interception or man-in-the-middle exploits.',
    sec2Title: isFr ? '2. Vérification des Partenaires & Bouclier Anti-Fraude' : '2. Partner Verification & Fraud Shield',
    sec2Text: isFr
      ? 'Nous n’indexons que des voyagistes, compagnies aériennes, chaînes hôtelières et loueurs répondant aux plus stricts agréments (IATA, ATOL, ABTA, ARC et certification PCI-DSS Niveau 1). Cela garantit que chaque transaction s’opère dans un environnement réglementé et assuré.'
      : 'We only index travel suppliers, airlines, hotel chains, and car operators that satisfy strict regulatory accreditations (IATA, ATOL, ABTA, ARC, and PCI-DSS Level 1 certification). This guarantees that every transaction occurs within a regulated, insured environment.',
    sec3Title: isFr ? '3. Divulgation Responsable & Signalement de Vulnérabilités' : '3. Responsible Disclosure & Vulnerability Reporting',
    sec3Text: isFr
      ? 'Safarihoo encourage les chercheurs en sécurité et experts éthiques à identifier et signaler d’éventuelles faiblesses. Si vous découvrez une vulnérabilité, veuillez contacter notre équipe d’ingénierie sécurité à '
      : 'Safarihoo welcomes security researchers and ethical hackers to identify and report potential security issues. If you discover a vulnerability, please reach our security engineering team directly at ',
    sec3Proof: isFr
      ? ' en incluant les étapes reproductibles de preuve de concept.'
      : ' with reproducible proof-of-concept steps.',
  };

  return (
    <div id="security-page-view" className="w-full flex-grow py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-white">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 mb-4">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
          {t.title}
        </h1>
        <p className="text-xs sm:text-sm text-white/60 mt-3">
          {t.subtitle}
        </p>
      </div>

      <div className="bg-zinc-950/90 border border-white/15 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-md space-y-8 text-xs sm:text-sm text-white/80 leading-relaxed">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4">
          <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 text-center">
            <Lock className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <div className="font-bold text-white text-sm">{t.badge1Title}</div>
            <div className="text-[11px] text-white/60 mt-1">{t.badge1Desc}</div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 text-center">
            <KeyRound className="w-6 h-6 text-[#498bf7] mx-auto mb-2" />
            <div className="font-bold text-white text-sm">{t.badge2Title}</div>
            <div className="text-[11px] text-white/60 mt-1">{t.badge2Desc}</div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 text-center">
            <Server className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="font-bold text-white text-sm">{t.badge3Title}</div>
            <div className="text-[11px] text-white/60 mt-1">{t.badge3Desc}</div>
          </div>
        </div>

        <section>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3">{t.sec1Title}</h2>
          <p>
            {t.sec1Text}
          </p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3">{t.sec2Title}</h2>
          <p>
            {t.sec2Text}
          </p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3">{t.sec3Title}</h2>
          <p>
            {t.sec3Text}
            <a href="mailto:security@safarihoo.com" className="text-emerald-400 hover:underline">
              security@safarihoo.com
            </a>
            {t.sec3Proof}
          </p>
        </section>
      </div>
    </div>
  );
};
