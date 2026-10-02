import React, { useEffect } from 'react';
import { X, ShieldAlert, CheckCircle2, DollarSign, Clock, ArrowRight } from 'lucide-react';

interface AirHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AirHelpModal: React.FC<AirHelpModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        id="airhelp-service-modal"
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

        <div className="flex items-center gap-3 mb-4 pr-10">
          <div className="w-11 h-11 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 flex-shrink-0">
            <ShieldAlert className="w-6 h-6 text-blue-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg sm:text-xl font-bold text-white">Safarihoo AirHelp</h3>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded">Included Service</span>
            </div>
            <p className="text-xs text-white/70">Flight delay & cancellation passenger compensation protection</p>
          </div>
        </div>

        <div className="space-y-2.5 my-5">
          <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/[0.05] border border-white/10 flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Up to $700 Compensation</h4>
              <p className="text-[11px] sm:text-xs text-white/80">Get compensated automatically if your flight is delayed over 3 hours or cancelled.</p>
            </div>
          </div>

          <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/[0.05] border border-white/10 flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Instant Lounge Access on Delays</h4>
              <p className="text-[11px] sm:text-xs text-white/80">Complimentary VIP lounge pass activated automatically during airport delays.</p>
            </div>
          </div>

          <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/[0.05] border border-white/10 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Zero Hassle Claims</h4>
              <p className="text-[11px] sm:text-xs text-white/80">Our legal team handles airline negotiations and deposits payouts directly into your bank.</p>
            </div>
          </div>
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
            onClick={onClose}
            className="flex-1 py-3 rounded-xl sm:rounded-full bg-[#1b64f2] hover:bg-[#1654cc] text-white font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Check My Flight Eligibility</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
