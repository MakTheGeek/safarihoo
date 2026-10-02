import React from 'react';
import { ShieldCheck, Lock, Eye } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const PrivacyPage: React.FC = () => {
  const { language } = useLanguage();
  const isFr = language === 'FR';

  const t = {
    title: isFr ? 'Politique de Confidentialité' : 'Privacy Policy',
    lastUpdated: isFr
      ? 'Dernière mise à jour : Août 2026 • Conforme au RGPD, CCPA & Standards Internationaux'
      : 'Last Updated: August 2026 • Compliant with GDPR, CCPA & International Data Protection Standards',
    sec1Title: isFr ? '1. Vue d’Ensemble & Engagements' : '1. Overview & Commitment',
    sec1Text: isFr
      ? 'Chez Safarihoo (« nous », « notre »), le respect de votre vie privée et la protection de vos données personnelles sont fondamentaux. Cette Politique de Confidentialité décrit la manière dont nous collectons, traitons et protégeons vos données lorsque vous naviguez sur notre plateforme et utilisez nos outils de comparaison de voyages.'
      : 'At Safarihoo ("we", "our", "us"), respecting your privacy and safeguarding your personal information is fundamental. This Privacy Policy outlines how we collect, process, and protect your data when you use our website, search tools, and travel meta-search comparison services.',
    sec2Title: isFr ? '2. Données Collectées' : '2. Information We Collect',
    sec2Intro: isFr
      ? 'Nous collectons des données afin de fournir des résultats de recherche pertinents et rapides :'
      : 'We collect information to provide fast, relevant travel deals:',
    sec2Item1Title: isFr ? 'Requêtes de Recherche :' : 'Search Queries:',
    sec2Item1Desc: isFr
      ? ' Villes de départ et d’arrivée, dates, nombre de passagers, devise préférée et classe de cabine.'
      : ' Departure/arrival locations, dates, passenger count, preferred currency, and cabin class.',
    sec2Item2Title: isFr ? 'Données Techniques & Navigation :' : 'Technical & Usage Data:',
    sec2Item2Desc: isFr
      ? ' Adresse IP, type d’appareil, navigateur et URL de référence pour optimiser les performances et contrer les abus.'
      : ' IP address, device type, browser specifications, and referral URLs to optimize website performance and detect fraud.',
    sec2Item3Title: isFr ? 'Communications :' : 'Communications:',
    sec2Item3Desc: isFr
      ? ' Adresse e-mail et messages envoyés via nos formulaires de contact, inscriptions à la newsletter ou candidatures.'
      : ' Email addresses and details submitted voluntarily via our contact forms, newsletter, or job applications.',
    sec3Title: isFr ? '3. Zéro Donnée de Paiement Conservée' : '3. Zero Payment Data Retention',
    sec3Text: isFr
      ? 'Safarihoo est un métamoteur de recherche indépendant. Nous ne collectons, ne traitons et ne stockons jamais vos numéros de carte de crédit, codes CVV ou coordonnées bancaires. Lorsque vous choisissez une offre, vous êtes redirigé de façon sécurisée directement sur le site officiel et chiffré du voyagiste ou de la compagnie partenaire.'
      : 'Safarihoo is an independent meta-search engine. We never collect, process, or store your payment card numbers, CVV codes, or banking credentials. When you choose an offer, you are securely transferred directly to the verified airline, hotel, or car rental partner\'s encrypted checkout.',
    sec4Title: isFr ? '4. Utilisation des Données' : '4. How We Use Information',
    sec4Intro: isFr ? 'Vos données sont utilisées exclusivement pour :' : 'Your information is used strictly to:',
    sec4Item1: isFr ? 'Agréger, filtrer et afficher les offres de voyage en temps réel.' : 'Aggregate, filter, and deliver travel quotes in real-time.',
    sec4Item2: isFr ? 'Assurer le service client et répondre à vos messages d’assistance.' : 'Provide customer care and respond to support tickets.',
    sec4Item3: isFr ? 'Envoyer les alertes de voyage et la newsletter auxquelles vous avez souscrit.' : 'Send opted-in travel alerts or newsletter updates.',
    sec4Item4: isFr ? 'Garantir la sécurité du site, contrer le scraping automatisé et respecter les lois.' : 'Maintain security, prevent automated bot scraping, and comply with legal requirements.',
    sec5Title: isFr ? '5. Vos Droits de Protection des Données (RGPD / CCPA)' : '5. Your Data Protection Rights (GDPR / CCPA)',
    sec5Intro: isFr ? 'Vous disposez de droits complets sur vos données personnelles :' : 'You possess comprehensive rights regarding your personal data:',
    sec5Item1: isFr ? 'Droit d’accès, de rectification ou de suppression de vos données.' : 'Right to access, rectify, or request deletion of personal information.',
    sec5Item2: isFr ? 'Droit de retirer votre consentement aux newsletters et de paramétrer vos cookies à tout moment.' : 'Right to withdraw newsletter consent or manage cookie preferences at any time.',
    sec5Item3: isFr ? 'Droit à la portabilité des données.' : 'Right to request data portability.',
    sec5Contact: isFr
      ? 'Pour exercer vos droits, contactez notre Délégué à la Protection des Données à l’adresse '
      : 'To exercise your rights, please reach our Data Protection Officer at ',
  };

  return (
    <div id="privacy-page-view" className="w-full flex-grow py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-white">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/20 text-[#498bf7] mb-4">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
          {t.title}
        </h1>
        <p className="text-xs sm:text-sm text-white/60 mt-3">
          {t.lastUpdated}
        </p>
      </div>

      <div className="bg-zinc-950/90 border border-white/15 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-md space-y-8 text-xs sm:text-sm text-white/80 leading-relaxed">
        <section>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#498bf7]" />
            <span>{t.sec1Title}</span>
          </h2>
          <p>
            {t.sec1Text}
          </p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center gap-2">
            <Eye className="w-5 h-5 text-emerald-400" />
            <span>{t.sec2Title}</span>
          </h2>
          <p className="mb-2">{t.sec2Intro}</p>
          <ul className="list-disc pl-5 space-y-1.5 text-white/70">
            <li><strong className="text-white">{t.sec2Item1Title}</strong>{t.sec2Item1Desc}</li>
            <li><strong className="text-white">{t.sec2Item2Title}</strong>{t.sec2Item2Desc}</li>
            <li><strong className="text-white">{t.sec2Item3Title}</strong>{t.sec2Item3Desc}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3">{t.sec3Title}</h2>
          <p>
            {t.sec3Text}
          </p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3">{t.sec4Title}</h2>
          <p className="mb-2">{t.sec4Intro}</p>
          <ul className="list-disc pl-5 space-y-1 text-white/70">
            <li>{t.sec4Item1}</li>
            <li>{t.sec4Item2}</li>
            <li>{t.sec4Item3}</li>
            <li>{t.sec4Item4}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3">{t.sec5Title}</h2>
          <p className="mb-2">{t.sec5Intro}</p>
          <ul className="list-disc pl-5 space-y-1 text-white/70">
            <li>{t.sec5Item1}</li>
            <li>{t.sec5Item2}</li>
            <li>{t.sec5Item3}</li>
          </ul>
          <p className="mt-2 text-white/60">
            {t.sec5Contact}
            <a href="mailto:privacy@safarihoo.com" className="text-[#498bf7] hover:underline">
              privacy@safarihoo.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
};
