export interface ChatResponse {
  text: string;
  action?: {
    type: 'nav' | 'scroll' | 'link';
    target: string;
    label: string;
  };
  followUps?: string[];
}

export function getSafarihooResponse(userQuery: string, language: 'FR' | 'EN'): ChatResponse {
  const query = userQuery
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  const isFr = language === 'FR';

  // 1. GREETINGS & CASUAL
  if (/^(bonjour|salut|hello|hi|hey|coucou|bonsoir|yo)\b/i.test(query)) {
    return {
      text: isFr
        ? "Bonjour ! 👋 Je suis l'Assistant Safarihoo, votre concierge voyage virtuel disponible 24/7.\n\nJe peux vous aider à :\n• ✈️ Trouver des vols au meilleur prix parmi 700+ compagnies\n• 🏨 Réserver des hôtels & resorts avec notre partenaire Trip.com\n• 🚗 Louer un véhicule au meilleur tarif\n• 🛡️ Obtenir jusqu'à 600 € d'indemnisation pour un vol retardé avec AirHelp\n• 🌍 Préparer vos itinéraires de rêve\n\nQue recherchez-vous pour votre prochain voyage ?"
        : "Hello! 👋 I am the Safarihoo Assistant, your 24/7 personal travel concierge.\n\nI can assist you with:\n• ✈️ Finding the cheapest flights across 700+ airlines\n• 🏨 Booking luxury hotels & resorts with Trip.com\n• 🚗 Renting cars at negotiated rates\n• 🛡️ Claiming up to €600 compensation for delayed flights with AirHelp\n• 🌍 Planning custom itineraries\n\nHow can I help you today?",
      followUps: isFr
        ? ["✈️ Chercher un vol pas cher", "🏨 Hôtels avec Trip.com", "🛡️ Indemnisation AirHelp", "🌍 Idées de destinations"]
        : ["✈️ Search cheap flights", "🏨 Trip.com hotels", "🛡️ AirHelp compensation", "🌍 Destination ideas"],
    };
  }

  if (/(qui es[- ]tu|presentation|c'est quoi safarihoo|who are you|what is safarihoo)/i.test(query)) {
    return {
      text: isFr
        ? "Je suis l'Assistant Safarihoo officiel ! 🦁✨\n\nSafarihoo est une plateforme moderne de recherche et de réservation de voyages qui compare en temps réel des centaines de voyagistes et compagnies aériennes pour vous garantir les meilleurs tarifs, sans commission cachée.\n\nNous collaborons avec les leaders mondiaux du secteur : Aviasales, Trip.com et AirHelp pour rendre vos voyages simples, économiques et sécurisés."
        : "I am the official Safarihoo Assistant! 🦁✨\n\nSafarihoo is a modern travel comparison and booking platform designed to find you the lowest guaranteed fares across hundreds of airlines and travel providers with zero hidden fees.\n\nWe partner with global leaders like Aviasales, Trip.com, and AirHelp to deliver smooth, affordable, and protected journeys worldwide.",
      followUps: isFr
        ? ["✈️ Comment réserver un vol ?", "🛡️ Comment fonctionne AirHelp ?", "📬 Contacter le support"]
        : ["✈️ How to book flights?", "🛡️ How does AirHelp work?", "📬 Contact support"],
    };
  }

  if (/(merci|super|parfait|top|genial|thank you|thanks|great|awesome)/i.test(query)) {
    return {
      text: isFr
        ? "Avec grand plaisir ! 😊 C'est un honneur de vous accompagner. Avez-vous une autre question pour préparer votre séjour ?"
        : "You are very welcome! 😊 It is my pleasure to assist. Do you have any other questions to help plan your trip?",
      followUps: isFr
        ? ["✈️ Comparer les vols", "🏨 Trouver un hôtel", "🌍 Destinations populaires"]
        : ["✈️ Compare flights", "🏨 Find hotels", "🌍 Popular destinations"],
    };
  }

  // 2. AIRHELP & INDEMNISATION VOLS RETARDÉS / ANNULÉS
  if (/(airhelp|indemn|retard|annul|surbook|decroche|indemnisation|rembours|compensation|delayed|canceled|claim)/i.test(query)) {
    return {
      text: isFr
        ? "🛡️ **Indemnisation de vol avec AirHelp (Partenaire officiel Safarihoo)** :\n\nSi votre vol a subi une perturbation au cours des 3 dernières années, la législation européenne (CE 261/2004) vous donne droit à une indemnisation financière :\n\n• **Vols retardés de 3h ou plus** à l'arrivée\n• **Vols annulés** moins de 14 jours avant le départ\n• **Refus d'embarquement (surbooking)**\n\n💰 **Montants d'indemnisation légale :**\n- **250 €** pour les trajets de moins de 1 500 km\n- **400 €** pour les trajets de 1 500 à 3 500 km\n- **600 €** pour les trajets de plus de 3 500 km\n\n✨ La vérification d'éligibilité est 100 % gratuite en 2 minutes sans avance de frais (modèle 'No Win, No Fee')."
        : "🛡️ **Flight Compensation with AirHelp (Safarihoo Official Partner)**:\n\nIf you experienced flight disruption in the past 3 years, European Regulation EC 261/2004 entitles you to legal cash compensation:\n\n• **Delayed flights by 3+ hours** at destination\n• **Canceled flights** announced under 14 days before departure\n• **Overbooked flights (denied boarding)**\n\n💰 **Standard Legal Compensation:**\n- **€250** for flights under 1,500 km\n- **€400** for flights between 1,500 and 3,500 km\n- **€600** for long-haul flights over 3,500 km\n\n✨ Eligibility check takes 2 minutes and is 100% risk-free with no upfront fees.",
      action: {
        type: 'nav',
        target: 'AirHelp',
        label: isFr ? "Vérifier mon indemnisation AirHelp" : "Check AirHelp Compensation",
      },
      followUps: isFr
        ? ["Mon vol d'il y a 2 ans est-il éligible ?", "Quels documents fournir à AirHelp ?", "✈️ Réserver un nouveau vol"]
        : ["Is a flight from 2 years ago eligible?", "What documents are required?", "✈️ Book a new flight"],
    };
  }

  // 3. FLIGHTS / VOLS & BILLETS PAS CHERS
  if (/(vol|flight|billet|avion|compagnie|trouver un vol|prix|cher|low cost|airline|cheap flight)/i.test(query)) {
    return {
      text: isFr
        ? "✈️ **Conseils Safarihoo pour réserver vos vols au meilleur tarif** :\n\n1. **Comparateur intégré** : Notre moteur officiel en haut de page scrute simultanément plus de 700 compagnies aériennes (Air France, Emirates, Qatar Airways, Lufthansa, Ryanair, easyJet, etc.).\n2. **Dates flexibles** : Les vols en milieu de semaine (mardi et mercredi) sont en moyenne 15 % à 25 % moins chers que le week-end.\n3. **Anticipation** : Réservez idéalement entre 6 et 8 semaines à l'avance pour les vols courts, et 3 à 5 mois pour les longs courriers.\n4. **Zéro frais caché** : Les prix affichés sur Safarihoo sont transparents et incluent les taxes obligatoires."
        : "✈️ **Safarihoo Pro Tips for Scoring the Lowest Fares**:\n\n1. **Live Comparator**: Our official booking engine at the top scans 700+ global airlines and online agencies simultaneously.\n2. **Flexible Dates**: Mid-week flights (Tuesday & Wednesday) are typically 15% to 25% cheaper than Friday or Sunday flights.\n3. **Booking Window**: Book 6–8 weeks in advance for short-haul trips and 3–5 months for international intercontinental flights.\n4. **Zero Hidden Fees**: All prices displayed include standard mandatory airport taxes.",
      action: {
        type: 'scroll',
        target: 'flights-page-view',
        label: isFr ? "Accéder au comparateur de vols" : "Open Flight Search",
      },
      followUps: isFr
        ? ["Quelles sont les astuces pour les bagages ?", "🏨 Voir les hôtels partenaires", "🌍 Quelles sont les destinations pas chères ?"]
        : ["What are cabin luggage guidelines?", "🏨 Browse Trip.com hotels", "🌍 Best budget destinations"],
    };
  }

  // 4. HOTELS & SÉJOURS (TRIP.COM)
  if (/(hotel|hébergement|logement|chambre|resort|dormir|trip\.com|accommodation)/i.test(query)) {
    return {
      text: isFr
        ? "🏨 **Hôtels & Séjours avec notre partenaire officiel Trip.com** :\n\nSafarihoo est connecté à l'inventaire mondial de Trip.com, regroupant plus de 1,4 million d'établissements dans plus de 200 pays :\n\n• **Large choix** : Hôtels de charme, resorts 5 étoiles, appartements urbains et auberges conviviales.\n• **Avantages exclusifs** : Tarifs négociés jusqu'à -30 %, programmes de fidélité et confirmation immédiate.\n• **Sérénité** : Filtre 'Annulation gratuite' disponible sur la majorité des réservations.\n\n👉 Cliquez sur l'onglet **'Hôtels'** dans le menu supérieur pour lancer votre recherche !"
        : "🏨 **Hotels & Accommodations with Official Partner Trip.com**:\n\nSafarihoo connects you directly with Trip.com's worldwide catalog of over 1.4 million properties across 200+ countries:\n\n• **Extensive Selection**: Luxury 5-star resorts, boutique hotels, city apartments, and cozy villas.\n• **Exclusive Perks**: Negotiated discounts of up to 30%, real-time availability, and instant confirmations.\n• **Peace of Mind**: Filter easily by 'Free Cancellation' for total flexibility.\n\n👉 Click the **'Hotels'** tab in the top navigation to search destinations!",
      action: {
        type: 'nav',
        target: 'Hotels',
        label: isFr ? "Explorer les Hôtels Trip.com" : "Explore Trip.com Hotels",
      },
      followUps: isFr
        ? ["Quels sont les hôtels avec annulation gratuite ?", "🚗 Louer une voiture sur place", "✈️ Réserver les vols associés"]
        : ["How does free cancellation work?", "🚗 Rent a car at destination", "✈️ Search matching flights"],
    };
  }

  // 5. CAR RENTAL / LOCATION DE VOITURES
  if (/(voiture|location|louer|vehicule|car|rental|auto|conduire|drive)/i.test(query)) {
    return {
      text: isFr
        ? "🚗 **Location de Voitures sur Safarihoo** :\n\nNous comparons les plus grands loueurs internationaux (Hertz, Avis, Europcar, Sixt, Enterprise, Budget) directement dans les aéroports et centres-villes :\n\n• **Prise en charge facile** : Directement au terminal à votre arrivée d'avion.\n• **Kilométrage illimité** disponible sur la plupart des offres.\n• **Gamme complète** : De la citadine économique au SUV familial et véhicules premium.\n\n👉 Rendez-vous dans la section **'Voitures'** du menu pour comparer les disponibilités."
        : "🚗 **Car Rentals on Safarihoo**:\n\nWe compare all top international rental brands (Hertz, Avis, Europcar, Sixt, Enterprise, Budget) at major airports and city hubs worldwide:\n\n• **Seamless Pick-up**: Directly at the airport terminal upon flight landing.\n• **Unlimited Mileage** options available on most vehicles.\n• **Comprehensive Fleet**: From compact city cars to spacious family SUVs and luxury sedans.\n\n👉 Visit the **'Cars'** section in our top navigation to view availability.",
      action: {
        type: 'nav',
        target: 'Cars',
        label: isFr ? "Voir la location de voitures" : "Explore Car Rentals",
      },
      followUps: isFr
        ? ["Quel permis de conduire faut-il à l'étranger ?", "Comment fonctionne l'assurance voiture ?", "✈️ Trouver mes billets d'avion"]
        : ["Do I need an international license?", "How does rental insurance work?", "✈️ Find matching flights"],
    };
  }

  // 6. SPECIFIC POPULAR DESTINATIONS
  if (/(paris|france)/i.test(query)) {
    return {
      text: isFr
        ? "🗼 **Destination Paris, France** :\n\n• **Aéroports** : Paris-CDG (Charles de Gaulle) et Paris-Orly.\n• **Meilleure saison** : D'avril à juin et de septembre à octobre pour une météo agréable sans la foule estivale.\n• **Incontournables** : Tour Eiffel, Musée du Louvre, Montmartre, croisière sur la Seine.\n• **Astuce Safarihoo** : Les vols vers Orly sont souvent plus économiques pour les liaisons européennes et méditerranéennes."
        : "🗼 **Destination Paris, France**:\n\n• **Airports**: Paris-CDG (Charles de Gaulle) and Paris-Orly.\n• **Best Season**: April to June & September to October for mild weather and manageable crowds.\n• **Highlights**: Eiffel Tower, Louvre Museum, Montmartre, Seine river cruises.\n• **Safarihoo Tip**: Flights to Orly often feature lower fares for regional European flights.",
      followUps: isFr
        ? ["✈️ Chercher un vol pour Paris", "🏨 Hôtels à Paris", "🌍 Autre destination"]
        : ["✈️ Flights to Paris", "🏨 Paris hotels", "🌍 Other destination"],
    };
  }

  if (/(new york|nyc|etats-unis|usa)/i.test(query)) {
    return {
      text: isFr
        ? "🗽 **Destination New York, États-Unis** :\n\n• **Aéroports** : JFK (John F. Kennedy), EWR (Newark) et LGA (LaGuardia).\n• **Meilleure saison** : Printemps (mai) et Automne (septembre-novembre) pour Central Park et les promenades.\n• **Formalités** : Autorisation ESTA obligatoire avant l'embarquement pour les ressortissants éligibles.\n• **Astuce Safarihoo** : Comparer les atterrissages à Newark (EWR) qui offre parfois des billets 15 % moins chers que JFK."
        : "🗽 **Destination New York City, USA**:\n\n• **Airports**: JFK, Newark (EWR), and LaGuardia (LGA).\n• **Best Season**: Spring (May) and Autumn (September–November) for Central Park views.\n• **Requirements**: Valid ESTA authorization required prior to boarding for visa waiver travelers.\n• **Safarihoo Tip**: Compare flights into Newark (EWR) which often offer savings over JFK.",
      followUps: isFr
        ? ["✈️ Vols pour New York", "🏨 Hôtels à Manhattan", "Formalités ESTA"]
        : ["✈️ Flights to New York", "🏨 Hotels in Manhattan", "ESTA details"],
    };
  }

  if (/(tokyo|japon|japan)/i.test(query)) {
    return {
      text: isFr
        ? "🗾 **Destination Tokyo, Japon** :\n\n• **Aéroports** : Haneda (HND, plus proche du centre) et Narita (NRT).\n• **Meilleure saison** : Mars-avril (floraison des cerisiers Sakura) et octobre-novembre (automne flamboyant).\n• **Incontournables** : Quartier Shibuya, temple Senso-ji, Shinjuku, gastronomie locale.\n• **Astuce Safarihoo** : Privilégier l'aéroport d'Haneda (HND) pour économiser 1h de transfert vers le centre de Tokyo."
        : "🗾 **Destination Tokyo, Japan**:\n\n• **Airports**: Haneda (HND, closer to downtown) and Narita (NRT).\n• **Best Season**: March–April (Cherry Blossom season) & October–November (Autumn colors).\n• **Highlights**: Shibuya crossing, Senso-ji temple, Akihabara, world-class dining.\n• **Safarihoo Tip**: Haneda Airport (HND) saves you roughly 1 hour in ground transit into Tokyo.",
      followUps: isFr
        ? ["✈️ Vols pour Tokyo", "🏨 Hôtels à Tokyo", "Quand voir les cerisiers en fleurs ?"]
        : ["✈️ Flights to Tokyo", "🏨 Tokyo hotels", "Cherry blossom timing"],
    };
  }

  if (/(dubai|emirats|uae)/i.test(query)) {
    return {
      text: isFr
        ? "🏙️ **Destination Dubaï, Émirats Arabes Unis** :\n\n• **Aéroport** : DXB (Dubai International).\n• **Meilleure saison** : De novembre à mars (températures parfaites de 24°C à 28°C).\n• **Incontournables** : Burj Khalifa, désert safari, Dubai Mall, Marina et plages de Jumeirah.\n• **Astuce Safarihoo** : Emirates et flydubai proposent souvent d'excellentes offres directes ou avec stopover gratuit."
        : "🏙️ **Destination Dubai, UAE**:\n\n• **Airport**: DXB (Dubai International).\n• **Best Season**: November to March (pleasant sunshine between 24°C and 28°C).\n• **Highlights**: Burj Khalifa, desert safaris, Dubai Mall, Palm Jumeirah beaches.\n• **Safarihoo Tip**: Watch for Emirates special stopover packages when booking through Safarihoo.",
      followUps: isFr
        ? ["✈️ Vols pour Dubaï", "🏨 Hôtels à Dubaï", "Meilleure période pour Dubaï"]
        : ["✈️ Flights to Dubai", "🏨 Dubai hotels", "Best season for Dubai"],
    };
  }

  if (/(bali|indonesie|indonesia)/i.test(query)) {
    return {
      text: isFr
        ? "🌴 **Destination Bali, Indonésie** :\n\n• **Aéroport** : Denpasar (DPS - Ngurah Rai).\n• **Meilleure saison** : Saison sèche de mai à octobre (ensoleillement maximal et humidité modérée).\n• **Incontournables** : Rizières d'Ubud, temples d'Uluwatu, surf à Canggu, cascades de Munduk.\n• **Astuce Safarihoo** : Les vols avec escale à Singapour ou Kuala Lumpur offrent souvent les tarifs les plus compétitifs."
        : "🌴 **Destination Bali, Indonesia**:\n\n• **Airport**: Denpasar (DPS - Ngurah Rai).\n• **Best Season**: Dry season from May to October (abundant sunshine and gentle breezes).\n• **Highlights**: Ubud rice terraces, Uluwatu cliff temple, Canggu surf, waterfalls.\n• **Safarihoo Tip**: Connecting flights via Singapore or Kuala Lumpur often provide the best value.",
      followUps: isFr
        ? ["✈️ Vols pour Bali", "🏨 Hôtels & Villas à Bali", "Quelle météo à Bali ?"]
        : ["✈️ Flights to Bali", "🏨 Bali hotels & villas", "Weather in Bali"],
    };
  }

  if (/(rome|italie|italy)/i.test(query)) {
    return {
      text: isFr
        ? "🏛️ **Destination Rome, Italie** :\n\n• **Aéroports** : Fiumicino (FCO) et Ciampino (CIA, dédié aux low-costs).\n• **Meilleure saison** : Avril à juin et septembre à octobre.\n• **Incontournables** : Colisée, Fontaine de Trevi, Vatican et Basilique Saint-Pierre, Trastevere.\n• **Astuce Safarihoo** : Ryanair et Wizz Air desservent souvent Ciampino à des tarifs défiant toute concurrence."
        : "🏛️ **Destination Rome, Italy**:\n\n• **Airports**: Fiumicino (FCO) and Ciampino (CIA).\n• **Best Season**: April to June & September to October.\n• **Highlights**: Colosseum, Trevi Fountain, Vatican City, historic Trastevere.\n• **Safarihoo Tip**: Budget carriers often operate low-cost routes into Ciampino.",
      followUps: isFr
        ? ["✈️ Vols pour Rome", "🏨 Hôtels à Rome", "Où loger à Rome ?"]
        : ["✈️ Flights to Rome", "🏨 Rome hotels", "Where to stay in Rome?"],
    };
  }

  if (/(marrakech|maroc|morocco)/i.test(query)) {
    return {
      text: isFr
        ? "🕌 **Destination Marrakech, Maroc** :\n\n• **Aéroport** : Marrakech-Ménara (RAK).\n• **Meilleure saison** : De mars à mai et d'octobre à décembre (chaleur agréable).\n• **Incontournables** : Place Jemaa el-Fna, Jardin Majorelle, souks de la Médina, Palais Bahia.\n• **Astuce Safarihoo** : Vols directs fréquents et très abordables depuis la plupart des grandes villes européennes."
        : "🕌 **Destination Marrakech, Morocco**:\n\n• **Airport**: Marrakech Menara (RAK).\n• **Best Season**: March to May & October to December (warm and sunny days).\n• **Highlights**: Jemaa el-Fna square, Majorelle Gardens, Medina souks, Bahia Palace.\n• **Safarihoo Tip**: Plentiful direct low-cost flights from major European hubs.",
      followUps: isFr
        ? ["✈️ Vols pour Marrakech", "🏨 Riads à Marrakech", "Que visiter à Marrakech ?"]
        : ["✈️ Flights to Marrakech", "🏨 Riads in Marrakech", "What to see in Marrakech?"],
    };
  }

  // 7. ITINERAIRES & VACANCES
  if (/(itineraire|programme|vacance|sejour|idee|conseil voyage|road trip|itinerary|vacation|recommend)/i.test(query)) {
    return {
      text: isFr
        ? "🌍 **Idées d'itinéraires recommandés par Safarihoo** :\n\n1. **Escapade Citadine Européenne (3 à 4 jours)** :\n   • Rome, Lisbonne, Barcelone ou Prague : vol direct pas cher + hôtel boutique avec Trip.com.\n\n2. **Soleil & Découverte (7 jours)** :\n   • Marrakech & le désert d'Agafay, ou les îles Canaries (Ténérife / Lanzarote).\n\n3. **Grand Voyage Aventure (10 à 14 jours)** :\n   • Thaïlande (Bangkok + îles) ou Bali (culture à Ubud + farniente sur les côtes).\n\nQuel type de voyage vous inspire : farniente au soleil, immersion culturelle ou nature et aventure ?"
        : "🌍 **Curated Itinerary Ideas from Safarihoo**:\n\n1. **European City Break (3–4 days)**:\n   • Rome, Lisbon, Barcelona, or Prague: quick flight + boutique hotel via Trip.com.\n\n2. **Sunshine & Culture (7 days)**:\n   • Marrakech & Agafay desert, or the Canary Islands for year-round warmth.\n\n3. **Grand Adventure (10–14 days)**:\n   • Thailand (Bangkok + southern islands) or Bali (Ubud temples + coastal beaches).\n\nWhich style suits you best: beach relaxation, cultural immersion, or wild nature?",
      followUps: isFr
        ? ["✈️ Comparer les vols pas chers", "🏨 Voir les offres d'hôtels", "Voyage pas cher au soleil"]
        : ["✈️ Compare cheap flights", "🏨 View hotel deals", "Budget sunny destinations"],
    };
  }

  // 8. BAGGAGE & CABIN RULES
  if (/(bagage|valise|kilo|cabine|soute|dimension|luggage|bag|carry[- ]on)/i.test(query)) {
    return {
      text: isFr
        ? "🧳 **Règles et astuces pour les bagages en avion** :\n\n• **Bagage cabine standard** : Généralement 55 x 40 x 20 cm (poids max. entre 8 kg et 10 kg selon la compagnie).\n• **Accessoire personnel** (sac à dos, sacoche d'ordinateur) : Doit se glisser sous le siège devant vous (gratuit sur la majorité des vols).\n• **Compagnies Low-Cost (Ryanair, EasyJet, Wizz Air)** : Le billet de base inclut souvent uniquement le petit sac personnel. Pensez à ajouter l'option 'Priorité & 2 bagages cabine' lors de la réservation.\n• **Bagage en soute** : Pèse généralement 20 kg ou 23 kg. Toujours moins cher lorsqu'il est ajouté en ligne à la réservation qu'au comptoir de l'aéroport !"
        : "🧳 **Luggage Rules & Savvy Packing Tips**:\n\n• **Standard Carry-on**: Usually 55 x 40 x 20 cm (weight limit between 8 kg and 10 kg depending on airline).\n• **Personal Item** (backpack, laptop bag): Must fit under the seat in front of you (included on almost all flights).\n• **Low-Cost Carriers (Ryanair, EasyJet, etc.)**: Basic fare only includes one personal small bag. Add 'Priority & 2 cabin bags' during booking for the best rate.\n• **Checked Baggage**: Typically 20 kg or 23 kg. Always significantly cheaper to book online in advance than at the airport check-in desk!",
      followUps: isFr
        ? ["✈️ Réserver mon vol", "Que peut-on emporter en cabine ?", "🛡️ Que faire en cas de bagage retardé ?"]
        : ["✈️ Book my flight", "What items are allowed in cabin?", "🛡️ Delayed luggage claim info"],
    };
  }

  // 9. FORMALITES, VISA & PASSEPORT
  if (/(visa|passeport|carte d'identite|formalit|papier|douane|validite|passport)/i.test(query)) {
    return {
      text: isFr
        ? "🛂 **Formalités de voyage essentielles** :\n\n• **Validité du passeport** : De nombreux pays (Thaïlande, Indonésie, Égypte, Émirats) exigent un passeport valide au moins **6 mois après votre date de retour**.\n• **Espace Schengen / Union Européenne** : Une carte nationale d'identité valide suffit pour les citoyens européens.\n• **États-Unis** : Demande ESTA obligatoire au moins 72h avant le vol.\n• **Canada** : Demande d'AVE (Autorisation de voyage électronique) requise.\n• **Assurance santé internationale** : Toujours fortement recommandée pour couvrir les frais médicaux à l'étranger."
        : "🛂 **Essential Travel Document Checklist**:\n\n• **Passport Validity**: Many destinations (Thailand, Bali, Egypt, UAE) strictly require **6 months validity beyond your planned return date**.\n• **European Union / Schengen**: National ID card is sufficient for EU citizens traveling within the zone.\n• **United States**: Valid ESTA approval required at least 72 hours before flight.\n• **Canada**: eTA (Electronic Travel Authorization) required.\n• **Travel Medical Insurance**: Strongly recommended for international coverage.",
      followUps: isFr
        ? ["✈️ Comparer les vols", "Comment vérifier mon visa ?", "Contacter le support"]
        : ["✈️ Compare flights", "How to verify visa rules?", "Contact support"],
    };
  }

  // 10. CONTACT & SUPPORT CLIENT
  if (/(contact|support|aide|telephone|mail|email|service client|joindre|probleme|question)/i.test(query)) {
    return {
      text: isFr
        ? "📬 **Service Client & Assistance Safarihoo** :\n\nNotre équipe dédiée est à votre entière disposition pour vous accompagner :\n\n• **Email officiel** : **support@safarihoo.com**\n• **Formulaire en ligne** : Accessible directement via la page 'Contact' dans notre menu.\n• **Délai de réponse** : Moins de 24 heures garanti, 7j/7.\n• **Objet** : Réservations de vols, questions d'hôtels, annulations ou assistance technique."
        : "📬 **Safarihoo Customer Care & Support**:\n\nOur dedicated support team is ready to assist you around the clock:\n\n• **Official Email**: **support@safarihoo.com**\n• **Online Contact Form**: Accessible directly via the 'Contact' page in our menu.\n• **Response Time**: Under 24 hours guaranteed, 7 days a week.\n• **Topics**: Flight inquiries, Trip.com hotel questions, cancellations, or website assistance.",
      action: {
        type: 'nav',
        target: 'Contact',
        label: isFr ? "Ouvrir la page Contact" : "Open Contact Page",
      },
      followUps: isFr
        ? ["Envoyer un message à support@safarihoo.com", "✈️ Chercher un vol", "🛡️ Déposer une réclamation AirHelp"]
        : ["Send message to support@safarihoo.com", "✈️ Search flights", "🛡️ Submit AirHelp claim"],
    };
  }

  // 11. DEFAULT CONTEXTUAL FALLBACK
  return {
    text: isFr
      ? `Je suis ravi de vous aider concernant votre recherche sur "${userQuery}".\n\nSur Safarihoo, vous profitez de services premium pour tous vos déplacements :\n\n1. **✈️ Vols au meilleur prix** : Comparateur transparent couvrant plus de 700 compagnies aériennes.\n2. **🏨 Hôtels avec Trip.com** : Tarifs négociés et annulation flexible dans le monde entier.\n3. **🚗 Location de voitures** : Les grands loueurs (Sixt, Avis, Hertz, Europcar) au meilleur tarif.\n4. **🛡️ Partenaire AirHelp** : Jusqu'à 600 € d'indemnisation si votre vol a eu du retard ou a été annulé.\n\nSur quel sujet puis-je vous apporter des détails précis ?`
      : `I am delighted to assist you with your query regarding "${userQuery}".\n\nOn Safarihoo, you benefit from complete travel booking solutions:\n\n1. **✈️ Cheapest Flights**: Real-time comparison across 700+ global airlines.\n2. **🏨 Hotels with Trip.com**: Negotiated rates and flexible cancellation worldwide.\n3. **🚗 Car Rentals**: Leading providers (Sixt, Avis, Hertz, Europcar) at competitive rates.\n4. **🛡️ AirHelp Partner**: Up to €600 compensation for delayed or canceled flights.\n\nWhich topic would you like more details on?`,
    followUps: isFr
      ? ["✈️ Comment trouver un vol pas cher ?", "🏨 Réserver un hôtel Trip.com", "🛡️ Indemnisation vol retardé AirHelp", "📬 Contacter support@safarihoo.com"]
      : ["✈️ How to find cheap flights?", "🏨 Book hotels with Trip.com", "🛡️ AirHelp flight delay compensation", "📬 Contact support@safarihoo.com"],
  };
}
