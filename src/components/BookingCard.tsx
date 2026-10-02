import React from 'react';
import { TravelPayoutsSearchWidget } from './TravelPayoutsSearchWidget';
import { useLanguage } from '../context/LanguageContext';

export const BookingCard: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div 
      id="main-booking-widget"
      className="w-full max-w-5xl mx-auto px-3 sm:px-6 relative z-20 select-none"
    >
      {/* Travelpayouts Injected Search Widget standalone, cleanly re-initialized on language change */}
      <TravelPayoutsSearchWidget key={language} />
    </div>
  );
};
