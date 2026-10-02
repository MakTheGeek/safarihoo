import React from 'react';
import { Facebook, Youtube, ExternalLink } from 'lucide-react';
import { SafarihooLogo } from './SafarihooLogo';
import { NavItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onOpenAirHelp?: () => void;
  onOpenContact?: () => void;
  onSelectService?: (service: string) => void;
  onSelectPage?: (page: NavItem) => void;
  onOpenNewsletter?: () => void;
  onOpenCookies?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAirHelp,
  onOpenContact,
  onSelectService,
  onSelectPage,
  onOpenNewsletter,
  onOpenCookies,
}) => {
  const { t } = useLanguage();

  return (
    <footer id="main-footer" className="w-full bg-[#050505] text-white pt-16 pb-12 relative overflow-hidden select-none border-t border-white/10 mt-auto">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top 5-Column Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 pb-14">
          
          {/* Column 1: Company */}
          <div className="flex flex-col space-y-3.5">
            <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">{t('footer.company')}</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-white/70">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectPage?.('About')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {t('footer.about')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectPage?.('Careers')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {t('footer.careers')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectPage?.('FAQs')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {t('footer.faqs')}
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => onSelectPage?.('Contact')} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {t('footer.contact')}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Services (Replaces Products) */}
          <div className="flex flex-col space-y-3.5">
            <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">{t('footer.services')}</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-white/70">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectService?.('Flights')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {t('footer.flights')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectService?.('Hotels')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {t('footer.hotels')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectService?.('Cars')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {t('footer.cars')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectService?.('AirHelp')}
                  className="hover:text-white transition-colors text-left cursor-pointer font-medium text-white/90"
                >
                  {t('footer.airhelp')}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="flex flex-col space-y-3.5">
            <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">{t('footer.resources')}</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-white/70">
              <li>
                <a 
                  href="https://www.safarihoo.blog" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-colors inline-flex items-center gap-1 group"
                >
                  <span>{t('footer.blog')}</span>
                  <ExternalLink className="w-3 h-3 text-white/40 group-hover:text-white transition-colors" />
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenNewsletter}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {t('footer.newsletter')}
                </button>
              </li>
              <li>
                <a 
                  href="https://www.safarihoo.tv" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-colors inline-flex items-center gap-1 group"
                >
                  <span>{t('footer.media')}</span>
                  <ExternalLink className="w-3 h-3 text-white/40 group-hover:text-white transition-colors" />
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectPage?.('Whitepaper')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {t('footer.whitepaper')}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="flex flex-col space-y-3.5">
            <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">{t('footer.legal')}</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-white/70">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectPage?.('Privacy')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {t('footer.privacy')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectPage?.('Security')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {t('footer.security')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectPage?.('Terms')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {t('footer.terms')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectPage?.('Acceptance')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {t('footer.acceptance')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenCookies}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {t('footer.cookies')}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Contact */}
          <div className="flex flex-col space-y-3.5 col-span-2 md:col-span-1">
            <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">{t('footer.contact')}</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-white/70">
              <li>
                <a href="mailto:support@safarihoo.com" className="hover:text-white transition-colors break-all">
                  support@safarihoo.com
                </a>
              </li>
              <li>
                <a href="tel:+242056756629" className="hover:text-white transition-colors">
                  +242 05 675 6629
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Middle Separator Bar */}
        <div className="w-full h-px bg-white/10 mb-8" />

        {/* Copyright and Social Icons Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SafarihooLogo className="h-7 w-auto opacity-90" />
            <span className="text-xs sm:text-sm text-white/70 font-normal">
              &copy; 2026 Safarihoo. {t('footer.rights')}
            </span>
          </div>

          {/* Circular Social Icons */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.facebook.com/share/15hPHLinfE/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#1877F2]/30 hover:text-[#1877F2] flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
              aria-label="Facebook"
              title="Safarihoo on Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://x.com/Safarihoo"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/30 flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
              aria-label="X (formerly Twitter)"
              title="Safarihoo on X"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://www.youtube.com/@Safarihoo?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#FF0000]/30 hover:text-[#FF0000] flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
              aria-label="YouTube"
              title="Safarihoo on YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a
              href="https://www.pinterest.com/safarihoo/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#E60023]/30 hover:text-[#E60023] flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
              aria-label="Pinterest"
              title="Safarihoo on Pinterest"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.373-.053.224-.174.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.546.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
