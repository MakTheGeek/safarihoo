import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, Send, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isFr = language === 'FR';

  const t = {
    title: isFr ? 'Contacter Safarihoo' : 'Contact Safarihoo',
    subtitle: isFr
      ? 'Notre service conciergerie 24/7 est à votre disposition dans le monde entier.'
      : 'Our 24/7 travel concierge team is ready to assist you worldwide.',
    msgReceived: isFr ? 'Message Reçu !' : 'Message Received!',
    msgReceivedDesc: (mail: string) =>
      isFr
        ? `Un conseiller voyage Safarihoo répondra à ${mail || 'votre e-mail'} sous peu.`
        : `A Safarihoo travel specialist will respond to ${mail || 'your email'} shortly.`,
    emailLabel: isFr ? 'Adresse e-mail' : 'Email Address',
    emailPlaceholder: isFr ? 'vous@exemple.com' : 'you@example.com',
    messageLabel: isFr ? 'Message / Demandes' : 'Message / Inquiries',
    messagePlaceholder: isFr
      ? 'Comment pouvons-nous vous aider pour votre voyage ou réservation ?'
      : 'How can we assist with your journey or booking?',
    sendBtn: isFr ? 'Envoyer le message' : 'Send Message',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        id="contact-support-modal"
        className="w-full max-w-lg max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-3rem)] bg-zinc-950 border border-white/20 rounded-2xl sm:rounded-3xl p-5 sm:p-7 text-white relative shadow-2xl overflow-y-auto overscroll-contain my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-4 right-4 w-9 h-9 text-white/70 hover:text-white rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5 pr-10">
          <h3 className="text-xl sm:text-2xl font-bold text-white">{t.title}</h3>
          <p className="text-xs text-white/70 mt-1">{t.subtitle}</p>
        </div>

        {submitted ? (
          <div className="p-6 text-center space-y-3 bg-white/[0.05] rounded-2xl border border-white/10 my-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">{t.msgReceived}</h4>
            <p className="text-xs text-white/80">{t.msgReceivedDesc(email)}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">{t.emailLabel}</label>
              <input
                type="email"
                required
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.07] border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/50"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">{t.messageLabel}</label>
              <textarea
                required
                rows={3}
                placeholder={t.messagePlaceholder}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.07] border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/50 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-white/70 py-1">
              <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-white/60" /> +1 (800) SAFARI-HOO</div>
              <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-white/60" /> support@safarihoo.com</div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="sm:hidden w-full py-2.5 rounded-xl bg-white/10 text-white/80 text-xs font-semibold"
              >
                Fermer
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl sm:rounded-full bg-[#1b64f2] hover:bg-[#1654cc] text-white font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span>{t.sendBtn}</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
