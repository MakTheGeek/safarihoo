import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Plane, 
  Hotel, 
  Car, 
  ShieldAlert, 
  RotateCcw, 
  ChevronDown,
  Compass
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface TravelAssistantChatProps {
  onNavigateToTab?: (tab: 'Flights' | 'Hotels' | 'Cars' | 'AirHelp') => void;
}

export const TravelAssistantChat: React.FC<TravelAssistantChatProps> = ({ onNavigateToTab }) => {
  const { language } = useLanguage();
  const isFr = language === 'FR';

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: isFr
        ? "Bonjour ! Je suis votre assistant voyage Safarihoo 🌍. Où souhaitez-vous partir ? Je peux vous aider à dénicher des vols économiques, des hôtels de rêve, ou vous renseigner sur vos droits d'indemnisation AirHelp."
        : "Hello! I am your Safarihoo travel assistant 🌍. Where are you planning to go? I can help you find cheap flights, great hotels, or answer questions regarding AirHelp passenger compensation.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const quickSuggestions = isFr
    ? [
        { label: '✈️ Vols les moins chers', prompt: 'Quelles sont les meilleures astuces pour trouver un vol pas cher ?', tab: 'Flights' as const },
        { label: '🌴 Idées week-end pas cher', prompt: 'Peux-tu me suggérer 3 super destinations dépaysantes et économiques ?' },
        { label: '🛡️ Dédommagement AirHelp', prompt: 'Mon vol est retardé ou annulé, comment fonctionne l’indemnisation jusqu’à 700€ ?', tab: 'AirHelp' as const },
        { label: '🏨 Hôtels & Séjours', prompt: 'Comment dénicher les meilleures promotions d’hôtels sur Safarihoo ?', tab: 'Hotels' as const },
      ]
    : [
        { label: '✈️ Cheap Flights Tips', prompt: 'What are the top tips to find the cheapest flights on Safarihoo?', tab: 'Flights' as const },
        { label: '🌴 Affordable Getaways', prompt: 'Can you suggest 3 great, budget-friendly travel destinations right now?' },
        { label: '🛡️ AirHelp Rights', prompt: 'How does AirHelp compensation work for delayed or cancelled flights?', tab: 'AirHelp' as const },
        { label: '🏨 Hotel Discounts', prompt: 'How do I find the best hotel deals and luxury stays for less?', tab: 'Hotels' as const },
      ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation history for API
      const conversationHistory = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversationHistory,
          language: isFr ? 'fr' : 'en',
        }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const data = await res.json();
      const reply = data.reply || (isFr ? "Désolé, je n'ai pas pu générer de réponse." : "Sorry, I couldn't generate a response.");

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.warn('API error, falling back to local travel guide knowledge:', err);
      // Resilient client-side fallback for static deployments (Netlify Drop, etc.)
      const lower = query.toLowerCase();
      let fallback = isFr
        ? "Excellente question ! Safarihoo compare pour vous des centaines de compagnies aériennes et partenaires hôteliers en temps réel."
        : "Great question! Safarihoo compares hundreds of airlines and hotel partners in real-time.";

      if (lower.includes('vol') || lower.includes('flight') || lower.includes('billet') || lower.includes('avion')) {
        fallback = isFr
          ? "✈️ **Astuces Vols Safarihoo** :\n• Réservez vos billets entre 3 et 6 semaines à l'avance pour le meilleur tarif.\n• Les départs le mardi et mercredi sont généralement plus avantageux.\n• Utilisez notre comparateur en haut de page pour comparer instantanément toutes les compagnies !"
          : "✈️ **Safarihoo Flight Tips**:\n• Book 3 to 6 weeks in advance for the best rates.\n• Flying on Tuesdays or Wednesdays is often significantly cheaper.\n• Use our flight search widget above to compare all major airlines in real-time!";
      } else if (lower.includes('hotel') || lower.includes('hôtel') || lower.includes('logement')) {
        fallback = isFr
          ? "🏨 **Séjours & Hôtels** :\n• Safarihoo agrège les offres Hotellook et partenaires avec annulation gratuite.\n• Filtrez par quartier central ou note d'avis voyageurs supérieure à 8.5/10."
          : "🏨 **Hotels & Stays**:\n• Safarihoo aggregates deals across Hotellook with free cancellation options.\n• Filter for central neighborhoods and guest reviews rated 8.5+.";
      } else if (lower.includes('airhelp') || lower.includes('retard') || lower.includes('delay') || lower.includes('annul') || lower.includes('indemn')) {
        fallback = isFr
          ? "🛡️ **Service AirHelp Inclus** :\n• Si votre vol a plus de 3 heures de retard ou a été annulé, vous avez droit jusqu'à 600€ ou 700$ d'indemnité légale.\n• Notre équipe partenaire s'occupe de la procédure légale sans avance de frais. Cliquez sur l'onglet AirHelp pour tester votre éligibilité !"
          : "🛡️ **Included AirHelp Protection**:\n• Delayed by 3+ hours or cancelled? You may be eligible for up to $700 / €600 compensation.\n• Our partner legal team handles the claim with zero upfront costs. Click the AirHelp tab above to test your flight!";
      } else if (lower.includes('voiture') || lower.includes('car') || lower.includes('location')) {
        fallback = isFr
          ? "🚗 **Location de voitures** :\n• Récupérez votre véhicule directement aux terminaux d'aéroports avec kilométrage illimité et assurances incluses."
          : "🚗 **Car Rentals**:\n• Pick up your rental car directly at airport terminals with unlimited mileage and transparent policies.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: fallback,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: isFr
          ? "Nouvelle discussion prête ! En quoi puis-je vous guider pour votre prochain voyage ?"
          : "New conversation started! How can I assist you with your travels today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Fermer l’assistant Safarihoo' : 'Ouvrir l’assistant voyage Safarihoo'}
          className={`relative group w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 cursor-pointer ${
            isOpen 
              ? 'bg-zinc-800 text-white hover:bg-zinc-700 rotate-90 border border-white/20' 
              : 'bg-gradient-to-tr from-[#1b64f2] to-blue-500 text-white hover:shadow-blue-500/40 hover:scale-110 active:scale-95'
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6 transition-transform" />
          ) : (
            <>
              <Bot className="w-7 h-7" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-zinc-950 rounded-full flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
              </span>
            </>
          )}
        </button>
      </div>

      {/* Chat Window Panel */}
      {isOpen && (
        <div 
          className="fixed bottom-20 right-3 sm:bottom-24 sm:right-6 w-[calc(100vw-1.5rem)] sm:w-[400px] h-[520px] max-h-[calc(100dvh-7rem)] bg-zinc-950/95 backdrop-blur-xl border border-white/15 rounded-3xl shadow-2xl z-40 flex flex-col overflow-hidden text-white animate-fadeIn"
          role="dialog"
          aria-label="Chatbot Assistant Safarihoo"
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10 bg-gradient-to-r from-blue-950/40 via-zinc-900/60 to-zinc-950 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600/25 border border-blue-500/40 text-blue-400 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-blue-400" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white tracking-wide">Safarihoo Concierge</h3>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    AI
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-white/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{isFr ? 'En ligne • Vols, Hôtels & Conseils' : 'Online • Flights, Hotels & Tips'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                title={isFr ? 'Effacer la conversation' : 'Reset chat'}
                className="w-8 h-8 rounded-lg hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick tab shortcuts */}
          {onNavigateToTab && (
            <div className="px-3 py-2 border-b border-white/5 bg-white/[0.02] flex items-center gap-1.5 overflow-x-auto text-[10px] no-scrollbar">
              <button
                onClick={() => onNavigateToTab('Flights')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 hover:bg-blue-600/20 hover:text-blue-300 text-white/70 border border-white/10 transition-colors whitespace-nowrap cursor-pointer"
              >
                <Plane className="w-3 h-3 text-blue-400" />
                <span>{isFr ? 'Vols' : 'Flights'}</span>
              </button>
              <button
                onClick={() => onNavigateToTab('Hotels')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 hover:bg-amber-600/20 hover:text-amber-300 text-white/70 border border-white/10 transition-colors whitespace-nowrap cursor-pointer"
              >
                <Hotel className="w-3 h-3 text-amber-400" />
                <span>{isFr ? 'Hôtels' : 'Hotels'}</span>
              </button>
              <button
                onClick={() => onNavigateToTab('Cars')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 hover:bg-emerald-600/20 hover:text-emerald-300 text-white/70 border border-white/10 transition-colors whitespace-nowrap cursor-pointer"
              >
                <Car className="w-3 h-3 text-emerald-400" />
                <span>{isFr ? 'Voitures' : 'Cars'}</span>
              </button>
              <button
                onClick={() => onNavigateToTab('AirHelp')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 hover:bg-purple-600/20 hover:text-purple-300 text-white/70 border border-white/10 transition-colors whitespace-nowrap cursor-pointer"
              >
                <ShieldAlert className="w-3 h-3 text-purple-400" />
                <span>AirHelp</span>
              </button>
            </div>
          )}

          {/* Messages list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Compass className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
                      isAssistant
                        ? 'bg-white/[0.07] border border-white/10 text-white/90 rounded-tl-sm'
                        : 'bg-[#1b64f2] text-white font-medium rounded-tr-sm shadow-md'
                    }`}
                  >
                    {msg.content}
                    <div
                      className={`text-[9px] mt-1 text-right ${
                        isAssistant ? 'text-white/40' : 'text-white/70'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center flex-shrink-0">
                  <Compass className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-white/[0.07] border border-white/10 text-white/80 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions pills */}
          {messages.length < 4 && (
            <div className="px-3 py-2 border-t border-white/5 bg-white/[0.01] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {quickSuggestions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleSendMessage(item.prompt);
                    if (item.tab && onNavigateToTab) {
                      onNavigateToTab(item.tab);
                    }
                  }}
                  className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-white/75 hover:text-white text-[11px] whitespace-nowrap transition-colors border border-white/10 cursor-pointer flex-shrink-0"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {/* Input Footer */}
          <div className="p-3 border-t border-white/10 bg-zinc-950 flex-shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isFr ? 'Posez une question sur votre voyage...' : 'Ask anything about your trip...'}
                className="flex-1 bg-white/[0.07] border border-white/15 focus:border-[#1b64f2] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none transition-colors"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                aria-label="Envoyer"
                className="w-9 h-9 rounded-xl bg-[#1b64f2] hover:bg-[#1654cc] disabled:opacity-40 disabled:hover:bg-[#1b64f2] text-white flex items-center justify-center transition-all cursor-pointer flex-shrink-0 shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
