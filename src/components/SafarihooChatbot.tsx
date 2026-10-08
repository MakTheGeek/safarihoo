import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  RotateCcw, 
  Sparkles, 
  Plane, 
  Bot, 
  User,
  ArrowRight,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { NavItem } from '../types';
import { getSafarihooResponse, ChatResponse } from '../services/safarihooKnowledge';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  action?: ChatResponse['action'];
  followUps?: string[];
}

interface SafarihooChatbotProps {
  onNavigate?: (item: NavItem) => void;
  onStartJourney?: () => void;
}

export const SafarihooChatbot: React.FC<SafarihooChatbotProps> = ({
  onNavigate,
  onStartJourney,
}) => {
  const { language } = useLanguage();
  const isFr = language === 'FR';

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialGreeting = isFr
    ? "Bonjour et bienvenue sur Safarihoo ! ✈️ Je suis l'Assistant Safarihoo, votre concierge voyage personnel.\n\nJe suis à votre service 24/7 pour dénicher les meilleurs billets d'avion, réserver des hôtels avec Trip.com, louer un véhicule ou réclamer jusqu'à 600 € d'indemnisation avec AirHelp.\n\nComment puis-je vous aider aujourd'hui ?"
    : "Hello and welcome to Safarihoo! ✈️ I am the Safarihoo Assistant, your personal travel concierge.\n\nI am available 24/7 to help you discover the lowest flight fares, book luxury hotels with Trip.com, rent vehicles, or claim up to €600 compensation with AirHelp.\n\nHow can I assist you today?";

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: initialGreeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          followUps: isFr
            ? ["✈️ Comment trouver des vols pas chers ?", "🏨 Hôtels avec Trip.com", "🛡️ Indemnisation AirHelp jusqu'à 600€", "🌍 Idées de voyage"]
            : ["✈️ How to find cheap flights?", "🏨 Hotels with Trip.com", "🛡️ AirHelp up to €600 compensation", "🌍 Travel ideas"],
        },
      ]);
    }
  }, [isFr]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  const quickPrompts = isFr
    ? [
        { label: '✈️ Vols pas chers', text: 'Comment trouver les vols les moins chers sur Safarihoo ?' },
        { label: '🏨 Hôtels Trip.com', text: 'Comment réserver un hôtel au meilleur prix ?' },
        { label: '🛡️ Indemnisation AirHelp', text: 'Mon vol a été retardé ou annulé, comment obtenir jusqu’à 600 € ?' },
        { label: '🌍 Idée d’itinéraire', text: 'Peux-tu me proposer une idée de voyage pour 1 semaine ?' },
      ]
    : [
        { label: '✈️ Cheap Flights', text: 'How do I find the cheapest flights on Safarihoo?' },
        { label: '🏨 Trip.com Hotels', text: 'How do I book hotels at the best guaranteed rates?' },
        { label: '🛡️ AirHelp Claim', text: 'My flight was delayed or canceled, how can I get up to €600 compensation?' },
        { label: '🌍 Travel Itinerary', text: 'Can you recommend a 1-week travel itinerary?' },
      ];

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    // Natural responsive delay (350ms - 550ms) to give authentic concierge feel
    const responseData = getSafarihooResponse(text, isFr ? 'FR' : 'EN');

    setTimeout(() => {
      const assistantMessage: Message = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: responseData.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: responseData.action,
        followUps: responseData.followUps,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 450);
  };

  const handleActionClick = (action: NonNullable<ChatResponse['action']>) => {
    if (action.type === 'nav' && onNavigate) {
      onNavigate(action.target as NavItem);
    } else if (action.type === 'scroll') {
      if (onStartJourney) {
        onStartJourney();
      } else {
        const el = document.getElementById(action.target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (action.type === 'link') {
      window.location.href = action.target;
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: initialGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        followUps: isFr
          ? ["✈️ Comment trouver des vols pas chers ?", "🏨 Hôtels avec Trip.com", "🛡️ Indemnisation AirHelp jusqu'à 600€", "🌍 Idées de voyage"]
          : ["✈️ How to find cheap flights?", "🏨 Hotels with Trip.com", "🛡️ AirHelp up to €600 compensation", "🌍 Travel ideas"],
      },
    ]);
  };

  // Helper to format bold markdown and clean bullet points
  const renderFormattedContent = (content: string) => {
    return content.split('\n').map((line, idx) => {
      // Bold replacement (**text**)
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-bold text-white">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      return (
        <span key={idx} className="block leading-relaxed">
          {formattedLine}
        </span>
      );
    });
  };

  return (
    <>
      {/* Floating Launcher Button - Compact, Sleek Circular Design */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 select-none">
        {!isOpen && (
          <div className="relative group">
            {/* Hover Tooltip */}
            <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1.5 rounded-xl bg-zinc-900/95 border border-white/15 text-white text-xs font-medium whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none translate-x-2 group-hover:translate-x-0 hidden sm:flex items-center gap-1.5 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#32a8dd]" />
              <span>Assistant Safarihoo</span>
              <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-zinc-900 border-t border-r border-white/15 rotate-45" />
            </div>

            <button
              onClick={() => setIsOpen(true)}
              aria-label="Ouvrir l'Assistant Safarihoo"
              className="relative w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-gradient-to-tr from-[#1b64f2] to-[#32a8dd] text-white shadow-[0_8px_25px_rgba(27,100,242,0.45)] hover:shadow-[0_10px_30px_rgba(50,168,221,0.65)] flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border border-white/25"
            >
              {/* Ambient pulse ring */}
              <span className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-[#1b64f2] to-[#32a8dd] opacity-40 blur-xs group-hover:opacity-80 transition duration-300 animate-pulse -z-10" />

              {/* Bot Icon */}
              <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white transition-transform duration-300 group-hover:rotate-6" />

              {/* Online Green Indicator Dot */}
              <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-zinc-950 shadow-sm" />
            </button>
          </div>
        )}
      </div>

      {/* Slide-in Chat Window */}
      {isOpen && (
        <div 
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2.5rem)] sm:w-[410px] h-[570px] max-h-[82vh] bg-zinc-950/95 border border-white/20 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200"
          role="dialog"
          aria-label="Assistant Safarihoo"
        >
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-[#0d1527] to-[#121829] border-b border-white/10 flex items-center justify-between select-none">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1b64f2] to-[#32a8dd] flex items-center justify-center shadow-md">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-zinc-950" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white tracking-wide">Assistant Safarihoo</h3>
                  <span className="px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider rounded-md bg-[#1b64f2]/30 text-[#60a5fa] border border-[#1b64f2]/40">
                    24/7
                  </span>
                </div>
                <p className="text-[11px] text-white/60">
                  {isFr ? 'Concierge voyage virtuel • En ligne' : 'Virtual travel concierge • Online'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                title={isFr ? 'Réinitialiser la conversation' : 'Reset chat'}
                className="w-8 h-8 rounded-full text-white/60 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title={isFr ? 'Fermer' : 'Close'}
                className="w-8 h-8 rounded-full text-white/60 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-4 py-2 bg-black/30 border-b border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar select-none">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.text)}
                disabled={isLoading}
                className="text-[11px] font-medium text-white/80 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer flex-shrink-0 active:scale-95"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 overscroll-contain">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} gap-1.5`}
              >
                <div
                  className={`flex gap-2.5 max-w-[88%] ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#1b64f2] to-[#32a8dd] flex-shrink-0 flex items-center justify-center text-white mt-0.5 shadow-sm">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`rounded-2xl px-4 py-3 text-xs sm:text-[13px] leading-relaxed shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-[#1b64f2] to-[#2563eb] text-white rounded-tr-xs'
                        : 'bg-zinc-900 border border-white/10 text-white/90 rounded-tl-xs'
                    }`}
                  >
                    <div className="space-y-1">{renderFormattedContent(msg.content)}</div>

                    {/* Action Button inside Assistant Message */}
                    {msg.action && (
                      <div className="mt-3 pt-2.5 border-t border-white/10">
                        <button
                          onClick={() => handleActionClick(msg.action!)}
                          className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#1b64f2] to-[#32a8dd] hover:from-[#1654cc] hover:to-[#2995c7] text-white font-semibold text-xs transition-all shadow-md active:scale-98 cursor-pointer"
                        >
                          <span>{msg.action.label}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <div
                      className={`text-[9px] mt-2 font-mono ${
                        msg.role === 'user' ? 'text-white/60 text-right' : 'text-white/40 text-left'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-xl bg-white/15 flex-shrink-0 flex items-center justify-center text-white mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Follow-up Chips for Assistant */}
                {msg.role === 'assistant' && msg.followUps && msg.followUps.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pl-9 pt-1">
                    {msg.followUps.map((chip, cIdx) => (
                      <button
                        key={cIdx}
                        onClick={() => handleSendMessage(chip)}
                        className="text-[10px] text-white/70 hover:text-white bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-left active:scale-95"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#1b64f2] to-[#32a8dd] flex-shrink-0 flex items-center justify-center text-white mt-0.5 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-zinc-900 border border-white/10 rounded-2xl rounded-tl-xs px-4 py-3 text-xs flex items-center gap-1.5 text-white/60">
                  <span className="w-2 h-2 rounded-full bg-[#32a8dd] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#32a8dd] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#32a8dd] animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="ml-1.5 text-[11px] text-white/60">
                    {isFr ? "L'Assistant prépare votre réponse..." : 'Preparing response...'}
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div className="p-3 bg-zinc-950 border-t border-white/10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  isFr
                    ? "Posez votre question à l'Assistant Safarihoo..."
                    : 'Ask Safarihoo Assistant anything...'
                }
                disabled={isLoading}
                className="flex-1 bg-white/[0.06] border border-white/15 focus:border-[#32a8dd] focus:outline-none rounded-full px-4 py-2.5 text-xs text-white placeholder-white/40 transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                aria-label="Envoyer"
                className="w-9 h-9 rounded-full bg-[#1b64f2] hover:bg-[#1654cc] disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="text-[10px] text-white/40 text-center mt-2 flex items-center justify-center gap-1 select-none">
              <Sparkles className="w-3 h-3 text-[#32a8dd]" />
              <span>Safarihoo Concierge • Réponses instantanées 24/7</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
