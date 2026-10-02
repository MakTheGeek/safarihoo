import React from 'react';
import { AlertTriangle, FileCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AcceptancePolicyPage: React.FC = () => {
  const { language } = useLanguage();
  const isFr = language === 'FR';

  const t = {
    title: isFr ? 'Politique d’Utilisation Acceptable' : 'Acceptable Use & Acceptance Policy',
    subtitle: isFr
      ? 'Directives définissant l’utilisation autorisée et proscrite des algorithmes, API et interfaces de Safarihoo.'
      : "Guidelines defining authorized and prohibited usage of Safarihoo's search algorithms, APIs, and interfaces.",
    sec1Title: isFr ? '1. Utilisation Autorisée' : '1. Permitted Use',
    sec1Text: isFr
      ? 'Safarihoo accorde aux particuliers une licence personnelle, non exclusive, non transférable et révocable d’accès à sa plateforme, uniquement dans le but de rechercher des voyages personnels, comparer des tarifs et entrer en contact avec des voyagistes et transporteurs vérifiés.'
      : 'Safarihoo grants individuals a personal, non-exclusive, non-transferable, revocable license to access our platform solely for personal travel discovery, fare comparison, and connecting with verified travel suppliers.',
    sec2Title: isFr ? '2. Comportements Strictement Prohibés' : '2. Strictly Prohibited Conduct',
    sec2Intro: isFr
      ? 'Il est strictement interdit aux utilisateurs, robots et agents automatisés de :'
      : 'Users, crawlers, and automated agents are strictly prohibited from:',
    sec2Item1: isFr
      ? 'Déployer des scrapers, spiders ou navigateurs sans tête pour aspirer des grilles tarifaires sans autorisation commerciale écrite préalable.'
      : 'Deploying web scrapers, spiders, headless browsers, or bots to harvest fare rates without prior written commercial authorization.',
    sec2Item2: isFr
      ? 'Tenter de contourner les limites de requêtes (rate limiting), les défenses DDoS ou les jetons de sécurité.'
      : 'Attempting to bypass rate limiting, DDoS defenses, or security tokens.',
    sec2Item3: isFr
      ? 'Générer des requêtes artificielles ou frauduleuses à haute fréquence visant à saturer les infrastructures GDS des partenaires.'
      : 'Initiating high-frequency artificial booking requests or fraudulent queries designed to stress partner GDS infrastructure.',
    sec2Item4: isFr
      ? 'Intégrer ou encapsuler les modules de recherche Safarihoo dans des applications tierces non autorisées.'
      : 'Deep-linking or embedding Safarihoo search modules into unauthorized third-party commercial applications.',
    sec2Item5: isFr
      ? 'Usurper l’identité de Safarihoo ou prétendre faussement à une affiliation commerciale.'
      : 'Impersonating Safarihoo or misrepresenting affiliations.',
    sec3Title: isFr ? '3. Application & Mesures de Sanction' : '3. Enforcement & Account Restrictions',
    sec3Text: isFr
      ? 'Nous nous réservons le droit de bloquer immédiatement toute adresse IP, de révoquer l’accès à nos services et d’engager les poursuites judiciaires appropriées contre toute entité contrevenant à la présente politique d’acceptation.'
      : 'We reserve the right to immediately block IP addresses, terminate API access tokens, and pursue appropriate legal remedies against any entities violating this Acceptance Policy.',
  };

  return (
    <div id="acceptance-policy-page-view" className="w-full flex-grow py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-white">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 mb-4">
          <FileCheck className="w-6 h-6" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
          {t.title}
        </h1>
        <p className="text-xs sm:text-sm text-white/60 mt-3">
          {t.subtitle}
        </p>
      </div>

      <div className="bg-zinc-950/90 border border-white/15 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-md space-y-8 text-xs sm:text-sm text-white/80 leading-relaxed">
        <section>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3">{t.sec1Title}</h2>
          <p>
            {t.sec1Text}
          </p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>{t.sec2Title}</span>
          </h2>
          <p className="mb-2">{t.sec2Intro}</p>
          <ul className="list-disc pl-5 space-y-1.5 text-white/70">
            <li>{t.sec2Item1}</li>
            <li>{t.sec2Item2}</li>
            <li>{t.sec2Item3}</li>
            <li>{t.sec2Item4}</li>
            <li>{t.sec2Item5}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3">{t.sec3Title}</h2>
          <p>
            {t.sec3Text}
          </p>
        </section>
      </div>
    </div>
  );
};
