import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown, Check } from 'lucide-react';
import { NavItem } from '../types';
import { SafarihooLogo } from './SafarihooLogo';
import { useLanguage, Language } from '../context/LanguageContext';

interface HeaderProps {
  activeNav: NavItem;
  onSelectNav: (item: NavItem) => void;
  onOpenAirHelp?: () => void;
  onOpenContact?: () => void;
}

const LANGUAGES: { code: Language; name: string }[] = [
  { code: 'EN', name: 'English' },
  { code: 'FR', name: 'Français' },
];

export const Header: React.FC<HeaderProps> = ({
  activeNav,
  onSelectNav,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const langMenuRef = useRef<HTMLDivElement>(null);

  const navItemsConfig: { key: NavItem; labelKey: string }[] = [
    { key: 'Flights', labelKey: 'nav.flights' },
    { key: 'Hotels', labelKey: 'nav.hotels' },
    { key: 'Cars', labelKey: 'nav.cars' },
    { key: 'AirHelp', labelKey: 'nav.airhelp' },
    { key: 'Contact', labelKey: 'nav.contact' },
  ];

  const handleNavClick = (item: NavItem) => {
    onSelectNav(item);
    setMobileMenuOpen(false);
  };

  // Close language dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header id="main-header" className="w-full pt-6 pb-4 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto flex items-center justify-between z-30 relative">
      {/* Brand / Logo */}
      <div 
        id="safarihoo-logo"
        onClick={() => onSelectNav('Flights')}
        className="flex items-center cursor-pointer group select-none py-1"
        title="Safarihoo"
      >
        <SafarihooLogo className="h-9 sm:h-11 w-auto" />
      </div>

      {/* Desktop Navigation Links */}
      <nav id="desktop-nav" className="hidden md:flex items-center space-x-7 lg:space-x-9 text-sm font-medium">
        {navItemsConfig.map(({ key, labelKey }) => {
          const isActive = activeNav === key;
          const displayLabel = t(labelKey);
          return (
            <button
              key={key}
              id={`nav-link-${key.toLowerCase()}`}
              onClick={() => handleNavClick(key)}
              className="relative py-1 text-white hover:text-white transition-all focus:outline-none flex items-center"
            >
              <span className={isActive ? 'font-semibold text-white' : 'font-normal text-white/90 hover:text-white'}>
                {displayLabel}
              </span>
              
              {/* Active Indicator Underline */}
              {isActive && (
                <span 
                  id="active-nav-indicator"
                  className="absolute -bottom-1.5 left-0 right-0 h-[2.5px] bg-white rounded-full transition-all"
                />
              )}
            </button>
          );
        })}

        {/* 1-Click Fast Language Toggle (FR | EN) */}
        <div 
          id="language-switcher-pill"
          className="flex items-center p-0.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-sm"
        >
          <button
            type="button"
            onClick={() => setLanguage('FR')}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              language === 'FR'
                ? 'bg-white text-zinc-950 shadow-sm scale-100'
                : 'text-white/70 hover:text-white'
            }`}
            title="Passer en Français"
          >
            FR
          </button>
          <button
            type="button"
            onClick={() => setLanguage('EN')}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              language === 'EN'
                ? 'bg-white text-zinc-950 shadow-sm scale-100'
                : 'text-white/70 hover:text-white'
            }`}
            title="Switch to English"
          >
            EN
          </button>
        </div>
      </nav>

      {/* Mobile Header Controls */}
      <div className="md:hidden flex items-center gap-2.5">
        {/* Mobile 1-Click Toggle */}
        <div className="flex items-center p-0.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setLanguage('FR')}
            className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              language === 'FR'
                ? 'bg-white text-zinc-950 shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            FR
          </button>
          <button
            type="button"
            onClick={() => setLanguage('EN')}
            className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              language === 'EN'
                ? 'bg-white text-zinc-950 shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            EN
          </button>
        </div>

        <button
          id="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-white hover:text-white/80 rounded-lg focus:outline-none"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div 
          id="mobile-nav-dropdown"
          className="absolute top-full left-4 right-4 mt-2 bg-zinc-950/95 border border-white/15 rounded-2xl p-5 shadow-2xl z-50 md:hidden backdrop-blur-2xl flex flex-col space-y-3"
        >
          {navItemsConfig.map(({ key, labelKey }) => {
            const isActive = activeNav === key;
            const displayLabel = t(labelKey);
            return (
              <button
                key={key}
                onClick={() => handleNavClick(key)}
                className={`flex items-center justify-between text-left py-2.5 px-3 rounded-xl transition-colors ${
                  isActive ? 'bg-white text-zinc-950 font-bold shadow-sm' : 'text-white/85 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span>{displayLabel}</span>
              </button>
            );
          })}

          {/* Language selector in mobile menu */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between px-2">
            <span className="text-xs text-white/70 font-medium">
              {t('header.lang')}:
            </span>
            <div className="flex items-center gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  className={`px-3 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                    language === lang.code ? 'bg-white text-zinc-950 font-bold shadow-sm' : 'text-white/80 hover:text-white bg-white/10'
                  }`}
                >
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

