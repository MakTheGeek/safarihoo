import React, { useState } from 'react';
import { Briefcase, MapPin, DollarSign, Clock, Users, Heart, Sparkles, Send, CheckCircle2, ArrowUpRight, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const CareersPage: React.FC = () => {
  const { language } = useLanguage();
  const isFr = language === 'FR';

  const defaultRole = isFr ? 'Ingénieur Full-Stack Senior (React / Node)' : 'Senior Full-Stack Engineer (React / Node / APIs)';
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [candidateRole, setCandidateRole] = useState(defaultRole);
  const [candidateMessage, setCandidateMessage] = useState('');

  const t = {
    badge: isFr ? "Rejoindre l'équipe Safarihoo" : 'Join the Safarihoo Team',
    title: isFr ? "Bâtissez l'avenir des technologies de voyage mondiales" : 'Build the Future of Global Travel Technology',
    subtitle: isFr
      ? "Nous sommes une équipe agile, axée sur le télétravail, passionnée par l'art de réinventer la recherche, la réservation et l'exploration de la planète pour des millions de voyageurs. Rejoignez notre mission !"
      : 'We are a fast-moving, remote-first team passionate about redefining how millions of travelers search, book, and explore the planet. Join our mission!',
    perk1Title: isFr ? 'Liberté 100% en Télétravail' : '100% Remote Freedom',
    perk1Desc: isFr
      ? 'Travaillez depuis n’importe où avec des horaires flexibles et une culture asynchrone moderne.'
      : 'Work from anywhere across time zones with flexible hours and modern asynchronous collaboration.',
    perk2Title: isFr ? 'Rémunération Compétitive' : 'Competitive Compensation',
    perk2Desc: isFr
      ? 'Grilles salariales mondiales attractives, primes de performance et participation au capital.'
      : 'Attractive global benchmarks, equity possibilities, and performance bonuses.',
    perk3Title: isFr ? 'Budget Voyage & Avantages' : 'Travel Stipend & Perks',
    perk3Desc: isFr
      ? 'Budget annuel d’exploration, réductions exclusives sur les hôtels partenaires et crédits bien-être.'
      : 'Annual travel exploration budget, discount hotel partnerships, and wellness credits.',
    perk4Title: isFr ? 'Séminaires Annuels' : 'Annual Team Retreats',
    perk4Desc: isFr
      ? 'Rencontres de l’équipe dans des destinations exceptionnelles pour collaborer et voyager ensemble.'
      : 'Global summits in extraordinary destinations to brainstorm, bond, and travel together.',
    openingsTitle: isFr ? 'Postes Ouverts' : 'Current Openings',
    openingsDesc: isFr
      ? 'Découvrez nos opportunités actuelles en ingénierie, design, partenariats et support.'
      : 'Explore our current opportunities across engineering, design, and operations.',
    activePositions: isFr ? 'postes actifs' : 'Active Positions',
    applyBtn: isFr ? 'Postuler' : 'Apply Now',
    formTitle: isFr ? 'Envoyez votre candidature' : 'Send Your Application',
    formDesc: isFr
      ? 'Vous postulez pour un poste ouvert ou souhaitez envoyer une candidature spontanée ? Nous serions ravis d’échanger avec vous.'
      : 'Applying for a listed role or want to send a spontaneous application? We would love to hear from you.',
    nameLabel: isFr ? 'Nom complet' : 'Full Name',
    namePlaceholder: isFr ? 'Sophie Martin' : 'Jane Doe',
    emailLabel: isFr ? 'Adresse e-mail' : 'Email Address',
    emailPlaceholder: isFr ? 'sophie@exemple.com' : 'jane@example.com',
    roleLabel: isFr ? 'Poste / Rôle visé' : 'Position / Role',
    urlLabel: isFr ? 'Portfolio / LinkedIn / GitHub (Optionnel)' : 'Portfolio / LinkedIn / GitHub URL',
    msgLabel: isFr ? 'Présentation / Message' : 'Introduction / Note',
    msgPlaceholder: isFr
      ? 'Parlez-nous de vous et expliquez pourquoi Safarihoo vous inspire...'
      : "Tell us about yourself and why you're excited about Safarihoo...",
    submitBtn: isFr ? 'Soumettre ma candidature' : 'Submit Application',
    successTitle: isFr ? 'Candidature bien reçue !' : 'Application Received!',
    successDesc: (name: string, role: string, mail: string) =>
      isFr
        ? `Merci, ${name} ! Notre équipe recrutement a bien enregistré votre candidature pour le poste de ${role} et contactera ${mail} dans les meilleurs délais.`
        : `Thank you, ${name}! Our talent team has received your application for ${role} and will reach out to ${mail} shortly.`,
    resetBtn: isFr ? 'Soumettre un autre profil' : 'Submit Another Profile',
  };

  const jobOpenings = [
    {
      id: 'eng-fullstack',
      title: isFr ? 'Ingénieur Full-Stack Senior (React / Node / APIs)' : 'Senior Full-Stack Engineer (React / Node / APIs)',
      department: isFr ? 'Ingénierie' : 'Engineering',
      location: isFr ? 'Télétravail / International' : 'Remote / Global',
      type: isFr ? 'Temps plein' : 'Full-time',
      salary: '$95,000 - $130,000 / an',
      description: isFr
        ? 'Développez et faites évoluer notre moteur de recherche ultra-rapide, intégrez les API mondiales GDS/NDC et optimisez le cache temps réel.'
        : 'Build and scale our ultra-fast travel comparison engine, integrate global GDS/OTA APIs, and optimize sub-second search caching.',
      tags: ['React', 'TypeScript', 'Node.js', 'Vite', 'GraphQL / REST'],
    },
    {
      id: 'prod-designer',
      title: isFr ? 'Designer Produit Senior (UI / UX)' : 'Senior Product Designer (UI / UX)',
      department: isFr ? 'Design' : 'Design',
      location: isFr ? 'Télétravail / Hybride' : 'Remote / Hybrid',
      type: isFr ? 'Temps plein' : 'Full-time',
      salary: '$80,000 - $110,000 / an',
      description: isFr
        ? 'Concevez des parcours de réservation mobiles et web fluides, des systèmes typographiques raffinés et des interfaces engageantes.'
        : 'Design world-class, frictionless mobile and web booking flows, refined typography systems, and high-conversion travel interfaces.',
      tags: ['Figma', 'Design Systems', 'Mobile-First', 'Prototyping'],
    },
    {
      id: 'growth-manager',
      title: isFr ? 'Responsable Partenariats & Affiliation Voyage' : 'Global Travel Partnerships & Affiliate Manager',
      department: isFr ? 'Croissance & Affaires' : 'Business & Growth',
      location: isFr ? 'Télétravail' : 'Remote',
      type: isFr ? 'Temps plein' : 'Full-time',
      salary: '$70,000 - $95,000 / an + Primes',
      description: isFr
        ? 'Développez les relations avec les compagnies aériennes, chaînes hôtelières et agrégateurs technologiques internationaux.'
        : 'Expand relationships with leading international airlines, hotel chains, car rental agencies, and travel tech aggregators.',
      tags: ['Travel Tech', 'Partnerships', 'Affiliates', 'GDS'],
    },
    {
      id: 'customer-care',
      title: isFr ? 'Spécialiste Expérience Voyageur & Indemnisation AirHelp' : 'Traveler Experience & Passenger Claims Specialist',
      department: isFr ? 'Support & Opérations' : 'Support & Operations',
      location: isFr ? 'Télétravail (Rotation 24/7)' : 'Remote (24/7 Shift Rotation)',
      type: isFr ? 'Temps plein' : 'Full-time',
      salary: '$45,000 - $65,000 / an',
      description: isFr
        ? 'Accompagnez les voyageurs du monde entier sur leurs réservations, perturbations de vol et dossiers d’indemnisation AirHelp.'
        : 'Assist global travelers with booking queries, flight disruption guidance, and AirHelp compensation eligibility validations.',
      tags: ['Customer Support', 'AirHelp', 'Multilingual', 'Zendesk'],
    },
  ];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setApplicationSubmitted(true);
  };

  return (
    <div id="careers-page-view" className="w-full flex-grow py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Careers Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-[#498bf7] text-xs font-semibold tracking-wider uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.badge}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
          {t.title}
        </h1>
        <p className="text-base sm:text-lg text-white/70 mt-4 leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* Perks & Benefits Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">{t.perk1Title}</h3>
          <p className="text-xs text-white/60 leading-relaxed">
            {t.perk1Desc}
          </p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
            <DollarSign className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">{t.perk2Title}</h3>
          <p className="text-xs text-white/60 leading-relaxed">
            {t.perk2Desc}
          </p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">{t.perk3Title}</h3>
          <p className="text-xs text-white/60 leading-relaxed">
            {t.perk3Desc}
          </p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">{t.perk4Title}</h3>
          <p className="text-xs text-white/60 leading-relaxed">
            {t.perk4Desc}
          </p>
        </div>
      </div>

      {/* Open Positions List */}
      <div className="mb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{t.openingsTitle}</h2>
            <p className="text-sm text-white/60 mt-1">{t.openingsDesc}</p>
          </div>
          <span className="px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-white/90 self-start sm:self-auto">
            {jobOpenings.length} {t.activePositions}
          </span>
        </div>

        <div className="space-y-4">
          {jobOpenings.map((job) => (
            <div
              key={job.id}
              className="bg-zinc-950/80 border border-white/10 hover:border-white/25 rounded-2xl p-6 transition-all duration-300 shadow-lg group flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#1b64f2]/20 text-[#498bf7] text-[11px] font-semibold">
                    {job.department}
                  </span>
                  <span className="text-xs text-white/40">•</span>
                  <span className="text-xs text-white/60 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-white/40" /> {job.location}
                  </span>
                  <span className="text-xs text-white/40">•</span>
                  <span className="text-xs text-white/60 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-white/40" /> {job.type}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#498bf7] transition-colors">
                  {job.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                  {job.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-white/[0.06] text-white/60 text-[10px] font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 flex-shrink-0">
                <span className="text-xs sm:text-sm font-semibold text-emerald-400">
                  {job.salary}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCandidateRole(job.title);
                    setSelectedJob(job.id);
                    const formElement = document.getElementById('application-form-section');
                    if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-[#1b64f2] text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer group-hover:bg-[#1b64f2]"
                >
                  <span>{t.applyBtn}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Application / Spontaneous Form */}
      <div id="application-form-section" className="bg-zinc-950/90 border border-white/15 rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#1b64f2]/20 text-[#498bf7] flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">{t.formTitle}</h2>
          <p className="text-xs sm:text-sm text-white/60 mt-2">
            {t.formDesc}
          </p>
        </div>

        {applicationSubmitted ? (
          <div className="p-8 text-center space-y-4 bg-white/[0.04] rounded-2xl border border-white/10 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">{t.successTitle}</h3>
            <p className="text-xs sm:text-sm text-white/70">
              {t.successDesc(candidateName, candidateRole, candidateEmail)}
            </p>
            <button
              type="button"
              onClick={() => {
                setApplicationSubmitted(false);
                setCandidateName('');
                setCandidateEmail('');
                setCandidateMessage('');
              }}
              className="mt-4 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors cursor-pointer"
            >
              {t.resetBtn}
            </button>
          </div>
        ) : (
          <form onSubmit={handleApply} className="space-y-4 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1.5">{t.nameLabel}</label>
                <input
                  type="text"
                  required
                  placeholder={t.namePlaceholder}
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#1b64f2] transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1.5">{t.emailLabel}</label>
                <input
                  type="email"
                  required
                  placeholder={t.emailPlaceholder}
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#1b64f2] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5">{t.roleLabel}</label>
              <input
                type="text"
                required
                value={candidateRole}
                onChange={(e) => setCandidateRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#1b64f2] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5">{t.urlLabel}</label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/..."
                className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#1b64f2] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5">{t.msgLabel}</label>
              <textarea
                rows={3}
                placeholder={t.msgPlaceholder}
                value={candidateMessage}
                onChange={(e) => setCandidateMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#1b64f2] transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-3 py-3.5 rounded-full bg-[#1b64f2] hover:bg-[#1654cc] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.99]"
            >
              <span>{t.submitBtn}</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
