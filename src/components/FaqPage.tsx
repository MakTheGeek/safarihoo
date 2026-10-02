import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Search, MessageSquare } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const FaqPage: React.FC<{ onOpenContact?: () => void }> = ({ onOpenContact }) => {
  const { language } = useLanguage();
  const isFr = language === 'FR';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'flights' | 'hotels' | 'cars' | 'airhelp' | 'billing'>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const t = {
    title: isFr ? 'Foire Aux Questions' : 'Frequently Asked Questions',
    subtitle: isFr
      ? 'Trouvez des réponses claires à vos questions sur la recherche de vols, les réservations d’hôtels, la location de véhicules et l’indemnisation de vol AirHelp sur Safarihoo.'
      : 'Find answers to common questions about searching, booking, passenger compensation rights, and managing your journeys on Safarihoo.',
    searchPlaceholder: isFr
      ? 'Rechercher une question, mot-clé, thème (ex. bagages, AirHelp, remboursement)...'
      : 'Search question, keyword, topic (e.g. baggage, AirHelp, refund)...',
    allTopics: isFr ? 'Tous les thèmes' : 'All Topics',
    flights: isFr ? 'Vols' : 'Flights',
    hotels: isFr ? 'Hôtels' : 'Hotels',
    cars: isFr ? 'Location de Voiture' : 'Car Rental',
    airhelp: isFr ? 'AirHelp & Droits' : 'AirHelp & Claims',
    billing: isFr ? 'Réservations & Facturation' : 'Bookings & Billing',
    noResults: (q: string) =>
      isFr
        ? `Aucune question trouvée pour « ${q} ». Essayez un autre mot-clé ou contactez notre équipe support.`
        : `No matching questions found for "${q}". Try a different keyword or contact our support team.`,
    stillQuestions: isFr ? 'Vous avez encore des questions ?' : 'Still have questions?',
    supportDesc: isFr
      ? 'Notre équipe d’assistance internationale est disponible 24h/24 et 7j/7 pour vous orienter dans vos réservations et vos voyages.'
      : 'Our global support team is available 24 hours a day, 7 days a week to help with your reservations and travel inquiries.',
    contactBtn: isFr ? 'Contacter l’assistance' : 'Contact Support',
  };

  const faqItems = [
    {
      category: 'flights',
      question: isFr
        ? 'Comment Safarihoo trouve-t-il des billets d’avion pas chers ?'
        : 'How does Safarihoo find cheap flight deals?',
      answer: isFr
        ? 'Safarihoo se connecte en temps réel à des centaines de compagnies aériennes traditionnelles, compagnies low-cost et agences de voyage en ligne. Nos algorithmes comparent instantanément les tarifs, escales et franchises bagages afin d’afficher les meilleures combinaisons sans aucun frais de réservation caché.'
        : 'Safarihoo connects with hundreds of global airlines, low-cost carriers, and online travel agencies in real-time. Our algorithms instantly compare airfares, routes, and baggage rules to display the most economical and convenient options with zero booking markup.'
    },
    {
      category: 'flights',
      question: isFr
        ? 'Y a-t-il des frais cachés lors d’une réservation via Safarihoo ?'
        : 'Are there hidden fees when booking through Safarihoo?',
      answer: isFr
        ? 'Non, aucun. L’utilisation de Safarihoo est 100% gratuite pour les voyageurs. Lorsque vous sélectionnez une offre, vous êtes redirigé directement vers le voyagiste ou la compagnie aérienne partenaire pour finaliser votre réservation en toute sécurité au tarif annoncé.'
        : 'No. Safarihoo is 100% free for travelers. When you select a deal, we redirect you directly to the verified airline or travel provider to complete your booking securely at the quoted price.'
    },
    {
      category: 'hotels',
      question: isFr
        ? 'Comment vérifier les équipements et la politique d’annulation d’un hôtel ?'
        : 'How do I check hotel amenities and cancellation policies?',
      answer: isFr
        ? 'Chaque fiche d’hôtel détaille la configuration des chambres, les avis clients vérifiés, l’inclusion du petit-déjeuner, le Wi-Fi ainsi que le délai limite d’annulation sans frais avant confirmation.'
        : 'Each hotel listing displays detailed room configurations, guest reviews, breakfast availability, Wi-Fi details, and specific cancellation windows. You will also see whether free cancellation is available prior to final confirmation.'
    },
    {
      category: 'hotels',
      question: isFr
        ? 'Puis-je payer ma chambre d’hôtel directement sur place ?'
        : 'Can I pay for my hotel upon arrival?',
      answer: isFr
        ? 'Les modalités de paiement dépendent de chaque établissement et du tarif sélectionné. Beaucoup d’hôtels proposent le tarif « Paiement à l’arrivée », tandis que d’autres proposent des tarifs prépayés à prix réduit.'
        : 'Payment options depend on the individual property and partner rate chosen. Many hotels offer "Pay at Property" rates, while others offer prepaid non-refundable discounts. Look for the payment badge during booking.'
    },
    {
      category: 'cars',
      question: isFr
        ? 'Quels documents sont nécessaires pour louer une voiture ?'
        : 'What documents are required to rent a car?',
      answer: isFr
        ? 'Le conducteur principal doit présenter un permis de conduire valide (généralement depuis au moins 1 à 2 ans), un permis de conduire international (si vous voyagez hors de votre pays d’origine), une carte de crédit à son nom pour la caution, ainsi qu’une pièce d’identité valide.'
        : 'Typically, the primary driver must present a valid driver’s license held for at least 1–2 years, an International Driving Permit (if traveling outside your home jurisdiction), a credit card in the driver’s name for the security deposit, and a valid passport or national ID.'
    },
    {
      category: 'cars',
      question: isFr
        ? 'Les assurances sont-elles incluses dans les devis de location ?'
        : 'Is insurance included in rental car quotes?',
      answer: isFr
        ? 'Les devis standards incluent généralement la protection de base contre le vol et les dommages (CDW) ainsi que la responsabilité civile au tiers. Vous avez l’option d’ajouter une couverture Zéro Franchise lors de votre réservation.'
        : 'Standard quotes usually include basic Collision Damage Waiver (CDW) and Third-Party Liability. You can add Full Protection or Zero Excess coverage during the reservation process.'
    },
    {
      category: 'airhelp',
      question: isFr
        ? 'Qu’est-ce qu’AirHelp et quelle indemnisation puis-je obtenir ?'
        : 'What is AirHelp and how much compensation can I claim?',
      answer: isFr
        ? 'En vertu du règlement européen CE 261/2004, de la loi britannique et des conventions internationales, vous pouvez prétendre à une indemnité allant jusqu’à 600 € par passager si votre vol a subi plus de 3 heures de retard, une annulation moins de 14 jours avant le départ ou un surbooking.'
        : 'Under EU Regulation EC 261/2004, UK regulations, and global passenger conventions, you could be entitled to up to €600 ($650+) per passenger for flights that were delayed by 3+ hours, cancelled less than 14 days before departure, or overbooked.'
    },
    {
      category: 'airhelp',
      question: isFr
        ? 'De combien de temps dispose-t-on pour réclamer une indemnisation ?'
        : 'How long do I have to claim flight compensation?',
      answer: isFr
        ? 'Selon le pays de départ du vol ou le siège de la compagnie aérienne, les réclamations peuvent couvrir des vols perturbés survenus au cours des 3 à 6 dernières années. AirHelp gère l’ensemble des démarches juridiques selon le principe « Pas de succès, pas d’honoraires ».'
        : 'Depending on the country where your flight originated or the airline’s headquarters, claims can be filed for past disrupted flights dating back between 3 to 6 years. AirHelp handles all the legal complexities on a "no win, no fee" basis.'
    },
    {
      category: 'billing',
      question: isFr
        ? 'Comment puis-je modifier ou annuler ma réservation ?'
        : 'How do I modify or cancel my reservation?',
      answer: isFr
        ? 'Safarihoo étant un métamoteur de recherche indépendant, la réservation est effectuée directement auprès du fournisseur de voyage. Consultez votre e-mail de confirmation pour gérer votre dossier sur l’espace client du voyagiste ou contactez notre assistance pour vous guider.'
        : 'Since Safarihoo is a meta-search engine, your booking is placed directly with the airline, hotel, or car rental agency. Please check your email confirmation voucher to manage your booking through the respective provider’s customer portal or contact our support team for guidance.'
    },
    {
      category: 'billing',
      question: isFr
        ? 'Quels sont les modes de paiement acceptés ?'
        : 'Which payment methods are accepted?',
      answer: isFr
        ? 'Notre réseau de partenaires mondiaux accepte toutes les cartes bancaires principales (Visa, Mastercard, American Express), Apple Pay, Google Pay, PayPal ainsi que des solutions de paiement locales.'
        : 'Our global partner network accepts all major credit and debit cards (Visa, Mastercard, American Express), Apple Pay, Google Pay, PayPal, and regional payment options.'
    },
  ];

  const filteredFaqs = faqItems.filter(item => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const categories = [
    { id: 'all', label: t.allTopics },
    { id: 'flights', label: t.flights },
    { id: 'hotels', label: t.hotels },
    { id: 'cars', label: t.cars },
    { id: 'airhelp', label: t.airhelp },
    { id: 'billing', label: t.billing },
  ];

  return (
    <div id="faq-page-view" className="w-full flex-grow py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/20 text-[#498bf7] mb-4">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
          {t.title}
        </h1>
        <p className="text-sm sm:text-base text-white/70 mt-3">
          {t.subtitle}
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-xl mx-auto mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/[0.06] border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#1b64f2] focus:ring-1 focus:ring-[#1b64f2] transition-all backdrop-blur-md shadow-lg"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setActiveCategory(cat.id as any);
                setOpenIndex(null);
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#1b64f2] text-white shadow-md'
                  : 'bg-white/[0.05] hover:bg-white/[0.1] text-white/70 hover:text-white border border-white/10'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3 mb-14">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-zinc-950/80 border border-white/10 rounded-2xl overflow-hidden transition-all shadow-md"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-sm sm:text-base font-semibold text-white">
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-white/70 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#1b64f2]/20 text-[#498bf7]' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-white/70 leading-relaxed border-t border-white/5 animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center bg-white/[0.02] border border-white/10 rounded-2xl text-white/60 text-sm">
            {t.noResults(searchQuery)}
          </div>
        )}
      </div>

      {/* Support Card Box */}
      <div className="bg-gradient-to-r from-blue-950/40 via-zinc-900 to-blue-950/40 border border-white/15 rounded-3xl p-8 text-center shadow-xl">
        <h3 className="text-xl font-bold text-white mb-2">{t.stillQuestions}</h3>
        <p className="text-xs sm:text-sm text-white/60 max-w-md mx-auto mb-5">
          {t.supportDesc}
        </p>
        <button
          type="button"
          onClick={onOpenContact}
          className="px-6 py-2.5 rounded-full bg-white text-zinc-950 font-semibold text-xs hover:bg-white/90 transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
        >
          <MessageSquare className="w-3.5 h-3.5 text-zinc-950" />
          <span>{t.contactBtn}</span>
        </button>
      </div>
    </div>
  );
};
