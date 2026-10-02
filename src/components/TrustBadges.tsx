import React from 'react';
import { BadgePercent, Headphones, ShieldCheck, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const TrustBadges: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      id: 'best-price',
      icon: <BadgePercent className="w-5 h-5 text-white flex-shrink-0" strokeWidth={1.75} />,
      title: t('trust.price.title'),
      desc: t('trust.price.desc'),
    },
    {
      id: 'support-24-7',
      icon: <Headphones className="w-5 h-5 text-white flex-shrink-0" strokeWidth={1.75} />,
      title: t('trust.support.title'),
      desc: t('trust.support.desc'),
    },
    {
      id: 'secure-booking',
      icon: <ShieldCheck className="w-5 h-5 text-white flex-shrink-0" strokeWidth={1.75} />,
      title: t('trust.secure.title'),
      desc: t('trust.secure.desc'),
    },
    {
      id: 'trusted-millions',
      icon: <Star className="w-5 h-5 text-white flex-shrink-0" strokeWidth={1.75} />,
      title: t('trust.millions.title'),
      desc: t('trust.millions.desc'),
    },
  ];

  return (
    <div 
      id="trust-badges-section"
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-12 select-none"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-6 border-t border-white/10 justify-items-center sm:justify-items-start">
        {features.map((feature) => (
          <div
            key={feature.id}
            id={`trust-feature-${feature.id}`}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/15 flex items-center justify-center group-hover:bg-white/[0.12] transition-colors flex-shrink-0">
              {feature.icon}
            </div>
            <div className="flex flex-col text-left">
              <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-tight whitespace-nowrap">
                {feature.title}
              </h4>
              <p className="text-[11px] text-white/70 font-normal mt-0.5 leading-tight">
                {feature.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

