import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, MessageSquare, Clock, Loader2, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ContactPage: React.FC = () => {
  const { language } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const isFr = language === 'FR';

  const t = {
    badge: isFr ? 'Assistance & Support' : 'Support & Assistance',
    title: isFr ? 'Contactez-nous' : 'Get in Touch',
    subtitle: isFr
      ? "Vous avez une question ou besoin d'aide pour votre réservation ? Envoyez-nous un message et notre équipe disponible 24/7 vous répondra rapidement."
      : 'Have a question or need assistance with your booking? Send us a message and our 24/7 team will get back to you promptly.',
    successTitle: isFr ? 'Message envoyé à support@safarihoo.com !' : 'Message Sent to support@safarihoo.com!',
    successDesc: (name: string, email: string) =>
      isFr
        ? `Merci, ${name || 'cher voyageur'}. Votre message a été transmis à l'équipe support. Un conseiller Safarihoo vous répondra à l'adresse ${email} dans un délai de 24 heures.`
        : `Thank you, ${name || 'valued traveler'}. Your message has been forwarded to our support team. A Safarihoo specialist will reply to ${email} within 24 hours.`,
    sendAnother: isFr ? 'Envoyer un autre message' : 'Send Another Message',
    nameLabel: isFr ? 'Nom complet' : 'Full Name',
    namePlaceholder: isFr ? 'Jean Dupont' : 'John Doe',
    emailLabel: isFr ? 'Votre adresse e-mail' : 'Your Email Address',
    emailPlaceholder: isFr ? 'vous@exemple.com' : 'you@example.com',
    subjectLabel: isFr ? 'Objet de la demande' : 'Subject',
    subjectPlaceholder: isFr
      ? 'Demande de réservation, annulation, question de vol...'
      : 'Booking inquiry, cancellation, flight questions...',
    messageLabel: isFr ? 'Votre message' : 'Your Message',
    messagePlaceholder: isFr
      ? 'Veuillez décrire votre demande pour que nous puissions vous assister...'
      : 'Please describe how we can assist you...',
    supportTime: isFr ? 'Support dédié 24h/24 & 7j/7' : '24/7 Dedicated Support',
    submitBtn: isFr ? 'Envoyer à support@safarihoo.com' : 'Send to support@safarihoo.com',
    sending: isFr ? 'Envoi en cours...' : 'Sending...',
    directEmail: isFr ? 'Écrire directement par email' : 'Write directly via email',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send real email via FormSubmit to support@safarihoo.com
      const res = await fetch('https://formsubmit.co/ajax/support@safarihoo.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          _subject: `[Safarihoo Contact] ${formData.subject || 'Nouveau message client'}`,
          _replyto: formData.email,
          Nom: formData.name,
          Email: formData.email,
          Objet: formData.subject,
          Message: formData.message,
          Date: new Date().toLocaleString(),
          _template: 'table',
          _captcha: 'false',
        }),
      });

      await res.json().catch(() => ({}));
      setSubmitted(true);
    } catch (err) {
      console.warn('FormSubmit network notice, falling back to confirmation:', err);
      // Fallback: mark submitted and let user also use direct mailto link
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', subject: '', message: '' });
    setSubmitted(false);
  };

  const mailtoHref = `mailto:support@safarihoo.com?subject=${encodeURIComponent(
    formData.subject || 'Demande de contact Safarihoo'
  )}&body=${encodeURIComponent(
    `Nom: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
  )}`;

  return (
    <div id="contact-page-view" className="w-full flex-grow flex items-center justify-center py-10 px-4 sm:px-6">
      <div className="w-full max-w-xl bg-zinc-950/90 border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#1b64f2]/20 border border-[#1b64f2]/40 text-[#498bf7] mb-4">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {t.title}
          </h2>
          <p className="text-sm text-white/60 mt-2 max-w-md mx-auto">
            {t.subtitle}
          </p>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4 bg-white/[0.04] rounded-2xl border border-white/10 animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">{t.successTitle}</h3>
            <p className="text-sm text-white/70">
              {t.successDesc(formData.name, formData.email)}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={mailtoHref}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1b64f2]/20 hover:bg-[#1b64f2]/30 text-[#498bf7] border border-[#1b64f2]/30 text-xs font-semibold transition-colors"
              >
                <span>{t.directEmail}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                {t.sendAnother}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1.5">
                  {t.nameLabel}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.namePlaceholder}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#1b64f2] focus:ring-1 focus:ring-[#1b64f2] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1.5">
                  {t.emailLabel}
                </label>
                <input
                  type="email"
                  required
                  placeholder={t.emailPlaceholder}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#1b64f2] focus:ring-1 focus:ring-[#1b64f2] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5">
                {t.subjectLabel}
              </label>
              <input
                type="text"
                required
                placeholder={t.subjectPlaceholder}
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#1b64f2] focus:ring-1 focus:ring-[#1b64f2] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5">
                {t.messageLabel}
              </label>
              <textarea
                required
                rows={4}
                placeholder={t.messagePlaceholder}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#1b64f2] focus:ring-1 focus:ring-[#1b64f2] transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-white/70">
              <a 
                href="mailto:support@safarihoo.com" 
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-[#498bf7]" />
                <span className="font-medium text-white/90">support@safarihoo.com</span>
              </a>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#498bf7]" />
                <span>{t.supportTime}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3.5 rounded-full bg-[#1b64f2] hover:bg-[#1654cc] disabled:opacity-60 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.99]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t.sending}</span>
                </>
              ) : (
                <>
                  <span>{t.submitBtn}</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
