import React from 'react';
import { FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const TermsPage: React.FC = () => {
  const { language } = useLanguage();
  const isFr = language === 'FR';

  const t = {
    title: isFr ? 'Conditions d’Utilisation' : 'Terms of Use',
    subtitle: isFr
      ? 'Dernière mise à jour : Août 2026 • Veuillez lire attentivement ces conditions avant d’utiliser nos services.'
      : 'Last Updated: August 2026 • Please read these terms carefully before utilizing our services.',
    sec1Title: isFr ? '1. Objet & Nature des Services' : '1. Scope of Services',
    sec1Text: isFr
      ? 'Safarihoo met à disposition une plateforme en ligne de métarecherche comparant les prix et les itinéraires de billets d’avion, d’hôtels, de locations de voiture et de réclamations d’indemnisation de vol. Safarihoo n’est ni une agence de voyages, ni un transporteur aérien, ni un hôtelier, ni un loueur de véhicules. Nous ne fixons pas les tarifs, n’émettons pas de billets et n’opérons aucun service de transport.'
      : 'Safarihoo provides an online meta-search platform that compares prices and itineraries for flights, hotels, car rentals, and flight disruption claims. Safarihoo is not a travel agency, carrier, hotelier, or car rental provider. We do not set fares, issue tickets, or operate travel services.',
    sec2Title: isFr ? '2. Contrats de Réservation & Fournisseurs Tiers' : '2. Booking Contracts & Third-Party Providers',
    sec2Text: isFr
      ? 'Lorsque vous finalisez une réservation via un lien affiché sur Safarihoo, votre contrat de transport ou d’hébergement est conclu directement et exclusivement avec le fournisseur tiers (compagnie aérienne, hôtel, agence de location ou voyagiste en ligne). Leurs conditions générales de vente, politiques d’annulation et règles bagages s’appliquent à votre dossier.'
      : 'When you complete a booking through a link displayed on Safarihoo, your contract of carriage or lodging agreement is established directly with the third-party provider (airline, hotel, car rental company, or OTA). Their specific terms, conditions, cancellation penalties, and baggage policies apply to your reservation.',
    sec3Title: isFr ? '3. Exactitude des Tarifs Affichés' : '3. Accuracy of Displayed Pricing',
    sec3Text: isFr
      ? 'Bien que Safarihoo déploie des systèmes de cache haute performance et des flux d’API en temps réel pour assurer la précision des prix, la disponibilité des sièges d’avion et des chambres d’hôtel fluctue rapidement. Le tarif contractuel final et contraignant est toujours celui confirmé sur la page de paiement du partenaire tiers avant validation.'
      : "While Safarihoo uses state-of-the-art caching and live API feeds to ensure fare accuracy, airline seat inventory and hotel room rates can fluctuate rapidly. The final binding price is always confirmed on the third-party partner's checkout page prior to payment.",
    sec4Title: isFr ? '4. Propriété Intellectuelle' : '4. Intellectual Property',
    sec4Text: isFr
      ? 'Toutes les marques, logos, chartes graphiques, architectures logicielles et algorithmes propriétaires présents sur Safarihoo sont protégés par le droit de la propriété intellectuelle. Toute extraction automatisée (scraping), copie ou exploitation non autorisée est strictement interdite.'
      : 'All trademarks, logos, UI designs, codebases, software, and proprietary algorithms on Safarihoo are protected by copyright and intellectual property laws. Unauthorized scraping, copying, reverse engineering, or framing is strictly prohibited.',
    sec5Title: isFr ? '5. Limitation de Responsabilité' : '5. Limitation of Liability',
    sec5Text: isFr
      ? 'Dans toute la mesure permise par la législation applicable, Safarihoo ne pourra être tenue responsable des préjudices directs ou indirects découlant de retards ou annulations de vols, de modifications d’horaires, de déconvenues d’hébergement ou de litiges entre vous et un fournisseur tiers.'
      : 'To the fullest extent permitted by applicable law, Safarihoo shall not be liable for direct, indirect, incidental, or consequential damages resulting from flight cancellations, schedule modifications, accommodation dissatisfaction, or disputes between you and third-party travel providers.',
  };

  return (
    <div id="terms-page-view" className="w-full flex-grow py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-white">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/20 text-[#498bf7] mb-4">
          <FileText className="w-6 h-6" />
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
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3">{t.sec2Title}</h2>
          <p>
            {t.sec2Text}
          </p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3">{t.sec3Title}</h2>
          <p>
            {t.sec3Text}
          </p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3">{t.sec4Title}</h2>
          <p>
            {t.sec4Text}
          </p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3">{t.sec5Title}</h2>
          <p>
            {t.sec5Text}
          </p>
        </section>
      </div>
    </div>
  );
};
