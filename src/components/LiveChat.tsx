import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Minimize2, 
  Maximize2, 
  Send, 
  Smile, 
  Paperclip, 
  Users,
  MessageCircle,
  MoreVertical,
  Minus
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: number;
  user: string;
  avatar: string;
  text: string;
  time: string;
  isSelf?: boolean;
}

const mockMessages: Message[] = [
  { id: 1, user: 'Trader_X', avatar: 'https://picsum.photos/seed/1/64', text: 'Alguém viu o volume no Mini Dólar agora?', time: '09:42' },
  { id: 2, user: 'CryptoKing', avatar: 'https://picsum.photos/seed/2/64', text: 'Sim, rompeu a VWAP com agressão forte.', time: '09:43' },
  { id: 3, user: 'Raven Welch', avatar: 'https://picsum.photos/seed/raven/64', text: 'Tô de olho na exaustão perto dos 5.120.', time: '09:44', isSelf: true },
  { id: 4, user: 'Ana_Scale', avatar: 'https://picsum.photos/seed/4/64', text: 'Vendido no índice, alvo em 125.400!', time: '09:45' },
];

export const LiveChat = ({ isPiP, onTogglePiP, onClose }: { isPiP: boolean, onTogglePiP: () => void, onClose?: () => void }) => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isPiP]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage: Message = {
      id: Date.now(),
      user: 'Raven Welch',
      avatar: 'https://picsum.photos/seed/raven/64',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true
    };
    setMessages([...messages, newMessage]);
    setInput('');
  };

  const chatContent = (
    <div className={cn(
      "flex flex-col bg-[#0a0a0c] border border-white/10 overflow-hidden shadow-2xl transition-all duration-300",
      isPiP ? "w-[340px] h-[480px] rounded-2xl fixed bottom-6 right-6 z-50 border-trading-green/20" : "flex-1 rounded-[2rem]"
    )}>
      {/* Header */}
      <div className={cn(
        "p-4 flex items-center justify-between border-b border-white/5",
        isPiP ? "bg-black/80 backdrop-blur-md" : "bg-white/[0.02]"
      )}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-trading-green/20 flex items-center justify-center border border-trading-green/30">
            <MessageCircle className="w-5 h-5 text-trading-green" />
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white leading-none">Chat ao Vivo</h4>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1 h-1 bg-trading-green rounded-full animate-pulse shadow-[0_0_5px_rgba(0,255,157,0.8)]"></div>
              <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-tight">142 online</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={onTogglePiP} className="p-2 text-zinc-500 hover:text-white transition-colors">
            {isPiP ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          {onClose && (
            <button onClick={onClose} className="p-2 text-zinc-500 hover:text-trading-red transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-[radial-gradient(circle_at_bottom_right,rgba(0,255,157,0.02),transparent)]">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex items-start gap-3", msg.isSelf ? "flex-row-reverse" : "")}>
            <img src={msg.avatar} className="w-8 h-8 rounded-lg border border-white/10 shrink-0" referrerPolicy="no-referrer" />
            <div className={cn("flex flex-col max-w-[75%]", msg.isSelf ? "items-end" : "items-start")}>
              <div className="flex items-center gap-2 mb-1 px-1">
                <span className="text-[10px] font-black text-zinc-500">{msg.user}</span>
                <span className="text-[9px] font-black text-zinc-600">{msg.time}</span>
              </div>
              <div className={cn(
                "p-3 rounded-2xl text-xs font-medium leading-relaxed shadow-sm",
                msg.isSelf 
                  ? "bg-trading-green text-black rounded-tr-none" 
                  : "bg-white/5 border border-white/5 text-zinc-300 rounded-tl-none"
              )}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 bg-black/40 border-t border-white/5">
        <div className="relative flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-2 focus-within:border-trading-green/30 transition-colors">
          <button className="p-2 text-zinc-500 hover:text-white transition-colors">
            <Smile className="w-4 h-4" />
          </button>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Sua mensagem..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-xs font-medium text-white placeholder:text-zinc-600"
          />
          <button 
            onClick={handleSend}
            className={cn(
              "p-2 rounded-lg transition-all",
              input.trim() ? "text-trading-green hover:scale-110" : "text-zinc-700"
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  if (isPiP) return chatContent;

  return (
    <div className="flex-1 p-8 h-full flex flex-col max-w-[1200px] mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter">Sala de Trading</h2>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Chat exclusivo em tempo real</p>
        </div>
      </div>
      {chatContent}
    </div>
  );
};
